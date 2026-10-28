import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Pressable,
  TextInput,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getRestaurantById } from '../../../services/restaurantService';
import { useBooking } from '../../../store/bookingContext';
import { MenuItem, CartItem } from '../../../data/mockData';
import { colors, radius, spacing, typography } from '../../../theme/tokens';
import { DemoBanner } from '../../../components/DemoBanner';
import { DEMO_MODE } from '../../../config';

const CATEGORIES = ['All', 'Starters', 'Main Course', 'Beverages', 'Desserts'] as const;

export default function DigitalMenuScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const restaurantId = id || 'sample-1';
  const restaurant = getRestaurantById(restaurantId);

  const {
    menuCatalog,
    getCart,
    addToCart,
    removeFromCart,
    getCartSummary,
  } = useBooking();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const menuItems = menuCatalog[restaurantId] || [];
  const cartItems = getCart(restaurantId);
  const cartSummary = getCartSummary(restaurantId);

  // Filter items by category and search
  const filteredItems = useMemo(() => {
    return menuItems.filter((item: MenuItem) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  const getItemQuantity = (itemId: string): number => {
    const found = cartItems.find((ci: CartItem) => ci.menuItem.id === itemId);
    return found ? found.quantity : 0;
  };

  const handleContinue = () => {
    router.push(`/reservation/${restaurantId}`);
  };

  if (!restaurant) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.notFoundText}>Restaurant not found</Text>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const renderFoodItem = ({ item }: { item: MenuItem }) => {
    const qty = getItemQuantity(item.id);

    return (
      <View style={styles.itemCard}>
        <View style={styles.itemInfo}>
          {/* Veg / Non-Veg Indicator */}
          <View style={styles.vegIndicatorRow}>
            <View
              style={[
                styles.vegBox,
                item.isVeg ? styles.vegBoxGreen : styles.vegBoxRed,
              ]}
            >
              <View
                style={[
                  styles.vegDot,
                  item.isVeg ? styles.vegDotGreen : styles.vegDotRed,
                ]}
              />
            </View>
            <Text style={styles.categoryTag}>{item.category}</Text>
            {!item.isAvailable && (
              <View style={styles.soldOutBadge}>
                <Text style={styles.soldOutText}>Sold Out</Text>
              </View>
            )}
          </View>

          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>₹{item.price}</Text>
          <Text style={styles.itemDescription} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.prepTimeRow}>
            <Ionicons name="timer-outline" size={13} color={colors.mutedForeground} />
            <Text style={styles.prepTimeText}>Ready in ~{item.prepTimeMinutes} mins</Text>
          </View>
        </View>

        {/* Right side: Image & Add/Quantity button */}
        <View style={styles.itemMediaCol}>
          <Image source={{ uri: item.imageUri }} style={styles.itemImage} />

          {item.isAvailable ? (
            qty === 0 ? (
              <Pressable
                style={styles.addButton}
                onPress={() => addToCart(restaurantId, item)}
                accessibilityRole="button"
                accessibilityLabel={`Add ${item.name} to cart`}
              >
                <Text style={styles.addButtonText}>ADD</Text>
                <Ionicons name="add" size={14} color={colors.brandPrimary} />
              </Pressable>
            ) : (
              <View style={styles.stepperContainer}>
                <Pressable
                  style={styles.stepperBtn}
                  onPress={() => removeFromCart(restaurantId, item.id)}
                  hitSlop={6}
                  accessibilityRole="button"
                  accessibilityLabel={`Decrease quantity of ${item.name}`}
                >
                  <Ionicons name="remove" size={14} color={colors.brandPrimary} />
                </Pressable>
                <Text style={styles.stepperQty}>{qty}</Text>
                <Pressable
                  style={styles.stepperBtn}
                  onPress={() => addToCart(restaurantId, item)}
                  hitSlop={6}
                  accessibilityRole="button"
                  accessibilityLabel={`Increase quantity of ${item.name}`}
                >
                  <Ionicons name="add" size={14} color={colors.brandPrimary} />
                </Pressable>
              </View>
            )
          ) : (
            <View style={styles.disabledAddButton}>
              <Text style={styles.disabledAddText}>Unavailable</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {DEMO_MODE && <DemoBanner />}

      {/* Top Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.headerBackBtn}
          onPress={() => router.back()}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Back to restaurant details"
        >
          <Ionicons name="arrow-back" size={20} color={colors.foreground} />
        </Pressable>

        <View style={styles.headerTitles}>
          <Text style={styles.headerRestaurantName} numberOfLines={1}>
            {restaurant.name}
          </Text>
          <Text style={styles.headerSubtitle}>Digital Menu & Highway Pre-Order</Text>
        </View>

        <View style={styles.sampleBadgeSmall}>
          <Text style={styles.sampleBadgeSmallText}>SAMPLE</Text>
        </View>
      </View>

      {/* Search Input */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={18} color={colors.mutedForeground} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search dishes (e.g. Biryani, Dosa, Tea)…"
          placeholderTextColor={colors.mutedForeground}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={colors.mutedForeground} />
          </Pressable>
        )}
      </View>

      {/* Category Filter Horizontal Pills */}
      <View style={styles.categoriesBar}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.categoriesList}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item;
            return (
              <Pressable
                style={[
                  styles.categoryPill,
                  isSelected && styles.categoryPillActive,
                ]}
                onPress={() => setSelectedCategory(item)}
                accessibilityRole="button"
                accessibilityLabel={`Filter by ${item}`}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    isSelected && styles.categoryPillTextActive,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      {/* Menu Items List */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={renderFoodItem}
        contentContainerStyle={[
          styles.listContent,
          cartSummary.count > 0 && { paddingBottom: 110 },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="restaurant-outline" size={48} color={colors.mutedForeground} />
            <Text style={styles.emptyTitle}>No Dishes Found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery
                ? `No items match "${searchQuery}" in this category.`
                : 'No items available in this category currently.'}
            </Text>
          </View>
        }
      />

      {/* Sticky Bottom Cart Bar */}
      {cartSummary.count > 0 && (
        <View style={styles.floatingCartBar}>
          <View style={styles.cartInfo}>
            <View style={styles.cartCountPill}>
              <Text style={styles.cartCountText}>{cartSummary.count} items</Text>
            </View>
            <View>
              <Text style={styles.cartSubtotalLabel}>Pre-order Subtotal</Text>
              <Text style={styles.cartSubtotalValue}>₹{cartSummary.subtotal}</Text>
            </View>
          </View>

          <Pressable
            style={styles.continueButton}
            onPress={handleContinue}
            accessibilityRole="button"
            accessibilityLabel="Continue to table reservation"
          >
            <Text style={styles.continueButtonText}>Review & Book</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.onBrand} />
          </Pressable>
        </View>
      )}
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
  headerRestaurantName: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.bold,
    color: colors.foreground,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.mutedForeground,
  },
  sampleBadgeSmall: {
    backgroundColor: colors.warningBg,
    borderColor: colors.warningBorder,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  sampleBadgeSmallText: {
    color: colors.warningText,
    fontSize: 9,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: 0.5,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLow,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    height: 44,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: colors.foreground,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
  },
  categoriesBar: {
    paddingVertical: spacing.md,
  },
  categoriesList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  categoryPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceLow,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  categoryPillActive: {
    backgroundColor: colors.brandPrimary,
    borderColor: colors.brandPrimary,
  },
  categoryPillText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.secondaryForeground,
  },
  categoryPillTextActive: {
    color: colors.onBrand,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 40,
    gap: spacing.md,
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceLow,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    gap: spacing.md,
  },
  itemInfo: {
    flex: 1,
  },
  vegIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  vegBox: {
    width: 14,
    height: 14,
    borderRadius: 2,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vegBoxGreen: {
    borderColor: '#10B981',
  },
  vegBoxRed: {
    borderColor: '#EF4444',
  },
  vegDot: {
    width: 6,
    height: 6,
    borderRadius: radius.pill,
  },
  vegDotGreen: {
    backgroundColor: '#10B981',
  },
  vegDotRed: {
    backgroundColor: '#EF4444',
  },
  categoryTag: {
    fontSize: 10,
    fontFamily: typography.fontFamily.medium,
    color: colors.mutedForeground,
  },
  soldOutBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.xs,
  },
  soldOutText: {
    color: '#EF4444',
    fontSize: 9,
    fontFamily: typography.fontFamily.bold,
  },
  itemName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.bold,
    color: colors.foreground,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
    color: colors.brandSecondary,
    marginTop: 2,
  },
  itemDescription: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.mutedForeground,
    lineHeight: 17,
    marginTop: 4,
  },
  prepTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  prepTimeText: {
    fontSize: 11,
    fontFamily: typography.fontFamily.regular,
    color: colors.mutedForeground,
  },
  itemMediaCol: {
    alignItems: 'center',
    width: 100,
  },
  itemImage: {
    width: 100,
    height: 80,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMid,
  },
  addButton: {
    position: 'relative',
    marginTop: -14,
    backgroundColor: colors.surfaceHigh,
    borderColor: colors.brandPrimary,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  addButtonText: {
    color: colors.brandPrimary,
    fontSize: 11,
    fontFamily: typography.fontFamily.bold,
  },
  stepperContainer: {
    position: 'relative',
    marginTop: -14,
    backgroundColor: colors.surfaceHigh,
    borderColor: colors.brandPrimary,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  stepperBtn: {
    padding: 2,
  },
  stepperQty: {
    color: colors.foreground,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
  },
  disabledAddButton: {
    marginTop: -12,
    backgroundColor: colors.surfaceMid,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  disabledAddText: {
    color: colors.mutedForeground,
    fontSize: 10,
    fontFamily: typography.fontFamily.medium,
  },
  floatingCartBar: {
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
  cartInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  cartCountPill: {
    backgroundColor: colors.brandPrimary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  cartCountText: {
    color: colors.onBrand,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
  },
  cartSubtotalLabel: {
    fontSize: 10,
    fontFamily: typography.fontFamily.regular,
    color: colors.mutedForeground,
  },
  cartSubtotalValue: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.bold,
    color: colors.foreground,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.brandPrimary,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderRadius: radius.pill,
  },
  continueButtonText: {
    color: colors.onBrand,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: spacing.sm,
  },
  emptyTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.foreground,
    marginTop: spacing.sm,
  },
  emptySubtitle: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.mutedForeground,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  notFoundText: {
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
