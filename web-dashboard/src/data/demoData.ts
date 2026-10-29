// ─── DEMO DATA ─────────────────────────────────────────────────────────────
// All data below is fictional sample data for demonstration purposes.
// It does not represent real customers, restaurants, or transactions.
// ───────────────────────────────────────────────────────────────────────────

import type {
  Reservation,
  FoodOrder,
  MenuItem,
  RestaurantProfile,
  AppNotification,
  ActivityEvent,
  OwnerUser,
} from '../types';

const DEMO_OWNER_EMAIL = (import.meta.env.VITE_DEMO_OWNER_EMAIL as string) || 'owner@dinego.demo';

export const DEMO_OWNER: OwnerUser = {
  id: 'owner-001',
  name: 'AJG sample',
  email: DEMO_OWNER_EMAIL,
  role: 'owner',
  restaurantId: 'rest-coastal-01',
  avatarInitials: 'AJ',
};

export const DEMO_CREDENTIALS = {
  email: DEMO_OWNER_EMAIL,
  password: 'DineGoDemo123!',
};

export const DEMO_PROFILE: RestaurantProfile = {
  id: 'rest-coastal-01',
  name: 'Coastal Curry House',
  ownerName: 'AJG sample',
  description:
    'Famous for crispy neer dosas with chicken sukka and crab ghee roast. Located right off the Kozhikode bypass with dedicated travel parking. A favourite pitstop for highway travellers on NH 66.',
  address: 'Ramanattukara Highway Junction',
  city: 'Kozhikode',
  state: 'Kerala',
  pincode: '673633',
  email: 'coastal.curryhouse@dinego.demo',
  phone: '+91 98460 77889',
  cuisineTypes: ['Mangalorean', 'Malabar', 'Seafood'],
  openingHours: '11:30',
  closingHours: '23:00',
  facilities: ['Private Dining Cabins', 'Fast Highway Exit', 'Generous Parking Space', 'UPI Payments', 'AC Dining'],
  verificationStatus: 'verified',
  isOpen: true,
  highwayCorridor: 'NH 66 (Kochi — Kozhikode)',
  highwayKmMark: 168,
};

// ─── Reservations ───────────────────────────────────────────────────────────

export const DEMO_RESERVATIONS: Reservation[] = [
  {
    id: 'DG-2026-8942',
    customerName: 'Priya Nair',
    customerEmail: 'priya.nair@email.demo',
    customerPhone: '+91 94470 11223',
    date: '2026-10-28',
    time: '19:30',
    guests: 3,
    notes: 'Window table preferred, travelling with family on NH 66.',
    hasPreOrder: true,
    orderId: 'ORD-2026-1044',
    status: 'confirmed',
    createdAt: '2026-10-28T12:00:00Z',
  },
  {
    id: 'DG-2026-9015',
    customerName: 'Rahul Menon',
    customerEmail: 'rahul.menon@email.demo',
    customerPhone: '+91 98471 44556',
    date: '2026-10-28',
    time: '20:00',
    guests: 2,
    notes: 'Stopping on the way to Calicut. Quick service needed.',
    hasPreOrder: true,
    orderId: 'ORD-2026-1045',
    status: 'pending',
    createdAt: '2026-10-28T13:15:00Z',
  },
  {
    id: 'DG-2026-9023',
    customerName: 'Divya Pillai',
    customerEmail: 'divya.pillai@email.demo',
    customerPhone: '+91 90470 78901',
    date: '2026-10-28',
    time: '21:00',
    guests: 4,
    notes: 'Birthday dinner. Cake allowed?',
    hasPreOrder: false,
    orderId: null,
    status: 'pending',
    createdAt: '2026-10-28T14:00:00Z',
  },
  {
    id: 'DG-2026-8901',
    customerName: 'Sanjay Varma',
    customerEmail: 'sanjay.varma@email.demo',
    customerPhone: '+91 94461 33221',
    date: '2026-10-27',
    time: '19:00',
    guests: 2,
    notes: '',
    hasPreOrder: false,
    orderId: null,
    status: 'completed',
    createdAt: '2026-10-27T11:00:00Z',
  },
  {
    id: 'DG-2026-8855',
    customerName: 'Meera Kutty',
    customerEmail: 'meera.kutty@email.demo',
    customerPhone: '+91 98460 99887',
    date: '2026-10-27',
    time: '20:30',
    guests: 5,
    notes: 'Large family group. Need a big table.',
    hasPreOrder: true,
    orderId: 'ORD-2026-1040',
    status: 'completed',
    createdAt: '2026-10-27T10:30:00Z',
  },
  {
    id: 'DG-2026-8731',
    customerName: 'Arun Thomas',
    customerEmail: 'arun.thomas@email.demo',
    customerPhone: '+91 94470 66778',
    date: '2026-10-26',
    time: '18:30',
    guests: 2,
    notes: '',
    hasPreOrder: false,
    orderId: null,
    status: 'cancelled',
    createdAt: '2026-10-26T09:00:00Z',
  },
  {
    id: 'DG-2026-8650',
    customerName: 'Lakshmi Babu',
    customerEmail: 'lakshmi.babu@email.demo',
    customerPhone: '+91 90476 12345',
    date: '2026-10-26',
    time: '21:30',
    guests: 1,
    notes: 'Single traveller, prefers quiet corner.',
    hasPreOrder: false,
    orderId: null,
    status: 'rejected',
    createdAt: '2026-10-26T08:00:00Z',
    rejectionReason: 'Restaurant fully booked for requested time.',
  },
  {
    id: 'DG-2026-9031',
    customerName: 'Vijay Kumar',
    customerEmail: 'vijay.kumar@email.demo',
    customerPhone: '+91 98472 55443',
    date: '2026-10-29',
    time: '19:00',
    guests: 6,
    notes: 'Office team outing. Need projector if available.',
    hasPreOrder: false,
    orderId: null,
    status: 'pending',
    createdAt: '2026-10-28T15:00:00Z',
  },
];

