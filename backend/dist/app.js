"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const config_1 = require("./config");
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
// Import routes
const roomTypeRoute_1 = __importDefault(require("./routes/roomTypeRoute"));
const roomRoute_1 = __importDefault(require("./routes/roomRoute"));
const bookingRoute_1 = __importDefault(require("./routes/bookingRoute"));
const paymentRoute_1 = __importDefault(require("./routes/paymentRoute"));
const offlineReservationRoute_1 = __importDefault(require("./routes/offlineReservationRoute"));
const serviceCategoryRoute_1 = __importDefault(require("./routes/serviceCategoryRoute"));
const serviceOrderRoute_1 = __importDefault(require("./routes/serviceOrderRoute"));
const frontofficeRoute_1 = __importDefault(require("./routes/frontofficeRoute"));
const housekeepingRoute_1 = __importDefault(require("./routes/housekeepingRoute"));
const reviewRoute_1 = __importDefault(require("./routes/reviewRoute"));
const guestRoute_1 = __importDefault(require("./routes/guestRoute"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const adminAuthRoute_1 = __importDefault(require("./routes/adminAuthRoute"));
const staffRoute_1 = __importDefault(require("./routes/staffRoute"));
const checkInOutRoute_1 = __importDefault(require("./routes/checkInOutRoute"));
const extraServiceRoute_1 = __importDefault(require("./routes/extraServiceRoute"));
// import facilityRoutes from './routes/facilityRoute';
// import facilityRoutes from './routes/facilityRoute';
const app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use((0, cors_1.default)({
    origin: config_1.config.corsOrigin,
    credentials: true,
}));
// Compression middleware
app.use((0, compression_1.default)());
// Logging middleware
if (config_1.config.nodeEnv === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
else {
    app.use((0, morgan_1.default)('combined'));
}
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Static files
const uploadsPath = path_1.default.join(process.cwd(), config_1.config.uploadDir);
console.log('Serving static files from:', uploadsPath);
app.use('/uploads', express_1.default.static(uploadsPath));
// Health check
app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});
// API Routes
app.use('/api/room-types', roomTypeRoute_1.default);
app.use('/api/rooms', roomRoute_1.default);
app.use('/api/bookings', bookingRoute_1.default);
app.use('/api/payments', paymentRoute_1.default);
app.use('/api/offline-reservations', offlineReservationRoute_1.default);
app.use('/api/service-categories', serviceCategoryRoute_1.default);
app.use('/api/service-orders', serviceOrderRoute_1.default);
app.use('/api/frontoffice', frontofficeRoute_1.default);
app.use('/api/frontoffice', checkInOutRoute_1.default);
app.use('/api/housekeeping', housekeepingRoute_1.default);
app.use('/api/reviews', reviewRoute_1.default);
app.use('/api/guests', guestRoute_1.default);
app.use('/api/auth', authRoute_1.default);
app.use('/api/admin/auth', adminAuthRoute_1.default);
app.use('/api/admin/staff', staffRoute_1.default);
app.use('/api/extra-services', extraServiceRoute_1.default);
// app.use('/api/facilities', facilityRoutes);
// app.use('/api/facilities', facilityRoutes);
// 404 handler
app.use(errorMiddleware_1.notFound);
// Global error handler
app.use(errorMiddleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map