"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacilityController = void 0;
const facilityService_1 = require("../services/facilityService");
const ApiResponse_1 = require("../utils/ApiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const constants_1 = require("../constants");
const facilityService = new facilityService_1.FacilityService();
class FacilityController {
    getAllFacilities = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { page, limit, status, category, search } = req.query;
        const result = await facilityService.getAllFacilities({
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
            status: status,
            category: category,
            search: search,
        });
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Facilities retrieved successfully', result));
    });
    getFacilityById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const facility = await facilityService.getFacilityById(Number(id));
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Facility retrieved successfully', facility));
    });
    createFacility = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const facility = await facilityService.createFacility(req.body);
        // Emit socket event
        const io = req.app.get('io');
        io.emit('facility-created', facility);
        res.status(constants_1.HttpStatus.CREATED).json(ApiResponse_1.ApiResponse.success('Facility created successfully', facility));
    });
    updateFacility = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const facility = await facilityService.updateFacility(Number(id), req.body);
        // Emit socket event
        const io = req.app.get('io');
        io.emit('facility-updated', facility);
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Facility updated successfully', facility));
    });
    deleteFacility = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const result = await facilityService.deleteFacility(Number(id));
        // Emit socket event
        const io = req.app.get('io');
        io.emit('facility-deleted', { id: Number(id) });
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Facility deleted successfully', result));
    });
    addFacilityImages = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { images } = req.body;
        const result = await facilityService.addFacilityImages(Number(id), images);
        // Emit socket event
        const io = req.app.get('io');
        io.emit('facility-images-added', { facilityId: Number(id), images });
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Facility images added successfully', result));
    });
    addFacilityVideos = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { videos } = req.body;
        const result = await facilityService.addFacilityVideos(Number(id), videos);
        // Emit socket event
        const io = req.app.get('io');
        io.emit('facility-videos-added', { facilityId: Number(id), videos });
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Facility videos added successfully', result));
    });
    getFacilityStats = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const stats = await facilityService.getFacilityStats();
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Facility statistics retrieved successfully', stats));
    });
}
exports.FacilityController = FacilityController;
//# sourceMappingURL=facilityController.js.map