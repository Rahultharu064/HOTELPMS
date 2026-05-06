import React, { useState } from 'react';
// Force Vite Recompile
import { useForm } from 'react-hook-form';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Input } from '../../ui/Input';
import type { RoomType } from '../../../services/roomTypeService';
import { Image as ImageIcon, Type, AlignLeft, Save, X, Upload, Trash2 } from 'lucide-react';
import { getImageUrl } from '../../../services/api';


interface RoomTypeFormProps {
  initialData?: RoomType;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function RoomTypeForm({ initialData, onSubmit, onCancel, isLoading }: RoomTypeFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);
  const { register, handleSubmit, formState: { errors } } = useForm<Partial<RoomType>>({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (data: Partial<RoomType>) => {
    const formData = new FormData();
    formData.append('name', data.name || '');
    formData.append('description', data.description || '');
    
    const imageFile = (document.getElementById('image-upload') as HTMLInputElement).files?.[0];
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden border-none shadow-premium bg-white">
      <div className="bg-gradient-to-r from-primary-green to-primary-dark px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Type className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {initialData ? 'Update Room Type' : 'Create New Room Type'}
              </h2>
              <p className="text-xs font-medium text-white/70 uppercase tracking-widest mt-0.5">
                Room Classification & Details
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-all"
            title="Close form"
            aria-label="Close form"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-text-secondary ml-1 flex items-center gap-2">
                <Type size={12} className="text-primary-green" /> Room Type Name
              </label>
              <Input
                {...register('name', { required: 'Room type name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
                placeholder="e.g. Deluxe Suite, Executive Suite"
                className={`bg-neutral-light border-none focus:ring-2 focus:ring-primary-green transition-all duration-300 h-12 rounded-xl font-medium ${errors.name ? 'ring-2 ring-error-red' : ''}`}
              />
              {errors.name && <p className="text-[10px] font-bold text-error-red mt-1 ml-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-text-secondary ml-1 flex items-center gap-2">
                <AlignLeft size={12} className="text-primary-green" /> Description
              </label>
              <textarea
                {...register('description')}
                rows={5}
                placeholder="Provide a detailed description of the room type amenities, capacity, and special features..."
                className="w-full px-4 py-3 bg-neutral-light border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-green transition-all duration-300 font-medium resize-none shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-text-secondary ml-1 flex items-center gap-2">
              <ImageIcon size={12} className="text-primary-green" /> Room Type Image
            </label>
            
            <div className="relative group">
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              
              <label 
                htmlFor="image-upload"
                className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-[32px] cursor-pointer transition-all duration-500 overflow-hidden relative
                  ${imagePreview ? 'border-primary-green bg-white shadow-xl' : 'border-neutral-border bg-neutral-light hover:bg-neutral-border/20'}`}
              >
                {imagePreview ? (
                  <>
                    <img 
                      src={imagePreview.startsWith('data:') ? imagePreview : getImageUrl(imagePreview)} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary-dark shadow-xl scale-90 group-hover:scale-100 transition-transform">
                          <Upload size={20} />
                        </div>
                        <button 
                          type="button" 
                          onClick={(e) => {
                            e.preventDefault();
                            setImagePreview(null);
                            (document.getElementById('image-upload') as HTMLInputElement).value = '';
                          }}
                          className="w-12 h-12 rounded-full bg-error-red flex items-center justify-center text-white shadow-xl scale-90 group-hover:scale-100 transition-transform"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-soft flex items-center justify-center text-neutral-text-secondary mb-4 group-hover:scale-110 group-hover:text-primary-green transition-all">
                      <Upload size={24} />
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest text-neutral-text-primary mb-1">Click to Upload</p>
                    <p className="text-[10px] font-bold text-neutral-text-secondary/60 uppercase tracking-wider">PNG, JPG or WebP (Max 10MB)</p>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-neutral-border">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="rounded-xl px-6 h-12 text-sm font-bold uppercase tracking-widest text-neutral-text-secondary hover:bg-neutral-light transition-all"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-primary-dark hover:bg-black text-white px-8 h-12 rounded-xl text-sm font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary-dark/20 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save size={18} className="group-hover:scale-110 transition-transform" />
                <span>{initialData ? 'Update Room Type' : 'Create Room Type'}</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