// ─── Food Orders ────────────────────────────────────────────────────────────

export const DEMO_ORDERS: FoodOrder[] = [
  {
    id: 'ORD-2026-1044',
    reservationId: 'DG-2026-8942',
    customerName: 'Priya Nair',
    items: [
      { name: 'Chicken Sukka with Neer Dosa', quantity: 2, unitPrice: 290 },
      { name: 'Anjal Tawa Fry', quantity: 1, unitPrice: 360 },
      { name: 'Sulaimani Black Tea', quantity: 3, unitPrice: 40 },
    ],
    totalAmount: 1060,
    status: 'preparing',
    placedAt: '2026-10-28T12:05:00Z',
  },
  {
    id: 'ORD-2026-1045',
    reservationId: 'DG-2026-9015',
    customerName: 'Rahul Menon',
    items: [
      { name: 'Kori Rotti (Kerala Style)', quantity: 2, unitPrice: 320 },
      { name: 'Tender Coconut Water', quantity: 2, unitPrice: 70 },
    ],
    totalAmount: 780,
    status: 'received',
    placedAt: '2026-10-28T13:20:00Z',
  },
  {
    id: 'ORD-2026-1040',
    reservationId: 'DG-2026-8855',
    customerName: 'Meera Kutty',
    items: [
      { name: 'Chicken Sukka with Neer Dosa', quantity: 4, unitPrice: 290 },
      { name: 'Crab Ghee Roast', quantity: 2, unitPrice: 440 },
      { name: 'Prawn Ghee Roast', quantity: 2, unitPrice: 380 },
      { name: 'Filter Coffee', quantity: 5, unitPrice: 50 },
    ],
    totalAmount: 2890,
    status: 'completed',
    placedAt: '2026-10-27T10:35:00Z',
  },
  {
    id: 'ORD-2026-1038',
    reservationId: null,
    customerName: 'Walk-in Customer',
    items: [
      { name: 'Anjal Tawa Fry', quantity: 1, unitPrice: 360 },
      { name: 'Neer Dosa (4 pcs)', quantity: 2, unitPrice: 80 },
    ],
    totalAmount: 520,
    status: 'ready',
    placedAt: '2026-10-28T13:45:00Z',
  },
];

// ─── Menu Items ─────────────────────────────────────────────────────────────

