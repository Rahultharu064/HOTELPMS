import { lazy } from 'react';

/** Public website — room details */
export const RoomDetailspage = lazy(() =>
  import('../pages/publicwebsite/RoomDetailspage').then((m) => ({ default: m.RoomDetailspage }))
);

/** Guest auth & profile */
export const LoginPage = lazy(() =>
  import('../pages/publicwebsite/Auth/LoginPage').then((m) => ({ default: m.LoginPage }))
);
export const SignupPage = lazy(() =>
  import('../pages/publicwebsite/Auth/SignupPage').then((m) => ({ default: m.SignupPage }))
);
export const GuestProfilePage = lazy(() =>
  import('../pages/publicwebsite/Guest/GuestProfilePage').then((m) => ({ default: m.GuestProfilePage }))
);

/** Staff login */
export const AdminLoginPage = lazy(() =>
  import('../pages/Admin/Auth/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage }))
);

/** Dashboards */
export const AdminDashboardPage = lazy(() =>
  import('../pages/Admin/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
export const FrontOfficeDashboardPage = lazy(() => import('../pages/frontoffice/DashboardPage'));
export const HousekeepingDashboardPage = lazy(() => import('../pages/Housekeeping/DashboardPage'));

/** Staff profiles */
export const FrontOfficeProfilePage = lazy(() => import('../pages/frontoffice/ProfilePage'));

/** Staff room detail pages */
export const AdminRoomDetailsPage = lazy(() => import('../pages/Admin/RoomDetailsPage'));
export const HousekeepingRoomDetailsPage = lazy(() => import('../pages/Housekeeping/RoomDetailsPage'));

/** Homepage below-fold sections */
export const GuestFavoritesSection = lazy(() =>
  import('../components/publicwebsite/Homepage/Sections/GuestFavoritesSection').then((m) => ({
    default: m.GuestFavoritesSection,
  }))
);
export const ReviewsSection = lazy(() =>
  import('../components/publicwebsite/Homepage/Sections/ReviewsSection')
);
