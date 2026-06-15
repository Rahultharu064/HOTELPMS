import { Loader2 } from 'lucide-react';

/** Minimal spinner — no loading text */
export const PageLoader = () => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <Loader2 className="h-10 w-10 animate-spin text-primary-green" />
  </div>
);

export const SectionLoader = () => (
  <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-neutral-border/40 bg-neutral-light/30">
    <Loader2 className="h-6 w-6 animate-spin text-primary-green" />
  </div>
);

export default PageLoader;
