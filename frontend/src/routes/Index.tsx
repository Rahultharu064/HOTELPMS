import type { RouteObject } from 'react-router-dom';
import { Suspense } from 'react';
import { Homepage } from '../pages/publicwebsite/Homepage';
import { AboutusPage } from '../pages/publicwebsite/AboutusPage';
import { ContactUsPage } from '../pages/publicwebsite/ContactUsPage';
import { Roompage } from '../pages/publicwebsite/Roompage';
import {
  RoomDetailspage,
  LoginPage,
  SignupPage,
  GuestProfilePage,
  AdminLoginPage,
  AdminDashboardPage,
  FrontOfficeDashboardPage,
  FrontOfficeProfilePage,
  HousekeepingDashboardPage,
  AdminRoomDetailsPage,
  HousekeepingRoomDetailsPage,
} from './lazyPages';
import { BookingsPage as PublicBookingsPage } from '../pages/publicwebsite/BookingsPage';
import { FacilitiesPage } from '../pages/publicwebsite/FacilitiesPage';
import { GalleryPage } from '../pages/publicwebsite/GalleryPage';
import { PaymentSuccessPage } from '../pages/publicwebsite/PaymentSuccessPage';
import { PaymentFailurePage } from '../pages/publicwebsite/PaymentFailurePage';
import { ForgotPasswordPage } from '../pages/publicwebsite/Auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/publicwebsite/Auth/ResetPasswordPage';
import { VerifyOTPPage } from '../pages/publicwebsite/Auth/VerifyOTPPage';
import { LoginSuccess } from '../pages/publicwebsite/Auth/LoginSuccess';
import PublicLayout from '../components/publicwebsite/Homepage/Sections/PublicLayout';
import { AuthGuard } from '../components/auth/AuthGuard';

// Front Office
import { FrontOfficeLayout } from '../components/frontoffice/Layout/FrontOfficeLayout';
import CheckInOutPage from '../pages/frontoffice/CheckInOutPage';
import RoomsPageFO from '../pages/frontoffice/RoomsPage';
import PaymentsPage from '../pages/frontoffice/PaymentsPage';
import ReportsPage from '../pages/frontoffice/ReportsPage';
import SettingsPage from '../pages/frontoffice/SettingsPage';
import NotificationsPage from '../pages/frontoffice/NotificationsPage';
import ServicePOSPage from '../pages/frontoffice/ServicePOSPage';
import GuestFolioPage from '../pages/frontoffice/GuestFolioPage';


// Housekeeping
import { HousekeepingLayout } from '../components/Housekeeping/Layout/HousekeepingLayout';
import RoomStatusPage from '../pages/Housekeeping/RoomStatusPage';
import CleaningTasksPage from '../pages/Housekeeping/CleaningTasksPage';
import StaffAssignmentPage from '../pages/Housekeeping/StaffAssignmentPage';

// Admin
import { AdminLayout } from '../components/Admin/Layout/AdminLayout';
import AdminSettingsPage from '../pages/Admin/SettingsPage';
import RoomTypesPage from '../pages/Admin/RoomTypesPage';
import RoomsPage from '../pages/Admin/RoomsPage';
import AdminBookingsPage from '../pages/Admin/BookingsPage';
import AdminGuestsPage from '../pages/Admin/GuestsPage';
import ExtraServicesPage from '../pages/Admin/ExtraServicesPage';
import GalleryVenuesPage from '../pages/Admin/GalleryVenuesPage';
import AdminUsersPage from '../pages/Admin/UsersPage';
import RoomEditPage from '../pages/Admin/RoomEditPage';
import { StaffResetPasswordPage } from '../pages/Admin/Auth/StaffResetPasswordPage';
import { AdminAuthGuard } from '../components/auth/AdminAuthGuard';
import { RoomDetailsPageSkeleton } from '../components/ui/skeletons/PageSkeletons';

// Simple placeholder components for missing routes
const FinancialsPage = () => (
  <div className="py-20 text-center space-y-4">
    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
      <CreditCard size={40} />
    </div>
    <h1 className="text-2xl font-black text-[#111827] uppercase tracking-tight">Financial Ledger</h1>
    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Financial records and auditing tools currently in development</p>
  </div>
);

const AdminReportsPage = () => (
  <div className="py-20 text-center space-y-4">
    <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
      <BarChart3 size={40} />
    </div>
    <h1 className="text-2xl font-black text-[#111827] uppercase tracking-tight">System Analytics</h1>
    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Reporting and performance tools currently in development</p>
  </div>
);

import { CreditCard, BarChart3 } from 'lucide-react';

