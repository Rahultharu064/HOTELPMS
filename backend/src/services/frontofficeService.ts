import { PrismaClient, RoomStatus } from '@prisma/client';
import { ApiError } from '../utils/ApiError';
import { HttpStatus } from '../constants';

const prisma = new PrismaClient();

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
        status: { in: ['confirmed', 'pending', 'checked_in'] }
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
        checkOut: { lte: endOfDay },
        status: { in: ['checked_in', 'checked_out'] }
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
}
