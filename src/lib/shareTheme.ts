import type { ThemeConfig } from '../types/tokens';

export function encodeThemeToURL(config: ThemeConfig): string {
  const params = new URLSearchParams({
    p: config.primaryColor.replace('#', ''),
    s: config.secondaryColor.replace('#', ''),
    t: config.tertiaryColor.replace('#', ''),
    n: (config.neutralColor || config.primaryColor).replace('#', ''),
    f: config.fontFamily,
    dw: String(config.displayWeight),
    bw: String(config.bodyWeight),
    dm: config.isDarkMode ? '1' : '0',
    r: String(config.radiusPersonality),
  });
  const url = new URL(window.location.href);
  url.search = params.toString();
  url.hash = '';
  return url.toString();
}

export function decodeThemeFromURL(): Partial<ThemeConfig> | null {
  const params = new URLSearchParams(window.location.search);
  if (!params.has('p')) return null;

  return {
    primaryColor: `#${params.get('p') || '1d1d1f'}`,
    secondaryColor: `#${params.get('s') || '30d158'}`,
    tertiaryColor: `#${params.get('t') || '0a84ff'}`,
    neutralColor: `#${params.get('n') || '1d1d1f'}`,
    fontFamily: params.get('f') || 'Inter',
    displayWeight: parseInt(params.get('dw') || '700'),
    bodyWeight: parseInt(params.get('bw') || '400'),
    isDarkMode: params.get('dm') === '1',
    radiusPersonality: parseInt(params.get('r') || '60'),
  };
}
