import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  Linking,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getRestaurantById } from '../../services/restaurantService';
import { useBooking } from '../../store/bookingContext';
import { colors, radius, spacing, typography } from '../../theme/tokens';
import { DemoBanner } from '../../components/DemoBanner';
import { DEMO_MODE } from '../../config';

export default function RestaurantDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const restaurant = getRestaurantById(id || 'sample-1');
  const { getCartSummary } = useBooking();

  const cartSummary = restaurant ? getCartSummary(restaurant.id) : { count: 0, subtotal: 0 };

  if (!restaurant) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={56} color={colors.error} />
        <Text style={styles.errorTitle}>Restaurant Not Found</Text>
        <Text style={styles.errorSubtitle}>The requested highway dining stop could not be located in our sample records.</Text>
        <Pressable
          style={styles.backButtonCenter}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backButtonCenterText}>Back to Discover</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const handleCall = () => {
    if (restaurant.phone) {
      Linking.openURL(`tel:${restaurant.phone}`).catch(() => {});
    }
  };

  const handleNavigate = () => {
    // Simulated route directions notice
    router.push('/map');
  };

  return (
    <View style={styles.container}>
      {DEMO_MODE && <DemoBanner />}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Image Container */}
        <View style={styles.heroWrapper}>
          <Image source={{ uri: restaurant.imageUri }} style={styles.heroImage} />
          <View style={styles.heroGradient} />

          {/* Top Bar Floating Controls */}
          <View style={styles.heroHeader}>
            <Pressable
              style={styles.circleIconButton}
              onPress={() => router.back()}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="arrow-back" size={20} color={colors.foreground} />
            </Pressable>

            <View style={styles.heroHeaderRight}>
              <View style={styles.samplePill}>
                <Text style={styles.samplePillText}>SIMULATED DATA</Text>
              </View>
            </View>
          </View>

          {/* Detour Badge Overlay */}
          <View style={styles.detourFloatingBadge}>
            <Ionicons name="git-branch" size={14} color="#FCD34D" />
            <Text style={styles.detourFloatingText}>
              {restaurant.offRouteKm} km from route ({restaurant.detourMinutes} min detour)
            </Text>
          </View>
        </View>

        {/* Content Body */}
        <View style={styles.body}>
          {/* Title & Rating */}
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{restaurant.name}</Text>
              <Text style={styles.tagline}>{restaurant.tagline}</Text>
            </View>
          </View>

          {/* Meta Badges Row */}
          <View style={styles.metaRow}>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={13} color="#FCD34D" />
              <Text style={styles.ratingNumber}>{restaurant.rating}</Text>
              <Text style={styles.reviewsCount}>({restaurant.reviewsCount})</Text>
            </View>

            <View style={styles.metaDivider} />
            <Text style={styles.cuisineText}>{restaurant.cuisine}</Text>

            <View style={styles.metaDivider} />
            <Text style={styles.priceRangeText}>{restaurant.priceRange}</Text>

            <View style={styles.metaDivider} />
            <View style={styles.openPill}>
              <View style={styles.openDot} />
              <Text style={styles.openText}>Open Now</Text>
            </View>
          </View>

          {/* Corridor & Address Card */}
          <View style={styles.cardInfo}>
            <View style={styles.infoLine}>
              <Ionicons name="navigate-outline" size={18} color={colors.brandPrimary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Highway Corridor</Text>
                <Text style={styles.infoValue}>{restaurant.highwayCorridor} · Mile {restaurant.highwayKmMark} km</Text>
              </View>
            </View>

            <View style={styles.cardSeparator} />

            <View style={styles.infoLine}>
              <Ionicons name="location-outline" size={18} color={colors.brandPrimary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>{restaurant.address}</Text>
              </View>
            </View>

            <View style={styles.cardSeparator} />

            <View style={styles.infoLine}>
              <Ionicons name="time-outline" size={18} color={colors.brandPrimary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Operating Hours</Text>
                <Text style={styles.infoValue}>{restaurant.openingHours}</Text>
              </View>
            </View>

            <View style={styles.quickActionRow}>
              <Pressable
                style={styles.quickActionButton}
                onPress={handleCall}
                accessibilityRole="button"
                accessibilityLabel="Call restaurant"
              >
                <Ionicons name="call-outline" size={16} color={colors.brandPrimary} />
                <Text style={styles.quickActionText}>Call</Text>
              </Pressable>

              <Pressable
                style={styles.quickActionButton}
                onPress={handleNavigate}
                accessibilityRole="button"
                accessibilityLabel="View on route map"
              >
                <Ionicons name="map-outline" size={16} color={colors.brandPrimary} />
                <Text style={styles.quickActionText}>Route Map</Text>
              </Pressable>
            </View>
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>About This Pitstop</Text>
            <Text style={styles.descriptionText}>{restaurant.description}</Text>
          </View>

          {/* Amenities & Highway Comforts */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Highway Amenities</Text>
            <View style={styles.amenitiesWrap}>
              {restaurant.amenities.map((item, idx) => (
                <View key={idx} style={styles.amenityChip}>
                  <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                  <Text style={styles.amenityText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Popular Dishes */}
          <View style={styles.section}>
            <View style={styles.dishesHeaderRow}>
              <Text style={styles.sectionHeader}>Signature Dishes</Text>
              <Pressable
                onPress={() => router.push(`/restaurant/${restaurant.id}/menu`)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="View full menu"
              >
                <Text style={styles.viewFullMenuLink}>Full Menu →</Text>
              </Pressable>
            </View>
            <View style={styles.dishesGrid}>
              {restaurant.popularDishes.map((dish, idx) => (
                <View key={idx} style={styles.dishPill}>
                  <Ionicons name="restaurant-outline" size={14} color={colors.brandSecondary} />
                  <Text style={styles.dishPillText}>{dish}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Sample Mode Notice */}
          <View style={styles.noticeBox}>
            <Ionicons name="information-circle-outline" size={18} color={colors.warningText} />
            <Text style={styles.noticeText}>
              Presentation Prototype: Real-time kitchen slot holds and GPS geofence arrival notifications connect with the FastAPI backend in Phase 3.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Persistent Bottom Floating Action Bar */}
      <View style={styles.bottomBar}>
        <Pressable
          style={styles.menuButton}
          onPress={() => router.push(`/restaurant/${restaurant.id}/menu`)}
          accessibilityRole="button"
          accessibilityLabel="Open digital menu"
        >
          <Ionicons name="book-outline" size={18} color={colors.brandPrimary} />
          <Text style={styles.menuButtonText}>
            {cartSummary.count > 0 ? `Menu (${cartSummary.count})` : 'Digital Menu'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.bookButton}
          onPress={() => router.push(`/reservation/${restaurant.id}`)}
          accessibilityRole="button"
          accessibilityLabel="Reserve table"
        >
          <Text style={styles.bookButtonText}>Reserve Table</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.onBrand} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  heroWrapper: {
    width: '100%',
    height: 260,
    position: 'relative',
    backgroundColor: colors.surfaceLowest,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(14, 13, 12, 0.45)',
  },
  heroHeader: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 52 : 36,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  circleIconButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(21, 24, 29, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  heroHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  samplePill: {
    backgroundColor: 'rgba(245, 158, 11, 0.25)',
    borderWidth: 1,
    borderColor: colors.warningBorder,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  samplePillText: {
    color: colors.warningText,
    fontSize: 10,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: 0.5,
  },
  detourFloatingBadge: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(21, 24, 29, 0.92)',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(252, 211, 77, 0.35)',
  },
  detourFloatingText: {
    color: '#FCD34D',
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.semiBold,
  },
  body: {
    padding: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: typography.fontSize.xxl,
    fontFamily: typography.fontFamily.bold,
    color: colors.foreground,
    letterSpacing: -0.3,
  },
  tagline: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(252, 211, 77, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  ratingNumber: {
    color: '#FCD34D',
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
  },
  reviewsCount: {
    color: colors.mutedForeground,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
  },
  metaDivider: {
    width: 3,
    height: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.mutedForeground,
  },
  cuisineText: {
    color: colors.secondaryForeground,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
  },
  priceRangeText: {
    color: colors.brandSecondary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
  },
  openPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(110, 231, 183, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  openDot: {
    width: 6,
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.success,
  },
  openText: {
    color: colors.success,
    fontSize: 11,
    fontFamily: typography.fontFamily.semiBold,
  },
  cardInfo: {
    backgroundColor: colors.surfaceLow,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.md,
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  infoLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  infoLabel: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.mutedForeground,
  },
  infoValue: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.foreground,
    marginTop: 1,
  },
  cardSeparator: {
    height: 1,
    backgroundColor: colors.borderSubtle,
  },
  quickActionRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: 4,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.surfaceMid,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  quickActionText: {
    color: colors.foreground,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.semiBold,
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionHeader: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.bold,
    color: colors.foreground,
    marginBottom: spacing.sm,
  },
  descriptionText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.secondaryForeground,
    lineHeight: 21,
  },
  amenitiesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceLow,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  amenityText: {
    color: colors.secondaryForeground,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
  },
  dishesHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewFullMenuLink: {
    color: colors.brandPrimary,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
  },
  dishesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  dishPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceMid,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  dishPillText: {
    color: colors.foreground,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.warningBg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.warningBorder,
    padding: spacing.md,
    marginTop: spacing.xl,
  },
  noticeText: {
    flex: 1,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.warningText,
    lineHeight: 18,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surfaceLow,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 32 : spacing.md,
  },
  menuButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.surfaceMid,
    paddingVertical: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  menuButtonText: {
    color: colors.foreground,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
  },
  bookButton: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.brandPrimary,
    paddingVertical: 14,
    borderRadius: radius.pill,
  },
  bookButtonText: {
    color: colors.onBrand,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorTitle: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.foreground,
    marginTop: spacing.md,
  },
  errorSubtitle: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.mutedForeground,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  backButtonCenter: {
    backgroundColor: colors.brandPrimary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
  },
  backButtonCenterText: {
    color: colors.onBrand,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.sm,
  },
});
