import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { extraServiceManagement, type ExtraService } from '../../services/extraServiceManagement';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  onSuccess: () => void;
}

export const OrderExtraServiceModal: React.FC<Props> = ({
  isOpen, onClose, booking, onSuccess
}) => {
  const [services, setServices] = useState<ExtraService[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [loadingServices, setLoadingServices] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchServices();
      setSelectedServiceId('');
      setQuantity(1);
    }
  }, [isOpen]);

  const fetchServices = async () => {
    try {
      setLoadingServices(true);
      const res = await extraServiceManagement.getAll();
      if (res.success && res.data) {
        setServices(res.data);
      }
    } catch (error: any) {
      toast.error('Failed to load extra services');
    } finally {
      setLoadingServices(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServiceId || !booking) return;

    try {
      setIsSubmitting(true);
      const res = await extraServiceManagement.addToBooking({
        bookingId: booking.id,
        extraServiceId: Number(selectedServiceId),
        quantity
      });
      if (res.success) {
        toast.success('Service ordered successfully');
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to order service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedService = services.find(s => s.id === Number(selectedServiceId));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Order Service for Room ${booking?.room?.roomNumber || ''}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Select Service</label>
          {loadingServices ? (
            <div className="flex justify-center p-4"><Loader2 className="animate-spin text-gray-400" /></div>
          ) : (
            <Select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(Number(e.target.value))}
              options={[
                { value: '', label: 'Select a service...' },
                ...services.map(s => ({
                  value: s.id,
                  label: `${s.name} - $${s.price}`
                }))
              ]}
              required
            />
          )}
        </div>

        {selectedService && (
          <div>
            <Input
              label="Quantity"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />
            <div className="mt-4 p-4 bg-gray-50 rounded-xl flex justify-between items-center">
              <span className="font-semibold text-gray-600">Estimated Total:</span>
              <span className="text-xl font-bold text-[#1F7A3A]">
                ${(Number(selectedService.price) * quantity).toFixed(2)}
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            className="flex-1 bg-white border border-gray-200 text-gray-800 hover:bg-gray-50"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-[#111827] hover:bg-[#F59E0B] text-white border-none"
            disabled={!selectedServiceId || isSubmitting}
          >
            {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : 'Confirm Order'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
