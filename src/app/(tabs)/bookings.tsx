import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useBooking } from '../../store/bookingContext';
import { Booking } from '../../data/mockData';
import { colors, radius, spacing, typography } from '../../theme/tokens';
import { DemoBanner } from '../../components/DemoBanner';
import { DEMO_MODE } from '../../config';

type FilterTab = 'upcoming' | 'history';

export default function BookingsTabRoute() {
  const { bookings, cancelBooking } = useBooking();
  const [activeTab, setActiveTab] = useState<FilterTab>('upcoming');

  const upcomingBookings = bookings.filter((b) => b.status === 'confirmed');
  const pastBookings = bookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');

  const displayList = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  const handleCancel = (booking: Booking) => {
    Alert.alert(
      'Cancel Reservation?',
      `Are you sure you want to cancel your table reservation at ${booking.restaurantName} (${booking.id})?`,
      [
        { text: 'Keep Reservation', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            cancelBooking(booking.id);
          },
        },
      ]
    );
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <View style={[styles.statusBadge, styles.statusBadgeConfirmed]}>
            <View style={styles.statusDotGreen} />
            <Text style={styles.statusTextConfirmed}>Confirmed</Text>
          </View>
        );
      case 'completed':
        return (
          <View style={[styles.statusBadge, styles.statusBadgeCompleted]}>
            <Ionicons name="checkmark-done" size={12} color={colors.mutedForeground} />
            <Text style={styles.statusTextCompleted}>Completed</Text>
          </View>
        );
      case 'cancelled':
        return (
          <View style={[styles.statusBadge, styles.statusBadgeCancelled]}>
            <Ionicons name="close-circle" size={12} color={colors.error} />
            <Text style={styles.statusTextCancelled}>Cancelled</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {DEMO_MODE && <DemoBanner />}

      {/* Screen Title Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Reservations</Text>
          <Text style={styles.subtitle}>Highway Pitstop Bookings & Pre-Orders</Text>
        </View>

        <View style={styles.liveBadge}>
          <Text style={styles.liveBadgeText}>{bookings.length} TOTAL</Text>
        </View>
      </View>

      {/* Segmented Filter Control */}
      <View style={styles.segmentContainer}>
        <Pressable
          style={[
            styles.segmentBtn,
            activeTab === 'upcoming' && styles.segmentBtnActive,
          ]}
          onPress={() => setActiveTab('upcoming')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'upcoming' }}
          accessibilityLabel="Upcoming bookings tab"
        >
          <Text
            style={[
              styles.segmentText,
              activeTab === 'upcoming' && styles.segmentTextActive,
            ]}
          >
            Upcoming ({upcomingBookings.length})
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.segmentBtn,
            activeTab === 'history' && styles.segmentBtnActive,
          ]}
          onPress={() => setActiveTab('history')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'history' }}
          accessibilityLabel="Past and cancelled bookings tab"
        >
          <Text
            style={[
              styles.segmentText,
              activeTab === 'history' && styles.segmentTextActive,
            ]}
          >
            History ({pastBookings.length})
          </Text>
        </Pressable>
      </View>

      {/* Bookings List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {displayList.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconCircle}>
              <Ionicons
                name={activeTab === 'upcoming' ? 'calendar-outline' : 'time-outline'}
                size={40}
                color={colors.brandPrimary}
              />
            </View>
            <Text style={styles.emptyTitle}>
              {activeTab === 'upcoming'
                ? 'No Upcoming Reservations'
                : 'No Past Reservations'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'upcoming'
                ? 'When you reserve a table along your travel route, it will appear here with ETA arrival countdowns.'
                : 'Completed and cancelled highway bookings will be archived here.'}
            </Text>
            {activeTab === 'upcoming' && (
              <Pressable
                style={styles.findRestaurantsBtn}
                onPress={() => router.push('/home')}
                accessibilityRole="button"
                accessibilityLabel="Find restaurants along route"
              >
                <Ionicons name="compass-outline" size={18} color={colors.onBrand} />
                <Text style={styles.findRestaurantsBtnText}>Find Pitstops on Route</Text>
              </Pressable>
            )}
          </View>
        ) : (
          displayList.map((booking) => (
            <View key={booking.id} style={styles.bookingCard}>
              {/* Card Header: Ref code & Status */}
              <View style={styles.cardHeader}>
                <View style={styles.refCodeWrapper}>
                  <Text style={styles.refCode}>{booking.id}</Text>
                  <Text style={styles.refSimulated}>SIMULATED</Text>
                </View>
                {getStatusBadge(booking.status)}
              </View>

              <View style={styles.divider} />

              {/* Restaurant Meta */}
              <Pressable
                style={styles.restaurantRow}
                onPress={() => router.push(`/restaurant/${booking.restaurantId}`)}
                accessibilityRole="button"
                accessibilityLabel={`View details for ${booking.restaurantName}`}
              >
                <Image source={{ uri: booking.restaurantImage }} style={styles.restaurantThumb} />
                <View style={styles.restaurantInfo}>
                  <Text style={styles.restaurantName} numberOfLines={1}>
                    {booking.restaurantName}
                  </Text>
                  <Text style={styles.restaurantCuisine}>{booking.cuisine}</Text>
                  <Text style={styles.restaurantAddress} numberOfLines={1}>
                    {booking.address}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
              </Pressable>

              <View style={styles.divider} />

              {/* Time, Guests, Food Pre-orders Row */}
              <View style={styles.metaGrid}>
                <View style={styles.metaItem}>
                  <Ionicons name="calendar-outline" size={14} color={colors.brandPrimary} />
                  <Text style={styles.metaItemText}>
                    {booking.date} · {booking.time}
                  </Text>
                </View>

                <View style={styles.metaItem}>
                  <Ionicons name="people-outline" size={14} color={colors.brandPrimary} />
                  <Text style={styles.metaItemText}>
                    {booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}
                  </Text>
                </View>

                {booking.items.length > 0 && (
                  <View style={styles.metaItem}>
                    <Ionicons name="fast-food-outline" size={14} color={colors.brandSecondary} />
                    <Text style={styles.metaItemText}>
                      {booking.items.reduce((acc, ci) => acc + ci.quantity, 0)} dishes pre-ordered (₹{booking.totalAmount})
                    </Text>
                  </View>
                )}
              </View>

              {/* Pre-order dishes preview pills */}
              {booking.items.length > 0 && (
                <View style={styles.itemsPillsWrap}>
                  {booking.items.map((ci) => (
                    <View key={ci.menuItem.id} style={styles.itemPill}>
                      <Text style={styles.itemPillText}>
                        {ci.quantity}x {ci.menuItem.name}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Card Actions */}
              <View style={styles.cardActions}>
                <Pressable
                  style={styles.actionBtnOutline}
                  onPress={() => router.push(`/restaurant/${booking.restaurantId}`)}
                  accessibilityRole="button"
                  accessibilityLabel="View restaurant menu"
                >
                  <Ionicons name="restaurant-outline" size={15} color={colors.foreground} />
                  <Text style={styles.actionBtnOutlineText}>Restaurant</Text>
                </Pressable>

                <Pressable
                  style={styles.actionBtnOutline}
                  onPress={() => router.push('/map')}
                  accessibilityRole="button"
                  accessibilityLabel="View on route map"
                >
                  <Ionicons name="map-outline" size={15} color={colors.brandPrimary} />
                  <Text style={[styles.actionBtnOutlineText, { color: colors.brandPrimary }]}>Route</Text>
                </Pressable>

                {booking.status === 'confirmed' && (
                  <Pressable
                    style={styles.cancelBtn}
                    onPress={() => handleCancel(booking)}
                    accessibilityRole="button"
                    accessibilityLabel="Cancel reservation"
                  >
                    <Ionicons name="trash-outline" size={15} color={colors.error} />
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </Pressable>
                )}
              </View>
            </View>
          ))
        )}

        {/* Demo Notice */}
        <View style={styles.footerNote}>
          <Ionicons name="information-circle-outline" size={15} color={colors.mutedForeground} />
          <Text style={styles.footerNoteText}>
            Reservations are stored in shared client state. All cards reflect live additions made in the Discover flow.
          </Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.foreground,
  },
  subtitle: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  liveBadge: {
    backgroundColor: colors.surfaceMid,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  liveBadgeText: {
    fontSize: 10,
    fontFamily: typography.fontFamily.bold,
    color: colors.secondaryForeground,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceLow,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    padding: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: radius.pill,
  },
  segmentBtnActive: {
    backgroundColor: colors.brandPrimary,
  },
  segmentText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.mutedForeground,
  },
  segmentTextActive: {
    color: colors.onBrand,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 40,
    gap: spacing.lg,
  },
  emptyCard: {
    backgroundColor: colors.surfaceLow,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMid,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  emptyTitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.bold,
    color: colors.foreground,
  },
  emptySubtitle: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.mutedForeground,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    paddingHorizontal: spacing.md,
  },
  findRestaurantsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.brandPrimary,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderRadius: radius.pill,
    marginTop: spacing.lg,
  },
  findRestaurantsBtnText: {
    color: colors.onBrand,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
  },
  bookingCard: {
    backgroundColor: colors.surfaceLow,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.md,
    gap: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  refCodeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  refCode: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
    color: colors.foreground,
    letterSpacing: 0.5,
  },
  refSimulated: {
    fontSize: 9,
    fontFamily: typography.fontFamily.bold,
    color: colors.warningText,
    backgroundColor: colors.warningBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  statusBadgeConfirmed: {
    backgroundColor: 'rgba(110, 231, 183, 0.12)',
  },
  statusDotGreen: {
    width: 6,
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.success,
  },
  statusTextConfirmed: {
    fontSize: 10,
    fontFamily: typography.fontFamily.bold,
    color: colors.success,
  },
  statusBadgeCompleted: {
    backgroundColor: colors.surfaceMid,
  },
  statusTextCompleted: {
    fontSize: 10,
    fontFamily: typography.fontFamily.medium,
    color: colors.mutedForeground,
  },
  statusBadgeCancelled: {
    backgroundColor: 'rgba(248, 113, 113, 0.12)',
  },
  statusTextCancelled: {
    fontSize: 10,
    fontFamily: typography.fontFamily.bold,
    color: colors.error,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
  },
  restaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  restaurantThumb: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMid,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
    color: colors.foreground,
  },
  restaurantCuisine: {
    fontSize: 11,
    fontFamily: typography.fontFamily.medium,
    color: colors.brandSecondary,
    marginTop: 1,
  },
  restaurantAddress: {
    fontSize: 10,
    fontFamily: typography.fontFamily.regular,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  metaGrid: {
    gap: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaItemText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.secondaryForeground,
  },
  itemsPillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  itemPill: {
    backgroundColor: colors.surfaceMid,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  itemPillText: {
    fontSize: 10,
    fontFamily: typography.fontFamily.medium,
    color: colors.secondaryForeground,
  },
  cardActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: 4,
  },
  actionBtnOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.surfaceMid,
    paddingVertical: 8,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  actionBtnOutlineText: {
    fontSize: 11,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.foreground,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.3)',
  },
  cancelBtnText: {
    fontSize: 11,
    fontFamily: typography.fontFamily.bold,
    color: colors.error,
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
  footerNoteText: {
    fontSize: 11,
    fontFamily: typography.fontFamily.regular,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
});
