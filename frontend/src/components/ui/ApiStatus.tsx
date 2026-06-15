import React from 'react';
import { motion } from 'framer-motion';
import { WifiOff, RefreshCw, ServerCrash, SearchX } from 'lucide-react';
import { Button } from './Button';

interface ApiStatusProps {
  /** 'loading' | 'error' | 'empty' */
  status: 'loading' | 'error' | 'empty';
  /** Number of skeleton items to show when loading */
  skeletonCount?: number;
  /** Custom skeleton shape: 'card' | 'row' | 'hero' */
  skeletonVariant?: 'card' | 'row' | 'hero';
  /** Error message to display */
  errorMessage?: string;
  /** Empty state title */
  emptyTitle?: string;
  /** Empty state description */
  emptyDescription?: string;
  /** Empty state emoji */
  emptyEmoji?: string;
  /** Retry callback */
  onRetry?: () => void;
  /** Custom className */
  className?: string;
}

/** Professional skeleton loader */
const SkeletonCard = () => (
  <div className="overflow-hidden rounded-2xl border border-neutral-border/40 bg-white shadow-sm">
    <div className="aspect-[4/3] skeleton-shimmer" />
    <div className="space-y-4 p-5">
      <div className="h-3 w-full rounded-full skeleton-shimmer" />
      <div className="h-3 w-4/5 rounded-full skeleton-shimmer" />
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
  </div>
);

const SkeletonRow = () => (
  <div className="flex gap-4 rounded-3xl border border-neutral-border/40 bg-neutral-light/50 p-4">
    <div className="h-20 w-20 shrink-0 rounded-2xl skeleton-shimmer" />
    <div className="flex flex-1 flex-col justify-center gap-2 py-1">
      <div className="h-2.5 w-20 rounded-full skeleton-shimmer" />
      <div className="h-5 w-3/5 rounded-full skeleton-shimmer" />
      <div className="h-3 w-2/5 rounded-full skeleton-shimmer" />
    </div>
  </div>
);

const SkeletonHero = () => (
  <div className="overflow-hidden rounded-[40px] border border-neutral-border/40 shadow-sm">
    <div className="aspect-[4/5] skeleton-shimmer" />
    <div className="space-y-4 p-8">
      <div className="h-4 w-1/3 rounded-full skeleton-shimmer" />
      <div className="h-6 w-3/4 rounded-full skeleton-shimmer" />
      <div className="h-3 w-full rounded-full skeleton-shimmer" />
      <div className="flex gap-2 pt-4">
        <div className="h-3 w-16 rounded-full skeleton-shimmer" />
        <div className="h-3 w-16 rounded-full skeleton-shimmer" />
        <div className="h-3 w-16 rounded-full skeleton-shimmer" />
      </div>
    </div>
  </div>
);

const skeletonMap = {
  card: SkeletonCard,
  row: SkeletonRow,
  hero: SkeletonHero,
};

/**
 * Professional API status component for loading, error, and empty states.
 * Provides a consistent UX across the entire app.
 */
export const ApiStatus: React.FC<ApiStatusProps> = ({
  status,
  skeletonCount = 3,
  skeletonVariant = 'card',
  errorMessage,
  emptyTitle = 'Nothing to show',
  emptyDescription = 'Check back later for updates.',
  emptyEmoji = '📭',
  onRetry,
  className = '',
}) => {
  if (status === 'loading') {
    const Skeleton = skeletonMap[skeletonVariant];
    const gridClass = skeletonVariant === 'row'
      ? 'grid grid-cols-1 gap-4'
      : skeletonVariant === 'hero'
        ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8'
        : 'grid md:grid-cols-2 lg:grid-cols-3 gap-6';

    return (
      <div className={`${gridClass} ${className}`}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <Skeleton key={i} />
        ))}
      </div>
    );
  }

  if (status === 'error') {
    const isNetworkError = errorMessage?.toLowerCase().includes('network') ||
      errorMessage?.toLowerCase().includes('fetch') ||
      errorMessage?.toLowerCase().includes('timeout');

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`text-center py-16 md:py-24 bg-white rounded-3xl border border-neutral-border/50 shadow-sm ${className}`}
      >
        <div className="max-w-md mx-auto px-6">
          <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center mx-auto mb-6">
            {isNetworkError ? (
              <WifiOff className="h-9 w-9 text-red-400" />
            ) : (
              <ServerCrash className="h-9 w-9 text-red-400" />
            )}
          </div>
          <h3 className="text-xl font-bold text-primary-dark mb-2">
            {isNetworkError ? 'Connection Issue' : 'Something Went Wrong'}
          </h3>
          <p className="text-sm text-neutral-text-secondary mb-6 leading-relaxed">
            {isNetworkError
              ? 'Unable to reach the server. Please check your internet connection and try again.'
              : errorMessage || 'We encountered an unexpected error. Our team has been notified.'}
          </p>
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              className="rounded-xl font-bold border-neutral-border hover:border-primary-green hover:bg-primary-green/5 gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}
        </div>
      </motion.div>
    );
  }

  // Empty state
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`text-center py-16 md:py-24 bg-white rounded-3xl border border-dashed border-neutral-border/50 shadow-sm relative overflow-hidden ${className}`}
    >
      <div className="absolute right-0 top-0 w-32 h-32 bg-primary-gold/5 rounded-bl-full pointer-events-none" />
      <div className="absolute left-0 bottom-0 w-24 h-24 bg-primary-green/5 rounded-tr-full pointer-events-none" />
      <div className="max-w-md mx-auto px-6 relative z-10">
        <div className="w-20 h-20 rounded-3xl bg-neutral-light flex items-center justify-center mx-auto mb-6">
          {emptyEmoji === 'search' ? (
            <SearchX className="h-9 w-9 text-neutral-text-secondary/50" />
          ) : (
            <span className="text-4xl opacity-60 select-none">{emptyEmoji}</span>
          )}
        </div>
        <h3 className="text-xl font-bold text-primary-dark mb-2">{emptyTitle}</h3>
        <p className="text-sm text-neutral-text-secondary leading-relaxed">{emptyDescription}</p>
      </div>
    </motion.div>
  );
};

export default ApiStatus;
