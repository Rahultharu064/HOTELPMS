import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Plus, 
  ImageIcon, 
  Video as VideoIcon, 
  Type, 
  Hash, 
  Layers, 
  Banknote, 
  Maximize2, 
  Users, 
  Baby, 
  Settings, 
  AlignLeft, 
  Sparkles,
  Save,
  X,
  Upload
} from 'lucide-react';
import { roomTypeService } from '../../../services/roomTypeService';
import { roomService } from '../../../services/roomService';
import type { RoomType } from '../../../services/roomTypeService';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { Modal } from '../../ui/Modal';
import { RoomTypeForm } from '../RoomTypes/RoomTypeForm';

const initialForm = {
  name: '',
  roomType: '',
  roomNumber: '',
  floor: '',
  price: '',
  size: '',
  maxAdults: '',
  maxChildren: '',
  numBeds: '',
  allowChildren: false,
  description: '',
  status: 'available',
  amenity: '',
};

export default function CreateRoom({ onCancel, onSuccess }: { onCancel: () => void; onSuccess?: () => void }) {
  const [form, setForm] = useState(initialForm);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loadingRoomTypes, setLoadingRoomTypes] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showRoomTypeModal, setShowRoomTypeModal] = useState(false);
  const [roomSequence, setRoomSequence] = useState('');

  const imgInputRef = useRef<HTMLInputElement>(null);
  const vidInputRef = useRef<HTMLInputElement>(null);

  // Compute prefix based on selected room type
  const roomPrefix = useMemo(() => {
    if (!form.roomType || !roomTypes.length) return '';
    const type = roomTypes.find(t => t.id === Number(form.roomType));
    // Fallback to first character of room type name if no code is provided
    return type?.name ? type.name.substring(0, 1).toUpperCase() : '';
  }, [form.roomType, roomTypes]);

  // Update room number when prefix or sequence changes
  useEffect(() => {
    if (roomPrefix && roomSequence) {
      setForm(prev => ({ ...prev, roomNumber: `${roomPrefix}${roomSequence}` }));
    } else if (roomSequence) {
      setForm(prev => ({ ...prev, roomNumber: roomSequence }));
    }
  }, [roomPrefix, roomSequence]);

  const fetchRoomTypes = async () => {
    try {
      setLoadingRoomTypes(true);
      const response = await roomTypeService.getAllRoomTypes();
      if (response.success) {
        setRoomTypes(response.data?.roomTypes || []);
      }
    } catch (error) {
      toast.error('Failed to load room types');
    } finally {
      setLoadingRoomTypes(false);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const handleCreateRoomType = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const resp = await roomTypeService.createRoomType(formData);
      if (resp.success) {
        toast.success('Room type created successfully');
        await fetchRoomTypes();
        setForm(prev => ({ ...prev, roomType: String(resp.data.id) }));
        setShowRoomTypeModal(false);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create room type');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const addAmenity = () => {
    const v = form.amenity.trim();
    if (!v) return;
    if (amenities.includes(v)) {
      toast.error('Amenity already added');
      return;
    }
    setAmenities(prev => [...prev, v]);
    setForm(prev => ({ ...prev, amenity: '' }));
  };

  const removeAmenity = (a: string) => setAmenities(prev => prev.filter(x => x !== a));

  const onImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const valid: File[] = [];
    for (const f of files) {
      if (!f.type.startsWith('image/')) {
        toast.error(`${f.name} is not an image`);
        continue;
      }
      valid.push(f);
    }
    setImages(prev => {
      const merged = [...prev, ...valid];
      const deduped: File[] = [];
      const seen = new Set();
      for (const f of merged) {
        const key = `${f.name}-${f.size}`;
        if (!seen.has(key)) {
          seen.add(key);
          deduped.push(f);
        }
      }
      if (deduped.length > 10) toast.error('Max 10 images allowed');
      return deduped.slice(0, 10);
    });
    if (imgInputRef.current) imgInputRef.current.value = '';
  };

  const onVideos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const valid: File[] = [];
    for (const f of files) {
      if (!f.type.startsWith('video/')) {
        toast.error(`${f.name} is not a video`);
        continue;
      }
      valid.push(f);
    }
    setVideos(prev => {
      const merged = [...prev, ...valid];
      const deduped: File[] = [];
      const seen = new Set();
      for (const f of merged) {
        const key = `${f.name}-${f.size}`;
        if (!seen.has(key)) {
          seen.add(key);
          deduped.push(f);
        }
      }
      if (deduped.length > 3) toast.error('Max 3 videos allowed');
      return deduped.slice(0, 3);
    });
    if (vidInputRef.current) vidInputRef.current.value = '';
  };

  const validateRequired = () => {
    const requiredFields: (keyof typeof initialForm)[] = ['name', 'roomType', 'roomNumber', 'floor', 'price', 'size', 'maxAdults', 'numBeds', 'description'];
    for (const field of requiredFields) {
      if (!String(form[field] ?? '').trim()) return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRequired()) {
      toast.error('Please fill all required fields');
      return;
    }
    if (images.length === 0) {
      toast.error('Please add at least one image');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('roomNumber', form.roomNumber);
      formData.append('roomTypeId', form.roomType);
      formData.append('floor', form.floor);
      formData.append('price', form.price);
      formData.append('size', form.size);
      formData.append('maxAdults', form.maxAdults);
      formData.append('maxChildren', form.allowChildren && form.maxChildren !== '' ? form.maxChildren : '0');
      formData.append('numBeds', form.numBeds);
      formData.append('allowChildren', String(form.allowChildren));
      formData.append('description', form.description);
      formData.append('status', form.status);
      formData.append('amenities', JSON.stringify(amenities));

      images.forEach(image => formData.append('images', image));
      videos.forEach(video => formData.append('videos', video));

      const response = await roomService.createRoom(formData);
      if (response.success) {
        toast.success('Room created successfully');
        onSuccess?.();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create room');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-5xl mx-auto overflow-hidden border-none shadow-premium bg-white rounded-[40px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-green to-primary-dark p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="relative z-10 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[24px] bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-2xl">
              <Plus className="text-white" size={32} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">Create New Room</h2>
              <p className="text-sm font-bold text-white/70 uppercase tracking-[0.3em] mt-1 flex items-center gap-2">
                <Sparkles size={14} className="text-primary-gold" /> Inventory Addition
              </p>
            </div>
          </div>
          <Button 
            onClick={onCancel} 
            title="Close modal"
            className="p-3 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-all backdrop-blur-md border border-white/10 shadow-lg"
          >
            <X size={24} />
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-10 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Left Column - General Info */}
          <div className="md:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-text-secondary ml-1 flex items-center gap-2">
                  <Type size={12} className="text-primary-green" /> Room Display Name
                </label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Deluxe Ocean View Suite"
                  className="bg-neutral-light border-none focus:ring-2 focus:ring-primary-green transition-all h-12 rounded-2xl font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-text-secondary ml-1 flex items-center gap-2">
                  <Layers size={12} className="text-primary-green" /> Room Type
                </label>
                <div className="flex gap-3">
                  <select
                    name="roomType"
                    title="Select room category"
                    value={form.roomType}
                    onChange={handleChange}
                    className="flex-1 px-4 h-12 bg-neutral-light border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-green font-bold text-sm shadow-inner transition-all"
                  >
                    <option value="">{loadingRoomTypes ? 'Loading types...' : 'Select Category'}</option>
                    {roomTypes.map((rt) => (
                      <option key={rt.id} value={rt.id}>{rt.name}</option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    onClick={() => setShowRoomTypeModal(true)}
                    className="h-12 w-12 rounded-2xl bg-primary-green text-white shadow-lg hover:scale-105 transition-transform"
                  >
                    <Plus size={20} />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[2px] text-neutral-text-secondary ml-1 flex items-center gap-2">
                  <Hash size={12} className="text-primary-green" /> Room Number
                </label>
                <div className="flex h-12 group transition-all">
                  {roomPrefix && (
                    <span className="flex items-center px-5 rounded-l-2xl bg-primary-dark/10 border border-transparent text-primary-dark text-sm font-black tracking-widest">
                      {roomPrefix}
                    </span>
                  )}
                  <input
                    name="roomSequence"
                    value={roomSequence}
                    onChange={(e) => setRoomSequence(e.target.value)}
                    placeholder="e.g. 101"
                    className={`flex-1 px-4 bg-neutral-light border-none focus:ring-2 focus:ring-primary-green font-bold text-sm shadow-inner outline-none transition-all ${!roomPrefix ? 'rounded-2xl' : 'rounded-r-2xl'}`}
                  />
                </div>
                {roomSequence && (
                    <p className="text-[10px] font-black text-primary-gold uppercase tracking-widest ml-1 mt-1 animate-in slide-in-from-left-2">Final ID: <span className="text-primary-dark">{form.roomNumber}</span></p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[2px] text-neutral-text-secondary ml-1 flex items-center gap-2">
                  <Layers size={12} className="text-primary-green" /> Floor Level
                </label>
                <Input
                  name="floor"
                  type="number"
                  value={form.floor}
                  onChange={handleChange}
                  placeholder="e.g. 3"
                  className="bg-neutral-light border-none focus:ring-2 focus:ring-primary-green h-12 rounded-2xl font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[2px] text-neutral-text-secondary ml-1 flex items-center gap-2">
                  <Banknote size={12} className="text-primary-green" /> Base Price (NPR)
                </label>
                <Input
                  name="price"
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="2500.00"
                  className="bg-neutral-light border-none focus:ring-2 focus:ring-primary-green h-12 rounded-2xl font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[2px] text-neutral-text-secondary ml-1 flex items-center gap-2">
                  <Maximize2 size={12} className="text-primary-green" /> Room Size (SQ FT)
                </label>
                <Input
                  name="size"
                  type="number"
                  value={form.size}
                  onChange={handleChange}
                  placeholder="450"
                  className="bg-neutral-light border-none focus:ring-2 focus:ring-primary-green h-12 rounded-2xl font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[2px] text-neutral-text-secondary ml-1 flex items-center gap-2">
                  <Users size={12} className="text-primary-green" /> Max Occupancy (Adults)
                </label>
                <Input
                  name="maxAdults"
                  type="number"
                  value={form.maxAdults}
                  onChange={handleChange}
                  placeholder="2"
                  className="bg-neutral-light border-none focus:ring-2 focus:ring-primary-green h-12 rounded-2xl font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[2px] text-neutral-text-secondary ml-1 flex items-center gap-2">
                   <Users size={12} className="text-primary-green" /> Bed Configuration
                </label>
                <Input
                  name="numBeds"
                  type="number"
                  value={form.numBeds}
                  onChange={handleChange}
                  placeholder="2"
                  className="bg-neutral-light border-none focus:ring-2 focus:ring-primary-green h-12 rounded-2xl font-bold"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-8 bg-neutral-light/50 p-6 rounded-[32px] border border-neutral-border/30">
               <div className="flex items-center gap-3">
                 <div className="relative inline-flex items-center cursor-pointer">
                    <Input 
                      id="allowChildren" 
                      name="allowChildren" 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={form.allowChildren} 
                      onChange={handleChange} 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-green"></div>
                    <span className="ml-3 text-sm font-bold text-neutral-text-primary flex items-center gap-2"><Baby size={16} /> Child Friendly</span>
                 </div>
               </div>

               {form.allowChildren && (
                 <div className="flex-1 animate-in zoom-in-95 duration-300">
                    <label className="text-[10px] font-black uppercase tracking-wider text-neutral-text-secondary ml-1">Max children allowed</label>
                    <Input
                      name="maxChildren"
                      type="number"
                      value={form.maxChildren}
                      onChange={handleChange}
                      placeholder="0"
                      className="bg-white border-none focus:ring-2 focus:ring-primary-green h-10 rounded-xl font-bold mt-1"
                    />
                 </div>
               )}

               <div className="flex-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-neutral-text-secondary ml-1 flex items-center gap-1.5"><Settings size={12} /> Unit Status</label>
                  <select
                    name="status"
                    title="Change unit status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full mt-1 px-4 h-10 bg-white border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green font-bold text-xs shadow-soft transition-all"
                  >
                    <option value="available">🟢 Available</option>
                    <option value="occupied">🔴 Occupied</option>
                    <option value="maintenance">🟡 Maintenance</option>
                    <option value="out_of_service">⚪ Out of Service</option>
                  </select>
               </div>
            </div>
          </div>

          {/* Right Column - Media & Amenities */}
          <div className="space-y-8 h-full flex flex-col">
             <div className="space-y-4">
               <label className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-text-secondary ml-1 flex items-center gap-2">
                 <AlignLeft size={12} className="text-primary-green" /> Description
               </label>
               <textarea
                 name="description"
                 value={form.description}
                 onChange={handleChange}
                 rows={5}
                 placeholder="Highlight the unique features of this room..."
                 className="w-full p-5 bg-neutral-light border-none rounded-[32px] focus:outline-none focus:ring-2 focus:ring-primary-green font-medium text-sm transition-all resize-none shadow-inner"
               />
             </div>

             <div className="space-y-4 flex-1">
               <label className="text-[11px] font-black uppercase tracking-[2px] text-neutral-text-secondary ml-1 flex items-center gap-2">
                 <Sparkles size={12} className="text-primary-green" /> Room Amenities
               </label>
               <div className="flex gap-2">
                 <input
                   name="amenity"
                   value={form.amenity}
                   onChange={handleChange}
                   onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addAmenity(); } }}
                   placeholder="e.g. Mini-bar, WiFi"
                   className="flex-1 px-4 h-12 bg-neutral-light border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-green font-bold text-sm shadow-inner transition-all"
                 />
                 <Button type="button" onClick={addAmenity} className="h-12 px-6 bg-primary-dark text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg">Add</Button>
               </div>
               <div className="flex flex-wrap gap-2 pt-2">
                 {amenities.map(a => (
                   <span key={a} className="bg-primary-green/5 text-primary-green text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl flex items-center gap-2 border border-primary-green/10 animate-in zoom-in-95">
                     {a}
                   <button 
                     type="button" 
                     onClick={() => removeAmenity(a)} 
                     title={`Remove ${a}`}
                     className="hover:text-error-red transition-colors"
                   >
                     <X size={12} />
                   </button>
                   </span>
                 ))}
                 {amenities.length === 0 && <p className="text-[10px] font-bold text-neutral-text-secondary/40 uppercase tracking-widest italic ml-1">No amenities added</p>}
               </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-wider text-neutral-text-secondary ml-1 flex items-center gap-2">
                      <ImageIcon size={14} /> Images <span className="text-primary-gold">({images.length}/10)</span>
                   </label>
                   <button 
                    type="button" 
                    onClick={() => imgInputRef.current?.click()}
                    className="w-full h-24 rounded-[24px] bg-neutral-light border-2 border-dashed border-neutral-border hover:border-primary-green hover:bg-white transition-all flex flex-col items-center justify-center gap-2 group"
                   >
                     <Upload size={20} className="text-neutral-text-secondary group-hover:text-primary-green group-hover:scale-110 transition-all" />
                     <span className="text-[9px] font-black uppercase tracking-widest text-neutral-text-secondary group-hover:text-primary-green">Upload Photo</span>
                   </button>
                   <Input ref={imgInputRef} type="file" multiple accept="image/*" onChange={onImages} className="hidden" />
                </div>

                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-wider text-neutral-text-secondary ml-1 flex items-center gap-2">
                      <VideoIcon size={14} /> Videos <span className="text-primary-gold">({videos.length}/3)</span>
                   </label>
                   <button 
                    type="button" 
                    onClick={() => vidInputRef.current?.click()}
                    className="w-full h-24 rounded-[24px] bg-neutral-light border-2 border-dashed border-neutral-border hover:border-primary-green hover:bg-white transition-all flex flex-col items-center justify-center gap-2 group"
                   >
                     <Upload size={20} className="text-neutral-text-secondary group-hover:text-primary-green group-hover:scale-110 transition-all" />
                     <span className="text-[9px] font-black uppercase tracking-widest text-neutral-text-secondary group-hover:text-primary-green">Add Video</span>
                   </button>
                   <Input ref={vidInputRef} type="file" multiple accept="video/*" onChange={onVideos} className="hidden" />
                </div>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-6 pt-10 border-t border-neutral-border/50">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="rounded-2xl px-10 h-14 text-xs font-black uppercase tracking-[0.2em] text-neutral-text-secondary hover:bg-neutral-light transition-all"
          >
            Discard
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-primary-dark hover:bg-black text-white px-12 h-14 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-2xl shadow-primary-dark/30 flex items-center gap-4 relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save size={18} className="group-hover:scale-110 transition-transform" />
                <span>Publish Room</span>
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Nested Modal for creating room type on the fly */}
      {showRoomTypeModal && (
        <Modal 
          isOpen={showRoomTypeModal} 
          onClose={() => setShowRoomTypeModal(false)}
          title="Create Room Category"
        >
          <RoomTypeForm
            onSubmit={handleCreateRoomType}
            onCancel={() => setShowRoomTypeModal(false)}
            isLoading={isLoading}
          />
        </Modal>
      )}
    </Card>
  );
}
