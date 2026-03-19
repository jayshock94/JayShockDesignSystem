import chroma from 'chroma-js';
import type { ColorStop, ExtendedColor, SemanticColorTokens } from '../types/tokens';

// Generate an 11-stop tonal palette from a base color using HSL manipulation
export function generateTonalPalette(baseColor: string): ColorStop {
  const color = chroma(baseColor);
  const [h, s] = color.hsl();

  const saturation = isNaN(s) ? 0 : s;

  const stops: [number, number, number][] = [
    [50, Math.min(saturation * 0.3, 0.15), 0.97],
    [100, Math.min(saturation * 0.4, 0.25), 0.94],
    [200, Math.min(saturation * 0.5, 0.4), 0.88],
    [300, Math.min(saturation * 0.65, 0.6), 0.78],
    [400, Math.min(saturation * 0.8, 0.75), 0.66],
    [500, saturation, 0.5],
    [600, Math.min(saturation * 1.05, 1), 0.42],
    [700, Math.min(saturation * 1.1, 1), 0.34],
    [800, Math.min(saturation * 1.15, 1), 0.26],
    [900, Math.min(saturation * 1.2, 1), 0.18],
    [950, Math.min(saturation * 1.25, 1), 0.12],
  ];

  const palette: Partial<ColorStop> = {};
  for (const [stop, sat, lightness] of stops) {
    palette[stop as keyof ColorStop] = chroma.hsl(h, sat, lightness).hex();
  }

  return palette as ColorStop;
}

