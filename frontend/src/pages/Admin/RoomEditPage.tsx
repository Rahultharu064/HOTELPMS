import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft,
  Save,
  X,
  Plus,
  ImageIcon,
  Loader2,
  RefreshCw,
  WifiOff,
} from 'lucide-react';
import { roomService } from '../../services/roomService';
import type { Room, RoomStatus } from '../../services/roomService';
import { roomTypeService } from '../../services/roomTypeService';
import type { RoomType } from '../../services/roomTypeService';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { getImageUrl } from '../../services/api';
import { AdminDetailPageSkeleton } from '../../components/ui/skeletons/AdminSkeletons';
import { compressImages } from '../../utils/compressImage';


type RoomEditForm = {
  name: string;
  roomTypeId: string | number;
  roomNumber: string;
  floor: string | number;
  basePrice: string | number;
  size: string | number;
  capacity: string | number;
  description: string;
  status: RoomStatus;
  newAmenity: string;
};

export default function RoomEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [form, setForm] = useState<RoomEditForm>({
    name: '',
    roomTypeId: '',
    roomNumber: '',
    floor: '',
    basePrice: '',
    size: '',
    capacity: '',
    description: '',
    status: 'available',
    newAmenity: ''
  });

  const [existingImages, setExistingImages] = useState<NonNullable<Room['images']>>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [processingImages, setProcessingImages] = useState(false);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const MAX_IMAGE_BYTES = 15 * 1024 * 1024; // 15MB — generous ceiling for a single original photo

  useEffect(() => {
    const urls = newImages.map((file) => URL.createObjectURL(file));
    setNewImagePreviews(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newImages]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setLoadError(false);
      const [roomTypesRes, roomRes] = await Promise.all([
        roomTypeService.getAllRoomTypes(),
        roomService.getRoomById(Number(id))
      ]);

      if (roomTypesRes.success) setRoomTypes(roomTypesRes.data.roomTypes);
      if (roomRes.success) {
        const room = roomRes.data;
        setForm({
          name: room.name,
          roomTypeId: room.roomTypeId,
          roomNumber: room.roomNumber,
          floor: room.floor ?? '',
          basePrice: room.basePrice,
          size: room.size ?? '',
          capacity: room.capacity,
          description: room.description || '',
          status: room.status,
          newAmenity: ''
        });
        setAmenities(room.amenities?.map(a => a.name) || []);
        setExistingImages(room.images || []);
      }
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addAmenity = () => {
    const v = form.newAmenity.trim();
    if (!v) return;
    if (amenities.includes(v)) return toast.error('Already added');
    setAmenities((prev: string[]) => [...prev, v]);
    setForm((prev) => ({ ...prev, newAmenity: '' }));
  };

  const removeAmenity = (a: string) => setAmenities((prev: string[]) => prev.filter(x => x !== a));

  const handleImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = ''; // allow re-selecting the same file(s) later

    const oversized = files.filter((f) => f.size > MAX_IMAGE_BYTES);
    const validFiles = files.filter((f) => f.size <= MAX_IMAGE_BYTES);
    if (oversized.length > 0) {
      toast.error(`${oversized.length} photo${oversized.length > 1 ? 's are' : ' is'} too large (max 15MB) and won't be uploaded`);
    }
    if (validFiles.length === 0) return;

    setProcessingImages(true);
    try {
      // Shrink to web-friendly dimensions client-side so the upload doesn't hang on
      // full-resolution phone photos.
      const compressed = await compressImages(validFiles);
      setNewImages((prev: File[]) => [...prev, ...compressed]);
    } finally {
      setProcessingImages(false);
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingImage = async (imageId: number) => {
    if (!window.confirm('Delete this photo?')) return;
    try {
      await roomService.deleteRoomImage(Number(id), imageId);
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
      toast.success('Photo deleted');
    } catch {
      toast.error('Failed to delete photo');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      (Object.entries(form) as [keyof RoomEditForm, string | number][]).forEach(([key, value]) => {
        if (key !== 'newAmenity') formData.append(key, String(value));
      });
      formData.append('amenities', JSON.stringify(amenities));
      newImages.forEach(img => formData.append('images', img));

      const res = await roomService.updateRoom(Number(id), formData);
      if (res.success) {
        toast.success('Room updated successfully');
        navigate('/admin/rooms');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update room');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <AdminDetailPageSkeleton />;
  }

  if (loadError) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto">
          <WifiOff size={26} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Couldn't load this room</h2>
          <p className="text-sm text-neutral-text-secondary mt-1">The server didn't respond in time. This can happen if it's just waking up — try again in a moment.</p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={() => navigate('/admin/rooms')} className="h-11 px-5 rounded-xl bg-neutral-light text-foreground text-[13px] font-semibold">
            Back to rooms
          </Button>
          <Button onClick={fetchData} className="h-11 px-5 rounded-xl bg-primary-dark text-white text-[13px] font-semibold flex items-center gap-2">
            <RefreshCw size={15} /> Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <div className="flex items-center gap-6">
        <Button 
          onClick={() => navigate('/admin/rooms')}
           className="w-12 h-12 rounded-2xl bg-white shadow-soft border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight uppercase flex items-center gap-4">
            <div className="w-2 h-8 bg-primary-gold rounded-full" />
            Edit Room
          </h1>
          <p className="text-gray-400 text-[11px] font-black uppercase tracking-widest mt-1 ml-6">Room {form.roomNumber}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-8">
          <Card className="p-10 rounded-[40px] border-none shadow-soft bg-white space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Room Name</label>
                <Input name="name" value={form.name} onChange={handleChange} className="h-12 bg-gray-50 border-none rounded-2xl font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Room Category</label>
                <Select
  name="roomTypeId"
  value={form.roomTypeId}
  onChange={handleChange}
  options={roomTypes.map(rt => ({ label: rt.name, value: rt.id.toString() }))}
  className="w-full h-12 bg-gray-50 border-none rounded-2xl font-bold px-4 focus:ring-2 focus:ring-primary-dark/20 outline-none"
/>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Room Number</label>
                <Input name="roomNumber" value={form.roomNumber} onChange={handleChange} className="h-12 bg-gray-50 border-none rounded-2xl font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Price (NPR)</label>
                <Input name="basePrice" type="number" value={form.basePrice} onChange={handleChange} className="h-12 bg-gray-50 border-none rounded-2xl font-bold" />
              </div>
            </div>

            <div className="space-y-2">
               <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Description</label>
                <Textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full p-6 bg-gray-50 border-none rounded-[32px] font-medium text-sm focus:ring-2 focus:ring-primary-dark/20 outline-none resize-none" />
            </div>
          </Card>

          <Card className="p-10 rounded-[40px] border-none shadow-soft bg-white space-y-6">
             <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
               <ImageIcon size={18} className="text-primary-green" /> Photos
             </h3>
             <div className="grid grid-cols-4 gap-4">
                {existingImages.map(img => (
                  <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden group">
                     <img src={getImageUrl(img.url)} alt="Room" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                      <Button type="button" onClick={() => handleDeleteExistingImage(img.id)} title="Delete photo" className="text-white hover:text-red-500"><X size={20} /></Button>
                    </div>
                  </div>
                ))}
                {newImagePreviews.map((src, index) => (
                  <div key={src} className="relative aspect-square rounded-2xl overflow-hidden group ring-2 ring-primary-gold/60">
                     <img src={src} alt="New upload" className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                       <Button type="button" onClick={() => removeNewImage(index)} title="Remove photo" className="text-white hover:text-red-500"><X size={20} /></Button>
                     </div>
                     <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-primary-gold text-[9px] font-black uppercase tracking-widest text-white">New</span>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => imgInputRef.current?.click()}
                  disabled={processingImages}
                  className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 hover:border-primary-dark hover:bg-gray-50 transition-all group disabled:opacity-50"
                >
                  {processingImages ? (
                    <Loader2 size={24} className="text-gray-300 animate-spin" />
                  ) : (
                    <Plus size={24} className="text-gray-300 group-hover:text-primary-dark" />
                  )}
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                    {processingImages ? 'Optimizing...' : 'Add More'}
                  </span>
                </Button>
                <Input ref={imgInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleImages} />
             </div>
          </Card>
        </div>

        <div className="space-y-10">
          <Card className="p-8 rounded-[40px] border-none shadow-soft bg-white space-y-6">
             <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Room Status</label>
             <Select name="status" value={form.status} onChange={handleChange} className="w-full h-12 bg-gray-50 border-none rounded-2xl font-bold px-4 appearance-none focus:ring-2 focus:ring-primary-dark/20 outline-none">
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="cleaning">Cleaning</option>
                <option value="reserved">Reserved</option>
                <option value="maintenance">Maintenance</option>
                <option value="out_of_service">Out of Service</option>
             </Select>
          </Card>

          <Card className="p-8 rounded-[40px] border-none shadow-soft bg-white space-y-6">
             <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Amenities</label>
             <div className="flex gap-2">
                <Input name="newAmenity" value={form.newAmenity} onChange={handleChange} placeholder="e.g. WiFi" className="h-10 bg-gray-50 border-none rounded-xl font-bold" />
                <Button type="button" onClick={addAmenity} className="bg-foreground text-white rounded-xl h-10 px-4">Add</Button>
             </div>
             <div className="flex flex-wrap gap-2">
                {amenities.map(a => (
                  <span key={a} className="px-3 py-1 bg-primary-dark/5 text-primary-dark text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2 border border-primary-dark/10">
                    {a} <Button type="button" onClick={() => removeAmenity(a)}><X size={10} /></Button>
                  </span>
                ))}
             </div>
          </Card>

          <div className="space-y-4">
             <Button type="submit" disabled={saving || processingImages} className="w-full h-16 bg-primary-dark text-white rounded-[24px] font-black uppercase tracking-widest text-[12px] shadow-xl shadow-primary-dark/20 flex items-center justify-center gap-3 disabled:opacity-60">
               {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
               {saving ? (newImages.length > 0 ? 'Uploading photos...' : 'Saving...') : 'Save Changes'}
             </Button>
             {saving && newImages.length > 0 && (
               <p className="text-center text-[11px] text-gray-400">Uploading {newImages.length} photo{newImages.length > 1 ? 's' : ''} — this can take a moment on a slow connection</p>
             )}
             <Button type="button" onClick={() => navigate('/admin/rooms')} className="w-full h-16 bg-white border border-gray-100 text-gray-400 rounded-[24px] font-black uppercase tracking-widest text-[11px] hover:bg-gray-50 transition-all">
               Cancel
             </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
