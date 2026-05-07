import { LayoutGrid } from 'lucide-react';

export function RoomsEmptyState() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <div className="col-span-full py-32 flex flex-col items-center justify-center space-y-4 bg-white/50 border-2 border-dashed border-neutral-border/40 rounded-[40px] opacity-60">
        <div className="w-20 h-20 rounded-[32px] bg-neutral-light flex items-center justify-center text-neutral-border">
          <LayoutGrid size={40} />
        </div>
        <div className="text-center">
          <p className="text-sm font-black uppercase tracking-widest text-neutral-text-secondary">No Rooms Registered</p>
          <p className="text-xs font-bold text-neutral-text-secondary/60 mt-1">Start building your inventory by clicking 'Add New Room'</p>
        </div>
      </div>
    </div>
  );
}
