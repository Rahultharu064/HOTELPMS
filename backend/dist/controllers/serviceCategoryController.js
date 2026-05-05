"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceCategoryController = void 0;
const serviceCategoryService_1 = require("../services/serviceCategoryService");
const ApiResponse_1 = require("../utils/ApiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const constants_1 = require("../constants");
const serviceCategoryService = new serviceCategoryService_1.ServiceCategoryService();
class ServiceCategoryController {
    // Category Endpoints
    getAllCategories = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { search, status } = req.query;
        const categories = await serviceCategoryService.getAllCategories({
            search: search,
            status: status
        });
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Categories retrieved successfully', categories));
    });
    createCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const category = await serviceCategoryService.createCategory(req.body);
        res.status(constants_1.HttpStatus.CREATED).json(ApiResponse_1.ApiResponse.success('Category created successfully', category));
    });
    updateCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const category = await serviceCategoryService.updateCategory(Number(req.params.id), req.body);
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Category updated successfully', category));
    });
    deleteCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        await serviceCategoryService.deleteCategory(Number(req.params.id));
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Category deleted successfully'));
    });
    // Service Endpoints
    getAllServices = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { categoryId, search, status } = req.query;
        const services = await serviceCategoryService.getAllServices({
            categoryId: categoryId ? Number(categoryId) : undefined,
            search: search,
            status: status
        });
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Services retrieved successfully', services));
    });
    getServiceById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const service = await serviceCategoryService.getServiceById(Number(req.params.id));
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Service retrieved successfully', service));
    });
    createService = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const service = await serviceCategoryService.createService(req.body);
        res.status(constants_1.HttpStatus.CREATED).json(ApiResponse_1.ApiResponse.success('Service created successfully', service));
    });
    updateService = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const service = await serviceCategoryService.updateService(Number(req.params.id), req.body);
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Service updated successfully', service));
    });
    deleteService = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        await serviceCategoryService.deleteService(Number(req.params.id));
        res.status(constants_1.HttpStatus.OK).json(ApiResponse_1.ApiResponse.success('Service deleted successfully'));
    });
}
exports.ServiceCategoryController = ServiceCategoryController;
//# sourceMappingURL=serviceCategoryController.js.map