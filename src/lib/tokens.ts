import type { DesignTokens, ThemeConfig, SpacingTokens, RadiusTokens, ElevationTokens, MotionTokens } from '../types/tokens';
import {
  generateTonalPalette,
  generateNeutralPalette,
  generateSemanticLight,
  generateSemanticDark,
  generateExtendedColors,
} from './colorSystem';
import { generateTypographyTokens } from './typography';

export function generateSpacingTokens(): SpacingTokens {
  const BASE = 4;
  const stops = Array.from({ length: 20 }, (_, i) => i + 1);
  const aliases: Record<number, string> = {
    1: 'px',
    2: 'xs',
    4: 'sm',
    6: 'md',
    8: 'lg',
    10: 'xl',
    12: '2xl',
    16: '3xl',
    20: '4xl',
  };

  const tokens: SpacingTokens = {};
  for (const stop of stops) {
    tokens[`space.${stop}`] = `${stop * BASE}px`;
    if (aliases[stop]) {
      tokens[`space.${aliases[stop]}`] = `${stop * BASE}px`;
    }
  }
  return tokens;
}

export function generateRadiusTokens(personality: number): RadiusTokens {
  // personality: 0 = sharp, 100 = very round
  const multiplier = personality / 100;
  const base = {
    none: 0,
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    '3xl': 28,
    full: 9999,
  };

  return {
    none: '0px',
    xs: `${Math.round(base.xs * (1 + multiplier * 0.5))}px`,
    sm: `${Math.round(base.sm * (1 + multiplier * 0.5))}px`,
    md: `${Math.round(base.md * (1 + multiplier * 0.75))}px`,
    lg: `${Math.round(base.lg * (1 + multiplier))}px`,
    xl: `${Math.round(base.xl * (1 + multiplier))}px`,
    '2xl': `${Math.round(base['2xl'] * (1 + multiplier * 1.25))}px`,
    '3xl': `${Math.round(base['3xl'] * (1 + multiplier * 1.5))}px`,
    full: '9999px',
  };
}

export function generateElevationTokens(isDark: boolean): ElevationTokens {
  const shadowColor = isDark ? '0,0,0' : '0,0,0';
  return {
    0: { shadow: 'none' },
    1: { shadow: `0 1px 2px rgba(${shadowColor},${isDark ? 0.4 : 0.08}), 0 1px 1px rgba(${shadowColor},${isDark ? 0.3 : 0.04})` },
    2: { shadow: `0 2px 8px rgba(${shadowColor},${isDark ? 0.5 : 0.1}), 0 1px 3px rgba(${shadowColor},${isDark ? 0.3 : 0.06})` },
    3: { shadow: `0 4px 16px rgba(${shadowColor},${isDark ? 0.6 : 0.12}), 0 2px 6px rgba(${shadowColor},${isDark ? 0.4 : 0.08})` },
    4: { shadow: `0 8px 24px rgba(${shadowColor},${isDark ? 0.65 : 0.14}), 0 4px 8px rgba(${shadowColor},${isDark ? 0.4 : 0.08})` },
    5: { shadow: `0 16px 40px rgba(${shadowColor},${isDark ? 0.7 : 0.16}), 0 8px 16px rgba(${shadowColor},${isDark ? 0.4 : 0.08})` },
    glass0: {
      shadow: `0 1px 2px rgba(${shadowColor},0.05)`,
      blur: '4px',
      background: isDark ? 'rgba(30,30,32,0.5)' : 'rgba(255,255,255,0.5)',
    },
    glass1: {
      shadow: `0 2px 8px rgba(${shadowColor},0.1), 0 1px 3px rgba(${shadowColor},0.05)`,
      blur: '12px',
      background: isDark ? 'rgba(30,30,32,0.6)' : 'rgba(255,255,255,0.65)',
    },
    glass2: {
      shadow: `0 4px 16px rgba(${shadowColor},0.12), 0 2px 6px rgba(${shadowColor},0.06)`,
      blur: '20px',
      background: isDark ? 'rgba(30,30,32,0.7)' : 'rgba(255,255,255,0.75)',
    },
    glass3: {
      shadow: `0 8px 32px rgba(${shadowColor},0.15), 0 4px 12px rgba(${shadowColor},0.08)`,
      blur: '32px',
      background: isDark ? 'rgba(30,30,32,0.8)' : 'rgba(255,255,255,0.85)',
    },
  };
}

