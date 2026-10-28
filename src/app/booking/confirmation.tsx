import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBooking } from '../../store/bookingContext';
import { colors, radius, spacing, typography } from '../../theme/tokens';
import { DemoBanner } from '../../components/DemoBanner';
import { DEMO_MODE } from '../../config';

export default function BookingConfirmationScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const { getBookingById, bookings } = useBooking();

  // Retrieve booking by ID or use latest created
  const booking = bookingId ? getBookingById(bookingId) : bookings[0];

  if (!booking) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Ionicons name="information-circle-outline" size={54} color={colors.warningText} />
        <Text style={styles.errorTitle}>No Booking Record Found</Text>
        <Text style={styles.errorSubtitle}>
          Return to Discover to search along your travel corridor.
        </Text>
        <Pressable
          style={styles.backDiscoverBtn}
          onPress={() => router.replace('/home')}
          accessibilityRole="button"
          accessibilityLabel="Back to Discover"
        >
          <Text style={styles.backDiscoverText}>Back to Discover</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      {DEMO_MODE && <DemoBanner />}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Animated/Themed Checkmark Header */}
        <View style={styles.successHeader}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark-sharp" size={42} color={colors.success} />
          </View>
          <Text style={styles.successHeading}>Reservation Confirmed!</Text>
          <Text style={styles.successSubheading}>
            Your highway pitstop table has been reserved successfully.
          </Text>

          {/* Reference Pill */}
          <View style={styles.refPill}>
            <Text style={styles.refLabel}>Booking Reference</Text>
            <Text style={styles.refCode}>{booking.id}</Text>
          </View>
        </View>

        {/* Restaurant Card Summary */}
        <View style={styles.card}>
          <View style={styles.restaurantRow}>
            <Image source={{ uri: booking.restaurantImage }} style={styles.restaurantImage} />
            <View style={styles.restaurantMeta}>
              <Text style={styles.restaurantName}>{booking.restaurantName}</Text>
              <Text style={styles.restaurantCuisine}>{booking.cuisine}</Text>
              <Text style={styles.restaurantAddress} numberOfLines={2}>
                {booking.address}
              </Text>
            </View>
          </View>

          <View style={styles.cardDivider} />

          {/* Schedule & Guests Grid */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailCol}>
              <View style={styles.detailIconRow}>
                <Ionicons name="calendar-outline" size={15} color={colors.brandPrimary} />
                <Text style={styles.detailLabel}>Date</Text>
              </View>
              <Text style={styles.detailValue}>{booking.date}</Text>
            </View>

            <View style={styles.detailCol}>
              <View style={styles.detailIconRow}>
                <Ionicons name="time-outline" size={15} color={colors.brandPrimary} />
                <Text style={styles.detailLabel}>Arrival Time</Text>
              </View>
              <Text style={styles.detailValue}>{booking.time}</Text>
            </View>

            <View style={styles.detailCol}>
              <View style={styles.detailIconRow}>
                <Ionicons name="people-outline" size={15} color={colors.brandPrimary} />
                <Text style={styles.detailLabel}>Party Size</Text>
              </View>
              <Text style={styles.detailValue}>{booking.guests} Guests</Text>
            </View>
          </View>

          {/* Notes if provided */}
          {!!booking.notes && (
            <View style={styles.notesRow}>
              <Text style={styles.notesLabel}>Special Notes:</Text>
              <Text style={styles.notesValue}>{booking.notes}</Text>
            </View>
          )}
        </View>

        {/* Pre-Ordered Food Summary */}
        {booking.items.length > 0 && (
          <View style={styles.card}>
            <View style={styles.preOrderTitleRow}>
              <Ionicons name="restaurant-outline" size={18} color={colors.brandPrimary} />
              <Text style={styles.cardTitle}>Pre-Ordered Dishes</Text>
            </View>

            <View style={styles.itemsList}>
              {booking.items.map((ci) => (
                <View key={ci.menuItem.id} style={styles.foodRow}>
                  <Text style={styles.foodQty}>{ci.quantity}x</Text>
                  <Text style={styles.foodName}>{ci.menuItem.name}</Text>
                  <Text style={styles.foodPrice}>₹{ci.menuItem.price * ci.quantity}</Text>
                </View>
              ))}
            </View>

            <View style={styles.cardDivider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Estimated Bill (Pay at Counter)</Text>
              <Text style={styles.totalValue}>₹{booking.totalAmount}</Text>
            </View>
          </View>
        )}

        {/* Highway Arrival Advice */}
        <View style={styles.highwayAdviceCard}>
          <Ionicons name="navigate-circle-outline" size={24} color="#FCD34D" />
          <View style={{ flex: 1 }}>
            <Text style={styles.adviceHeading}>Highway Corridor Hold</Text>
            <Text style={styles.adviceText}>
              Your table is guaranteed for 20 minutes past your selected arrival time. Present booking reference{' '}
              <Text style={{ fontFamily: typography.fontFamily.bold, color: '#FCD34D' }}>{booking.id}</Text> at the entrance host stand.
            </Text>
          </View>
        </View>

        {/* Honest Demo Notification */}
        <View style={styles.demoNoticeBox}>
          <Ionicons name="information-circle-outline" size={16} color={colors.warningText} />
          <Text style={styles.demoNoticeText}>
            Simulated major project prototype: This reservation has been saved in local memory. You can view, manage, or cancel it anytime in the Bookings tab.
          </Text>
        </View>

        {/* Primary Action Buttons */}
        <View style={styles.actionsContainer}>
          <Pressable
            style={styles.primaryBtn}
            onPress={() => router.replace('/bookings')}
            accessibilityRole="button"
            accessibilityLabel="View in my bookings tab"
          >
            <Ionicons name="calendar" size={18} color={colors.onBrand} />
            <Text style={styles.primaryBtnText}>View My Bookings</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryBtn}
            onPress={() => router.replace('/home')}
            accessibilityRole="button"
            accessibilityLabel="Back to Discover"
          >
            <Ionicons name="compass-outline" size={18} color={colors.brandPrimary} />
            <Text style={styles.secondaryBtnText}>Back to Discover</Text>
          </Pressable>
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
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 40,
    gap: spacing.lg,
  },
  successHeader: {
    alignItems: 'center',
    paddingTop: spacing.md,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(110, 231, 183, 0.14)',
    borderWidth: 2,
    borderColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  successHeading: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.foreground,
    textAlign: 'center',
  },
  successSubheading: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.mutedForeground,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: spacing.md,
  },
  refPill: {
    alignItems: 'center',
    backgroundColor: colors.surfaceLow,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginTop: spacing.md,
  },
  refLabel: {
    fontSize: 10,
    fontFamily: typography.fontFamily.medium,
    color: colors.mutedForeground,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  refCode: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.bold,
    color: colors.brandPrimary,
    letterSpacing: 1,
    marginTop: 1,
  },
  card: {
    backgroundColor: colors.surfaceLow,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.md,
    gap: spacing.md,
  },
  restaurantRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  restaurantImage: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMid,
  },
  restaurantMeta: {
    flex: 1,
  },
  restaurantName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.bold,
    color: colors.foreground,
  },
  restaurantCuisine: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.brandSecondary,
    marginTop: 2,
  },
  restaurantAddress: {
    fontSize: 11,
    fontFamily: typography.fontFamily.regular,
    color: colors.mutedForeground,
    marginTop: 2,
    lineHeight: 15,
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailCol: {
    flex: 1,
    alignItems: 'flex-start',
  },
  detailIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  detailLabel: {
    fontSize: 10,
    fontFamily: typography.fontFamily.medium,
    color: colors.mutedForeground,
  },
  detailValue: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    color: colors.foreground,
  },
  notesRow: {
    backgroundColor: colors.surfaceMid,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  notesLabel: {
    fontSize: 10,
    fontFamily: typography.fontFamily.bold,
    color: colors.mutedForeground,
  },
  notesValue: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.secondaryForeground,
    marginTop: 2,
  },
  preOrderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
    color: colors.foreground,
  },
  itemsList: {
    gap: 6,
  },
  foodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  foodQty: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    color: colors.brandPrimary,
    width: 24,
  },
  foodName: {
    flex: 1,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.foreground,
  },
  foodPrice: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.secondaryForeground,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.mutedForeground,
  },
  totalValue: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.bold,
    color: colors.brandSecondary,
  },
  highwayAdviceCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: 'rgba(252, 211, 77, 0.08)',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(252, 211, 77, 0.3)',
    padding: spacing.md,
  },
  adviceHeading: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    color: '#FCD34D',
  },
  adviceText: {
    fontSize: 11,
    fontFamily: typography.fontFamily.regular,
    color: colors.secondaryForeground,
    lineHeight: 16,
    marginTop: 2,
  },
  demoNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.warningBg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.warningBorder,
    padding: spacing.md,
  },
  demoNoticeText: {
    flex: 1,
    fontSize: 11,
    fontFamily: typography.fontFamily.regular,
    color: colors.warningText,
    lineHeight: 16,
  },
  actionsContainer: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.brandPrimary,
    paddingVertical: 14,
    borderRadius: radius.pill,
  },
  primaryBtnText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
    color: colors.onBrand,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.surfaceLow,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingVertical: 14,
    borderRadius: radius.pill,
  },
  secondaryBtnText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
    color: colors.brandPrimary,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.foreground,
    marginTop: spacing.md,
  },
  errorSubtitle: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.mutedForeground,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  backDiscoverBtn: {
    backgroundColor: colors.brandPrimary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  backDiscoverText: {
    color: colors.onBrand,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.sm,
  },
});
