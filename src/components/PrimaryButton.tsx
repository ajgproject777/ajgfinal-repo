import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native'
import { colors, radius } from '../theme'

export function PrimaryButton({
  title,
  onPress,
  loading = false,
  loadingTitle,
}: {
  title: string
  onPress: () => void
  loading?: boolean
  loadingTitle?: string
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: loading, busy: loading }}
      style={({ pressed }) => [styles.button, (pressed || loading) && styles.dim]}
    >
      {loading && <ActivityIndicator color={colors.onBrand} size="small" />}
      <Text style={styles.text}>{loading && loadingTitle ? loadingTitle : title}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.brand,
    borderRadius: radius.md,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dim: { opacity: 0.8 },
  text: { color: colors.onBrand, fontSize: 15, fontWeight: '700' },
})
