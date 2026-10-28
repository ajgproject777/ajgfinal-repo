import { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { DineGoLogo } from '../components/DineGoLogo'
import { PasswordField } from '../components/PasswordField'
import { PrimaryButton } from '../components/PrimaryButton'
import { TextField } from '../components/TextField'
import { MIN_PASSWORD_LENGTH, PHONE_PATTERN } from '../config'
import { AuthUser, register } from '../services/authService'
import { colors, radius } from '../theme'
import { passwordStrength, validateEmail, validateNewPassword } from '../validation'

type Form = { name: string; email: string; phone: string; password: string; confirm: string; agree: boolean }
type Errors = Partial<Record<keyof Form, string>>

const EMPTY: Form = { name: '', email: '', phone: '', password: '', confirm: '', agree: false }
const STRENGTH_LABELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong']
const STRENGTH_COLORS = [colors.border, '#F87171', '#FBBF24', '#A3E635', '#34D399']

export function RegisterScreen({
  onRegistered,
  onBack,
}: {
  onRegistered: (user: AuthUser) => void
  onBack: () => void
}) {
  const [form, setForm] = useState<Form>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  const strength = passwordStrength(form.password)

  const setField = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: '' }))
  }

  const validate = (): Errors => {
    const next: Errors = {}
    if (!form.name.trim()) next.name = 'Full name is required'
    const emailError = validateEmail(form.email)
    if (emailError) next.email = emailError
    if (form.phone.trim() && !PHONE_PATTERN.test(form.phone.trim())) next.phone = 'Enter a valid phone number'
    const passwordError = validateNewPassword(form.password)
    if (passwordError) next.password = passwordError
    if (!form.confirm) next.confirm = 'Confirm your password'
    else if (form.confirm !== form.password) next.confirm = 'Passwords do not match'
    if (!form.agree) next.agree = 'You need to accept the Terms and Privacy Policy'
    return next
  }

  const handleSubmit = async () => {
    const next = validate()
    setErrors(next)
    setFormError('')
    if (Object.keys(next).length > 0) return

    setLoading(true)
    try {
      const user = await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      })
      onRegistered(user)
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Could not create your account. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>
        <Pressable onPress={onBack} hitSlop={10} style={styles.back} accessibilityRole="button" accessibilityLabel="Back to sign in">
          <Ionicons name="chevron-back" size={22} color={colors.foreground} />
        </Pressable>

        <DineGoLogo size="md" showTagline />
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>Join DineGo to discover and reserve restaurants along your route.</Text>

        {!!formError && (
          <View style={styles.formError} accessibilityRole="alert">
            <Text style={styles.formErrorText}>{formError}</Text>
          </View>
        )}

        <TextField
          label="Full name"
          value={form.name}
          onChangeText={(v) => setField('name', v)}
          placeholder="Enter your full name"
          autoComplete="name"
          autoCapitalize="words"
          error={errors.name}
        />
        <TextField
          label="Email"
          value={form.email}
          onChangeText={(v) => setField('email', v)}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          error={errors.email}
        />
        <TextField
          label="Phone number (optional)"
          value={form.phone}
          onChangeText={(v) => setField('phone', v)}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          autoComplete="tel"
          error={errors.phone}
        />
        <PasswordField
          label="Password"
          value={form.password}
          onChangeText={(v) => setField('password', v)}
          placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
          autoComplete="new-password"
          error={errors.password}
        />
        {!!form.password && (
          <View style={styles.strengthWrap} accessibilityLiveRegion="polite">
            <View style={styles.strengthBars}>
              {[1, 2, 3, 4].map((i) => (
                <View
                  key={i}
                  style={[styles.strengthBar, { backgroundColor: i <= strength ? STRENGTH_COLORS[strength] : colors.border }]}
                />
              ))}
            </View>
            <Text style={styles.strengthText}>Strength: {STRENGTH_LABELS[strength]}</Text>
          </View>
        )}
        <PasswordField
          label="Confirm password"
          value={form.confirm}
          onChangeText={(v) => setField('confirm', v)}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          error={errors.confirm}
        />

        <Pressable
          onPress={() => setField('agree', !form.agree)}
          style={styles.agreeRow}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: form.agree }}
        >
          <Ionicons
            name={form.agree ? 'checkbox' : 'square-outline'}
            size={22}
            color={form.agree ? colors.brand : colors.mutedForeground}
          />
          <Text style={styles.agreeText}>I agree to the Terms of Service and Privacy Policy.</Text>
        </Pressable>
        {!!errors.agree && (
          <Text style={styles.agreeError} accessibilityRole="alert">
            {errors.agree}
          </Text>
        )}

        <View style={{ marginTop: 20 }}>
          <PrimaryButton
            title="Create Traveller Account"
            loadingTitle="Creating account…"
            loading={loading}
            onPress={handleSubmit}
          />
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Pressable onPress={onBack} hitSlop={8} accessibilityRole="button">
            <Text style={styles.footerLink}>Sign in</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  back: { width: 36, height: 36, justifyContent: 'center', marginBottom: 8, marginLeft: -6 },
  title: { color: colors.foreground, fontSize: 26, fontWeight: '800', marginTop: 24, marginBottom: 6 },
  subtitle: { color: colors.mutedForeground, fontSize: 14, marginBottom: 22 },
  formError: {
    backgroundColor: 'rgba(248,113,113,0.10)',
    borderColor: 'rgba(248,113,113,0.35)',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 16,
  },
  formErrorText: { color: colors.error, fontSize: 13 },
  strengthWrap: { marginTop: -8, marginBottom: 16 },
  strengthBars: { flexDirection: 'row', gap: 4 },
  strengthBar: { flex: 1, height: 4, borderRadius: 2 },
  strengthText: { color: colors.mutedForeground, fontSize: 11, marginTop: 4 },
  agreeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  agreeText: { flex: 1, color: colors.mutedForeground, fontSize: 13 },
  agreeError: { color: colors.error, fontSize: 12, marginTop: 6 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 22 },
  footerText: { color: colors.mutedForeground, fontSize: 14 },
  footerLink: { color: colors.brand, fontSize: 14, fontWeight: '700' },
})
