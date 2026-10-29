import React, { useState } from 'react';
import {
  User,
  Bell,
  Sliders,
  LogOut,
  Check,
  Smartphone,
  Mail,
  Volume2,
} from 'lucide-react';
import { useDashboard } from '../store/DashboardContext';
import type { OwnerUser } from '../types';

interface SettingsPageProps {
  user: OwnerUser;
  onSignOut: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ user, onSignOut }) => {
  const { state } = useDashboard();
  const [toast, setToast] = useState<string | null>(null);

  // Toggle states
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [audioPings, setAudioPings] = useState(false);
  const [autoAccept, setAutoAccept] = useState(false);
  const [bufferTime, setBufferTime] = useState('15');
  const [proximityRadius, setProximityRadius] = useState('15');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSavePreferences = () => {
    showToast('Preferences saved successfully.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 880 }}>
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: 80,
            right: 24,
            zIndex: 999,
            padding: '0.75rem 1.25rem',
            borderRadius: 10,
            backgroundColor: '#10B981',
            color: '#fff',
            fontSize: '0.85rem',
            fontWeight: 600,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}
        >
          {toast}
        </div>
      )}

      {/* Account Info Card */}
      <div
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 14,
          padding: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          <User size={17} color="var(--brand-orange)" />
          <span>Owner Account Information</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: 'var(--brand-orange)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              fontWeight: 800,
              color: '#fff',
              flexShrink: 0,
            }}
          >
            {user.avatarInitials}
          </div>

          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{user.name}</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              {user.email} · <span style={{ textTransform: 'capitalize' }}>{user.role}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Associated Restaurant: <strong style={{ color: 'var(--text-primary)' }}>{state.profile.name}</strong> ({state.profile.id})
            </div>
          </div>

          <button
            id="settings-signout-btn"
            onClick={onSignOut}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.55rem 1rem',
              borderRadius: 8,
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#EF4444',
              backgroundColor: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.25)',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </div>

      {/* Notification Preferences */}
      <div
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 14,
          padding: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>
          <Bell size={17} color="#7BD0FF" />
          <span>Notification Preferences</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            {
              id: 'notif-email',
              title: 'Email Notifications',
              desc: 'Receive booking confirmations and daily summary reports at your registered email.',
              icon: <Mail size={16} color="var(--brand-orange)" />,
              checked: emailAlerts,
              onChange: setEmailAlerts,
            },
            {
              id: 'notif-sms',
              title: 'Highway Fast-Alert SMS',
              desc: 'Send urgent SMS notifications when a customer is within 15 km of your restaurant.',
              icon: <Smartphone size={16} color="#10B981" />,
              checked: smsAlerts,
              onChange: setSmsAlerts,
            },
            {
              id: 'notif-audio',
              title: 'Kitchen Chime / Sound Alert',
              desc: 'Play a notification chime when a new pre-order arrives on the dashboard.',
              icon: <Volume2 size={16} color="var(--brand-gold)" />,
              checked: audioPings,
              onChange: setAudioPings,
            },
          ].map((item) => (
            <label
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                borderRadius: 10,
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.4rem', borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.03)' }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                    {item.desc}
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={item.checked}
                onChange={(e) => item.onChange(e.target.checked)}
                style={{ accentColor: 'var(--brand-orange)', width: 18, height: 18, cursor: 'pointer' }}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Restaurant Operating Preferences */}
      <div
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 14,
          padding: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>
          <Sliders size={17} color="var(--brand-gold)" />
          <span>Highway Booking Settings</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {/* Buffer Time */}
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '1rem', borderRadius: 10, border: '1px solid var(--border-color)' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Table Buffer Duration
            </label>
            <select
              value={bufferTime}
              onChange={(e) => setBufferTime(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem',
                borderRadius: 8,
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="10">10 minutes before booking</option>
              <option value="15">15 minutes before booking</option>
              <option value="30">30 minutes before booking</option>
            </select>
            <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              Minimum advance notice required for incoming highway travellers.
            </span>
          </div>

          {/* Proximity Radius */}
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '1rem', borderRadius: 10, border: '1px solid var(--border-color)' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Travel Proximity Alert Trigger
            </label>
            <select
              value={proximityRadius}
              onChange={(e) => setProximityRadius(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem',
                borderRadius: 8,
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="10">10 km before arrival</option>
              <option value="15">15 km before arrival</option>
              <option value="25">25 km before arrival</option>
            </select>
            <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              Distance milestone on NH 66 to send kitchen prep alerts.
            </span>
          </div>
        </div>

        {/* Auto Accept */}
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1rem',
            marginTop: '1rem',
            borderRadius: 10,
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            cursor: 'pointer',
          }}
        >
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Auto-Accept Verified Travellers</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              Automatically confirm bookings from verified users when tables are available within operating hours.
            </div>
          </div>
          <input
            type="checkbox"
            checked={autoAccept}
            onChange={(e) => setAutoAccept(e.target.checked)}
            style={{ accentColor: 'var(--brand-orange)', width: 18, height: 18, cursor: 'pointer' }}
          />
        </label>

        <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleSavePreferences}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.55rem 1.25rem',
              borderRadius: 8,
              fontSize: '0.85rem',
              fontWeight: 700,
              backgroundColor: 'var(--brand-orange)',
              color: '#fff',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(238,108,77,0.3)',
            }}
          >
            <Check size={15} /> Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
