import React from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  variant?: 'default' | 'bottom' | 'pill';
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default',
}) => {
  if (variant === 'bottom') {
    return (
      <div
        className="flex items-center justify-around px-2 py-1"
        style={{
          background: 'var(--color-surface-glass)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--color-border-subtle)',
        }}
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl min-w-[44px] min-h-[44px] justify-center transition-all duration-200 focus-ring"
            style={{
              color: activeTab === tab.id ? 'var(--color-action-primary)' : 'var(--color-text-tertiary)',
            }}
          >
            {tab.icon && (
              <span className={`text-xl transition-transform duration-200 ${activeTab === tab.id ? 'scale-110' : ''}`}>
                {tab.icon}
              </span>
            )}
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'pill') {
    return (
      <div
        className="flex items-center gap-1 p-1 rounded-2xl"
        style={{ background: 'var(--color-background-subtle)' }}
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 focus-ring min-h-[36px]"
            style={{
              background: activeTab === tab.id ? 'var(--color-surface-default)' : 'transparent',
              color: activeTab === tab.id ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              boxShadow: activeTab === tab.id ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            {tab.icon && <span>{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
    );
  }

  // Default variant
  return (
    <div
      className="flex items-center gap-0 border-b overflow-x-auto scrollbar-thin"
      style={{ borderColor: 'var(--color-border-subtle)' }}
    >
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className="flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap relative transition-colors duration-200 focus-ring min-h-[44px]"
          style={{
            color: activeTab === tab.id ? 'var(--color-action-primary)' : 'var(--color-text-secondary)',
          }}
        >
          {tab.icon && <span>{tab.icon}</span>}
          {tab.label}
          {activeTab === tab.id && (
            <span
              className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
              style={{ background: 'var(--color-action-primary)' }}
            />
          )}
        </button>
      ))}
    </div>
  );
};
