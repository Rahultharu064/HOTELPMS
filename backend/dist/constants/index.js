"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingStatusEnum = exports.RoomStatusEnum = exports.HttpStatus = void 0;
exports.HttpStatus = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
};
exports.RoomStatusEnum = {
    AVAILABLE: 'available',
    OCCUPIED: 'occupied',
    MAINTENANCE: 'maintenance',
    CLEANING: 'cleaning',
    RESERVED: 'reserved',
    OUT_OF_SERVICE: 'out_of_service',
};
exports.BookingStatusEnum = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CHECKED_IN: 'checked_in',
    CHECKED_OUT: 'checked_out',
    CANCELLED: 'cancelled',
    NO_SHOW: 'no_show',
};
//# sourceMappingURL=index.js.map