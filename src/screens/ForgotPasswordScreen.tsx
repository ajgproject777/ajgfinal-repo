import { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { DineGoLogo } from '../components/DineGoLogo'
import { PrimaryButton } from '../components/PrimaryButton'
import { TextField } from '../components/TextField'
import { DEMO_MODE } from '../config'
import { requestPasswordReset } from '../services/authService'
import { colors, radius } from '../theme'
import { validateEmail } from '../validation'

export function ForgotPasswordScreen({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async () => {
    const err = validateEmail(email)
    setError(err)
    setFormError('')
    if (err) return

    setLoading(true)
    try {
      await requestPasswordReset(email)
      setSent(true)
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Could not send the reset link. Try again.')
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

        {sent ? (
          <View>
            <View style={styles.sentIcon}>
              <Ionicons name="mail-outline" size={24} color={colors.success} />
            </View>
            <Text style={styles.title}>Check your email</Text>
            <Text style={styles.subtitle}>
              {DEMO_MODE
                ? `Demo mode — no email was sent. With the backend connected, a reset link would go to ${email.trim()}.`
                : `If an account exists for ${email.trim()}, a password reset link has been sent to it.`}
            </Text>
            <PrimaryButton title="Back to Sign in" onPress={onBack} />
          </View>
        ) : (
          <View>
            <Text style={styles.title}>Forgot your password?</Text>
            <Text style={styles.subtitle}>Enter the email you signed up with and we'll send you a link to reset it.</Text>

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
                setError('')
              }}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              error={error}
            />
            <PrimaryButton title="Send reset link" loadingTitle="Sending…" loading={loading} onPress={handleSubmit} />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  back: { width: 36, height: 36, justifyContent: 'center', marginBottom: 8, marginLeft: -6 },
  title: { color: colors.foreground, fontSize: 26, fontWeight: '800', marginTop: 28, marginBottom: 6 },
  subtitle: { color: colors.mutedForeground, fontSize: 14, marginBottom: 24, lineHeight: 20 },
  sentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginTop: 28,
    backgroundColor: 'rgba(16,185,129,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.30)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formError: {
    backgroundColor: 'rgba(248,113,113,0.10)',
    borderColor: 'rgba(248,113,113,0.35)',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 16,
  },
  formErrorText: { color: colors.error, fontSize: 13 },
})
