import { prisma } from '../config/database';
import { Prisma, VenueLayout } from '@prisma/client';
import { ApiError } from '../utils/ApiError';
import { HttpStatus } from '../constants/index';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export class GalleryVenueService {
  async getActiveVenues() {
    return prisma.galleryVenue.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async getAllVenues() {
    return prisma.galleryVenue.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async getVenueById(id: number) {
    const venue = await prisma.galleryVenue.findUnique({ where: { id } });
    if (!venue) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Gallery venue not found');
    }
    return venue;
  }

  async getVenueBySlug(slug: string) {
    const venue = await prisma.galleryVenue.findUnique({ where: { slug } });
    if (!venue || !venue.isActive) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Gallery venue not found');
    }
    return venue;
  }

  async createVenue(data: {
    title: string;
    slug?: string;
    description: string;
    image?: string;
    icon?: string;
    layout?: VenueLayout;
    sortOrder?: number;
    isActive?: boolean;
  }) {
    const slug = data.slug ? slugify(data.slug) : slugify(data.title);

    const existingSlug = await prisma.galleryVenue.findUnique({ where: { slug } });
    if (existingSlug) {
      throw new ApiError(HttpStatus.CONFLICT, 'A venue with this slug already exists');
    }

    if (data.layout === 'featured') {
      await this.ensureSingleFeatured(null);
    }

    if (!data.image) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Venue image is required');
    }

    return prisma.galleryVenue.create({
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

  async updateVenue(
    id: number,
    data: {
      title?: string;
      slug?: string;
      description?: string;
      image?: string;
      icon?: string;
      layout?: VenueLayout;
      sortOrder?: number;
      isActive?: boolean;
    }
  ) {
    const venue = await prisma.galleryVenue.findUnique({ where: { id } });
    if (!venue) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Gallery venue not found');
    }

    let slug = data.slug ? slugify(data.slug) : undefined;
    if (slug && slug !== venue.slug) {
      const existingSlug = await prisma.galleryVenue.findUnique({ where: { slug } });
      if (existingSlug) {
        throw new ApiError(HttpStatus.CONFLICT, 'A venue with this slug already exists');
      }
    }

    if (data.layout === 'featured') {
      await this.ensureSingleFeatured(id);
    }

    return prisma.galleryVenue.update({
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

  async deleteVenue(id: number) {
    const venue = await prisma.galleryVenue.findUnique({ where: { id } });
    if (!venue) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Gallery venue not found');
    }

    await prisma.galleryVenue.delete({ where: { id } });
    return { message: 'Gallery venue deleted successfully' };
  }

  private async ensureSingleFeatured(excludeId: number | null) {
    const where: Prisma.GalleryVenueWhereInput = { layout: 'featured' };
    if (excludeId) {
      where.id = { not: excludeId };
    }

    await prisma.galleryVenue.updateMany({
      where,
      data: { layout: 'compact' },
    });
  }
}
