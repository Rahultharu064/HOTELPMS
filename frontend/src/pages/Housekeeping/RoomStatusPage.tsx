import React, { useState, useEffect } from "react";
import {
  Search,
  RefreshCcw,
  Sparkles,
  Bed,
  CheckCircle,
  Wrench,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { housekeepingService } from "../../services/housekeepingService";
import { toast } from "react-hot-toast";

const RoomStatusPage: React.FC = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await housekeepingService.getRoomStatuses();
      if (res.success) setRooms(res.data);
    } catch {
      toast.error("Failed to load room status");
    } finally {
      setLoading(false);
    }
  };

  // Direct 1-tap next action based on current status
  const handleNextStatus = async (room: any) => {
    let nextStatus = 'available';
    let actionLabel = 'Mark as Clean';

    if (room.status === 'cleaning') {
      nextStatus = 'available';
      actionLabel = 'Mark as Clean';
    } else if (room.status === 'available') {
      nextStatus = 'cleaning';
      actionLabel = 'Start Cleaning';
    } else if (room.status === 'occupied') {
      nextStatus = 'cleaning';
      actionLabel = 'Request Cleaning';
    }

    try {
      setUpdatingId(room.id);
      const res = await housekeepingService.updateRoomStatus(room.id, {
        status: nextStatus,
        type: 'general',
        notes: `Updated from Housekeeping Board`
      });
      if (res.success) {
        toast.success(`Room ${room.roomNumber} is ready`);
        // Update local state directly for instant feedback (spec: 150ms transition)
        setRooms(prev => prev.map(r => r.id === room.id ? { ...r, status: nextStatus } : r));
      }
    } catch {
      toast.error('Failed to update status — try again');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <span className="badge badge-available">Available</span>;
      case 'occupied':
        return <span className="badge badge-occupied">Occupied</span>;
      case 'cleaning':
        return <span className="badge badge-cleaning">Needs Cleaning</span>;
      case 'inspected':
        return <span className="badge badge-inspected">Inspected</span>;
      case 'maintenance':
        return <span className="badge badge-oor">Out of Order</span>;
      default:
        return <span className="badge badge-available">{status}</span>;
    }
  };

  const getStatusBorderClass = (status: string) => {
    switch (status) {
      case 'available':   return 'card-status-available';
      case 'occupied':    return 'card-status-occupied';
      case 'cleaning':    return 'card-status-cleaning';
      case 'inspected':   return 'card-status-inspected';
      case 'maintenance': return 'card-status-oor';
      default:            return 'card-status-available';
    }
  };

  const filteredRooms = rooms.filter(r => {
    const matchesFilter =
      filter === "all" ||
      (filter === "available"   && r.status === "available") ||
      (filter === "cleaning"    && r.status === "cleaning") ||
      (filter === "occupied"    && r.status === "occupied") ||
      (filter === "maintenance" && r.status === "maintenance");
    const matchesSearch = r.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Count summaries
  const countAvailable   = rooms.filter(r => r.status === 'available').length;
  const countCleaning    = rooms.filter(r => r.status === 'cleaning').length;
  const countOccupied    = rooms.filter(r => r.status === 'occupied').length;
  const countMaintenance = rooms.filter(r => r.status === 'maintenance').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: '24px', fontWeight: 700, color: 'var(--color-ink)' }}>
            Room Status
          </h1>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--color-muted)', marginTop: '2px' }}>
            Real-time housekeeping and room occupancy overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchRooms}
            className="btn-ghost"
            style={{ height: '40px', padding: '0 12px' }}
            title="Refresh room list"
          >
            <RefreshCcw size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Summary KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card" style={{ padding: '16px' }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--color-muted)' }}>Available</span>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '28px', fontWeight: 700, color: 'var(--color-success)', marginTop: '4px' }}>
            {countAvailable}
          </p>
        </div>
        <div className="card" style={{ padding: '16px' }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--color-muted)' }}>Needs Cleaning</span>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '28px', fontWeight: 700, color: 'var(--color-warning)', marginTop: '4px' }}>
            {countCleaning}
          </p>
        </div>
        <div className="card" style={{ padding: '16px' }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--color-muted)' }}>Occupied</span>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '28px', fontWeight: 700, color: 'var(--color-blue)', marginTop: '4px' }}>
            {countOccupied}
          </p>
        </div>
        <div className="card" style={{ padding: '16px' }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--color-muted)' }}>Out of Order</span>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '28px', fontWeight: 700, color: 'var(--color-danger)', marginTop: '4px' }}>
            {countMaintenance}
          </p>
        </div>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all',         label: 'All Rooms' },
            { id: 'cleaning',    label: `Needs Cleaning (${countCleaning})` },
            { id: 'available',   label: `Available (${countAvailable})` },
            { id: 'occupied',    label: `Occupied (${countOccupied})` },
            { id: 'maintenance', label: `Out of Order (${countMaintenance})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`chip ${filter === tab.id ? 'chip-active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: '280px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-muted)',
              pointerEvents: 'none'
            }}
          />
          <input
            type="text"
            placeholder="Search room number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {/* Room Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '140px', borderRadius: '12px' }} />
          ))}
        </div>
      ) : filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredRooms.map((room) => {
            const isCleaning = room.status === 'cleaning';
            const isAvailable = room.status === 'available';
            const isOccupied = room.status === 'occupied';

            return (
              <div
                key={room.id}
                className={`card-status ${getStatusBorderClass(room.status)} flex flex-col justify-between`}
                style={{ padding: '16px', minHeight: '130px' }}
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-room-number" style={{ fontSize: '20px', color: 'var(--color-ink)' }}>
                        Room {room.roomNumber}
                      </h3>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--color-muted)', marginTop: '2px' }}>
                        Floor {room.floor || '1'} • {room.roomType?.name || 'Standard'}
                      </p>
                    </div>
                    {getStatusBadge(room.status)}
                  </div>
                </div>

                {/* Contextual Action Button (Rule 2.1: Speed before beauty, single-tap) */}
                <div className="pt-2 border-t" style={{ borderColor: 'var(--color-border)', marginTop: '12px' }}>
                  {isCleaning ? (
                    <button
                      onClick={() => handleNextStatus(room)}
                      disabled={updatingId === room.id}
                      className="btn-primary"
                      style={{ width: '100%', height: '36px', fontSize: '13px' }}
                    >
                      <CheckCircle size={14} />
                      <span>{updatingId === room.id ? "Updating..." : "Mark as Clean"}</span>
                    </button>
                  ) : isAvailable ? (
                    <button
                      onClick={() => handleNextStatus(room)}
                      disabled={updatingId === room.id}
                      className="btn-secondary"
                      style={{ width: '100%', height: '36px', fontSize: '13px' }}
                    >
                      <Sparkles size={14} />
                      <span>{updatingId === room.id ? "Updating..." : "Start Cleaning"}</span>
                    </button>
                  ) : isOccupied ? (
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--color-blue)' }}>Guest in room</span>
                      <Link
                        to={`/housekeeping/rooms/${room.id}`}
                        style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}
                      >
                        Details →
                      </Link>
                    </div>
                  ) : (
                    <Link
                      to={`/housekeeping/rooms/${room.id}`}
                      className="btn-ghost"
                      style={{ width: '100%', height: '36px', fontSize: '13px', textDecoration: 'none' }}
                    >
                      View Details
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div
          className="flex flex-col items-center justify-center text-center card"
          style={{ padding: '64px 24px', borderStyle: 'dashed' }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--color-surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              color: 'var(--color-muted)',
            }}
          >
            <Bed size={28} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '16px', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '6px' }}>
            No rooms match this filter
          </h3>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--color-muted)', maxWidth: '360px', marginBottom: '20px' }}>
            Try removing the current filter to view all rooms in the property.
          </p>
          <button
            onClick={() => { setFilter('all'); setSearchQuery(''); }}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default RoomStatusPage;
