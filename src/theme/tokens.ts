export const colors = {
  // Base backgrounds and surfaces
  background: '#0E0D0C',
  surface: '#111317',
  surfaceLowest: '#0A0B0D',
  surfaceLow: '#15181D',
  surfaceMid: '#1C1F26',
  surfaceHigh: '#242831',
  surfaceHighest: '#333539',

  // Cards and containers
  card: '#171514',
  muted: '#1D1A18',
  secondary: '#2B2725',
  border: '#2E2A27',
  borderSubtle: '#22252B',

  // Typography and foregrounds
  foreground: '#F5F2EE',
  secondaryForeground: '#D6D0CA',
  mutedForeground: '#A29B94',

  // Brand and accents
  brand: '#D4621A',
  brandPrimary: '#FF6B35',
  brandSecondary: '#FFB59D',
  onBrand: '#FFFFFF',

  // Partner / owner role accent
  partnerAccent: '#7BD0FF',

  // Status
  error: '#F87171',
  success: '#6EE7B7',
  warningText: '#FCD34D',
  warningBg: 'rgba(245, 158, 11, 0.10)',
  warningBorder: 'rgba(245, 158, 11, 0.25)',
} as const;

export const typography = {
  fontFamily: {
    regular: 'PlusJakartaSans_400Regular',
    medium: 'PlusJakartaSans_500Medium',
    semiBold: 'PlusJakartaSans_600SemiBold',
    bold: 'PlusJakartaSans_700Bold',
  },
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
    display: 34,
  },
} as const;

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;
