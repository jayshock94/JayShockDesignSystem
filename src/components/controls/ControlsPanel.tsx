import React, { useState } from 'react';
import type { ThemeConfig } from '../../types/tokens';
import { GOOGLE_FONTS } from '../../lib/typography';

interface ControlsPanelProps {
  config: ThemeConfig;
  onUpdate: (updates: Partial<ThemeConfig>) => void;
  onRandomize: () => void;
  onReset: () => void;
  onShare: () => void;
}

const FONT_WEIGHTS = [
  { value: 100, label: 'Thin' },
  { value: 200, label: 'ExtraLight' },
  { value: 300, label: 'Light' },
  { value: 400, label: 'Regular' },
  { value: 500, label: 'Medium' },
  { value: 600, label: 'SemiBold' },
  { value: 700, label: 'Bold' },
  { value: 800, label: 'ExtraBold' },
  { value: 900, label: 'Black' },
];

const ColorPicker: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  description?: string;
}> = ({ label, value, onChange, description }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold tracking-wide uppercase" style={{ color: 'var(--color-text-secondary)' }}>
      {label}
    </label>
    {description && (
      <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{description}</p>
    )}
    <div className="flex items-center gap-3">
      <div className="relative">
        <div
          className="w-11 h-11 rounded-xl border-2 cursor-pointer transition-transform duration-150 hover:scale-105"
          style={{ backgroundColor: value, borderColor: 'var(--color-border-default)' }}
        />
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
      </div>
      <input
        type="text"
        value={value}
        onChange={e => {
          const v = e.target.value;
          if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) onChange(v);
        }}
        className="flex-1 px-3 py-2 rounded-xl text-sm font-mono transition-all duration-200 focus-ring"
        style={{
          background: 'var(--color-background-subtle)',
          color: 'var(--color-text-primary)',
          border: '1px solid var(--color-border-default)',
        }}
        placeholder="#000000"
        maxLength={7}
      />
    </div>
  </div>
);

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  config,
  onUpdate,
  onRandomize,
  onReset,
  onShare,
}) => {
  const [showShare, setShowShare] = useState(false);
  const [shareURL, setShareURL] = useState('');

  const handleShare = () => {
    const url = onShare();
    setShareURL(url as unknown as string);
    setShowShare(true);
    navigator.clipboard.writeText(url as unknown as string).catch(() => {});
  };

  return (
    <div
      className="h-full flex flex-col"
      style={{ background: 'var(--color-surface-default)' }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 border-b flex items-center justify-between"
        style={{ borderColor: 'var(--color-border-subtle)' }}
      >
        <div>
          <h2 className="text-sm font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
            Design Controls
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
            Customize your system
          </p>
        </div>
        <button
          onClick={onReset}
          className="text-xs px-2.5 py-1.5 rounded-lg transition-all duration-200 focus-ring hover:opacity-80"
          style={{ background: 'var(--color-background-subtle)', color: 'var(--color-text-secondary)' }}
        >
          Reset
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-8">
        {/* Colors */}
        <section>
          <h3 className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--color-text-tertiary)' }}>
            Colors
          </h3>
          <div className="space-y-5">
            <ColorPicker
              label="Primary"
              value={config.primaryColor}
              onChange={v => onUpdate({ primaryColor: v })}
              description="Main brand color"
            />
            <ColorPicker
              label="Secondary"
              value={config.secondaryColor}
              onChange={v => onUpdate({ secondaryColor: v })}
              description="Accent & success"
            />
            <ColorPicker
              label="Tertiary"
              value={config.tertiaryColor}
              onChange={v => onUpdate({ tertiaryColor: v })}
              description="Info & links"
            />
            <ColorPicker
              label="Neutral"
              value={config.neutralColor || config.primaryColor}
              onChange={v => onUpdate({ neutralColor: v })}
              description="Text & backgrounds"
            />
          </div>
        </section>

        {/* Typography */}
        <section>
          <h3 className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--color-text-tertiary)' }}>
            Typography
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold tracking-wide uppercase mb-1.5 block" style={{ color: 'var(--color-text-secondary)' }}>
                Font Family
              </label>
              <select
                value={config.fontFamily}
                onChange={e => onUpdate({ fontFamily: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-200 focus-ring appearance-none"
                style={{
                  background: 'var(--color-background-subtle)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-border-default)',
                }}
              >
                {GOOGLE_FONTS.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold tracking-wide uppercase mb-1.5 block" style={{ color: 'var(--color-text-secondary)' }}>
                Display Weight
              </label>
              <select
                value={config.displayWeight}
                onChange={e => onUpdate({ displayWeight: Number(e.target.value) })}
                className="w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-200 focus-ring appearance-none"
                style={{
                  background: 'var(--color-background-subtle)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-border-default)',
                }}
              >
                {FONT_WEIGHTS.map(w => (
                  <option key={w.value} value={w.value}>{w.label} ({w.value})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold tracking-wide uppercase mb-1.5 block" style={{ color: 'var(--color-text-secondary)' }}>
                Body Weight
              </label>
              <select
                value={config.bodyWeight}
                onChange={e => onUpdate({ bodyWeight: Number(e.target.value) })}
                className="w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-200 focus-ring appearance-none"
                style={{
                  background: 'var(--color-background-subtle)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-border-default)',
                }}
              >
                {FONT_WEIGHTS.map(w => (
                  <option key={w.value} value={w.value}>{w.label} ({w.value})</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section>
          <h3 className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--color-text-tertiary)' }}>
            Appearance
          </h3>
          <div className="space-y-4">
            {/* Dark mode toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Dark Mode</p>
                <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Toggle light/dark theme</p>
              </div>
              <button
                role="switch"
                aria-checked={config.isDarkMode}
                onClick={() => onUpdate({ isDarkMode: !config.isDarkMode })}
                className={`relative w-12 h-7 rounded-full transition-all duration-300 focus-ring ${config.isDarkMode ? '' : ''}`}
                style={{
                  background: config.isDarkMode ? 'var(--color-action-primary)' : 'var(--color-border-default)',
                }}
              >
                <span
                  className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300"
                  style={{ transform: config.isDarkMode ? 'translateX(20px)' : 'translateX(0)' }}
                />
              </button>
            </div>

            {/* High contrast */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>High Contrast</p>
                <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Boost accessibility</p>
              </div>
              <button
                role="switch"
                aria-checked={config.contrastMode}
                onClick={() => onUpdate({ contrastMode: !config.contrastMode })}
                className="relative w-12 h-7 rounded-full transition-all duration-300 focus-ring"
                style={{
                  background: config.contrastMode ? 'var(--color-action-primary)' : 'var(--color-border-default)',
                }}
              >
                <span
                  className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300"
                  style={{ transform: config.contrastMode ? 'translateX(20px)' : 'translateX(0)' }}
                />
              </button>
            </div>

            {/* Radius personality */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold tracking-wide uppercase" style={{ color: 'var(--color-text-secondary)' }}>
                  Border Radius
                </label>
                <span className="text-xs font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
                  {config.radiusPersonality === 0 ? 'Sharp' : config.radiusPersonality < 40 ? 'Subtle' : config.radiusPersonality < 70 ? 'Rounded' : 'Very Round'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Sharp</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.radiusPersonality}
                  onChange={e => onUpdate({ radiusPersonality: Number(e.target.value) })}
                  className="flex-1 accent-current h-2"
                  style={{ accentColor: 'var(--color-action-primary)' }}
                />
                <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Round</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer Actions */}
      <div
        className="p-4 border-t space-y-2"
        style={{ borderColor: 'var(--color-border-subtle)' }}
      >
        <button
          onClick={onRandomize}
          className="w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 focus-ring hover:opacity-90 active:scale-[0.98]"
          style={{
            background: 'var(--color-action-primary)',
            color: 'var(--color-text-inverse)',
          }}
        >
          🎲 Randomize Palette
        </button>
        <button
          onClick={handleShare}
          className="w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 focus-ring hover:opacity-80"
          style={{
            background: 'var(--color-background-subtle)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border-default)',
          }}
        >
          🔗 Share Theme
        </button>
        {showShare && (
          <div
            className="p-3 rounded-xl text-xs"
            style={{ background: 'var(--color-feedback-success-subtle, #e6f9ed)', color: 'var(--color-feedback-success-text, #1a7a35)' }}
          >
            <p className="font-semibold mb-1">Link copied!</p>
            <p className="font-mono break-all opacity-70 text-[10px]">{shareURL.slice(0, 60)}...</p>
          </div>
        )}
      </div>
    </div>
  );
};
