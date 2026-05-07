import { useState, useEffect } from 'react';
import CreateRoom from '../../components/Admin/Dashboard/CreateRoom';
import { Button } from '../../components/ui/Button';
import { Plus, LayoutGrid, List as ListIcon, Search, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { roomService } from '../../services/roomService';
import type { Room } from '../../services/roomService';
import { toast } from 'react-hot-toast';
import { RoomInventoryCard } from '../../components/Admin/Rooms/RoomInventoryCard';
import { RoomsEmptyState } from '../../components/Admin/Rooms/RoomsEmptyState';
import { RoomsLoadingState } from '../../components/Admin/Rooms/RoomsLoadingState';


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
              <RoomsLoadingState />
            ) : filteredRooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredRooms.map((room) => (
                  <RoomInventoryCard 
                    key={room.id}
                    room={room}
                    onEdit={(id) => navigate(`/admin/rooms/edit/${id}`)}
                    onDelete={handleDeleteRoom}
                    onViewDetails={(id) => navigate(`/admin/rooms/${id}`)}
                  />
                ))}
              </div>
            ) : (
              <RoomsEmptyState />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
