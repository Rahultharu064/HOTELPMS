import { prisma } from '../config/database';
import { Prisma, BookingStatus, PaymentMethod } from '@prisma/client';
import { ApiError } from '../utils/ApiError';
import { HttpStatus } from '../constants';
import { v4 as uuidv4 } from 'uuid';

export class BookingService {
  async getAllBookings(filters: {
    page?: number;
    limit?: number;
    status?: BookingStatus;
    guestId?: number;
    roomId?: number;
    startDate?: Date;
    endDate?: Date;
    search?: string;
  }) {
    const {
      page = 1,
      limit = 10,
      status,
      guestId,
      roomId,
      startDate,
      endDate,
      search,
    } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.BookingWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (guestId) {
      where.guestId = guestId;
    }

    if (roomId) {
      where.roomId = roomId;
    }

    if (startDate && endDate) {
      where.OR = [
        {
          checkIn: {
            gte: startDate,
            lte: endDate,
          },
        },
        {
          checkOut: {
            gte: startDate,
            lte: endDate,
          },
        },
        {
          checkIn: { lte: startDate },
          checkOut: { gte: endDate },
        },
      ];
    } else if (startDate) {
      where.checkIn = { gte: startDate };
    } else if (endDate) {
      where.checkOut = { lte: endDate };
    }

    if (search) {
      where.OR = [
        { bookingNumber: { contains: search } },
        { guest: { firstName: { contains: search } } },
        { guest: { lastName: { contains: search } } },
        { guest: { email: { contains: search } } },
        { guest: { phone: { contains: search } } },
      ];
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          guest: true,
          room: {
            include: {
              roomType: true,
            },
          },
          payments: true,
        },
      }),
      prisma.booking.count({ where }),
    ]);

    return {
      bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getBookingById(id: number) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        guest: true,
        room: {
          include: {
            roomType: true,
            images: {
              where: { isPrimary: true },
            },
          },
        },
        payments: true,
        workflowLogs: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!booking) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Booking not found');
    }

    return booking;
  }

  async createBooking(data: {
    guestId: number;
    roomId: number;
    checkIn: Date;
    checkOut: Date;
    adults?: number;
    children?: number;
    status?: BookingStatus;
    source?: any;
    specialRequests?: string;
    payment?: {
      amount: number;
      method: PaymentMethod;
      transactionId?: string;
    };
  }, userId?: number) {
    // Check if guest exists
    const guest = await prisma.guest.findUnique({ where: { id: data.guestId } });
    if (!guest) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Guest not found');
    }

    // Check if room exists and has capacity
    const room = await prisma.room.findUnique({
      where: { id: data.roomId },
      include: { roomType: true },
    });

    if (!room) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Room not found');
    }

    const totalPersons = (data.adults || 1) + (data.children || 0);
    if (room.capacity < totalPersons) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Room capacity exceeded');
    }

    // Check availability
    const conflictingBookings = await prisma.booking.findMany({
      where: {
        roomId: data.roomId,
        status: { not: 'cancelled' },
        AND: [
          { checkIn: { lt: data.checkOut } },
          { checkOut: { gt: data.checkIn } },
        ],
      },
    });

    if (conflictingBookings.length > 0) {
      throw new ApiError(HttpStatus.CONFLICT, 'Room is not available for requested dates');
    }

    // Calculate total amount
    const nights = Math.ceil(
      (data.checkOut.getTime() - data.checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalAmount = Number(room.basePrice) * nights;

    // Generate unique booking number
    const bookingNumber = `BKG-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;

    const booking = await prisma.$transaction(async (tx) => {
      // Create booking
      const newBooking = await tx.booking.create({
        data: {
          bookingNumber,
          guestId: data.guestId,
          roomId: data.roomId,
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          adults: data.adults || 1,
          children: data.children || 0,
          totalAmount,
          status: data.status || 'pending',
          source: data.source || 'direct',
          specialRequests: data.specialRequests,
        },
      });

      // Process payment if provided
      if (data.payment) {
        await tx.payment.create({
          data: {
            bookingId: newBooking.id,
            amount: data.payment.amount,
            method: data.payment.method,
            status: 'completed',
            transactionId: data.payment.transactionId || uuidv4(),
          },
        });
      }

      // Add workflow log
      await tx.bookingWorkflowLog.create({
        data: {
          bookingId: newBooking.id,
          action: 'booking_created',
          description: 'Booking created',
          performedBy: userId ? `user_${userId}` : 'system',
        },
      });

      // Update room status if dates are today
      const today = new Date();
      if (data.checkIn <= today && data.checkOut > today) {
        await tx.room.update({
          where: { id: data.roomId },
          data: { status: 'occupied' }, // or reserved
        });
      }

      return newBooking;
    });

    return await this.getBookingById(booking.id);
  }

  async updateBooking(id: number, data: {
    roomId?: number;
    checkIn?: Date;
    checkOut?: Date;
    adults?: number;
    children?: number;
    specialRequests?: string;
  }, userId?: number) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        room: { include: { roomType: true } },
      },
    });

    if (!booking) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Booking not found');
    }

    // Checking dates/room changes availability
    if (data.roomId || data.checkIn || data.checkOut) {
      const targetRoomId = data.roomId || booking.roomId;
      const targetCheckIn = data.checkIn || booking.checkIn;
      const targetCheckOut = data.checkOut || booking.checkOut;

      const conflictingBookings = await prisma.booking.findMany({
        where: {
          roomId: targetRoomId,
          id: { not: id },
          status: { not: 'cancelled' },
          AND: [
            { checkIn: { lt: targetCheckOut } },
            { checkOut: { gt: targetCheckIn } },
          ],
        },
      });

      if (conflictingBookings.length > 0) {
        throw new ApiError(HttpStatus.CONFLICT, 'Room is not available for requested dates');
      }
    }

    await prisma.$transaction(async (tx) => {
      let totalAmount = booking.totalAmount;
      if (data.roomId || data.checkIn || data.checkOut) {
         const targetRoomId = data.roomId || booking.roomId;
         const targetCheckIn = data.checkIn || booking.checkIn;
         const targetCheckOut = data.checkOut || booking.checkOut;

         const room = await tx.room.findUnique({
           where: { id: targetRoomId },
         });
 
          const nights = Math.ceil(
            (targetCheckOut.getTime() - targetCheckIn.getTime()) / (1000 * 60 * 60 * 24)
          );
          totalAmount = new Prisma.Decimal(Number(room!.basePrice) * nights);
      }

      const res = await tx.booking.update({
        where: { id },
        data: {
          roomId: data.roomId,
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          adults: data.adults,
          children: data.children,
          totalAmount: totalAmount,
          specialRequests: data.specialRequests,
        },
      });

      await tx.bookingWorkflowLog.create({
        data: {
          bookingId: id,
          action: 'booking_updated',
          description: 'Booking details updated',
          performedBy: userId ? `user_${userId}` : 'system',
        },
      });

      return res;
    });

    return await this.getBookingById(id);
  }

  async updateBookingStatus(id: number, status: BookingStatus, userId?: number) {
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Booking not found');
    }

    await prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id },
        data: { status },
      });

      await tx.bookingWorkflowLog.create({
        data: {
          bookingId: id,
          action: 'status_changed',
          description: `Status changed to ${status}`,
          performedBy: userId ? `user_${userId}` : 'system',
        },
      });

      // Update room status based on booking status
      if (status === 'checked_in') {
        await tx.room.update({
          where: { id: booking.roomId },
          data: { status: 'occupied' },
        });
      } else if (status === 'checked_out' || status === 'cancelled') {
        await tx.room.update({
          where: { id: booking.roomId },
          data: { status: 'cleaning' }, // or available depending on logic
        });
      }
    });

    return await this.getBookingById(id);
  }

  async getBookingStatistics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalBookings,
      pendingBookings,
      activeStays,
      todayCheckIns,
      todayCheckOuts,
      revenue,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'pending' } }),
      prisma.booking.count({ where: { status: 'checked_in' } }),
      prisma.booking.count({
        where: {
          checkIn: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.booking.count({
        where: {
          checkOut: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.payment.aggregate({
        where: { status: 'completed' },
        _sum: { amount: true },
      }),
    ]);

    return {
      totalBookings,
      pendingBookings,
      activeStays,
      todayCheckIns,
      todayCheckOuts,
      totalRevenue: revenue._sum.amount || 0,
    };
  }
}
