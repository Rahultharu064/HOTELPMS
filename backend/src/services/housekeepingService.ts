import { prisma } from '../config/database';
import { Prisma, RoomStatus, HousekeepingType } from '@prisma/client';
import { ApiError } from '../utils/ApiError';
import { HttpStatus } from '../constants';

export class HousekeepingService {
  async getRoomStatuses() {
    // Returns current housekeeping status for all rooms
    return await prisma.room.findMany({
      select: {
          id: true,
          roomNumber: true,
          name: true,
          status: true,
          floor: true,
          housekeepingLogs: {
              orderBy: { createdAt: 'desc' },
              take: 1
          }
      },
      orderBy: { floor: 'asc' }
    });
  }

  async updateRoomStatus(data: {
      roomId: number;
      status: RoomStatus;
      staffId?: string;
      type: HousekeepingType;
      notes?: string;
  }) {
      const room = await prisma.room.findUnique({ where: { id: data.roomId } });
      if (!room) throw new ApiError(HttpStatus.NOT_FOUND, 'Room not found');

      console.log(`Updating housekeeping for Room ${room.roomNumber} to ${data.status} by ${data.staffId || 'system'}`);

      return await prisma.$transaction(async (tx) => {
          // 1. Update room status
          const updatedRoom = await tx.room.update({
              where: { id: data.roomId },
              data: { status: data.status }
          });

          // 2. Create history log
          const log = await tx.housekeepingLog.create({
              data: {
                  roomId: data.roomId,
                  staffId: data.staffId || null,
                  type: data.type || 'general',
                  status: String(data.status), // Ensure string for varchar field
                  notes: data.notes || `Room status updated to ${data.status}`
              }
          });

          return { room: updatedRoom, log };
      }, {
          timeout: 10000 // 10s timeout for stability
      });

  }

  async getLogs(filters: {
      roomId?: number;
      staffId?: string;
      type?: HousekeepingType;
      startDate?: Date;
      endDate?: Date;
  }) {
      const where: Prisma.HousekeepingLogWhereInput = {};
      if (filters.roomId) where.roomId = filters.roomId;
      if (filters.staffId) where.staffId = filters.staffId;
      if (filters.type) where.type = filters.type;
      if (filters.startDate || filters.endDate) {
          where.createdAt = {
              ...(filters.startDate && { gte: filters.startDate }),
              ...(filters.endDate && { lte: filters.endDate }),
          };
      }

      return await prisma.housekeepingLog.findMany({
          where,
          include: { room: true },
          orderBy: { createdAt: 'desc' },
          take: 100
      });
  }

  async getHousekeepingStats() {
      const rooms = await prisma.room.findMany({ select: { status: true } });
      const stats = rooms.reduce((acc, room) => {
          acc[room.status] = (acc[room.status] || 0) + 1;
          return acc;
      }, {} as Record<string, number>);

      return {
          total: rooms.length,
          available: stats['available'] || 0,
          cleaning: stats['cleaning'] || 0,
          maintenance: stats['maintenance'] || 0,
          occupied: stats['occupied'] || 0,
          dirty: stats['cleaning'] || 0, // In this model 'cleaning' represents dirty/dirtying
      };
  }

  // Staff Management
  async getStaff() {
      return await prisma.housekeepingStaff.findMany({
          orderBy: { name: 'asc' }
      });
  }

  async addStaff(data: {
      staffId: string;
      name: string;
      role?: string;
      phone?: string;
  }) {
      return await prisma.housekeepingStaff.create({
          data: {
              ...data,
              status: 'on_duty'
          }
      });
  }

  async updateStaffStatus(id: number, status: string) {
      return await prisma.housekeepingStaff.update({
          where: { id },
          data: { status }
      });
  }
}

