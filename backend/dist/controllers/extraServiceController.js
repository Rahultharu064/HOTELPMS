"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtraServiceController = void 0;
const extraServiceService_1 = require("../services/extraServiceService");
const ApiResponse_1 = require("../utils/ApiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const constants_1 = require("../constants");
const extraServiceService = new extraServiceService_1.ExtraServiceService();
class ExtraServiceController {
    createExtraService = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { name, description, price, categoryId, discountPercentage, discountAllowed } = req.body;
        const image = req.file ? req.file.path : null;
        const service = await extraServiceService.createExtraService({
            name,
            description,
            price,
            categoryId,
            image,
            discountPercentage,
            discountAllowed
        });
        res.status(constants_1.HttpStatus.CREATED).json(ApiResponse_1.ApiResponse.success('Extra service created successfully', service));
    });
    getExtraServices = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const services = await extraServiceService.getExtraServices();
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Extra services retrieved successfully', services));
    });
    updateExtraService = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const image = req.file ? req.file.path : undefined;
        const service = await extraServiceService.updateExtraService(Number(id), {
            ...req.body,
            ...(image && { image })
        });
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Extra service updated successfully', service));
    });
    deleteExtraService = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        await extraServiceService.deleteExtraService(Number(id));
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Extra service deactivated successfully'));
    });
    addExtraServiceToBooking = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const result = await extraServiceService.addExtraServiceToBooking(req.body);
        res.status(constants_1.HttpStatus.CREATED).json(ApiResponse_1.ApiResponse.success('Extra service added to booking', result));
    });
    removeExtraServiceFromBooking = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        await extraServiceService.removeExtraServiceFromBooking(Number(id));
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Extra service removed from booking'));
    });
    getBookingExtraServices = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { bookingId } = req.params;
        const services = await extraServiceService.getBookingExtraServices(Number(bookingId));
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Booking extra services retrieved successfully', services));
    });
}
exports.ExtraServiceController = ExtraServiceController;
//# sourceMappingURL=extraServiceController.js.map