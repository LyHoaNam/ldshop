import { Confetti } from './Confetti';
import type { Participant, AppSettings, RaceMode } from '../../types';

interface WinnerModalProps {
  winner: Participant | null;
  mode: RaceMode;
  settings: AppSettings;
  onClose: () => void;
}

export function WinnerModal({ winner, mode, settings, onClose }: WinnerModalProps) {
  if (!winner) return null;

  const isPeople = mode === 'people';

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
          <div className="button-group" style={{ marginTop: '1.5rem' }}>
            <button className="btn btn-primary" onClick={onClose}>
              Dong
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
