import { Edit2, Trash2, ImageOff } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { getImageUrl } from '../../../services/api';
import type { RoomType } from '../../../services/roomTypeService';

interface RoomTypeTableEntryProps {
  roomType: RoomType;
  onEdit: (roomType: RoomType) => void;
  onDelete: (id: number) => void;
}

export function RoomTypeTableEntry({ roomType, onEdit, onDelete }: RoomTypeTableEntryProps) {
  return (
    <Card className="group p-4 border-none shadow-soft hover:shadow-premium bg-white rounded-2xl flex items-center justify-between transition-all duration-300">
      <div className="flex items-center gap-6">
        {roomType.image ? (
          <img 
            src={getImageUrl(roomType.image || '')} 
            className="w-16 h-16 rounded-xl object-cover" 
            alt={roomType.name} 
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-neutral-light flex items-center justify-center">
            <ImageOff size={20} className="text-neutral-text-secondary/40" />
          </div>
        )}
        <div>
          <h3 className="font-black text-neutral-text-primary text-sm tracking-tight">{roomType.name}</h3>
          <p className="text-xs font-bold text-neutral-text-secondary/60 line-clamp-1">{roomType.description || 'No description'}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          onClick={() => onEdit(roomType)} 
          variant="ghost" 
          className="h-10 w-10 p-0 rounded-xl bg-primary-green/10 text-primary-green hover:bg-primary-green hover:text-white transition-all"
        >
          <Edit2 size={16} />
        </Button>
        <Button 
          onClick={() => onDelete(roomType.id)} 
          variant="ghost" 
          className="h-10 w-10 p-0 rounded-xl bg-error-red/10 text-error-red hover:bg-error-red hover:text-white transition-all"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </Card>
  );
}
