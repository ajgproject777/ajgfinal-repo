import React, { createContext, useContext, useState, useCallback } from 'react';
import type {
  DashboardState,
  Reservation,
  ReservationStatus,
  OrderStatus,
  MenuItem,
  MenuCategory,
  RestaurantProfile,
  ActivityEvent,
  AppNotification,
} from '../types';
import {
  DEMO_RESERVATIONS,
  DEMO_ORDERS,
  DEMO_MENU_ITEMS,
  DEMO_PROFILE,
  DEMO_NOTIFICATIONS,
  DEMO_ACTIVITY,
} from '../data/demoData';

// ─── Context type ──────────────────────────────────────────────────────────

interface DashboardContextValue {
  state: DashboardState;
  // Reservations
  confirmReservation: (id: string) => void;
  rejectReservation: (id: string, reason: string) => void;
  completeReservation: (id: string) => void;
  cancelReservation: (id: string) => void;
  // Orders
  advanceOrderStatus: (id: string) => void;
  cancelOrder: (id: string) => void;
  // Menu
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, patch: Partial<Omit<MenuItem, 'id'>>) => void;
  deleteMenuItem: (id: string) => void;
  toggleMenuItemAvailability: (id: string) => void;
  // Profile
  updateProfile: (patch: Partial<RestaurantProfile>) => void;
  setRestaurantOpen: (open: boolean) => void;
  // Notifications
  markAllNotificationsRead: () => void;
  // Unread count
  unreadCount: number;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

// ─── Helpers ───────────────────────────────────────────────────────────────

const now = () => new Date().toISOString();
let activityIdCounter = 100;
const newActivity = (
  description: string,
  type: ActivityEvent['type']
): ActivityEvent => ({
  id: `a-${++activityIdCounter}`,
  description,
  timestamp: now(),
  type,
});

let menuIdCounter = 50;

