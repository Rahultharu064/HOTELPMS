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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-dark flex items-center justify-center shadow-2xl shadow-primary-dark/20 text-white">
              <Building2 size={32} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-neutral-text-primary tracking-tight">Room Type Management</h1>
              <p className="text-sm font-bold text-neutral-text-secondary uppercase tracking-[0.2em] mt-1.5 opacity-80">
                Configure your hotel's room offerings
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={() => handleOpenModal()}
          className="bg-primary-dark hover:bg-black text-white px-8 h-14 rounded-2xl text-sm font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary-dark/20 flex items-center gap-3 overflow-hidden relative group"
        >
          <div className="absolute top-0 right-0 w-12 h-12 bg-white/10 rounded-full -mr-6 -mt-6 transition-all duration-500 group-hover:scale-150 group-hover:bg-white/20" />
          <Plus size={20} className="relative z-10 stroke-[3]" />
          <span className="relative z-10 transition-transform group-hover:translate-x-1">Create Room Type</span>
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
              className={`p-2 px-4 rounded-xl transition-all duration-300 flex items-center gap-2 text-xs font-black uppercase tracking-widest ${viewMode === 'grid' ? 'bg-white text-primary-dark shadow-sm' : 'text-neutral-text-secondary hover:text-primary-dark hover:bg-white/50'}`}
            >
              <LayoutGrid size={14} className={viewMode === 'grid' ? 'stroke-[3]' : ''} />
              <span className="hidden sm:inline">Grid</span>
            </Button>
            <Button
              onClick={() => setViewMode('list')}
              className={`p-2 px-4 rounded-xl transition-all duration-300 flex items-center gap-2 text-xs font-black uppercase tracking-widest ${viewMode === 'list' ? 'bg-white text-primary-dark shadow-sm' : 'text-neutral-text-secondary hover:text-primary-dark hover:bg-white/50'}`}
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
                <Card className="group overflow-hidden border-none shadow-soft hover:shadow-premium transition-all duration-500 flex flex-col h-full bg-white rounded-[32px]">
                <div className="relative h-56 overflow-hidden">
                  {roomType.image ? (
                    <img 
                      src={getImageUrl(roomType.image || '')} 
                      alt={roomType.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-light flex flex-col items-center justify-center gap-4 group-hover:bg-neutral-border/20 transition-colors">
                      <ImageOff size={48} className="text-neutral-text-secondary/20" strokeWidth={1.5} />
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-text-secondary/40">No Image Preview</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    <Button 
                      onClick={() => handleOpenModal(roomType)}
                      className="w-10 h-10 rounded-xl bg-white shadow-2xl hover:bg-primary-dark hover:text-[#1F7A3A] transition-all text-neutral-text-primary p-0 flex items-center justify-center"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button 
                      onClick={() => handleDelete(roomType.id)}
                      className="w-10 h-10 rounded-xl bg-white shadow-2xl hover:bg-error-red hover:text-[#1F7A3A] transition-all text-error-red p-0 flex items-center justify-center"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  <div className="absolute bottom-4 left-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F59E0B]">Verified Category</p>
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="text-xl font-black text-neutral-text-primary tracking-tight truncate group-hover:text-primary-green transition-colors">{roomType.name}</h3>
                    <div className="px-3 py-1 bg-primary-dark/5 text-primary-dark text-[10px] font-black uppercase tracking-widest rounded-full border border-primary-dark/10">ID: {roomType.id}</div>
                  </div>
                  <p className="text-xs font-bold text-neutral-text-secondary/80 leading-relaxed line-clamp-3 mb-8 h-12">
                    {roomType.description || "No description provided for this room category. Update the details to inform guests about the features of this suite."}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between border-t border-neutral-light pt-6">
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black uppercase tracking-widest text-neutral-text-secondary/40">Last Updated</span>
                       <span className="text-[11px] font-bold text-neutral-text-secondary">{roomType.updatedAt ? new Date(roomType.updatedAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="rounded-xl h-10 px-4 text-[10px] font-black uppercase tracking-widest text-primary-green hover:bg-primary-green/5 flex items-center gap-2 group/btn"
                    >
                      View Rooms <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Button>
                  </div>
                </div>
              </Card>
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
                  <Button onClick={() => handleOpenModal(roomType)} variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-neutral-light text-neutral-text-secondary"><Edit2 size={16} /></Button>
                  <Button onClick={() => handleDelete(roomType.id)} variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-error-red/10 text-error-red"><Trash2 size={16} /></Button>
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
