import { useState } from 'react'
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { DineGoLogo } from '../components/DineGoLogo'
import { PasswordField } from '../components/PasswordField'
import { PrimaryButton } from '../components/PrimaryButton'
import { TextField } from '../components/TextField'
import { HERO_IMAGE_URI } from '../config'
import { AuthUser, signIn } from '../services/authService'
import { colors, radius } from '../theme'
import { validateEmail } from '../validation'

export function LoginScreen({
  onSignedIn,
  onRegister,
  onForgotPassword,
}: {
  onSignedIn: (user: AuthUser) => void
  onRegister: () => void
  onForgotPassword: () => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({ email: '', password: '' })
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    const next = {
      email: validateEmail(email),
      password: password ? '' : 'Password is required',
    }
    setErrors(next)
    setFormError('')
    if (next.email || next.password) return

    setLoading(true)
    try {
      const user = await signIn(email, password)
      onSignedIn(user)
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Could not sign in. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>
        <ImageBackground source={{ uri: HERO_IMAGE_URI }} style={styles.hero}>
          <View style={styles.heroOverlay}>
            <DineGoLogo size="md" />
            <Text style={styles.heroTitle}>
              Dine along{'\n'}
              <Text style={{ color: '#F4A574' }}>your journey.</Text>
            </Text>
          </View>
        </ImageBackground>

        <View style={styles.sheet}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to discover restaurants along your route.</Text>

          {!!formError && (
            <View style={styles.formError} accessibilityRole="alert">
              <Text style={styles.formErrorText}>{formError}</Text>
            </View>
          )}

          <TextField
            label="Email"
            value={email}
            onChangeText={(v) => {
              setEmail(v)
              setErrors((e) => ({ ...e, email: '' }))
            }}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            error={errors.email}
          />

          <PasswordField
            label="Password"
            value={password}
            onChangeText={(v) => {
              setPassword(v)
              setErrors((e) => ({ ...e, password: '' }))
            }}
            placeholder="Enter your password"
            autoComplete="current-password"
            error={errors.password}
            labelRight={
              <Pressable onPress={onForgotPassword} hitSlop={8} accessibilityRole="button">
                <Text style={styles.link}>Forgot Password?</Text>
              </Pressable>
            }
          />

          <PrimaryButton title="Login" loadingTitle="Signing in…" loading={loading} onPress={handleLogin} />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable
            style={({ pressed }) => [styles.googleButton, pressed && { opacity: 0.8 }]}
            accessibilityRole="button"
            onPress={() => Alert.alert('Not available yet', 'Google sign-in is not connected yet.')}
          >
            <Ionicons name="logo-google" size={18} color={colors.foreground} />
            <Text style={styles.googleText}>Continue with Google</Text>
          </Pressable>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Pressable onPress={onRegister} hitSlop={8} accessibilityRole="button">
              <Text style={[styles.link, { fontSize: 14, fontWeight: '700' }]}>Create an account</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, paddingBottom: 32 },
  hero: { height: 240, backgroundColor: colors.card },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(14,13,12,0.6)',
    padding: 20,
    justifyContent: 'space-between',
  },
  heroTitle: { color: '#FFFFFF', fontSize: 30, fontWeight: '800', lineHeight: 36, marginBottom: 20 },
  sheet: {
    marginTop: -20,
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  title: { color: colors.foreground, fontSize: 26, fontWeight: '800', marginBottom: 6 },
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
  link: { color: colors.brand, fontSize: 12, fontWeight: '600' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { color: colors.mutedForeground, fontSize: 11, fontWeight: '600' },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: 13,
  },
  googleText: { color: colors.foreground, fontSize: 14, fontWeight: '600' },
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24 },
  footerText: { color: colors.mutedForeground, fontSize: 14 },
})
