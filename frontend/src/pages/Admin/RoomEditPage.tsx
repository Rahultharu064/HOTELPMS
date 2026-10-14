import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft, 
  Save, 
  X, 
  Plus, 
  ImageIcon, 
  Loader2
} from 'lucide-react';
import { roomService } from '../../services/roomService';
import { roomTypeService } from '../../services/roomTypeService';
import type { RoomType } from '../../services/roomTypeService';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { getImageUrl } from '../../services/api';
import { AdminDetailPageSkeleton } from '../../components/ui/skeletons/AdminSkeletons';


export default function RoomEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [form, setForm] = useState<any>({
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

  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const imgInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
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
            floor: room.floor,
            basePrice: room.basePrice,
            size: room.size,
            capacity: room.capacity,
            description: room.description || '',
            status: room.status,
            newAmenity: ''
          });
          setAmenities(room.amenities?.map(a => a.name) || []);
          setExistingImages(room.images || []);
        }
      } catch (error) {
        toast.error('Failed to load room details');
        navigate('/admin/rooms');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const addAmenity = () => {
    const v = form.newAmenity.trim();
    if (!v) return;
    if (amenities.includes(v)) return toast.error('Already added');
    setAmenities((prev: string[]) => [...prev, v]);
    setForm((prev: any) => ({ ...prev, newAmenity: '' }));
  };

  const removeAmenity = (a: string) => setAmenities((prev: string[]) => prev.filter(x => x !== a));

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImages((prev: File[]) => [...prev, ...files]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key !== 'newAmenity') formData.append(key, form[key]);
      });
      formData.append('amenities', JSON.stringify(amenities));
      newImages.forEach(img => formData.append('images', img));

      const res = await roomService.updateRoom(Number(id), formData);
      if (res.success) {
        toast.success('Room updated successfully');
        navigate('/admin/rooms');
      }
    } catch (error) {
      toast.error('Failed to update room');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <AdminDetailPageSkeleton />;
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
          <h1 className="text-3xl font-black text-[#111827] tracking-tight uppercase flex items-center gap-4">
            <div className="w-2 h-8 bg-[#F59E0B] rounded-full" />
            Edit Room Node
          </h1>
          <p className="text-gray-400 text-[11px] font-black uppercase tracking-widest mt-1 ml-6">Modifying Inventory Record: {form.roomNumber}</p>
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
  className="w-full h-12 bg-gray-50 border-none rounded-2xl font-bold px-4 focus:ring-2 focus:ring-[#14532D]/20 outline-none"
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
                <Textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full p-6 bg-gray-50 border-none rounded-[32px] font-medium text-sm focus:ring-2 focus:ring-[#14532D]/20 outline-none resize-none" />
            </div>
          </Card>

          <Card className="p-10 rounded-[40px] border-none shadow-soft bg-white space-y-6">
             <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
               <ImageIcon size={18} className="text-primary-green" /> Media Inventory
             </h3>
             <div className="grid grid-cols-4 gap-4">
                {existingImages.map(img => (
                  <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden group">
                     <img src={getImageUrl(img.url)} alt="Room" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                      <Button type="button" className="text-white hover:text-red-500"><X size={20} /></Button>
                    </div>
                  </div>
                ))}
                <Button 
                  type="button"
                  onClick={() => imgInputRef.current?.click()}
                  className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 hover:border-[#14532D] hover:bg-gray-50 transition-all group"
                >
                  <Plus size={24} className="text-gray-300 group-hover:text-[#14532D]" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Add More</span>
                </Button>
                <Input ref={imgInputRef} type="file" multiple className="hidden" onChange={handleImages} />
             </div>
          </Card>
        </div>

        <div className="space-y-10">
          <Card className="p-8 rounded-[40px] border-none shadow-soft bg-white space-y-6">
             <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Room Status</label>
             <Select name="status" value={form.status} onChange={handleChange} className="w-full h-12 bg-gray-50 border-none rounded-2xl font-bold px-4 appearance-none focus:ring-2 focus:ring-[#14532D]/20 outline-none">
                <option value="available">🟢 Available</option>
                <option value="occupied">🔴 Occupied</option>
                <option value="maintenance">🟡 Maintenance</option>
             </Select>
          </Card>

          <Card className="p-8 rounded-[40px] border-none shadow-soft bg-white space-y-6">
             <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Amenities</label>
             <div className="flex gap-2">
                <Input name="newAmenity" value={form.newAmenity} onChange={handleChange} placeholder="e.g. WiFi" className="h-10 bg-gray-50 border-none rounded-xl font-bold" />
                <Button type="button" onClick={addAmenity} className="bg-[#111827] text-white rounded-xl h-10 px-4">Add</Button>
             </div>
             <div className="flex flex-wrap gap-2">
                {amenities.map(a => (
                  <span key={a} className="px-3 py-1 bg-[#14532D]/5 text-[#14532D] text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2 border border-[#14532D]/10">
                    {a} <Button type="button" onClick={() => removeAmenity(a)}><X size={10} /></Button>
                  </span>
                ))}
             </div>
          </Card>

          <div className="space-y-4">
             <Button type="submit" disabled={saving} className="w-full h-16 bg-[#14532D] text-white rounded-[24px] font-black uppercase tracking-widest text-[12px] shadow-xl shadow-[#14532D]/20 flex items-center justify-center gap-3">
               {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
               Commit Changes
             </Button>
             <Button type="button" onClick={() => navigate('/admin/rooms')} className="w-full h-16 bg-white border border-gray-100 text-gray-400 rounded-[24px] font-black uppercase tracking-widest text-[11px] hover:bg-gray-50 transition-all">
               Discard Edits
             </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
