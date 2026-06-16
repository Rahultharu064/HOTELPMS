import { motion } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] as const },
});

/** Stat card placeholder — matches Admin StatCard layout */
export const AdminStatCardSkeleton = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    {...fadeUp(delay)}
    className="rounded-[40px] border border-neutral-border/40 bg-white p-8 shadow-sm"
  >
    <div className="flex items-start justify-between">
      <div className="h-16 w-16 rounded-[24px] skeleton-shimmer" />
      <div className="h-7 w-20 rounded-2xl skeleton-shimmer" />
    </div>
    <div className="mt-8 space-y-2">
      <div className="h-3 w-24 rounded-full skeleton-shimmer" />
      <div className="h-10 w-32 rounded-xl skeleton-shimmer" />
    </div>
  </motion.div>
);

export const AdminStatCardsSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: count }).map((_, i) => (
      <AdminStatCardSkeleton key={i} delay={i * 0.06} />
    ))}
  </div>
);

/** Table row placeholder */
const AdminTableRowSkeleton = ({ cols = 4, delay = 0 }: { cols?: number; delay?: number }) => (
  <motion.tr {...fadeUp(delay)} className="border-b border-neutral-border/10">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-10 py-8">
        <div className="space-y-2">
          <div className="h-3.5 rounded-full skeleton-shimmer w-[60%]" />
          {i === 0 && <div className="h-2.5 w-2/3 rounded-full skeleton-shimmer" />}
        </div>
      </td>
    ))}
  </motion.tr>
);

/** Full table skeleton with header */
export const AdminTableSkeleton = ({
  rows = 5,
  cols = 4,
  bare = false,
}: {
  rows?: number;
  cols?: number;
  bare?: boolean;
}) => {
  const table = (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-neutral-light/50">
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="px-10 py-7">
                <div className="h-2.5 w-20 rounded-full skeleton-shimmer" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <AdminTableRowSkeleton key={i} cols={cols} delay={i * 0.05} />
          ))}
        </tbody>
      </table>
    </div>
  );

  if (bare) return table;

  return (
    <div className="overflow-hidden rounded-[40px] border border-neutral-border/40 bg-white shadow-sm">
      {table}
    </div>
  );
};

/** Inventory / service card grid skeleton */
export const AdminCardGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        {...fadeUp(i * 0.05)}
        className="overflow-hidden rounded-[32px] border border-neutral-border/40 bg-white shadow-sm"
      >
        <div className="aspect-[4/3] skeleton-shimmer" />
        <div className="space-y-3 p-5">
          <div className="h-4 w-3/4 rounded-full skeleton-shimmer" />
          <div className="h-3 w-full rounded-full skeleton-shimmer" />
          <div className="flex gap-2 pt-2">
            <div className="h-8 flex-1 rounded-xl skeleton-shimmer" />
            <div className="h-8 w-8 rounded-xl skeleton-shimmer" />
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

/** Dashboard page header skeleton */
const AdminPageHeaderSkeleton = () => (
  <motion.div
    {...fadeUp(0)}
    className="relative overflow-hidden rounded-[40px] border border-neutral-border/40 bg-white/60 p-8 shadow-sm backdrop-blur-sm"
  >
    <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
      <div className="flex items-center gap-6">
        <div className="h-16 w-16 rounded-[24px] skeleton-shimmer" />
        <div className="space-y-3">
          <div className="h-8 w-56 rounded-xl skeleton-shimmer" />
          <div className="h-3 w-36 rounded-full skeleton-shimmer" />
        </div>
      </div>
      <div className="flex gap-4">
        <div className="h-14 w-36 rounded-2xl skeleton-shimmer" />
        <div className="h-14 w-32 rounded-2xl skeleton-shimmer" />
      </div>
    </div>
  </motion.div>
);

