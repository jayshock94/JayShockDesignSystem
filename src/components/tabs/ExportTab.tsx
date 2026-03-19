import React, { useState } from 'react';
import type { DesignTokens } from '../../types/tokens';
import {
  exportDTCG,
  exportTokenStudio,
  exportCSS,
  exportTypeScript,
  exportFigmaVariables,
  downloadFile,
} from '../../lib/export';

interface ExportTabProps {
  tokens: DesignTokens;
}

const EXPORT_OPTIONS = [
  {
    id: 'dtcg',
    label: 'W3C DTCG',
    description: 'Design Token Community Group format — industry standard token JSON',
    filename: 'tokens.json',
    mime: 'application/json',
    icon: '📐',
    fn: (t: DesignTokens) => exportDTCG(t),
  },
  {
    id: 'token-studio',
    label: 'Token Studio',
    description: 'Compatible with the Token Studio Figma plugin',
    filename: 'tokens-studio.json',
    mime: 'application/json',
    icon: '🎨',
    fn: (t: DesignTokens) => exportTokenStudio(t),
  },
  {
    id: 'figma',
    label: 'Figma Variables',
    description: 'Import directly into Figma as local variables',
    filename: 'figma-variables.json',
    mime: 'application/json',
    icon: '✦',
    fn: (t: DesignTokens) => exportFigmaVariables(t),
  },
  {
    id: 'css',
    label: 'CSS Custom Properties',
    description: 'Ready-to-use CSS variables for light and dark mode',
    filename: 'tokens.css',
    mime: 'text/css',
    icon: '🎯',
    fn: (t: DesignTokens) => exportCSS(t),
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    description: 'Fully typed tokens object for use in React, Next.js, etc.',
    filename: 'tokens.ts',
    mime: 'text/typescript',
    icon: '⚡',
    fn: (t: DesignTokens) => exportTypeScript(t),
  },
];

export const ExportTab: React.FC<ExportTabProps> = ({ tokens }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [previewLabel, setPreviewLabel] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const handlePreview = (option: typeof EXPORT_OPTIONS[0]) => {
    setPreview(option.fn(tokens));
    setPreviewLabel(option.label);
  };

  const handleDownload = (option: typeof EXPORT_OPTIONS[0]) => {
    downloadFile(option.fn(tokens), option.filename, option.mime);
  };

  const handleCopy = async (option: typeof EXPORT_OPTIONS[0]) => {
    await navigator.clipboard.writeText(option.fn(tokens));
    setCopied(option.id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-lg font-bold tracking-tight mb-1" style={{ color: 'var(--color-text-primary)' }}>
          Export
        </h2>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Download your design tokens in any format. All exports include both light and dark mode values.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-8">
        {EXPORT_OPTIONS.map(option => (
          <div
            key={option.id}
            className="p-5 rounded-2xl"
            style={{
              background: 'var(--color-surface-default)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <span className="text-2xl">{option.icon}</span>
                <div>
                  <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                    {option.label}
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    {option.description}
                  </p>
                  <p className="text-xs font-mono mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
                    {option.filename}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handlePreview(option)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 focus-ring hover:opacity-80"
                  style={{
                    background: 'var(--color-background-subtle)',
                    color: 'var(--color-text-secondary)',
                    border: '1px solid var(--color-border-default)',
                  }}
                >
                  Preview
                </button>
                <button
                  onClick={() => handleCopy(option)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 focus-ring hover:opacity-80"
                  style={{
                    background: 'var(--color-background-subtle)',
                    color: 'var(--color-text-secondary)',
                    border: '1px solid var(--color-border-default)',
                  }}
                >
                  {copied === option.id ? '✓ Copied' : 'Copy'}
                </button>
                <button
                  onClick={() => handleDownload(option)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 focus-ring hover:opacity-90"
                  style={{
                    background: 'var(--color-action-primary)',
                    color: 'var(--color-text-inverse)',
                  }}
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview panel */}
      {preview && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid var(--color-border-subtle)' }}
        >
          <div
            className="px-5 py-3 flex items-center justify-between"
            style={{
              background: 'var(--color-background-subtle)',
              borderBottom: '1px solid var(--color-border-subtle)',
            }}
          >
            <span className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
              Preview — {previewLabel}
            </span>
            <button
              onClick={() => setPreview(null)}
              className="text-xs px-2 py-1 rounded-lg focus-ring hover:opacity-70"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              Close
            </button>
          </div>
          <pre
            className="p-5 text-xs font-mono overflow-auto max-h-96 scrollbar-thin leading-relaxed"
            style={{
              background: 'var(--color-surface-default)',
              color: 'var(--color-text-secondary)',
            }}
          >
            {preview.slice(0, 3000)}{preview.length > 3000 ? '\n\n// ... truncated for preview' : ''}
          </pre>
        </div>
      )}
    </div>
  );
};
