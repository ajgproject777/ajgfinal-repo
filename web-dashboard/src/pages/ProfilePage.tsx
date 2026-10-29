import React, { useState } from 'react';
import {
  Store,
  MapPin,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Edit3,
  Power,
  Utensils,
  AlertCircle,
} from 'lucide-react';
import { useDashboard } from '../store/DashboardContext';
import { Modal } from '../components/Modal';
import type { RestaurantProfile } from '../types';

export const ProfilePage: React.FC = () => {
  const { state, updateProfile, setRestaurantOpen } = useDashboard();
  const { profile } = state;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formState, setFormState] = useState<RestaurantProfile>(profile);
  const [formError, setFormError] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenEdit = () => {
    setFormState(profile);
    setFormError('');
    setIsEditModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim()) {
      setFormError('Restaurant name cannot be empty.');
      return;
    }
    if (!formState.ownerName.trim()) {
      setFormError('Owner name cannot be empty.');
      return;
    }
    if (!formState.phone.trim()) {
      setFormError('Contact telephone is required.');
      return;
    }

    updateProfile(formState);
    setIsEditModalOpen(false);
    showToast('Restaurant profile successfully updated.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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

      {/* Top Banner Card */}
      <div
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 16,
          padding: '1.75rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle orange accent glow */}
        <div
          style={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 180,
            height: 180,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(238,108,77,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 14,
                backgroundColor: 'rgba(238,108,77,0.12)',
                border: '1px solid rgba(238,108,77,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-orange)',
                flexShrink: 0,
              }}
            >
              <Store size={32} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                  {profile.name}
                </h2>
                {/* Verification badge */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.2rem 0.65rem',
                    borderRadius: 999,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    backgroundColor: 'rgba(16,185,129,0.12)',
                    color: '#10B981',
                    border: '1px solid rgba(16,185,129,0.3)',
                  }}
                >
                  <ShieldCheck size={14} />
                  <span>Verified DineGo Partner</span>
                </div>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Managed by <strong style={{ color: 'var(--text-primary)' }}>{profile.ownerName}</strong> · Partner ID: {profile.id}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              onClick={() => setRestaurantOpen(!profile.isOpen)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 0.9rem',
                borderRadius: 8,
                fontSize: '0.82rem',
                fontWeight: 700,
                backgroundColor: profile.isOpen ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)',
                color: profile.isOpen ? '#EF4444' : '#10B981',
                border: `1px solid ${profile.isOpen ? 'rgba(239,68,68,0.25)' : 'rgba(16,185,129,0.25)'}`,
                cursor: 'pointer',
              }}
            >
              <Power size={14} /> {profile.isOpen ? 'Take Offline' : 'Mark Open'}
            </button>

            <button
              id="btn-edit-profile"
              onClick={handleOpenEdit}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 1rem',
                borderRadius: 8,
                backgroundColor: 'var(--brand-orange)',
                color: '#fff',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(238,108,77,0.3)',
              }}
            >
              <Edit3 size={15} /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {/* Location & Contact Information */}
        <div
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 12,
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', fontWeight: 700 }}>
            <MapPin size={17} color="var(--brand-orange)" />
            <span>Highway Location & Contact</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.85rem 1rem', borderRadius: 8 }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Highway Corridor & Milestone
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '0.2rem', color: 'var(--brand-gold)' }}>
                {profile.highwayCorridor} (KM {profile.highwayKmMark})
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Direct ramp access with dedicated traveller parking
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.85rem 1rem', borderRadius: 8 }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Postal Address
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.2rem', color: 'var(--text-primary)' }}>
                {profile.address}, {profile.city}, {profile.state} — {profile.pincode}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.75rem 0.85rem', borderRadius: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  <Phone size={12} /> Telephone
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, marginTop: '0.25rem' }}>
                  {profile.phone}
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.75rem 0.85rem', borderRadius: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  <Mail size={12} /> Email
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, marginTop: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {profile.email}
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.75rem 0.85rem', borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                <Clock size={12} /> Operating Hours
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.25rem' }}>
                {profile.openingHours} – {profile.closingHours} daily
              </div>
            </div>
          </div>
        </div>

        {/* Cuisines & Highway Facilities */}
        <div
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 12,
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', fontWeight: 700 }}>
            <Utensils size={17} color="#10B981" />
            <span>Cuisine & Travel Amenities</span>
          </div>

          {/* Description */}
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
              Restaurant Bio
            </div>
            <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.6, backgroundColor: 'var(--bg-card)', padding: '0.85rem 1rem', borderRadius: 8 }}>
              {profile.description}
            </p>
          </div>

          {/* Cuisines */}
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.45rem' }}>
              Cuisine Specialties
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {profile.cuisineTypes.map((c) => (
                <span
                  key={c}
                  style={{
                    padding: '0.3rem 0.75rem',
                    borderRadius: 999,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor: 'rgba(238,108,77,0.12)',
                    color: 'var(--brand-orange)',
                    border: '1px solid rgba(238,108,77,0.25)',
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Facilities */}
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.45rem' }}>
              Traveller Amenities
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {profile.facilities.map((fac) => (
                <span
                  key={fac}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.3rem 0.75rem',
                    borderRadius: 8,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <CheckCircle2 size={12} color="#10B981" />
                  {fac}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <Modal title="Edit Restaurant Profile" onClose={() => setIsEditModalOpen(false)} width={580}>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {formError && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 8,
                  backgroundColor: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  color: '#EF4444',
                  fontSize: '0.82rem',
                }}
              >
                <AlertCircle size={14} style={{ flexShrink: 0 }} />
                <span>{formError}</span>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Restaurant Name *
                </label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 8,
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Owner Name *
                </label>
                <input
                  type="text"
                  value={formState.ownerName}
                  onChange={(e) => setFormState({ ...formState, ownerName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 8,
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Bio / Description
              </label>
              <textarea
                rows={3}
                value={formState.description}
                onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 8,
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-family)',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Contact Telephone *
                </label>
                <input
                  type="text"
                  value={formState.phone}
                  onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 8,
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Contact Email
                </label>
                <input
                  type="email"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 8,
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Opening Hours
                </label>
                <input
                  type="text"
                  value={formState.openingHours}
                  onChange={(e) => setFormState({ ...formState, openingHours: e.target.value })}
                  placeholder="e.g. 11:30"
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 8,
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Closing Hours
                </label>
                <input
                  type="text"
                  value={formState.closingHours}
                  onChange={(e) => setFormState({ ...formState, closingHours: e.target.value })}
                  placeholder="e.g. 23:00"
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 8,
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                style={{
                  padding: '0.6rem 1rem',
                  borderRadius: 8,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                id="profile-form-submit"
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: 8,
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#fff',
                  backgroundColor: 'var(--brand-orange)',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(238,108,77,0.3)',
                }}
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
