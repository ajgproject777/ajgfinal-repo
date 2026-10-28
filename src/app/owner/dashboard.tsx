import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '../../store/auth';
import { useBooking } from '../../store/bookingContext';
import { MOCK_RESTAURANTS } from '../../data/mockData';
import { colors, radius, spacing, typography } from '../../theme/tokens';
import { DemoBanner } from '../../components/DemoBanner';
import { DEMO_MODE } from '../../config';

export default function RestaurantOwnerDashboardScreen() {
  const { signOut, selectedRole, setSelectedRole } = useAuth();
  const { menuCatalog, toggleItemAvailability, bookings } = useBooking();

  // Primary demo restaurant for owner
  const myRestaurant = MOCK_RESTAURANTS[0]; // Malabar Spice Kitchen
  const myMenu = menuCatalog[myRestaurant.id] || [];

  const [activeTables, setActiveTables] = useState(8);
  const totalTables = 12;
  const [isAcceptingOrders, setIsAcceptingOrders] = useState(true);

  const handleToggleAccepting = () => {
    setIsAcceptingOrders((prev) => !prev);
  };

  const handleSwitchToTraveller = () => {
    setSelectedRole('traveller');
    router.replace('/home');
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  // Simulated kitchen queue from current bookings
  const activeOrders = bookings.filter((b) => b.status === 'confirmed');

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {DEMO_MODE && <DemoBanner />}

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.partnerBadge}>
            <Ionicons name="business" size={14} color={colors.partnerAccent} />
            <Text style={styles.partnerBadgeText}>PARTNER DASHBOARD</Text>
          </View>
          <Text style={styles.restaurantTitle}>{myRestaurant.name}</Text>
          <Text style={styles.restaurantSub}>{myRestaurant.highwayCorridor}</Text>
        </View>

        <Pressable
          style={styles.switchModeBtn}
          onPress={handleSwitchToTraveller}
          accessibilityRole="button"
          accessibilityLabel="Switch to traveller mode"
        >
          <Ionicons name="swap-horizontal" size={14} color={colors.brandPrimary} />
          <Text style={styles.switchModeText}>Traveller View</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Status Toggle Card */}
        <View style={styles.statusBannerCard}>
          <View style={styles.statusBannerTextCol}>
            <View style={styles.statusDotRow}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: isAcceptingOrders ? colors.success : colors.error },
                ]}
              />
              <Text style={styles.statusBannerTitle}>
                {isAcceptingOrders ? 'Accepting Corridor Bookings' : 'Reservations Paused'}
              </Text>
            </View>
            <Text style={styles.statusBannerSubtitle}>
              {isAcceptingOrders
                ? 'Travellers on NH 66 can view open slots and pre-order food.'
                : 'Your restaurant is marked fully booked on traveller discovery.'}
            </Text>
          </View>

          <Switch
            value={isAcceptingOrders}
            onValueChange={handleToggleAccepting}
            trackColor={{ false: colors.surfaceHigh, true: colors.brandPrimary }}
            thumbColor={colors.foreground}
          />
        </View>

        {/* Analytics KPIs 4-Card Grid */}
        <View style={styles.kpiGrid}>
          {/* KPI 1: Today's Covers */}
          <View style={styles.kpiCard}>
            <View style={styles.kpiIconWrap}>
              <Ionicons name="people-outline" size={18} color={colors.brandPrimary} />
            </View>
            <Text style={styles.kpiValue}>28</Text>
            <Text style={styles.kpiLabel}>Today's Covers</Text>
            <Text style={styles.kpiTrend}>+14% vs yesterday</Text>
          </View>

          {/* KPI 2: Active Tables */}
          <View style={styles.kpiCard}>
            <View style={styles.kpiIconWrap}>
              <Ionicons name="restaurant-outline" size={18} color={colors.partnerAccent} />
            </View>
            <Text style={styles.kpiValue}>
              {activeTables}/{totalTables}
            </Text>
            <Text style={styles.kpiLabel}>Tables Occupied</Text>
            <View style={styles.tableQuickControls}>
              <Pressable
                onPress={() => setActiveTables((t) => Math.max(0, t - 1))}
                style={styles.tableAdjustBtn}
              >
                <Text style={styles.tableAdjustBtnText}>-</Text>
              </Pressable>
              <Pressable
                onPress={() => setActiveTables((t) => Math.min(totalTables, t + 1))}
                style={styles.tableAdjustBtn}
              >
                <Text style={styles.tableAdjustBtnText}>+</Text>
              </Pressable>
            </View>
          </View>

          {/* KPI 3: Pending Pre-Orders */}
          <View style={styles.kpiCard}>
            <View style={styles.kpiIconWrap}>
              <Ionicons name="fast-food-outline" size={18} color="#FCD34D" />
            </View>
            <Text style={styles.kpiValue}>{activeOrders.length}</Text>
            <Text style={styles.kpiLabel}>Active Orders</Text>
            <Text style={styles.kpiSub}>Kitchen prep queue</Text>
          </View>

          {/* KPI 4: Daily Revenue */}
          <View style={styles.kpiCard}>
            <View style={styles.kpiIconWrap}>
              <Ionicons name="cash-outline" size={18} color={colors.success} />
            </View>
            <Text style={styles.kpiValue}>₹18,450</Text>
            <Text style={styles.kpiLabel}>Est. Daily Sales</Text>
            <Text style={styles.kpiSub}>Card, UPI & Cash</Text>
          </View>
        </View>

        {/* Live Highway Kitchen Queue */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="time" size={16} color={colors.brandPrimary} />
              <Text style={styles.sectionTitle}>Incoming Traveller Reservations</Text>
            </View>
            <Text style={styles.queueCount}>{activeOrders.length} Pending</Text>
          </View>

          <Text style={styles.sectionDescription}>
            Synchronised with highway traveller ETAs along the corridor.
          </Text>

          {activeOrders.length === 0 ? (
            <View style={styles.emptyOrders}>
              <Text style={styles.emptyOrdersText}>No pending highway arrivals currently.</Text>
            </View>
          ) : (
            activeOrders.map((order) => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderTopRow}>
                  <View>
                    <Text style={styles.orderRef}>{order.id}</Text>
                    <Text style={styles.orderMeta}>
                      {order.guests} Guests · Arrival: {order.time} ({order.date})
                    </Text>
                  </View>
                  <View style={styles.orderStatusPill}>
                    <Text style={styles.orderStatusText}>ETA Verified</Text>
                  </View>
                </View>

                {order.items.length > 0 && (
                  <View style={styles.orderFoodList}>
                    {order.items.map((ci) => (
                      <Text key={ci.menuItem.id} style={styles.orderFoodItem}>
                        • {ci.quantity}x {ci.menuItem.name}
                      </Text>
                    ))}
                    <Text style={styles.orderFoodTotal}>Total Pre-order: ₹{order.totalAmount}</Text>
                  </View>
                )}

                {!!order.notes && (
                  <Text style={styles.orderNotes}>Note: {order.notes}</Text>
                )}

                <View style={styles.orderActionsRow}>
                  <Pressable
                    style={styles.actionReadyBtn}
                    onPress={() =>
                      Alert.alert('Table Ready', `Notification simulated for ${order.id}.`)
                    }
                  >
                    <Ionicons name="checkmark-done" size={14} color={colors.onBrand} />
                    <Text style={styles.actionReadyBtnText}>Table Ready</Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Live Menu Availability Management */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="restaurant" size={16} color={colors.brandPrimary} />
              <Text style={styles.sectionTitle}>Quick Menu Item Availability</Text>
            </View>
            <Text style={styles.queueCount}>{myMenu.length} Items</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Instantly mark high-demand highway dishes as In Stock or Sold Out.
          </Text>

          <View style={styles.menuItemsList}>
            {myMenu.map((item) => (
              <View key={item.id} style={styles.menuManageRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.menuManageName}>{item.name}</Text>
                  <Text style={styles.menuManageMeta}>
                    {item.category} · ₹{item.price}
                  </Text>
                </View>

                <View style={styles.menuManageToggleCol}>
                  <Text
                    style={[
                      styles.stockStatusText,
                      { color: item.isAvailable ? colors.success : colors.error },
                    ]}
                  >
                    {item.isAvailable ? 'In Stock' : 'Sold Out'}
                  </Text>
                  <Switch
                    value={item.isAvailable}
                    onValueChange={() => toggleItemAvailability(myRestaurant.id, item.id)}
                    trackColor={{ false: colors.surfaceHigh, true: colors.success }}
                    thumbColor={colors.foreground}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Sign Out / Exit Bar */}
        <View style={styles.footerRow}>
          <Pressable
            style={styles.signOutBtn}
            onPress={handleSignOut}
            accessibilityRole="button"
            accessibilityLabel="Sign out of partner account"
          >
            <Ionicons name="log-out-outline" size={16} color={colors.error} />
            <Text style={styles.signOutBtnText}>Sign Out Partner</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    backgroundColor: colors.surfaceLow,
  },
  headerLeft: {
    flex: 1,
  },
  partnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  partnerBadgeText: {
    fontSize: 10,
    fontFamily: typography.fontFamily.bold,
    color: colors.partnerAccent,
    letterSpacing: 0.5,
  },
  restaurantTitle: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.bold,
    color: colors.foreground,
  },
  restaurantSub: {
    fontSize: 11,
    fontFamily: typography.fontFamily.regular,
    color: colors.mutedForeground,
  },
  switchModeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceMid,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  switchModeText: {
    fontSize: 11,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.brandPrimary,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 40,
    gap: spacing.lg,
  },
  statusBannerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceLow,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  statusBannerTextCol: {
    flex: 1,
    marginRight: spacing.md,
  },
  statusDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
  },
  statusBannerTitle: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
    color: colors.foreground,
  },
  statusBannerSubtitle: {
    fontSize: 11,
    fontFamily: typography.fontFamily.regular,
    color: colors.mutedForeground,
    lineHeight: 16,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  kpiCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.surfaceLow,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.md,
  },
  kpiIconWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMid,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  kpiValue: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.foreground,
  },
  kpiLabel: {
    fontSize: 11,
    fontFamily: typography.fontFamily.medium,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  kpiTrend: {
    fontSize: 10,
    fontFamily: typography.fontFamily.bold,
    color: colors.success,
    marginTop: 4,
  },
  kpiSub: {
    fontSize: 10,
    fontFamily: typography.fontFamily.regular,
    color: colors.secondaryForeground,
    marginTop: 4,
  },
  tableQuickControls: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  tableAdjustBtn: {
    backgroundColor: colors.surfaceMid,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: radius.xs,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  tableAdjustBtnText: {
    color: colors.foreground,
    fontSize: 12,
    fontFamily: typography.fontFamily.bold,
  },
  sectionCard: {
    backgroundColor: colors.surfaceLow,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    gap: spacing.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
    color: colors.foreground,
  },
  queueCount: {
    fontSize: 10,
    fontFamily: typography.fontFamily.bold,
    color: colors.brandPrimary,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  sectionDescription: {
    fontSize: 11,
    fontFamily: typography.fontFamily.regular,
    color: colors.mutedForeground,
    marginBottom: 6,
  },
  emptyOrders: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  emptyOrdersText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.mutedForeground,
  },
  orderCard: {
    backgroundColor: colors.surfaceMid,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  orderTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderRef: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    color: colors.foreground,
  },
  orderMeta: {
    fontSize: 11,
    fontFamily: typography.fontFamily.regular,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  orderStatusPill: {
    backgroundColor: 'rgba(110, 231, 183, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  orderStatusText: {
    fontSize: 9,
    fontFamily: typography.fontFamily.bold,
    color: colors.success,
  },
  orderFoodList: {
    backgroundColor: colors.surfaceLow,
    borderRadius: radius.xs,
    padding: spacing.sm,
    gap: 2,
  },
  orderFoodItem: {
    fontSize: 11,
    fontFamily: typography.fontFamily.regular,
    color: colors.secondaryForeground,
  },
  orderFoodTotal: {
    fontSize: 11,
    fontFamily: typography.fontFamily.bold,
    color: colors.brandSecondary,
    marginTop: 2,
  },
  orderNotes: {
    fontSize: 10,
    fontFamily: typography.fontFamily.regular,
    color: colors.warningText,
    fontStyle: 'italic',
  },
  orderActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  actionReadyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.brandPrimary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  actionReadyBtnText: {
    fontSize: 11,
    fontFamily: typography.fontFamily.bold,
    color: colors.onBrand,
  },
  menuItemsList: {
    gap: spacing.sm,
  },
  menuManageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceMid,
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  menuManageName: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    color: colors.foreground,
  },
  menuManageMeta: {
    fontSize: 10,
    fontFamily: typography.fontFamily.regular,
    color: colors.mutedForeground,
    marginTop: 1,
  },
  menuManageToggleCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stockStatusText: {
    fontSize: 10,
    fontFamily: typography.fontFamily.bold,
  },
  footerRow: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.3)',
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: radius.pill,
  },
  signOutBtnText: {
    color: colors.error,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
  },
});
