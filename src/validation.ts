import { EMAIL_PATTERN, MIN_PASSWORD_LENGTH } from './config'

export function validateEmail(value: string, label = 'Email') {
  const v = value.trim()
  if (!v) return `${label} is required`
  if (!EMAIL_PATTERN.test(v)) return 'Enter a valid email address'
  return ''
}

export function validateNewPassword(value: string) {
  if (!value) return 'Password is required'
  if (value.length < MIN_PASSWORD_LENGTH) return `Use at least ${MIN_PASSWORD_LENGTH} characters`
  return ''
}

// 0-4
export function passwordStrength(value: string) {
  let score = 0
  if (value.length >= MIN_PASSWORD_LENGTH) score++
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++
  if (/[0-9]/.test(value)) score++
  if (/[^A-Za-z0-9]/.test(value)) score++
  return score
}
