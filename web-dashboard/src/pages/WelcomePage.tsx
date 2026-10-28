import React from 'react';
import { useHealth } from '../hooks/useHealth';
import { StatusBadge } from '../components/StatusBadge';
import {
  Smartphone,
  Server,
  Database,
  Building2,
  ShieldCheck,
  RefreshCw,
  Layers,
} from 'lucide-react';

export const WelcomePage: React.FC = () => {
  const { health, loading, error, refetch } = useHealth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Hero Welcome Card */}
      <section style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '16px',
        border: '1px solid var(--border-color)',
        padding: '3rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)',
      }}>
        {/* Subtle accent glow */}
        <div style={{
          position: 'absolute',
          top: '-120px',
          right: '-120px',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(238, 108, 77, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '780px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <StatusBadge
              status={loading ? 'loading' : health ? 'connected' : 'disconnected'}
              message={
                loading
                  ? 'Pinging API...'
                  : health
                  ? `FastAPI Backend Online (v${health.version})`
                  : error || 'FastAPI Offline'
              }
            />
            <button
              onClick={refetch}
              title="Test backend connection"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.8rem',
                borderRadius: '999px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <RefreshCw size={13} /> Refresh
            </button>
          </div>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: '-0.03em',
            marginBottom: '1rem',
          }}>
            Smart Travel Dining Partner Portal
          </h1>
          <p style={{
            fontSize: '1.05rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            marginBottom: '2rem',
          }}>
            Welcome to the DineGo management portal foundation. Built for high-speed highway restaurant partners, parking coordinators, and platform administrators to serve en-route travellers seamlessly.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--brand-orange)',
                color: '#FFFFFF',
                padding: '0.75rem 1.4rem',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.9rem',
                boxShadow: '0 4px 18px rgba(238, 108, 77, 0.35)',
                transition: 'transform 0.15s, opacity 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.92')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1.0')}
            >
              <Server size={16} /> Explore Backend OpenAPI Specs
            </a>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              padding: '0.75rem 1.4rem',
              borderRadius: '10px',
              fontSize: '0.9rem',
            }}>
              <Layers size={16} /> Phase 1 Foundation
            </div>
          </div>
        </div>
      </section>

      {/* System Architecture Grid */}
      <section>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>
          Platform Architecture Components
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
        }}>
          {/* Card 1: Customer Mobile App */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '1.5rem',
            transition: 'border-color 0.2s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: 'rgba(41, 182, 246, 0.15)', color: 'var(--brand-accent)' }}>
                <Smartphone size={20} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Customer Mobile App</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              React Native & Expo cross-platform mobile client with Expo Router, auth screens, and traveller route dining views.
            </p>
          </div>

          {/* Card 2: FastAPI Backend */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '1.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: 'rgba(238, 108, 77, 0.15)', color: 'var(--brand-orange)' }}>
                <Server size={20} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>FastAPI Backend</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              High-performance asynchronous Python API with versioned <code>/api/v1</code> routing, centralized exceptions, and CORS control.
            </p>
          </div>

          {/* Card 3: PostgreSQL Database */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '1.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: 'rgba(245, 166, 35, 0.15)', color: 'var(--brand-gold)' }}>
                <Database size={20} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>PostgreSQL & Alembic</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Enterprise relational database with SQLAlchemy 2.0 ORM, strict AsyncPG driver integration, and safe migration configuration.
            </p>
          </div>

          {/* Card 4: Web Dashboard */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '1.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
                <Building2 size={20} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Partner & Admin Web</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              React + Vite + TypeScript web application designed for restaurant managers and platform operations.
            </p>
          </div>
        </div>
      </section>

      {/* Planned Future Modules Overview (Clearly marked as Planned) */}
      <section style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '14px',
        border: '1px solid var(--border-color)',
        padding: '2rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <ShieldCheck size={20} color="var(--brand-gold)" />
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Upcoming Phase Capabilities (Roadmap)</h2>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          In accordance with Phase 1 scope constraints, core business workflows remain in architectural readiness and will activate in subsequent phases:
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
        }}>
          <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              Phase 2: Route Dining & AI
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              Google Maps route polyline integration, off-route detour minimization, and personalized AI meal recommendation engine.
            </p>
          </div>
          <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              Phase 3: Real-Time Bookings
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              Pre-order scheduling, table reservation slots, payment gateway integration, and automated ETA tracking.
            </p>
          </div>
          <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              Phase 4: Partner Portals
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              Full restaurant owner dashboard for menu updates, slot allocation, parking coordinator security validation, and admin verification.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
