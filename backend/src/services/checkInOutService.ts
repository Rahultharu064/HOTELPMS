import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/ApiError';
import { HttpStatus } from '../constants';

const prisma = new PrismaClient();

export class CheckInOutService {
  /**
   * Complete Check-in Logic
   * Includes: Identity updates, Room status transition, Audit logging, Room swap support
   */
  async checkIn(bookingId: number, guestData?: any, performedBy: string = 'system', newRoomId?: number) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { room: true, guest: true }
    });

    if (!booking) throw new ApiError(HttpStatus.NOT_FOUND, 'Booking not found');
    
    // Idempotency check
    if (booking.status === 'checked_in') {
        return booking;
    }

    if (!['confirmed', 'pending'].includes(booking.status)) {
      throw new ApiError(HttpStatus.BAD_REQUEST, `Cannot check-in booking with status: ${booking.status}`);
    }

    const targetRoomId = newRoomId || booking.roomId;
    const targetRoom = await prisma.room.findUnique({ where: { id: targetRoomId } });

    if (!targetRoom) throw new ApiError(HttpStatus.NOT_FOUND, 'Target room not found');

    // Room Occupancy Check
    if (targetRoom.status === 'occupied') {
        const activeOccupant = await prisma.booking.findFirst({
            where: {
                roomId: targetRoomId,
                status: 'checked_in',
                id: { not: bookingId }
            }
        });

        if (activeOccupant) {
            // If forced, we auto-checkout the previous guest (Real-world PMS shortcut)
            if (guestData?.forceCheckIn) {
                await prisma.booking.update({
                    where: { id: activeOccupant.id },
                    data: { status: 'checked_out' }
                });
            } else {
                throw new ApiError(HttpStatus.CONFLICT, `Room ${targetRoom.roomNumber} is currently occupied by Guest ${activeOccupant.guestId}`);
            }
        }
    }

    // Maintenance / Out of Service check
    if (['maintenance', 'out_of_service'].includes(targetRoom.status)) {
        throw new ApiError(HttpStatus.BAD_REQUEST, `Room ${targetRoom.roomNumber} is currently ${targetRoom.status} and cannot be assigned.`);
    }

    // Cleaning Check
    if (targetRoom.status === 'cleaning' && !guestData?.forceCheckIn) {
        throw new ApiError(HttpStatus.BAD_REQUEST, `Room ${targetRoom.roomNumber} is still being cleaned.`);
    }

    return await prisma.$transaction(async (tx) => {
      // 1. Update Guest Identity if provided
      if (guestData) {
        let idProofPath = booking.guest.idProofImage;
        
        // Handle Base64 image upload if present
        if (guestData.idProofImage && guestData.idProofImage.startsWith('data:image')) {
            try {
                const fs = require('fs');
                const path = require('path');
                const { validateBase64Image } = require('../utils/security');
                
                const validation = validateBase64Image(guestData.idProofImage);
                if (validation.isValid && validation.buffer) {
                    const ext = validation.mimeType?.split('/')[1] || 'png';
                    const fileName = `id_checkin_${bookingId}_${Date.now()}.${ext}`;
                    const uploadPath = path.join(process.cwd(), 'uploads', fileName);
                    
                    if (!fs.existsSync(path.join(process.cwd(), 'uploads'))) {
                        fs.mkdirSync(path.join(process.cwd(), 'uploads'), { recursive: true });
                    }
                    fs.writeFileSync(uploadPath, validation.buffer);
                    idProofPath = `/uploads/${fileName}`;
                }
            } catch (err) {
                console.error("ID Proof Upload Failed:", err);
            }
        }

        await tx.guest.update({
          where: { id: booking.guestId },
          data: {
            idType: guestData.idType || booking.guest.idType,
            idNumber: guestData.idNumber || booking.guest.idNumber,
            idProofImage: idProofPath,
            address: guestData.address || booking.guest.address,
            phone: guestData.phone || booking.guest.phone
          }
        });
      }

      // 2. Handle Room Swap if requested
      if (newRoomId && newRoomId !== booking.roomId) {
          // Log swap
          await tx.bookingWorkflowLog.create({
              data: {
                  bookingId,
                  action: 'ROOM_SWAP',
                  description: `Staff reassigned booking from Room ${booking.room.roomNumber} to ${targetRoom.roomNumber} during check-in`,
                  performedBy
              }
          });
      }

      // 3. Status Transitions
      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: 'checked_in',
          roomId: targetRoomId,
          checkIn: new Date()
        }
      });

      await tx.room.update({
        where: { id: targetRoomId },
        data: { status: 'occupied' }
      });

      // 4. Record Check-in Log
      await tx.bookingWorkflowLog.create({
        data: {
          bookingId,
          action: 'CHECK_IN',
          description: `Guest checked into room ${targetRoom.roomNumber}. Folio activated.`,
          performedBy
        }
      });

      return updatedBooking;
    });
  }

  /**
   * Complete Check-out Logic
   * Includes: Folio balance verification, pending service orders, room cleaning transition
   */
  async checkOut(bookingId: number, performedBy: string = 'system', force: boolean = false, paymentMethod?: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { 
        room: true,
        serviceOrders: { where: { status: { not: 'completed' } } }
      }
    });

    if (!booking) throw new ApiError(HttpStatus.NOT_FOUND, 'Booking not found');
    if (booking.status !== 'checked_in') {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Only checked-in guests can be checked-out');
    }

    // Folio Verification
    const folio = await this.getFolio(bookingId);
    if (folio.balance > 0 && !force) {
        throw new ApiError(HttpStatus.BAD_REQUEST, `Outstanding balance of Rs. ${folio.balance.toLocaleString()} detected.`);
    }

    if (booking.serviceOrders.length > 0 && !force) {
        throw new ApiError(HttpStatus.BAD_REQUEST, 'Pending service orders must be completed or cancelled.');
    }

    return await prisma.$transaction(async (tx) => {
      // 1. Booking Status
      const updated = await tx.booking.update({
        where: { id: bookingId },
        data: { status: 'checked_out' }
      });

      // 2. Room Status -> Cleaning
      await tx.room.update({
        where: { id: booking.roomId },
        data: { status: 'cleaning' }
      });

      // 3. Auto-Settlement Payment if balance remains
      if (folio.balance > 0 && paymentMethod) {
          await tx.payment.create({
              data: {
                  bookingId,
                  amount: folio.balance,
                  method: paymentMethod as any,
                  status: 'completed',
                  paymentData: { note: 'Final settlement at check-out' }
              }
          });
      }

      // 4. Audit
      await tx.bookingWorkflowLog.create({
        data: {
          bookingId,
          action: 'CHECK_OUT',
          description: `Guest checked out from Room ${booking.room.roomNumber}. Folio Balance: ${folio.balance}. Room sent to housekeeping.`,
          performedBy
        }
      });

      return updated;
    });
  }

  async getFolio(bookingId: number) {
      const booking = await prisma.booking.findUnique({
          where: { id: bookingId },
          include: {
              room: { include: { roomType: true } },
              guest: true,
              payments: { where: { status: 'completed' } },
              serviceOrders: {
                  include: { items: { include: { service: true } } }
              },
              extraServices: {
                  include: { extraService: true }
              }
          }
      });

      if (!booking) throw new ApiError(HttpStatus.NOT_FOUND, 'Booking not found');

      // Room Charges (Base amount stored in booking)
      // Note: extraService increments totalAmount, so we need to separate them for the bill
      const extraServicesTotal = booking.extraServices.reduce((sum, s) => sum + Number(s.totalPrice), 0);
      const stayCharges = Number(booking.totalAmount) - extraServicesTotal;
      
      const posServiceCharges = booking.serviceOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
      const totalPayments = booking.payments.reduce((sum, p) => sum + Number(p.amount), 0);

      const totalCharges = Number(booking.totalAmount) + posServiceCharges;
      const balance = totalCharges - totalPayments;

      return {
          bookingNumber: booking.bookingNumber,
          guestName: `${booking.guest.firstName} ${booking.guest.lastName}`,
          roomNumber: booking.room.roomNumber,
          roomType: booking.room.roomType.name,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          stayCharges,
          extraServices: booking.extraServices,
          extraServicesTotal,
          posServiceOrders: booking.serviceOrders,
          posServiceCharges,
          totalCharges,
          totalPayments,
          balance,
          isSettled: balance <= 0,
          paymentHistory: booking.payments
      };
  }

  /**
   * No-Show Logic
   * Releases the room back into inventory
   */
  async markNoShow(bookingId: number, performedBy: string = 'system') {
      const booking = await prisma.booking.findUnique({
          where: { id: bookingId },
          include: { room: true }
      });

      if (!booking || !['confirmed', 'pending'].includes(booking.status)) {
          throw new ApiError(HttpStatus.BAD_REQUEST, 'Only pending arrivals can be marked as No-Show');
      }

      return await prisma.$transaction(async (tx) => {
          const updated = await tx.booking.update({
              where: { id: bookingId },
              data: { status: 'no_show' }
          });

          await tx.room.update({
              where: { id: booking.roomId },
              data: { status: 'available' }
          });

          await tx.bookingWorkflowLog.create({
              data: {
                  bookingId,
                  action: 'NO_SHOW',
                  description: 'Guest failed to arrive. Room released to inventory.',
                  performedBy
              }
          });

          return updated;
      });
  }

  /**
   * Identity Verification Logic
   * Compares provided details with the database record to ensure the guest is 'Real'
   */
  async verifyGuestIdentity(bookingId: number, verificationData: any) {
      const booking = await prisma.booking.findUnique({
          where: { id: bookingId },
          include: { guest: true }
      });

      if (!booking) throw new ApiError(HttpStatus.NOT_FOUND, 'Booking not found');

      const dbGuest = booking.guest;
      const provided = verificationData;

      // Real-world logic: Match based on names and ID number
      const nameMatches = 
        dbGuest.firstName.toLowerCase().trim() === provided.firstName.toLowerCase().trim() &&
        dbGuest.lastName.toLowerCase().trim() === provided.lastName.toLowerCase().trim();
      
      const idMatches = dbGuest.idNumber === provided.idNumber || !dbGuest.idNumber; // Allow if DB has no ID yet

      if (nameMatches && idMatches) {
          return { matched: true, message: 'Identity details match booking records.' };
      } else if (!nameMatches) {
          throw new ApiError(HttpStatus.CONFLICT, 'Guest name does not match the reservation record.');
      } else {
          throw new ApiError(HttpStatus.CONFLICT, 'Identification number does not match our records.');
      }
  }


}
