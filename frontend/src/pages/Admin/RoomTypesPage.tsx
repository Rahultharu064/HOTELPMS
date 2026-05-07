import { useEffect, useState } from 'react';
// Force Vite Recompile
import type { RoomType } from '../../services/roomTypeService';
import { roomTypeService } from '../../services/roomTypeService';
import { RoomTypeForm } from '../../components/Admin/RoomTypes/RoomTypeForm';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Plus, Edit2, Trash2, Search, ArrowUpDown, Filter, Building2, LayoutGrid, List as ListIcon, ImageOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getImageUrl } from '../../services/api';


export default function RoomTypesPage() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingRoomType, setEditingRoomType] = useState<RoomType | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchRoomTypes = async () => {
    setIsLoading(true);
    try {
      const response = await roomTypeService.getAllRoomTypes();
      if (response.success && response.data) {
        setRoomTypes(response.data.roomTypes || []);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch room types');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const handleCreateOrUpdate = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      if (editingRoomType) {
        const response = await roomTypeService.updateRoomType(editingRoomType.id, data);
        if (response.success) {
          toast.success('Room type updated successfully');
          fetchRoomTypes();
          handleCloseModal();
        }
      } else {
        const response = await roomTypeService.createRoomType(data);
        if (response.success) {
          toast.success('Room type created successfully');
          fetchRoomTypes();
          handleCloseModal();
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save room type');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this room type?')) return;
    
    try {
      const response = await roomTypeService.deleteRoomType(id);
      if (response.success) {
        toast.success('Room type deleted successfully');
        fetchRoomTypes();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete room type');
    }
  };

  const handleOpenModal = (roomType?: RoomType) => {
    setEditingRoomType(roomType);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRoomType(undefined);
  };

  const filteredRoomTypes = roomTypes.filter(rt => 
    rt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (rt.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-10 p-2 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/40 backdrop-blur-sm p-6 md:p-8 rounded-[32px] border border-white/20 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-[24px] bg-primary-dark flex items-center justify-center shadow-2xl shadow-primary-dark/20 text-white transform hover:rotate-6 transition-transform">
            <Building2 size={32} strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-black text-neutral-text-primary tracking-tight truncate">Room Categories</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-primary-green animate-pulse" />
              <p className="text-[10px] font-black text-neutral-text-secondary uppercase tracking-[0.2em] opacity-80">
                Inventory Configuration
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={() => handleOpenModal()}
          className="bg-primary-dark hover:bg-black text-white px-8 h-14 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary-dark/20 flex items-center gap-3 overflow-hidden relative group"
        >
          <div className="absolute top-0 right-0 w-12 h-12 bg-white/10 rounded-full -mr-6 -mt-6 transition-all duration-500 group-hover:scale-150 group-hover:bg-white/20" />
          <Plus size={18} className="relative z-10 stroke-[3]" />
          <span className="relative z-10 transition-transform group-hover:translate-x-1">Create Category</span>
        </Button>
      </div>

      {/* Controls Bar */}
      <Card className="p-4 border-none shadow-soft bg-white/60 backdrop-blur-md rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-[400px] group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={18} className="text-neutral-text-secondary transition-colors group-focus-within:text-primary-green" />
          </div>
          <input
            type="text"
            placeholder="Search room types by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 h-12 bg-neutral-light border-none rounded-2xl focus:ring-2 focus:ring-primary-green transition-all duration-300 text-sm font-bold placeholder:text-neutral-text-secondary/50 shadow-inner"
          />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center bg-neutral-light p-1 rounded-2xl shadow-inner h-12">
            <Button
              onClick={() => setViewMode('grid')}
              className={`p-2 px-4 rounded-xl transition-all duration-300 flex items-center gap-2 text-xs font-black uppercase tracking-widest ${viewMode === 'grid' ? 'bg-primary-green text-white shadow-md' : 'text-neutral-text-secondary hover:text-primary-green hover:bg-white/50'}`}
            >
              <LayoutGrid size={14} className={viewMode === 'grid' ? 'stroke-[3]' : ''} />
              <span className="hidden sm:inline">Grid</span>
            </Button>
            <Button
              onClick={() => setViewMode('list')}
              className={`p-2 px-4 rounded-xl transition-all duration-300 flex items-center gap-2 text-xs font-black uppercase tracking-widest ${viewMode === 'list' ? 'bg-primary-green text-white shadow-md' : 'text-neutral-text-secondary hover:text-primary-green hover:bg-white/50'}`}
            >
              <ListIcon size={14} className={viewMode === 'list' ? 'stroke-[3]' : ''} />
              <span className="hidden sm:inline">List</span>
            </Button>
          </div>

          <Button variant="ghost" className="h-12 w-12 rounded-2xl bg-neutral-light hover:bg-white shadow-soft transition-all">
            <Filter size={18} className="text-neutral-text-secondary" />
          </Button>
          <Button variant="ghost" className="h-12 w-12 rounded-2xl bg-neutral-light hover:bg-white shadow-soft transition-all">
            <ArrowUpDown size={18} className="text-neutral-text-secondary" />
          </Button>
        </div>
      </Card>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="h-[400px] w-full flex flex-col items-center justify-center gap-6 animate-in fade-in duration-500">
           <div className="relative">
             <div className="w-20 h-20 border-4 border-primary-green/20 border-t-primary-green rounded-full animate-spin shadow-2xl shadow-primary-green/20" />
             <div className="absolute inset-0 flex items-center justify-center">
               <Building2 size={24} className="text-primary-green" />
             </div>
           </div>
           <p className="text-sm font-black uppercase tracking-[0.3em] text-primary-dark/40 animate-pulse">Initializing Data Stream</p>
        </div>
      ) : filteredRoomTypes.length === 0 ? (
        <Card className="h-[400px] border-dashed border-4 border-neutral-border bg-white/40 flex flex-col items-center justify-center text-center p-10 group transition-all duration-500 hover:bg-white/80">
          <div className="w-24 h-24 bg-neutral-light rounded-full flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-primary-dark/5">
            <Building2 size={40} className="text-neutral-text-secondary group-hover:text-primary-dark transition-colors" />
          </div>
          <h3 className="text-2xl font-black text-neutral-text-primary tracking-tight mb-3">No Room Types Found</h3>
          <p className="text-sm font-bold text-neutral-text-secondary/70 uppercase tracking-widest max-w-[320px] leading-relaxed mb-8">
            You haven't added any room categories to your inventory yet.
          </p>
          <Button
            onClick={() => handleOpenModal()}
            className="bg-primary-dark hover:bg-black text-white px-10 h-14 rounded-2xl text-sm font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary-dark/20"
          >
            Start Building Inventory
          </Button>
        </Card>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8' : 'flex flex-col gap-4'}>
          {filteredRoomTypes.map((roomType, index) => (
            viewMode === 'grid' ? (
              <div key={roomType.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${index * 50}ms` }}>
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
                         onClick={() => handleOpenModal(roomType)}
                         title="Edit Room Type"
                         className="p-2.5 rounded-xl bg-white/90 backdrop-blur-md text-primary-green shadow-xl hover:bg-primary-green hover:text-white transition-all"
                        >
                         <Edit2 size={16} />
                       </button>
                       <button 
                         onClick={() => handleDelete(roomType.id)}
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
            ) : (
              <Card key={roomType.id} className="group p-4 border-none shadow-soft hover:shadow-premium bg-white rounded-2xl flex items-center justify-between transition-all duration-300">
                <div className="flex items-center gap-6">
                  {roomType.image ? (
                    <img 
                      src={getImageUrl(roomType.image || '')} 
                      className="w-16 h-16 rounded-xl object-cover" 
                      alt={roomType.name} 
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-neutral-light flex items-center justify-center"><ImageOff size={20} className="text-neutral-text-secondary/40" /></div>
                  )}
                  <div>
                    <h3 className="font-black text-neutral-text-primary text-sm tracking-tight">{roomType.name}</h3>
                    <p className="text-xs font-bold text-neutral-text-secondary/60 line-clamp-1">{roomType.description || 'No description'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={() => handleOpenModal(roomType)} variant="ghost" className="h-10 w-10 p-0 rounded-xl bg-primary-green/10 text-primary-green hover:bg-primary-green hover:text-white transition-all"><Edit2 size={16} /></Button>
                  <Button onClick={() => handleDelete(roomType.id)} variant="ghost" className="h-10 w-10 p-0 rounded-xl bg-error-red/10 text-error-red hover:bg-error-red hover:text-white transition-all"><Trash2 size={16} /></Button>
                </div>
              </Card>
            )
          ))}
        </div>
      )}

      {/* Modal for Form */}
      {isModalOpen && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal}
          title={editingRoomType ? 'Edit Room Type' : 'Create Room Type'}
        >
          <RoomTypeForm
            initialData={editingRoomType}
            onSubmit={handleCreateOrUpdate}
            onCancel={handleCloseModal}
            isLoading={isSubmitting}
          />
        </Modal>
      )}
    </div>
  );
}
