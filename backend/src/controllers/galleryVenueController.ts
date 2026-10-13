import type { Request, Response } from 'express';
import { GalleryVenueService } from '../services/galleryVenueService';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpStatus } from '../constants/index';

const galleryVenueService = new GalleryVenueService();

export class GalleryVenueController {
  getActiveVenues = asyncHandler(async (_req: Request, res: Response) => {
    const venues = await galleryVenueService.getActiveVenues();
    res.status(HttpStatus.OK).json(
      ApiResponse.success('Gallery venues retrieved successfully', venues)
    );
  });

  getAllVenues = asyncHandler(async (_req: Request, res: Response) => {
    const venues = await galleryVenueService.getAllVenues();
    res.status(HttpStatus.OK).json(
      ApiResponse.success('All gallery venues retrieved successfully', venues)
    );
  });

  getVenueBySlug = asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const venue = await galleryVenueService.getVenueBySlug(slug);
    res.status(HttpStatus.OK).json(
      ApiResponse.success('Gallery venue retrieved successfully', venue)
    );
  });

  getVenueById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const venue = await galleryVenueService.getVenueById(Number(id));
    res.status(HttpStatus.OK).json(
      ApiResponse.success('Gallery venue retrieved successfully', venue)
    );
  });

  createVenue = asyncHandler(async (req: Request, res: Response) => {
    const data = {
      ...req.body,
      image: req.file ? (req.file as Express.Multer.File).path : req.body.image,
    };

    const venue = await galleryVenueService.createVenue(data);
    res.status(HttpStatus.CREATED).json(
      ApiResponse.success('Gallery venue created successfully', venue)
    );
  });

  updateVenue = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = {
      ...req.body,
      ...(req.file ? { image: (req.file as Express.Multer.File).path } : {}),
    };

    const venue = await galleryVenueService.updateVenue(Number(id), data);
    res.status(HttpStatus.OK).json(
      ApiResponse.success('Gallery venue updated successfully', venue)
    );
  });

  deleteVenue = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await galleryVenueService.deleteVenue(Number(id));
    res.status(HttpStatus.OK).json(
      ApiResponse.success('Gallery venue deleted successfully', result)
    );
  });
}
