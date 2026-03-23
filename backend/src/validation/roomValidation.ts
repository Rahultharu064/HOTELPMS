import { z } from 'zod';
import { RoomStatusEnum } from '../constants';

export const createRoomSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    roomNumber: z.string().min(1).max(20),
    roomTypeId: z.number().int().positive(),
    floor: z.number().int().min(0).optional(),
    status: z.enum(Object.values(RoomStatusEnum) as [string, ...string[]]).optional(),
    description: z.string().optional(),
    size: z.number().int().positive().optional(),
    bedType: z.enum(['single', 'double', 'queen', 'king', 'twin']).optional(),
    view: z.string().max(100).optional(),
    capacity: z.number().int().min(1).default(2),
    basePrice: z.number().positive(),
  }),
});

export const updateRoomSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    roomNumber: z.string().min(1).max(20).optional(),
    roomTypeId: z.number().int().positive().optional(),
    floor: z.number().int().min(0).optional(),
    status: z.enum(Object.values(RoomStatusEnum) as [string, ...string[]]).optional(),
    description: z.string().optional(),
    size: z.number().int().positive().optional(),
    bedType: z.enum(['single', 'double', 'queen', 'king', 'twin']).optional(),
    view: z.string().max(100).optional(),
    capacity: z.number().int().min(1).optional(),
    basePrice: z.number().positive().optional(),
  }),
});

export const getRoomsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    status: z.enum(Object.values(RoomStatusEnum) as [string, ...string[]]).optional(),
    roomTypeId: z.string().regex(/^\d+$/).transform(Number).optional(),
    minPrice: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional(),
    maxPrice: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional(),
    beds: z.string().regex(/^\d+$/).transform(Number).optional(),
    adults: z.string().regex(/^\d+$/).transform(Number).optional(),
    children: z.string().regex(/^\d+$/).transform(Number).optional(),
    checkIn: z.string().datetime().optional(),
    checkOut: z.string().datetime().optional(),
    sort: z.string().optional(),
  }),
});

export const roomAvailabilitySchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  query: z.object({
    checkIn: z.string().datetime(),
    checkOut: z.string().datetime(),
  }),
});

export const roomImagesSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    images: z.array(z.object({
      url: z.string().url(),
      alt: z.string().optional(),
      isPrimary: z.boolean().optional(),
      sortOrder: z.number().int().min(0).optional(),
    })),
  }),
});

export const roomVideosSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    videos: z.array(z.object({
      url: z.string().url(),
      title: z.string().optional(),
      thumbnail: z.string().url().optional(),
    })),
  }),
});