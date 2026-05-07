import { Building2 } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';

interface RoomTypesEmptyStateProps {
  onCreate: () => void;
}

export function RoomTypesEmptyState({ onCreate }: RoomTypesEmptyStateProps) {
  return (
    <Card className="h-[400px] border-dashed border-4 border-neutral-border bg-white/40 flex flex-col items-center justify-center text-center p-10 group transition-all duration-500 hover:bg-white/80">
      <div className="w-24 h-24 bg-neutral-light rounded-full flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-primary-dark/5">
        <Building2 size={40} className="text-neutral-text-secondary group-hover:text-primary-dark transition-colors" />
      </div>
      <h3 className="text-2xl font-black text-neutral-text-primary tracking-tight mb-3">No Room Types Found</h3>
      <p className="text-sm font-bold text-neutral-text-secondary/70 uppercase tracking-widest max-w-[320px] leading-relaxed mb-8">
        You haven't added any room categories to your inventory yet.
      </p>
      <Button
        onClick={onCreate}
        className="bg-primary-dark hover:bg-black text-white px-10 h-14 rounded-2xl text-sm font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary-dark/20"
      >
        Start Building Inventory
      </Button>
    </Card>
  );
}
