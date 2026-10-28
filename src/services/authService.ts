import { DEMO_LATENCY_MS, DEMO_MODE } from '../config'

export type AuthUser = { name: string; email: string }

export type RegisterInput = { name: string; email: string; phone: string; password: string }

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

const NOT_CONNECTED = 'The authentication backend is not connected yet.'

// These three functions are the only place the screens talk to auth.
// Replace the bodies with calls to the FastAPI backend (API_BASE_URL) later.

export async function signIn(email: string, _password: string): Promise<AuthUser> {
  if (!DEMO_MODE) throw new Error(NOT_CONNECTED)
  await wait(DEMO_LATENCY_MS)
  return { name: '', email: email.trim() }
}

export async function register(input: RegisterInput): Promise<AuthUser> {
  if (!DEMO_MODE) throw new Error(NOT_CONNECTED)
  await wait(DEMO_LATENCY_MS)
  return { name: input.name.trim(), email: input.email.trim() }
}

export async function requestPasswordReset(_email: string): Promise<void> {
  if (!DEMO_MODE) throw new Error(NOT_CONNECTED)
  await wait(DEMO_LATENCY_MS)
}
