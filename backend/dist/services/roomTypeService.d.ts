import { Prisma } from '@prisma/client';
export declare class RoomTypeService {
    getAllRoomTypes(filters: {
        page?: number;
        limit?: number;
        search?: string;
        sort?: string;
    }): Promise<{
        roomTypes: {
            availableRooms: number;
            totalRooms: number;
            occupancyRate: number;
            _count: {
                rooms: number;
            };
            rooms: {
                id: number;
                status: import(".prisma/client").$Enums.RoomStatus;
                roomNumber: string;
            }[];
            image: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getRoomTypeById(id: number): Promise<{
        availableRooms: number;
        occupancyRate: number;
        _count: {
            rooms: number;
        };
        rooms: ({
            images: {
                id: number;
                createdAt: Date;
                isPrimary: boolean;
                url: string;
                alt: string | null;
                roomId: number | null;
                sortOrder: number;
            }[];
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            status: import(".prisma/client").$Enums.RoomStatus;
            slug: string;
            roomNumber: string;
            roomTypeId: number;
            capacity: number;
            basePrice: Prisma.Decimal;
            floor: number | null;
            size: number | null;
            bedType: import(".prisma/client").$Enums.BedType | null;
            view: string | null;
            isFeatured: boolean;
        })[];
        image: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
    }>;
    createRoomType(data: {
        name: string;
        image?: string;
        description?: string;
    }): Promise<{
        image: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
    }>;
    updateRoomType(id: number, data: {
        name?: string;
        image?: string;
        description?: string;
    }): Promise<{
        rooms: ({
            images: {
                id: number;
                createdAt: Date;
                isPrimary: boolean;
                url: string;
                alt: string | null;
                roomId: number | null;
                sortOrder: number;
            }[];
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            status: import(".prisma/client").$Enums.RoomStatus;
            slug: string;
            roomNumber: string;
            roomTypeId: number;
            capacity: number;
            basePrice: Prisma.Decimal;
            floor: number | null;
            size: number | null;
            bedType: import(".prisma/client").$Enums.BedType | null;
            view: string | null;
            isFeatured: boolean;
        })[];
    } & {
        image: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
    }>;
    deleteRoomType(id: number): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=roomTypeService.d.ts.map