export const DEMO_MENU_ITEMS: MenuItem[] = [
  { id: 'mi-01', name: 'Chicken Sukka with Neer Dosa', description: 'Dry roasted chicken with coconut, red chillies, and curry leaves, served with 4 rice crepes.', category: 'Main Course', price: 290, isVeg: false, isAvailable: true },
  { id: 'mi-02', name: 'Kori Rotti', description: 'Traditional Mangalorean crispy rice wafers in rich coconut chicken gravy.', category: 'Main Course', price: 320, isVeg: false, isAvailable: true },
  { id: 'mi-03', name: 'Anjal (Seer Fish) Tawa Fry', description: 'Thick kingfish slice coated in tangy Kundapur masala, shallow pan-fried.', category: 'Starters', price: 360, isVeg: false, isAvailable: true },
  { id: 'mi-04', name: 'Crab Ghee Roast', description: 'Whole mud crab roasted in aromatic ghee and Kundapur red chilli paste.', category: 'Main Course', price: 440, isVeg: false, isAvailable: true },
  { id: 'mi-05', name: 'Prawn Ghee Roast', description: 'Tiger prawns roasted in clarified butter and spicy masala.', category: 'Starters', price: 380, isVeg: false, isAvailable: true },
  { id: 'mi-06', name: 'Neer Dosa (4 pcs)', description: 'Paper-thin rice crepes, plain or with coconut chutney.', category: 'Breads', price: 80, isVeg: true, isAvailable: true },
  { id: 'mi-07', name: 'Sulaimani Black Tea', description: 'Spiced black tea with cardamom, mint, and lemon.', category: 'Beverages', price: 40, isVeg: true, isAvailable: true },
  { id: 'mi-08', name: 'Filter Coffee', description: 'South Indian chicory-blend filter coffee, served in traditional tumbler.', category: 'Beverages', price: 50, isVeg: true, isAvailable: true },
  { id: 'mi-09', name: 'Tender Coconut Water', description: 'Fresh chilled natural coconut water.', category: 'Beverages', price: 70, isVeg: true, isAvailable: true },
  { id: 'mi-10', name: 'Malabar Chicken Biryani', description: 'Fragrant Kaima rice cooked with spiced chicken and fried onions.', category: 'Rice', price: 310, isVeg: false, isAvailable: true },
  { id: 'mi-11', name: 'Ghee Rice', description: 'Aromatic basmati rice slow-cooked in desi ghee, raisins, and cashews.', category: 'Rice', price: 180, isVeg: true, isAvailable: true },
  { id: 'mi-12', name: 'Elaneer Payasam', description: 'Tender coconut pulp in reduced condensed milk with cardamom.', category: 'Desserts', price: 140, isVeg: true, isAvailable: true },
  { id: 'mi-13', name: 'Vegetable Stew with Appam', description: 'Mild coconut milk vegetable stew with two lacy rice hoppers.', category: 'Main Course', price: 200, isVeg: true, isAvailable: true },
  { id: 'mi-14', name: 'Calamari Pepper Fry', description: 'Squid rings tossed with crushed pepper, shallots, and curry leaves.', category: 'Starters', price: 320, isVeg: false, isAvailable: false },
];

// ─── Notifications ──────────────────────────────────────────────────────────

export const DEMO_NOTIFICATIONS: AppNotification[] = [
  { id: 'n-01', title: 'New Reservation', message: 'DG-2026-9031 — Vijay Kumar (6 guests) for Oct 29 at 7:00 PM.', time: '2026-10-28T15:00:00Z', read: false, type: 'reservation' },
  { id: 'n-02', title: 'New Reservation', message: 'DG-2026-9023 — Divya Pillai (4 guests) for today at 9:00 PM.', time: '2026-10-28T14:00:00Z', read: false, type: 'reservation' },
  { id: 'n-03', title: 'New Pre-Order', message: 'ORD-2026-1045 received from Rahul Menon. ₹780 total.', time: '2026-10-28T13:20:00Z', read: false, type: 'order' },
  { id: 'n-04', title: 'Order Ready', message: 'ORD-2026-1038 is ready for pickup.', time: '2026-10-28T13:50:00Z', read: true, type: 'order' },
  { id: 'n-05', title: 'System', message: 'DineGo partner portal connected and operational.', time: '2026-10-28T11:00:00Z', read: true, type: 'system' },
];

// ─── Recent Activity ────────────────────────────────────────────────────────

export const DEMO_ACTIVITY: ActivityEvent[] = [
  { id: 'a-01', description: 'New reservation DG-2026-9031 received from Vijay Kumar', timestamp: '2026-10-28T15:00:00Z', type: 'reservation' },
  { id: 'a-02', description: 'New reservation DG-2026-9023 received from Divya Pillai', timestamp: '2026-10-28T14:00:00Z', type: 'reservation' },
  { id: 'a-03', description: 'Pre-order ORD-2026-1045 received from Rahul Menon (₹780)', timestamp: '2026-10-28T13:20:00Z', type: 'order' },
  { id: 'a-04', description: 'Order ORD-2026-1038 marked as Ready', timestamp: '2026-10-28T13:50:00Z', type: 'order' },
  { id: 'a-05', description: 'Reservation DG-2026-8942 confirmed for Priya Nair', timestamp: '2026-10-28T12:10:00Z', type: 'reservation' },
  { id: 'a-06', description: 'Pre-order ORD-2026-1044 started preparing', timestamp: '2026-10-28T12:05:00Z', type: 'order' },
];
