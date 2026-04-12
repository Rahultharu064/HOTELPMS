import { prisma } from '../config/database';
import { Prisma, BookingStatus, PaymentMethod, IdType } from '@prisma/client';
import { ApiError } from '../utils/ApiError';
import { HttpStatus } from '../constants';
import fs from 'fs';
import path from 'path';
import { encryptFile, validateBase64Image } from '../utils/security';

interface OfflineReservationData {
  existingGuestId?: number;
  newGuestDetails?: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    idType?: IdType;
    idNumber?: string;
    idProofImage?: string;
  };
  roomId: number;
  checkIn: Date;
  checkOut: Date;
  adults?: number;
  children?: number;
  status?: BookingStatus;
  specialRequests?: string;
  payment?: {
    amount: number;
    method: PaymentMethod;
    transactionId?: string;
  };
}

export class OfflineReservationService {
  async createOfflineReservation(data: OfflineReservationData, userId?: number) {
    // 1. Resolve guest
    let guestId: number;

    if (data.existingGuestId) {
      const guest = await prisma.guest.findUnique({ where: { id: data.existingGuestId } });
      if (!guest) throw new ApiError(HttpStatus.NOT_FOUND, 'Existing guest not found');
      guestId = guest.id;
    } else if (data.newGuestDetails) {
      let idProofImagePath;
      if (data.newGuestDetails.idProofImage) {
        const validation = validateBase64Image(data.newGuestDetails.idProofImage);
        if (validation.isValid && validation.buffer) {
          try {
            const ext = (validation.mimeType?.split('/')[1] || 'jpg').replace('jpeg', 'jpg');
            // Secure document with AES-256-GCM before storage
            const encryptedBuffer = encryptFile(validation.buffer);
            const fileName = `id_proof_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}.enc`;
            const uploadPath = path.join(process.cwd(), 'uploads', fileName);
            fs.writeFileSync(uploadPath, encryptedBuffer);
            idProofImagePath = `/uploads/${fileName}`;
          } catch(err) { 
            console.error('Error encrypting and saving offline id proof:', err);
            throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, 'High-security document processing failed.');
          }
        } else if (data.newGuestDetails.idProofImage) {
           throw new ApiError(HttpStatus.BAD_REQUEST, validation.error || 'Identity document verification failed.');
        }
      }

      // Create guest
      const existingEmail = await prisma.guest.findFirst({
        where: { OR: [{ email: data.newGuestDetails.email }, { phone: data.newGuestDetails.phone }] }
      });
      if (existingEmail) {
        guestId = existingEmail.id;
        if (data.newGuestDetails.idType || data.newGuestDetails.idNumber || idProofImagePath) {
            await prisma.guest.update({
               where: { id: guestId },
               data: {
                  idType: data.newGuestDetails.idType || existingEmail.idType,
                  idNumber: data.newGuestDetails.idNumber || existingEmail.idNumber,
                  idProofImage: idProofImagePath || (existingEmail as any).idProofImage
               }
            });
        }
      } else {
        const { idProofImage, ...restDetails } = data.newGuestDetails;
        const guestData: any = {
           ...restDetails,
           idProofImage: idProofImagePath,
           totalBookings: 0,
           totalSpent: new Prisma.Decimal(0)
        };
        const guest = await prisma.guest.create({
          data: guestData
        });
        guestId = guest.id;
      }
    } else {
        throw new ApiError(HttpStatus.BAD_REQUEST, 'Guest information missing');
    }

    // 2. Validate room
    const room = await prisma.room.findUnique({
      where: { id: data.roomId },
    });

    if (!room) throw new ApiError(HttpStatus.NOT_FOUND, 'Room not found');

    const totalPersons = (data.adults || 1) + (data.children || 0);
    if (room.capacity < totalPersons) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Room capacity exceeded');
    }

    const checkInDate = new Date(data.checkIn);
    const checkOutDate = new Date(data.checkOut);

    // 3. Check room availability
    const conflictingBookings = await prisma.booking.findMany({
      where: {
        roomId: data.roomId,
        status: { not: 'cancelled' },
        AND: [
          { checkIn: { lt: checkOutDate } },
          { checkOut: { gt: checkInDate } },
        ],
      },
    });

    if (conflictingBookings.length > 0) {
      throw new ApiError(HttpStatus.CONFLICT, 'Room is not available for requested dates');
    }

    // 4. Calculate amount
    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalAmount = new Prisma.Decimal(Number(room.basePrice) * nights);

    // 5. Generate booking number
    const bookingNumber = `WALK-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;

    // 6. Transactional creation
    return await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          bookingNumber,
          guestId,
          roomId: data.roomId,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          adults: data.adults || 1,
          children: data.children || 0,
          totalAmount,
          status: data.status || 'confirmed',
          source: 'walk_in',
          specialRequests: data.specialRequests,
        },
        include: { guest: true, room: { include: { roomType: true } } }
      });

      // Update Guest's total bookings and spent
      await tx.guest.update({
        where: { id: guestId },
        data: {
          totalBookings: { increment: 1 },
          totalSpent: { increment: totalAmount }
        }
      });

      // Handle payment
      if (data.payment) {
        await tx.payment.create({
          data: {
            bookingId: booking.id,
            amount: new Prisma.Decimal(data.payment.amount),
            method: data.payment.method,
            status: 'completed',
            transactionId: data.payment.transactionId || `WALK-${Date.now()}`
          }
        });
      }

      // Record logic
      await tx.bookingWorkflowLog.create({
        data: {
          bookingId: booking.id,
          action: 'offline_reservation_created',
          description: `Offline reservation created for walk-in guest. Source: walk_in.`,
          performedBy: userId ? `user_${userId}` : 'frontdesk',
        }
      });

      // Update room status if dates are overlap with today
       const now = new Date();
       const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
       const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

       if (checkInDate < endOfToday && checkOutDate > startOfToday) {
         if (data.status === 'checked_in') {
           await tx.room.update({ where: { id: data.roomId }, data: { status: 'occupied' } });
         } else if (data.status === 'confirmed' || data.status === 'pending') {
           await tx.room.update({ where: { id: data.roomId }, data: { status: 'reserved' } });
         }
       }

       return booking;
    });
  }
}
