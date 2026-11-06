export const COLORS = {
  // Pure OLED Backgrounds & Surfaces
  bgPrimary: '#000000',
  bgSurface: '#141416',
  bgElevated: '#1C1C1E',
  bgInput: '#1F1F23',
  bgSkeleton: '#1F1F23',
  bgSkeletonHighlight: '#2D2D34',
  border: '#2A2A30',
  borderSubtle: '#1E1E24',

  // Brand Accents
  yellowPrimary: '#FACC15',
  yellowPressed: '#EAB308',
  yellowSoft: 'rgba(250, 204, 21, 0.14)',

  rosePrimary: '#F43F5E',
  roseSoft: 'rgba(244, 63, 94, 0.15)',

  emeraldPrimary: '#10B981',
  emeraldSoft: 'rgba(16, 185, 129, 0.16)',

  purpleTarot: '#6D28D9',
  purpleTarotLight: '#A78BFA',
  purpleTarotDark: '#2E1065',

  // Text Hierarchy
  textPrimary: '#FFFFFF',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
  textInverse: '#000000',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;

export const TYPOGRAPHY = {
  display: {
    fontSize: 26,
    fontWeight: '800' as const,
    lineHeight: 32,
    letterSpacing: -0.5,
    color: COLORS.textPrimary,
  },
  h1: {
    fontSize: 22,
    fontWeight: '800' as const,
    lineHeight: 28,
    letterSpacing: -0.4,
    color: COLORS.textPrimary,
  },
  h2: {
    fontSize: 18,
    fontWeight: '700' as const,
    lineHeight: 24,
    letterSpacing: -0.3,
    color: COLORS.textPrimary,
  },
  h3: {
    fontSize: 16,
    fontWeight: '700' as const,
    lineHeight: 22,
    color: COLORS.textPrimary,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
    color: COLORS.textPrimary,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
    color: COLORS.textSecondary,
  },
  caption: {
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 16,
    color: COLORS.textMuted,
  },
  micro: {
    fontSize: 10,
    fontWeight: '700' as const,
    lineHeight: 13,
    letterSpacing: 0.4,
    color: COLORS.textMuted,
  },
} as const;
