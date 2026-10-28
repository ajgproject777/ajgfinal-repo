import React from 'react';
import { UtensilsCrossed, ExternalLink } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.25rem 2.5rem',
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'rgba(14, 13, 12, 0.8)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div style={{
          backgroundColor: 'var(--brand-orange)',
          padding: '0.55rem',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(238, 108, 77, 0.3)',
        }}>
          <UtensilsCrossed size={20} color="#FFFFFF" />
        </div>
        <div>
          <span style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Dine<span style={{ color: 'var(--brand-orange)' }}>Go</span>
          </span>
          <span style={{
            marginLeft: '0.5rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '2px 8px',
            borderRadius: '999px',
            backgroundColor: 'rgba(245, 166, 35, 0.15)',
            color: 'var(--brand-gold)',
            border: '1px solid rgba(245, 166, 35, 0.3)',
          }}>
            Partner Portal
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <a
          href="http://localhost:8000/docs"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          API Docs <ExternalLink size={14} />
        </a>
      </div>
    </header>
  );
};
