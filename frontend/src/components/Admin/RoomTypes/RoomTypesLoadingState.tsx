import { Building2 } from 'lucide-react';

export function RoomTypesLoadingState() {
  return (
    <div className="h-[400px] w-full flex flex-col items-center justify-center gap-6 animate-in fade-in duration-500">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-primary-green/20 border-t-primary-green rounded-full animate-spin shadow-2xl shadow-primary-green/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Building2 size={24} className="text-primary-green" />
        </div>
      </div>
      <p className="text-sm font-black uppercase tracking-[0.3em] text-primary-dark/40 animate-pulse">Initializing Data Stream</p>
    </div>
  );
}
