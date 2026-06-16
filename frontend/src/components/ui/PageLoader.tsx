import { AdminSectionSkeleton } from './skeletons/AdminSkeletons';

/** Route-level skeleton — no spinner or loading text */
export const PageLoader = () => (
  <div className="min-h-[50vh] p-6">
    <AdminSectionSkeleton />
  </div>
);

export const SectionLoader = () => <AdminSectionSkeleton />;

export default PageLoader;
