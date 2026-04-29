import { RoomStatus } from '@prisma/client';
import { prisma } from '../config/database';
import { ApiError } from '../utils/ApiError';
import { HttpStatus } from '../constants';

export class FrontOfficeService {
  async getDashboardOverview(date: Date = new Date()) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const [
      arrivalsToday,
      departuresToday,
      stayOvers,
      pendingOrders,
      roomStatusCounts,
      revenueToday,
      cancelledToday
    ] = await Promise.all([
      // 1. Arrivals (Check-ins expected today or already done today)
      prisma.booking.count({
        where: {
          checkIn: { lte: endOfDay },
          status: { in: ['confirmed', 'pending', 'checked_in'] }
        }
      }),
      // 2. Departures
      prisma.booking.count({
        where: {
          checkOut: { lte: endOfDay },
          status: { in: ['checked_in', 'checked_out'] }
        }
      }),
      // 3. Stay Overs
      prisma.booking.count({
        where: {
          checkIn: { lt: startOfDay },
          checkOut: { gt: endOfDay },
          status: 'checked_in'
        }
      }),
      // 4. Pending Service Orders
      prisma.serviceOrder.count({ where: { status: 'pending' } }),
      // 5. Rooms By Status
      prisma.room.groupBy({ by: ['status'], _count: { id: true } }),
      // 6. Recent Revenue Stats
      prisma.payment.aggregate({
        where: { createdAt: { gte: startOfDay, lte: endOfDay }, status: 'completed' },
        _sum: { amount: true }
      }),
      // 7. Cancellations Today
      prisma.booking.count({ where: { updatedAt: { gte: startOfDay, lte: endOfDay }, status: 'cancelled' } })
    ]);

    const roomsByStatus = roomStatusCounts.reduce((acc, curr) => {
      acc[curr.status] = curr._count.id;
      return acc;
    }, {} as Record<string, number>);

    return {
      overview: {
        arrivalsToday,
        departuresToday,
        stayOvers,
        pendingOrders,
        revenueToday: Number(revenueToday._sum.amount || 0),
        cancelledToday
      },
      inventory: roomsByStatus
    };
  }

  async getRoomGrid() {
    const today = new Date();

    const rooms = await prisma.room.findMany({
      include: {
        roomType: true,
        bookings: {
          where: {
            AND: [
              { checkIn: { lte: today } },
              { checkOut: { gte: today } },
              { status: { not: 'cancelled' } }
            ]
          },
          include: { guest: true, payments: true },
        }
      },
      orderBy: { roomNumber: 'asc' }
    });

    return rooms.map(room => {
        const currentBooking = room.bookings[0] || null;
        let occupancyStatus = 'vacant';
        
        if (currentBooking) {
            if (currentBooking.status === 'checked_in') {
                occupancyStatus = 'occupied';
            } else if (['confirmed', 'pending'].includes(currentBooking.status)) {
                occupancyStatus = 'reserved';
            }
        } else if (room.status === 'cleaning') {
             occupancyStatus = 'cleaning';
        } else if (room.status === 'maintenance' || room.status === 'out_of_service') {
             occupancyStatus = 'maintenance';
        }

        return {
            ...room,
            currentBooking,
            occupancyStatus
        };
    });
  }

  async globalSearch(query: string, limit: number = 10) {
    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { bookingNumber: { contains: query } },
          { guest: { firstName: { contains: query } } },
          { guest: { lastName: { contains: query } } },
          { room: { roomNumber: { contains: query } } }
        ]
      },
      include: { guest: true, room: { include: { roomType: true } } },
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    const guests = await prisma.guest.findMany({
      where: {
        OR: [
          { firstName: { contains: query } },
          { lastName: { contains: query } },
          { email: { contains: query } },
          { phone: { contains: query } }
        ]
      },
      take: limit
    });

    return { bookings, guests };
  }

  async updateHousekeeping(roomId: number, status: RoomStatus) {
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) throw new ApiError(HttpStatus.NOT_FOUND, 'Room not found');

    return await prisma.room.update({
      where: { id: roomId },
      data: { status }
    });
  }

  async getTodayArrivals() {
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return await prisma.booking.findMany({
      where: {
        checkIn: { lte: endOfDay },
        status: { in: ['confirmed', 'pending'] }
      },
      include: {
        guest: true,
        room: { include: { roomType: true } }
      },
      orderBy: { checkIn: 'asc' }
    });
  }

  async getTodayDepartures() {
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return await prisma.booking.findMany({
      where: {
        OR: [
          { status: 'checked_in' },
          { 
            status: 'checked_out',
            checkOut: { lte: endOfDay }
          }
        ]
      },
      include: {
        guest: true,
        room: { include: { roomType: true } }
      },
      orderBy: { checkOut: 'asc' }
    });
  }

  async getAlternativeRooms(bookingId: number) {
      const booking = await prisma.booking.findUnique({
          where: { id: bookingId },
          include: { room: true }
      });
      if (!booking) throw new ApiError(HttpStatus.NOT_FOUND, 'Booking not found');

      const rooms = await prisma.room.findMany({
          where: {
              roomTypeId: booking.room.roomTypeId,
              id: { not: booking.roomId },
              status: { in: ['available', 'cleaning'] }
          },
          include: { roomType: true }
      });

      const results = await Promise.all(rooms.map(async (room) => {
          const conflict = await prisma.booking.findFirst({
              where: {
                  roomId: room.id,
                  status: { in: ['confirmed', 'checked_in'] },
                  AND: [
                      { checkIn: { lt: booking.checkOut } },
                      { checkOut: { gt: booking.checkIn } }
                  ]
              }
          });
          return conflict ? null : room;
      }));

      return results.filter(r => r !== null);
  }

  async getGuestActiveBookings(guestId: number, currentBookingId: number) {
      return await prisma.booking.findMany({
          where: {
              guestId,
              id: { not: currentBookingId },
              status: { in: ['confirmed', 'pending', 'checked_in'] }
          },
          include: {
              room: { include: { roomType: true } }
          },
          orderBy: { checkIn: 'desc' }
      });
  }

  async getFolio(bookingId: number) {
    if (!bookingId || isNaN(bookingId)) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Invalid booking ID');
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        guest: true,
        room: { include: { roomType: true } },
        payments: true,
        serviceOrders: {
          include: { items: { include: { service: true } } }
        }
      }
    });

    if (!booking) throw new ApiError(HttpStatus.NOT_FOUND, 'Booking not found');

    // Calculate Charges
    const charges: any[] = [];
    
    // 1. Room Charge
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    
    let nights = 1;
    if (!isNaN(checkIn.getTime()) && !isNaN(checkOut.getTime())) {
      nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
    }
    
    charges.push({
      date: booking.checkIn,
      description: `Room Charge (${nights} Nights)`,
      category: 'accommodation',
      amount: Number(booking.totalAmount || 0)
    });

    // 2. Service Orders
    if (booking.serviceOrders && Array.isArray(booking.serviceOrders)) {
      booking.serviceOrders.forEach(order => {
        charges.push({
          date: order.createdAt,
          description: `Service Order: ${order.orderNumber}`,
          category: 'service',
          amount: Number(order.totalAmount || 0)
        });
      });
    }

    const totalPaid = booking.payments
      ? booking.payments
          .filter(p => p.status === 'completed')
          .reduce((sum, p) => sum + Number(p.amount || 0), 0)
      : 0;

    return {
      booking,
      charges,
      paymentsSummary: {
        totalPaid,
        pendingPayments: booking.payments ? booking.payments.filter(p => p.status === 'pending').length : 0
      }
    };
  }
}
