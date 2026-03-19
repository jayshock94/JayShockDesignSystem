import type { DesignTokens } from '../types/tokens';

// W3C DTCG format
export function exportDTCG(tokens: DesignTokens): string {
  const dtcg: Record<string, unknown> = {};

  // Color tokens
  dtcg['color'] = {};
  const colorGroups = { primary: tokens.colors.primary, secondary: tokens.colors.secondary, tertiary: tokens.colors.tertiary, neutral: tokens.colors.neutral };
  for (const [group, palette] of Object.entries(colorGroups)) {
    (dtcg['color'] as Record<string, unknown>)[group] = {};
    for (const [stop, value] of Object.entries(palette)) {
      ((dtcg['color'] as Record<string, unknown>)[group] as Record<string, unknown>)[stop] = {
        $value: value,
        $type: 'color',
      };
    }
  }

  // Semantic light
  dtcg['semantic-light'] = flattenSemantic(tokens.semanticLight as unknown as Record<string, unknown>);
  dtcg['semantic-dark'] = flattenSemantic(tokens.semanticDark as unknown as Record<string, unknown>);

  // Spacing
  dtcg['spacing'] = {};
  for (const [key, value] of Object.entries(tokens.spacing)) {
    (dtcg['spacing'] as Record<string, unknown>)[key] = { $value: value, $type: 'dimension' };
  }

  // Radius
  dtcg['border-radius'] = {};
  for (const [key, value] of Object.entries(tokens.radius)) {
    (dtcg['border-radius'] as Record<string, unknown>)[key] = { $value: value, $type: 'dimension' };
  }

  return JSON.stringify(dtcg, null, 2);
}

function flattenSemantic(semantic: Record<string, unknown>, prefix = ''): Record<string, unknown> {
  const flat: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(semantic)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') {
      flat[path] = { $value: value, $type: 'color' };
    } else if (typeof value === 'object' && value !== null) {
      Object.assign(flat, flattenSemantic(value as Record<string, unknown>, path));
    }
  }
  return flat;
}

// Token Studio format (Figma plugin)
export function exportTokenStudio(tokens: DesignTokens): string {
  const global: Record<string, unknown> = {};

  const colorGroups = { primary: tokens.colors.primary, secondary: tokens.colors.secondary, tertiary: tokens.colors.tertiary, neutral: tokens.colors.neutral };
  for (const [group, palette] of Object.entries(colorGroups)) {
    global[group] = {};
    for (const [stop, value] of Object.entries(palette)) {
      (global[group] as Record<string, unknown>)[stop] = { value, type: 'color' };
    }
  }

  for (const [key, value] of Object.entries(tokens.spacing)) {
    global[key] = { value, type: 'spacing' };
  }
  for (const [key, value] of Object.entries(tokens.radius)) {
    global[`radius.${key}`] = { value, type: 'borderRadius' };
  }

  return JSON.stringify({ global, $metadata: { tokenSetOrder: ['global'] } }, null, 2);
}

// CSS custom properties
export function exportCSS(tokens: DesignTokens): string {
  const lines: string[] = [':root {'];

  const colorGroups = { primary: tokens.colors.primary, secondary: tokens.colors.secondary, tertiary: tokens.colors.tertiary, neutral: tokens.colors.neutral };
  for (const [group, palette] of Object.entries(colorGroups)) {
    lines.push(`  /* ${group} */`);
    for (const [stop, value] of Object.entries(palette)) {
      lines.push(`  --color-${group}-${stop}: ${value};`);
    }
  }

  lines.push('  /* Semantic Light */');
  writeSemantic(tokens.semanticLight as unknown as Record<string, unknown>, lines, '');

  lines.push('  /* Spacing */');
  for (const [key, value] of Object.entries(tokens.spacing)) {
    lines.push(`  --${key.replace('.', '-')}: ${value};`);
  }

  lines.push('  /* Border Radius */');
  for (const [key, value] of Object.entries(tokens.radius)) {
    lines.push(`  --radius-${key}: ${value};`);
  }

  lines.push('  /* Motion */');
  for (const [key, value] of Object.entries(tokens.motion.duration)) {
    lines.push(`  --duration-${key}: ${value};`);
  }
  for (const [key, value] of Object.entries(tokens.motion.easing)) {
    lines.push(`  --easing-${key}: ${value};`);
  }

  lines.push('}');
  lines.push('');
  lines.push('.dark {');
  lines.push('  /* Semantic Dark */');
  writeSemantic(tokens.semanticDark as unknown as Record<string, unknown>, lines, '');
  lines.push('}');

  return lines.join('\n');
}

function writeSemantic(obj: Record<string, unknown>, lines: string[], prefix: string) {
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}-${key}` : key;
    if (typeof value === 'string') {
      lines.push(`  --color-${path}: ${value};`);
    } else if (typeof value === 'object' && value !== null) {
      writeSemantic(value as Record<string, unknown>, lines, path);
    }
  }
}

// TypeScript tokens object
export function exportTypeScript(tokens: DesignTokens): string {
  const obj = {
    colors: {
      primary: tokens.colors.primary,
      secondary: tokens.colors.secondary,
      tertiary: tokens.colors.tertiary,
      neutral: tokens.colors.neutral,
    },
    semanticLight: tokens.semanticLight,
    semanticDark: tokens.semanticDark,
    spacing: tokens.spacing,
    radius: tokens.radius,
    motion: tokens.motion,
  };
  return `export const tokens = ${JSON.stringify(obj, null, 2)} as const;\n\nexport type Tokens = typeof tokens;\n`;
}

// Figma variables format
export function exportFigmaVariables(tokens: DesignTokens): string {
  const collections: unknown[] = [];

  const colorVars: unknown[] = [];
  const colorGroups = { primary: tokens.colors.primary, secondary: tokens.colors.secondary, tertiary: tokens.colors.tertiary, neutral: tokens.colors.neutral };
  for (const [group, palette] of Object.entries(colorGroups)) {
    for (const [stop, value] of Object.entries(palette)) {
      colorVars.push({
        name: `${group}/${stop}`,
        type: 'COLOR',
        value: hexToFigmaColor(value),
      });
    }
  }

  collections.push({
    name: 'Color Primitives',
    modes: [{ name: 'Value', modeId: 'mode1' }],
    variables: colorVars,
  });

  return JSON.stringify({ version: '0.0.1', collections }, null, 2);
}

function hexToFigmaColor(hex: string): { r: number; g: number; b: number; a: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { r: 0, g: 0, b: 0, a: 1 };
  return {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255,
    a: 1,
  };
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