// Calculate relative luminance (WCAG)
function getLuminance(hexColor: string): number {
  const rgb = chroma(hexColor).rgb();
  const [r, g, b] = rgb.map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// WCAG contrast ratio
export function getContrastRatio(color1: string, color2: string): number {
  try {
    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  } catch {
    return 1;
  }
}

export function checkContrast(fg: string, bg: string) {
  const ratio = getContrastRatio(fg, bg);
  return {
    ratio,
    aa: ratio >= 4.5,
    aaa: ratio >= 7,
    aaLarge: ratio >= 3,
    aaaLarge: ratio >= 4.5,
  };
}

// Find a color in a palette that meets minimum contrast against a background
function findContrastingColor(palette: ColorStop, bg: string, minRatio: number = 4.5): string {
  const stops = [900, 800, 950, 700, 100, 200, 50] as const;
  for (const stop of stops) {
    if (getContrastRatio(palette[stop], bg) >= minRatio) {
      return palette[stop];
    }
  }
  return palette[900];
}

// Generate semantic light mode tokens
export function generateSemanticLight(
  primary: ColorStop,
  secondary: ColorStop,
  _tertiary: ColorStop,
  neutral: ColorStop,
): SemanticColorTokens {
  const bg = neutral[50] || '#f2f2f4';
  const surface = '#ffffff';

  return {
    background: {
      default: bg,
      subtle: neutral[100],
      inverse: neutral[900],
    },
    surface: {
      default: surface,
      raised: '#ffffff',
      glass: 'rgba(255,255,255,0.7)',
    },
    text: {
      primary: neutral[900],
      secondary: neutral[600],
      tertiary: neutral[400],
      disabled: neutral[300],
      inverse: '#ffffff',
      onPrimary: findContrastingColor(primary, primary[500]),
    },
    border: {
      default: neutral[200],
      subtle: neutral[100],
      strong: neutral[400],
      focus: primary[500],
    },
    action: {
      primary: primary[500],
      primaryHover: primary[600],
      primaryActive: primary[700],
      primaryDisabled: primary[200],
      secondary: secondary[500],
      secondaryHover: secondary[600],
      secondaryActive: secondary[700],
      secondaryDisabled: secondary[200],
    },
    feedback: {
      success: {
        default: '#30d158',
        subtle: '#e6f9ed',
        text: '#1a7a35',
      },
      warning: {
        default: '#ff9f0a',
        subtle: '#fff3e0',
        text: '#8a5200',
      },
      error: {
        default: '#ff3b30',
        subtle: '#fdecea',
        text: '#8b1a14',
      },
      info: {
        default: '#0a84ff',
        subtle: '#e8f3ff',
        text: '#0048a3',
      },
    },
  };
}

// Generate semantic dark mode tokens
export function generateSemanticDark(
  primary: ColorStop,
  secondary: ColorStop,
  _tertiary: ColorStop,
  neutral: ColorStop,
): SemanticColorTokens {
  const bg = neutral[950] || '#1d1d1f';
  const surface = neutral[900] || '#2c2c2e';

  return {
    background: {
      default: bg,
      subtle: neutral[900],
      inverse: neutral[50],
    },
    surface: {
      default: surface,
      raised: neutral[800],
      glass: 'rgba(30,30,32,0.7)',
    },
    text: {
      primary: '#f5f5f7',
      secondary: neutral[300],
      tertiary: neutral[500],
      disabled: neutral[700],
      inverse: neutral[900],
      onPrimary: findContrastingColor(primary, primary[400]),
    },
    border: {
      default: neutral[700],
      subtle: neutral[800],
      strong: neutral[500],
      focus: primary[400],
    },
    action: {
      primary: primary[400],
      primaryHover: primary[300],
      primaryActive: primary[200],
      primaryDisabled: primary[800],
      secondary: secondary[400],
      secondaryHover: secondary[300],
      secondaryActive: secondary[200],
      secondaryDisabled: secondary[800],
    },
    feedback: {
      success: {
        default: '#32d74b',
        subtle: '#0d3318',
        text: '#4cd964',
      },
      warning: {
        default: '#ffd60a',
        subtle: '#332600',
        text: '#ffcc02',
      },
      error: {
        default: '#ff453a',
        subtle: '#330b0a',
        text: '#ff6961',
      },
      info: {
        default: '#0a84ff',
        subtle: '#001e45',
        text: '#409cff',
      },
    },
  };
}

// Extended color palette definitions with base hues
const EXTENDED_COLORS: { name: string; baseHue: number; baseSat: number }[] = [
  { name: 'red', baseHue: 4, baseSat: 0.86 },
  { name: 'orange', baseHue: 25, baseSat: 0.9 },
  { name: 'amber', baseHue: 38, baseSat: 0.92 },
  { name: 'yellow', baseHue: 48, baseSat: 0.96 },
  { name: 'lime', baseHue: 82, baseSat: 0.77 },
  { name: 'green', baseHue: 142, baseSat: 0.71 },
  { name: 'teal', baseHue: 162, baseSat: 0.6 },
  { name: 'cyan', baseHue: 189, baseSat: 0.73 },
  { name: 'sky', baseHue: 199, baseSat: 0.89 },
  { name: 'blue', baseHue: 217, baseSat: 0.91 },
  { name: 'indigo', baseHue: 239, baseSat: 0.84 },
  { name: 'violet', baseHue: 262, baseSat: 0.83 },
  { name: 'purple', baseHue: 271, baseSat: 0.81 },
  { name: 'pink', baseHue: 330, baseSat: 0.81 },
  { name: 'rose', baseHue: 347, baseSat: 0.77 },
];

// Generate extended color palettes, shifted slightly to harmonize with primary
export function generateExtendedColors(primaryColor: string, isDark: boolean): Record<string, ExtendedColor> {
  const primary = chroma(primaryColor);
  const [primaryHue] = primary.hsl();
  const hueShift = (primaryHue % 30) - 15; // subtle hue harmony shift

  const result: Record<string, ExtendedColor> = {};

  for (const colorDef of EXTENDED_COLORS) {
    const adjustedHue = (colorDef.baseHue + hueShift * 0.1 + 360) % 360;
    const baseColor = chroma.hsl(adjustedHue, colorDef.baseSat, 0.5).hex();
    const palette = generateTonalPalette(baseColor);

    result[colorDef.name] = {
      name: colorDef.name,
      palette,
      semantic: {
        default: isDark ? palette[400] : palette[600],
        subtle: isDark ? palette[950] : palette[50],
        text: isDark ? palette[300] : palette[700],
        border: isDark ? palette[700] : palette[200],
      },
    };
  }

  return result;
}

// Generate neutral palette from a color (desaturated version)
export function generateNeutralPalette(primaryColor: string): ColorStop {
  const color = chroma(primaryColor);
  const [h] = color.hsl();
  // Slightly warm neutral tinted with primary hue
  const tintedNeutral = chroma.hsl(h, 0.04, 0.5).hex();
  return generateTonalPalette(tintedNeutral);
}

// Randomize harmonious palette using color theory
export function generateHarmoniousPalette(seed?: string): {
  primary: string;
  secondary: string;
  tertiary: string;
} {
  const baseHue = seed
    ? (parseInt(seed.slice(1), 16) % 360)
    : Math.random() * 360;

  // Split complementary or analogous
  const scheme = Math.random() > 0.5 ? 'split' : 'analogous';

  let secondaryHue: number;
  let tertiaryHue: number;

  if (scheme === 'split') {
    secondaryHue = (baseHue + 150) % 360;
    tertiaryHue = (baseHue + 210) % 360;
  } else {
    secondaryHue = (baseHue + 30) % 360;
    tertiaryHue = (baseHue + 60) % 360;
  }

  return {
    primary: chroma.hsl(baseHue, 0.75, 0.5).hex(),
    secondary: chroma.hsl(secondaryHue, 0.65, 0.52).hex(),
    tertiary: chroma.hsl(tertiaryHue, 0.6, 0.54).hex(),
  };
}
