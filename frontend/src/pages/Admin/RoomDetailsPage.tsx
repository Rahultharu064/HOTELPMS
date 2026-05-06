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
  Loader2
} from 'lucide-react';
import { roomService } from '../../services/roomService';
import type { Room } from '../../services/roomService';
import { getImageUrl } from '../../services/api';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { toast } from 'react-hot-toast';

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
      } catch (error) {
        toast.error('Failed to load room details');
        navigate('/admin/rooms');
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this room? This cannot be undone.')) {
      try {
        await roomService.deleteRoom(Number(id));
        toast.success('Room deleted successfully');
        navigate('/admin/rooms');
      } catch (error) {
        toast.error('Failed to delete room');
      }
    }
  };

  if (loading) {
    return (
      <div className="py-40 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-[#14532D] animate-spin" />
        <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">Loading Room Profile...</p>
      </div>
    );
  }

  if (!room) return null;

  const primaryImage = room.images?.find(img => img.isPrimary)?.url || room.images?.[0]?.url;
  const imageUrl = primaryImage ? getImageUrl(primaryImage) : null;


  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-fade-in">
      {/* Header Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <Button 
            onClick={() => navigate('/admin/rooms')}
            className="w-12 h-12 rounded-2xl bg-white shadow-soft border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-black text-[#111827] tracking-tight uppercase flex items-center gap-4">
              <div className="w-2 h-8 bg-[#14532D] rounded-full" />
              Room Profile
            </h1>
            <p className="text-gray-400 text-[11px] font-black uppercase tracking-widest mt-1 ml-6">Room ID: {room.roomNumber}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={() => navigate(`/admin/rooms/edit/${room.id}`)}
            className="h-14 px-8 rounded-2xl bg-[#14532D] text-white font-black uppercase tracking-widest text-[11px] flex items-center gap-3 shadow-xl shadow-[#14532D]/10 hover:bg-[#111827] transition-all"
          >
            <Edit2 size={18} /> Edit Room
          </Button>
          <Button 
            onClick={handleDelete}
            className="h-14 px-8 rounded-2xl bg-white border border-red-100 text-red-500 font-black uppercase tracking-widest text-[11px] flex items-center gap-3 hover:bg-red-50 transition-all"
          >
            <Trash2 size={18} /> Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Visuals & Highlights */}
        <div className="lg:col-span-2 space-y-10">
          <Card className="overflow-hidden rounded-[40px] border-none shadow-soft bg-white">
             <div className="relative aspect-video bg-gray-100">
                {imageUrl ? (
                  <img src={imageUrl} alt={room.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-200">
                    <LayoutGrid size={64} />
                  </div>
                )}
                <div className="absolute top-8 left-8">
                   <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl backdrop-blur-md ${
                     room.status === 'available' ? 'bg-emerald-500/90 text-white' : 
                     room.status === 'occupied' ? 'bg-amber-500/90 text-white' : 
                     'bg-gray-500/90 text-white'
                   }`}>
                     {room.status}
                   </span>
                </div>
             </div>
             
             <div className="p-10 space-y-8">
                <div className="flex justify-between items-start">
                   <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#F59E0B] mb-2">{room.roomType?.name}</p>
                      <h2 className="text-4xl font-black text-[#111827] tracking-tight">{room.name}</h2>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Nightly Rate</p>
                      <p className="text-3xl font-black text-[#14532D]">Rs. {Number(room.basePrice).toLocaleString()}</p>
                   </div>
                </div>

                <p className="text-gray-500 leading-relaxed text-lg">
                  {room.description || "No description provided for this room entry."}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gray-50">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Capacity</p>
                      <div className="flex items-center gap-2 font-bold text-[#111827]">
                         <Users size={18} className="text-[#14532D]" /> {room.capacity} Guests
                      </div>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Bed Type</p>
                      <div className="flex items-center gap-2 font-bold text-[#111827]">
                         <BedDouble size={18} className="text-[#F59E0B]" /> {room.bedType || 'King Size'}
                      </div>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Size</p>
                      <div className="flex items-center gap-2 font-bold text-[#111827]">
                         <Maximize size={18} className="text-blue-500" /> {room.size || '--'} sq ft
                      </div>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Location</p>
                      <div className="flex items-center gap-2 font-bold text-[#111827]">
                         <Layers size={18} className="text-purple-500" /> Floor {room.floor}
                      </div>
                   </div>
                </div>
             </div>
          </Card>

          {/* Gallery / More Images */}
          <div className="grid grid-cols-3 gap-6">
             {room.images?.filter(img => !img.isPrimary).map(img => (
                <div key={img.id} className="aspect-square rounded-3xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-lg transition-all border border-gray-100">
                   <img src={getImageUrl(img.url)} className="w-full h-full object-cover" alt="Gallery" />
                </div>
             ))}
             <button className="aspect-square rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:bg-gray-50 hover:border-[#14532D] hover:text-[#14532D] transition-all">
                <Plus size={24} />
                <span className="text-[10px] font-black uppercase tracking-widest">Add Photo</span>
             </button>
          </div>
        </div>

        {/* Right Column: Status & Amenities */}
        <div className="space-y-10">
           <Card className="p-10 rounded-[40px] border-none shadow-soft bg-white space-y-8">
              <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                 <Sparkles size={18} className="text-[#F59E0B]" /> Amenities
              </h3>
              <div className="space-y-4">
                 {room.amenities?.map(a => (
                    <div key={a.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                       <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#14532D] shadow-sm">
                          <CheckCircle2 size={18} />
                       </div>
                       <span className="font-bold text-sm text-[#111827]">{a.name}</span>
                    </div>
                 ))}
                 {(!room.amenities || room.amenities.length === 0) && (
                    <p className="text-xs font-bold text-gray-400 italic">No specific amenities listed.</p>
                 )}
              </div>
           </Card>

           <Card className="p-10 rounded-[40px] border-none shadow-soft bg-white space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-1000" />
              <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 relative z-10">
                 <Clock size={18} className="text-[#14532D]" /> Operational Log
              </h3>
              <div className="space-y-6 relative z-10">
                 <div className="flex gap-4">
                    <div className="w-0.5 bg-gray-100 relative">
                       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#14532D]" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-[#14532D]">Room Created</p>
                       <p className="text-[12px] font-bold text-[#111827] mt-1">{new Date(room.createdAt || '').toLocaleDateString()}</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <div className="w-0.5 bg-gray-100 relative">
                       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gray-300" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Last Modified</p>
                       <p className="text-[12px] font-bold text-[#111827] mt-1">{new Date(room.updatedAt || '').toLocaleDateString()}</p>
                    </div>
                 </div>
              </div>
           </Card>

           <div className="bg-[#111827] p-10 rounded-[48px] text-white space-y-6 relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#14532D]/20 rounded-full blur-[80px] pointer-events-none" />
              <AlertTriangle className="text-[#F59E0B]" size={32} />
              <h4 className="text-xl font-black">Housekeeping Note</h4>
              <p className="text-white/40 text-sm leading-relaxed">This room is currently marked as <span className="text-white font-bold">{room.status}</span>. Ensure inventory checks are performed before the next check-in.</p>
              <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                 Update Status
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

const Plus = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