/** Recent bookings + control hub section skeleton */
const AdminDashboardContentSkeleton = () => (
  <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
    <div className="space-y-8 lg:col-span-2">
      <div className="flex items-center justify-between">
        <div className="h-6 w-48 rounded-lg skeleton-shimmer" />
        <div className="h-3 w-28 rounded-full skeleton-shimmer" />
      </div>
      <AdminTableSkeleton rows={5} cols={4} />
    </div>
    <div className="space-y-8">
      <div className="h-72 rounded-[48px] skeleton-shimmer" />
      <div className="h-48 rounded-[40px] border border-neutral-border/40 bg-white p-8 shadow-sm">
        <div className="mb-6 h-10 w-10 rounded-2xl skeleton-shimmer" />
        <div className="space-y-3">
          <div className="h-12 w-full rounded-2xl skeleton-shimmer" />
          <div className="h-10 w-full rounded-2xl skeleton-shimmer" />
        </div>
      </div>
    </div>
  </div>
);

/** Full admin dashboard skeleton */
export const AdminDashboardSkeleton = () => (
  <div className="space-y-12 pb-10">
    <AdminPageHeaderSkeleton />
    <AdminStatCardsSkeleton count={4} />
    <AdminDashboardContentSkeleton />
  </div>
);

/** Room detail / edit page skeleton */
export const AdminDetailPageSkeleton = () => (
  <div className="mx-auto max-w-6xl space-y-10 pb-20">
    <div className="flex items-center gap-6">
      <div className="h-12 w-12 rounded-2xl skeleton-shimmer" />
      <div className="space-y-2">
        <div className="h-8 w-48 rounded-xl skeleton-shimmer" />
        <div className="h-3 w-32 rounded-full skeleton-shimmer" />
      </div>
    </div>
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="aspect-[16/10] rounded-[32px] skeleton-shimmer" />
      <div className="space-y-6">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-14 w-full rounded-2xl skeleton-shimmer" />
        ))}
        <div className="h-14 w-full rounded-2xl bg-primary-dark/10 skeleton-shimmer" />
      </div>
    </div>
  </div>
);

/** Suspense fallback for lazy-loaded admin sections */
export const AdminSectionSkeleton = () => (
  <div className="min-h-[200px] rounded-[40px] border border-neutral-border/40 bg-white/50 p-8">
    <div className="mb-6 h-5 w-40 rounded-lg skeleton-shimmer" />
    <div className="space-y-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-14 w-full rounded-2xl skeleton-shimmer" />
      ))}
    </div>
  </div>
);

/** Front office / housekeeping dashboard skeleton */
export const PortalDashboardSkeleton = () => (
  <div className="space-y-12 pb-10">
    <AdminPageHeaderSkeleton />
    <AdminStatCardsSkeleton count={4} />
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <AdminSectionSkeleton />
        <AdminTableSkeleton rows={5} cols={5} />
      </div>
      <div className="space-y-8">
        <AdminSectionSkeleton />
        <AdminSectionSkeleton />
      </div>
    </div>
  </div>
);

/** Small room tile grid — front office & housekeeping */
export const PortalRoomGridSkeleton = ({ count = 12 }: { count?: number }) => (
  <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        {...fadeUp(i * 0.04)}
        className="flex flex-col items-center rounded-[40px] border border-neutral-border/40 bg-white p-8 shadow-sm"
      >
        <div className="mb-4 h-14 w-14 rounded-2xl skeleton-shimmer" />
        <div className="mb-2 h-7 w-16 rounded-lg skeleton-shimmer" />
        <div className="h-3 w-20 rounded-full skeleton-shimmer" />
        <div className="mt-6 h-8 w-full rounded-xl skeleton-shimmer" />
      </motion.div>
    ))}
  </div>
);

/** Generic portal page with header + table or grid */
export const PortalPageSkeleton = ({ variant = 'table' }: { variant?: 'table' | 'grid' }) => (
  <div className="space-y-10 pb-10">
    <AdminPageHeaderSkeleton />
    {variant === 'grid' ? <PortalRoomGridSkeleton count={12} /> : <AdminTableSkeleton rows={8} cols={5} />}
  </div>
);
