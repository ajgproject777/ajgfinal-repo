import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  Booking,
  CartItem,
  MenuItem,
  RestaurantData,
  INITIAL_SAMPLE_BOOKINGS,
  MOCK_MENU_ITEMS,
  MOCK_RESTAURANTS,
} from '../data/mockData';

export interface NewBookingInput {
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  cuisine: string;
  address: string;
  date: string;
  time: string;
  guests: number;
  notes?: string;
  items: CartItem[];
  totalAmount: number;
}

export interface RouteSearchState {
  from: string;
  destination: string;
  distanceKm: number;
  estimatedDuration: string;
}

interface BookingContextType {
  // Cart
  cart: Record<string, CartItem[]>;
  addToCart: (restaurantId: string, item: MenuItem) => void;
  removeFromCart: (restaurantId: string, itemId: string) => void;
  updateQuantity: (restaurantId: string, itemId: string, quantity: number) => void;
  clearCart: (restaurantId: string) => void;
  getCart: (restaurantId: string) => CartItem[];
  getCartSummary: (restaurantId: string) => { count: number; subtotal: number; items: CartItem[] };

  // Bookings
  bookings: Booking[];
  createBooking: (input: NewBookingInput) => Booking;
  cancelBooking: (id: string) => boolean;
  getBookingById: (id: string) => Booking | undefined;

  // Active Route
  routeSearch: RouteSearchState;
  setRouteSearch: (state: RouteSearchState) => void;

  // Owner state (for Priority 7 dashboard)
  menuCatalog: Record<string, MenuItem[]>;
  toggleItemAvailability: (restaurantId: string, itemId: string) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Record<string, CartItem[]>>({});
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_SAMPLE_BOOKINGS);
  const [menuCatalog, setMenuCatalog] = useState<Record<string, MenuItem[]>>(MOCK_MENU_ITEMS);
  const [routeSearch, setRouteSearch] = useState<RouteSearchState>({
    from: 'Kochi (Edappally)',
    destination: 'Kozhikode (Calicut)',
    distanceKm: 178,
    estimatedDuration: '4 hr 15 min',
  });

  // Cart operations
  const addToCart = (restaurantId: string, item: MenuItem) => {
    if (!item.isAvailable) return;
    setCart((prev) => {
      const currentList = prev[restaurantId] || [];
      const existingIndex = currentList.findIndex((ci) => ci.menuItem.id === item.id);
      if (existingIndex > -1) {
        const updated = [...currentList];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return { ...prev, [restaurantId]: updated };
      }
      return {
        ...prev,
        [restaurantId]: [...currentList, { menuItem: item, quantity: 1 }],
      };
    });
  };

  const removeFromCart = (restaurantId: string, itemId: string) => {
    setCart((prev) => {
      const currentList = prev[restaurantId] || [];
      const existing = currentList.find((ci) => ci.menuItem.id === itemId);
      if (!existing) return prev;
      if (existing.quantity > 1) {
        return {
          ...prev,
          [restaurantId]: currentList.map((ci) =>
            ci.menuItem.id === itemId ? { ...ci, quantity: ci.quantity - 1 } : ci
          ),
        };
      }
      return {
        ...prev,
        [restaurantId]: currentList.filter((ci) => ci.menuItem.id !== itemId),
      };
    });
  };

  const updateQuantity = (restaurantId: string, itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => ({
        ...prev,
        [restaurantId]: (prev[restaurantId] || []).filter((ci) => ci.menuItem.id !== itemId),
      }));
      return;
    }
    setCart((prev) => ({
      ...prev,
      [restaurantId]: (prev[restaurantId] || []).map((ci) =>
        ci.menuItem.id === itemId ? { ...ci, quantity } : ci
      ),
    }));
  };

  const clearCart = (restaurantId: string) => {
    setCart((prev) => {
      const copy = { ...prev };
      delete copy[restaurantId];
      return copy;
    });
  };

  const getCart = (restaurantId: string): CartItem[] => {
    return cart[restaurantId] || [];
  };

  const getCartSummary = (restaurantId: string) => {
    const items = cart[restaurantId] || [];
    const count = items.reduce((acc, ci) => acc + ci.quantity, 0);
    const subtotal = items.reduce((acc, ci) => acc + ci.menuItem.price * ci.quantity, 0);
    return { count, subtotal, items };
  };

  // Booking operations
  const createBooking = (input: NewBookingInput): Booking => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newBooking: Booking = {
      id: `DG-2026-${randomSuffix}`,
      restaurantId: input.restaurantId,
      restaurantName: input.restaurantName,
      restaurantImage: input.restaurantImage,
      cuisine: input.cuisine,
      address: input.address,
      date: input.date,
      time: input.time,
      guests: Math.max(1, input.guests),
      notes: input.notes,
      items: input.items,
      totalAmount: input.totalAmount,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      isSimulated: true,
    };

    setBookings((prev) => [newBooking, ...prev]);
    // Clear cart for this restaurant after booking is confirmed
    clearCart(input.restaurantId);
    return newBooking;
  };

  const cancelBooking = (id: string): boolean => {
    let updated = false;
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === id && b.status !== 'cancelled') {
          updated = true;
          return { ...b, status: 'cancelled' as const };
        }
        return b;
      })
    );
    return updated;
  };

  const getBookingById = (id: string): Booking | undefined => {
    return bookings.find((b) => b.id === id);
  };

  // Owner state updates
  const toggleItemAvailability = (restaurantId: string, itemId: string) => {
    setMenuCatalog((prev) => {
      const items = prev[restaurantId] || [];
      const updated = items.map((item) =>
        item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
      );
      return { ...prev, [restaurantId]: updated };
    });
  };

  return (
    <BookingContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCart,
        getCartSummary,
        bookings,
        createBooking,
        cancelBooking,
        getBookingById,
        routeSearch,
        setRouteSearch,
        menuCatalog,
        toggleItemAvailability,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking(): BookingContextType {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
