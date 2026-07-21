/* ============================================================
   LOCKR — Design tokens (dark / olive "fintech nocturna")
   Ported from the Lockr design system. Lime that glows.
   ============================================================ */

export const colors = {
  // Brand core (manual de identidad)
  ink: '#191919',
  olive: '#2C2D1A',
  lime: '#DEF16B',
  limeDeep: '#B9CC4A',
  gray: '#ACB0AF',
  cream: '#F5F6ED',

  // Derived dark surfaces (olive-tinted)
  bg0: '#111208',
  bg1: '#15160D',
  panel: '#1C1D12',
  panel2: '#24251A',
  panel3: '#2E2F20',

  // Text
  text: '#F5F6ED',
  textMut: '#9DA09A',
  textDim: '#6E7167',

  // Lime tints
  limeSoft: 'rgba(222,241,107,0.14)',
  limeLine: 'rgba(222,241,107,0.30)',

  // Hairlines
  hairline: 'rgba(245,246,237,0.08)',
  hairline2: 'rgba(245,246,237,0.14)',

  // Status (mapped to brand palette only)
  ok: '#F5F6ED', // cream — delivered
  air: '#DEF16B', // lime — active / in-transit
  sea: '#ACB0AF', // gray — maritime / neutral
  danger: '#F0795E', // form errors only

  // On-lime ink (text/icons placed on a lime surface)
  onLime: '#1A1B10',

  // External brand (WhatsApp) — official green
  waGreen: '#25D366',
  waGreenSoft: 'rgba(37,211,102,0.15)',
  waGreenLine: 'rgba(37,211,102,0.35)',

  // Danger tints (destructive actions, e.g. logout)
  dangerSoft: 'rgba(240,121,94,0.12)',
  dangerLine: 'rgba(240,121,94,0.30)',
} as const;

export const radii = { lg: 26, md: 18, sm: 12 } as const;

// Lime glow shadow (RN style object)
export const limeGlow = {
  shadowColor: colors.lime,
  shadowOpacity: 0.45,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 0 },
  elevation: 10,
};

export const limeGlowSm = {
  shadowColor: colors.lime,
  shadowOpacity: 0.35,
  shadowRadius: 9,
  shadowOffset: { width: 0, height: 0 },
  elevation: 6,
};

// Font family names (loaded via @expo-google-fonts in the root layout)
export const fonts = {
  regular: 'Montserrat_400Regular',
  medium: 'Montserrat_500Medium',
  semibold: 'Montserrat_600SemiBold',
  bold: 'Poppins_700Bold',
  extrabold: 'Poppins_800ExtraBold',
  mono: 'JetBrainsMono_600SemiBold',
  monoBold: 'JetBrainsMono_700Bold',
} as const;
