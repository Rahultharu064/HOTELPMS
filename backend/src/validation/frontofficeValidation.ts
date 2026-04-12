import { z } from 'zod';

export const dashboardOverviewSchema = z.object({
  query: z.object({
    date: z.string().optional(),
  }),
});

export const frontOfficeSearchSchema = z.object({
  query: z.object({
    query: z.string().min(1),
    limit: z.string().transform(Number).optional(),
  }),
});

export const updateRoomHousekeepingSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    status: z.enum(['available', 'occupied', 'cleaning', 'maintenance', 'out_of_service']),
  }),
});

export const checkInSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    guestData: z.object({
      idType: z.string().optional(),
      idNumber: z.string().optional(),
      idProofImage: z.string().optional(),
      forceCheckIn: z.boolean().optional(),
      address: z.string().optional(),
      phone: z.string().optional()
    }).optional(),
    newRoomId: z.number().optional()
  })
});

export const checkOutSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    force: z.boolean().optional()
  })
});
