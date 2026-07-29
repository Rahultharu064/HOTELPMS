import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  BedDouble,
  Users,
  Maximize,
  CheckCircle2,
  Clock,
  AlertTriangle,
  LayoutGrid,
  Layers,
  Sparkles,
  Plus,
} from 'lucide-react';
import { roomService } from '../../services/roomService';
import type { Room, RoomStatus } from '../../services/roomService';
import { getImageUrl } from '../../services/api';
import { AdminDetailPageSkeleton } from '../../components/ui/skeletons/AdminSkeletons';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import type { BadgeVariant } from '../../components/ui/Badge';
import { toast } from 'react-hot-toast';

const STATUS_VARIANT: Record<RoomStatus, BadgeVariant> = {
  available: 'success',
  occupied: 'warning',
  cleaning: 'info',
  reserved: 'gold',
  maintenance: 'danger',
  out_of_service: 'danger',
};

export default function RoomDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const res = await roomService.getRoomById(Number(id));
        if (res.success) {
          setRoom(res.data);
        } else {
          toast.error('Room not found');
          navigate('/admin/rooms');
        }
      } catch {
        toast.error('Failed to load room details');
        navigate('/admin/rooms');
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this room? This cannot be undone.')) return;
    try {
      await roomService.deleteRoom(Number(id));
      toast.success('Room deleted successfully');
      navigate('/admin/rooms');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete room';
      toast.error(message);
    }
  };

  if (loading) {
    return <AdminDetailPageSkeleton />;
  }

  if (!room) return null;

  const primaryImage = room.images?.find(img => img.isPrimary)?.url || room.images?.[0]?.url;
  const imageUrl = primaryImage ? getImageUrl(primaryImage) : null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-fade-in">
      {/* Header Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate('/admin/rooms')}
            className="w-11 h-11 rounded-xl bg-white shadow-sm border border-neutral-border/60 flex items-center justify-center hover:bg-neutral-light transition-all"
          >
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">{room.name}</h1>
            <p className="text-neutral-text-secondary text-[12px] mt-0.5">Room No. {room.roomNumber}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate(`/admin/rooms/edit/${room.id}`)}
            className="h-11 px-6 rounded-xl bg-primary-dark text-white font-semibold text-[13px] flex items-center gap-2 shadow-sm hover:bg-primary-green transition-all"
          >
            <Edit2 size={16} /> Edit Room
          </Button>
          <Button
            onClick={handleDelete}
            className="h-11 px-6 rounded-xl bg-red-50 border border-red-200 text-red-600 font-semibold text-[13px] flex items-center gap-2 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
          >
            <Trash2 size={16} /> Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Visuals & Highlights */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="overflow-hidden rounded-2xl border border-neutral-border/60 shadow-sm bg-white">
             <div className="relative aspect-video bg-neutral-light">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={room.name}
                    className="w-full h-full object-cover"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-border">
                    <LayoutGrid size={64} />
                  </div>
                )}
                <div className="absolute top-5 left-5">
                   <Badge variant={STATUS_VARIANT[room.status]} size="md">{room.status.replace('_', ' ')}</Badge>
                </div>
             </div>

             <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                   <div>
                      <p className="text-[12px] font-semibold text-primary-gold mb-1">{room.roomType?.name}</p>
                      <h2 className="text-2xl font-bold text-foreground tracking-tight">{room.name}</h2>
                   </div>
                   <div className="text-right">
                      <p className="text-[11px] text-neutral-text-secondary mb-0.5">Nightly rate</p>
                      <p className="text-xl font-bold text-primary-dark">Rs. {Number(room.basePrice).toLocaleString()}</p>
                   </div>
                </div>

                <p className="text-neutral-text-secondary leading-relaxed text-[14px]">
                  {room.description || "No description provided for this room."}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 pt-5 border-t border-neutral-border/40">
                   <div className="space-y-1">
                      <p className="text-[11px] text-neutral-text-secondary">Capacity</p>
                      <div className="flex items-center gap-1.5 font-semibold text-[13px] text-foreground">
                         <Users size={15} className="text-primary-dark" /> {room.capacity} Guests
                      </div>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[11px] text-neutral-text-secondary">Bed Type</p>
                      <div className="flex items-center gap-1.5 font-semibold text-[13px] text-foreground capitalize">
                         <BedDouble size={15} className="text-primary-gold" /> {room.bedType || '—'}
                      </div>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[11px] text-neutral-text-secondary">Size</p>
                      <div className="flex items-center gap-1.5 font-semibold text-[13px] text-foreground">
                         <Maximize size={15} className="text-blue-500" /> {room.size || '--'} sq ft
                      </div>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[11px] text-neutral-text-secondary">Floor</p>
                      <div className="flex items-center gap-1.5 font-semibold text-[13px] text-foreground">
                         <Layers size={15} className="text-purple-500" /> {room.floor ?? '—'}
                      </div>
                   </div>
                </div>
             </div>
          </Card>

          {/* Gallery / More Images */}
          <div className="grid grid-cols-3 gap-4">
             {room.images?.filter(img => !img.isPrimary).map(img => (
                <div key={img.id} className="aspect-square rounded-xl overflow-hidden bg-neutral-light border border-neutral-border/40">
                   <img
                     src={getImageUrl(img.url)}
                     className="w-full h-full object-cover"
                     alt="Room"
                     loading="lazy"
                     decoding="async"
                   />
                </div>
             ))}
             <button
               onClick={() => navigate(`/admin/rooms/edit/${room.id}`)}
               className="aspect-square rounded-xl border-2 border-dashed border-neutral-border flex flex-col items-center justify-center gap-2 text-neutral-text-secondary hover:bg-neutral-light hover:border-primary-dark hover:text-primary-dark transition-all"
             >
                <Plus size={20} />
                <span className="text-[11px] font-medium">Manage photos</span>
             </button>
          </div>
        </div>

        {/* Right Column: Status & Amenities */}
        <div className="space-y-8">
           <Card className="p-6 rounded-2xl border border-neutral-border/60 shadow-sm bg-white space-y-5">
              <h3 className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                 <Sparkles size={16} className="text-primary-gold" /> Amenities
              </h3>
              <div className="space-y-2.5">
                 {room.amenities?.map(a => (
                    <div key={a.id} className="flex items-center gap-3 p-3 bg-neutral-light rounded-xl">
                       <CheckCircle2 size={16} className="text-primary-green shrink-0" />
                       <span className="font-medium text-[13px] text-foreground">{a.name}</span>
                    </div>
                 ))}
                 {(!room.amenities || room.amenities.length === 0) && (
                    <p className="text-[13px] text-neutral-text-secondary">No amenities listed.</p>
                 )}
              </div>
           </Card>

           <Card className="p-6 rounded-2xl border border-neutral-border/60 shadow-sm bg-white space-y-5">
              <h3 className="text-sm font-semibold text-primary-dark flex items-center gap-2">
                 <Clock size={16} className="text-primary-dark" /> Activity
              </h3>
              <div className="space-y-4">
                 <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary-green mt-1.5 shrink-0" />
                    <div>
                       <p className="text-[12px] font-semibold text-primary-dark">Room created</p>
                       <p className="text-[12px] text-neutral-text-secondary mt-0.5">{room.createdAt ? new Date(room.createdAt).toLocaleDateString() : '—'}</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-neutral-border mt-1.5 shrink-0" />
                    <div>
                       <p className="text-[12px] font-semibold text-neutral-text-secondary">Last modified</p>
                       <p className="text-[12px] text-neutral-text-secondary mt-0.5">{room.updatedAt ? new Date(room.updatedAt).toLocaleDateString() : '—'}</p>
                    </div>
                 </div>
              </div>
           </Card>

           <div className="bg-foreground p-6 rounded-2xl text-white space-y-4 shadow-sm">
              <AlertTriangle className="text-primary-gold" size={22} />
              <h4 className="text-[15px] font-bold">Housekeeping note</h4>
              <p className="text-white/50 text-[13px] leading-relaxed">This room is currently marked <span className="text-white font-semibold">{room.status.replace('_', ' ')}</span>.</p>
              <button
                onClick={() => navigate(`/admin/rooms/edit/${room.id}`)}
                className="w-full py-2.5 bg-white/10 hover:bg-white/15 rounded-lg text-[12px] font-semibold transition-all"
              >
                 Update status
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
