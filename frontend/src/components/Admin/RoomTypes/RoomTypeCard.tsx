import { Edit2, Trash2, LayoutGrid } from 'lucide-react';
import { Button } from '../../ui/Button';
import { getImageUrl } from '../../../services/api';
import type { RoomType } from '../../../services/roomTypeService';

interface RoomTypeCardProps {
  roomType: RoomType;
  onEdit: (roomType: RoomType) => void;
  onDelete: (id: number) => void;
  animationDelay?: string | number;
}

export function RoomTypeCard({ roomType, onEdit, onDelete, animationDelay }: RoomTypeCardProps) {
  return (
    <div
      className="room-type-card-animate"
      {...(animationDelay ? { 'data-delay': animationDelay } : {})}
      ref={(el) => { if (el && animationDelay) el.style.setProperty('--animation-delay', typeof animationDelay === 'number' ? `${animationDelay}ms` : animationDelay); }}
    >
      <div className="group bg-white rounded-[32px] overflow-hidden shadow-soft border border-neutral-border/20 hover:shadow-xl transition-all duration-500 flex flex-col h-full">
        <div className="relative h-48 overflow-hidden bg-neutral-light">
          {roomType.image ? (
            <img 
              src={getImageUrl(roomType.image || '')} 
              alt={roomType.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-border opacity-50">
              <LayoutGrid size={48} />
            </div>
          )}
          
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg bg-primary-gold text-white">
              Active
            </span>
          </div>

          <div className="absolute bottom-4 right-4 flex gap-2 translate-y-12 group-hover:translate-y-0 transition-transform duration-300">
            <button 
              onClick={() => onEdit(roomType)}
              title="Edit Room Type"
              className="p-2.5 rounded-xl bg-white/90 backdrop-blur-md text-primary-green shadow-xl hover:bg-primary-green hover:text-white transition-all"
            >
              <Edit2 size={16} />
            </button>
            <button 
              onClick={() => onDelete(roomType.id)}
              title="Delete Room Type"
              className="p-2.5 rounded-xl bg-white/90 backdrop-blur-md text-error-red shadow-xl hover:bg-error-red hover:text-white transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        
        <div className="p-6 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-gold">Room Category</p>
            <p className="text-[10px] font-black text-neutral-text-secondary">ID: {roomType.id}</p>
          </div>
          <h3 className="text-lg font-black text-neutral-text-primary leading-tight mb-4 group-hover:text-primary-green transition-colors">{roomType.name}</h3>
          
          <p className="text-xs font-bold text-neutral-text-secondary/80 leading-relaxed line-clamp-3 mb-6 h-12">
            {roomType.description || "No description provided for this room category. Update the details to inform guests about the features of this suite."}
          </p>

          <div className="mt-auto pt-4 border-t border-neutral-border/10 flex justify-between items-center">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-neutral-text-secondary mb-0.5">Last Sync</p>
              <p className="text-sm font-black text-primary-dark">{roomType.updatedAt ? new Date(roomType.updatedAt).toLocaleDateString() : 'N/A'}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-10 rounded-xl font-black text-[10px] uppercase tracking-widest border-neutral-border/50 hover:bg-primary-green hover:text-white transition-all"
            >
              View Rooms
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
