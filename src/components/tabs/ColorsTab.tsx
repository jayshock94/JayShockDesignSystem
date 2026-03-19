import React, { useState } from 'react';
import type { DesignTokens } from '../../types/tokens';
import { getSemanticTokens } from '../../lib/tokens';
import { checkContrast } from '../../lib/colorSystem';
import { ContrastBadge } from '../ui/ContrastBadge';

const STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

const PaletteRow: React.FC<{
  name: string;
  palette: Record<string | number, string>;
  expanded?: boolean;
}> = ({ name, palette, expanded = true }) => {
  const [open, setOpen] = useState(expanded);
  const [copied, setCopied] = useState<number | null>(null);

  const copyColor = (stop: number, hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopied(stop);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="mb-2">
      <button
        className="w-full flex items-center justify-between py-2 text-left focus-ring rounded-lg px-1 transition-opacity duration-200 hover:opacity-70"
        onClick={() => setOpen(o => !o)}
      >
        <span className="text-sm font-semibold capitalize" style={{ color: 'var(--color-text-primary)' }}>
          {name}
        </span>
        <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
          {open ? '▲' : '▼'}
        </span>
      </button>
      {open && (
        <div className="grid grid-cols-11 gap-1 mt-1">
          {STOPS.map(stop => {
            const color = palette[stop] as string;
            if (!color) return null;
            const white = checkContrast('#fff', color);
            const black = checkContrast('#000', color);
            const textCol = white.ratio > black.ratio ? '#fff' : '#000';
            return (
              <button
                key={stop}
                className="group relative rounded-lg overflow-hidden transition-transform duration-150 hover:scale-105 focus-ring"
                style={{ aspectRatio: '1', backgroundColor: color }}
                onClick={() => copyColor(stop, color)}
                title={`${stop}: ${color}`}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[8px] font-bold" style={{ color: textCol }}>{stop}</span>
                  <span className="text-[7px] font-mono" style={{ color: textCol }}>
                    {copied === stop ? '✓' : color.slice(1).toUpperCase()}
                  </span>
                </div>
                {stop === 500 && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/50" />
                )}
                {/* AA badge only on hover */}
                <div className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className={`text-[6px] font-bold px-0.5 rounded ${white.aa ? 'text-white' : 'text-black'}`}
                    style={{ background: white.aa ? 'rgba(0,200,0,0.5)' : 'rgba(255,0,0,0.4)' }}>
                    AA
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface ColorsTabProps {
  tokens: DesignTokens;
  isDark: boolean;
}

export const ColorsTab: React.FC<ColorsTabProps> = ({ tokens, isDark }) => {
  const semantic = getSemanticTokens(tokens, isDark);
  const [expandedExtended, setExpandedExtended] = useState<string | null>(null);

  const SemanticRow: React.FC<{ label: string; value: string; onBg?: string }> = ({ label, value, onBg }) => {
    const [c, setC] = useState(false);
    const contrast = onBg ? checkContrast(value, onBg) : null;
    return (
      <div
        className="flex items-center justify-between py-2.5 px-3 rounded-xl transition-colors duration-150 hover:opacity-80 cursor-pointer group"
        style={{ background: 'var(--color-background-subtle)' }}
        onClick={() => { navigator.clipboard.writeText(value); setC(true); setTimeout(() => setC(false), 1500); }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg border" style={{ backgroundColor: value, borderColor: 'var(--color-border-subtle)' }} />
          <div>
            <p className="text-xs font-mono font-medium" style={{ color: 'var(--color-text-primary)' }}>{label}</p>
            <p className="text-[10px] font-mono" style={{ color: 'var(--color-text-tertiary)' }}>{c ? 'Copied!' : value}</p>
          </div>
        </div>
        {contrast && <ContrastBadge foreground={value} background={onBg!} compact />}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-10">
      {/* Primitive Palettes */}
      <section>
        <h2 className="text-lg font-bold tracking-tight mb-1" style={{ color: 'var(--color-text-primary)' }}>
          Primitive Palettes
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          Raw 11-stop tonal palettes generated from your input colors. Click any swatch to copy the hex value.
        </p>
        <PaletteRow name="primary" palette={tokens.colors.primary as unknown as Record<string | number, string>} />
        <PaletteRow name="secondary" palette={tokens.colors.secondary as unknown as Record<string | number, string>} />
        <PaletteRow name="tertiary" palette={tokens.colors.tertiary as unknown as Record<string | number, string>} />
        <PaletteRow name="neutral" palette={tokens.colors.neutral as unknown as Record<string | number, string>} />
      </section>

      {/* Semantic Tokens */}
      <section>
        <h2 className="text-lg font-bold tracking-tight mb-1" style={{ color: 'var(--color-text-primary)' }}>
          Semantic Tokens
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          Purpose-driven color tokens with WCAG contrast ratios.
        </p>

        <div className="space-y-6">
          {/* Background */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--color-text-tertiary)' }}>Background</h3>
            <div className="space-y-2">
              <SemanticRow label="color.background.default" value={semantic.background.default} />
              <SemanticRow label="color.background.subtle" value={semantic.background.subtle} />
              <SemanticRow label="color.background.inverse" value={semantic.background.inverse} />
            </div>
          </div>

          {/* Surface */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--color-text-tertiary)' }}>Surface</h3>
            <div className="space-y-2">
              <SemanticRow label="color.surface.default" value={semantic.surface.default} />
              <SemanticRow label="color.surface.raised" value={semantic.surface.raised} />
              <SemanticRow label="color.surface.glass" value={semantic.surface.glass} />
            </div>
          </div>

          {/* Text */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--color-text-tertiary)' }}>Text</h3>
            <div className="space-y-2">
              <SemanticRow label="color.text.primary" value={semantic.text.primary} onBg={semantic.background.default} />
              <SemanticRow label="color.text.secondary" value={semantic.text.secondary} onBg={semantic.background.default} />
              <SemanticRow label="color.text.tertiary" value={semantic.text.tertiary} onBg={semantic.background.default} />
              <SemanticRow label="color.text.disabled" value={semantic.text.disabled} onBg={semantic.background.default} />
              <SemanticRow label="color.text.inverse" value={semantic.text.inverse} onBg={semantic.background.inverse} />
              <SemanticRow label="color.text.on-primary" value={semantic.text.onPrimary} onBg={semantic.action.primary} />
            </div>
          </div>

          {/* Border */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--color-text-tertiary)' }}>Border</h3>
            <div className="space-y-2">
              <SemanticRow label="color.border.default" value={semantic.border.default} />
              <SemanticRow label="color.border.subtle" value={semantic.border.subtle} />
              <SemanticRow label="color.border.strong" value={semantic.border.strong} />
              <SemanticRow label="color.border.focus" value={semantic.border.focus} />
            </div>
          </div>

          {/* Action */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--color-text-tertiary)' }}>Action</h3>
            <div className="space-y-2">
              <SemanticRow label="color.action.primary" value={semantic.action.primary} />
              <SemanticRow label="color.action.primary.hover" value={semantic.action.primaryHover} />
              <SemanticRow label="color.action.primary.active" value={semantic.action.primaryActive} />
              <SemanticRow label="color.action.primary.disabled" value={semantic.action.primaryDisabled} />
              <SemanticRow label="color.action.secondary" value={semantic.action.secondary} />
            </div>
          </div>

          {/* Feedback */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--color-text-tertiary)' }}>Feedback</h3>
            <div className="space-y-2">
              {(['success', 'warning', 'error', 'info'] as const).map(type => (
                <React.Fragment key={type}>
                  <SemanticRow label={`color.feedback.${type}.default`} value={semantic.feedback[type].default} />
                  <SemanticRow label={`color.feedback.${type}.subtle`} value={semantic.feedback[type].subtle} />
                  <SemanticRow label={`color.feedback.${type}.text`} value={semantic.feedback[type].text} onBg={semantic.feedback[type].subtle} />
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Extended Colors */}
      <section>
        <h2 className="text-lg font-bold tracking-tight mb-1" style={{ color: 'var(--color-text-primary)' }}>
          Extended Palette
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          15 extended colors, each harmonically shifted with your primary hue.
        </p>
        <div className="space-y-1">
          {Object.entries(tokens.colors.extended).map(([name, extColor]) => (
            <div key={name} className="rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center gap-3 py-2 px-3 text-left transition-colors duration-150 focus-ring hover:opacity-80"
                style={{ background: 'var(--color-background-subtle)' }}
                onClick={() => setExpandedExtended(expandedExtended === name ? null : name)}
              >
                <div className="flex gap-0.5">
                  {STOPS.slice(2, 9).map(s => (
                    <div key={s} className="w-4 h-4 rounded-sm" style={{ backgroundColor: extColor.palette[s] }} />
                  ))}
                </div>
                <span className="text-sm font-semibold capitalize flex-1" style={{ color: 'var(--color-text-primary)' }}>
                  {name}
                </span>
                <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                  {expandedExtended === name ? '▲' : '▼'}
                </span>
              </button>
              {expandedExtended === name && (
                <div className="px-3 pb-3 pt-1" style={{ background: 'var(--color-background-subtle)' }}>
                  <div className="grid grid-cols-11 gap-1">
                    {STOPS.map(stop => (
                      <button
                        key={stop}
                        className="rounded-lg transition-transform duration-150 hover:scale-105 focus-ring"
                        style={{ aspectRatio: '1', backgroundColor: extColor.palette[stop] }}
                        title={`${name}.${stop}: ${extColor.palette[stop]}`}
                        onClick={() => navigator.clipboard.writeText(extColor.palette[stop])}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {Object.entries(extColor.semantic).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md border" style={{ backgroundColor: value, borderColor: 'var(--color-border-subtle)' }} />
                        <span className="text-[10px] font-mono" style={{ color: 'var(--color-text-secondary)' }}>
                          .{key}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
