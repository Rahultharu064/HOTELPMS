import { prisma } from '../config/database';
import { RoomStatus } from '@prisma/client';
import { ApiError } from '../utils/ApiError';
import { HttpStatus } from '../constants';

export class FrontOfficeService {
  async getDashboardOverview(date: Date = new Date()) {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const [
      arrivalsToday,
      departuresToday,
      stayOversToday,
      pendingServiceOrders,
      roomStatusCounts,
      cancelledToday
    ] = await Promise.all([
      // 1. Arrivals (Check-ins expected today or already done today)
      prisma.booking.count({ 
        where: { 
          checkIn: { gte: startOfDay, lte: endOfDay },
          status: { in: ['confirmed', 'checked_in'] }
        } 
      }),
      // 2. Departures (Expected check-outs today)
      prisma.booking.count({ 
        where: { 
          checkOut: { gte: startOfDay, lte: endOfDay },
          status: { in: ['checked_in', 'checked_out'] }
        } 
      }),
      // 3. Stay Overs (Guests in-house but not checking out today)
      prisma.booking.count({ 
        where: { 
          checkIn: { lt: startOfDay }, 
          checkOut: { gt: endOfDay },
          status: 'checked_in'
        } 
      }),
      // 4. Pending Service Orders
      prisma.serviceOrder.count({ where: { status: 'pending' } }),
      // 5. Room Housekeeping Stats
      prisma.room.groupBy({ by: ['status'], _count: { id: true } }),
      // 6. Recent Revenue Stats (Completed Payments Today)
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
      arrivals: arrivalsToday,
      departures: departuresToday,
      stayOvers: stayOversToday,
      pendingServices: pendingServiceOrders,
      roomStatus: roomsByStatus,
      cancelled: cancelledToday
    };
  }

  async getRoomGrid() {
    // Returns all rooms with their CURRENT reservation link if any
    const today = new Date();
    
    const rooms = await prisma.room.findMany({
      include: {
        roomType: true,
        images: { where: { isPrimary: true }, take: 1 },
        bookings: {
          where: {
            AND: [
                { checkIn: { lte: today } },
                { checkOut: { gte: today } },
                { status: { not: 'cancelled' } }
            ]
          },
          include: { guest: true, payments: true },
          take: 1
        }
      },
      orderBy: { roomNumber: 'asc' }
    });

    return rooms.map(room => ({
        ...room,
        currentBooking: room.bookings[0] || null,
        occupancyStatus: room.bookings.length > 0 ? 'occupied' : 'vacant'
    }));
  }

  async globalSearch(query: string, limit: number = 10) {
    const [guests, bookings, rooms] = await Promise.all([
      prisma.guest.findMany({
        where: {
          OR: [
            { firstName: { contains: query } },
            { lastName: { contains: query } },
            { email: { contains: query } },
            { phone: { contains: query } }
          ]
        },
        take: limit
      }),
      prisma.booking.findMany({
        where: { bookingNumber: { contains: query } },
        include: { guest: true, room: true },
        take: limit
      }),
      prisma.room.findMany({
        where: { roomNumber: { contains: query } },
        include: { roomType: true },
        take: limit
      })
    ]);

    return { guests, bookings, rooms };
  }

  async updateHousekeeping(roomId: number, status: RoomStatus) {
      const room = await prisma.room.findUnique({ where: { id: roomId } });
      if (!room) throw new ApiError(HttpStatus.NOT_FOUND, 'Room not found');

      const updated = await prisma.room.update({
          where: { id: roomId },
          data: { 
              status, 
              // description update if needed or just status change
          }
      });

      // Optionally log audit
      return updated;
  }
}
