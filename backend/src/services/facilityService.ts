import { prisma } from '../config/database';
import { Prisma } from '@prisma/client';
import { ApiError } from '../utils/ApiError';
import { HttpStatus } from '../constants';

export class FacilityService {
  async getAllFacilities(filters: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    search?: string;
  }) {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      search,
    } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.FacilityWhereInput = {};

    if (status) {
      where.status = status as any;
    }

    if (category) {
      where.category = category as any;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [facilities, total] = await Promise.all([
      prisma.facility.findMany({
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
      prisma.facility.count({ where }),
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

  async getFacilityById(id: number) {
    const facility = await prisma.facility.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        videos: true,
      },
    });

    if (!facility) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Facility not found');
    }

    return {
      ...facility,
      primaryImage: facility.images.find(img => img.isPrimary) || facility.images[0],
    };
  }

  async createFacility(data: {
    name: string;
    slug: string;
    description?: string;
    status?: string;
    openingHours?: string;
    category: string;
    location?: string;
  }) {
    // Check if slug exists
    const existingSlug = await prisma.facility.findUnique({
      where: { slug: data.slug },
    });

    if (existingSlug) {
      throw new ApiError(HttpStatus.CONFLICT, 'Facility slug already exists');
    }

    // Check if name exists
    const existingName = await prisma.facility.findUnique({
      where: { name: data.name },
    });

    if (existingName) {
      throw new ApiError(HttpStatus.CONFLICT, 'Facility name already exists');
    }

    const facility = await prisma.facility.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        status: data.status as any,
        openingHours: data.openingHours,
        category: data.category as any,
        location: data.location,
      },
      include: {
        images: true,
        videos: true,
      },
    });

    return facility;
  }

  async updateFacility(
    id: number,
    data: {
      name?: string;
      slug?: string;
      description?: string;
      status?: string;
      openingHours?: string;
      category?: string;
      location?: string;
    }
  ) {
    const facility = await prisma.facility.findUnique({ where: { id } });
    if (!facility) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Facility not found');
    }

    // Check slug uniqueness if updating
    if (data.slug && data.slug !== facility.slug) {
      const existingSlug = await prisma.facility.findUnique({
        where: { slug: data.slug },
      });
      if (existingSlug) {
        throw new ApiError(HttpStatus.CONFLICT, 'Facility slug already exists');
      }
    }

    // Check name uniqueness if updating
    if (data.name && data.name !== facility.name) {
      const existingName = await prisma.facility.findUnique({
        where: { name: data.name },
      });
      if (existingName) {
        throw new ApiError(HttpStatus.CONFLICT, 'Facility name already exists');
      }
    }

    const updatedFacility = await prisma.facility.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        status: data.status as any,
        openingHours: data.openingHours,
        category: data.category as any,
        location: data.location,
      },
      include: {
        images: true,
        videos: true,
      },
    });

    return updatedFacility;
  }

  async deleteFacility(id: number) {
    const facility = await prisma.facility.findUnique({ where: { id } });
    if (!facility) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Facility not found');
    }

    // Delete associated images and videos
    await prisma.facilityImage.deleteMany({ where: { facilityId: id } });
    await prisma.facilityVideo.deleteMany({ where: { facilityId: id } });

    await prisma.facility.delete({ where: { id } });

    return { message: 'Facility deleted successfully' };
  }

  async addFacilityImages(id: number, images: Array<{
    url: string;
    alt?: string;
    isPrimary?: boolean;
    sortOrder?: number;
  }>) {
    const facility = await prisma.facility.findUnique({ where: { id } });
    if (!facility) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Facility not found');
    }

    // If any image is set as primary, remove primary flag from others
    const hasPrimary = images.some(img => img.isPrimary);
    if (hasPrimary) {
      await prisma.facilityImage.updateMany({
        where: { facilityId: id },
        data: { isPrimary: false },
      });
    }

    const createdImages = await prisma.facilityImage.createMany({
      data: images.map(img => ({
        ...img,
        facilityId: id,
      })),
    });

    return createdImages;
  }

  async addFacilityVideos(id: number, videos: Array<{
    url: string;
    title?: string;
    thumbnail?: string;
  }>) {
    const facility = await prisma.facility.findUnique({ where: { id } });
    if (!facility) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Facility not found');
    }

    const createdVideos = await prisma.facilityVideo.createMany({
      data: videos.map(video => ({
        ...video,
        facilityId: id,
      })),
    });

    return createdVideos;
  }

  async getFacilityStats() {
    const totalFacilities = await prisma.facility.count();
    const activeFacilities = await prisma.facility.count({
      where: { status: 'active' },
    });
    const maintenanceFacilities = await prisma.facility.count({
      where: { status: 'maintenance' },
    });
    const closedFacilities = await prisma.facility.count({
      where: { status: 'closed' },
    });

    // Get facility distribution by category
    const categoryDistribution = await prisma.facility.groupBy({
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