"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HousekeepingService = void 0;
const database_1 = require("../config/database");
const ApiError_1 = require("../utils/ApiError");
const constants_1 = require("../constants");
class HousekeepingService {
    async getRoomStatuses() {
        // Returns current housekeeping status for all rooms
        return await database_1.prisma.room.findMany({
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
    async updateRoomStatus(data) {
        const room = await database_1.prisma.room.findUnique({ where: { id: data.roomId } });
        if (!room)
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Room not found');
        console.log(`Updating housekeeping for Room ${room.roomNumber} to ${data.status} by ${data.staffId || 'system'}`);
        return await database_1.prisma.$transaction(async (tx) => {
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
    async getLogs(filters) {
        const where = {};
        if (filters.roomId)
            where.roomId = filters.roomId;
        if (filters.staffId)
            where.staffId = filters.staffId;
        if (filters.type)
            where.type = filters.type;
        if (filters.startDate || filters.endDate) {
            where.createdAt = {
                ...(filters.startDate && { gte: filters.startDate }),
                ...(filters.endDate && { lte: filters.endDate }),
            };
        }
        return await database_1.prisma.housekeepingLog.findMany({
            where,
            include: { room: true },
            orderBy: { createdAt: 'desc' },
            take: 100
        });
    }
    async getHousekeepingStats() {
        const rooms = await database_1.prisma.room.findMany({ select: { status: true } });
        const stats = rooms.reduce((acc, room) => {
            acc[room.status] = (acc[room.status] || 0) + 1;
            return acc;
        }, {});
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
        return await database_1.prisma.housekeepingStaff.findMany({
            orderBy: { name: 'asc' }
        });
    }
    async addStaff(data) {
        return await database_1.prisma.housekeepingStaff.create({
            data: {
                ...data,
                status: 'on_duty'
            }
        });
    }
    async updateStaffStatus(id, status) {
        return await database_1.prisma.housekeepingStaff.update({
            where: { id },
            data: { status }
        });
    }
}
exports.HousekeepingService = HousekeepingService;
//# sourceMappingURL=housekeepingService.js.map