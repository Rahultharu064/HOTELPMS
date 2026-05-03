import { prisma } from '../config/database';
import { Prisma } from '@prisma/client';
import { ApiError } from '../utils/ApiError';
import { HttpStatus } from '../constants';

export class ExtraServiceService {
  async createExtraService(data: {
    name: string;
    description: string;
    price: number;
    categoryId: number;
    image?: string | null;
    discountPercentage?: number;
    discountAllowed?: boolean;
  }) {
    // Validate category exists and is active
    const category = await prisma.serviceCategory.findUnique({
      where: { id: data.categoryId }
    });

    if (!category || category.status !== 'active') {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Invalid or inactive category selected');
    }

    // Check for duplicate name
    const existingService = await prisma.extraService.findFirst({
      where: { name: data.name, active: true }
    });

    if (existingService) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Service with this name already exists');
    }

    return await prisma.extraService.create({
      data: {
        name: data.name,
        description: data.description,
        price: new Prisma.Decimal(data.price),
        categoryId: data.categoryId,
        image: data.image,
        discountPercentage: data.discountPercentage || 0,
        discountAllowed: data.discountAllowed || false,
        active: true
      }
    });
  }

  async getExtraServices() {
    return await prisma.extraService.findMany({
      where: { active: true },
      include: {
        category: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateExtraService(id: number, data: Partial<{
    name: string;
    description: string;
    price: number;
    categoryId: number;
    active: boolean;
    discountPercentage: number;
    discountAllowed: boolean;
    image: string;
  }>) {
    const existing = await prisma.extraService.findUnique({ where: { id } });
    if (!existing) throw new ApiError(HttpStatus.NOT_FOUND, 'Extra service not found');

    if (data.categoryId) {
      const category = await prisma.serviceCategory.findUnique({
        where: { id: data.categoryId }
      });
      if (!category || category.status !== 'active') {
        throw new ApiError(HttpStatus.BAD_REQUEST, 'Invalid or inactive category selected');
      }
    }

    // Explicitly pick allowed fields to prevent Prisma errors from extra fields (like 'id')
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = new Prisma.Decimal(data.price);
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.active !== undefined) updateData.active = data.active;
    if (data.discountPercentage !== undefined) updateData.discountPercentage = data.discountPercentage;
    if (data.discountAllowed !== undefined) updateData.discountAllowed = data.discountAllowed;
    if (data.image !== undefined) updateData.image = data.image;

    return await prisma.extraService.update({
      where: { id },
      data: updateData
    });
  }

  async deleteExtraService(id: number) {
    const existing = await prisma.extraService.findUnique({ where: { id } });
    if (!existing) throw new ApiError(HttpStatus.NOT_FOUND, 'Extra service not found');

    return await prisma.extraService.update({
      where: { id },
      data: { active: false }
    });
  }

  async addExtraServiceToBooking(data: {
    bookingId: number;
    extraServiceId: number;
    quantity: number;
    paymentMethod?: string;
  }) {
    const service = await prisma.extraService.findUnique({
      where: { id: data.extraServiceId }
    });

    if (!service) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Extra service not found');
    }

    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId }
    });
    if (!booking) throw new ApiError(HttpStatus.NOT_FOUND, 'Booking not found');

    // Get service charge percentage from settings (default 10%)
    const serviceChargeSetting = await prisma.appSetting.findUnique({
      where: { key: 'service_charge_percentage' }
    });
    const serviceChargePercentage = serviceChargeSetting ? parseFloat(serviceChargeSetting.value) : 10;

    // Calculate pricing
    const unitPrice = Number(service.price);
    const qty = data.quantity;
    const basePrice = unitPrice * qty;
    
    // Apply discount only if allowed
    const discountAmount = service.discountAllowed 
        ? (basePrice * service.discountPercentage / 100) 
        : 0;
    
    const priceAfterDiscount = basePrice - discountAmount;
    
    // Apply service charge on price after discount
    const serviceChargeAmount = priceAfterDiscount * serviceChargePercentage / 100;
    
    const totalPrice = priceAfterDiscount + serviceChargeAmount;

    return await prisma.$transaction(async (tx) => {
      const bookingExtraService = await tx.bookingExtraService.create({
        data: {
          bookingId: data.bookingId,
          extraServiceId: data.extraServiceId,
          quantity: qty,
          unitPrice: new Prisma.Decimal(unitPrice),
          basePrice: new Prisma.Decimal(basePrice),
          discountAmount: new Prisma.Decimal(discountAmount),
          serviceChargeAmount: new Prisma.Decimal(serviceChargeAmount),
          totalPrice: new Prisma.Decimal(totalPrice)
        },
        include: {
          extraService: {
            include: {
              category: true
            }
          }
        }
      });

      // Update booking total amount
      await tx.booking.update({
        where: { id: data.bookingId },
        data: {
          totalAmount: {
            increment: new Prisma.Decimal(totalPrice)
          }
        }
      });

      if (data.paymentMethod && data.paymentMethod !== 'pay_later') {
        await tx.payment.create({
          data: {
            bookingId: data.bookingId,
            amount: new Prisma.Decimal(totalPrice),
            method: data.paymentMethod as any,
            status: 'completed',
            paymentData: { note: 'Paid for extra service at time of order' }
          }
        });
      }

      return bookingExtraService;
    });
  }

  async removeExtraServiceFromBooking(id: number) {
    const bookingExtraService = await prisma.bookingExtraService.findUnique({
      where: { id }
    });

    if (!bookingExtraService) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Booking extra service not found');
    }

    return await prisma.$transaction([
      prisma.bookingExtraService.delete({
        where: { id }
      }),
      prisma.booking.update({
        where: { id: bookingExtraService.bookingId },
        data: {
          totalAmount: {
            decrement: bookingExtraService.totalPrice
          }
        }
      })
    ]);
  }

  async getBookingExtraServices(bookingId: number) {
    return await prisma.bookingExtraService.findMany({
      where: { bookingId },
      include: {
        extraService: true
      }
    });
  }
}
