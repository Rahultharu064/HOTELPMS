import { Prisma, RoomStatus, HousekeepingType } from '@prisma/client';
export declare class HousekeepingService {
    getRoomStatuses(): Promise<{
        name: string;
        id: number;
        status: import(".prisma/client").$Enums.RoomStatus;
        roomNumber: string;
        floor: number | null;
        housekeepingLogs: {
            id: number;
            createdAt: Date;
            status: string;
            roomId: number;
            type: import(".prisma/client").$Enums.HousekeepingType;
            notes: string | null;
            staffId: string | null;
        }[];
    }[]>;
    updateRoomStatus(data: {
        roomId: number;
        status: RoomStatus;
        staffId?: string;
        type: HousekeepingType;
        notes?: string;
    }): Promise<{
        room: {
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
        };
        log: {
            id: number;
            createdAt: Date;
            status: string;
            roomId: number;
            type: import(".prisma/client").$Enums.HousekeepingType;
            notes: string | null;
            staffId: string | null;
        };
    }>;
    getLogs(filters: {
        roomId?: number;
        staffId?: string;
        type?: HousekeepingType;
        startDate?: Date;
        endDate?: Date;
    }): Promise<({
        room: {
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
        };
    } & {
        id: number;
        createdAt: Date;
        status: string;
        roomId: number;
        type: import(".prisma/client").$Enums.HousekeepingType;
        notes: string | null;
        staffId: string | null;
    })[]>;
    getHousekeepingStats(): Promise<{
        total: number;
        available: number;
        cleaning: number;
        maintenance: number;
        occupied: number;
        dirty: number;
    }>;
    getStaff(): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        phone: string | null;
        staffId: string;
        role: string | null;
    }[]>;
    addStaff(data: {
        staffId: string;
        name: string;
        role?: string;
        phone?: string;
    }): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        phone: string | null;
        staffId: string;
        role: string | null;
    }>;
    updateStaffStatus(id: number, status: string): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        phone: string | null;
        staffId: string;
        role: string | null;
    }>;
}
//# sourceMappingURL=housekeepingService.d.ts.map