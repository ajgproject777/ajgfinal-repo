import { StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../theme'

export function DineGoLogo({ size = 'md', showTagline = false }: { size?: 'sm' | 'md' | 'lg'; showTagline?: boolean }) {
  const iconSize = size === 'lg' ? 34 : size === 'md' ? 26 : 20
  const fontSize = size === 'lg' ? 30 : size === 'md' ? 24 : 18
  return (
    <View style={styles.row} accessibilityLabel="DineGo">
      <Ionicons name="location" size={iconSize} color={colors.brand} />
      <View>
        <Text style={[styles.name, { fontSize }]}>
          Dine<Text style={{ color: colors.brand }}>Go</Text>
        </Text>
        {showTagline && <Text style={styles.tagline}>DINE ALONG YOUR JOURNEY</Text>}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { color: colors.foreground, fontWeight: '800', letterSpacing: -0.5 },
  tagline: { color: colors.mutedForeground, fontSize: 10, letterSpacing: 1.6, marginTop: 1 },
})