const routes: RouteObject[] = [
  // Public Website
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: 'about',
        element: <AboutusPage />,
      },
      {
        path: 'contact',
        element: <ContactUsPage />,
      },
      {
        path: 'rooms',
        element: <Roompage />,
      },
      {
        path: 'rooms/:slug',
        element: (
          <Suspense fallback={<RoomDetailsPageSkeleton />}>
            <RoomDetailspage />
          </Suspense>
        ),
      },
      {
        path: 'booking/:id',
        element: <AuthGuard><PublicBookingsPage /></AuthGuard>,
      },
      {
        path: 'booking',
        element: <AuthGuard><PublicBookingsPage /></AuthGuard>,
      },
      {
        path: 'facilities',
        element: <FacilitiesPage />,
      },
      {
        path: 'gallery',
        element: <GalleryPage />,
      },
      {
        path: 'payment/success',
        element: <PaymentSuccessPage />,
      },
      {
        path: 'payment/failure',
        element: <PaymentFailurePage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'signup',
        element: <SignupPage />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: 'reset-password',
        element: <ResetPasswordPage />,
      },
      {
        path: 'verify-otp',
        element: <VerifyOTPPage />,
      },
      {
        path: 'login-success',
        element: <LoginSuccess />,
      },
      {
        path: 'profile',
        element: <AuthGuard><GuestProfilePage /></AuthGuard>,
      },
    ],
  },

  // Staff Security Workstation
  {
    path: '/admin/auth/reset-password',
    element: <AdminAuthGuard><StaffResetPasswordPage /></AdminAuthGuard>,
  },

  // Front Office Management
  {
    path: '/frontoffice',
    element: <AdminAuthGuard allowedRoles={['front_office', 'superadmin', 'admin', 'manager']}><FrontOfficeLayout /></AdminAuthGuard>,
    children: [
      {
        index: true,
        element: <FrontOfficeDashboardPage />,
      },
      {
        path: 'dashboard',
        element: <FrontOfficeDashboardPage />,
      },
      {
        path: 'bookings',
        element: <AdminBookingsPage />,
      },
      {
        path: 'guests',
        element: <AdminGuestsPage />,
      },
      {
        path: 'checkin',
        element: <CheckInOutPage />,
      },
      {
        path: 'rooms',
        element: <RoomsPageFO />,
      },
      {
        path: 'services-pos',
        element: <ServicePOSPage />,
      },
      {
        path: 'payments',
        element: <PaymentsPage />,
      },
      {
        path: 'reports',
        element: <ReportsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'notifications',
        element: <NotificationsPage />,
      },
      {
        path: 'profile',
        element: <FrontOfficeProfilePage />,
      },
      {
        path: 'folio',
        element: <GuestFolioPage />,
      },

    ],
  },

  // Housekeeping Management
  {
    path: '/housekeeping',
    element: <AdminAuthGuard allowedRoles={['housekeeping', 'superadmin', 'admin', 'manager']}><HousekeepingLayout /></AdminAuthGuard>,
    children: [
      {
        index: true,
        element: <HousekeepingDashboardPage />,
      },
      {
        path: 'dashboard',
        element: <HousekeepingDashboardPage />,
      },
      {
        path: 'room-status',
        element: <RoomStatusPage />,
      },
      {
        path: 'cleaning-tasks',
        element: <CleaningTasksPage />,
      },
      {
        path: 'staff-assignment',
        element: <StaffAssignmentPage />,
      },
      {
        path: 'rooms/:id',
        element: <HousekeepingRoomDetailsPage />,
      },
    ],
  },

  // Admin Management
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin',
    element: <AdminAuthGuard allowedRoles={['superadmin', 'admin', 'manager']}><AdminLayout /></AdminAuthGuard>,
    children: [
      {
        index: true,
        element: <AdminDashboardPage />,
      },
      {
        path: 'dashboard',
        element: <AdminDashboardPage />,
      },
      {
        path: 'users',
        element: <AdminUsersPage />,
      },
      {
        path: 'settings',
        element: <AdminSettingsPage />,
      },
      {
        path: 'room-types',
        element: <RoomTypesPage />,
      },
      {
        path: 'rooms',
        element: <RoomsPage />,
      },
      {
        path: 'rooms/edit/:id',
        element: <RoomEditPage />,
      },
      {
        path: 'rooms/:id',
        element: <AdminRoomDetailsPage />,
      },
      {
        path: 'bookings',
        element: <AdminBookingsPage />,
      },
      {
        path: 'guests',
        element: <AdminGuestsPage />,
      },
      {
        path: 'extra-services',
        element: <ExtraServicesPage />,
      },
      {
        path: 'gallery',
        element: <GalleryVenuesPage />,
      },
      {
        path: 'financials',
        element: <FinancialsPage />,
      },
      {
        path: 'reports',
        element: <AdminReportsPage />,
      },
    ],
  },
];

export default routes;
