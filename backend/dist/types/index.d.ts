import { RoomStatus, BookingStatus } from '@prisma/client';
export { RoomStatus, BookingStatus };
export interface TypedRequest<T = any> extends Express.Request {
    body: T;
    params: Record<string, string>;
    query: Record<string, string | undefined>;
}
export interface TypedResponse<T = any> extends Express.Response {
    json: (body: ApiResponse<T>) => this;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: ValidationError[];
    pagination?: PaginationInfo;
    timestamp: string;
}
export interface ValidationError {
    field: string;
    message: string;
    code?: string;
}
export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    pages: number;
}
export interface RoomType {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    basePrice: number;
    size: number | null;
    maxAdults: number;
    maxChildren: number;
    allowChildren: boolean;
    bedType: string | null;
    bedCount: number;
    amenities?: Amenity[];
    rooms?: Room[];
    images?: RoomTypeImage[];
    createdAt: Date;
    updatedAt: Date;
}
export interface Room {
    id: number;
    roomNumber: string;
    roomTypeId: number;
    roomType?: RoomType;
    floor: number | null;
    status: RoomStatus;
    description: string | null;
    images?: Image[];
    bookings?: Booking[];
    createdAt: Date;
    updatedAt: Date;
}
export interface Amenity {
    id: number;
    name: string;
    icon: string | null;
    category: string | null;
    description: string | null;
    roomTypes?: RoomType[];
    createdAt: Date;
    updatedAt: Date;
}
export interface Image {
    id: number;
    url: string;
    alt: string | null;
    caption: string | null;
    sortOrder: number;
    isPrimary: boolean;
    roomId: number | null;
    room?: Room;
    createdAt: Date;
    updatedAt: Date;
}
export interface RoomTypeImage {
    id: number;
    url: string;
    alt: string | null;
    caption: string | null;
    sortOrder: number;
    isPrimary: boolean;
    roomTypeId: number;
    roomType?: RoomType;
    createdAt: Date;
    updatedAt: Date;
}
export interface Guest {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    bookings?: Booking[];
    createdAt: Date;
    updatedAt: Date;
}
export interface Booking {
    id: number;
    bookingRef: string;
    guestId: number;
    guest?: Guest;
    roomId: number;
    room?: Room;
    checkIn: Date;
    checkOut: Date;
    adults: number;
    children: number;
    totalAmount: number;
    status: BookingStatus;
    source: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface AvailabilityRequest {
    roomNumber: string;
    checkIn: string;
    checkOut: string;
}
export interface AvailabilityResponse {
    requestedRoom: {
        id: number;
        roomNumber: string;
        roomType: {
            id: number;
            name: string;
            basePrice: number;
        };
        floor: number | null;
        status: RoomStatus;
        description: string | null;
    };
    availability: {
        isAvailable: boolean;
        checkIn: Date;
        checkOut: Date;
        nights: number;
        totalPrice: number;
        reason: string | null;
    };
    alternatives: AlternativeRoom[];
}
export interface AlternativeRoom {
    id: number;
    roomNumber: string;
    roomType: string;
    floor: number | null;
    price: number;
    totalPrice: number;
    image: string | null;
}
export interface BulkAvailabilityRequest {
    roomNumbers: string[];
    checkIn: string;
    checkOut: string;
}
export interface BulkAvailabilityResponse {
    roomNumber: string;
    roomType: string;
    floor: number | null;
    status: RoomStatus;
    available: boolean;
    conflictingBookings: number;
}
//# sourceMappingURL=index.d.ts.map