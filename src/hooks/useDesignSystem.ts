import { useState, useEffect, useMemo, useCallback } from 'react';
import type { ThemeConfig, DesignTokens } from '../types/tokens';
import { generateDesignTokens, applyTokensToDOM } from '../lib/tokens';
import { generateHarmoniousPalette } from '../lib/colorSystem';
import { decodeThemeFromURL, encodeThemeToURL } from '../lib/shareTheme';
import { getFontUrl } from '../lib/typography';

const DEFAULT_CONFIG: ThemeConfig = {
  primaryColor: '#1d1d1f',
  secondaryColor: '#30d158',
  tertiaryColor: '#0a84ff',
  neutralColor: '#1d1d1f',
  fontFamily: 'Inter',
  displayWeight: 700,
  bodyWeight: 400,
  isDarkMode: false,
  radiusPersonality: 60,
  contrastMode: false,
};

function loadFromLocalStorage(): Partial<ThemeConfig> {
  try {
    const saved = localStorage.getItem('jay-shock-theme');
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return {};
}

export function useDesignSystem() {
  const [config, setConfig] = useState<ThemeConfig>(() => {
    const fromURL = decodeThemeFromURL();
    const fromStorage = loadFromLocalStorage();
    return { ...DEFAULT_CONFIG, ...fromStorage, ...(fromURL || {}) };
  });

  const tokens = useMemo<DesignTokens>(() => generateDesignTokens(config), [config]);

  // Load Google Font
  useEffect(() => {
    const fontUrl = getFontUrl(config.fontFamily);
    const id = `gfont-${config.fontFamily.replace(/\s/g, '-')}`;
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = fontUrl;
      document.head.appendChild(link);
    }
  }, [config.fontFamily]);

  // Apply tokens to DOM
  useEffect(() => {
    applyTokensToDOM(tokens, config.isDarkMode);
  }, [tokens, config.isDarkMode]);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('jay-shock-theme', JSON.stringify(config));
    } catch { /* ignore */ }
  }, [config]);

  const updateConfig = useCallback((updates: Partial<ThemeConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const randomize = useCallback(() => {
    const palette = generateHarmoniousPalette();
    setConfig(prev => ({
      ...prev,
      primaryColor: palette.primary,
      secondaryColor: palette.secondary,
      tertiaryColor: palette.tertiary,
      neutralColor: palette.primary,
    }));
  }, []);

  const getShareURL = useCallback(() => {
    return encodeThemeToURL(config);
  }, [config]);

  const reset = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
  }, []);

  return {
    config,
    tokens,
    updateConfig,
    randomize,
    getShareURL,
    reset,
  };
}
