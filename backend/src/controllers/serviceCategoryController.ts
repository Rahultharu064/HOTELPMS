import { Request, Response } from 'express';
import { ServiceCategoryService } from '../services/serviceCategoryService';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpStatus } from '../constants';

const serviceCategoryService = new ServiceCategoryService();

export class ServiceCategoryController {
  // Category Endpoints
  getAllCategories = asyncHandler(async (req: Request, res: Response) => {
    const { search, status } = req.query;
    const categories = await serviceCategoryService.getAllCategories({
      search: search as string,
      status: status as any
    });
    res.status(HttpStatus.OK).json(ApiResponse.success('Categories retrieved successfully', categories));
  });

  createCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await serviceCategoryService.createCategory(req.body);
    res.status(HttpStatus.CREATED).json(ApiResponse.success('Category created successfully', category));
  });

  updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await serviceCategoryService.updateCategory(Number(req.params.id), req.body);
    res.status(HttpStatus.OK).json(ApiResponse.success('Category updated successfully', category));
  });

  deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    await serviceCategoryService.deleteCategory(Number(req.params.id));
    res.status(HttpStatus.OK).json(ApiResponse.success('Category deleted successfully'));
  });

  // Service Endpoints
  getAllServices = asyncHandler(async (req: Request, res: Response) => {
    const { categoryId, search, status } = req.query;
    const services = await serviceCategoryService.getAllServices({
      categoryId: categoryId ? Number(categoryId) : undefined,
      search: search as string,
      status: status as any
    });
    res.status(HttpStatus.OK).json(ApiResponse.success('Services retrieved successfully', services));
  });

  getServiceById = asyncHandler(async (req: Request, res: Response) => {
    const service = await serviceCategoryService.getServiceById(Number(req.params.id));
    res.status(HttpStatus.OK).json(ApiResponse.success('Service retrieved successfully', service));
  });

  createService = asyncHandler(async (req: Request, res: Response) => {
    const service = await serviceCategoryService.createService(req.body);
    res.status(HttpStatus.CREATED).json(ApiResponse.success('Service created successfully', service));
  });

  updateService = asyncHandler(async (req: Request, res: Response) => {
    const service = await serviceCategoryService.updateService(Number(req.params.id), req.body);
    res.status(HttpStatus.OK).json(ApiResponse.success('Service updated successfully', service));
  });

  deleteService = asyncHandler(async (req: Request, res: Response) => {
    await serviceCategoryService.deleteService(Number(req.params.id));
    res.status(HttpStatus.OK).json(ApiResponse.success('Service deleted successfully'));
  });
}
