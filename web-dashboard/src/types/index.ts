// ─── Existing API types ────────────────────────────────────────────────────
export interface BackendHealth {
  status: string;
  app: string;
  version: string;
  environment: string;
  database?: string;
}

export interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  status: number;
}

// ─── Navigation ────────────────────────────────────────────────────────────
export type NavPage =
  | 'overview'
  | 'reservations'
  | 'orders'
  | 'menu'
  | 'profile'
  | 'settings';

// ─── Auth ──────────────────────────────────────────────────────────────────
export interface OwnerUser {
  id: string;
  name: string;
  email: string;
  role: 'owner';
  restaurantId: string;
  avatarInitials: string;
}

// ─── Reservation ───────────────────────────────────────────────────────────
export type ReservationStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'rejected';

export interface Reservation {
  id: string;           // e.g. DG-2026-8942
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;         // ISO date "2026-10-28"
  time: string;         // "19:30"
  guests: number;
  notes: string;
  hasPreOrder: boolean;
  orderId: string | null;
  status: ReservationStatus;
  createdAt: string;    // ISO datetime
  rejectionReason?: string;
}

// ─── Food Order ────────────────────────────────────────────────────────────
export type OrderStatus =
  | 'received'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled';

export interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface FoodOrder {
  id: string;           // e.g. ORD-2026-1044
  reservationId: string | null;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  placedAt: string;     // ISO datetime
}

// ─── Menu ──────────────────────────────────────────────────────────────────
export type MenuCategory =
  | 'Starters'
  | 'Main Course'
  | 'Breads'
  | 'Rice'
  | 'Beverages'
  | 'Desserts';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: MenuCategory;
  price: number;
  isVeg: boolean;
  isAvailable: boolean;
}

// ─── Restaurant Profile ────────────────────────────────────────────────────
export type VerificationStatus = 'verified' | 'pending' | 'rejected';

export interface RestaurantProfile {
  id: string;
  name: string;
  ownerName: string;
  description: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  email: string;
  phone: string;
  cuisineTypes: string[];
  openingHours: string;
  closingHours: string;
  facilities: string[];
  verificationStatus: VerificationStatus;
  isOpen: boolean;
  highwayCorridor: string;
  highwayKmMark: number;
}

// ─── Notification ──────────────────────────────────────────────────────────
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'reservation' | 'order' | 'system';
}

// ─── Dashboard state ───────────────────────────────────────────────────────
export interface DashboardState {
  reservations: Reservation[];
  orders: FoodOrder[];
  menuItems: MenuItem[];
  profile: RestaurantProfile;
  notifications: AppNotification[];
  recentActivity: ActivityEvent[];
}

export interface ActivityEvent {
  id: string;
  description: string;
  timestamp: string;
  type: 'reservation' | 'order' | 'menu' | 'profile' | 'system';
}
