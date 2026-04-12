import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';
import { config } from './config';
import { errorHandler, notFound } from './middlewares/errorMiddleware';

// Import routes
import roomTypeRoutes from './routes/roomTypeRoute';
import roomRoutes from './routes/roomRoute';
import bookingRoutes from './routes/bookingRoute';
import paymentRoutes from './routes/paymentRoute';
import offlineReservationRoutes from './routes/offlineReservationRoute';
import serviceCategoryRoutes from './routes/serviceCategoryRoute';
import serviceOrderRoutes from './routes/serviceOrderRoute';
import frontofficeRoutes from './routes/frontofficeRoute';
import housekeepingRoutes from './routes/housekeepingRoute';
import reviewRoutes from './routes/reviewRoute';
import guestRoutes from './routes/guestRoute';
import checkInOutRoutes from './routes/checkInOutRoute';
// import facilityRoutes from './routes/facilityRoute';
// import facilityRoutes from './routes/facilityRoute';

const app: Express = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ],
  credentials: true,
}));

// Compression middleware
app.use(compression());

// Logging middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
const uploadsPath = path.join(process.cwd(), config.uploadDir);
console.log('Serving static files from:', uploadsPath);
app.use('/uploads', express.static(uploadsPath));

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/room-types', roomTypeRoutes);
app.use('/api/rooms', roomRoutes as any);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/offline-reservations', offlineReservationRoutes);
app.use('/api/service-categories', serviceCategoryRoutes);
app.use('/api/service-orders', serviceOrderRoutes);
app.use('/api/frontoffice', frontofficeRoutes);
app.use('/api/frontoffice', checkInOutRoutes);
app.use('/api/housekeeping', housekeepingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/guests', guestRoutes);
// app.use('/api/facilities', facilityRoutes);
// app.use('/api/facilities', facilityRoutes);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

export default app;