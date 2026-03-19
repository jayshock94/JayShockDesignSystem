import React from 'react';
import { checkContrast } from '../../lib/colorSystem';

interface ContrastBadgeProps {
  foreground: string;
  background: string;
  compact?: boolean;
}

export const ContrastBadge: React.FC<ContrastBadgeProps> = ({
  foreground,
  background,
  compact = false,
}) => {
  const result = checkContrast(foreground, background);
  const ratio = result.ratio.toFixed(2);

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
            result.aa ? 'bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-red-500/20 text-red-600 dark:text-red-400'
          }`}
        >
          {ratio}:1
        </span>
        <span
          className={`text-[9px] font-bold px-1 py-0.5 rounded ${
            result.aa ? 'bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-red-500/20 text-red-600 dark:text-red-400'
          }`}
        >
          {result.aa ? 'AA ✓' : 'AA ✗'}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
        {ratio}:1
      </span>
      <span
        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          result.aa ? 'bg-green-500/15 text-green-700 dark:text-green-400' : 'bg-red-500/15 text-red-700 dark:text-red-400'
        }`}
      >
        AA {result.aa ? '✓' : '✗'}
      </span>
      <span
        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          result.aaa ? 'bg-green-500/15 text-green-700 dark:text-green-400' : 'bg-orange-500/15 text-orange-700 dark:text-orange-400'
        }`}
      >
        AAA {result.aaa ? '✓' : '✗'}
      </span>
    </div>
  );
};
