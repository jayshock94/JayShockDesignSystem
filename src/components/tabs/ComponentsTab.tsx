import React, { useState } from 'react';
import type { DesignTokens } from '../../types/tokens';
import { getSemanticTokens } from '../../lib/tokens';

interface ComponentsTabProps {
  tokens: DesignTokens;
  isDark: boolean;
}

export const ComponentsTab: React.FC<ComponentsTabProps> = ({ tokens, isDark }) => {
  const sem = getSemanticTokens(tokens, isDark);
  const r = tokens.radius;
  const [toggleOn, setToggleOn] = useState(true);
  const [progress, _setProgress] = useState(68);
  const [tooltip, setTooltip] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [inputError, setInputError] = useState(false);

  const btnBase = `
    inline-flex items-center justify-center gap-2 font-semibold text-sm
    transition-all duration-200 focus-ring active:scale-[0.97]
    min-h-[44px] px-5 py-2.5
  `;

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
    <div className="p-6 space-y-2">
      <div className="mb-8">
        <h2 className="text-lg font-bold tracking-tight mb-1" style={{ color: 'var(--color-text-primary)' }}>Components</h2>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>All components use live design tokens — they update as you change your palette.</p>
      </div>

      {/* Buttons */}
      <Section title="Buttons" description="All variants and interactive states">
        <div className="space-y-4">
          {/* Row 1: Filled variants */}
          <div className="flex flex-wrap gap-3 items-center">
            <button
              className={btnBase}
              style={{
                background: sem.action.primary,
                color: sem.text.onPrimary,
                borderRadius: r.lg,
              }}
            >
              Primary
            </button>
            <button
              className={btnBase}
              style={{
                background: sem.action.secondary,
                color: '#fff',
                borderRadius: r.lg,
              }}
            >
              Secondary
            </button>
            <button
              className={`${btnBase} opacity-50 cursor-not-allowed`}
              style={{
                background: sem.action.primaryDisabled,
                color: sem.text.disabled,
                borderRadius: r.lg,
              }}
              disabled
            >
              Disabled
            </button>
          </div>

          {/* Row 2: Outlined */}
          <div className="flex flex-wrap gap-3 items-center">
            <button
              className={`${btnBase} hover:opacity-80`}
              style={{
                border: `1.5px solid ${sem.action.primary}`,
                color: sem.action.primary,
                borderRadius: r.lg,
                background: 'transparent',
              }}
            >
              Outlined
            </button>
            <button
              className={`${btnBase} hover:opacity-80`}
              style={{
                border: `1.5px solid ${sem.action.secondary}`,
                color: sem.action.secondary,
                borderRadius: r.lg,
                background: 'transparent',
              }}
            >
              Outlined Secondary
            </button>
          </div>

          {/* Row 3: Ghost + Destructive */}
          <div className="flex flex-wrap gap-3 items-center">
            <button
              className={`${btnBase} hover:opacity-70`}
              style={{
                color: sem.action.primary,
                borderRadius: r.lg,
                background: 'transparent',
              }}
            >
              Ghost
            </button>
            <button
              className={`${btnBase}`}
              style={{
                background: sem.feedback.error.default,
                color: '#fff',
                borderRadius: r.lg,
              }}
            >
              Destructive
            </button>
            <button
              className={`${btnBase}`}
              style={{
                background: sem.feedback.success.default,
                color: '#fff',
                borderRadius: r.lg,
              }}
            >
              Success
            </button>
          </div>

          {/* Small / Large */}
          <div className="flex flex-wrap gap-3 items-center">
            <button
              className="inline-flex items-center gap-1.5 font-semibold text-xs min-h-[32px] px-3 py-1.5 transition-all duration-200 focus-ring active:scale-[0.97]"
              style={{ background: sem.action.primary, color: sem.text.onPrimary, borderRadius: r.md }}
            >
              Small
            </button>
            <button
              className="inline-flex items-center gap-2 font-semibold text-base min-h-[52px] px-7 py-3 transition-all duration-200 focus-ring active:scale-[0.97]"
              style={{ background: sem.action.primary, color: sem.text.onPrimary, borderRadius: r.xl }}
            >
              Large
            </button>
          </div>
        </div>
      </Section>

      {/* Cards */}
      <Section title="Cards" description="Glass, elevated, and outlined variants">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Glass */}
          <div
            className="p-5 rounded-2xl"
            style={{
              background: sem.surface.glass,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            }}
          >
            <div className="w-10 h-10 rounded-xl mb-3" style={{ background: sem.action.primary }} />
            <h4 className="text-sm font-bold mb-1" style={{ color: sem.text.primary }}>Glass Card</h4>
            <p className="text-xs leading-relaxed" style={{ color: sem.text.secondary }}>Frosted glass surface with subtle blur effect</p>
          </div>

          {/* Elevated */}
          <div
            className="p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1"
            style={{
              background: sem.surface.raised,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              border: `1px solid ${sem.border.subtle}`,
            }}
          >
            <div className="w-10 h-10 rounded-xl mb-3" style={{ background: sem.action.secondary }} />
            <h4 className="text-sm font-bold mb-1" style={{ color: sem.text.primary }}>Elevated Card</h4>
            <p className="text-xs leading-relaxed" style={{ color: sem.text.secondary }}>Lifted surface with depth shadow</p>
          </div>

          {/* Outlined */}
          <div
            className="p-5 rounded-2xl"
            style={{
              background: 'transparent',
              border: `1.5px solid ${sem.border.default}`,
            }}
          >
            <div className="w-10 h-10 rounded-xl mb-3" style={{ background: sem.feedback.info.default }} />
            <h4 className="text-sm font-bold mb-1" style={{ color: sem.text.primary }}>Outlined Card</h4>
            <p className="text-xs leading-relaxed" style={{ color: sem.text.secondary }}>Minimal bordered surface</p>
          </div>
        </div>
      </Section>

      {/* Chips */}
      <Section title="Chips & Tags" description="Labels, filters, and dismissible chips">
        <div className="flex flex-wrap gap-2">
          {['Design System', 'Typography', 'Colors', 'Components'].map(label => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 hover:opacity-80"
              style={{ background: sem.background.subtle, color: sem.text.primary, border: `1px solid ${sem.border.default}` }}
            >
              {label}
            </span>
          ))}
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full"
            style={{ background: sem.action.primary, color: sem.text.onPrimary }}
          >
            Selected ✓
          </span>
          <button
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full focus-ring hover:opacity-80"
            style={{ background: sem.background.subtle, color: sem.text.secondary, border: `1px solid ${sem.border.default}` }}
          >
            Dismissible <span className="text-xs opacity-60">×</span>
          </button>
        </div>
      </Section>

      {/* Badges */}
      <Section title="Badges" description="Status indicators for feedback states">
        <div className="flex flex-wrap gap-3">
          {(['success', 'warning', 'error', 'info'] as const).map(type => (
            <React.Fragment key={type}>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full capitalize"
                style={{ background: sem.feedback[type].subtle, color: sem.feedback[type].text }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: sem.feedback[type].default }} />
                {type}
              </span>
            </React.Fragment>
          ))}
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full" style={{ background: sem.feedback.error.default, color: '#fff' }}>
            NEW
          </span>
          <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold rounded-full" style={{ background: sem.action.primary, color: sem.text.onPrimary }}>
            12
          </span>
        </div>
      </Section>

      {/* Form inputs */}
      <Section title="Form Inputs" description="Text fields with labels, states, and validation">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl">
          {/* Default */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold" style={{ color: sem.text.secondary }}>Email address</label>
            <input
              type="email"
              value={inputVal}
              onChange={e => { setInputVal(e.target.value); setInputError(false); }}
              placeholder="you@example.com"
              className="w-full px-4 py-3 text-sm transition-all duration-200 focus-ring"
              style={{
                background: sem.background.subtle,
                color: sem.text.primary,
                border: `1.5px solid ${sem.border.default}`,
                borderRadius: r.lg,
                outline: 'none',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = sem.border.focus; }}
              onBlur={e => { e.currentTarget.style.borderColor = sem.border.default; }}
            />
            <p className="text-xs" style={{ color: sem.text.tertiary }}>We'll never share your email</p>
          </div>

          {/* Error */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold" style={{ color: sem.text.secondary }}>Password</label>
            <input
              type="password"
              value={inputError ? 'wrongpass' : ''}
              readOnly
              placeholder="Enter password"
              className="w-full px-4 py-3 text-sm"
              style={{
                background: sem.feedback.error.subtle,
                color: sem.text.primary,
                border: `1.5px solid ${sem.feedback.error.default}`,
                borderRadius: r.lg,
                outline: 'none',
              }}
              onClick={() => setInputError(true)}
            />
            <p className="text-xs" style={{ color: sem.feedback.error.text }}>Password must be at least 8 characters</p>
          </div>

          {/* Disabled */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold" style={{ color: sem.text.disabled }}>Username (disabled)</label>
            <input
              type="text"
              value="jayshock"
              readOnly
              className="w-full px-4 py-3 text-sm cursor-not-allowed opacity-50"
              style={{
                background: sem.background.subtle,
                color: sem.text.disabled,
                border: `1.5px solid ${sem.border.subtle}`,
                borderRadius: r.lg,
              }}
            />
          </div>

          {/* Search */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold" style={{ color: sem.text.secondary }}>Search</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: sem.text.tertiary }}>🔍</span>
              <input
                type="search"
                placeholder="Search tokens..."
                className="w-full pl-9 pr-4 py-3 text-sm transition-all duration-200"
                style={{
                  background: sem.background.subtle,
                  color: sem.text.primary,
                  border: `1.5px solid ${sem.border.default}`,
                  borderRadius: r.full,
                  outline: 'none',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = sem.border.focus; }}
                onBlur={e => { e.currentTarget.style.borderColor = sem.border.default; }}
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Avatar */}
      <Section title="Avatars" description="User representations with initials and image placeholders">
        <div className="flex items-end gap-4">
          {[
            { size: 32, initials: 'JS', fontSize: '10px' },
            { size: 40, initials: 'JS', fontSize: '12px' },
            { size: 48, initials: 'JS', fontSize: '14px' },
            { size: 56, initials: 'JS', fontSize: '16px' },
            { size: 64, initials: 'JS', fontSize: '18px' },
          ].map(({ size, initials, fontSize }) => (
            <div
              key={size}
              className="rounded-full flex items-center justify-center font-bold flex-shrink-0"
              style={{
                width: size,
                height: size,
                background: sem.action.primary,
                color: sem.text.onPrimary,
                fontSize,
              }}
            >
              {initials}
            </div>
          ))}
          {/* Status indicator */}
          <div className="relative">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm"
              style={{ background: sem.action.secondary, color: '#fff' }}
            >
              JD
            </div>
            <div
              className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2"
              style={{ background: sem.feedback.success.default, borderColor: sem.background.default }}
            />
          </div>
        </div>
      </Section>

      {/* Navigation sample */}
      <Section title="Navigation Bar" description="Frosted glass app bar">
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: `1px solid ${sem.border.subtle}` }}
        >
          <div
            className="px-5 py-3.5 flex items-center justify-between"
            style={{
              background: sem.surface.glass,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderBottom: `1px solid ${sem.border.subtle}`,
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg" style={{ background: sem.action.primary }} />
              <span className="text-sm font-bold tracking-tight" style={{ color: sem.text.primary }}>Jay Shock</span>
            </div>
            <nav className="hidden md:flex items-center gap-1">
              {['Colors', 'Typography', 'Components'].map((item, i) => (
                <span
                  key={item}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors duration-150"
                  style={{
                    background: i === 0 ? sem.background.subtle : 'transparent',
                    color: i === 0 ? sem.text.primary : sem.text.secondary,
                  }}
                >
                  {item}
                </span>
              ))}
            </nav>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: sem.action.primary, color: sem.text.onPrimary }}
            >
              JS
            </div>
          </div>
        </div>
      </Section>

      {/* Modal */}
      <Section title="Modal / Dialog" description="Glass overlay dialog">
        <div
          className="rounded-2xl overflow-hidden max-w-md"
          style={{
            background: sem.surface.glass,
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            border: `1px solid ${sem.border.default}`,
            boxShadow: '0 16px 40px rgba(0,0,0,0.16)',
          }}
        >
          <div className="p-6">
            <h4 className="text-base font-bold mb-2" style={{ color: sem.text.primary }}>Confirm Action</h4>
            <p className="text-sm mb-5" style={{ color: sem.text.secondary }}>
              Are you sure you want to delete this theme? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200"
                style={{ background: sem.background.subtle, color: sem.text.primary, border: `1px solid ${sem.border.default}` }}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200"
                style={{ background: sem.feedback.error.default, color: '#fff' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* Toggle / Switch */}
      <Section title="Toggle & Switch" description="Binary controls">
        <div className="flex flex-wrap gap-6 items-center">
          {/* Main toggle */}
          <div className="flex items-center gap-3">
            <button
              role="switch"
              aria-checked={toggleOn}
              onClick={() => setToggleOn(o => !o)}
              className="relative w-12 h-7 rounded-full transition-all duration-300 focus-ring"
              style={{ background: toggleOn ? sem.action.primary : sem.border.default }}
            >
              <span
                className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300"
                style={{ transform: toggleOn ? 'translateX(20px)' : 'translateX(0)' }}
              />
            </button>
            <span className="text-sm" style={{ color: sem.text.primary }}>{toggleOn ? 'On' : 'Off'}</span>
          </div>

          {/* Small */}
          <div className="flex items-center gap-3">
            <button
              role="switch"
              aria-checked
              className="relative w-9 h-5 rounded-full transition-all duration-300 focus-ring"
              style={{ background: sem.feedback.success.default }}
            >
              <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 translate-x-4" />
            </button>
            <span className="text-xs" style={{ color: sem.text.secondary }}>Small on</span>
          </div>

          {/* Disabled */}
          <div className="flex items-center gap-3 opacity-50">
            <button
              role="switch"
              disabled
              className="relative w-12 h-7 rounded-full cursor-not-allowed"
              style={{ background: sem.border.default }}
            >
              <span className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md" />
            </button>
            <span className="text-sm" style={{ color: sem.text.disabled }}>Disabled</span>
          </div>
        </div>
      </Section>

      {/* Progress bar */}
      <Section title="Progress Bar" description="Determinate and indeterminate states">
        <div className="space-y-4 max-w-md">
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-xs" style={{ color: sem.text.secondary }}>Upload progress</span>
              <span className="text-xs font-mono" style={{ color: sem.text.tertiary }}>{progress}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: sem.background.subtle }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: sem.action.primary }}
              />
            </div>
          </div>
          <div>
            <div className="mb-1.5">
              <span className="text-xs" style={{ color: sem.text.secondary }}>Processing...</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: sem.background.subtle }}>
              <div
                className="h-full rounded-full w-1/3 animate-pulse"
                style={{ background: sem.action.secondary }}
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Tooltip */}
      <Section title="Tooltip" description="Contextual information overlays">
        <div className="relative inline-block">
          <button
            className="px-4 py-2.5 text-sm font-medium rounded-xl focus-ring transition-all duration-200 hover:opacity-80"
            style={{ background: sem.background.subtle, color: sem.text.primary, border: `1px solid ${sem.border.default}` }}
            onMouseEnter={() => setTooltip(true)}
            onMouseLeave={() => setTooltip(false)}
          >
            Hover for tooltip
          </button>
          {tooltip && (
            <div
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-xs font-medium rounded-xl whitespace-nowrap pointer-events-none z-10"
              style={{
                background: sem.background.inverse,
                color: sem.text.inverse,
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              This is a tooltip
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent"
                style={{ borderTopColor: sem.background.inverse }}
              />
            </div>
          )}
        </div>
      </Section>

      {/* Divider */}
      <Section title="Dividers" description="Visual separators">
        <div className="space-y-4 max-w-md">
          <hr style={{ borderColor: sem.border.default }} />
          <div className="flex items-center gap-4">
            <hr className="flex-1" style={{ borderColor: sem.border.default }} />
            <span className="text-xs" style={{ color: sem.text.tertiary }}>or continue with</span>
            <hr className="flex-1" style={{ borderColor: sem.border.default }} />
          </div>
          <hr style={{ borderColor: sem.border.strong, borderWidth: '2px' }} />
        </div>
      </Section>
    </div>
  );
};
