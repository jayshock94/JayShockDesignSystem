import React, { useState } from 'react';

const SECTIONS = [
  {
    id: 'overview',
    title: 'Overview',
    content: (
      <div className="space-y-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          The Jay Shock Design System is a fully algorithmic, token-based design system that generates a complete visual language from just three input colors and a font. Inspired by Apple's visual DNA and Material 3's color intelligence, it produces a coherent, accessible, and beautiful design foundation.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Apple Glass Aesthetic', desc: 'Frosted glass surfaces, generous whitespace, soft shadows, and refined typography.' },
            { title: 'M3 Color Intelligence', desc: 'Algorithmic 11-stop tonal palettes generated from any input color using HSL curves.' },
            { title: 'Three-Tier Architecture', desc: 'Primitives → Semantic → Component tokens. Each layer adds meaning and scope.' },
          ].map(card => (
            <div key={card.title} className="p-4 rounded-2xl" style={{ background: 'var(--color-background-subtle)', border: '1px solid var(--color-border-subtle)' }}>
              <h4 className="text-sm font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>{card.title}</h4>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'colors',
    title: 'Color System',
    content: (
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Tier 1 — Primitive Tokens</h4>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            Raw 11-stop tonal palettes generated algorithmically from input colors using HSL manipulation. Stops are: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950.
          </p>
          <div className="p-4 rounded-xl font-mono text-xs" style={{ background: 'var(--color-background-subtle)', color: 'var(--color-text-secondary)' }}>
            <p>color.primary.50   → lightest tint</p>
            <p>color.primary.500  → base color (your input)</p>
            <p>color.primary.950  → darkest shade</p>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Tier 2 — Semantic Tokens</h4>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            Purpose-driven tokens that reference primitives. These are what you use in components. They automatically adapt between light and dark mode.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
            {[
              ['color.background.default', 'Page background'],
              ['color.surface.glass', 'Frosted glass cards'],
              ['color.text.primary', 'Main readable text'],
              ['color.text.secondary', 'Supporting text'],
              ['color.border.focus', 'Focus rings'],
              ['color.action.primary', 'CTA buttons'],
              ['color.feedback.success.default', 'Success states'],
              ['color.feedback.error.subtle', 'Error backgrounds'],
            ].map(([token, desc]) => (
              <div key={token} className="flex items-start gap-2">
                <code className="px-2 py-1 rounded-lg text-[10px] flex-shrink-0" style={{ background: 'var(--color-background-subtle)', color: 'var(--color-action-primary)' }}>
                  {token}
                </code>
                <span className="text-xs pt-1" style={{ color: 'var(--color-text-tertiary)' }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>WCAG Accessibility</h4>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            Every text-on-background pairing is evaluated against WCAG 2.1. The system warns when any generated pairing fails AA (4.5:1 for normal text, 3:1 for large text). AAA (7:1) is shown as a bonus indicator.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'typography',
    title: 'Typography',
    content: (
      <div className="space-y-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          A 1.25 (Major Third) modular scale generates harmonious type sizes. Display and heading styles use Apple-style tight tracking (-0.02em to -0.03em). Body text uses relaxed line height (1.65–1.7) for readability.
        </p>
        <div>
          <h4 className="text-sm font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Token Structure</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 font-mono text-xs">
            {[
              'type.display.lg', 'type.display.md', 'type.display.sm',
              'type.heading.2xl', 'type.heading.xl', 'type.heading.lg',
              'type.heading.md', 'type.heading.sm', 'type.heading.xs',
              'type.body.lg', 'type.body.md', 'type.body.sm',
              'type.label.lg', 'type.label.md', 'type.label.sm',
              'type.caption.md', 'type.caption.sm',
            ].map(token => (
              <code key={token} className="px-2 py-1 rounded-lg text-[10px]" style={{ background: 'var(--color-background-subtle)', color: 'var(--color-text-secondary)' }}>
                {token}
              </code>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Each token includes</h4>
          <ul className="space-y-2">
            {['fontFamily', 'fontSize (rem)', 'lineHeight', 'letterSpacing', 'fontWeight'].map(prop => (
              <li key={prop} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--color-action-primary)' }} />
                <code className="text-xs" style={{ color: 'var(--color-action-primary)' }}>{prop}</code>
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'spacing',
    title: 'Spacing',
    content: (
      <div className="space-y-6">
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          A 4px base grid with 20 stops. Named aliases (xs through 5xl) provide semantic shortcuts. All spacing is consistent multiples of 4px.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 font-mono text-xs">
          {[
            ['space.1', '4px', 'px'],
            ['space.2', '8px', 'xs'],
            ['space.4', '16px', 'sm'],
            ['space.6', '24px', 'md'],
            ['space.8', '32px', 'lg'],
            ['space.10', '40px', 'xl'],
            ['space.12', '48px', '2xl'],
            ['space.16', '64px', '3xl'],
          ].map(([token, value, alias]) => (
            <div key={token} className="p-2 rounded-lg" style={{ background: 'var(--color-background-subtle)' }}>
              <p className="text-[10px]" style={{ color: 'var(--color-action-primary)' }}>{token}</p>
              <p className="text-[10px]" style={{ color: 'var(--color-text-primary)' }}>{value}</p>
              <p className="text-[9px]" style={{ color: 'var(--color-text-tertiary)' }}>alias: space.{alias}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'components',
    title: 'Components',
    content: (
      <div className="space-y-8">
        {[
          {
            name: 'Button',
            when: 'Trigger an action. Use filled for primary CTA, outlined for secondary, ghost for tertiary.',
            variants: ['filled (primary, secondary)', 'outlined', 'ghost', 'destructive'],
            states: ['default', 'hover', 'focus', 'active', 'disabled'],
            tokens: ['color.action.primary', 'color.text.on-primary', 'color.action.primary.hover', 'radius.lg', 'duration.normal'],
            a11y: 'Always include descriptive text. Disabled buttons should still be focusable with aria-disabled. Minimum 44×44px tap target.',
            code: `<button style={{
  background: tokens.action.primary,
  color: tokens.text.onPrimary,
  borderRadius: tokens.radius.lg,
}}>
  Click me
</button>`,
          },
          {
            name: 'Glass Card',
            when: 'Content containers on rich backgrounds. Ideal for dashboards, overlays, and featured content.',
            variants: ['default glass', 'elevated', 'outlined'],
            states: ['default', 'hover (subtle lift)', 'focus'],
            tokens: ['color.surface.glass', 'color.border.default', 'elevation.glass2', 'radius.2xl'],
            a11y: 'If clickable, use role="button" and keyboard handler. Ensure text contrast meets AA.',
            code: `<div style={{
  background: 'rgba(255,255,255,0.7)',
  backdropFilter: 'blur(20px)',
  borderRadius: tokens.radius['2xl'],
  border: '1px solid rgba(255,255,255,0.2)',
}}>
  {children}
</div>`,
          },
          {
            name: 'Form Input',
            when: 'Collecting user text input. Always pair with a visible label — never use placeholder as the only label.',
            variants: ['default', 'error', 'disabled', 'search (pill)'],
            states: ['default', 'focus', 'error', 'disabled'],
            tokens: ['color.background.subtle', 'color.border.default', 'color.border.focus', 'color.feedback.error.default', 'radius.lg'],
            a11y: 'Use <label> with htmlFor. Error messages must be associated via aria-describedby. Do not rely on color alone.',
            code: `<input
  type="text"
  style={{
    background: tokens.background.subtle,
    border: \`1.5px solid \${focused ? tokens.border.focus : tokens.border.default}\`,
    borderRadius: tokens.radius.lg,
  }}
/>`,
          },
        ].map(comp => (
          <div key={comp.name} className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--color-border-subtle)' }}>
            <div className="px-5 py-4" style={{ background: 'var(--color-background-subtle)' }}>
              <h4 className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>{comp.name}</h4>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--color-text-tertiary)' }}>When to use</p>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{comp.when}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--color-text-tertiary)' }}>Variants</p>
                  <ul className="space-y-1">
                    {comp.variants.map(v => (
                      <li key={v} className="text-xs flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                        <span className="w-1 h-1 rounded-full" style={{ background: 'var(--color-action-primary)' }} />
                        {v}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--color-text-tertiary)' }}>Tokens Used</p>
                  <ul className="space-y-1">
                    {comp.tokens.map(t => (
                      <li key={t} className="text-[10px] font-mono" style={{ color: 'var(--color-action-primary)' }}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--color-text-tertiary)' }}>Accessibility</p>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{comp.a11y}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--color-text-tertiary)' }}>Code</p>
                <pre className="text-[10px] font-mono p-3 rounded-xl overflow-auto" style={{ background: 'var(--color-background-subtle)', color: 'var(--color-text-secondary)' }}>
                  {comp.code}
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
];

export const DocsTab: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="flex h-full min-h-[600px]">
      {/* Sidebar */}
      <div
        className="hidden md:flex flex-col w-48 flex-shrink-0 p-4 border-r"
        style={{ borderColor: 'var(--color-border-subtle)', background: 'var(--color-background-subtle)' }}
      >
        <p className="text-xs font-bold tracking-widest uppercase mb-3 px-2" style={{ color: 'var(--color-text-tertiary)' }}>
          Documentation
        </p>
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className="text-left px-3 py-2 rounded-xl text-sm transition-all duration-200 focus-ring mb-0.5"
            style={{
              color: activeSection === s.id ? 'var(--color-action-primary)' : 'var(--color-text-secondary)',
              background: activeSection === s.id ? 'var(--color-surface-default)' : 'transparent',
              fontWeight: activeSection === s.id ? '600' : '400',
            }}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Mobile section selector */}
      <div className="md:hidden w-full">
        <div className="p-4 border-b" style={{ borderColor: 'var(--color-border-subtle)' }}>
          <select
            value={activeSection}
            onChange={e => setActiveSection(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-sm focus-ring"
            style={{
              background: 'var(--color-background-subtle)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-border-default)',
            }}
          >
            {SECTIONS.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
        {SECTIONS.filter(s => s.id === activeSection).map(s => (
          <div key={s.id}>
            <h2 className="text-xl font-bold tracking-tight mb-2" style={{ color: 'var(--color-text-primary)' }}>
              {s.title}
            </h2>
            <div className="h-px mb-6" style={{ background: 'var(--color-border-subtle)' }} />
            {s.content}
          </div>
        ))}
      </div>
    </div>
  );
};
