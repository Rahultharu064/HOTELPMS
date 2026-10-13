import { StatCard } from "../../components/Admin/Dashboard/StatCard";
import { SystemControlHub } from "../../components/Admin/Dashboard/SystemControlHub";
import {
  Users,
  Building2,
  DollarSign,
  Calendar,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-primary-dark tracking-tight">Dashboard</h1>
          <p className="text-sm font-medium text-neutral-text-secondary mt-2">
            Hotel overview and activity
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-primary-green/10 border border-primary-green/20 rounded-xl">
            <p className="text-[10px] font-bold text-primary-green uppercase tracking-wider">Status</p>
            <p className="text-xs font-bold text-primary-dark mt-0.5">Online</p>
          </div>
          <div className="px-4 py-2 bg-primary-gold/10 border border-primary-gold/20 rounded-xl">
            <p className="text-[10px] font-bold text-primary-gold uppercase tracking-wider">Date</p>
            <p className="text-xs font-bold text-primary-dark mt-0.5">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Guests"
          value="248"
          icon={Users}
          color="text-primary-green"
          bg="bg-primary-green/10"
          trend="↑ 12% from last month"
          trendValue="12%"
          positive={true}
        />
        <StatCard
          label="Active Rooms"
          value="156"
          icon={Building2}
          color="text-primary-gold"
          bg="bg-primary-gold/10"
          trend="↑ 8% from last month"
          trendValue="8%"
          positive={true}
        />
        <StatCard
          label="Revenue (MTD)"
          value="$45,280"
          icon={DollarSign}
          color="text-primary-orange"
          bg="bg-primary-orange/10"
          trend="↑ 23% from last month"
          trendValue="23%"
          positive={true}
        />
        <StatCard
          label="Bookings Today"
          value="42"
          icon={Calendar}
          color="text-blue-600"
          bg="bg-blue-600/10"
          trend="↓ 5% from yesterday"
          trendValue="5%"
          positive={false}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Charts & Analytics */}
        <div className="lg:col-span-2 space-y-8">
          {/* Revenue Chart */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-border/30 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-green/10 flex items-center justify-center text-primary-green">
                  <TrendingUp size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-primary-dark">Revenue</h3>
                  <p className="text-[10px] font-medium text-neutral-text-secondary">This month</p>
                </div>
              </div>
              <select className="px-3 py-2 bg-neutral-light/50 border border-neutral-border/30 rounded-lg text-xs font-medium text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-green/20">
                <option>7 Days</option>
                <option>30 Days</option>
                <option>90 Days</option>
              </select>
            </div>
            
            {/* Simple Bar Chart Visualization */}
            <div className="h-64 flex items-end justify-between gap-3 px-4">
              {[
                { label: 'Mon', value: 65, color: '#1F7A3A' },
                { label: 'Tue', value: 45, color: '#1F7A3A' },
                { label: 'Wed', value: 80, color: '#1F7A3A' },
                { label: 'Thu', value: 55, color: '#1F7A3A' },
                { label: 'Fri', value: 90, color: '#F59E0B' },
                { label: 'Sat', value: 75, color: '#1F7A3A' },
                { label: 'Sun', value: 60, color: '#1F7A3A' },
              ].map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full rounded-t-lg transition-all duration-300 hover:opacity-80"
                    style={{ 
                      height: `${item.value}%`, 
                      backgroundColor: item.color,
                      minHeight: '20px'
                    }}
                  />
                  <span className="text-[10px] font-bold text-neutral-text-secondary">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Bookings Table */}
          <div className="bg-white rounded-2xl border border-neutral-border/30 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-border/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-gold/10 flex items-center justify-center text-primary-gold">
                    <Activity size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-primary-dark">Bookings</h3>
                    <p className="text-[10px] font-medium text-neutral-text-secondary">Recent activity</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-primary-green text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-all">
                  View All
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-light/50">
                    <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-neutral-text-secondary">Guest</th>
                    <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-neutral-text-secondary">Room</th>
                    <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-neutral-text-secondary">Check-in</th>
                    <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-neutral-text-secondary">Check-out</th>
                    <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-neutral-text-secondary">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-border/20">
                  {[
                    { guest: 'John Doe', room: '101', checkIn: '2024-01-15', checkOut: '2024-01-18', status: 'confirmed' },
                    { guest: 'Jane Smith', room: '205', checkIn: '2024-01-16', checkOut: '2024-01-20', status: 'pending' },
                    { guest: 'Mike Johnson', room: '302', checkIn: '2024-01-17', checkOut: '2024-01-19', status: 'confirmed' },
                    { guest: 'Sarah Wilson', room: '108', checkIn: '2024-01-18', checkOut: '2024-01-22', status: 'confirmed' },
                    { guest: 'Tom Brown', room: '215', checkIn: '2024-01-19', checkOut: '2024-01-21', status: 'pending' },
                  ].map((booking, index) => (
                    <tr key={index} className="hover:bg-neutral-light/30 transition-all">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary-green/10 flex items-center justify-center text-[10px] font-bold text-primary-green">
                            {booking.guest.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-xs font-bold text-primary-dark">{booking.guest}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-primary-dark">{booking.room}</td>
                      <td className="px-6 py-4 text-xs font-medium text-neutral-text-secondary">{booking.checkIn}</td>
                      <td className="px-6 py-4 text-xs font-medium text-neutral-text-secondary">{booking.checkOut}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                          booking.status === 'confirmed' 
                            ? 'bg-primary-green/10 text-primary-green' 
                            : 'bg-primary-gold/10 text-primary-gold'
                        }`}>
                          {booking.status === 'confirmed' ? (
                            <>
                              <CheckCircle size={10} strokeWidth={2.5} />
                              Confirmed
                            </>
                          ) : (
                            <>
                              <Clock size={10} strokeWidth={2.5} />
                              Pending
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - System Controls & Quick Actions */}
        <div className="space-y-8">
          <SystemControlHub />

          {/* Room Status */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-border/30 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary-green/10 flex items-center justify-center text-primary-green">
                <Building2 size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-primary-dark">Rooms</h3>
                <p className="text-[10px] font-medium text-neutral-text-secondary">Current status</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary-green" />
                  <span className="text-xs font-medium text-primary-dark">Available</span>
                </div>
                <span className="text-xs font-bold text-primary-dark">45</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary-gold" />
                  <span className="text-xs font-medium text-primary-dark">Occupied</span>
                </div>
                <span className="text-xs font-bold text-primary-dark">156</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary-orange" />
                  <span className="text-xs font-medium text-primary-dark">Maintenance</span>
                </div>
                <span className="text-xs font-bold text-primary-dark">12</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-xs font-medium text-primary-dark">Reserved</span>
                </div>
                <span className="text-xs font-bold text-primary-dark">35</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-neutral-text-secondary">Occupancy Rate</span>
                <span className="text-[10px] font-bold text-primary-green">78%</span>
              </div>
              <div className="h-2 bg-neutral-light rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary-green to-primary-gold rounded-full" style={{ width: '78%' }} />
              </div>
            </div>
          </div>

          {/* System Alerts */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-border/30 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                <AlertTriangle size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-primary-dark">Alerts</h3>
                <p className="text-[10px] font-medium text-neutral-text-secondary">Needs attention</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={14} className="text-red-500 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <div>
                    <p className="text-[11px] font-bold text-red-700">Room 305</p>
                    <p className="text-[9px] text-red-600 mt-1">Plumbing issue</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-primary-gold/10 border border-primary-gold/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <Clock size={14} className="text-primary-gold flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <div>
                    <p className="text-[11px] font-bold text-primary-dark">Check-outs</p>
                    <p className="text-[9px] text-neutral-text-secondary mt-1">5 guests today</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