// ─── Provider ──────────────────────────────────────────────────────────────

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<DashboardState>({
    reservations: DEMO_RESERVATIONS,
    orders: DEMO_ORDERS,
    menuItems: DEMO_MENU_ITEMS,
    profile: DEMO_PROFILE,
    notifications: DEMO_NOTIFICATIONS,
    recentActivity: DEMO_ACTIVITY,
  });

  const pushActivity = useCallback(
    (description: string, type: ActivityEvent['type']) => {
      const event = newActivity(description, type);
      setState((prev) => ({
        ...prev,
        recentActivity: [event, ...prev.recentActivity].slice(0, 20),
      }));
    },
    []
  );

  // ── Reservations ─────────────────────────────────────────────────────────

  const setReservationStatus = useCallback(
    (id: string, status: ReservationStatus, extra?: Partial<Reservation>) => {
      setState((prev) => ({
        ...prev,
        reservations: prev.reservations.map((r) =>
          r.id === id ? { ...r, status, ...extra } : r
        ),
      }));
    },
    []
  );

  const confirmReservation = useCallback(
    (id: string) => {
      setReservationStatus(id, 'confirmed');
      pushActivity(`Reservation ${id} confirmed`, 'reservation');
    },
    [setReservationStatus, pushActivity]
  );

  const rejectReservation = useCallback(
    (id: string, reason: string) => {
      setReservationStatus(id, 'rejected', { rejectionReason: reason });
      pushActivity(`Reservation ${id} rejected`, 'reservation');
    },
    [setReservationStatus, pushActivity]
  );

  const completeReservation = useCallback(
    (id: string) => {
      setReservationStatus(id, 'completed');
      pushActivity(`Reservation ${id} marked completed`, 'reservation');
    },
    [setReservationStatus, pushActivity]
  );

  const cancelReservation = useCallback(
    (id: string) => {
      setReservationStatus(id, 'cancelled');
      pushActivity(`Reservation ${id} cancelled`, 'reservation');
    },
    [setReservationStatus, pushActivity]
  );

  // ── Orders ───────────────────────────────────────────────────────────────

  const ORDER_FLOW: OrderStatus[] = ['received', 'preparing', 'ready', 'completed'];

  const advanceOrderStatus = useCallback(
    (id: string) => {
      setState((prev) => ({
        ...prev,
        orders: prev.orders.map((o) => {
          if (o.id !== id) return o;
          const idx = ORDER_FLOW.indexOf(o.status);
          const next = idx < ORDER_FLOW.length - 1 ? ORDER_FLOW[idx + 1] : o.status;
          return { ...o, status: next };
        }),
      }));
      pushActivity(`Order ${id} status advanced`, 'order');
    },
    [pushActivity, ORDER_FLOW]
  );

  const cancelOrder = useCallback(
    (id: string) => {
      setState((prev) => ({
        ...prev,
        orders: prev.orders.map((o) =>
          o.id === id ? { ...o, status: 'cancelled' as OrderStatus } : o
        ),
      }));
      pushActivity(`Order ${id} cancelled`, 'order');
    },
    [pushActivity]
  );

  // ── Menu ─────────────────────────────────────────────────────────────────

  const addMenuItem = useCallback(
    (item: Omit<MenuItem, 'id'>) => {
      const newItem: MenuItem = { ...item, id: `mi-${++menuIdCounter}` };
      setState((prev) => ({ ...prev, menuItems: [...prev.menuItems, newItem] }));
      pushActivity(`Menu item "${item.name}" added`, 'menu');
    },
    [pushActivity]
  );

  const updateMenuItem = useCallback(
    (id: string, patch: Partial<Omit<MenuItem, 'id'>>) => {
      setState((prev) => ({
        ...prev,
        menuItems: prev.menuItems.map((m) => (m.id === id ? { ...m, ...patch } : m)),
      }));
      pushActivity(`Menu item updated`, 'menu');
    },
    [pushActivity]
  );

  const deleteMenuItem = useCallback(
    (id: string) => {
      let deletedName = '';
      setState((prev) => {
        const item = prev.menuItems.find((m) => m.id === id);
        if (item) deletedName = item.name;
        return { ...prev, menuItems: prev.menuItems.filter((m) => m.id !== id) };
      });
      pushActivity(deletedName ? `Menu item "${deletedName}" deleted` : 'Menu item deleted', 'menu');
    },
    [pushActivity]
  );

  const toggleMenuItemAvailability = useCallback(
    (id: string) => {
      setState((prev) => ({
        ...prev,
        menuItems: prev.menuItems.map((m) =>
          m.id === id ? { ...m, isAvailable: !m.isAvailable } : m
        ),
      }));
    },
    []
  );

  // ── Profile ──────────────────────────────────────────────────────────────

  const updateProfile = useCallback(
    (patch: Partial<RestaurantProfile>) => {
      setState((prev) => ({ ...prev, profile: { ...prev.profile, ...patch } }));
      pushActivity('Restaurant profile updated', 'profile');
    },
    [pushActivity]
  );

  const setRestaurantOpen = useCallback((open: boolean) => {
    setState((prev) => ({ ...prev, profile: { ...prev.profile, isOpen: open } }));
  }, []);

  // ── Notifications ────────────────────────────────────────────────────────

  const markAllNotificationsRead = useCallback(() => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n: AppNotification) => ({ ...n, read: true })),
    }));
  }, []);

  const unreadCount = state.notifications.filter((n) => !n.read).length;

  const value: DashboardContextValue = {
    state,
    confirmReservation,
    rejectReservation,
    completeReservation,
    cancelReservation,
    advanceOrderStatus,
    cancelOrder,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleMenuItemAvailability,
    updateProfile,
    setRestaurantOpen,
    markAllNotificationsRead,
    unreadCount,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = (): DashboardContextValue => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
};

// Re-export MenuCategory for convenience
export type { MenuCategory };
