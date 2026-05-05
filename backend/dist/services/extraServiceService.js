"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtraServiceService = void 0;
const database_1 = require("../config/database");
const client_1 = require("@prisma/client");
const ApiError_1 = require("../utils/ApiError");
const constants_1 = require("../constants");
class ExtraServiceService {
    async createExtraService(data) {
        // Validate category exists and is active
        const category = await database_1.prisma.serviceCategory.findUnique({
            where: { id: data.categoryId }
        });
        if (!category || category.status !== 'active') {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.BAD_REQUEST, 'Invalid or inactive category selected');
        }
        // Check for duplicate name
        const existingService = await database_1.prisma.extraService.findFirst({
            where: { name: data.name, active: true }
        });
        if (existingService) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.BAD_REQUEST, 'Service with this name already exists');
        }
        return await database_1.prisma.extraService.create({
            data: {
                name: data.name,
                description: data.description,
                price: new client_1.Prisma.Decimal(data.price),
                categoryId: data.categoryId,
                image: data.image,
                discountPercentage: data.discountPercentage || 0,
                discountAllowed: data.discountAllowed || false,
                active: true
            }
        });
    }
    async getExtraServices() {
        return await database_1.prisma.extraService.findMany({
            where: { active: true },
            include: {
                category: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async updateExtraService(id, data) {
        const existing = await database_1.prisma.extraService.findUnique({ where: { id } });
        if (!existing)
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Extra service not found');
        if (data.categoryId) {
            const category = await database_1.prisma.serviceCategory.findUnique({
                where: { id: data.categoryId }
            });
            if (!category || category.status !== 'active') {
                throw new ApiError_1.ApiError(constants_1.HttpStatus.BAD_REQUEST, 'Invalid or inactive category selected');
            }
        }
        // Explicitly pick allowed fields to prevent Prisma errors from extra fields (like 'id')
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.description !== undefined)
            updateData.description = data.description;
        if (data.price !== undefined)
            updateData.price = new client_1.Prisma.Decimal(data.price);
        if (data.categoryId !== undefined)
            updateData.categoryId = data.categoryId;
        if (data.active !== undefined)
            updateData.active = data.active;
        if (data.discountPercentage !== undefined)
            updateData.discountPercentage = data.discountPercentage;
        if (data.discountAllowed !== undefined)
            updateData.discountAllowed = data.discountAllowed;
        if (data.image !== undefined)
            updateData.image = data.image;
        return await database_1.prisma.extraService.update({
            where: { id },
            data: updateData
        });
    }
    async deleteExtraService(id) {
        const existing = await database_1.prisma.extraService.findUnique({ where: { id } });
        if (!existing)
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Extra service not found');
        return await database_1.prisma.extraService.update({
            where: { id },
            data: { active: false }
        });
    }
    async addExtraServiceToBooking(data) {
        const service = await database_1.prisma.extraService.findUnique({
            where: { id: data.extraServiceId }
        });
        if (!service) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Extra service not found');
        }
        const booking = await database_1.prisma.booking.findUnique({
            where: { id: data.bookingId }
        });
        if (!booking)
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Booking not found');
        // Get service charge percentage from settings (default 10%)
        const serviceChargeSetting = await database_1.prisma.appSetting.findUnique({
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
        return await database_1.prisma.$transaction(async (tx) => {
            const bookingExtraService = await tx.bookingExtraService.create({
                data: {
                    bookingId: data.bookingId,
                    extraServiceId: data.extraServiceId,
                    quantity: qty,
                    unitPrice: new client_1.Prisma.Decimal(unitPrice),
                    basePrice: new client_1.Prisma.Decimal(basePrice),
                    discountAmount: new client_1.Prisma.Decimal(discountAmount),
                    serviceChargeAmount: new client_1.Prisma.Decimal(serviceChargeAmount),
                    totalPrice: new client_1.Prisma.Decimal(totalPrice)
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
                        increment: new client_1.Prisma.Decimal(totalPrice)
                    }
                }
            });
            if (data.paymentMethod && data.paymentMethod !== 'pay_later') {
                await tx.payment.create({
                    data: {
                        bookingId: data.bookingId,
                        amount: new client_1.Prisma.Decimal(totalPrice),
                        method: data.paymentMethod,
                        status: 'completed',
                        paymentData: { note: 'Paid for extra service at time of order' }
                    }
                });
            }
            return bookingExtraService;
        });
    }
    async removeExtraServiceFromBooking(id) {
        const bookingExtraService = await database_1.prisma.bookingExtraService.findUnique({
            where: { id }
        });
        if (!bookingExtraService) {
            throw new ApiError_1.ApiError(constants_1.HttpStatus.NOT_FOUND, 'Booking extra service not found');
        }
        return await database_1.prisma.$transaction([
            database_1.prisma.bookingExtraService.delete({
                where: { id }
            }),
            database_1.prisma.booking.update({
                where: { id: bookingExtraService.bookingId },
                data: {
                    totalAmount: {
                        decrement: bookingExtraService.totalPrice
                    }
                }
            })
        ]);
    }
    async getBookingExtraServices(bookingId) {
        return await database_1.prisma.bookingExtraService.findMany({
            where: { bookingId },
            include: {
                extraService: true
            }
        });
    }
}
exports.ExtraServiceService = ExtraServiceService;
//# sourceMappingURL=extraServiceService.js.map