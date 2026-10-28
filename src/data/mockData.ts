export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: 'Starters' | 'Main Course' | 'Beverages' | 'Desserts';
  isVeg: boolean;
  isAvailable: boolean;
  imageUri: string;
  prepTimeMinutes: number;
}

export interface RestaurantData {
  id: string;
  name: string;
  tagline: string;
  cuisine: string;
  rating: number;
  reviewsCount: number;
  priceRange: '₹' | '₹₹' | '₹₹₹';
  address: string;
  city: string;
  phone: string;
  openingHours: string;
  offRouteKm: number;
  detourMinutes: number;
  nextSlot: string;
  imageUri: string;
  description: string;
  popularDishes: string[];
  amenities: string[];
  highwayCorridor: string;
  highwayKmMark: number;
  isSample: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export type BookingStatus = 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string; // e.g. DG-2026-8942
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
  status: BookingStatus;
  createdAt: string;
  isSimulated: boolean;
}

export const MOCK_RESTAURANTS: RestaurantData[] = [
  {
    id: 'sample-1',
    name: 'Malabar Spice Kitchen',
    tagline: 'Authentic Kerala Delicacies & Highway Comfort',
    cuisine: 'Kerala & Coastal',
    rating: 4.7,
    reviewsCount: 342,
    priceRange: '₹₹',
    address: 'NH 66 Bypass, Near Edappally Toll, Kochi',
    city: 'Kochi',
    phone: '+91 98470 12345',
    openingHours: '11:00 AM – 11:30 PM',
    offRouteKm: 0.4,
    detourMinutes: 3,
    nextSlot: '7:00 PM',
    imageUri: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=450&fit=crop&auto=format',
    description: 'Renowned for slow-cooked Thalassery Dum Biryani and fresh coastal fish curries. Features a spacious family dining hall, pristine highway restrooms, and express table reservations for road travellers.',
    popularDishes: ['Thalassery Mutton Biryani', 'Karimeen Pollichathu', 'Appam with Stew', 'Kulukki Sarbath'],
    amenities: ['Clean Highway Restrooms', 'Ample Car Parking', 'EV Fast Charger', 'AC Family Dining', 'Express Takeaway'],
    highwayCorridor: 'NH 66 (Kochi — Kozhikode)',
    highwayKmMark: 18,
    isSample: true,
  },
  {
    id: 'sample-2',
    name: 'Backwater Bites',
    tagline: 'Fresh Catch Along the Coastal Corridor',
    cuisine: 'Seafood Speciality',
    rating: 4.5,
    reviewsCount: 218,
    priceRange: '₹₹₹',
    address: 'Beach Road Highway Link, Kodungallur',
    city: 'Kodungallur',
    phone: '+91 94471 54321',
    openingHours: '12:00 PM – 10:45 PM',
    offRouteKm: 0.2,
    detourMinutes: 2,
    nextSlot: '8:30 PM',
    imageUri: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&h=450&fit=crop&auto=format',
    description: 'Scenic highway pitstop famous for clay-pot fish curry meals, prawn ghee roast, and refreshing tender coconut coolers. Quick service guaranteed for long-distance drivers.',
    popularDishes: ['Prawn Ghee Roast', 'Nadan Fish Curry Meals', 'Squid Pepper Fry', 'Tender Coconut Shake'],
    amenities: ['Scenic Water View', 'Valet Parking', 'Dedicated Drivers Lounge', 'Card & UPI Payments'],
    highwayCorridor: 'NH 66 (Kochi — Kozhikode)',
    highwayKmMark: 52,
    isSample: true,
  },
  {
    id: 'sample-3',
    name: 'Highway Dhaba 66',
    tagline: 'Clay Oven Tandoori & Punjabi Highway Feasts',
    cuisine: 'North Indian & Mughlai',
    rating: 4.6,
    reviewsCount: 489,
    priceRange: '₹₹',
    address: 'Kuttippuram Bypass Junction, NH 66',
    city: 'Kuttippuram',
    phone: '+91 98950 98765',
    openingHours: '24 Hours Open',
    offRouteKm: 0.8,
    detourMinutes: 4,
    nextSlot: '6:30 PM',
    imageUri: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&h=450&fit=crop&auto=format',
    description: 'The ultimate 24/7 highway sanctuary. Serving sizzling garlic naans straight from the tandoor, creamy dal makhani, and refreshing clay-pot matka lassi.',
    popularDishes: ['Butter Chicken Masala', 'Amritsari Kulcha', 'Dal Makhani', 'Kesari Matka Lassi'],
    amenities: ['24/7 Service', 'Truck & SUV Parking', 'Outdoor Charpai Seating', 'High-Speed Wi-Fi'],
    highwayCorridor: 'NH 66 (Kochi — Kozhikode)',
    highwayKmMark: 98,
    isSample: true,
  },
  {
    id: 'sample-4',
    name: 'Nilgiri Tea Nest & Cafe',
    tagline: 'Artisanal Brews & South Indian Highway Tiffin',
    cuisine: 'South Indian & Cafe',
    rating: 4.8,
    reviewsCount: 195,
    priceRange: '₹',
    address: 'Valanchery Hill Highway Turn, Malappuram',
    city: 'Valanchery',
    phone: '+91 97455 33221',
    openingHours: '6:30 AM – 10:00 PM',
    offRouteKm: 0.3,
    detourMinutes: 2,
    nextSlot: '7:15 PM',
    imageUri: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=450&fit=crop&auto=format',
    description: 'Crisp ghee podi dosas, piping hot steamed idlis, and freshly ground Chikmagalur filter coffee. Ideal for an energising morning or evening driving break.',
    popularDishes: ['Ghee Roast Dosa', 'Medu Vada Platter', 'Degree Filter Coffee', 'Elaneer Payasam'],
    amenities: ['Clean Restrooms', 'Baby Care Facility', 'Fast Highway Takeaway', 'Garden Seating'],
    highwayCorridor: 'NH 66 (Kochi — Kozhikode)',
    highwayKmMark: 135,
    isSample: true,
  },
  {
    id: 'sample-5',
    name: 'Coastal Curry House',
    tagline: 'Traditional Mangalorean Flavours on Kozhikode Bypass',
    cuisine: 'Mangalorean & Malabar',
    rating: 4.6,
    reviewsCount: 310,
    priceRange: '₹₹',
    address: 'Ramanattukara Highway Junction, Calicut',
    city: 'Kozhikode',
    phone: '+91 98460 77889',
    openingHours: '11:30 AM – 11:00 PM',
    offRouteKm: 0.5,
    detourMinutes: 3,
    nextSlot: '8:00 PM',
    imageUri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=450&fit=crop&auto=format',
    description: 'Famous for crispy neer dosas with chicken sukka and crab ghee roast. Located right off the Kozhikode bypass with dedicated travel parking.',
    popularDishes: ['Chicken Sukka with Neer Dosa', 'Kori Rotti', 'Anjal Tawa Fry', 'Sulaimani Tea'],
    amenities: ['Private Dining Cabins', 'Fast Highway Exit', 'Generous Parking Space'],
    highwayCorridor: 'NH 66 (Kochi — Kozhikode)',
    highwayKmMark: 168,
    isSample: true,
  },
];

