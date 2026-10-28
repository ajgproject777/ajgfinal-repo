import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Platform,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT, Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useBooking } from '../../store/bookingContext';
import { MOCK_HIGHWAY_ROUTE, MOCK_RESTAURANTS, RestaurantData } from '../../data/mockData';
import { colors, radius, spacing, typography } from '../../theme/tokens';
import { DemoBanner } from '../../components/DemoBanner';
import { DEMO_MODE } from '../../config';

// ---------------------------------------------------------------------------
// Geographically accurate coordinates for NH 66 Kochi → Kozhikode corridor
// These are SAMPLE / DEMO coordinates aligned with actual highway positions.
// ---------------------------------------------------------------------------
const ORIGIN_COORD = { latitude: 10.0307, longitude: 76.3031 }; // Edappally, Kochi
const DEST_COORD   = { latitude: 11.2588, longitude: 75.7804 }; // Kozhikode city

/** Sample coordinates for each restaurant stop along NH 66 (DEMO DATA) */
const RESTAURANT_COORDS: Record<string, { latitude: number; longitude: number }> = {
  'sample-1': { latitude: 10.0372, longitude: 76.2903 }, // Near Edappally Toll, Kochi – KM 18
  'sample-2': { latitude: 10.2325, longitude: 76.1987 }, // Kodungallur coastal link – KM 52
  'sample-3': { latitude: 10.6667, longitude: 76.1000 }, // Kuttippuram bypass – KM 98
  'sample-4': { latitude: 10.8700, longitude: 75.9800 }, // Valanchery, Malappuram – KM 135
  'sample-5': { latitude: 11.1886, longitude: 75.8286 }, // Ramanattukara, Kozhikode – KM 168
};

// Straight-line waypoints approximating NH 66; NOT a Directions API polyline.
// Labelled PREVIEW — see notice banner in the UI.
const ROUTE_PREVIEW_COORDS = [
  ORIGIN_COORD,
  RESTAURANT_COORDS['sample-1'],
  RESTAURANT_COORDS['sample-2'],
  RESTAURANT_COORDS['sample-3'],
  RESTAURANT_COORDS['sample-4'],
  RESTAURANT_COORDS['sample-5'],
  DEST_COORD,
];

const INITIAL_REGION: Region = {
  latitude:      10.6447, // midpoint of corridor
  longitude:     76.0437,
  latitudeDelta:  1.55,
  longitudeDelta: 0.90,
};