export function generateMotionTokens(): MotionTokens {
  return {
    duration: {
      instant: '0ms',
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      slower: '700ms',
    },
    easing: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
    },
  };
}

export function generateDesignTokens(config: ThemeConfig): DesignTokens {
  const primary = generateTonalPalette(config.primaryColor);
  const secondary = generateTonalPalette(config.secondaryColor);
  const tertiary = generateTonalPalette(config.tertiaryColor);
  const neutral = generateNeutralPalette(config.neutralColor || config.primaryColor);

  return {
    colors: {
      primary,
      secondary,
      tertiary,
      neutral,
      extended: generateExtendedColors(config.primaryColor, config.isDarkMode),
    },
    semanticLight: generateSemanticLight(primary, secondary, tertiary, neutral),
    semanticDark: generateSemanticDark(primary, secondary, tertiary, neutral),
    typography: generateTypographyTokens(config.fontFamily, config.displayWeight, config.bodyWeight),
    spacing: generateSpacingTokens(),
    radius: generateRadiusTokens(config.radiusPersonality),
    elevation: generateElevationTokens(config.isDarkMode),
    motion: generateMotionTokens(),
  };
}

export function getSemanticTokens(tokens: DesignTokens, isDark: boolean) {
  return isDark ? tokens.semanticDark : tokens.semanticLight;
}

// Apply tokens as CSS custom properties to the document root
export function applyTokensToDOM(tokens: DesignTokens, isDark: boolean) {
  const root = document.documentElement;
  const semantic = getSemanticTokens(tokens, isDark);

  // Apply color palettes
  const palettes = ['primary', 'secondary', 'tertiary', 'neutral'] as const;
  for (const palette of palettes) {
    const stops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
    for (const stop of stops) {
      root.style.setProperty(`--color-${palette}-${stop}`, tokens.colors[palette][stop]);
    }
  }

  // Apply semantic tokens
  root.style.setProperty('--color-background-default', semantic.background.default);
  root.style.setProperty('--color-background-subtle', semantic.background.subtle);
  root.style.setProperty('--color-background-inverse', semantic.background.inverse);
  root.style.setProperty('--color-surface-default', semantic.surface.default);
  root.style.setProperty('--color-surface-raised', semantic.surface.raised);
  root.style.setProperty('--color-surface-glass', semantic.surface.glass);
  root.style.setProperty('--color-text-primary', semantic.text.primary);
  root.style.setProperty('--color-text-secondary', semantic.text.secondary);
  root.style.setProperty('--color-text-tertiary', semantic.text.tertiary);
  root.style.setProperty('--color-text-disabled', semantic.text.disabled);
  root.style.setProperty('--color-text-inverse', semantic.text.inverse);
  root.style.setProperty('--color-text-on-primary', semantic.text.onPrimary);
  root.style.setProperty('--color-border-default', semantic.border.default);
  root.style.setProperty('--color-border-subtle', semantic.border.subtle);
  root.style.setProperty('--color-border-strong', semantic.border.strong);
  root.style.setProperty('--color-border-focus', semantic.border.focus);
  root.style.setProperty('--color-action-primary', semantic.action.primary);
  root.style.setProperty('--color-action-primary-hover', semantic.action.primaryHover);
  root.style.setProperty('--color-action-primary-active', semantic.action.primaryActive);
  root.style.setProperty('--color-action-primary-disabled', semantic.action.primaryDisabled);
  root.style.setProperty('--color-action-secondary', semantic.action.secondary);

  // Radius
  const radiusKeys = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'] as const;
  for (const key of radiusKeys) {
    root.style.setProperty(`--radius-${key}`, tokens.radius[key]);
  }

  // Motion
  const durationKeys = ['instant', 'fast', 'normal', 'slow', 'slower'] as const;
  for (const key of durationKeys) {
    root.style.setProperty(`--duration-${key}`, tokens.motion.duration[key]);
  }

  // Toggle dark class
  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}
