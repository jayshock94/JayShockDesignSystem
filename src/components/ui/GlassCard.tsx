import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  elevated = false,
  onClick,
  style,
}) => {
  return (
    <div
      className={`
        glass-card rounded-2xl
        ${elevated ? 'shadow-xl' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
};
