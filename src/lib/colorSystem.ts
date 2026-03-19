import chroma from 'chroma-js';
import type { ColorStop, ExtendedColor, SemanticColorTokens } from '../types/tokens';

// ─── Tonal palette ────────────────────────────────────────────────────────────

export function generateTonalPalette(baseColor: string): ColorStop {
  const color = chroma(baseColor);
  const [h, s] = color.hsl();
  const saturation = isNaN(s) ? 0 : s;

  const stops: [number, number, number][] = [
    [50,  Math.min(saturation * 0.30, 0.15), 0.97],
    [100, Math.min(saturation * 0.40, 0.25), 0.94],
    [200, Math.min(saturation * 0.50, 0.40), 0.88],
    [300, Math.min(saturation * 0.65, 0.60), 0.78],
    [400, Math.min(saturation * 0.80, 0.75), 0.66],
    [500, saturation,                         0.50],
    [600, Math.min(saturation * 1.05, 1),    0.42],
    [700, Math.min(saturation * 1.10, 1),    0.34],
    [800, Math.min(saturation * 1.15, 1),    0.26],
    [900, Math.min(saturation * 1.20, 1),    0.18],
    [950, Math.min(saturation * 1.25, 1),    0.12],
  ];

  const palette: Partial<ColorStop> = {};
  for (const [stop, sat, lightness] of stops) {
    palette[stop as keyof ColorStop] = chroma.hsl(h, sat, lightness).hex();
  }
  return palette as ColorStop;
}

// ─── WCAG math ────────────────────────────────────────────────────────────────

