import React, { useState } from "react";
import { 
  BarChart3, TrendingUp, Users, 
  Download, ChevronRight, PieChart, 
  ArrowUpRight, ArrowDownRight,
  DollarSign, Activity, FileText,
  Zap, Plus
} from "lucide-react";

const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState("Daily");

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-black text-[#111827] tracking-tight">Analytics & Intelligence</h1>
            <span className="px-2.5 py-1 rounded-full bg-[#1F7A3A]/5 text-[#1F7A3A] text-[10px] font-black uppercase tracking-widest border border-[#1F7A3A]/10">
              Live Feed
            </span>
          </div>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Statistical performance overview of college hotel operations</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 p-1.5 rounded-2xl flex items-center shadow-inner">
            {["Daily", "Weekly", "Monthly"].map((t) => (
              <button 
                key={t}
                onClick={() => setReportType(t)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  reportType === t ? "bg-white text-[#111827] shadow-md translate-x-0" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <button className="px-6 py-4 bg-[#14532D] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#1F7A3A] transition-all shadow-xl shadow-[#1F7A3A]/20 flex items-center gap-2">
            <Plus size={16} strokeWidth={3} /> Post Charge
          </button>
          <button className="px-6 py-4 bg-[#14532D] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#1F7A3A] transition-all shadow-xl shadow-[#1F7A3A]/20 flex items-center gap-2">
            <Download size={16} strokeWidth={3} /> Full Export
          </button>
        </div>
      </div>

      {/* Primary KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: "Occupancy Rate", value: "84.2%", trend: "+5.1%", trendUp: true, color: "bg-primary-green", icon: Users },
          { label: "RevPAR", value: "$124.50", trend: "+$12.30", trendUp: true, color: "bg-primary-gold", icon: DollarSign },
          { label: "Avg. Daily Rate", value: "$142.00", trend: "-1.2%", trendUp: false, color: "bg-[#3B82F6]", icon: TrendingUp },
          { label: "Direct Bookings", value: "62.5%", trend: "+8.4%", trendUp: true, color: "bg-[#14532D]", icon: Zap },
        ].map((s, i) => (
          <div key={i} className="group bg-white p-8 rounded-[40px] border border-gray-100 hover:border-[#1F7A3A]/30 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-500 relative flex flex-col justify-between overflow-hidden cursor-pointer">
            <div className="flex items-start justify-between mb-8">
              <div className={`w-14 h-14 rounded-2xl ${s.color} text-white flex items-center justify-center shadow-lg shadow-black/10 group-hover:scale-110 transition-transform`}>
                <s.icon size={24} strokeWidth={2.5} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full ${s.trendUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                {s.trendUp ? <ArrowUpRight size={12} strokeWidth={3} /> : <ArrowDownRight size={12} strokeWidth={3} />}
                {s.trend.split(" ")[0]}
              </div>
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{s.label}</h3>
              <p className="text-3xl font-black text-[#111827] tracking-tight group-hover:text-[#1F7A3A] transition-colors">{s.value}</p>
            </div>
            {/* Minimalist SVG Sparkline */}
            <div className="mt-8 h-8 w-full">
              <svg viewBox="0 0 100 20" className={s.trendUp ? "text-green-500" : "text-red-500"}>
                <path d={s.trendUp ? "M0,20 Q10,10 20,15 T40,5 T60,18 T80,2 T100,10" : "M0,5 Q10,15 20,10 T40,18 T60,5 T80,15 T100,8"} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Advanced Chart / Visualization Placeholder */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-10 rounded-[56px] border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-black text-[#111827] tracking-tight">Revenue Performance</h2>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Net Sales Across All Channels</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:text-[#1F7A3A] transition-colors"
                  title="Switch to bar chart view"
                >
                  <BarChart3 size={18} />
                </button>
                <button 
                  className="p-3 rounded-2xl bg-[#14532D] text-white shadow-lg"
                  title="Switch to activity view"
                >
                  <Activity size={18} />
                </button>
              </div>
            </div>

            {/* Premium Chart Placeholder with CSS Gradients */}
            <div className="h-80 w-full relative">
              <div className="absolute inset-0 flex items-end justify-between gap-4">
                {[45, 78, 56, 92, 65, 88, 72, 95, 82, 68, 89, 74].map((h, i) => (
                  <div key={i} className="flex-1 group/bar relative">
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-2 py-1 bg-gray-900 text-white text-[9px] font-black rounded-lg opacity-0 transition-all pointer-events-none group-hover/bar:opacity-100 group-hover/bar:-translate-y-2">
                      ${h * 120}
                    </div>
                    <div 
                      className="w-full bg-gradient-to-t from-[#0C1F15] via-[#1F7A3A] to-[#1F7A3A]/80 rounded-t-xl transition-all duration-1000 origin-bottom hover:scale-x-110 hover:shadow-xl"
                      style={{ height: `${h}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Chart Legends */}
            <div className="mt-8 flex items-center justify-center gap-10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#1F7A3A]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#111827]">Direct Booking</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-gray-200" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">OTA Channels</span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistical Insights Section */}
        <div className="space-y-10">
          <div className="bg-[#14532D] rounded-[56px] p-12 text-white relative overflow-hidden group min-h-[400px] flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F59E0B]/10 rounded-full blur-[100px] pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
            
            <div className="relative z-10">
              <PieChart className="text-[#F59E0B] mb-8" size={40} />
              <h2 className="text-3xl font-black mb-4 leading-tight">Intelligent<br />Insights</h2>
              <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest leading-relaxed mb-10">AI-Powered trend analysis for next week.</p>
              
              <div className="space-y-6">
                <div className="p-6 rounded-[32px] bg-white/5 border border-white/5 hover:bg-white/10 transition-all group/insight cursor-pointer">
                  <h4 className="text-[12px] font-black uppercase tracking-widest text-white mb-2 flex items-center gap-2">
                    <TrendingUp size={14} className="text-[#F59E0B]" /> High Demand Alert
                  </h4>
                  <p className="text-white/40 text-[11px] font-medium leading-relaxed uppercase tracking-widest">Expected 95% occupancy on April 12-14 due to local college festivity.</p>
                </div>
                <div className="p-6 rounded-[32px] bg-white/5 border border-white/5 hover:bg-white/10 transition-all group/insight cursor-pointer">
                  <h4 className="text-[12px] font-black uppercase tracking-widest text-white mb-2 flex items-center gap-2">
                    <DollarSign size={14} className="text-[#1F7A3A]" /> Strategy Optimal
                  </h4>
                  <p className="text-white/40 text-[11px] font-medium leading-relaxed uppercase tracking-widest">Maintain current ADR; higher pricing may reduce weekend conversion rate.</p>
                </div>
              </div>
            </div>

            <button 
              className="relative z-10 w-full flex items-center justify-between p-6 bg-[#F59E0B] rounded-[32px] text-[#111827] group/btn transition-all mt-10"
              title="View full detailed analysis report"
            >
              <span className="text-[13px] font-black uppercase tracking-widest">View Detailed Analysis</span>
              <ChevronRight size={20} strokeWidth={3} className="group-hover/btn:translate-x-2 transition-transform" />
            </button>
          </div>
          
          <div className="p-10 rounded-[48px] bg-gray-50 border border-gray-100">
             <div className="flex items-center gap-3 mb-6">
                <FileText className="text-[#1F7A3A]" size={24} />
                <h3 className="text-lg font-black text-[#111827] uppercase tracking-tight">Scheduled Reports</h3>
             </div>
             <div className="space-y-4">
                {["Weekly Manager's Summary", "Night Audit Report", "Tax & Inventory Log"].map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100">
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#111827]">{r}</span>
                    <button 
                      className="text-[#1F7A3A] hover:scale-110 transition-transform"
                      title={`Download ${r}`}
                    >
                      <Download size={14} strokeWidth={3} />
                    </button>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
