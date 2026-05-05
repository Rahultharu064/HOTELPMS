import { Prisma } from '@prisma/client';
export declare class FacilityService {
    getAllFacilities(filters: {
        page?: number;
        limit?: number;
        status?: string;
        category?: string;
        search?: string;
    }): Promise<{
        facilities: {
            primaryImage: {
                id: number;
                createdAt: Date;
                isPrimary: boolean;
                url: string;
                alt: string | null;
                sortOrder: number;
                facilityId: number;
            };
            _count: {
                images: number;
                videos: number;
            };
            images: {
                id: number;
                createdAt: Date;
                isPrimary: boolean;
                url: string;
                alt: string | null;
                sortOrder: number;
                facilityId: number;
            }[];
            videos: {
                id: number;
                createdAt: Date;
                url: string;
                title: string | null;
                thumbnail: string | null;
                facilityId: number;
            }[];
            description: string | null;
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.FacilityStatus;
            slug: string;
            category: import(".prisma/client").$Enums.FacilityCategory;
            openingHours: string | null;
            location: string | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getFacilityById(id: number): Promise<{
        primaryImage: {
            id: number;
            createdAt: Date;
            isPrimary: boolean;
            url: string;
            alt: string | null;
            sortOrder: number;
            facilityId: number;
        };
        images: {
            id: number;
            createdAt: Date;
            isPrimary: boolean;
            url: string;
            alt: string | null;
            sortOrder: number;
            facilityId: number;
        }[];
        videos: {
            id: number;
            createdAt: Date;
            url: string;
            title: string | null;
            thumbnail: string | null;
            facilityId: number;
        }[];
        description: string | null;
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.FacilityStatus;
        slug: string;
        category: import(".prisma/client").$Enums.FacilityCategory;
        openingHours: string | null;
        location: string | null;
    }>;
    createFacility(data: {
        name: string;
        slug: string;
        description?: string;
        status?: string;
        openingHours?: string;
        category: string;
        location?: string;
    }): Promise<{
        images: {
            id: number;
            createdAt: Date;
            isPrimary: boolean;
            url: string;
            alt: string | null;
            sortOrder: number;
            facilityId: number;
        }[];
        videos: {
            id: number;
            createdAt: Date;
            url: string;
            title: string | null;
            thumbnail: string | null;
            facilityId: number;
        }[];
    } & {
        description: string | null;
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.FacilityStatus;
        slug: string;
        category: import(".prisma/client").$Enums.FacilityCategory;
        openingHours: string | null;
        location: string | null;
    }>;
    updateFacility(id: number, data: {
        name?: string;
        slug?: string;
        description?: string;
        status?: string;
        openingHours?: string;
        category?: string;
        location?: string;
    }): Promise<{
        images: {
            id: number;
            createdAt: Date;
            isPrimary: boolean;
            url: string;
            alt: string | null;
            sortOrder: number;
            facilityId: number;
        }[];
        videos: {
            id: number;
            createdAt: Date;
            url: string;
            title: string | null;
            thumbnail: string | null;
            facilityId: number;
        }[];
    } & {
        description: string | null;
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.FacilityStatus;
        slug: string;
        category: import(".prisma/client").$Enums.FacilityCategory;
        openingHours: string | null;
        location: string | null;
    }>;
    deleteFacility(id: number): Promise<{
        message: string;
    }>;
    addFacilityImages(id: number, images: Array<{
        url: string;
        alt?: string;
        isPrimary?: boolean;
        sortOrder?: number;
    }>): Promise<Prisma.BatchPayload>;
    addFacilityVideos(id: number, videos: Array<{
        url: string;
        title?: string;
        thumbnail?: string;
    }>): Promise<Prisma.BatchPayload>;
    getFacilityStats(): Promise<{
        total: number;
        active: number;
        maintenance: number;
        closed: number;
        categoryDistribution: {
            category: import(".prisma/client").$Enums.FacilityCategory;
            count: number;
        }[];
    }>;
}
//# sourceMappingURL=facilityService.d.ts.map