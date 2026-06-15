"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomTypeController = void 0;
const roomTypeService_1 = require("../services/roomTypeService");
const ApiResponse_1 = require("../utils/ApiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const index_1 = require("../constants/index");
const roomTypeService = new roomTypeService_1.RoomTypeService();
class RoomTypeController {
    getAllRoomTypes = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
        const { page, limit, search, sort } = req.query;
        const result = await roomTypeService.getAllRoomTypes({
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
            search: search,
            sort: sort,
        });
        res.status(index_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Room types retrieved successfully', result));
    });
    getRoomTypeById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const roomType = await roomTypeService.getRoomTypeById(Number(id));
        res.status(index_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Room type retrieved successfully', roomType));
    });
    createRoomType = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        // req.body will contain form-data text fields
        // req.file will contain the uploaded image
        const data = {
            ...req.body,
            image: req.file ? req.file.path : undefined,
        };
        const roomType = await roomTypeService.createRoomType(data);
        // Emit socket event
        const io = req.app.get('io');
        if (io)
            io.emit('room-type-created', roomType);
        res.status(index_1.HttpStatus.CREATED).json(ApiResponse_1.ApiResponse.success('Room type created successfully', roomType));
    });
    updateRoomType = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const data = {
            ...req.body,
            image: req.file ? req.file.path : undefined,
        };
        const roomType = await roomTypeService.updateRoomType(Number(id), data);
        // Emit socket event
        const io = req.app.get('io');
        if (io)
            io.emit('room-type-updated', roomType);
        res.status(index_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Room type updated successfully', roomType));
    });
    deleteRoomType = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const result = await roomTypeService.deleteRoomType(Number(id));
        // Emit socket event
        const io = req.app.get('io');
        if (io)
            io.emit('room-type-deleted', { id: Number(id) });
        res.status(index_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Room type deleted successfully', result));
    });
}
exports.RoomTypeController = RoomTypeController;
//# sourceMappingURL=roomTypeController.js.map