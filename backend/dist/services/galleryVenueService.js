"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryVenueService = void 0;
const database_1 = require("../config/database");
const ApiError_1 = require("../utils/ApiError");
const index_1 = require("../constants/index");
const slugify = (value) => value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
class GalleryVenueService {
    async getActiveVenues() {
        return database_1.prisma.galleryVenue.findMany({
            where: { isActive: true },
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
        });
    }
    async getAllVenues() {
        return database_1.prisma.galleryVenue.findMany({
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
        });
    }
    async getVenueById(id) {
        const venue = await database_1.prisma.galleryVenue.findUnique({ where: { id } });
        if (!venue) {
            throw new ApiError_1.ApiError(index_1.HttpStatus.NOT_FOUND, 'Gallery venue not found');
        }
        return venue;
    }
    async getVenueBySlug(slug) {
        const venue = await database_1.prisma.galleryVenue.findUnique({ where: { slug } });
        if (!venue || !venue.isActive) {
            throw new ApiError_1.ApiError(index_1.HttpStatus.NOT_FOUND, 'Gallery venue not found');
        }
        return venue;
    }
    async createVenue(data) {
        const slug = data.slug ? slugify(data.slug) : slugify(data.title);
        const existingSlug = await database_1.prisma.galleryVenue.findUnique({ where: { slug } });
        if (existingSlug) {
            throw new ApiError_1.ApiError(index_1.HttpStatus.CONFLICT, 'A venue with this slug already exists');
        }
        if (data.layout === 'featured') {
            await this.ensureSingleFeatured(null);
        }
        if (!data.image) {
            throw new ApiError_1.ApiError(index_1.HttpStatus.BAD_REQUEST, 'Venue image is required');
        }
        return database_1.prisma.galleryVenue.create({
            data: {
                title: data.title,
                slug,
                description: data.description,
                image: data.image || '',
                icon: data.icon || 'UtensilsCrossed',
                layout: data.layout || 'compact',
                sortOrder: data.sortOrder ?? 0,
                isActive: data.isActive ?? true,
            },
        });
    }
    async updateVenue(id, data) {
        const venue = await database_1.prisma.galleryVenue.findUnique({ where: { id } });
        if (!venue) {
            throw new ApiError_1.ApiError(index_1.HttpStatus.NOT_FOUND, 'Gallery venue not found');
        }
        let slug = data.slug ? slugify(data.slug) : undefined;
        if (slug && slug !== venue.slug) {
            const existingSlug = await database_1.prisma.galleryVenue.findUnique({ where: { slug } });
            if (existingSlug) {
                throw new ApiError_1.ApiError(index_1.HttpStatus.CONFLICT, 'A venue with this slug already exists');
            }
        }
        if (data.layout === 'featured') {
            await this.ensureSingleFeatured(id);
        }
        return database_1.prisma.galleryVenue.update({
            where: { id },
            data: {
                title: data.title,
                slug,
                description: data.description,
                image: data.image,
                icon: data.icon,
                layout: data.layout,
                sortOrder: data.sortOrder,
                isActive: data.isActive,
            },
        });
    }
    async deleteVenue(id) {
        const venue = await database_1.prisma.galleryVenue.findUnique({ where: { id } });
        if (!venue) {
            throw new ApiError_1.ApiError(index_1.HttpStatus.NOT_FOUND, 'Gallery venue not found');
        }
        await database_1.prisma.galleryVenue.delete({ where: { id } });
        return { message: 'Gallery venue deleted successfully' };
    }
    async ensureSingleFeatured(excludeId) {
        const where = { layout: 'featured' };
        if (excludeId) {
            where.id = { not: excludeId };
        }
        await database_1.prisma.galleryVenue.updateMany({
            where,
            data: { layout: 'compact' },
        });
    }
}
exports.GalleryVenueService = GalleryVenueService;
//# sourceMappingURL=galleryVenueService.js.map