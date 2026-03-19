import React, { useState } from 'react';
import type { DesignTokens } from '../../types/tokens';
import { getSemanticTokens } from '../../lib/tokens';

interface FoundationsTabProps {
  tokens: DesignTokens;
  isDark: boolean;
}

export const FoundationsTab: React.FC<FoundationsTabProps> = ({ tokens, isDark }) => {
  const sem = getSemanticTokens(tokens, isDark);
  const [animating, setAnimating] = useState<string | null>(null);

  const triggerAnimation = (key: string) => {
    setAnimating(key);
    setTimeout(() => setAnimating(null), 800);
  };

  const Section: React.FC<{ title: string; description?: string; children: React.ReactNode }> = ({ title, description, children }) => (
    <section className="mb-12">
      <div className="mb-5">
        <h3 className="text-base font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>{title}</h3>
        {description && <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>{description}</p>}
      </div>
      {children}
    </section>
  );

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-lg font-bold tracking-tight mb-1" style={{ color: 'var(--color-text-primary)' }}>Foundations</h2>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>The core building blocks — spacing, radius, elevation, and motion.</p>
      </div>

      {/* Spacing */}
      <Section title="Spacing Scale" description="4px base unit — stops 1 through 20">
        <div className="space-y-2">
          {Array.from({ length: 20 }, (_, i) => i + 1).map(stop => {
            const px = stop * 4;
            return (
              <div key={stop} className="flex items-center gap-4">
                <span className="text-xs font-mono w-16 text-right" style={{ color: 'var(--color-text-tertiary)' }}>
                  space.{stop}
                </span>
                <div
                  className="rounded-sm flex-shrink-0"
                  style={{
                    width: Math.min(px, 200),
                    height: 12,
                    background: sem.action.primary,
                    opacity: 0.7 + (stop / 40),
                  }}
                />
                <span className="text-xs font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
                  {px}px
                </span>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Border Radius */}
      <Section title="Border Radius Scale" description="From sharp to fully round">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(tokens.radius).map(([key, value]) => (
            <div key={key} className="flex flex-col items-start gap-2">
              <div
                className="w-20 h-20 transition-all duration-300"
                style={{
                  background: sem.action.primary,
                  borderRadius: value === '9999px' ? '50%' : value,
                  opacity: 0.8,
                }}
              />
              <div>
                <p className="text-xs font-semibold" style={{ color: 'var(--color-text-primary)' }}>radius.{key}</p>
                <p className="text-xs font-mono" style={{ color: 'var(--color-text-tertiary)' }}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Elevation */}
      <Section title="Elevation Scale" description="Six levels of depth — solid shadows">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[0, 1, 2, 3, 4, 5].map(level => {
            const elevation = tokens.elevation[level as keyof typeof tokens.elevation];
            return (
              <div
                key={level}
                className="p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: sem.surface.default,
                  boxShadow: (elevation as { shadow: string }).shadow,
                  border: `1px solid ${sem.border.subtle}`,
                }}
              >
                <p className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>Level {level}</p>
                <p className="text-xs mt-1 font-mono break-all" style={{ color: 'var(--color-text-tertiary)' }}>
                  elevation.{level}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Glass Elevation */}
      <Section title="Glass Elevation" description="Frosted glass with progressive blur">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map(level => {
            const glassKey = `glass${level}` as keyof typeof tokens.elevation;
            const elevation = tokens.elevation[glassKey] as { shadow: string; blur?: string; background?: string };
            return (
              <div
                key={level}
                className="p-5 rounded-2xl"
                style={{
                  background: elevation.background || sem.surface.glass,
                  backdropFilter: `blur(${elevation.blur || '4px'})`,
                  WebkitBackdropFilter: `blur(${elevation.blur || '4px'})`,
                  boxShadow: elevation.shadow,
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.25)'}`,
                }}
              >
                <p className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>Glass {level}</p>
                <p className="text-xs mt-1 font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
                  blur: {elevation.blur || '4px'}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Motion */}
      <Section title="Motion Scale" description="Click any token to preview — durations and easing curves">
        <div className="space-y-8">
          {/* Durations */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--color-text-tertiary)' }}>Durations</h4>
            <div className="flex flex-wrap gap-4">
              {Object.entries(tokens.motion.duration).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => triggerAnimation(`dur-${key}`)}
                  className="flex flex-col items-center gap-2 focus-ring"
                >
                  <div
                    className="w-12 h-12 rounded-xl"
                    style={{
                      background: sem.action.primary,
                      transition: `transform ${value} cubic-bezier(0.4,0,0.2,1)`,
                      transform: animating === `dur-${key}` ? 'scale(1.3) rotate(12deg)' : 'scale(1) rotate(0)',
                    }}
                  />
                  <div className="text-center">
                    <p className="text-xs font-semibold" style={{ color: 'var(--color-text-primary)' }}>duration.{key}</p>
                    <p className="text-[10px] font-mono" style={{ color: 'var(--color-text-tertiary)' }}>{value}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Easing */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--color-text-tertiary)' }}>Easing Curves</h4>
            <div className="flex flex-wrap gap-4">
              {Object.entries(tokens.motion.easing).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => triggerAnimation(`ease-${key}`)}
                  className="flex flex-col items-center gap-2 focus-ring"
                >
                  <div
                    className="w-12 h-12 rounded-xl"
                    style={{
                      background: sem.action.secondary,
                      transition: `transform 600ms ${value}`,
                      transform: animating === `ease-${key}` ? 'translateX(24px) scale(1.1)' : 'translateX(0) scale(1)',
                    }}
                  />
                  <div className="text-center">
                    <p className="text-xs font-semibold" style={{ color: 'var(--color-text-primary)' }}>easing.{key}</p>
                    <p className="text-[10px] font-mono max-w-[100px] truncate" style={{ color: 'var(--color-text-tertiary)' }}>{value}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};
