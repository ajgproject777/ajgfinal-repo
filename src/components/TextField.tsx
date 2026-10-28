import { useState } from 'react'
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native'
import { colors, radius } from '../theme'

type Props = TextInputProps & {
  label: string
  error?: string
  labelRight?: React.ReactNode
  right?: React.ReactNode
}

export function TextField({ label, error, labelRight, right, style, onFocus, onBlur, ...rest }: Props) {
  const [focused, setFocused] = useState(false)
  return (
    <View style={styles.wrap}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {labelRight}
      </View>
      <View style={[styles.inputRow, focused && styles.focused, !!error && styles.errored]}>
        <TextInput
          {...rest}
          accessibilityLabel={label}
          placeholderTextColor={colors.mutedForeground}
          selectionColor={colors.brand}
          style={[styles.input, style]}
          onFocus={(e) => {
            setFocused(true)
            onFocus?.(e)
          }}
          onBlur={(e) => {
            setFocused(false)
            onBlur?.(e)
          }}
        />
        {right}
      </View>
      {!!error && (
        <Text style={styles.error} accessibilityRole="alert">
          {error}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  label: { color: colors.secondaryForeground, fontSize: 13, fontWeight: '500' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  focused: { borderColor: colors.brand },
  errored: { borderColor: colors.error },
  input: { flex: 1, color: colors.foreground, fontSize: 15, paddingHorizontal: 14, paddingVertical: 13 },
  error: { color: colors.error, fontSize: 12, marginTop: 6 },
})
