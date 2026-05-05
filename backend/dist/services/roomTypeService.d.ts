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
            rooms: {
                id: number;
                status: import(".prisma/client").$Enums.RoomStatus;
                roomNumber: string;
            }[];
            _count: {
                rooms: number;
            };
            image: string | null;
            description: string | null;
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
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
            description: string | null;
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
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
        _count: {
            rooms: number;
        };
        image: string | null;
        description: string | null;
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createRoomType(data: {
        name: string;
        image?: string;
        description?: string;
    }): Promise<{
        image: string | null;
        description: string | null;
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
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
            description: string | null;
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
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
        description: string | null;
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteRoomType(id: number): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=roomTypeService.d.ts.map