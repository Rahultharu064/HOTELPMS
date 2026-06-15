"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryVenueController = void 0;
const galleryVenueService_1 = require("../services/galleryVenueService");
const ApiResponse_1 = require("../utils/ApiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const index_1 = require("../constants/index");
const galleryVenueService = new galleryVenueService_1.GalleryVenueService();
class GalleryVenueController {
    getActiveVenues = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
        const venues = await galleryVenueService.getActiveVenues();
        res.status(index_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Gallery venues retrieved successfully', venues));
    });
    getAllVenues = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
        const venues = await galleryVenueService.getAllVenues();
        res.status(index_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('All gallery venues retrieved successfully', venues));
    });
    getVenueBySlug = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { slug } = req.params;
        const venue = await galleryVenueService.getVenueBySlug(slug);
        res.status(index_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Gallery venue retrieved successfully', venue));
    });
    getVenueById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const venue = await galleryVenueService.getVenueById(Number(id));
        res.status(index_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Gallery venue retrieved successfully', venue));
    });
    createVenue = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const data = {
            ...req.body,
            image: req.file ? req.file.path : req.body.image,
        };
        const venue = await galleryVenueService.createVenue(data);
        res.status(index_1.HttpStatus.CREATED).json(ApiResponse_1.ApiResponse.success('Gallery venue created successfully', venue));
    });
    updateVenue = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const data = {
            ...req.body,
            ...(req.file ? { image: req.file.path } : {}),
        };
        const venue = await galleryVenueService.updateVenue(Number(id), data);
        res.status(index_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Gallery venue updated successfully', venue));
    });
    deleteVenue = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const result = await galleryVenueService.deleteVenue(Number(id));
        res.status(index_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Gallery venue deleted successfully', result));
    });
}
exports.GalleryVenueController = GalleryVenueController;
//# sourceMappingURL=galleryVenueController.js.map