export const MOCK_MENU_ITEMS: Record<string, MenuItem[]> = {
  'sample-1': [
    // Starters
    {
      id: 'm1-1',
      restaurantId: 'sample-1',
      name: 'Kerala Chicken 65',
      description: 'Crisp deep-fried chicken tossed with curry leaves, crushed pepper, and green chillies.',
      price: 240,
      category: 'Starters',
      isVeg: false,
      isAvailable: true,
      imageUri: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&fit=crop&auto=format',
      prepTimeMinutes: 12,
    },
    {
      id: 'm1-2',
      restaurantId: 'sample-1',
      name: 'Paneer Pepper Fry',
      description: 'Cubes of fresh cottage cheese stir-fried with Tellicherry black pepper and shallots.',
      price: 210,
      category: 'Starters',
      isVeg: true,
      isAvailable: true,
      imageUri: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&fit=crop&auto=format',
      prepTimeMinutes: 10,
    },
    {
      id: 'm1-3',
      restaurantId: 'sample-1',
      name: 'Karimeen Pollichathu',
      description: 'Pearl spot fish marinated in spicy onion-tomato masala, wrapped in banana leaf and pan-grilled.',
      price: 390,
      category: 'Starters',
      isVeg: false,
      isAvailable: true,
      imageUri: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&fit=crop&auto=format',
      prepTimeMinutes: 20,
    },
    // Main Course
    {
      id: 'm1-4',
      restaurantId: 'sample-1',
      name: 'Thalassery Dum Biryani',
      description: 'Fragrant Kaima rice cooked with tender mutton, saffron, fried onions, and whole aromatic spices.',
      price: 320,
      category: 'Main Course',
      isVeg: false,
      isAvailable: true,
      imageUri: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&fit=crop&auto=format',
      prepTimeMinutes: 15,
    },
    {
      id: 'm1-5',
      restaurantId: 'sample-1',
      name: 'Malabar Parotta with Chicken Curry',
      description: 'Two flaky, multi-layered flatbreads served with rich roasted coconut chicken gravy.',
      price: 260,
      category: 'Main Course',
      isVeg: false,
      isAvailable: true,
      imageUri: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&fit=crop&auto=format',
      prepTimeMinutes: 14,
    },
    {
      id: 'm1-6',
      restaurantId: 'sample-1',
      name: 'Appam with Vegetable Stew',
      description: 'Soft-centered lacy rice hoppers served with mild coconut milk vegetable stew.',
      price: 180,
      category: 'Main Course',
      isVeg: true,
      isAvailable: true,
      imageUri: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&fit=crop&auto=format',
      prepTimeMinutes: 10,
    },
    // Beverages
    {
      id: 'm1-7',
      restaurantId: 'sample-1',
      name: 'Kulukki Sarbath',
      description: 'Shaken lemonade with sabja seeds, crushed green chillies, and ginger twist.',
      price: 60,
      category: 'Beverages',
      isVeg: true,
      isAvailable: true,
      imageUri: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&fit=crop&auto=format',
      prepTimeMinutes: 5,
    },
    {
      id: 'm1-8',
      restaurantId: 'sample-1',
      name: 'Spiced Buttermilk (Sambharam)',
      description: 'Chilled salted buttermilk blended with shallots, curry leaves, and ginger.',
      price: 50,
      category: 'Beverages',
      isVeg: true,
      isAvailable: true,
      imageUri: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&fit=crop&auto=format',
      prepTimeMinutes: 4,
    },
    // Desserts
    {
      id: 'm1-9',
      restaurantId: 'sample-1',
      name: 'Elaneer Payasam',
      description: 'Creamy tender coconut pulp simmered in reduced condensed milk with crushed cardamom.',
      price: 140,
      category: 'Desserts',
      isVeg: true,
      isAvailable: true,
      imageUri: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600&fit=crop&auto=format',
      prepTimeMinutes: 5,
    },
    {
      id: 'm1-10',
      restaurantId: 'sample-1',
      name: 'Pazham Pori with Vanilla Ice Cream',
      description: 'Golden fried ripe Nendran banana fritters served with rich vanilla bean ice cream.',
      price: 130,
      category: 'Desserts',
      isVeg: true,
      isAvailable: false, // marked unavailable to demo unavailable state
      imageUri: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&fit=crop&auto=format',
      prepTimeMinutes: 8,
    },
  ],
  'sample-2': [
    {
      id: 'm2-1',
      restaurantId: 'sample-2',
      name: 'Prawn Ghee Roast',
      description: 'Juicy tiger prawns roasted in fragrant clarified butter and Kundapur red chilli paste.',
      price: 380,
      category: 'Starters',
      isVeg: false,
      isAvailable: true,
      imageUri: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&fit=crop&auto=format',
      prepTimeMinutes: 15,
    },
    {
      id: 'm2-2',
      restaurantId: 'sample-2',
      name: 'Squid Golden Pepper Fry',
      description: 'Tender squid rings tossed with crushed shallots, black pepper, and curry leaves.',
      price: 320,
      category: 'Starters',
      isVeg: false,
      isAvailable: true,
      imageUri: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&fit=crop&auto=format',
      prepTimeMinutes: 14,
    },
    {
      id: 'm2-3',
      restaurantId: 'sample-2',
      name: 'Special Coastal Fish Meal',
      description: 'Steamed red matta rice, kingfish curry, thoran, avial, fish fry, moru curry, and pickle.',
      price: 290,
      category: 'Main Course',
      isVeg: false,
      isAvailable: true,
      imageUri: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&fit=crop&auto=format',
      prepTimeMinutes: 12,
    },
    {
      id: 'm2-4',
      restaurantId: 'sample-2',
      name: 'Neer Dosa with Fish Curry',
      description: 'Four paper-thin, melt-in-the-mouth rice crepes served with spicy coastal gravy.',
      price: 240,
      category: 'Main Course',
      isVeg: false,
      isAvailable: true,
      imageUri: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&fit=crop&auto=format',
      prepTimeMinutes: 10,
    },
    {
      id: 'm2-5',
      restaurantId: 'sample-2',
      name: 'Fresh Tender Coconut Water',
      description: 'Chilled sweet natural coconut water straight from local groves.',
      price: 70,
      category: 'Beverages',
      isVeg: true,
      isAvailable: true,
      imageUri: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=600&fit=crop&auto=format',
      prepTimeMinutes: 3,
    },
  ],
  'sample-3': [
    {
      id: 'm3-1',
      restaurantId: 'sample-3',
      name: 'Murgh Malai Tikka',
      description: 'Boneless chicken chunks marinated in cream, cheese, and mild spices, chargrilled to perfection.',
      price: 310,
      category: 'Starters',
      isVeg: false,
      isAvailable: true,
      imageUri: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&fit=crop&auto=format',
      prepTimeMinutes: 15,
    },
    {
      id: 'm3-2',
      restaurantId: 'sample-3',
      name: 'Highway Butter Chicken',
      description: 'Tandoori chicken simmered in rich, velvety tomato butter gravy with dried fenugreek.',
      price: 340,
      category: 'Main Course',
      isVeg: false,
      isAvailable: true,
      imageUri: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&fit=crop&auto=format',
      prepTimeMinutes: 14,
    },
    {
      id: 'm3-3',
      restaurantId: 'sample-3',
      name: 'Dal Makhani with Garlic Naan',
      description: 'Slow-simmered black lentils cooked overnight with butter and cream, served with fresh garlic naan.',
      price: 250,
      category: 'Main Course',
      isVeg: true,
      isAvailable: true,
      imageUri: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=600&fit=crop&auto=format',
      prepTimeMinutes: 10,
    },
    {
      id: 'm3-4',
      restaurantId: 'sample-3',
      name: 'Patiala Clay-Pot Lassi',
      description: 'Thick, sweet Punjabi yogurt lassi served in an earthen kulhad topped with clotted malai.',
      price: 90,
      category: 'Beverages',
      isVeg: true,
      isAvailable: true,
      imageUri: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&fit=crop&auto=format',
      prepTimeMinutes: 4,
    },
  ],
  'sample-4': [
    {
      id: 'm4-1',
      restaurantId: 'sample-4',
      name: 'Crispy Medu Vada (2 pcs)',
      description: 'Golden spiced lentil donuts served with fresh coconut chutney and piping hot sambar.',
      price: 90,
      category: 'Starters',
      isVeg: true,
      isAvailable: true,
      imageUri: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&fit=crop&auto=format',
      prepTimeMinutes: 6,
    },
    {
      id: 'm4-2',
      restaurantId: 'sample-4',
      name: 'Ghee Podi Roast Dosa',
      description: 'Crisp wafer-thin dosa smeared with pure desi ghee and fiery gun powder spice blend.',
      price: 140,
      category: 'Main Course',
      isVeg: true,
      isAvailable: true,
      imageUri: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=600&fit=crop&auto=format',
      prepTimeMinutes: 8,
    },
    {
      id: 'm4-3',
      restaurantId: 'sample-4',
      name: 'Degree Filter Coffee',
      description: 'Authentic South Indian chicory-blend brew frothed in brass davarah-tumbler.',
      price: 50,
      category: 'Beverages',
      isVeg: true,
      isAvailable: true,
      imageUri: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&fit=crop&auto=format',
      prepTimeMinutes: 3,
    },
  ],
  'sample-5': [
    {
      id: 'm5-1',
      restaurantId: 'sample-5',
      name: 'Mangalorean Chicken Sukka',
      description: 'Dry roasted chicken tossed with freshly grated coconut, whole red chillies, and curry leaves.',
      price: 290,
      category: 'Main Course',
      isVeg: false,
      isAvailable: true,
      imageUri: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&fit=crop&auto=format',
      prepTimeMinutes: 14,
    },
    {
      id: 'm5-2',
      restaurantId: 'sample-5',
      name: 'Anjal (Seer Fish) Tawa Fry',
      description: 'Single thick slice of Kingfish coated in tangy Kundapur masala and shallow pan-fried.',
      price: 360,
      category: 'Starters',
      isVeg: false,
      isAvailable: true,
      imageUri: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&fit=crop&auto=format',
      prepTimeMinutes: 15,
    },
    {
      id: 'm5-3',
      restaurantId: 'sample-5',
      name: 'Sulaimani Black Tea with Mint',
      description: 'Warm spiced black tea scented with cardamom, fresh mint leaves, and a squeeze of lemon.',
      price: 40,
      category: 'Beverages',
      isVeg: true,
      isAvailable: true,
      imageUri: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&fit=crop&auto=format',
      prepTimeMinutes: 3,
    },
  ],
};

