import React from 'react';
import { CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

interface StatusBadgeProps {
  status: 'connected' | 'disconnected' | 'loading';
  message?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, message }) => {
  const configs = {
    connected: {
      bg: 'rgba(16, 185, 129, 0.1)',
      border: 'rgba(16, 185, 129, 0.25)',
      color: '#10B981',
      icon: <CheckCircle2 size={16} />,
      label: 'FastAPI Backend Online',
    },
    disconnected: {
      bg: 'rgba(239, 68, 68, 0.1)',
      border: 'rgba(239, 68, 68, 0.25)',
      color: '#EF4444',
      icon: <AlertTriangle size={16} />,
      label: 'FastAPI Backend Offline',
    },
    loading: {
      bg: 'rgba(245, 166, 35, 0.1)',
      border: 'rgba(245, 166, 35, 0.25)',
      color: '#F5A623',
      icon: <RefreshCw size={16} style={{ animation: 'spin 1.5s linear infinite' }} />,
      label: 'Connecting to Backend...',
    },
  };

  const current = configs[status];

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.45rem 0.9rem',
      borderRadius: '999px',
      backgroundColor: current.bg,
      border: `1px solid ${current.border}`,
      color: current.color,
      fontSize: '0.82rem',
      fontWeight: 500,
    }}>
      {current.icon}
      <span>{message || current.label}</span>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