function getLuminance(hex: string): number {
  try {
    const rgb = chroma(hex).rgb();
    const [r, g, b] = rgb.map(c => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  } catch {
    return 0;
  }
}

export function getContrastRatio(c1: string, c2: string): number {
  try {
    const l1 = getLuminance(c1);
    const l2 = getLuminance(c2);
    const light = Math.max(l1, l2);
    const dark  = Math.min(l1, l2);
    return (light + 0.05) / (dark + 0.05);
  } catch {
    return 1;
  }
}

export function checkContrast(fg: string, bg: string) {
  const ratio = getContrastRatio(fg, bg);
  return {
    ratio,
    aa:       ratio >= 4.5,
    aaa:      ratio >= 7,
    aaLarge:  ratio >= 3,
    aaaLarge: ratio >= 4.5,
  };
}

// ─── Accessible color finders ─────────────────────────────────────────────────

const ALL_STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

/**
 * Scan palette stops in preference order and return the first one that
 * meets `minRatio` against `background`.
 *
 * `preferDark = true`  → start from darkest (good for light backgrounds)
 * `preferDark = false` → start from lightest (good for dark backgrounds)
 *
 * If nothing meets the threshold, returns the stop with the best ratio.
 */
function findAccessibleColor(
  palette: ColorStop,
  background: string,
  minRatio: number,
  preferDark: boolean,
): string {
  const ordered = preferDark
    ? ([950, 900, 800, 700, 600, 500, 400, 300, 200, 100, 50] as const)
    : ([50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const);

  for (const stop of ordered) {
    if (getContrastRatio(palette[stop], background) >= minRatio) {
      return palette[stop];
    }
  }

  // Fallback: best available
  let best = palette[ordered[0]];
  let bestRatio = 0;
  for (const stop of ALL_STOPS) {
    const r = getContrastRatio(palette[stop], background);
    if (r > bestRatio) { bestRatio = r; best = palette[stop]; }
  }
  return best;
}

/**
 * For text.secondary / text.tertiary: find the SOFTEST (least contrasty)
 * color that still clears `minRatio`. This keeps secondary text subtle
 * while remaining accessible.
 *
 * `preferDark = true` → start from lightest (find first dark-enough color)
 */
function findSoftestAccessibleColor(
  palette: ColorStop,
  background: string,
  minRatio: number,
  preferDark: boolean,
): string {
  // Walk from softest toward strongest, stop at first that clears threshold
  const softest = preferDark
    ? ([100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const)
    : ([900, 800, 700, 600, 500, 400, 300, 200, 100, 50] as const);

  for (const stop of softest) {
    if (getContrastRatio(palette[stop], background) >= minRatio) {
      return palette[stop];
    }
  }
  // Nothing soft enough meets it — fall back to strongest
  return preferDark ? palette[950] : palette[50];
}

/**
 * Pick the action.primary palette stop. It must:
 * - Pass 3:1 non-text contrast against background (WCAG 1.4.11)
 * - Be visually saturated / identifiable as the brand color
 *
 * We prefer mid-range stops (400–700) and pick the one closest to 500
 * that passes 3:1.
 */
function findActionColor(
  palette: ColorStop,
  background: string,
  preferDark: boolean,
): string {
  // Preferred mid-range stops in order of preference
  const preferred = preferDark
    ? [500, 600, 400, 700, 300, 800, 200, 900] as const
    : [400, 300, 500, 200, 600, 100, 700] as const;

  for (const stop of preferred) {
    if (getContrastRatio(palette[stop], background) >= 3) {
      return palette[stop];
    }
  }
  // Nothing in mid-range — use strongest available
  return preferDark ? palette[700] : palette[300];
}

/**
 * For border.focus — must pass 3:1 against both the page background
 * AND the component surface (WCAG 1.4.11 Non-text Contrast).
 * We pick the primary palette stop with the best minimum contrast
 * against both surfaces.
 */
function findFocusColor(
  palette: ColorStop,
  background: string,
  surface: string,
  preferDark: boolean,
): string {
  const ordered = preferDark
    ? ([500, 600, 400, 700, 300, 800, 200] as const)
    : ([400, 300, 500, 200, 600, 100, 700] as const);

  for (const stop of ordered) {
    const onBg = getContrastRatio(palette[stop], background);
    const onSurface = getContrastRatio(palette[stop], surface);
    if (Math.min(onBg, onSurface) >= 3) {
      return palette[stop];
    }
  }
  return preferDark ? palette[500] : palette[400];
}

// ─── Feedback token builder ───────────────────────────────────────────────────

interface FeedbackSet {
  default: string;
  subtle: string;
  text: string;
}

/**
 * Build a feedback triplet (default / subtle / text) from a base hue+sat,
 * ensuring:
 * - `.default` passes 3:1 non-text contrast against page background
 * - `.text`    passes 4.5:1 AA against `.subtle`
 */
function buildFeedbackSet(
  hue: number,
  saturation: number,
  background: string,
  isDark: boolean,
): FeedbackSet {
  // Default: bright/vivid version of the hue
  const defaultLightness = isDark ? 0.55 : 0.46;
  let defaultColor = chroma.hsl(hue, saturation, defaultLightness).hex();

  // Nudge lightness until it clears 3:1 non-text contrast against background
  let lightness = defaultLightness;
  for (let i = 0; i < 20; i++) {
    if (getContrastRatio(defaultColor, background) >= 3) break;
    lightness = isDark ? lightness + 0.03 : lightness - 0.03;
    lightness = Math.max(0.05, Math.min(0.95, lightness));
    defaultColor = chroma.hsl(hue, saturation, lightness).hex();
  }

  // Subtle: very light (light mode) or very dark (dark mode) tint
  const subtleLightness = isDark ? 0.10 : 0.95;
  const subtleColor = chroma.hsl(hue, Math.min(saturation * 0.4, 0.4), subtleLightness).hex();

  // Text on subtle: must pass 4.5:1 AA
  const textLightness = isDark ? 0.70 : 0.28;
  let textColor = chroma.hsl(hue, Math.min(saturation * 0.9, 0.9), textLightness).hex();
  let tL = textLightness;
  for (let i = 0; i < 20; i++) {
    if (getContrastRatio(textColor, subtleColor) >= 4.5) break;
    tL = isDark ? tL + 0.04 : tL - 0.04;
    tL = Math.max(0.05, Math.min(0.95, tL));
    textColor = chroma.hsl(hue, Math.min(saturation * 0.9, 0.9), tL).hex();
  }

  return { default: defaultColor, subtle: subtleColor, text: textColor };
}

// ─── Semantic token generators ────────────────────────────────────────────────

export function generateSemanticLight(
  primary: ColorStop,
  secondary: ColorStop,
  _tertiary: ColorStop,
  neutral: ColorStop,
): SemanticColorTokens {
  const bg      = neutral[50];
  const surface = '#ffffff';

  // ── Backgrounds ──────────────────────────────────────────────────────────
  const bgDefault  = bg;
  const bgSubtle   = neutral[100];
  const bgInverse  = neutral[950];

  // ── Text: guaranteed contrast against bgDefault ───────────────────────────
  // primary:   aim for AAA (7:1), settle for AA (4.5:1)
  const textPrimary  = findAccessibleColor(neutral, bgDefault, 7, true)
    ?? findAccessibleColor(neutral, bgDefault, 4.5, true);

  // secondary: softest color that still clears AA (4.5:1)
  const textSecondary = findSoftestAccessibleColor(neutral, bgDefault, 4.5, true);

  // tertiary:  softest color that clears AA-Large (3:1)
  const textTertiary = findSoftestAccessibleColor(neutral, bgDefault, 3, true);

  // disabled:  exempt from WCAG — target ~2:1 for legibility hint
  const textDisabled = findSoftestAccessibleColor(neutral, bgDefault, 2, true);

  // inverse text on bgInverse
  const textInverse = findAccessibleColor(neutral, bgInverse, 4.5, false);

  // ── Actions ───────────────────────────────────────────────────────────────
  const actionPrimary   = findActionColor(primary, bgDefault, true);
  const actionSecondary = findActionColor(secondary, bgDefault, true);

  // on-primary: guaranteed AA against whatever actionPrimary resolved to
  const textOnPrimary = findAccessibleColor(
    // build a simple black/white palette-like object
    { 50: '#ffffff', 100: '#f5f5f5', 200: '#e5e5e5', 300: '#d4d4d4', 400: '#a3a3a3',
      500: '#737373', 600: '#525252', 700: '#404040', 800: '#262626', 900: '#171717',
      950: '#0a0a0a' } as ColorStop,
    actionPrimary,
    4.5,
    getLuminance(actionPrimary) > 0.18, // prefer dark text on light actions, vice versa
  );

  // ── Focus border ─────────────────────────────────────────────────────────
  const borderFocus = findFocusColor(primary, bgDefault, surface, true);

  // ── Feedback (WCAG-verified) ──────────────────────────────────────────────
  const feedback = {
    success: buildFeedbackSet(142, 0.71, bgDefault, false),
    warning: buildFeedbackSet(38,  0.92, bgDefault, false),
    error:   buildFeedbackSet(4,   0.86, bgDefault, false),
    info:    buildFeedbackSet(217, 0.91, bgDefault, false),
  };

  return {
    background: {
      default:  bgDefault,
      subtle:   bgSubtle,
      inverse:  bgInverse,
    },
    surface: {
      default: surface,
      raised:  surface,
      glass:   'rgba(255,255,255,0.7)',
    },
    text: {
      primary:   textPrimary,
      secondary: textSecondary,
      tertiary:  textTertiary,
      disabled:  textDisabled,
      inverse:   textInverse,
      onPrimary: textOnPrimary,
    },
    border: {
      default: neutral[200],
      subtle:  neutral[100],
      strong:  findSoftestAccessibleColor(neutral, bgDefault, 3, true),
      focus:   borderFocus,
    },
    action: {
      primary:           actionPrimary,
      primaryHover:      findActionColor(primary, bgDefault, true) === primary[500]
        ? primary[600] : shiftStop(primary, actionPrimary, +1),
      primaryActive:     shiftStop(primary, actionPrimary, +2),
      primaryDisabled:   primary[200],
      secondary:         actionSecondary,
      secondaryHover:    shiftStop(secondary, actionSecondary, +1),
      secondaryActive:   shiftStop(secondary, actionSecondary, +2),
      secondaryDisabled: secondary[200],
    },
    feedback,
  };
}

export function generateSemanticDark(
  primary: ColorStop,
  secondary: ColorStop,
  _tertiary: ColorStop,
  neutral: ColorStop,
): SemanticColorTokens {
  const bg      = neutral[950];
  const surface = neutral[900];

  // ── Backgrounds ──────────────────────────────────────────────────────────
  const bgDefault = bg;
  const bgSubtle  = neutral[900];
  const bgInverse = neutral[50];

  // ── Text ──────────────────────────────────────────────────────────────────
  const textPrimary   = findAccessibleColor(neutral, bgDefault, 7, false)
    ?? findAccessibleColor(neutral, bgDefault, 4.5, false);
  const textSecondary = findSoftestAccessibleColor(neutral, bgDefault, 4.5, false);
  const textTertiary  = findSoftestAccessibleColor(neutral, bgDefault, 3, false);
  const textDisabled  = findSoftestAccessibleColor(neutral, bgDefault, 2, false);
  const textInverse   = findAccessibleColor(neutral, bgInverse, 4.5, true);

  // ── Actions ───────────────────────────────────────────────────────────────
  const actionPrimary   = findActionColor(primary, bgDefault, false);
  const actionSecondary = findActionColor(secondary, bgDefault, false);

  const textOnPrimary = findAccessibleColor(
    { 50: '#ffffff', 100: '#f5f5f5', 200: '#e5e5e5', 300: '#d4d4d4', 400: '#a3a3a3',
      500: '#737373', 600: '#525252', 700: '#404040', 800: '#262626', 900: '#171717',
      950: '#0a0a0a' } as ColorStop,
    actionPrimary,
    4.5,
    getLuminance(actionPrimary) > 0.18,
  );

  // ── Focus border ─────────────────────────────────────────────────────────
  const borderFocus = findFocusColor(primary, bgDefault, surface, false);

  // ── Feedback ──────────────────────────────────────────────────────────────
  const feedback = {
    success: buildFeedbackSet(142, 0.65, bgDefault, true),
    warning: buildFeedbackSet(38,  0.88, bgDefault, true),
    error:   buildFeedbackSet(4,   0.82, bgDefault, true),
    info:    buildFeedbackSet(217, 0.85, bgDefault, true),
  };

  return {
    background: {
      default:  bgDefault,
      subtle:   bgSubtle,
      inverse:  bgInverse,
    },
    surface: {
      default: surface,
      raised:  neutral[800],
      glass:   'rgba(30,30,32,0.72)',
    },
    text: {
      primary:   textPrimary,
      secondary: textSecondary,
      tertiary:  textTertiary,
      disabled:  textDisabled,
      inverse:   textInverse,
      onPrimary: textOnPrimary,
    },
    border: {
      default: neutral[700],
      subtle:  neutral[800],
      strong:  findSoftestAccessibleColor(neutral, bgDefault, 3, false),
      focus:   borderFocus,
    },
    action: {
      primary:           actionPrimary,
      primaryHover:      shiftStop(primary, actionPrimary, -1),
      primaryActive:     shiftStop(primary, actionPrimary, -2),
      primaryDisabled:   primary[800],
      secondary:         actionSecondary,
      secondaryHover:    shiftStop(secondary, actionSecondary, -1),
      secondaryActive:   shiftStop(secondary, actionSecondary, -2),
      secondaryDisabled: secondary[800],
    },
    feedback,
  };
}

/** Given a resolved color value, find its stop in the palette and shift by ±n stops */
function shiftStop(palette: ColorStop, resolvedColor: string, delta: number): string {
  const stopOrder = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  const idx = stopOrder.findIndex(s => palette[s] === resolvedColor);
  if (idx === -1) return resolvedColor;
  const newIdx = Math.max(0, Math.min(stopOrder.length - 1, idx + delta));
  return palette[stopOrder[newIdx]];
}

// ─── Extended colors ──────────────────────────────────────────────────────────

const EXTENDED_COLORS: { name: string; baseHue: number; baseSat: number }[] = [
  { name: 'red',    baseHue: 4,   baseSat: 0.86 },
  { name: 'orange', baseHue: 25,  baseSat: 0.90 },
  { name: 'amber',  baseHue: 38,  baseSat: 0.92 },
  { name: 'yellow', baseHue: 48,  baseSat: 0.96 },
  { name: 'lime',   baseHue: 82,  baseSat: 0.77 },
  { name: 'green',  baseHue: 142, baseSat: 0.71 },
  { name: 'teal',   baseHue: 162, baseSat: 0.60 },
  { name: 'cyan',   baseHue: 189, baseSat: 0.73 },
  { name: 'sky',    baseHue: 199, baseSat: 0.89 },
  { name: 'blue',   baseHue: 217, baseSat: 0.91 },
  { name: 'indigo', baseHue: 239, baseSat: 0.84 },
  { name: 'violet', baseHue: 262, baseSat: 0.83 },
  { name: 'purple', baseHue: 271, baseSat: 0.81 },
  { name: 'pink',   baseHue: 330, baseSat: 0.81 },
  { name: 'rose',   baseHue: 347, baseSat: 0.77 },
];

export function generateExtendedColors(primaryColor: string, isDark: boolean): Record<string, ExtendedColor> {
  const primary = chroma(primaryColor);
  const [primaryHue] = primary.hsl();
  const hueShift = (primaryHue % 30) - 15;

  const result: Record<string, ExtendedColor> = {};

  for (const colorDef of EXTENDED_COLORS) {
    const adjustedHue = (colorDef.baseHue + hueShift * 0.1 + 360) % 360;
    const baseColor = chroma.hsl(adjustedHue, colorDef.baseSat, 0.5).hex();
    const palette = generateTonalPalette(baseColor);

    // bg for semantic computations
    const bgForMode = isDark ? palette[950] : palette[50];

    // .default — 3:1 non-text contrast against page background (approximate)
    const defaultColor = isDark
      ? findActionColor(palette, '#1d1d1f', false)
      : findActionColor(palette, '#f2f2f4', true);

    // .subtle — very light/dark tint
    const subtleColor = isDark ? palette[950] : palette[50];

    // .text — AA (4.5:1) against .subtle
    const textColor = isDark
      ? findAccessibleColor(palette, subtleColor, 4.5, false)
      : findAccessibleColor(palette, subtleColor, 4.5, true);

    // .border — visible (3:1) against .subtle
    const borderColor = isDark
      ? findSoftestAccessibleColor(palette, bgForMode, 3, false)
      : findSoftestAccessibleColor(palette, bgForMode, 3, true);

    result[colorDef.name] = {
      name: colorDef.name,
      palette,
      semantic: {
        default: defaultColor,
        subtle:  subtleColor,
        text:    textColor,
        border:  borderColor,
      },
    };
  }

  return result;
}

// ─── Neutral palette ──────────────────────────────────────────────────────────

export function generateNeutralPalette(primaryColor: string): ColorStop {
  const color = chroma(primaryColor);
  const [h] = color.hsl();
  const tintedNeutral = chroma.hsl(h, 0.04, 0.5).hex();
  return generateTonalPalette(tintedNeutral);
}

// ─── Harmonious palette randomiser ───────────────────────────────────────────

export function generateHarmoniousPalette(seed?: string): {
  primary: string;
  secondary: string;
  tertiary: string;
} {
  const baseHue = seed
    ? (parseInt(seed.slice(1), 16) % 360)
    : Math.random() * 360;

  const scheme = Math.random() > 0.5 ? 'split' : 'analogous';

  const secondaryHue = scheme === 'split'
    ? (baseHue + 150) % 360
    : (baseHue + 30) % 360;
  const tertiaryHue = scheme === 'split'
    ? (baseHue + 210) % 360
    : (baseHue + 60) % 360;

  return {
    primary:   chroma.hsl(baseHue,       0.75, 0.50).hex(),
    secondary: chroma.hsl(secondaryHue, 0.65, 0.52).hex(),
    tertiary:  chroma.hsl(tertiaryHue,  0.60, 0.54).hex(),
  };
}
