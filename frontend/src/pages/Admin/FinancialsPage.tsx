import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { DollarSign, Receipt, TrendingUp, Clock } from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import type { BookingStatistics } from '../../services/bookingService';
import { paymentService } from '../../services/paymentService';
import type { Payment, PaymentStatus } from '../../services/paymentService';
import { StatCard } from '../../components/Admin/Dashboard/StatCard';
import { DonutChart } from '../../components/ui/Chart';
import { Badge } from '../../components/ui/Badge';
import type { BadgeVariant } from '../../components/ui/Badge';
import { AdminStatCardsSkeleton, AdminTableSkeleton } from '../../components/ui/skeletons/AdminSkeletons';

const METHOD_LABEL: Record<Payment['method'], string> = {
  cash: 'Cash',
  esewa: 'eSewa',
  khalti: 'Khalti',
};

const STATUS_VARIANT: Record<PaymentStatus, BadgeVariant> = {
  completed: 'success',
  pending: 'warning',
  failed: 'danger',
  refunded: 'info',
};

export default function FinancialsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<BookingStatistics | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, paymentsRes] = await Promise.all([
          bookingService.getStatistics(),
          paymentService.getAllPayments({ limit: 150 }),
        ]);
        if (statsRes.success) setStats(statsRes.data);
        if (paymentsRes.success) setPayments(paymentsRes.data.payments);
      } catch {
        toast.error('Failed to load financial data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const completedPayments = payments.filter((p) => p.status === 'completed');
  const methodTotals = completedPayments.reduce<Record<string, number>>((acc, p) => {
    acc[p.method] = (acc[p.method] || 0) + Number(p.amount);
    return acc;
  }, {});
  const donutData = Object.entries(methodTotals).map(([method, value]) => ({
    label: METHOD_LABEL[method as Payment['method']] || method,
    value,
  }));

  const today = new Date().toDateString();
  const todayRevenue = completedPayments
    .filter((p) => new Date(p.createdAt).toDateString() === today)
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const pendingCount = payments.filter((p) => p.status === 'pending').length;

  return (
    <div className="space-y-10 pb-20">
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight uppercase flex items-center gap-4">
          <div className="w-2 h-8 bg-primary-dark rounded-full" />
          Financials
        </h1>
        <p className="text-[11px] font-black text-neutral-text-secondary uppercase tracking-[0.2em] mt-2 ml-6">Revenue and payment activity</p>
      </div>

      {loading ? (
        <AdminStatCardsSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Total Revenue" value={`Rs. ${Number(stats?.totalRevenue ?? 0).toLocaleString()}`} icon={DollarSign} color="text-primary-green" bg="bg-primary-green/10" />
          <StatCard label="Revenue Today" value={`Rs. ${todayRevenue.toLocaleString()}`} icon={TrendingUp} color="text-primary-gold" bg="bg-primary-gold/10" />
          <StatCard label="Recent Transactions" value={String(payments.length)} icon={Receipt} color="text-blue-600" bg="bg-blue-600/10" />
          <StatCard label="Pending Payments" value={String(pendingCount)} icon={Clock} color="text-primary-orange" bg="bg-primary-orange/10" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[40px] border border-neutral-border/40 shadow-sm">
          <h3 className="text-sm font-bold text-primary-dark mb-6">Revenue by Payment Method</h3>
          {loading ? (
            <div className="h-40 rounded-2xl skeleton-shimmer" />
          ) : donutData.length > 0 ? (
            <DonutChart data={donutData} label={<span className="text-lg font-black text-primary-dark">Rs. {completedPayments.reduce((s, p) => s + Number(p.amount), 0).toLocaleString()}</span>} />
          ) : (
            <p className="text-xs font-medium text-neutral-text-secondary">No completed payments yet</p>
          )}
        </div>

        <div className="lg:col-span-2 bg-white rounded-[40px] border border-neutral-border/40 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-neutral-border/30">
            <h3 className="text-sm font-bold text-primary-dark">Recent Transactions</h3>
          </div>
          {loading ? (
            <AdminTableSkeleton rows={6} cols={5} bare />
          ) : payments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-light/50">
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-neutral-text-secondary">Booking</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-neutral-text-secondary">Guest</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-neutral-text-secondary">Method</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-neutral-text-secondary">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-neutral-text-secondary text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-border/20">
                  {payments.slice(0, 10).map((payment) => (
                    <tr key={payment.id} className="hover:bg-neutral-light/30 transition-all">
                      <td className="px-6 py-4 text-xs font-bold text-primary-dark">{payment.booking?.bookingNumber || '—'}</td>
                      <td className="px-6 py-4 text-xs font-medium text-neutral-text-secondary">
                        {payment.booking?.guest ? `${payment.booking.guest.firstName} ${payment.booking.guest.lastName}` : '—'}
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-neutral-text-secondary">{METHOD_LABEL[payment.method] || payment.method}</td>
                      <td className="px-6 py-4 text-xs font-bold text-primary-dark">Rs. {Number(payment.amount).toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <Badge variant={STATUS_VARIANT[payment.status]}>{payment.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-neutral-text-secondary">No transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
