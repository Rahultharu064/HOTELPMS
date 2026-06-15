import { lazy } from 'react';

/** Public website — room details */
export const RoomDetailspage = lazy(() =>
  import('../pages/publicwebsite/RoomDetailspage').then((m) => ({ default: m.RoomDetailspage }))
);

/** Dashboards */
export const AdminDashboardPage = lazy(() => import('../pages/Admin/DashboardPage'));
export const FrontOfficeDashboardPage = lazy(() => import('../pages/frontoffice/DashboardPage'));
export const HousekeepingDashboardPage = lazy(() => import('../pages/Housekeeping/DashboardPage'));

/** Staff room detail pages */
export const AdminRoomDetailsPage = lazy(() => import('../pages/Admin/RoomDetailsPage'));
export const HousekeepingRoomDetailsPage = lazy(() => import('../pages/Housekeeping/RoomDetailsPage'));
