import { useLocation } from 'react-router-dom';
import PageLoader from './PageLoader';
import { RoomDetailsPageSkeleton, BookingPageSkeleton } from './skeletons/PageSkeletons';

/** Route-aware Suspense fallback — skeleton for room details, spinner elsewhere */
export const RouteAwareFallback = () => {
  const { pathname } = useLocation();

  if (/^\/rooms\/[^/]+$/.test(pathname) || pathname.startsWith('/booking')) {
    return pathname.startsWith('/booking') ? <BookingPageSkeleton /> : <RoomDetailsPageSkeleton />;
  }

  return <PageLoader />;
};

export default RouteAwareFallback;
