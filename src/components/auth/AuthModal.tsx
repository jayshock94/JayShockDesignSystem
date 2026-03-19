import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const { error: authError } = mode === 'signin'
      ? await signIn(email, password)
      : await signUp(email, password);

    setLoading(false);

    if (authError) {
      setError(authError.message);
    } else if (mode === 'signup') {
      setSuccess('Check your email to confirm your account!');
    } else {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-sm p-8 rounded-3xl"
        style={{
          background: 'var(--color-surface-glass)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          border: '1px solid var(--color-border-default)',
          boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
        }}
      >
        <h2 className="text-xl font-bold tracking-tight mb-1" style={{ color: 'var(--color-text-primary)' }}>
          {mode === 'signin' ? 'Welcome back' : 'Create account'}
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          {mode === 'signin' ? 'Sign in to save and sync your themes' : 'Create an account to save your themes'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 text-sm rounded-xl focus-ring"
              style={{
                background: 'var(--color-background-subtle)',
                color: 'var(--color-text-primary)',
                border: '1.5px solid var(--color-border-default)',
                outline: 'none',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--color-border-focus)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--color-border-default)'; }}
            />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
              className="w-full px-4 py-3 text-sm rounded-xl focus-ring"
              style={{
                background: 'var(--color-background-subtle)',
                color: 'var(--color-text-primary)',
                border: '1.5px solid var(--color-border-default)',
                outline: 'none',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--color-border-focus)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--color-border-default)'; }}
            />
          </div>

          {error && (
            <p className="text-xs px-3 py-2 rounded-xl" style={{ background: 'var(--color-feedback-error-subtle, #fdecea)', color: '#8b1a14' }}>
              {error}
            </p>
          )}
          {success && (
            <p className="text-xs px-3 py-2 rounded-xl" style={{ background: 'var(--color-feedback-success-subtle, #e6f9ed)', color: '#1a7a35' }}>
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-sm font-semibold rounded-xl transition-all duration-200 focus-ring disabled:opacity-50"
            style={{
              background: 'var(--color-action-primary)',
              color: 'var(--color-text-inverse)',
            }}
          >
            {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-xs text-center mt-4" style={{ color: 'var(--color-text-tertiary)' }}>
          {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => { setMode(m => m === 'signin' ? 'signup' : 'signin'); setError(''); setSuccess(''); }}
            className="font-semibold focus-ring rounded"
            style={{ color: 'var(--color-action-primary)' }}
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-sm transition-all duration-200 focus-ring hover:opacity-70"
          style={{ color: 'var(--color-text-tertiary)', background: 'var(--color-background-subtle)' }}
        >
          ×
        </button>
      </div>
    </div>
  );
};
