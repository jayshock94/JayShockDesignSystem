import type { TypographyTokens, TypographyToken } from '../types/tokens';

const SCALE_RATIO = 1.25; // Major third

function rem(px: number): string {
  return `${(px / 16).toFixed(3)}rem`;
}

function scale(base: number, steps: number): number {
  return Math.round(base * Math.pow(SCALE_RATIO, steps));
}

// Base font size: 16px
const BASE = 16;

export function generateTypographyTokens(fontFamily: string, displayWeight: number, bodyWeight: number): TypographyTokens {
  const ff = `"${fontFamily}", -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif`;

  function makeToken(
    size: number,
    weight: number,
    lineHeight: number,
    letterSpacing: string,
  ): TypographyToken {
    return {
      fontFamily: ff,
      fontSize: rem(size),
      lineHeight: String(lineHeight),
      letterSpacing,
      fontWeight: String(weight),
    };
  }

  return {
    display: {
      lg: makeToken(scale(BASE, 7), displayWeight, 1.05, '-0.03em'),    // ~78px
      md: makeToken(scale(BASE, 6), displayWeight, 1.06, '-0.03em'),    // ~62px
      sm: makeToken(scale(BASE, 5), displayWeight, 1.08, '-0.025em'),   // ~50px
    },
    heading: {
      '2xl': makeToken(scale(BASE, 4), displayWeight, 1.1, '-0.025em'), // ~40px
      xl: makeToken(scale(BASE, 3), displayWeight, 1.15, '-0.02em'),    // ~32px
      lg: makeToken(scale(BASE, 2), displayWeight, 1.2, '-0.02em'),     // ~25px
      md: makeToken(scale(BASE, 1), displayWeight, 1.25, '-0.015em'),   // ~20px
      sm: makeToken(BASE, displayWeight, 1.3, '-0.01em'),               // 16px
      xs: makeToken(scale(BASE, -1), displayWeight, 1.35, '-0.005em'),  // ~13px
    },
    body: {
      lg: makeToken(scale(BASE, 1), bodyWeight, 1.7, '0'),              // ~20px
      md: makeToken(BASE, bodyWeight, 1.65, '0'),                       // 16px
      sm: makeToken(scale(BASE, -1), bodyWeight, 1.6, '0.01em'),        // ~13px
    },
    label: {
      lg: makeToken(scale(BASE, 0), bodyWeight, 1.4, '0.01em'),         // 16px
      md: makeToken(scale(BASE, -1), bodyWeight, 1.4, '0.01em'),        // ~13px
      sm: makeToken(scale(BASE, -2), bodyWeight, 1.4, '0.015em'),       // ~10px
    },
    caption: {
      md: makeToken(scale(BASE, -1), bodyWeight, 1.5, '0.02em'),        // ~13px
      sm: makeToken(scale(BASE, -2), bodyWeight, 1.5, '0.025em'),       // ~10px
    },
  };
}

export const GOOGLE_FONTS = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Oswald',
  'Raleway',
  'Poppins',
  'Nunito',
  'Playfair Display',
  'Merriweather',
  'Source Sans 3',
  'PT Sans',
  'Noto Sans',
  'Ubuntu',
  'Rubik',
  'Work Sans',
  'Quicksand',
  'Josefin Sans',
  'Cabin',
  'Libre Baskerville',
  'Lora',
  'DM Sans',
  'Space Grotesk',
  'Outfit',
  'Plus Jakarta Sans',
  'Sora',
  'Figtree',
  'Geist',
  'Bricolage Grotesque',
];

export function getFontUrl(fontFamily: string): string {
  const encoded = encodeURIComponent(fontFamily);
  return `https://fonts.googleapis.com/css2?family=${encoded}:wght@100;200;300;400;500;600;700;800;900&display=swap`;
}