export const INITIAL_SAMPLE_BOOKINGS: Booking[] = [
  {
    id: 'DG-2026-8942',
    restaurantId: 'sample-1',
    restaurantName: 'Malabar Spice Kitchen',
    restaurantImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=450&fit=crop&auto=format',
    cuisine: 'Kerala & Coastal',
    address: 'NH 66 Bypass, Near Edappally Toll, Kochi',
    date: 'Today',
    time: '7:30 PM',
    guests: 3,
    notes: 'Window table please, travelling with family on NH 66.',
    items: [
      {
        menuItem: {
          id: 'm1-4',
          restaurantId: 'sample-1',
          name: 'Thalassery Dum Biryani',
          description: 'Fragrant Kaima rice cooked with tender mutton, saffron, fried onions.',
          price: 320,
          category: 'Main Course',
          isVeg: false,
          isAvailable: true,
          imageUri: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&fit=crop&auto=format',
          prepTimeMinutes: 15,
        },
        quantity: 2,
      },
      {
        menuItem: {
          id: 'm1-7',
          restaurantId: 'sample-1',
          name: 'Kulukki Sarbath',
          description: 'Shaken lemonade with sabja seeds.',
          price: 60,
          category: 'Beverages',
          isVeg: true,
          isAvailable: true,
          imageUri: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&fit=crop&auto=format',
          prepTimeMinutes: 5,
        },
        quantity: 3,
      },
    ],
    totalAmount: 820,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    isSimulated: true,
  },
  {
    id: 'DG-2026-6115',
    restaurantId: 'sample-3',
    restaurantName: 'Highway Dhaba 66',
    restaurantImage: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&h=450&fit=crop&auto=format',
    cuisine: 'North Indian & Mughlai',
    address: 'Kuttippuram Bypass Junction, NH 66',
    date: '3 Days Ago',
    time: '2:15 PM',
    guests: 2,
    notes: 'Quick lunch during Kozhikode trip.',
    items: [
      {
        menuItem: {
          id: 'm3-2',
          restaurantId: 'sample-3',
          name: 'Highway Butter Chicken',
          description: 'Tandoori chicken in tomato butter gravy.',
          price: 340,
          category: 'Main Course',
          isVeg: false,
          isAvailable: true,
          imageUri: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&fit=crop&auto=format',
          prepTimeMinutes: 14,
        },
        quantity: 1,
      },
      {
        menuItem: {
          id: 'm3-4',
          restaurantId: 'sample-3',
          name: 'Patiala Clay-Pot Lassi',
          description: 'Thick sweet Punjabi yogurt lassi.',
          price: 90,
          category: 'Beverages',
          isVeg: true,
          isAvailable: true,
          imageUri: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&fit=crop&auto=format',
          prepTimeMinutes: 4,
        },
        quantity: 2,
      },
    ],
    totalAmount: 520,
    status: 'completed',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    isSimulated: true,
  },
];

