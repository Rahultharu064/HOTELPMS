import React, { useState, useEffect } from "react";
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  ShieldCheck, 
  Activity,
  Search,
  Plus,
  Loader2,
  Hotel,
  CheckCircle2,
  Clock,
  LayoutDashboard
} from "lucide-react";
import { motion } from "framer-motion";
import { bookingService } from "../../services/bookingService";
import { toast } from "react-hot-toast";

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, logsRes] = await Promise.all([
        bookingService.getStatistics(),
        bookingService.getAllBookings({ limit: 5 }) // Using bookings as activity for now
      ]);

      if (statsRes.success) {
        setStats(statsRes.data);
      }
      if (logsRes.success) {
        setRecentLogs(logsRes.data.bookings);
      }
    } catch (error) {
      toast.error("Failed to synchronize enterprise intelligence");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statsConfig = [
    { 
      label: "Total Revenue", 
      value: stats ? `Rs. ${Number(stats.totalRevenue).toLocaleString()}` : "Rs. 0", 
      icon: CreditCard, 
      color: "text-emerald-600", 
      bg: "bg-emerald-50", 
      trend: "Operational", 
      positive: true 
    },
    { 
      label: "Total Bookings", 
      value: stats ? stats.totalBookings.toString() : "0", 
      icon: Hotel, 
      color: "text-amber-600", 
      bg: "bg-amber-50", 
      trend: `${stats?.pendingBookings || 0} Pending`, 
      positive: true 
    },
    { 
      label: "Active Stays", 
      value: stats ? stats.activeStays.toString() : "0", 
      icon: Users, 
      color: "text-blue-600", 
      bg: "bg-blue-50", 
      trend: "Live", 
      positive: true 
    },
    { 
      label: "Today's Flow", 
      value: stats ? (stats.todayCheckIns + stats.todayCheckOuts).toString() : "0", 
      icon: Activity, 
      color: "text-rose-600", 
      bg: "bg-rose-50", 
      trend: `${stats?.todayCheckIns || 0} In / ${stats?.todayCheckOuts || 0} Out`, 
      positive: true 
    },
  ];

  if (loading && !stats) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6">
         <Loader2 size={48} className="text-[#14532D] animate-spin" />
         <p className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 animate-pulse text-center">
            Loading Dashboard Data<br />
            <span className="opacity-40 text-[#F59E0B]">Synchronizing with server...</span>
         </p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in pb-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white/40 backdrop-blur-sm p-8 rounded-[40px] border border-white/20 shadow-sm relative overflow-hidden group">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#14532D]/5 rounded-full blur-[100px] -mr-32 -mt-32 transition-all duration-1000 group-hover:scale-150" />
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-[24px] bg-[#14532D] flex items-center justify-center shadow-2xl shadow-[#14532D]/20 text-white transform hover:rotate-6 transition-transform">
            <LayoutDashboard size={32} strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-black text-[#111827] tracking-tight truncate uppercase">System Intelligence</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-primary-green animate-pulse" />
              <p className="text-[10px] font-black text-neutral-text-secondary uppercase tracking-[0.2em] opacity-80">
                Command Center Overview
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <button 
            onClick={fetchDashboardData} 
            className="px-6 h-14 bg-white border border-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-neutral-text-secondary hover:text-[#14532D] hover:bg-gray-50 transition-all shadow-sm flex items-center gap-3 active:scale-95"
          >
            <Activity size={18} className="text-[#F59E0B]" /> 
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
          <button className="px-8 h-14 bg-[#14532D] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#111827] transition-all shadow-xl shadow-[#14532D]/20 flex items-center gap-3 active:scale-95">
            <Plus size={18} strokeWidth={3} /> 
            <span>New Action</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statsConfig.map((s, i) => (
          <motion.div 
            whileHover={{ y: -8 }}
            key={i} 
            className="group bg-white p-8 rounded-[40px] border border-gray-100 hover:border-[#14532D]/20 shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
          >
            <div className="flex items-start justify-between relative z-10">
              <div className={`w-16 h-16 rounded-[24px] ${s.bg} ${s.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                <s.icon size={28} strokeWidth={2.5} />
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-[10px] font-black ${s.positive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                <Activity size={12} strokeWidth={3} />
                {s.trend}
              </div>
            </div>
            <div className="mt-8 relative z-10">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">{s.label}</h3>
              <p className="text-4xl font-black text-[#111827] mt-1 tracking-tighter truncate">{s.value}</p>
            </div>
            {/* Subtle background decoration */}
            <div className={`absolute -bottom-6 -right-6 w-32 h-32 ${s.bg} opacity-0 group-hover:opacity-40 rounded-full blur-3xl transition-opacity duration-500`} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content: Global Activity Table */}
        <div className="lg:col-span-2 space-y-8">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-[#111827] tracking-tighter uppercase flex items-center gap-3">
                 <TrendingUp className="text-[#F59E0B]" size={24} /> Recent Bookings
              </h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">LATEST 5 ENTRIES</p>
           </div>
           <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="bg-gray-50/50">
                         <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Guest Name</th>
                         <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Room Info</th>
                         <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Amount</th>
                         <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Status</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                      {recentLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50/50 transition-all group cursor-pointer">
                           <td className="px-10 py-8">
                             <div className="flex flex-col">
                                <span className="font-black text-[13px] text-[#111827] uppercase tracking-tight">{(log as any).guest?.firstName} {(log as any).guest?.lastName}</span>
                                <span className="text-[10px] font-bold text-gray-400">{(log as any).guest?.email}</span>
                             </div>
                           </td>
                           <td className="px-10 py-8">
                              <div className="flex flex-col">
                                <span className="font-bold text-[12px] text-gray-500 uppercase tracking-widest">{(log as any).room?.name}</span>
                                <span className="text-[10px] font-black text-[#14532D]">No. {(log as any).room?.roomNumber}</span>
                              </div>
                           </td>
                           <td className="px-10 py-8 text-[13px] font-black tracking-tight text-[#111827]">Rs. {Number(log.totalAmount).toLocaleString()}</td>
                           <td className="px-10 py-8 text-right">
                              <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                 log.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                              }`}>
                                 {log.status === 'confirmed' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                                 {log.status.replace('_', ' ')}
                              </span>
                           </td>
                        </tr>
                      ))}
                      {recentLogs.length === 0 && !loading && (
                        <tr>
                           <td colSpan={4} className="px-10 py-20 text-center text-[10px] font-black uppercase tracking-widest text-gray-300">
                              No recent activity found
                           </td>
                        </tr>
                      )}
                   </tbody>
                </table>
              </div>
           </div>
        </div>

        {/* Sidebar: System Control Hub */}
        <div className="space-y-12">
           <div className="bg-gradient-to-br from-[#14532D] to-[#111827] p-12 rounded-[48px] text-white relative overflow-hidden group border border-white/5 shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#F59E0B]/10 rounded-full blur-[100px] pointer-events-none group-hover:scale-150 transition-transform duration-[2000ms]" />
              <ShieldCheck className="text-[#F59E0B] mb-8" size={32} />
              <h3 className="text-3xl font-black mb-4 leading-tight">Admin Portal<br /><span className="text-white/40 italic font-medium text-xl">Quick Access</span></h3>
              <p className="text-white/40 text-[11px] font-black uppercase tracking-widest leading-relaxed mb-12">Authorized access required for system modifications and settings.</p>
              <button className="w-full py-5 bg-[#F59E0B] text-[#14532D] rounded-[24px] text-[12px] font-black uppercase tracking-widest hover:bg-white hover:text-[#14532D] transition-all shadow-2xl shadow-black/20 active:scale-95">
                 Verify Identity
              </button>
           </div>
           
           <div className="p-10 bg-white rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-[#111827]">
                    <Search size={18} strokeWidth={3} />
                 </div>
                 <h4 className="text-sm font-black uppercase tracking-tighter">Quick Search</h4>
              </div>
              <div className="space-y-4">
                 <input 
                    placeholder="Search by ID or Name..." 
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:border-[#14532D]/20 focus:bg-white rounded-2xl text-[12px] font-medium outline-none transition-all shadow-inner"
                 />
                 <button className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-[#14532D] hover:bg-[#14532D]/5 transition-colors rounded-2xl">
                    Search Records
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
