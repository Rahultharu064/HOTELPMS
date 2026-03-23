import { prisma } from '../config/database';
import { Prisma } from '@prisma/client';
import { ApiError } from '../utils/ApiError';
import { HttpStatus } from '../constants/index';

export class RoomTypeService {
  async getAllRoomTypes(filters: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
  }) {
    const {
      page = 1,
      limit = 10,
      search,
      sort = 'name_asc',
    } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.RoomTypeWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    let orderBy: Prisma.RoomTypeOrderByWithRelationInput = {};
    switch (sort) {
      case 'name_asc':
        orderBy = { name: 'asc' };
        break;
      case 'name_desc':
        orderBy = { name: 'desc' };
        break;
      default:
        orderBy = { name: 'asc' };
    }

    const [roomTypes, total] = await Promise.all([
      prisma.roomType.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          rooms: {
            where: { status: 'available' },
            select: {
              id: true,
              roomNumber: true,
              status: true,
            },
          },
          _count: {
            select: {
              rooms: true,
            },
          },
        },
      }),
      prisma.roomType.count({ where }),
    ]);

    // Calculate statistics for each room type
    const roomTypesWithStats = roomTypes.map(roomType => ({
      ...roomType,
      availableRooms: roomType.rooms.length,
      totalRooms: roomType._count.rooms,
      occupancyRate: roomType._count.rooms > 0
        ? (roomType.rooms.length / roomType._count.rooms) * 100
        : 0,
    }));

    return {
      roomTypes: roomTypesWithStats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getRoomTypeById(id: number) {
    const roomType = await prisma.roomType.findUnique({
      where: { id },
      include: {
        rooms: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
        _count: {
          select: {
            rooms: true,
          },
        },
      },
    });

    if (!roomType) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Room type not found');
    }

    // Calculate statistics
    const availableRooms = roomType.rooms.filter(
      room => room.status === 'available'
    ).length;

    return {
      ...roomType,
      availableRooms,
      occupancyRate: roomType._count.rooms > 0
        ? (availableRooms / roomType._count.rooms) * 100
        : 0,
    };
  }

  async createRoomType(data: {
    name: string;
    image?: string;
    description?: string;
  }) {
    // Check if name exists
    const existingName = await prisma.roomType.findUnique({
      where: { name: data.name },
    });

    if (existingName) {
      throw new ApiError(HttpStatus.CONFLICT, 'Room type name already exists');
    }

    const roomType = await prisma.roomType.create({
      data: {
        name: data.name,
        image: data.image,
        description: data.description,
      },
    });

    return roomType;
  }

  async updateRoomType(
    id: number,
    data: {
      name?: string;
      image?: string;
      description?: string;
    }
  ) {
    const roomType = await prisma.roomType.findUnique({ where: { id } });
    if (!roomType) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Room type not found');
    }

    // Check name uniqueness if updating
    if (data.name && data.name !== roomType.name) {
      const existingName = await prisma.roomType.findUnique({
        where: { name: data.name },
      });
      if (existingName) {
        throw new ApiError(HttpStatus.CONFLICT, 'Room type name already exists');
      }
    }

    const updatedRoomType = await prisma.roomType.update({
      where: { id },
      data: {
        name: data.name,
        image: data.image,
        description: data.description,
      },
      include: {
        rooms: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
      },
    });

    return updatedRoomType;
  }

  async deleteRoomType(id: number) {
    const roomType = await prisma.roomType.findUnique({
      where: { id },
      include: {
        rooms: {
          take: 1,
        },
      },
    });

    if (!roomType) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Room type not found');
    }

    if (roomType.rooms.length > 0) {
      throw new ApiError(
        HttpStatus.BAD_REQUEST,
        'Cannot delete room type with existing rooms'
      );
    }

    await prisma.roomType.delete({
      where: { id },
    });

    return { message: 'Room type deleted successfully' };
  }
}