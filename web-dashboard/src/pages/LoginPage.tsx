import React, { useState } from 'react';
import { UtensilsCrossed, Eye, EyeOff, LogIn, AlertCircle, ShieldAlert } from 'lucide-react';
import { DEMO_CREDENTIALS, DEMO_OWNER } from '../data/demoData';
import type { OwnerUser } from '../types';

interface LoginPageProps {
  onLogin: (user: OwnerUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) { setError('Email is required.'); return; }
    if (!password) { setError('Password is required.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email address.'); return; }

    setLoading(true);
    // Simulate brief async validation (demo only)
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);

    if (
      email.trim().toLowerCase() === DEMO_CREDENTIALS.email &&
      password === DEMO_CREDENTIALS.password
    ) {
      onLogin(DEMO_OWNER);
    } else {
      setError('Invalid credentials. Please use the credentials shown below.');
    }
  };

  const fillDemo = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      fontFamily: 'var(--font-family)',
    }}>
      {/* Subtle bg gradient */}
      <div style={{
        position: 'fixed', top: 0, right: 0,
        width: 600, height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(238,108,77,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'var(--brand-orange)',
            width: 56, height: 56, borderRadius: 14,
            boxShadow: '0 8px 24px rgba(238,108,77,0.35)',
            marginBottom: '1rem',
          }}>
            <UtensilsCrossed size={28} color="#FFFFFF" />
          </div>
          <h1 style={{
            fontSize: '1.75rem', fontWeight: 700,
            letterSpacing: '-0.03em', marginBottom: '0.25rem',
          }}>
            Dine<span style={{ color: 'var(--brand-orange)' }}>Go</span>
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Restaurant Partner Portal
          </p>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 16,
          padding: '2rem',
          boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            Sign in to your account
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
            Manage your restaurant's reservations, orders, and menu.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="login-email" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={DEMO_CREDENTIALS.email}
                style={{
                  width: '100%', padding: '0.65rem 0.9rem',
                  borderRadius: 10,
                  border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'var(--border-color)'}`,
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-family)',
                  outline: 'none',
                  transition: 'border-color 0.15s',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--brand-orange)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = error ? 'rgba(239,68,68,0.5)' : 'var(--border-color)'; }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="login-password" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  style={{
                    width: '100%', padding: '0.65rem 2.5rem 0.65rem 0.9rem',
                    borderRadius: 10,
                    border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'var(--border-color)'}`,
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-family)',
                    outline: 'none',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--brand-orange)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = error ? 'rgba(239,68,68,0.5)' : 'var(--border-color)'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                    color: 'var(--text-muted)', display: 'flex',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.6rem 0.9rem', borderRadius: 8,
                backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                color: '#EF4444', fontSize: '0.83rem', marginBottom: '1rem',
              }}>
                <AlertCircle size={14} style={{ flexShrink: 0 }} />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              id="login-submit"
              disabled={loading}
              style={{
                width: '100%', padding: '0.75rem',
                borderRadius: 10,
                backgroundColor: loading ? 'rgba(238,108,77,0.5)' : 'var(--brand-orange)',
                color: '#FFFFFF', fontSize: '0.9rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.15s, transform 0.1s',
                boxShadow: '0 4px 16px rgba(238,108,77,0.3)',
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = '0.9'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              {loading ? (
                <span style={{ display: 'inline-flex', gap: 4 }}>
                  <span style={{ animation: 'dotBounce 1.2s 0s ease-in-out infinite', display: 'inline-block', width: 6, height: 6, borderRadius: '50%', backgroundColor: '#fff' }} />
                  <span style={{ animation: 'dotBounce 1.2s 0.2s ease-in-out infinite', display: 'inline-block', width: 6, height: 6, borderRadius: '50%', backgroundColor: '#fff' }} />
                  <span style={{ animation: 'dotBounce 1.2s 0.4s ease-in-out infinite', display: 'inline-block', width: 6, height: 6, borderRadius: '50%', backgroundColor: '#fff' }} />
                </span>
              ) : (
                <><LogIn size={16} /> Sign In</>
              )}
            </button>
          </form>
        </div>

        {/* Demo credentials card */}
        <div style={{
          marginTop: '1.25rem',
          backgroundColor: 'rgba(245,166,35,0.07)',
          border: '1px solid rgba(245,166,35,0.25)',
          borderRadius: 12, padding: '1rem 1.25rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <ShieldAlert size={15} color="var(--brand-gold)" />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--brand-gold)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Partner Portal Access Credentials
            </span>
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.8 }}>
            <div><span style={{ color: 'var(--text-muted)' }}>Email:</span> {DEMO_CREDENTIALS.email}</div>
            <div><span style={{ color: 'var(--text-muted)' }}>Password:</span> {DEMO_CREDENTIALS.password}</div>
          </div>
          <button
            type="button"
            onClick={fillDemo}
            style={{
              fontSize: '0.8rem', fontWeight: 600, color: 'var(--brand-gold)',
              padding: '0.35rem 0.8rem', borderRadius: 6,
              backgroundColor: 'rgba(245,166,35,0.12)', border: '1px solid rgba(245,166,35,0.3)',
              cursor: 'pointer', transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(245,166,35,0.2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(245,166,35,0.12)'; }}
          >
            Fill demo credentials
          </button>
        </div>
      </div>

      <style>{`
        @keyframes dotBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
};
