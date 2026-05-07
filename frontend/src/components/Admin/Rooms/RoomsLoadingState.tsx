import { Loader2 } from 'lucide-react';

export function RoomsLoadingState() {
  return (
    <div className="py-32 flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-12 h-12 text-primary-green animate-spin" />
      <p className="text-sm font-black uppercase tracking-widest text-neutral-text-secondary animate-pulse">Syncing Inventory...</p>
    </div>
  );
}
