import { LayoutGrid, Users, BedDouble } from 'lucide-react';
import { EditIconButton, DeleteIconButton } from '../../ui/ActionIconButton';
import { Button } from '../../ui/Button';
import { getImageUrl } from '../../../services/api';
import type { Room } from '../../../services/roomService';

interface RoomInventoryCardProps {
  room: Room;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onViewDetails: (id: number) => void;
}

export function RoomInventoryCard({ room, onEdit, onDelete, onViewDetails }: RoomInventoryCardProps) {
  const primaryImage = room.images?.find(img => img.isPrimary)?.url || room.images?.[0]?.url;
  const imageUrl = primaryImage ? getImageUrl(primaryImage) : null;

  return (
    <div className="group bg-white rounded-[32px] overflow-hidden shadow-soft border border-neutral-border/20 hover:shadow-xl transition-all duration-500 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden bg-neutral-light">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={room.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-border opacity-50">
            <LayoutGrid size={48} />
          </div>
        )}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${
            room.status === 'available' ? 'bg-primary-green text-white' : 
            room.status === 'occupied' ? 'bg-primary-gold text-white' : 
            'bg-neutral-text-secondary text-white'
          }`}>
            {room.status}
          </span>
        </div>
        <div className="absolute bottom-4 right-4 flex gap-2 translate-y-12 group-hover:translate-y-0 transition-transform duration-300">
          <EditIconButton onClick={() => onEdit(room.id)} title="Edit Room" />
          <DeleteIconButton onClick={() => onDelete(room.id)} title="Delete Room" />
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-gold">{room.roomType?.name || 'Uncategorized'}</p>
          <p className="text-[10px] font-black text-neutral-text-secondary">#{room.roomNumber}</p>
        </div>
        <h3 className="text-lg font-black text-neutral-text-primary leading-tight mb-4 group-hover:text-primary-green transition-colors">{room.name}</h3>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-text-secondary bg-neutral-light/50 p-2 rounded-xl">
            <Users size={14} className="text-primary-green" />
            <span>{room.capacity} Guests</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-text-secondary bg-neutral-light/50 p-2 rounded-xl">
            <BedDouble size={14} className="text-primary-gold" />
            <span className="truncate">{room.bedType || 'Queen'}</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-neutral-border/10 flex justify-between items-center">
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-neutral-text-secondary mb-0.5">Base Rate</p>
            <p className="text-lg font-black text-primary-dark">Rs. {Number(room.basePrice).toLocaleString()}</p>
          </div>
          <Button 
            onClick={() => onViewDetails(room.id)}
            variant="outline" 
            size="sm" 
            className="h-10 rounded-xl font-black text-[10px] uppercase tracking-widest border-neutral-border/50 hover:bg-primary-green hover:text-white transition-all"
          >
            Details
          </Button>
        </div>
      </div>
    </div>
  );
}
