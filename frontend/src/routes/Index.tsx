import type { RouteObject } from 'react-router-dom';
import { Homepage } from '../pages/publicwebsite/Homepage';
import { AboutusPage } from '../pages/publicwebsite/AboutusPage';
import { ContactUsPage } from '../pages/publicwebsite/ContactUsPage';
import { Roompage } from '../pages/publicwebsite/Roompage';
import {RoomDetailspage}from '../pages/publicwebsite/RoomDetailspage';
import { BookingsPage as PublicBookingsPage } from '../pages/publicwebsite/BookingsPage';
import { FacilitiesPage } from '../pages/publicwebsite/FacilitiesPage';
import { PaymentSuccessPage } from '../pages/publicwebsite/PaymentSuccessPage';
import { PaymentFailurePage } from '../pages/publicwebsite/PaymentFailurePage';
import PublicLayout from '../components/publicwebsite/Homepage/Sections/PublicLayout';

// Front Office
import { FrontOfficeLayout } from '../components/frontoffice/Layout/FrontOfficeLayout';
import DashboardPage from '../pages/frontoffice/DashboardPage';
import CheckInOutPage from '../pages/frontoffice/CheckInOutPage';
import RoomsPageFO from '../pages/frontoffice/RoomsPage';
import PaymentsPage from '../pages/frontoffice/PaymentsPage';
import ReportsPage from '../pages/frontoffice/ReportsPage';
import SettingsPage from '../pages/frontoffice/SettingsPage';
import NotificationsPage from '../pages/frontoffice/NotificationsPage';
import ProfilePage from '../pages/frontoffice/ProfilePage';

// Housekeeping
import { HousekeepingLayout } from '../components/Housekeeping/Layout/HousekeepingLayout';
import HKDashboardPage from '../pages/Housekeeping/DashboardPage';
import RoomStatusPage from '../pages/Housekeeping/RoomStatusPage';
import CleaningTasksPage from '../pages/Housekeeping/CleaningTasksPage';
import StaffAssignmentPage from '../pages/Housekeeping/StaffAssignmentPage';
import RoomDetailsPage from '../pages/Housekeeping/RoomDetailsPage';

// Admin
import { AdminLayout } from '../components/Admin/Layout/AdminLayout';
import AdminDashboardPage from '../pages/Admin/DashboardPage';
import AdminSettingsPage from '../pages/Admin/SettingsPage';
import RoomTypesPage from '../pages/Admin/RoomTypesPage';
import RoomsPage from '../pages/Admin/RoomsPage';
import AdminBookingsPage from '../pages/Admin/BookingsPage';
import AdminGuestsPage from '../pages/Admin/GuestsPage';

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
        path: 'rooms/:id',
        element: <RoomDetailspage />,
      },
      {
        path: 'booking/:id',
        element: <PublicBookingsPage />,
      },
      {
        path: 'booking',
        element: <PublicBookingsPage />,
      },
      {
        path: 'facilities',
        element: <FacilitiesPage />,
      },
      {
        path: 'payment/success',
        element: <PaymentSuccessPage />,
      },
      {
        path: 'payment/failure',
        element: <PaymentFailurePage />,
      },
    ],
  },

  // Front Office Management
  {
    path: '/frontoffice',
    element: <FrontOfficeLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
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
        element: <ProfilePage />,
      },
    ],
  },

  // Housekeeping Management
  {
    path: '/housekeeping',
    element: <HousekeepingLayout />,
    children: [
      {
        index: true,
        element: <HKDashboardPage />,
      },
      {
        path: 'dashboard',
        element: <HKDashboardPage />,
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
        element: <RoomDetailsPage />,
      },
    ],
  },

  // Admin Management
  {
    path: '/admin',
    element: <AdminLayout />,
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
        path: 'bookings',
        element: <AdminBookingsPage />,
      },
      {
        path: 'guests',
        element: <AdminGuestsPage />,
      },
    ],
  },
];

export default routes;