export default function RouteMapTabRoute() {
  const { routeSearch } = useBooking();
  const [selectedStopId, setSelectedStopId] = useState<string>('sample-1');
  const mapRef = useRef<MapView>(null);

  const selectedRestaurant: RestaurantData | undefined =
    MOCK_RESTAURANTS.find((r) => r.id === selectedStopId) || MOCK_RESTAURANTS[0];

  const handleOpenRestaurant = (restaurantId: string) => {
    router.push(`/restaurant/${restaurantId}`);
  };

  const handleMarkerPress = (restaurantId: string) => {
    setSelectedStopId(restaurantId);
    const coord = RESTAURANT_COORDS[restaurantId];
    if (coord && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude:      coord.latitude - 0.04,
          longitude:     coord.longitude,
          latitudeDelta:  0.18,
          longitudeDelta: 0.12,
        },
        400,
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {DEMO_MODE && <DemoBanner />}

      {/* Header Route Info */}
      <View style={styles.routeHeader}>
        <View style={styles.routeSummaryCol}>
          <View style={styles.originDestRow}>
            <View style={styles.originDot} />
            <Text style={styles.originText} numberOfLines={1}>
              {routeSearch.from || MOCK_HIGHWAY_ROUTE.from}
            </Text>
            <Ionicons name="arrow-forward" size={14} color={colors.brandPrimary} />
            <View style={styles.destDot} />
            <Text style={styles.destText} numberOfLines={1}>
              {routeSearch.destination || MOCK_HIGHWAY_ROUTE.destination}
            </Text>
          </View>

          <View style={styles.corridorMetaRow}>
            <Text style={styles.corridorMeta}>
              {MOCK_HIGHWAY_ROUTE.highway} · {routeSearch.distanceKm || 178} km · {routeSearch.estimatedDuration || '4h 15m'}
            </Text>
            <View style={styles.pitstopCountPill}>
              <Text style={styles.pitstopCountText}>{MOCK_HIGHWAY_ROUTE.stops.length} Pitstops</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ------------------------------------------------------------------ */}
      {/* Interactive Map                                                      */}
      {/* ------------------------------------------------------------------ */}
      <View style={styles.mapWrapper}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_DEFAULT}
          initialRegion={INITIAL_REGION}
          showsUserLocation={false}
          showsCompass={true}
          showsScale={Platform.OS === 'ios'}
          mapType="standard"
          accessibilityLabel="NH 66 highway corridor map with restaurant pitstop markers"
        >
          {/* Origin marker */}
          <Marker
            coordinate={ORIGIN_COORD}
            title="Departure"
            description={routeSearch.from || MOCK_HIGHWAY_ROUTE.from}
            pinColor={colors.brandPrimary}
            accessibilityLabel="Departure point"
          />

          {/* Destination marker */}
          <Marker
            coordinate={DEST_COORD}
            title="Destination"
            description={routeSearch.destination || MOCK_HIGHWAY_ROUTE.destination}
            pinColor={colors.success}
            accessibilityLabel="Destination point"
          />

          {/* Restaurant pitstop markers */}
          {MOCK_RESTAURANTS.map((restaurant) => {
            const coord = RESTAURANT_COORDS[restaurant.id];
            if (!coord) return null;
            const isSelected = selectedStopId === restaurant.id;
            return (
              <Marker
                key={restaurant.id}
                coordinate={coord}
                title={restaurant.name}
                description={`${restaurant.cuisine} · ⭐ ${restaurant.rating} · ${restaurant.offRouteKm} km off route`}
                onPress={() => handleMarkerPress(restaurant.id)}
                pinColor={isSelected ? '#FF6B35' : '#FFB59D'}
                accessibilityLabel={`Restaurant marker: ${restaurant.name}`}
              />
            );
          })}

          {/* Straight-line preview polyline — NOT a real driving route */}
          <Polyline
            coordinates={ROUTE_PREVIEW_COORDS}
            strokeColor={colors.brandPrimary}
            strokeWidth={2.5}
            lineDashPattern={[8, 5]}
          />
        </MapView>

        {/* Map legend overlay */}
        <View style={styles.mapLegend}>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: colors.brandPrimary }]} />
            <Text style={styles.legendText}>Origin</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#FFB59D' }]} />
            <Text style={styles.legendText}>Pitstop</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
            <Text style={styles.legendText}>Dest.</Text>
          </View>
        </View>

        {/* Route preview notice — honest labelling */}
        <View style={styles.routePreviewBadge}>
          <Ionicons name="git-branch-outline" size={10} color={colors.warningText} />
          <Text style={styles.routePreviewBadgeText}>ROUTE PREVIEW · NOT A DRIVING ROUTE</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stop selector strip */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.stopStrip}
        >
          {MOCK_HIGHWAY_ROUTE.stops.map((stop) => {
            const isSelected = selectedStopId === stop.restaurantId;
            return (
              <Pressable
                key={stop.restaurantId}
                style={[styles.stopChip, isSelected && styles.stopChipActive]}
                onPress={() => handleMarkerPress(stop.restaurantId)}
                accessibilityRole="button"
                accessibilityLabel={`Select pitstop ${stop.restaurantName}`}
              >
                <Ionicons
                  name="restaurant"
                  size={11}
                  color={isSelected ? colors.onBrand : colors.brandPrimary}
                />
                <Text style={[styles.stopChipText, isSelected && styles.stopChipTextActive]}>
                  {stop.restaurantName.split(' ').slice(0, 2).join(' ')}
                </Text>
                <View style={styles.kmBadge}>
                  <Text style={styles.kmBadgeText}>KM {stop.km}</Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Selected Stop Details Drawer */}
        {selectedRestaurant && (
          <View style={styles.selectedStopCard}>
            <View style={styles.drawerHeader}>
              <View style={styles.drawerHeaderLeft}>
                <Ionicons name="pin" size={16} color={colors.brandPrimary} />
                <Text style={styles.drawerTitle}>Selected Pitstop</Text>
              </View>
              <View style={styles.drawerRatingPill}>
                <Ionicons name="star" size={12} color="#FCD34D" />
                <Text style={styles.drawerRatingText}>{selectedRestaurant.rating}</Text>
              </View>
            </View>

            <View style={styles.drawerBodyRow}>
              <Image
                source={{ uri: selectedRestaurant.imageUri }}
                style={styles.drawerImage}
              />
              <View style={styles.drawerInfo}>
                <Text style={styles.drawerName}>{selectedRestaurant.name}</Text>
                <Text style={styles.drawerCuisine}>
                  {selectedRestaurant.cuisine} · {selectedRestaurant.priceRange}
                </Text>
                <Text style={styles.drawerAddress} numberOfLines={2}>
                  {selectedRestaurant.address}
                </Text>

                <View style={styles.drawerDetourPill}>
                  <Ionicons name="git-branch-outline" size={12} color="#FCD34D" />
                  <Text style={styles.drawerDetourText}>
                    {selectedRestaurant.offRouteKm} km off route ({selectedRestaurant.detourMinutes} min)
                  </Text>
                </View>
              </View>
            </View>

            {/* Action Bar */}
            <View style={styles.drawerActionsRow}>
              <View style={styles.drawerSlotPill}>
                <Ionicons name="time-outline" size={13} color={colors.warningText} />
                <Text style={styles.drawerSlotText}>Next: {selectedRestaurant.nextSlot}</Text>
              </View>

              <Pressable
                style={styles.drawerBookBtn}
                onPress={() => handleOpenRestaurant(selectedRestaurant.id)}
                accessibilityRole="button"
                accessibilityLabel={`View and reserve at ${selectedRestaurant.name}`}
              >
                <Text style={styles.drawerBookBtnText}>View &amp; Reserve</Text>
                <Ionicons name="arrow-forward" size={15} color={colors.onBrand} />
              </Pressable>
            </View>
          </View>
        )}

        {/* Map integration info notice */}
        <View style={styles.mapInfoNotice}>
          <Ionicons name="information-circle-outline" size={18} color={colors.partnerAccent} />
          <View style={{ flex: 1 }}>
            <Text style={styles.mapInfoTitle}>
              {Platform.OS === 'ios' ? 'Apple Maps · Demo Data' : 'Google Maps · Demo Data'}
            </Text>
            <Text style={styles.mapInfoSubtitle}>
              Map tiles via {Platform.OS === 'ios' ? 'Apple Maps' : 'Google Maps'}. Restaurant
              markers and route preview use sample coordinates for the NH 66 corridor — not live
              Google Places results. A dashed line connects stops as a preview only, not a computed
              driving route.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  /* ── Header ── */
  routeHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    backgroundColor: colors.surfaceLow,
  },
  routeSummaryCol: {
    gap: 6,
  },
  originDestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  originDot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.brandPrimary,
  },
  originText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
    color: colors.foreground,
  },
  destDot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.success,
  },
  destText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
    color: colors.foreground,
  },
  corridorMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  corridorMeta: {
    fontSize: 11,
    fontFamily: typography.fontFamily.regular,
    color: colors.mutedForeground,
  },
  pitstopCountPill: {
    backgroundColor: colors.surfaceMid,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  pitstopCountText: {
    fontSize: 10,
    fontFamily: typography.fontFamily.bold,
    color: colors.brandSecondary,
  },

  /* ── Map ── */
  mapWrapper: {
    height: 260,
    position: 'relative',
    backgroundColor: colors.surfaceMid,
  },
  map: {
    ...StyleSheet.absoluteFill,
  },
  mapLegend: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: 'rgba(14,13,12,0.82)',
    borderRadius: radius.md,
    padding: spacing.xs,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 9,
    fontFamily: typography.fontFamily.bold,
    color: colors.foreground,
  },
  routePreviewBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.warningBg,
    borderColor: colors.warningBorder,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  routePreviewBadgeText: {
    fontSize: 8,
    fontFamily: typography.fontFamily.bold,
    color: colors.warningText,
    letterSpacing: 0.3,
  },

  /* ── Scroll body ── */
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 40,
    gap: spacing.lg,
  },

  /* ── Stop strip ── */
  stopStrip: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  stopChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.surfaceMid,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  stopChipActive: {
    backgroundColor: colors.brandPrimary,
    borderColor: colors.brandSecondary,
  },
  stopChipText: {
    fontSize: 11,
    fontFamily: typography.fontFamily.bold,
    color: colors.brandPrimary,
  },
  stopChipTextActive: {
    color: colors.onBrand,
  },
  kmBadge: {
    backgroundColor: colors.surfaceLow,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: radius.xs,
  },
  kmBadgeText: {
    fontSize: 9,
    fontFamily: typography.fontFamily.bold,
    color: colors.brandSecondary,
  },

  /* ── Selected stop drawer ── */
  selectedStopCard: {
    backgroundColor: colors.surfaceLow,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.brandPrimary,
    gap: spacing.md,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  drawerHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  drawerTitle: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    color: colors.brandPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  drawerRatingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(252, 211, 77, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  drawerRatingText: {
    fontSize: 11,
    fontFamily: typography.fontFamily.bold,
    color: '#FCD34D',
  },
  drawerBodyRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  drawerImage: {
    width: 80,
    height: 80,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMid,
  },
  drawerInfo: {
    flex: 1,
  },
  drawerName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.bold,
    color: colors.foreground,
  },
  drawerCuisine: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.brandSecondary,
    marginTop: 1,
  },
  drawerAddress: {
    fontSize: 10,
    fontFamily: typography.fontFamily.regular,
    color: colors.mutedForeground,
    marginTop: 2,
    lineHeight: 14,
  },
  drawerDetourPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  drawerDetourText: {
    fontSize: 11,
    fontFamily: typography.fontFamily.medium,
    color: '#FCD34D',
  },
  drawerActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xs,
  },
  drawerSlotPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.warningBg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  drawerSlotText: {
    fontSize: 11,
    fontFamily: typography.fontFamily.bold,
    color: colors.warningText,
  },
  drawerBookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.brandPrimary,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  drawerBookBtnText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    color: colors.onBrand,
  },

  /* ── Map info notice ── */
  mapInfoNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: 'rgba(123, 208, 255, 0.08)',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(123, 208, 255, 0.25)',
    padding: spacing.md,
  },
  mapInfoTitle: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    color: colors.partnerAccent,
  },
  mapInfoSubtitle: {
    fontSize: 11,
    fontFamily: typography.fontFamily.regular,
    color: colors.secondaryForeground,
    lineHeight: 16,
    marginTop: 2,
  },
});
