import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './SocketContext';
import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: Date;
  data?: any;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { socket, isConnected } = useSocket();
  const location = useLocation();

  // Define exactly which socket rooms this client should join based on location.
  useEffect(() => {
    if (!socket || !isConnected) return;

    if (location.pathname.startsWith('/admin')) {
      // Admins might want all updates
      socket.emit('join-frontoffice', 0);
      socket.emit('join-housekeeping', 0);
    } else if (location.pathname.startsWith('/frontoffice')) {
      socket.emit('join-frontoffice', 0);
    } else if (location.pathname.startsWith('/housekeeping')) {
      socket.emit('join-housekeeping', 0);
    }
    
    // Guest could join their booking room, though that's probably handled in guest pages
  }, [socket, isConnected, location.pathname]);

  const addNotification = (notif: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    const newNotif: Notification = {
      ...notif,
      id: Math.random().toString(36).substring(2, 9),
      read: false,
      createdAt: new Date(),
    };
    
    setNotifications(prev => [newNotif, ...prev]);
    toast.success(`${newNotif.title}: ${newNotif.message}`);
  };

  useEffect(() => {
    if (!socket) return;

    const handleRoomStatus = (data: any) => {
      addNotification({
        title: 'Room Status Changed',
        message: `Room ${data.id || data.roomId} status changed to ${data.status}`,
        type: 'room_status',
        data
      });
    };

    const handleBookingCreated = (data: any) => {
      addNotification({
        title: 'New Booking',
        message: `Booking created for room ${data.roomId || 'unknown'}`,
        type: 'booking',
        data
      });
    };

    const handleBookingStatusUpdated = (data: any) => {
      addNotification({
        title: 'Booking Status Updated',
        message: `Booking ${data.id} status is now ${data.status}`,
        type: 'booking',
        data
      });
    };

    const handlePaymentProcessed = (data: any) => {
      addNotification({
        title: 'Payment Processed',
        message: `Payment of ${data.amount || 'unknown'} processed for booking ${data.bookingId}`,
        type: 'payment',
        data
      });
    };

    const handleHousekeepingStatus = (data: any) => {
      addNotification({
        title: 'Housekeeping Update',
        message: `Task ${data.id} status updated to ${data.status}`,
        type: 'housekeeping',
        data
      });
    };

    const handleServiceOrder = (data: any) => {
      addNotification({
        title: 'Service Order',
        message: `New service order created for booking ${data.bookingId}`,
        type: 'service_order',
        data
      });
    };

    const handleReviewCreated = (data: any) => {
      addNotification({
        title: 'New Review',
        message: `A new review was submitted`,
        type: 'review',
        data
      });
    };

    const handleGeneralNotification = (data: any) => {
      addNotification({
        title: data.title || 'Notification',
        message: data.message || JSON.stringify(data),
        type: data.type || 'info',
        data
      });
    };

    socket.on('room-status-changed', handleRoomStatus);
    socket.on('room-status-updated', handleRoomStatus);
    socket.on('booking-created', handleBookingCreated);
    socket.on('offline-reservation-created', handleBookingCreated);
    socket.on('booking-status-updated', handleBookingStatusUpdated);
    socket.on('booking-updated', handleBookingStatusUpdated);
    socket.on('payment-processed', handlePaymentProcessed);
    socket.on('payment-received', handlePaymentProcessed);
    socket.on('housekeeping-status-updated', handleHousekeepingStatus);
    socket.on('service-order-created', handleServiceOrder);
    socket.on('review-created', handleReviewCreated);
    socket.on('notification-received', handleGeneralNotification);

    return () => {
      socket.off('room-status-changed', handleRoomStatus);
      socket.off('room-status-updated', handleRoomStatus);
      socket.off('booking-created', handleBookingCreated);
      socket.off('offline-reservation-created', handleBookingCreated);
      socket.off('booking-status-updated', handleBookingStatusUpdated);
      socket.off('booking-updated', handleBookingStatusUpdated);
      socket.off('payment-processed', handlePaymentProcessed);
      socket.off('payment-received', handlePaymentProcessed);
      socket.off('housekeeping-status-updated', handleHousekeepingStatus);
      socket.off('service-order-created', handleServiceOrder);
      socket.off('review-created', handleReviewCreated);
      socket.off('notification-received', handleGeneralNotification);
    };
  }, [socket]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      clearNotifications,
      addNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
