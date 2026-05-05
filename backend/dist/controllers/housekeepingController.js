"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HousekeepingController = void 0;
const housekeepingService_1 = require("../services/housekeepingService");
const ApiResponse_1 = require("../utils/ApiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const constants_1 = require("../constants");
const housekeepingService = new housekeepingService_1.HousekeepingService();
class HousekeepingController {
    getRoomStatuses = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
        const rooms = await housekeepingService.getRoomStatuses();
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Housekeeping status retrieved successfully', rooms));
    });
    updateRoomStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { status, staffId, type, notes } = req.body;
        const result = await housekeepingService.updateRoomStatus({
            roomId: Number(id),
            status: status,
            staffId,
            type: type,
            notes
        });
        // Notify other staff of status change
        const io = req.app.get('io');
        if (io) {
            io.emit('housekeeping-status-updated', result);
        }
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Room housekeeping status updated', result));
    });
    getLogs = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { roomId, staffId, type, startDate, endDate } = req.query;
        const logs = await housekeepingService.getLogs({
            roomId: roomId ? Number(roomId) : undefined,
            staffId: staffId,
            type: type,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined
        });
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Housekeeping logs retrieved successfully', logs));
    });
    getHousekeepingStats = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
        const stats = await housekeepingService.getHousekeepingStats();
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Housekeeping stats retrieved successfully', stats));
    });
    getStaff = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
        const staff = await housekeepingService.getStaff();
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Housekeeping staff retrieved', staff));
    });
    addStaff = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const staff = await housekeepingService.addStaff(req.body);
        res.status(constants_1.HttpStatus.CREATED).json(ApiResponse_1.ApiResponse.success('Staff added successfully', staff));
    });
}
exports.HousekeepingController = HousekeepingController;
//# sourceMappingURL=housekeepingController.js.map