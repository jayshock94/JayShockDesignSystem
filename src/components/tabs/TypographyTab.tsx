import React, { useState } from 'react';
import type { DesignTokens, TypographyToken } from '../../types/tokens';

interface TypographyTabProps {
  tokens: DesignTokens;
  config: { fontFamily: string };
}

const TypeScaleRow: React.FC<{
  name: string;
  token: TypographyToken;
  sample?: string;
  isMobile?: boolean;
}> = ({ name, token, sample, isMobile }) => {
  const mobileScale = 0.85;
  const fontSize = isMobile
    ? `${parseFloat(token.fontSize) * mobileScale}rem`
    : token.fontSize;

  return (
    <div
      className="py-5 border-b"
      style={{ borderColor: 'var(--color-border-subtle)' }}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <code className="text-xs font-mono px-2 py-1 rounded-lg" style={{
          background: 'var(--color-background-subtle)',
          color: 'var(--color-text-secondary)',
        }}>
          {name}
        </code>
        <div className="text-right text-xs space-y-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
          <div className="font-mono">{fontSize} / {token.lineHeight}</div>
          <div className="font-mono">w{token.fontWeight} ls{token.letterSpacing}</div>
        </div>
      </div>
      <p
        style={{
          fontFamily: token.fontFamily,
          fontSize,
          lineHeight: token.lineHeight,
          letterSpacing: token.letterSpacing,
          fontWeight: token.fontWeight,
          color: 'var(--color-text-primary)',
        }}
      >
        {sample || name.includes('display') || name.includes('heading')
          ? 'The quick brown fox'
          : 'The quick brown fox jumps over the lazy dog. Design systems bring clarity and consistency.'}
      </p>
    </div>
  );
};

export const TypographyTab: React.FC<TypographyTabProps> = ({ tokens, config }) => {
  const [isMobile, setIsMobile] = useState(false);
  const { typography } = tokens;

  return (
    <div className="p-6 space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight mb-1" style={{ color: 'var(--color-text-primary)' }}>
            Typography Scale
          </h2>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            1.25 modular scale — {config.fontFamily}
          </p>
        </div>
        <button
          onClick={() => setIsMobile(m => !m)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 focus-ring"
          style={{
            background: isMobile ? 'var(--color-action-primary)' : 'var(--color-background-subtle)',
            color: isMobile ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
          }}
        >
          {isMobile ? '📱 Mobile' : '🖥️ Desktop'}
        </button>
      </div>

      {/* Display */}
      <section>
        <h3 className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Display</h3>
        <p className="text-xs mb-4" style={{ color: 'var(--color-text-tertiary)' }}>Hero headlines, landing pages, massive impact moments</p>
        {Object.entries(typography.display).map(([size, token]) => (
          <TypeScaleRow key={size} name={`type.display.${size}`} token={token} isMobile={isMobile} />
        ))}
      </section>

      {/* Heading */}
      <section>
        <h3 className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Heading</h3>
        <p className="text-xs mb-4" style={{ color: 'var(--color-text-tertiary)' }}>Section titles, card headers, hierarchical content</p>
        {Object.entries(typography.heading).map(([size, token]) => (
          <TypeScaleRow key={size} name={`type.heading.${size}`} token={token} isMobile={isMobile} />
        ))}
      </section>

      {/* Body */}
      <section>
        <h3 className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Body</h3>
        <p className="text-xs mb-4" style={{ color: 'var(--color-text-tertiary)' }}>Paragraphs, descriptions, general readable content</p>
        {Object.entries(typography.body).map(([size, token]) => (
          <TypeScaleRow key={size} name={`type.body.${size}`} token={token} isMobile={isMobile}
            sample="Design systems bring clarity, consistency, and efficiency to product teams. They act as a single source of truth, helping designers and developers work from a shared visual and technical language. Good typography is the foundation of great design — it guides the eye, creates hierarchy, and establishes tone."
          />
        ))}
      </section>

      {/* Label */}
      <section>
        <h3 className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Label</h3>
        <p className="text-xs mb-4" style={{ color: 'var(--color-text-tertiary)' }}>Button text, form labels, navigation items</p>
        {Object.entries(typography.label).map(([size, token]) => (
          <TypeScaleRow key={size} name={`type.label.${size}`} token={token} isMobile={isMobile} />
        ))}
      </section>

      {/* Caption */}
      <section>
        <h3 className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Caption</h3>
        <p className="text-xs mb-4" style={{ color: 'var(--color-text-tertiary)' }}>Metadata, timestamps, fine print</p>
        {Object.entries(typography.caption).map(([size, token]) => (
          <TypeScaleRow key={size} name={`type.caption.${size}`} token={token} isMobile={isMobile} />
        ))}
      </section>

      {/* Paragraph sample */}
      <section
        className="p-6 rounded-2xl"
        style={{ background: 'var(--color-surface-default)', border: '1px solid var(--color-border-subtle)' }}
      >
        <h3 className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--color-text-tertiary)' }}>Readability Sample</h3>
        <h2 style={{
          fontFamily: typography.heading['2xl'].fontFamily,
          fontSize: typography.heading['2xl'].fontSize,
          fontWeight: typography.heading['2xl'].fontWeight,
          lineHeight: typography.heading['2xl'].lineHeight,
          letterSpacing: typography.heading['2xl'].letterSpacing,
          color: 'var(--color-text-primary)',
          marginBottom: '12px',
        }}>
          The Art of Thoughtful Design
        </h2>
        <p style={{
          fontFamily: typography.body.md.fontFamily,
          fontSize: typography.body.md.fontSize,
          fontWeight: typography.body.md.fontWeight,
          lineHeight: typography.body.md.lineHeight,
          color: 'var(--color-text-secondary)',
          maxWidth: '65ch',
        }}>
          Good design is not just how something looks — it is how something works. Every decision, from color to spacing to type, serves a purpose. The best design systems codify these decisions so that every surface in a product feels considered, intentional, and cohesive. Typography is often the first and most powerful signal of quality.
        </p>
        <p style={{
          fontFamily: typography.caption.md.fontFamily,
          fontSize: typography.caption.md.fontSize,
          fontWeight: typography.caption.md.fontWeight,
          lineHeight: typography.caption.md.lineHeight,
          letterSpacing: typography.caption.md.letterSpacing,
          color: 'var(--color-text-tertiary)',
          marginTop: '12px',
        }}>
          Jay Shock Design System — {config.fontFamily}
        </p>
      </section>
    </div>
  );
};
