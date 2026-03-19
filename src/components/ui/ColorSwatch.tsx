import React, { useState } from 'react';
import { checkContrast } from '../../lib/colorSystem';

interface ColorSwatchProps {
  color: string;
  name: string;
  showContrast?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
  color,
  name,
  showContrast = false,
  size = 'md',
  onClick,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const whiteContrast = showContrast ? checkContrast('#ffffff', color) : null;
  const blackContrast = showContrast ? checkContrast('#000000', color) : null;
  const textColor = whiteContrast && blackContrast
    ? (whiteContrast.ratio >= blackContrast.ratio ? '#ffffff' : '#000000')
    : '#ffffff';

  const sizeClasses = {
    sm: 'h-10 text-xs',
    md: 'h-16 text-xs',
    lg: 'h-20 text-sm',
  };

  return (
    <button
      className={`
        ${sizeClasses[size]} w-full rounded-xl relative group overflow-hidden
        transition-all duration-200 focus-ring
        ${onClick ? 'cursor-pointer' : 'cursor-default'}
      `}
      style={{ backgroundColor: color }}
      onClick={onClick || handleCopy}
      title={`${name}: ${color}`}
    >
      <div className="absolute inset-0 flex flex-col items-start justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/20">
        <span className="font-mono font-medium truncate w-full text-left" style={{ color: textColor, fontSize: '10px' }}>
          {copied ? 'Copied!' : color}
        </span>
        <span className="truncate w-full text-left" style={{ color: textColor, fontSize: '9px', opacity: 0.8 }}>
          {name}
        </span>
      </div>
      {showContrast && whiteContrast && (
        <div className="absolute top-1 right-1 flex gap-1">
          <span
            className={`text-[8px] px-1 py-0.5 rounded font-bold ${whiteContrast.aa ? 'bg-green-500/80' : 'bg-red-500/80'} text-white`}
          >
            AA
          </span>
        </div>
      )}
    </button>
  );
};
