import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  ActivityIndicator,
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

const DATE_OPTIONS = [
  { id: 'today', label: 'Today', subtitle: 'On Journey' },
  { id: 'tomorrow', label: 'Tomorrow', subtitle: 'Next Leg' },
  { id: 'weekend', label: 'In 2 Days', subtitle: 'Planned Pitstop' },
];

const TIME_SLOTS = [
  '12:30 PM',
  '1:15 PM',
  '2:00 PM',
  '7:00 PM',
  '7:30 PM',
  '8:15 PM',
  '9:00 PM',
];

export default function ReservationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const restaurantId = id || 'sample-1';
  const restaurant = getRestaurantById(restaurantId);

  const { getCart, getCartSummary, createBooking, routeSearch } = useBooking();

  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedTime, setSelectedTime] = useState(restaurant?.nextSlot || '7:30 PM');
  const [guests, setGuests] = useState(2);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const cartItems = getCart(restaurantId);
  const cartSummary = getCartSummary(restaurantId);

  if (!restaurant) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>Restaurant not found</Text>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const handleConfirmReservation = async () => {
    setErrorMessage('');
    if (!selectedDate) {
      setErrorMessage('Please select a reservation date.');
      return;
    }
    if (!selectedTime) {
      setErrorMessage('Please select your expected arrival time slot.');
      return;
    }
    if (guests < 1) {
      setErrorMessage('Number of guests must be at least 1.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate rapid local booking creation
      const newBooking = createBooking({
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        restaurantImage: restaurant.imageUri,
        cuisine: restaurant.cuisine,
        address: restaurant.address,
        date: selectedDate,
        time: selectedTime,
        guests,
        notes: notes.trim() || undefined,
        items: cartItems,
        totalAmount: cartSummary.subtotal,
      });

      // Navigate to confirmation screen with the booking id
      router.replace({
        pathname: '/booking/confirmation',
        params: { bookingId: newBooking.id },
      });
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : 'Reservation creation failed.');
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {DEMO_MODE && <DemoBanner />}

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.headerBackBtn}
          onPress={() => router.back()}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Back to menu or details"
        >
          <Ionicons name="arrow-back" size={20} color={colors.foreground} />
        </Pressable>

        <View style={styles.headerTitles}>
          <Text style={styles.headerTitle}>Reserve Pitstop Table</Text>
          <Text style={styles.headerSubtitle}>{restaurant.name}</Text>
        </View>

        <View style={styles.sampleBadge}>
          <Text style={styles.sampleBadgeText}>DEMO</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Restaurant Mini Hero Card */}
        <View style={styles.restaurantCard}>
          <Image source={{ uri: restaurant.imageUri }} style={styles.restaurantThumb} />
          <View style={styles.restaurantCardDetails}>
            <Text style={styles.restaurantCardName}>{restaurant.name}</Text>
            <Text style={styles.restaurantCardCuisine}>
              {restaurant.cuisine} · {restaurant.priceRange}
            </Text>
            <View style={styles.detourPill}>
              <Ionicons name="git-branch" size={12} color="#FCD34D" />
              <Text style={styles.detourPillText}>
                {restaurant.offRouteKm} km off highway ({restaurant.detourMinutes} min detour)
              </Text>
            </View>
          </View>
        </View>

        {/* Highway Corridor Arrival Hint */}
        <View style={styles.corridorEtaCard}>
          <Ionicons name="speedometer-outline" size={18} color={colors.brandSecondary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.corridorEtaTitle}>Route Corridor Synchronisation</Text>
            <Text style={styles.corridorEtaSubtitle}>
              Travelling from {routeSearch.from} to {routeSearch.destination}. Your arrival slot holds the table for 20 minutes past ETA.
            </Text>
          </View>
        </View>

        {/* Date Selection */}
        <View style={styles.formSection}>
          <Text style={styles.formSectionTitle}>1. Select Date</Text>
          <View style={styles.dateChipsRow}>
            {DATE_OPTIONS.map((opt) => {
              const isSelected = selectedDate === opt.label;
              return (
                <Pressable
                  key={opt.id}
                  style={[
                    styles.dateChip,
                    isSelected && styles.dateChipActive,
                  ]}
                  onPress={() => setSelectedDate(opt.label)}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${opt.label}`}
                >
                  <Text
                    style={[
                      styles.dateChipLabel,
                      isSelected && styles.dateChipLabelActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                  <Text
                    style={[
                      styles.dateChipSubtitle,
                      isSelected && styles.dateChipSubtitleActive,
                    ]}
                  >
                    {opt.subtitle}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Time Slot Selection */}
        <View style={styles.formSection}>
          <Text style={styles.formSectionTitle}>2. Estimated Arrival Time</Text>
          <View style={styles.timeSlotsWrap}>
            {TIME_SLOTS.map((slot) => {
              const isSelected = selectedTime === slot;
              return (
                <Pressable
                  key={slot}
                  style={[
                    styles.timeSlotPill,
                    isSelected && styles.timeSlotPillActive,
                  ]}
                  onPress={() => setSelectedTime(slot)}
                  accessibilityRole="button"
                  accessibilityLabel={`Select time ${slot}`}
                >
                  <Ionicons
                    name="time-outline"
                    size={13}
                    color={isSelected ? colors.onBrand : colors.mutedForeground}
                  />
                  <Text
                    style={[
                      styles.timeSlotText,
                      isSelected && styles.timeSlotTextActive,
                    ]}
                  >
                    {slot}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Number of Guests Stepper */}
        <View style={styles.formSection}>
          <Text style={styles.formSectionTitle}>3. Party Size</Text>
          <View style={styles.guestsStepperRow}>
            <View>
              <Text style={styles.guestsCountText}>
                {guests} {guests === 1 ? 'Guest' : 'Guests'}
              </Text>
              <Text style={styles.guestsHint}>Table reserved together</Text>
            </View>

            <View style={styles.stepperControls}>
              <Pressable
                style={[styles.stepperButton, guests <= 1 && styles.stepperButtonDisabled]}
                onPress={() => setGuests((g) => Math.max(1, g - 1))}
                disabled={guests <= 1}
                accessibilityRole="button"
                accessibilityLabel="Decrease guest count"
              >
                <Ionicons name="remove" size={18} color={guests <= 1 ? colors.mutedForeground : colors.foreground} />
              </Pressable>

              <Text style={styles.stepperValue}>{guests}</Text>

              <Pressable
                style={[styles.stepperButton, guests >= 16 && styles.stepperButtonDisabled]}
                onPress={() => setGuests((g) => Math.min(16, g + 1))}
                disabled={guests >= 16}
                accessibilityRole="button"
                accessibilityLabel="Increase guest count"
              >
                <Ionicons name="add" size={18} color={guests >= 16 ? colors.mutedForeground : colors.foreground} />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Food Pre-Order Summary */}
        <View style={styles.formSection}>
          <View style={styles.preOrderHeaderRow}>
            <Text style={styles.formSectionTitle}>4. Food Pre-Order</Text>
            <Pressable
              onPress={() => router.push(`/restaurant/${restaurantId}/menu`)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Add or modify pre-order items"
            >
              <Text style={styles.modifyPreOrderLink}>
                {cartItems.length > 0 ? 'Edit Dishes' : '+ Add Food Pre-Order'}
              </Text>
            </Pressable>
          </View>

          {cartItems.length > 0 ? (
            <View style={styles.preOrderSummaryCard}>
              {cartItems.map((ci) => (
                <View key={ci.menuItem.id} style={styles.preOrderItemRow}>
                  <Text style={styles.preOrderItemQty}>{ci.quantity}x</Text>
                  <Text style={styles.preOrderItemName} numberOfLines={1}>
                    {ci.menuItem.name}
                  </Text>
                  <Text style={styles.preOrderItemPrice}>
                    ₹{ci.menuItem.price * ci.quantity}
                  </Text>
                </View>
              ))}

              <View style={styles.preOrderSubtotalDivider} />

              <View style={styles.preOrderTotalRow}>
                <Text style={styles.preOrderTotalLabel}>Estimated Food Bill</Text>
                <Text style={styles.preOrderTotalAmount}>₹{cartSummary.subtotal}</Text>
              </View>

              <Text style={styles.preOrderNotice}>
                Kitchen starts preparation 15 minutes before your estimated arrival.
              </Text>
            </View>
          ) : (
            <View style={styles.noPreOrderCard}>
              <Ionicons name="fast-food-outline" size={24} color={colors.mutedForeground} />
              <View style={{ flex: 1 }}>
                <Text style={styles.noPreOrderTitle}>Table Only (No pre-ordered dishes)</Text>
                <Text style={styles.noPreOrderSubtitle}>
                  You can order directly from the physical menu upon arrival.
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Special Requests */}
        <View style={styles.formSection}>
          <Text style={styles.formSectionTitle}>5. Special Instructions (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="E.g., High chair needed, travel delay expected, spicy or dietary notes…"
            placeholderTextColor={colors.mutedForeground}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Validation Error Message */}
        {!!errorMessage && (
          <View style={styles.errorBox} accessibilityRole="alert">
            <Ionicons name="alert-circle" size={16} color={colors.error} />
            <Text style={styles.errorBoxText}>{errorMessage}</Text>
          </View>
        )}

        {/* Simulated Demo Disclaimer */}
        <View style={styles.demoNoticeBox}>
          <Ionicons name="shield-checkmark-outline" size={18} color={colors.warningText} />
          <Text style={styles.demoNoticeText}>
            Simulated major project booking: No payment charged. A mock confirmation code will be generated locally and added to your Bookings tab.
          </Text>
        </View>
      </ScrollView>

      {/* Sticky Bottom Confirmation Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomSummary}>
          <Text style={styles.bottomSummaryDate}>
            {selectedDate} at {selectedTime}
          </Text>
          <Text style={styles.bottomSummaryGuests}>
            {guests} {guests === 1 ? 'Guest' : 'Guests'}
            {cartItems.length > 0 ? ` · ₹${cartSummary.subtotal}` : ' · Table only'}
          </Text>
        </View>

        <Pressable
          style={[styles.confirmButton, isSubmitting && styles.confirmButtonDisabled]}
          onPress={handleConfirmReservation}
          disabled={isSubmitting}
          accessibilityRole="button"
          accessibilityLabel="Confirm reservation"
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.onBrand} size="small" />
          ) : (
            <>
              <Text style={styles.confirmButtonText}>Confirm Booking</Text>
              <Ionicons name="checkmark-circle" size={18} color={colors.onBrand} />
            </>
          )}
        </Pressable>
      </View>
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
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  headerBackBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceLow,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  headerTitles: {
    flex: 1,
  },
  headerTitle: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.bold,
    color: colors.foreground,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.mutedForeground,
  },
  sampleBadge: {
    backgroundColor: colors.warningBg,
    borderColor: colors.warningBorder,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  sampleBadgeText: {
    color: colors.warningText,
    fontSize: 9,
    fontFamily: typography.fontFamily.bold,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 120,
    gap: spacing.lg,
  },
  restaurantCard: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceLow,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    gap: spacing.md,
    alignItems: 'center',
  },
  restaurantThumb: {
    width: 70,
    height: 70,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMid,
  },
  restaurantCardDetails: {
    flex: 1,
  },
  restaurantCardName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.bold,
    color: colors.foreground,
  },
  restaurantCardCuisine: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  detourPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  detourPillText: {
    color: '#FCD34D',
    fontSize: 11,
    fontFamily: typography.fontFamily.medium,
  },
  corridorEtaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: 'rgba(255, 107, 53, 0.08)',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.25)',
    padding: spacing.md,
  },
  corridorEtaTitle: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    color: colors.brandSecondary,
  },
  corridorEtaSubtitle: {
    fontSize: 11,
    fontFamily: typography.fontFamily.regular,
    color: colors.secondaryForeground,
    lineHeight: 16,
    marginTop: 2,
  },
  formSection: {
    gap: spacing.sm,
  },
  formSectionTitle: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
    color: colors.foreground,
  },
  dateChipsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dateChip: {
    flex: 1,
    backgroundColor: colors.surfaceLow,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  dateChipActive: {
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
    borderColor: colors.brandPrimary,
  },
  dateChipLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
    color: colors.secondaryForeground,
  },
  dateChipLabelActive: {
    color: colors.brandPrimary,
  },
  dateChipSubtitle: {
    fontSize: 10,
    fontFamily: typography.fontFamily.regular,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  dateChipSubtitleActive: {
    color: colors.brandSecondary,
  },
  timeSlotsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  timeSlotPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceLow,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  timeSlotPillActive: {
    backgroundColor: colors.brandPrimary,
    borderColor: colors.brandPrimary,
  },
  timeSlotText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.secondaryForeground,
  },
  timeSlotTextActive: {
    color: colors.onBrand,
  },
  guestsStepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceLow,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  guestsCountText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.bold,
    color: colors.foreground,
  },
  guestsHint: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surfaceMid,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  stepperButton: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperButtonDisabled: {
    opacity: 0.4,
  },
  stepperValue: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.bold,
    color: colors.foreground,
    minWidth: 24,
    textAlign: 'center',
  },
  preOrderHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modifyPreOrderLink: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    color: colors.brandPrimary,
  },
  preOrderSummaryCard: {
    backgroundColor: colors.surfaceLow,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  preOrderItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: spacing.sm,
  },
  preOrderItemQty: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    color: colors.brandPrimary,
    width: 26,
  },
  preOrderItemName: {
    flex: 1,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.foreground,
  },
  preOrderItemPrice: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.secondaryForeground,
  },
  preOrderSubtotalDivider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginVertical: spacing.sm,
  },
  preOrderTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  preOrderTotalLabel: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    color: colors.foreground,
  },
  preOrderTotalAmount: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.bold,
    color: colors.brandSecondary,
  },
  preOrderNotice: {
    fontSize: 10,
    fontFamily: typography.fontFamily.regular,
    color: colors.mutedForeground,
    marginTop: 6,
    lineHeight: 14,
  },
  noPreOrderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surfaceLow,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  noPreOrderTitle: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.secondaryForeground,
  },
  noPreOrderSubtitle: {
    fontSize: 11,
    fontFamily: typography.fontFamily.regular,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  notesInput: {
    backgroundColor: colors.surfaceLow,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.md,
    color: colors.foreground,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    minHeight: 70,
    textAlignVertical: 'top',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(248, 113, 113, 0.12)',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.35)',
    padding: spacing.md,
  },
  errorBoxText: {
    color: colors.error,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
  },
  demoNoticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
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
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceHigh,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 32 : spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  bottomSummary: {
    flex: 1,
  },
  bottomSummaryDate: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
    color: colors.foreground,
  },
  bottomSummaryGuests: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.brandPrimary,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderRadius: radius.pill,
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmButtonText: {
    color: colors.onBrand,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    color: colors.foreground,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
  },
  backBtn: {
    marginTop: spacing.md,
    backgroundColor: colors.brandPrimary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  backBtnText: {
    color: colors.onBrand,
    fontFamily: typography.fontFamily.bold,
  },
});
