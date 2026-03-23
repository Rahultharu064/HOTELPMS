import { prisma } from '../config/database';
import { Prisma, ServiceStatus } from '@prisma/client';
import { ApiError } from '../utils/ApiError';
import { HttpStatus } from '../constants';

export class ServiceCategoryService {
  // Categories (Service Types) CRUD operations
  async getAllCategories(filters: { search?: string; status?: ServiceStatus }) {
    const where: Prisma.ServiceCategoryWhereInput = {};
    if (filters.status) where.status = filters.status;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { description: { contains: filters.search } },
      ];
    }
    return await prisma.serviceCategory.findMany({ where, include: { _count: { select: { services: true } } } });
  }

  async createCategory(data: Prisma.ServiceCategoryCreateInput) {
    const existing = await prisma.serviceCategory.findUnique({ where: { slug: data.slug } });
    if (existing) throw new ApiError(HttpStatus.CONFLICT, 'Category slug already exists');
    return await prisma.serviceCategory.create({ data });
  }

  async updateCategory(id: number, data: Prisma.ServiceCategoryUpdateInput) {
    const category = await prisma.serviceCategory.findUnique({ where: { id } });
    if (!category) throw new ApiError(HttpStatus.NOT_FOUND, 'Category not found');
    return await prisma.serviceCategory.update({ where: { id }, data });
  }

  async deleteCategory(id: number) {
    const category = await prisma.serviceCategory.findUnique({ where: { id }, include: { services: true } });
    if (!category) throw new ApiError(HttpStatus.NOT_FOUND, 'Category not found');
    if (category.services.length > 0) throw new ApiError(HttpStatus.BAD_REQUEST, 'Cannot delete category containing services');
    return await prisma.serviceCategory.delete({ where: { id } });
  }

  // Services CRUD operations
  async getAllServices(filters: { categoryId?: number; search?: string; status?: ServiceStatus }) {
    const where: Prisma.ServiceWhereInput = {};
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.status) where.status = filters.status;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { description: { contains: filters.search } },
      ];
    }
    return await prisma.service.findMany({ where, include: { category: true } });
  }

  async getServiceById(id: number) {
    const service = await prisma.service.findUnique({ where: { id }, include: { category: true } });
    if (!service) throw new ApiError(HttpStatus.NOT_FOUND, 'Service not found');
    return service;
  }

  async createService(data: Prisma.ServiceUncheckedCreateInput) {
    const existing = await prisma.service.findUnique({ where: { slug: data.slug } });
    if (existing) throw new ApiError(HttpStatus.CONFLICT, 'Service slug already exists');
    return await prisma.service.create({ data });
  }

  async updateService(id: number, data: Prisma.ServiceUncheckedUpdateInput) {
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) throw new ApiError(HttpStatus.NOT_FOUND, 'Service not found');
    return await prisma.service.update({ where: { id }, data });
  }

  async deleteService(id: number) {
    return await prisma.service.delete({ where: { id } });
  }
}
