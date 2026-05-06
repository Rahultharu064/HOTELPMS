import { useState, useEffect } from 'react';
import CreateRoom from '../../components/Admin/Dashboard/CreateRoom';
import { Button } from '../../components/ui/Button';
import { Plus, LayoutGrid, List as ListIcon, Search, SlidersHorizontal, ArrowLeft, Trash2, Edit2, Loader2, BedDouble, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { roomService } from '../../services/roomService';
import type { Room } from '../../services/roomService';
import { getImageUrl } from '../../services/api';
import { toast } from 'react-hot-toast';


export default function RoomsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await roomService.getAllRooms();
      if (res.success) {
        setRooms(res.data);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleDeleteRoom = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      await roomService.deleteRoom(id);
      toast.success('Room deleted successfully');
      fetchRooms();
    } catch (error) {
      toast.error('Failed to delete room');
    }
  };

  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.roomType?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-10 max-w-[1400px] mx-auto space-y-10">
      {/* Header Section */}
      {!showCreateForm ? (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-neutral-text-primary tracking-tight">Room Inventory</h1>
            <p className="text-sm font-bold text-neutral-text-secondary uppercase tracking-[0.3em] flex items-center gap-2">
               Management System <span className="w-2 h-2 rounded-full bg-primary-green animate-pulse" /> Live
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex bg-white p-1 rounded-2xl shadow-soft border border-neutral-border/30">
               <Button className="p-2.5 rounded-xl bg-primary-green text-white shadow-lg transition-all"><LayoutGrid size={20} /></Button>
               <Button className="p-2.5 rounded-xl text-neutral-text-secondary hover:bg-neutral-light transition-all"><ListIcon size={20} /></Button>
             </div>
             <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-primary-green hover:bg-primary-dark text-white px-8 h-[52px] rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-primary-green/20 flex items-center gap-3 hover:scale-105 transition-all"
              >
                <Plus size={18} strokeWidth={3} />
                Add New Room
              </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4 animate-in slide-in-from-left-4 transition-all">
           <Button
            onClick={() => setShowCreateForm(false)}
            className="w-12 h-12 rounded-2xl bg-white shadow-soft border border-neutral-border/30 flex items-center justify-center hover:bg-neutral-light transition-all text-neutral-text-secondary hover:text-primary-green"
           >
             <ArrowLeft size={20} />
           </Button>
           <div>
             <h2 className="text-2xl font-black text-neutral-text-primary">Inventory Addition</h2>
             <p className="text-[10px] font-black uppercase tracking-widest text-primary-gold">Back to rooms list</p>
           </div>
        </div>
      )}

      {/* Content Area */}
      <div className="relative">
        {showCreateForm ? (
          <div className="animate-in fade-in slide-in-from-bottom-10 duration-500">
             <CreateRoom 
                onCancel={() => setShowCreateForm(false)} 
                onSuccess={() => {
                    setShowCreateForm(false);
                    fetchRooms();
                }}
             />
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4">
               <div className="flex-1 relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-text-secondary group-focus-within:text-primary-green transition-colors" size={18} />
                  <input 
                    placeholder="Search by room number, name, or type..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 h-[56px] bg-white border-none rounded-[20px] shadow-soft focus:ring-2 focus:ring-primary-green text-sm font-bold transition-all"
                  />
               </div>
               <button className="px-6 h-[56px] bg-white rounded-[20px] shadow-soft flex items-center gap-3 font-black text-[11px] uppercase tracking-widest text-neutral-text-secondary hover:bg-neutral-light transition-all border border-neutral-border/10">
                  <SlidersHorizontal size={18} />
                  Advanced Filters
               </button>
            </div>

            {/* List Content */}
            {loading ? (
              <div className="py-32 flex flex-col items-center justify-center space-y-4">
                 <Loader2 className="w-12 h-12 text-primary-green animate-spin" />
                 <p className="text-sm font-black uppercase tracking-widest text-neutral-text-secondary animate-pulse">Syncing Inventory...</p>
              </div>
            ) : filteredRooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredRooms.map((room) => {
                  const primaryImage = room.images?.find(img => img.isPrimary)?.url || room.images?.[0]?.url;
                  const imageUrl = primaryImage ? getImageUrl(primaryImage) : null;

                  return (
                    <div key={room.id} className="group bg-white rounded-[32px] overflow-hidden shadow-soft border border-neutral-border/20 hover:shadow-xl transition-all duration-500 flex flex-col">
                      <div className="relative h-48 overflow-hidden bg-neutral-light">
                        {imageUrl ? (
                          <img src={imageUrl} alt={room.name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
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
                           <button 
                             onClick={() => navigate(`/admin/rooms/edit/${room.id}`)}
                             title="Edit Room"
                             className="p-2.5 rounded-xl bg-white/90 backdrop-blur-md text-primary-dark shadow-xl hover:bg-primary-green hover:text-white transition-all"
                            >
                             <Edit2 size={16} />
                           </button>
                           <button 
                             onClick={() => handleDeleteRoom(room.id)}
                             title="Delete Room"
                             className="p-2.5 rounded-xl bg-white/90 backdrop-blur-md text-red-500 shadow-xl hover:bg-red-500 hover:text-white transition-all"
                            >
                             <Trash2 size={16} />
                           </button>
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
                             onClick={() => navigate(`/admin/rooms/${room.id}`)}
                             variant="outline" 
                             size="sm" 
                             className="h-10 rounded-xl font-black text-[10px] uppercase tracking-widest border-neutral-border/50"
                           >
                             Details
                           </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}
