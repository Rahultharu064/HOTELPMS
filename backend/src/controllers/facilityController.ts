import { Request, Response } from 'express';
import { FacilityService } from '../services/facilityService';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpStatus } from '../constants';

const facilityService = new FacilityService();

export class FacilityController {
  getAllFacilities = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, status, category, search } = req.query;

    const result = await facilityService.getAllFacilities({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      status: status as string,
      category: category as string,
      search: search as string,
    });

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Facilities retrieved successfully', result)
    );
  });

  getFacilityById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const facility = await facilityService.getFacilityById(Number(id));

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Facility retrieved successfully', facility)
    );
  });

  createFacility = asyncHandler(async (req: Request, res: Response) => {
    const facility = await facilityService.createFacility(req.body);

    // Emit socket event
    const io = req.app.get('io');
    io.emit('facility-created', facility);

    res.status(HttpStatus.CREATED).json(
      ApiResponse.success('Facility created successfully', facility)
    );
  });

  updateFacility = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const facility = await facilityService.updateFacility(Number(id), req.body);

    // Emit socket event
    const io = req.app.get('io');
    io.emit('facility-updated', facility);

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Facility updated successfully', facility)
    );
  });

  deleteFacility = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await facilityService.deleteFacility(Number(id));

    // Emit socket event
    const io = req.app.get('io');
    io.emit('facility-deleted', { id: Number(id) });

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Facility deleted successfully', result)
    );
  });

  addFacilityImages = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { images } = req.body;
    const result = await facilityService.addFacilityImages(Number(id), images);

    // Emit socket event
    const io = req.app.get('io');
    io.emit('facility-images-added', { facilityId: Number(id), images });

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Facility images added successfully', result)
    );
  });

  addFacilityVideos = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { videos } = req.body;
    const result = await facilityService.addFacilityVideos(Number(id), videos);

    // Emit socket event
    const io = req.app.get('io');
    io.emit('facility-videos-added', { facilityId: Number(id), videos });

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Facility videos added successfully', result)
    );
  });

  getFacilityStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await facilityService.getFacilityStats();

    res.status(HttpStatus.OK).json(
      ApiResponse.success('Facility statistics retrieved successfully', stats)
    );
  });
}