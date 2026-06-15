import React from 'react';
import { Calendar, ChevronRight, History, Package } from 'lucide-react';
import { Button } from '../../ui/Button';
import { getImageUrl } from '../../../services/api';

interface GuestBookingsPanelProps {
  bookings: any[];
}

export const GuestBookingsPanel: React.FC<GuestBookingsPanelProps> = ({ bookings }) => (
  <div className="bg-white rounded-2xl shadow-xl p-8">
    <h3 className="text-2xl font-bold text-gray-900 mb-6">Booking History</h3>

    {bookings?.length > 0 ? (
      <div className="space-y-4">
        {bookings.map((booking: any) => (
          <div
            key={booking.id}
            className="border border-gray-100 rounded-2xl p-6 hover:border-primary-green/30 transition-all group"
          >
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                  {booking.room?.images?.[0]?.url ? (
                    <img
                      src={getImageUrl(booking.room.images[0].url)}
                      alt={booking.room.name || 'Room preview'}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Package size={24} />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 group-hover:text-primary-green transition-colors">
                    {booking.room?.name || 'Room Details'}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                    <Calendar size={14} />
                    <span>
                      {new Date(booking.checkIn).toLocaleDateString()} -{' '}
                      {new Date(booking.checkOut).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-600'
                          : booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {booking.status}
                    </span>
                    <span className="text-[10px] font-black uppercase px-2 py-1 rounded-full bg-blue-100 text-blue-600">
                      #{booking.bookingNumber}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between items-end">
                <span className="text-xl font-black text-gray-900">Rs. {booking.totalAmount}</span>
                <button className="flex items-center gap-1 text-xs font-bold text-primary-green hover:text-primary-dark">
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
        <p className="text-sm text-gray-500 mb-6">
          You haven&apos;t made any reservations at Itahari Namuna yet.
        </p>
        <Button
          to="/rooms"
          asChild
          className="px-6 py-2 bg-primary-green text-white text-xs font-black uppercase tracking-widest rounded-lg hover:bg-primary-dark transition-all"
        >
          Book a Room Now
        </Button>
      </div>
    )}
  </div>
);
