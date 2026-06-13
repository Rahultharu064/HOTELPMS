import { api } from "./api";
import type { ApiResponse } from "./api";
import type { GalleryVenue } from "../data/venues";

export const galleryService = {
  getActiveVenues: async (): Promise<ApiResponse<GalleryVenue[]>> => {
    return api.get<ApiResponse<GalleryVenue[]>>("/gallery/venues");
  },

  getAllVenues: async (): Promise<ApiResponse<GalleryVenue[]>> => {
    return api.get<ApiResponse<GalleryVenue[]>>("/gallery/venues/admin/all");
  },

  getVenueBySlug: async (slug: string): Promise<ApiResponse<GalleryVenue>> => {
    return api.get<ApiResponse<GalleryVenue>>(`/gallery/venues/slug/${slug}`);
  },

  createVenue: async (data: FormData): Promise<ApiResponse<GalleryVenue>> => {
    return api.post<ApiResponse<GalleryVenue>>("/gallery/venues", data);
  },

  updateVenue: async (id: number, data: FormData): Promise<ApiResponse<GalleryVenue>> => {
    return api.put<ApiResponse<GalleryVenue>>(`/gallery/venues/${id}`, data);
  },

  deleteVenue: async (id: number): Promise<ApiResponse<void>> => {
    return api.delete<ApiResponse<void>>(`/gallery/venues/${id}`);
  },
};
