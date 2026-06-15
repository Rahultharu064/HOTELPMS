import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { authService } from '../../../services/authService';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  User, 
  Camera, 
  Calendar, 
  Settings, 
  LogOut,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { getImageUrl } from '../../../services/api';
import { PageLoader } from '../../../components/ui/PageLoader';

const GuestBookingsPanel = lazy(() =>
  import('../../../components/publicwebsite/Guest/GuestBookingsPanel').then((m) => ({
    default: m.GuestBookingsPanel,
  }))
);


export const GuestProfilePage: React.FC = () => {
  const [guest, setGuest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings'>('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await authService.getMe();
      setGuest(data);
    } catch (error: any) {
      const status = error?.response?.data?.statusCode || error?.response?.status;
      if (status === 401) {
        // Token is invalid/expired — clear session and redirect to login
        logout();
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else {
        toast.error('Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdating(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    try {
      await authService.updateProfile(data);
      toast.success('Profile updated successfully');
      fetchProfile();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUpdating(true);
      await authService.updateProfileImage(formData);
      toast.success('Profile image updated');
      fetchProfile();
    } catch (error: any) {
      console.error('Upload Error:', error.response?.data);
      toast.error(error.response?.data?.message || error.response?.data?.error || 'Failed to upload image');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header/Cover Section */}
      <div className="h-48 bg-gradient-to-r from-primary-dark via-primary-green to-primary-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.15)_0%,_transparent_60%)]" />
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100 mx-auto">
                    {guest?.profileImage ? (
                      <img 
                        src={getImageUrl(guest.profileImage)} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (

                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <User size={64} />
                      </div>
                    )}
                  </div>
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all"
                  >
                    <Camera size={16} />
                  </Button>
                  <Input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
                <h2 className="mt-4 text-xl font-bold text-gray-900">{guest?.firstName} {guest?.lastName}</h2>
                <p className="text-sm text-gray-500">{guest?.email}</p>
              </div>
              
              <div className="border-t">
                <nav className="p-2 space-y-1">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <User size={18} /> Profile Details
                  </button>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      activeTab === 'bookings' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Calendar size={18} /> My Bookings
                  </button>
                  <Button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">
                    <Settings size={18} /> Account Settings
                  </Button>
                  <Button 
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={18} /> Logout
                  </Button>
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            
            {activeTab === 'profile' ? (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex justify-between items-center mb-8 pb-4 border-b">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Profile Information</h3>
                    <p className="text-sm text-gray-500">Update your personal details and how we can reach you</p>
                  </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">First Name</label>
                      <Input 
                        name="firstName"
                        defaultValue={guest?.firstName}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Last Name</label>
                      <Input 
                        name="lastName"
                        defaultValue={guest?.lastName}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Email (Unchangeable)</label>
                      <Input 
                        disabled
                        value={guest?.email}
                        className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Phone Number</label>
                      <Input 
                        name="phone"
                        defaultValue={guest?.phone}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Address Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Street Address</label>
                        <Input 
                          name="address"
                          defaultValue={guest?.address}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          placeholder="e.g. 123 Main St"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">City</label>
                        <Input 
                          name="city"
                          defaultValue={guest?.city}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Country</label>
                        <Input 
                          name="country"
                          defaultValue={guest?.country}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-6">
                    <Button
                      type="submit"
                       disabled={updating}
                      className="px-8 py-3 bg-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
                    >
                      {updating ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <Suspense fallback={<PageLoader />}>
                <GuestBookingsPanel bookings={guest?.bookings ?? []} />
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