export const MOCK_HIGHWAY_ROUTE = {
  from: 'Kochi (Edappally)',
  destination: 'Kozhikode (Calicut)',
  highway: 'NH 66 Corridor',
  totalDistanceKm: 178,
  estimatedDuration: '4 hr 15 min',
  stops: [
    {
      km: 18,
      location: 'Edappally Bypass',
      restaurantId: 'sample-1',
      restaurantName: 'Malabar Spice Kitchen',
      detour: '0.4 km (3 min)',
    },
    {
      km: 52,
      location: 'Kodungallur Coastal Link',
      restaurantId: 'sample-2',
      restaurantName: 'Backwater Bites',
      detour: '0.2 km (2 min)',
    },
    {
      km: 98,
      location: 'Kuttippuram Bypass',
      restaurantId: 'sample-3',
      restaurantName: 'Highway Dhaba 66',
      detour: '0.8 km (4 min)',
    },
    {
      km: 135,
      location: 'Valanchery Hill Road',
      restaurantId: 'sample-4',
      restaurantName: 'Nilgiri Tea Nest & Cafe',
      detour: '0.3 km (2 min)',
    },
    {
      km: 168,
      location: 'Ramanattukara Junction',
      restaurantId: 'sample-5',
      restaurantName: 'Coastal Curry House',
      detour: '0.5 km (3 min)',
    },
  ],
};
