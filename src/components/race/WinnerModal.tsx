import { useState } from 'react';
import { Confetti } from './Confetti';
import { setOrderLink } from '../../services/dailyState';
import type { Participant, AppSettings, RaceMode } from '../../types';

interface WinnerModalProps {
  winner: Participant | null;
  mode: RaceMode;
  settings: AppSettings;
  onClose: () => void;
}

export function WinnerModal({ winner, mode, settings, onClose }: WinnerModalProps) {
  const [linkInput, setLinkInput] = useState('');
  const [saving, setSaving] = useState(false);

  if (!winner) return null;

  const isPeople = mode === 'people';
  const isStores = mode === 'stores';

  const handleClose = async () => {
    if (isStores) {
      setSaving(true);
      try {
        await setOrderLink(linkInput);
      } catch (e) {
        console.error(e);
      } finally {
        setSaving(false);
      }
    }
    onClose();
  };

  return (
    <>
      <Confetti count={settings.confetti.count} duration={settings.confetti.duration} />
      <div className="winner-modal" style={{ display: 'flex' }}>
        <div className="winner-content">
          <h2>{isPeople ? 'NGUOI MAY MAN' : 'QUAN THANG'}</h2>
          <div className="winner-avatar">
            {winner.avatar ? (
              <img src={winner.avatar} alt={winner.name} />
            ) : (
              <span style={{ fontSize: '4rem' }}>{winner.emoji ?? '🍚'}</span>
            )}
          </div>
          <div className="winner-name">{winner.name}</div>
          <div className="winner-message">
            {isPeople
              ? 'Hom nay ban la nguoi nhan com.'
              : 'Day la quan an duoc chon hom nay!'}
          </div>
          {isStores && (
            <div className="form-group" style={{ marginTop: '1.25rem', textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
                Link dat com (bat buoc):
              </label>
              <input
                type="url"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                placeholder="https://..."
                style={{ width: '100%', boxSizing: 'border-box' }}
                autoFocus
              />
            </div>
          )}
          <div className="button-group" style={{ marginTop: '1.5rem' }}>
            <button
              className="btn btn-primary"
              onClick={handleClose}
              disabled={saving || (isStores && !linkInput.trim())}
            >
              {saving ? 'Dang luu...' : 'Dong'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
