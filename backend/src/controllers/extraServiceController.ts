import { Request, Response } from 'express';
import { ExtraServiceService } from '../services/extraServiceService';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpStatus } from '../constants';

const extraServiceService = new ExtraServiceService();

export class ExtraServiceController {
  createExtraService = asyncHandler(async (req: Request, res: Response) => {
    const { name, description, price, categoryId, discountPercentage, discountAllowed } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const service = await extraServiceService.createExtraService({
      name,
      description,
      price,
      categoryId,
      image,
      discountPercentage,
      discountAllowed
    });

    res.status(HttpStatus.CREATED).json(ApiResponse.success('Extra service created successfully', service));
  });

  getExtraServices = asyncHandler(async (req: Request, res: Response) => {
    const services = await extraServiceService.getExtraServices();
    res.status(HttpStatus.OK).json(ApiResponse.success('Extra services retrieved successfully', services));
  });

  updateExtraService = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    const service = await extraServiceService.updateExtraService(Number(id), {
      ...req.body,
      ...(image && { image })
    });

    res.status(HttpStatus.OK).json(ApiResponse.success('Extra service updated successfully', service));
  });

  deleteExtraService = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await extraServiceService.deleteExtraService(Number(id));
    res.status(HttpStatus.OK).json(ApiResponse.success('Extra service deactivated successfully'));
  });

  addExtraServiceToBooking = asyncHandler(async (req: Request, res: Response) => {
    const result = await extraServiceService.addExtraServiceToBooking(req.body);
    res.status(HttpStatus.CREATED).json(ApiResponse.success('Extra service added to booking', result));
  });

  removeExtraServiceFromBooking = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await extraServiceService.removeExtraServiceFromBooking(Number(id));
    res.status(HttpStatus.OK).json(ApiResponse.success('Extra service removed from booking'));
  });

  getBookingExtraServices = asyncHandler(async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    const services = await extraServiceService.getBookingExtraServices(Number(bookingId));
    res.status(HttpStatus.OK).json(ApiResponse.success('Booking extra services retrieved successfully', services));
  });
}
