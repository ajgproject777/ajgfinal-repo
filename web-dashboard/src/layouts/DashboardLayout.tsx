import React from 'react';
import { Header } from '../components/Header';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <Header />
      <main style={{ flex: 1, padding: '2.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
      <footer style={{
        padding: '1.5rem 2.5rem',
        borderTop: '1px solid var(--border-color)',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
      }}>
        DineGo AI-Powered Smart Travel Dining Assistant &bull; Phase 1 Platform Foundation
      </footer>
    </div>
  );
};
