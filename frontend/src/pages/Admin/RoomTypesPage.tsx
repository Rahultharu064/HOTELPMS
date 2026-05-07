import { useEffect, useState } from 'react';
// Force Vite Recompile
import type { RoomType } from '../../services/roomTypeService';
import { roomTypeService } from '../../services/roomTypeService';
import { RoomTypeForm } from '../../components/Admin/RoomTypes/RoomTypeForm';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Plus, Search, ArrowUpDown, Filter, Building2, LayoutGrid, List as ListIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { RoomTypeCard } from '../../components/Admin/RoomTypes/RoomTypeCard';
import { RoomTypeTableEntry } from '../../components/Admin/RoomTypes/RoomTypeTableEntry';
import { RoomTypesEmptyState } from '../../components/Admin/RoomTypes/RoomTypesEmptyState';
import { RoomTypesLoadingState } from '../../components/Admin/RoomTypes/RoomTypesLoadingState';


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
        <RoomTypesLoadingState />
      ) : filteredRoomTypes.length === 0 ? (
        <RoomTypesEmptyState onCreate={() => handleOpenModal()} />
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8' : 'flex flex-col gap-4'}>
          {filteredRoomTypes.map((roomType, index) => (
            viewMode === 'grid' ? (
              <RoomTypeCard 
                key={roomType.id}
                roomType={roomType}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
                animationDelay={`${index * 50}ms`}
              />
            ) : (
              <RoomTypeTableEntry 
                key={roomType.id}
                roomType={roomType}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
              />
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
