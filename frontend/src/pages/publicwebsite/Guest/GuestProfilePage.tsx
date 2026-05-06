import React, { useState, useEffect, useRef } from 'react';
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
  ChevronRight,
  Package,
  History
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { getImageUrl } from '../../../services/api';


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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header/Cover Section */}
      <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
      
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
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Booking History</h3>
                  
                  {guest?.bookings?.length > 0 ? (
                    <div className="space-y-4">
                      {guest.bookings.map((booking: any) => (
                        <div key={booking.id} className="border border-gray-100 rounded-2xl p-6 hover:border-blue-200 transition-all group">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex gap-4">
                              <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                                {booking.room?.images?.[0]?.url ? (
                                  <img 
                                    src={getImageUrl(booking.room.images[0].url)} 
                                    alt={booking.room.name || "Room preview"} 
                                    className="w-full h-full object-cover" 
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400"><Package size={24} /></div>
                                )}
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {booking.room?.name || 'Room Details'}
                                </h4>
                                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                  <Calendar size={14} />
                                  <span>{new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}</span>
                                </div>
                                <div className="mt-2 flex gap-2">
                                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${
                                    booking.status === 'confirmed' ? 'bg-green-100 text-green-600' :
                                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                    'bg-gray-100 text-gray-600'
                                  }`}>
                                    {booking.status}
                                  </span>
                                  <span className="text-[10px] font-black uppercase px-2 py-1 rounded-full bg-blue-100 text-blue-600">
                                    #{booking.bookingNumber}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col justify-between items-end">
                              <span className="text-xl font-black text-gray-900">${booking.totalAmount}</span>
                              <button className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700">
                                View Details <ChevronRight size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gray-300 mx-auto mb-4">
                        <History size={32} />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900">No bookings yet</h4>
                      <p className="text-sm text-gray-500 mb-6">You haven't made any reservations at Antigravity Hotel yet.</p>
                      <Button className="px-6 py-2 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-lg hover:bg-blue-700 transition-all">
                        Book a Room Now
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
