import { useEffect, useState } from 'react'
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { DineGoLogo } from '../components/DineGoLogo'
import { PrimaryButton } from '../components/PrimaryButton'
import { TextField } from '../components/TextField'
import { DEMO_MODE } from '../config'
import { AuthUser } from '../services/authService'
import { RestaurantResult, searchAlongRoute } from '../services/restaurantService'
import { useBooking } from '../store/bookingContext'
import { colors, radius } from '../theme'

export function HomeScreen({ user, onSignOut }: { user: AuthUser; onSignOut: () => void }) {
  const { routeSearch, setRouteSearch } = useBooking()
  const [from, setFrom] = useState(routeSearch.from || 'Kochi')
  const [destination, setDestination] = useState(routeSearch.destination || 'Kozhikode')
  const [errors, setErrors] = useState({ from: '', destination: '' })
  const [searchError, setSearchError] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<RestaurantResult[] | null>(null)

  const firstName = user.name.trim().split(' ')[0]

  // Automatically load initial route recommendations on mount for presentation readiness
  useEffect(() => {
    let isMounted = true
    const loadInitial = async () => {
      setLoading(true)
      try {
        const data = await searchAlongRoute({ from, destination })
        if (isMounted) setResults(data)
      } catch (e) {
        if (isMounted) setSearchError(e instanceof Error ? e.message : 'Search failed.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadInitial()
    return () => {
      isMounted = false
    }
  }, [])

  const handleSearch = async () => {
    const next = {
      from: from.trim() ? '' : 'Enter your starting point',
      destination: destination.trim() ? '' : 'Enter your destination',
    }
    setErrors(next)
    setSearchError('')
    if (next.from || next.destination) return

    setLoading(true)
    try {
      setRouteSearch({
        from: from.trim(),
        destination: destination.trim(),
        distanceKm: 178,
        estimatedDuration: '4 hr 15 min',
      })
      setResults(await searchAlongRoute({ from, destination }))
    } catch (e) {
      setResults(null)
      setSearchError(e instanceof Error ? e.message : 'Search failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenRestaurant = (restaurantId: string) => {
    router.push(`/restaurant/${restaurantId}`)
  }

  return (
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll} style={styles.flex}>
      <View style={styles.header}>
        <DineGoLogo size="sm" />
        <Pressable onPress={onSignOut} hitSlop={10} accessibilityRole="button" accessibilityLabel="Sign out">
          <Ionicons name="log-out-outline" size={22} color={colors.mutedForeground} />
        </Pressable>
      </View>

      <Text style={styles.title}>{firstName ? `Hi, ${firstName}` : 'Welcome'}</Text>
      <Text style={styles.subtitle}>Where are you headed? We'll find highway restaurants along your route.</Text>

      <View style={styles.routeCard}>
        <TextField
          label="From"
          value={from}
          onChangeText={(v) => {
            setFrom(v)
            setErrors((e) => ({ ...e, from: '' }))
          }}
          placeholder="Starting point"
          error={errors.from}
        />
        <TextField
          label="Destination"
          value={destination}
          onChangeText={(v) => {
            setDestination(v)
            setErrors((e) => ({ ...e, destination: '' }))
          }}
          placeholder="Where to?"
          error={errors.destination}
        />
        <PrimaryButton title="Find restaurants along route" loadingTitle="Searching corridor…" loading={loading} onPress={handleSearch} />
      </View>

      {!!searchError && (
        <View style={styles.errorBox} accessibilityRole="alert">
          <Text style={styles.errorText}>{searchError}</Text>
        </View>
      )}

      {loading && <ActivityIndicator style={{ marginTop: 24 }} color={colors.brand} />}

      {results && !loading && (
        <View style={{ marginTop: 24 }}>
          <View style={styles.resultsHeaderRow}>
            <Text style={styles.sectionTitle}>
              {results.length} restaurant{results.length === 1 ? '' : 's'} along your route
            </Text>
            <Pressable
              onPress={() => router.push('/map')}
              hitSlop={8}
              style={styles.viewMapButton}
              accessibilityRole="button"
              accessibilityLabel="View route map"
            >
              <Ionicons name="map-outline" size={14} color={colors.brand} />
              <Text style={styles.viewMapText}>View Map</Text>
            </Pressable>
          </View>
          {DEMO_MODE && <Text style={styles.sampleNote}>Sample data — live GPS routing connects to Google Maps in Phase 2.</Text>}

          {results.map((r) => (
            <Pressable
              key={r.id}
              style={styles.card}
              onPress={() => handleOpenRestaurant(r.id)}
              accessibilityRole="button"
              accessibilityLabel={`View details for ${r.name}`}
            >
              <Image source={{ uri: r.imageUri }} style={styles.cardImage} />
              <View style={styles.cardBody}>
                <View style={styles.cardTitleRow}>
                  <Text style={styles.cardName} numberOfLines={1}>
                    {r.name}
                  </Text>
                  {r.isSample && (
                    <View style={styles.sampleBadge}>
                      <Text style={styles.sampleBadgeText}>SAMPLE</Text>
                    </View>
                  )}
                </View>

                <View style={styles.ratingAndCuisineRow}>
                  <View style={styles.ratingPill}>
                    <Ionicons name="star" size={12} color="#FCD34D" />
                    <Text style={styles.ratingText}>{r.rating || 4.6}</Text>
                  </View>
                  <Text style={styles.cardMeta} numberOfLines={1}>
                    {r.cuisine} · {r.priceRange || '₹₹'}
                  </Text>
                </View>

                <View style={styles.detourRow}>
                  <Ionicons name="git-branch-outline" size={14} color={colors.mutedForeground} />
                  <Text style={styles.detourText}>
                    {r.offRouteKm} km off route ({r.detourMinutes || Math.round(r.offRouteKm * 5)} mins detour)
                  </Text>
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.slotPill}>
                    <Ionicons name="time-outline" size={13} color={colors.warningText} style={{ marginRight: 4 }} />
                    <Text style={styles.slotText}>Next: {r.nextSlot}</Text>
                  </View>
                  <Pressable
                    style={styles.reserveButton}
                    onPress={() => handleOpenRestaurant(r.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`View and reserve at ${r.name}`}
                  >
                    <Text style={styles.reserveText}>View & Reserve</Text>
                    <Ionicons name="chevron-forward" size={14} color={colors.onBrand} />
                  </Pressable>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { color: colors.foreground, fontSize: 26, fontWeight: '800', marginBottom: 6 },
  subtitle: { color: colors.mutedForeground, fontSize: 14, marginBottom: 20, lineHeight: 20 },
  routeCard: { backgroundColor: colors.muted, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 16 },
  errorBox: {
    backgroundColor: 'rgba(248,113,113,0.10)',
    borderColor: 'rgba(248,113,113,0.35)',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: 12,
    marginTop: 16,
  },
  errorText: { color: colors.error, fontSize: 13 },
  resultsHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { color: colors.foreground, fontSize: 16, fontWeight: '700' },
  viewMapButton: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(212,98,26,0.12)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  viewMapText: { color: colors.brand, fontSize: 12, fontWeight: '700' },
  sampleNote: { color: colors.warningText, fontSize: 12, marginTop: 4 },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, marginTop: 14, overflow: 'hidden' },
  cardImage: { width: '100%', height: 150, backgroundColor: colors.muted },
  cardBody: { padding: 14 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  cardName: { flex: 1, color: colors.foreground, fontSize: 17, fontWeight: '700' },
  sampleBadge: { backgroundColor: colors.warningBg, borderColor: colors.warningBorder, borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 2 },
  sampleBadgeText: { color: colors.warningText, fontSize: 9, fontWeight: '700', letterSpacing: 0.8 },
  ratingAndCuisineRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  ratingPill: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: 'rgba(252,211,77,0.12)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  ratingText: { color: '#FCD34D', fontSize: 12, fontWeight: '700' },
  cardMeta: { color: colors.mutedForeground, fontSize: 13 },
  detourRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  detourText: { color: colors.mutedForeground, fontSize: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border },
  slotPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.warningBg, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 6 },
  slotText: { color: colors.warningText, fontSize: 12, fontWeight: '700' },
  reserveButton: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.brand, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 8 },
  reserveText: { color: colors.onBrand, fontSize: 13, fontWeight: '700' },
})
