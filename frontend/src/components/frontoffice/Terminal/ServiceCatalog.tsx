import React from 'react';
import { Search, Plus, Loader2, Zap } from 'lucide-react';
import { Button } from '../../ui/Button';

interface ServiceCatalogProps {
  services: any[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddService: (id: number) => void;
  isSubmitting: boolean;
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
}

export const ServiceCatalog: React.FC<ServiceCatalogProps> = ({
  services,
  searchQuery,
  onSearchChange,
  onAddService,
  isSubmitting,
}) => {
  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-[#111827] tracking-tight">Add Amenities</h2>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Post charges to folio</p>
        </div>
        <div className="relative w-full sm:w-64 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#111827] transition-colors" size={14} strokeWidth={3} />
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-white border border-gray-100 rounded-xl text-[12px] font-bold focus:outline-none focus:ring-4 focus:ring-[#111827]/5 focus:border-[#111827]/20 shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm hover:border-[#F59E0B]/20 transition-all group">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#F59E0B]/10 group-hover:text-[#F59E0B] transition-colors">
                  <Zap size={16} strokeWidth={2.5} />
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-300 bg-gray-50 px-2 py-0.5 rounded-md">{service.category}</span>
              </div>
              <h4 className="text-[13px] font-black text-[#111827] mb-0.5">{service.name}</h4>
              <p className="text-[9px] font-medium text-gray-400 line-clamp-1">{service.description || 'Standard luxury service.'}</p>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <span className="text-[14px] font-black text-[#111827]">Rs. {Number(service.price).toFixed(2)}</span>
              <Button 
                onClick={() => onAddService(service.id)}
                disabled={isSubmitting}
                className="h-8 w-8 p-0 rounded-lg bg-[#111827] text-white hover:bg-[#F59E0B] flex items-center justify-center shadow-md active:scale-90 border-none"
              >
                {isSubmitting ? <Loader2 size={12} className="animate-spin" /> : <Plus size={14} strokeWidth={3} />}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
