import { useEffect, useState } from 'react';
import { extraServiceManagement } from '../../services/extraServiceManagement';
import type { ExtraService } from '../../services/extraServiceManagement';
import { ExtraServiceForm } from '../../components/Admin/ExtraServices/ExtraServiceForm';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Plus, Edit2, Trash2, Search, Filter, ImageOff, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ExtraServicesPage() {
  const [services, setServices] = useState<ExtraService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const BACKEND_URL = 'http://localhost:5000';
  const [editingService, setEditingService] = useState<ExtraService | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const response = await extraServiceManagement.getAll();
      if (response.success && response.data) {
        setServices(response.data);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch extra services');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleCreateOrUpdate = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      if (editingService) {
        const response = await extraServiceManagement.update(editingService.id, data);
        if (response.success) {
          toast.success('Service updated successfully');
          fetchServices();
          handleCloseModal();
        }
      } else {
        const response = await extraServiceManagement.create(data);
        if (response.success) {
          toast.success('Service created successfully');
          fetchServices();
          handleCloseModal();
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to deactivate this service?')) return;
    
    try {
      const response = await extraServiceManagement.delete(id);
      if (response.success) {
        toast.success('Service deactivated successfully');
        fetchServices();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to deactivate service');
    }
  };

  const handleOpenModal = (service?: ExtraService) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(undefined);
  };

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-10 p-2 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-3xl font-black text-[#111827] tracking-tight uppercase flex items-center gap-4">
            <div className="w-2 h-8 bg-[#14532D] rounded-full" />
            Extra Services
          </h1>
          <p className="text-gray-400 text-[11px] font-black uppercase tracking-[0.2em] mt-2 ml-6">Manage additional guest offerings & pricing</p>
        </div>

        <Button
          onClick={() => handleOpenModal()}
          className="bg-[#14532D] hover:bg-[#111827] text-white px-8 h-14 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-[#14532D]/10 flex items-center gap-3"
        >
          <Plus size={20} strokeWidth={3} /> Create Service Node
        </Button>
      </div>

      <Card className="p-4 border-none shadow-soft bg-white/60 backdrop-blur-md rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-[400px] group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={18} className="text-neutral-text-secondary" />
          </div>
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 h-12 bg-neutral-light border-none rounded-2xl focus:ring-2 focus:ring-primary-green transition-all duration-300 text-sm font-bold shadow-inner"
          />
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="h-12 w-12 rounded-2xl bg-neutral-light hover:bg-white shadow-soft transition-all">
            <Filter size={18} className="text-neutral-text-secondary" />
          </Button>
        </div>
      </Card>

      {isLoading ? (
        <div className="h-[400px] w-full flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary-green/20 border-t-primary-green rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredServices.map((service) => (
            <Card key={service.id} className="group overflow-hidden border-none shadow-soft hover:shadow-premium transition-all duration-500 flex flex-col h-full bg-white rounded-[40px]">
              <div className="relative h-48 overflow-hidden">
                {service.image ? (
                  <img 
                    src={service.image.startsWith('http') ? service.image : `${BACKEND_URL}${service.image}`} 
                    alt={service.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-light flex flex-col items-center justify-center gap-2">
                    <ImageOff size={32} className="text-neutral-text-secondary/20" />
                  </div>
                )}
                <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                  <Button onClick={() => handleOpenModal(service)} className="w-10 h-10 rounded-xl bg-white shadow-2xl hover:bg-primary-dark hover:text-white transition-all p-0 flex items-center justify-center">
                    <Edit2 size={16} />
                  </Button>
                  <Button onClick={() => handleDelete(service.id)} className="w-10 h-10 rounded-xl bg-white shadow-2xl hover:bg-error-red hover:text-white transition-all p-0 flex items-center justify-center">
                    <Trash2 size={16} />
                  </Button>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-primary-dark text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                    {service.category?.name || 'Uncategorized'}
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-lg font-black text-neutral-text-primary tracking-tight mb-1">{service.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-primary-green">NPR {service.price}</span>
                    {service.discountAllowed && Number(service.discountPercentage) > 0 && (
                      <span className="text-[10px] font-black text-white bg-error-red px-2 py-0.5 rounded-full uppercase tracking-tighter">
                        -{service.discountPercentage}% OFF
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs font-bold text-neutral-text-secondary/80 leading-relaxed line-clamp-2 mb-6 h-10">
                  {service.description}
                </p>
                <div className="mt-auto pt-4 border-t border-neutral-light flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${service.active ? 'text-primary-green' : 'text-error-red'}`}>
                    {service.active ? '● Active' : '● Inactive'}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-text-secondary/40">
                    ID: {service.id}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {isModalOpen && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal}
          title={editingService ? 'Edit Service' : 'Create Service'}
        >
          <ExtraServiceForm
            initialData={editingService}
            onSubmit={handleCreateOrUpdate}
            onCancel={handleCloseModal}
            isLoading={isSubmitting}
          />
        </Modal>
      )}
    </div>
  );
}
