import React, { useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { AuthModal } from '../auth/AuthModal';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  primaryColor: string;
  isDark: boolean;
  onToggleDark: () => void;
}

export const Header: React.FC<HeaderProps> = ({ primaryColor, isDark, onToggleDark }) => {
  const { user, signOut } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40 px-4 md:px-6"
        style={{
          background: isDark ? 'rgba(29,29,31,0.8)' : 'rgba(242,242,244,0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--color-border-subtle)',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="flex items-center justify-between w-full max-w-none">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: primaryColor, color: '#fff' }}
            >
              J
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold tracking-tight leading-none" style={{ color: 'var(--color-text-primary)' }}>
                Jay Shock Design System
              </h1>
              <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
                v1.0.0
              </p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-sm font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>JSDS</h1>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              onClick={onToggleDark}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-base transition-all duration-200 focus-ring hover:opacity-70"
              style={{ background: 'var(--color-background-subtle)', color: 'var(--color-text-secondary)' }}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(m => !m)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 focus-ring hover:opacity-80"
                  style={{ background: 'var(--color-background-subtle)', color: 'var(--color-text-secondary)' }}
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                    style={{ background: primaryColor, color: '#fff' }}
                  >
                    {(user.email || 'U')[0].toUpperCase()}
                  </div>
                  <span className="hidden md:inline">{user.email?.split('@')[0]}</span>
                </button>
                {showUserMenu && (
                  <div
                    className="absolute right-0 top-full mt-2 w-40 py-1 rounded-xl overflow-hidden z-50"
                    style={{
                      background: 'var(--color-surface-raised)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                      border: '1px solid var(--color-border-default)',
                    }}
                  >
                    <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--color-border-subtle)' }}>
                      <p className="text-xs truncate" style={{ color: 'var(--color-text-tertiary)' }}>{user.email}</p>
                    </div>
                    <button
                      onClick={() => { signOut(); setShowUserMenu(false); }}
                      className="w-full text-left px-3 py-2 text-sm transition-colors duration-150 focus-ring hover:opacity-70"
                      style={{ color: 'var(--color-feedback-error-default, #ff3b30)' }}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 focus-ring hover:opacity-90"
                style={{
                  background: 'var(--color-action-primary)',
                  color: 'var(--color-text-inverse)',
                }}
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div className="fixed inset-0 z-30" onClick={() => setShowUserMenu(false)} />
      )}
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _unused(_user: User | null) {}
