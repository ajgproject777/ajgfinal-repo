import { DEMO_LATENCY_MS, DEMO_MODE } from '../config'
import {
  MOCK_RESTAURANTS,
  MOCK_MENU_ITEMS,
  RestaurantData,
  MenuItem,
} from '../data/mockData'

export type RouteQuery = { from: string; destination: string }

export type RestaurantResult = RestaurantData;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

// Replace with the FastAPI route-search call (Google Maps route + nearby restaurants).
export async function searchAlongRoute(_query: RouteQuery): Promise<RestaurantResult[]> {
  if (!DEMO_MODE) throw new Error('The restaurant search backend is not connected yet.')
  await wait(DEMO_LATENCY_MS)
  return MOCK_RESTAURANTS
}

export function getRestaurantById(id: string): RestaurantData | undefined {
  return MOCK_RESTAURANTS.find((r) => r.id === id)
}

export function getMenuByRestaurant(restaurantId: string): MenuItem[] {
  return MOCK_MENU_ITEMS[restaurantId] || []
}
