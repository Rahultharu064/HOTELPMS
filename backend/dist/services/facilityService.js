"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacilityService = void 0;
const database_1 = require("../config/database");
const ApiError_1 = require("../utils/ApiError");
const constants_1 = require("../constants");
class FacilityService {
    async getAllFacilities(filters) {
        const { page = 1, limit = 10, status, category, search, } = filters;
        const skip = (page - 1) * limit;
        const where = {};
        if (status) {
            where.status = status;
        }
        if (category) {
            where.category = category;
        }
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { description: { contains: search } },
            ];
        }
        const [facilities, total] = await Promise.all([
            database_1.prisma.facility.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    images: {
                        orderBy: { sortOrder: 'asc' },
                    },
                    videos: true,
                    _count: {
                        select: {
                            images: true,
                            videos: true,
                        },
                    },
                },
            }),
            database_1.prisma.facility.count({ where }),
        ]);
        // Enhance facilities with primary image
        const enhancedFacilities = facilities.map(facility => ({
            ...facility,
            primaryImage: facility.images.find(img => img.isPrimary) || facility.images[0],
        }));
        return {
            facilities: enhancedFacilities,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getFacilityById(id) {
        const facility = await database_1.prisma.facility.findUnique({
            where: { id },
            include: {
                images: {
                    orderBy: { sortOrder: 'asc' },
                },
                videos: true,
            },
        });
        if (!facility) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Facility not found');
        }
        return {
            ...facility,
            primaryImage: facility.images.find(img => img.isPrimary) || facility.images[0],
        };
    }
    async createFacility(data) {
        // Check if slug exists
        const existingSlug = await database_1.prisma.facility.findUnique({
            where: { slug: data.slug },
        });
        if (existingSlug) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.CONFLICT, 'Facility slug already exists');
        }
        // Check if name exists
        const existingName = await database_1.prisma.facility.findUnique({
            where: { name: data.name },
        });
        if (existingName) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.CONFLICT, 'Facility name already exists');
        }
        const facility = await database_1.prisma.facility.create({
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description,
                status: data.status,
                openingHours: data.openingHours,
                category: data.category,
                location: data.location,
            },
            include: {
                images: true,
                videos: true,
            },
        });
        return facility;
    }
    async updateFacility(id, data) {
        const facility = await database_1.prisma.facility.findUnique({ where: { id } });
        if (!facility) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Facility not found');
        }
        // Check slug uniqueness if updating
        if (data.slug && data.slug !== facility.slug) {
            const existingSlug = await database_1.prisma.facility.findUnique({
                where: { slug: data.slug },
            });
            if (existingSlug) {
                throw new ApiError_1.ApiError(constants_1.HttpStatus.CONFLICT, 'Facility slug already exists');
            }
        }
        // Check name uniqueness if updating
        if (data.name && data.name !== facility.name) {
            const existingName = await database_1.prisma.facility.findUnique({
                where: { name: data.name },
            });
            if (existingName) {
                throw new ApiError_1.ApiError(constants_1.HttpStatus.CONFLICT, 'Facility name already exists');
            }
        }
        const updatedFacility = await database_1.prisma.facility.update({
            where: { id },
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description,
                status: data.status,
                openingHours: data.openingHours,
                category: data.category,
                location: data.location,
            },
            include: {
                images: true,
                videos: true,
            },
        });
        return updatedFacility;
    }
    async deleteFacility(id) {
        const facility = await database_1.prisma.facility.findUnique({ where: { id } });
        if (!facility) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Facility not found');
        }
        // Delete associated images and videos
        await database_1.prisma.facilityImage.deleteMany({ where: { facilityId: id } });
        await database_1.prisma.facilityVideo.deleteMany({ where: { facilityId: id } });
        await database_1.prisma.facility.delete({ where: { id } });
        return { message: 'Facility deleted successfully' };
    }
    async addFacilityImages(id, images) {
        const facility = await database_1.prisma.facility.findUnique({ where: { id } });
        if (!facility) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Facility not found');
        }
        // If any image is set as primary, remove primary flag from others
        const hasPrimary = images.some(img => img.isPrimary);
        if (hasPrimary) {
            await database_1.prisma.facilityImage.updateMany({
                where: { facilityId: id },
                data: { isPrimary: false },
            });
        }
        const createdImages = await database_1.prisma.facilityImage.createMany({
            data: images.map(img => ({
                ...img,
                facilityId: id,
            })),
        });
        return createdImages;
    }
    async addFacilityVideos(id, videos) {
        const facility = await database_1.prisma.facility.findUnique({ where: { id } });
        if (!facility) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Facility not found');
        }
        const createdVideos = await database_1.prisma.facilityVideo.createMany({
            data: videos.map(video => ({
                ...video,
                facilityId: id,
            })),
        });
        return createdVideos;
    }
    async getFacilityStats() {
        const totalFacilities = await database_1.prisma.facility.count();
        const activeFacilities = await database_1.prisma.facility.count({
            where: { status: 'active' },
        });
        const maintenanceFacilities = await database_1.prisma.facility.count({
            where: { status: 'maintenance' },
        });
        const closedFacilities = await database_1.prisma.facility.count({
            where: { status: 'closed' },
        });
        // Get facility distribution by category
        const categoryDistribution = await database_1.prisma.facility.groupBy({
            by: ['category'],
            _count: {
                category: true,
            },
        });
        return {
            total: totalFacilities,
            active: activeFacilities,
            maintenance: maintenanceFacilities,
            closed: closedFacilities,
            categoryDistribution: categoryDistribution.map(c => ({
                category: c.category,
                count: c._count.category,
            })),
        };
    }
}
exports.FacilityService = FacilityService;
//# sourceMappingURL=facilityService.js.map