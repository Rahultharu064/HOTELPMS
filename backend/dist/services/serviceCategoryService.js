"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceCategoryService = void 0;
const database_1 = require("../config/database");
const ApiError_1 = require("../utils/ApiError");
const constants_1 = require("../constants");
class ServiceCategoryService {
    // Categories (Service Types) CRUD operations
    async getAllCategories(filters) {
        const where = {};
        if (filters.status)
            where.status = filters.status;
        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search } },
                { description: { contains: filters.search } },
            ];
        }
        return await database_1.prisma.serviceCategory.findMany({ where, include: { _count: { select: { services: true } } } });
    }
    async createCategory(data) {
        const existing = await database_1.prisma.serviceCategory.findUnique({ where: { slug: data.slug } });
        if (existing)
            throw new ApiError_1.ApiError(constants_1.HttpStatus.CONFLICT, 'Category slug already exists');
        return await database_1.prisma.serviceCategory.create({ data });
    }
    async updateCategory(id, data) {
        const category = await database_1.prisma.serviceCategory.findUnique({ where: { id } });
        if (!category)
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Category not found');
        return await database_1.prisma.serviceCategory.update({ where: { id }, data });
    }
    async deleteCategory(id) {
        const category = await database_1.prisma.serviceCategory.findUnique({ where: { id }, include: { services: true } });
        if (!category)
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Category not found');
        if (category.services.length > 0)
            throw new ApiError_1.ApiError(constants_1.HttpStatus.BAD_REQUEST, 'Cannot delete category containing services');
        return await database_1.prisma.serviceCategory.delete({ where: { id } });
    }
    // Services CRUD operations
    async getAllServices(filters) {
        const where = {};
        if (filters.categoryId)
            where.categoryId = filters.categoryId;
        if (filters.status)
            where.status = filters.status;
        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search } },
                { description: { contains: filters.search } },
            ];
        }
        return await database_1.prisma.service.findMany({ where, include: { category: true } });
    }
    async getServiceById(id) {
        const service = await database_1.prisma.service.findUnique({ where: { id }, include: { category: true } });
        if (!service)
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Service not found');
        return service;
    }
    async createService(data) {
        const existing = await database_1.prisma.service.findUnique({ where: { slug: data.slug } });
        if (existing)
            throw new ApiError_1.ApiError(constants_1.HttpStatus.CONFLICT, 'Service slug already exists');
        return await database_1.prisma.service.create({ data });
    }
    async updateService(id, data) {
        const service = await database_1.prisma.service.findUnique({ where: { id } });
        if (!service)
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Service not found');
        return await database_1.prisma.service.update({ where: { id }, data });
    }
    async deleteService(id) {
        return await database_1.prisma.service.delete({ where: { id } });
    }
}
exports.ServiceCategoryService = ServiceCategoryService;
//# sourceMappingURL=serviceCategoryService.js.map