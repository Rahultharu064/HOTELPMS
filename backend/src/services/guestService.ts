import { prisma } from '../config/database';
import { Prisma } from '@prisma/client';
import { ApiError } from '../utils/ApiError';
import { HttpStatus } from '../constants';

export class GuestService {
  async getAllGuests(filters: {
    page?: number;
    limit?: number;
    search?: string;
    email?: string;
    phone?: string;
    sort?: string;
  }) {
    const {
      page = 1,
      limit = 10,
      search,
      email,
      phone,
      sort = 'name_asc',
    } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.GuestWhereInput = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    if (email) {
      where.email = email;
    }

    if (phone) {
      where.phone = phone;
    }

    let orderBy: Prisma.GuestOrderByWithRelationInput = {};
    switch (sort) {
      case 'name_asc':
        orderBy = { firstName: 'asc', lastName: 'asc' };
        break;
      case 'name_desc':
        orderBy = { firstName: 'desc', lastName: 'desc' };
        break;
      case 'bookings_desc':
        orderBy = { totalBookings: 'desc' };
        break;
      case 'spent_desc':
        orderBy = { totalSpent: 'desc' };
        break;
      default:
        orderBy = { firstName: 'asc', lastName: 'asc' };
    }

    const [guests, total] = await Promise.all([
      prisma.guest.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          bookings: {
            take: 3,
            orderBy: { createdAt: 'desc' },
            include: {
              room: {
                include: {
                  roomType: true,
                },
              },
            },
          },
          _count: {
            select: {
              bookings: true,
            },
          },
        },
      }),
      prisma.guest.count({ where }),
    ]);

    return {
      guests,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getGuestById(id: number) {
    const guest = await prisma.guest.findUnique({
      where: { id },
      include: {
        bookings: {
          orderBy: { createdAt: 'desc' },
          include: {
            room: {
              include: {
                roomType: true,
                images: {
                  where: { isPrimary: true },
                  take: 1,
                },
              },
            },
            payments: true,
          },
        },
      },
    });

    if (!guest) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Guest not found');
    }

    // Calculate additional statistics
    const totalSpent = guest.totalSpent;
    const totalBookings = guest.totalBookings;
    const completedBookings = guest.bookings.filter(
      b => b.status === 'checked_out'
    ).length;
    const cancelledBookings = guest.bookings.filter(
      b => b.status === 'cancelled'
    ).length;
    const activeBookings = guest.bookings.filter(
      b => b.status === 'confirmed' || b.status === 'checked_in'
    ).length;

    // Get last visit date
    const lastVisit = guest.bookings.find(b => b.status === 'checked_out');
    const lastVisitDate = lastVisit?.checkOut || null;

    // Calculate average stay duration
    const avgStayDuration = guest.bookings.length > 0
      ? guest.bookings.reduce((sum, booking) => {
          const nights = Math.ceil(
            (booking.checkOut.getTime() - booking.checkIn.getTime()) / (1000 * 60 * 60 * 24)
          );
          return sum + nights;
        }, 0) / guest.bookings.length
      : 0;

    return {
      ...guest,
      statistics: {
        totalSpent,
        totalBookings,
        completedBookings,
        cancelledBookings,
        activeBookings,
        lastVisitDate,
        avgStayDuration: Math.round(avgStayDuration),
      },
    };
  }

  async createGuest(data: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    idType?: string;
    idNumber?: string;
  }) {
    // Check if email exists
    const existingEmail = await prisma.guest.findUnique({
      where: { email: data.email },
    });

    if (existingEmail) {
      throw new ApiError(HttpStatus.CONFLICT, 'Email already registered');
    }

    // Check if phone exists
    const existingPhone = await prisma.guest.findUnique({
      where: { phone: data.phone },
    });

    if (existingPhone) {
      throw new ApiError(HttpStatus.CONFLICT, 'Phone number already registered');
    }

    const guest = await prisma.guest.create({
      data: {
        email: data.email,
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        city: data.city,
        country: data.country,
        postalCode: data.postalCode,
        idType: data.idType as any,
        idNumber: data.idNumber,
      },
    });

    return guest;
  }

  async updateGuest(
    id: number,
    data: {
      email?: string;
      phone?: string;
      firstName?: string;
      lastName?: string;
      address?: string;
      city?: string;
      country?: string;
      postalCode?: string;
      idType?: string;
      idNumber?: string;
    }
  ) {
    const guest = await prisma.guest.findUnique({ where: { id } });
    if (!guest) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Guest not found');
    }

    // Check email uniqueness if updating
    if (data.email && data.email !== guest.email) {
      const existingEmail = await prisma.guest.findUnique({
        where: { email: data.email },
      });
      if (existingEmail) {
        throw new ApiError(HttpStatus.CONFLICT, 'Email already registered');
      }
    }

    // Check phone uniqueness if updating
    if (data.phone && data.phone !== guest.phone) {
      const existingPhone = await prisma.guest.findUnique({
        where: { phone: data.phone },
      });
      if (existingPhone) {
        throw new ApiError(HttpStatus.CONFLICT, 'Phone number already registered');
      }
    }

    const updatedGuest = await prisma.guest.update({
      where: { id },
      data: {
        email: data.email,
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        city: data.city,
        country: data.country,
        postalCode: data.postalCode,
        idType: data.idType as any,
        idNumber: data.idNumber,
      },
    });

    return updatedGuest;
  }

  async deleteGuest(id: number) {
    const guest = await prisma.guest.findUnique({
      where: { id },
      include: {
        bookings: {
          where: {
            status: { not: 'cancelled' },
          },
        },
      },
    });

    if (!guest) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Guest not found');
    }

    if (guest.bookings.length > 0) {
      throw new ApiError(
        HttpStatus.BAD_REQUEST,
        'Cannot delete guest with active bookings'
      );
    }

    await prisma.guest.delete({ where: { id } });

    return { message: 'Guest deleted successfully' };
  }

  async getGuestBookings(id: number, filters: { page?: number; limit?: number; status?: string }) {
    const guest = await prisma.guest.findUnique({ where: { id } });
    if (!guest) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Guest not found');
    }

    const { page = 1, limit = 10, status } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.BookingWhereInput = { guestId: id };
    if (status) {
      where.status = status as any;
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          room: {
            include: {
              roomType: true,
              images: {
                where: { isPrimary: true },
                take: 1,
              },
            },
          },
          payments: true,
        },
      }),
      prisma.booking.count({ where }),
    ]);

    return {
      bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getGuestStats() {
    const totalGuests = await prisma.guest.count();
    const newGuestsThisMonth = await prisma.guest.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    const totalSpent = await prisma.guest.aggregate({
      _sum: {
        totalSpent: true,
      },
    });

    const avgBookingsPerGuest = await prisma.guest.aggregate({
      _avg: {
        totalBookings: true,
      },
    });

    // Get top 10 guests by total spent
    const topGuests = await prisma.guest.findMany({
      orderBy: { totalSpent: 'desc' },
      take: 10,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        totalSpent: true,
        totalBookings: true,
      },
    });

    // Get guest distribution by country
    const countryDistribution = await prisma.guest.groupBy({
      by: ['country'],
      _count: {
        country: true,
      },
      where: {
        country: { not: null },
      },
    });

    return {
      totalGuests,
      newGuestsThisMonth,
      totalRevenue: totalSpent._sum.totalSpent || 0,
      avgBookingsPerGuest: avgBookingsPerGuest._avg.totalBookings || 0,
      topGuests,
      countryDistribution: countryDistribution.map(c => ({
        country: c.country,
        count: c._count.country,
      })),
    };
  }
}