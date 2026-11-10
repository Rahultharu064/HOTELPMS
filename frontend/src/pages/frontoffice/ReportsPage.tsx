import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BedDouble, CalendarDays, Download, LogIn, LogOut, Banknote } from "lucide-react";
import { frontOfficeService } from "../../services/frontofficeService";

type ReportData = {
  overview: {
    arrivalsToday: number;
    departuresToday: number;
    stayOvers: number;
    pendingOrders: number;
    revenueToday: number;
    cancelledToday: number;
  };
  inventory: Record<string, number>;
};

const localDateValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const ReportsPage: React.FC = () => {
  const [reportDate, setReportDate] = useState(() => localDateValue(new Date()));
  const [report, setReport] = useState<ReportData | null>(null);
  const [loadedDate, setLoadedDate] = useState("");
  const [error, setError] = useState("");
  const [errorDate, setErrorDate] = useState("");
  const loading = loadedDate !== reportDate && errorDate !== reportDate;

  useEffect(() => {
    let active = true;

    frontOfficeService.getDashboardStats(reportDate)
      .then((response) => {
        if (active && response.success) {
          setReport(response.data);
          setLoadedDate(reportDate);
          setError("");
          setErrorDate("");
        }
      })
      .catch((requestError: Error) => {
        if (active) {
          setError(requestError.message || "Unable to load this report.");
          setErrorDate(reportDate);
        }
      });

    return () => { active = false; };
  }, [reportDate]);

  const exportCsv = () => {
    if (!report) return;
    const rows = [
      ["Metric", "Value"],
      ["Report date", reportDate],
      ["Arrivals", String(report.overview.arrivalsToday)],
      ["Departures", String(report.overview.departuresToday)],
      ["Stay overs", String(report.overview.stayOvers)],
      ["Payments received (Rs.)", String(report.overview.revenueToday)],
      ["Pending service orders", String(report.overview.pendingOrders)],
      ["Cancelled bookings", String(report.overview.cancelledToday)],
      ...Object.entries(report.inventory).map(([status, count]) => [`Rooms: ${status.split("_").join(" ")}`, String(count)]),
    ];
    const csv = rows.map((row) => row.map((value) => `"${value.split('"').join('""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `front-office-report-${reportDate}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const metrics = [
    { label: "Arrivals", value: report?.overview.arrivalsToday, icon: LogIn },
    { label: "Departures", value: report?.overview.departuresToday, icon: LogOut },
    { label: "Payments received", value: report ? `Rs. ${report.overview.revenueToday.toLocaleString()}` : undefined, icon: Banknote },
    { label: "Rooms available", value: report?.inventory.available ?? 0, icon: BedDouble },
  ];

  return (
    <div className="space-y-6 pb-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-primary-dark">Daily operations report</h1>
          <p className="mt-1 text-sm text-neutral-text-secondary">A summary of recorded activity and room status.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex h-10 items-center gap-2 rounded-lg border border-neutral-border bg-white px-3 text-sm text-neutral-text-primary">
            <CalendarDays size={16} className="text-neutral-text-secondary" />
            <span className="sr-only">Report date</span>
            <input
              type="date"
              value={reportDate}
              onChange={(event) => setReportDate(event.target.value)}
              className="bg-transparent outline-none"
            />
          </label>
          <button
            type="button"
            onClick={exportCsv}
            disabled={!report || loading}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary-green px-4 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </header>

      {errorDate === reportDate && error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error} Please check your connection and try again.
        </div>
      )}

      <section aria-label="Daily summary" aria-busy={loading} className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric.label} className="rounded-xl border border-neutral-border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-medium text-neutral-text-secondary">{metric.label}</h2>
                <p className="mt-3 text-2xl font-semibold tabular-nums text-primary-dark">
                  {loading ? <span className="text-neutral-text-secondary">Loading…</span> : metric.value ?? "—"}
                </p>
              </div>
              <metric.icon size={20} className="text-primary-green" />
            </div>
          </article>
        ))}
      </section>

      <section className="overflow-hidden rounded-xl border border-neutral-border bg-white shadow-sm">
        <div className="border-b border-neutral-border px-5 py-4">
          <h2 className="text-base font-semibold text-neutral-text-primary">Room status</h2>
          <p className="mt-1 text-sm text-neutral-text-secondary">Current room inventory status.</p>
        </div>
        <div className="divide-y divide-neutral-border sm:grid sm:grid-cols-2 sm:divide-y-0">
          {[
            ["Available", "available"],
            ["Occupied", "occupied"],
            ["Reserved", "reserved"],
            ["Being cleaned", "cleaning"],
            ["Maintenance", "maintenance"],
            ["Out of service", "out_of_service"],
          ].map(([label, key]) => (
            <div key={key} className="flex items-center justify-between px-5 py-4 text-sm sm:border-b sm:border-neutral-border">
              <span className="text-neutral-text-secondary">{label}</span>
              <span className="font-semibold tabular-nums text-neutral-text-primary">
                {loading ? "—" : report?.inventory[key] ?? 0}
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-border bg-white px-5 py-4">
        <p className="text-sm text-neutral-text-secondary">Need to act on today’s guest movements?</p>
        <Link to="/frontoffice/checkin" className="text-sm font-semibold text-primary-green hover:text-primary-dark">
          Open arrivals & departures <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
};

export default ReportsPage;