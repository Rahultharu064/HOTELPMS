import { VenueLayout } from '@prisma/client';
export declare class GalleryVenueService {
    getActiveVenues(): Promise<{
        image: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        slug: string;
        sortOrder: number;
        icon: string;
        title: string;
        isActive: boolean;
        layout: import(".prisma/client").$Enums.VenueLayout;
    }[]>;
    getAllVenues(): Promise<{
        image: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        slug: string;
        sortOrder: number;
        icon: string;
        title: string;
        isActive: boolean;
        layout: import(".prisma/client").$Enums.VenueLayout;
    }[]>;
    getVenueById(id: number): Promise<{
        image: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        slug: string;
        sortOrder: number;
        icon: string;
        title: string;
        isActive: boolean;
        layout: import(".prisma/client").$Enums.VenueLayout;
    }>;
    getVenueBySlug(slug: string): Promise<{
        image: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        slug: string;
        sortOrder: number;
        icon: string;
        title: string;
        isActive: boolean;
        layout: import(".prisma/client").$Enums.VenueLayout;
    }>;
    createVenue(data: {
        title: string;
        slug?: string;
        description: string;
        image?: string;
        icon?: string;
        layout?: VenueLayout;
        sortOrder?: number;
        isActive?: boolean;
    }): Promise<{
        image: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        slug: string;
        sortOrder: number;
        icon: string;
        title: string;
        isActive: boolean;
        layout: import(".prisma/client").$Enums.VenueLayout;
    }>;
    updateVenue(id: number, data: {
        title?: string;
        slug?: string;
        description?: string;
        image?: string;
        icon?: string;
        layout?: VenueLayout;
        sortOrder?: number;
        isActive?: boolean;
    }): Promise<{
        image: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        slug: string;
        sortOrder: number;
        icon: string;
        title: string;
        isActive: boolean;
        layout: import(".prisma/client").$Enums.VenueLayout;
    }>;
    deleteVenue(id: number): Promise<{
        message: string;
    }>;
    private ensureSingleFeatured;
}
//# sourceMappingURL=galleryVenueService.d.ts.map