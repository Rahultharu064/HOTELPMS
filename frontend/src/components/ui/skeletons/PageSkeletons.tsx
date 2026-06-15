import { motion } from 'framer-motion';

export const RoomCardSkeleton = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    className="overflow-hidden rounded-2xl border border-neutral-border/40 bg-white shadow-sm"
  >
    <div className="relative aspect-[4/3] skeleton-shimmer">
      <div className="absolute bottom-4 left-5 right-5 space-y-2">
        <div className="h-2.5 w-16 rounded-full bg-white/40" />
        <div className="h-5 w-2/3 rounded-full bg-white/50" />
      </div>
    </div>
    <div className="space-y-4 p-5">
      <div className="space-y-2">
        <div className="h-3 w-full rounded-full skeleton-shimmer" />
        <div className="h-3 w-4/5 rounded-full skeleton-shimmer" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-14 rounded-xl skeleton-shimmer" />
        ))}
      </div>
      <div className="flex gap-2.5">
        <div className="h-9 flex-1 rounded-lg skeleton-shimmer" />
        <div className="h-9 flex-1 rounded-lg skeleton-shimmer" />
      </div>
    </div>
  </motion.div>
);

export const RoomRowSkeleton = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="flex gap-4 rounded-3xl border border-neutral-border/40 bg-neutral-light/50 p-4"
  >
    <div className="h-24 w-24 shrink-0 rounded-2xl skeleton-shimmer" />
    <div className="flex flex-1 flex-col justify-center gap-2 py-1">
      <div className="h-2.5 w-20 rounded-full skeleton-shimmer" />
      <div className="h-5 w-3/5 rounded-full skeleton-shimmer" />
      <div className="mt-2 h-3 w-2/5 rounded-full skeleton-shimmer" />
    </div>
  </motion.div>
);

const SectionHeaderSkeleton = () => (
  <div className="mx-auto mb-14 max-w-4xl text-center space-y-5">
    <div className="flex items-center justify-center gap-4">
      <span className="hidden h-px w-10 skeleton-shimmer sm:block" />
      <div className="h-9 w-48 rounded-full skeleton-shimmer" />
      <span className="hidden h-px w-10 skeleton-shimmer sm:block" />
    </div>
    <div className="mx-auto h-12 w-4/5 max-w-lg rounded-2xl skeleton-shimmer" />
    <div className="flex items-center justify-center gap-2.5">
      <span className="h-[2px] w-12 rounded-full skeleton-shimmer" />
      <span className="h-1.5 w-1.5 rounded-full bg-neutral-border/50" />
      <span className="h-[2px] w-8 rounded-full skeleton-shimmer opacity-60" />
    </div>
    <div className="mx-auto h-4 w-full max-w-xl rounded-full skeleton-shimmer" />
    <div className="mx-auto h-4 w-3/4 max-w-md rounded-full skeleton-shimmer" />
  </div>
);

/** Full room details page — used on route lazy-load and data fetch */
export const RoomDetailsPageSkeleton = () => (
  <div className="min-h-screen bg-white">
    <div className="bg-gradient-to-r from-primary-dark/90 via-primary-green/80 to-primary-dark/90 py-12 md:py-16">
      <div className="container-custom text-center space-y-4">
        <div className="mx-auto flex justify-center gap-2">
          <div className="h-3 w-12 rounded-full bg-white/20" />
          <div className="h-3 w-3 rounded-full bg-white/10" />
          <div className="h-3 w-16 rounded-full bg-white/20" />
          <div className="h-3 w-3 rounded-full bg-white/10" />
          <div className="h-3 w-24 rounded-full bg-white/30" />
        </div>
        <div className="mx-auto h-10 w-2/3 max-w-lg rounded-xl bg-white/20" />
      </div>
    </div>

    <div className="container-custom py-10 lg:py-14">
      <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
        <div className="space-y-8 lg:col-span-2">
          <div className="aspect-[16/10] rounded-2xl skeleton-shimmer" />
          <div className="grid grid-cols-5 gap-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[4/3] rounded-xl skeleton-shimmer" />
            ))}
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-6 w-40 rounded-lg skeleton-shimmer" />
              <div className="h-3 w-full rounded-full skeleton-shimmer" />
              <div className="h-3 w-11/12 rounded-full skeleton-shimmer" />
              <div className="h-3 w-4/5 rounded-full skeleton-shimmer" />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-neutral-border/40 p-6 space-y-5">
            <div className="h-8 w-32 rounded-lg skeleton-shimmer" />
            <div className="h-12 w-full rounded-xl skeleton-shimmer" />
            <div className="h-12 w-full rounded-xl skeleton-shimmer" />
            <div className="h-10 w-full rounded-xl skeleton-shimmer" />
            <div className="h-14 w-full rounded-2xl skeleton-shimmer" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

/** Homepage featured rooms grid skeleton */
export const FeaturedRoomsSectionSkeleton = () => (
  <section className="section-padding bg-white">
    <div className="container-custom">
      <SectionHeaderSkeleton />
      <div className="mb-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {[0, 1, 2].map((i) => (
          <RoomCardSkeleton key={i} delay={i * 0.08} />
        ))}
      </div>
      <div className="mx-auto h-12 w-44 rounded-full skeleton-shimmer" />
    </div>
  </section>
);

/** Homepage guest favorites skeleton */
export const GuestFavoritesSectionSkeleton = () => (
  <section className="section-padding bg-white">
    <div className="container-custom">
      <SectionHeaderSkeleton />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <RoomRowSkeleton key={i} delay={i * 0.08} />
        ))}
      </div>
    </div>
  </section>
);

/** Homepage testimonials skeleton */
export const ReviewsSectionSkeleton = () => (
  <section className="section-padding bg-white">
    <div className="container-custom">
      <SectionHeaderSkeleton />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-[40px] border border-neutral-border/40 p-8 space-y-4"
          >
            <div className="flex justify-between">
              <div className="h-7 w-7 rounded-lg skeleton-shimmer" />
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((s) => (
                  <div key={s} className="h-3 w-3 rounded-full skeleton-shimmer" />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full rounded-full skeleton-shimmer" />
              <div className="h-3 w-full rounded-full skeleton-shimmer" />
              <div className="h-3 w-3/4 rounded-full skeleton-shimmer" />
            </div>
            <div className="flex items-center gap-4 border-t border-neutral-border/30 pt-6">
              <div className="h-12 w-12 rounded-full skeleton-shimmer" />
              <div className="space-y-2 flex-1">
                <div className="h-3 w-24 rounded-full skeleton-shimmer" />
                <div className="h-2.5 w-16 rounded-full skeleton-shimmer" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/** Room list page with category sidebar */
export const RoomListPageSkeleton = () => (
  <div className="min-h-screen bg-[#FAFAF8]">
    <div className="h-48 bg-gradient-to-r from-primary-dark/80 to-primary-green/70 skeleton-shimmer" />
    <div className="container-custom section-padding">
      <div className="grid gap-10 lg:grid-cols-4">
        <aside className="hidden lg:block space-y-6">
          <div className="h-4 w-28 rounded-full skeleton-shimmer" />
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-5 w-full rounded-full skeleton-shimmer" />
          ))}
          <div className="h-4 w-24 mt-8 rounded-full skeleton-shimmer" />
          <div className="h-2 w-full rounded-full skeleton-shimmer" />
        </aside>
        <div className="lg:col-span-3 grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <RoomCardSkeleton key={i} delay={i * 0.05} />
          ))}
        </div>
      </div>
    </div>
  </div>
);
