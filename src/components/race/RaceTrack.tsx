import { useEffect, useRef, useState } from 'react';
import type { Participant, AppSettings, RaceMode } from '../../types';
import { useRaceEngine } from './useRaceEngine';
import { RaceLane } from './RaceLane';
import { WinnerModal } from './WinnerModal';
import { incrementRunnerWins } from '../../services/runners';
import { incrementStoreWins } from '../../services/stores';
import { setPickupPerson } from '../../services/dailyState';

interface RaceTrackProps {
  participants: Participant[];
  mode: RaceMode;
  settings: AppSettings;
  finishLabel?: string;
  emptyIcon?: React.ReactNode;
  emptyMessage?: string;
}

export function RaceTrack({
  participants,
  mode,
  settings,
  finishLabel,
  emptyIcon,
  emptyMessage,
}: RaceTrackProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(600);
  const [showWinner, setShowWinner] = useState(false);

  useEffect(() => {
    if (!trackRef.current) return;
    const obs = new ResizeObserver((entries) => {
      setTrackWidth(entries[0].contentRect.width);
    });
    obs.observe(trackRef.current);
    setTrackWidth(trackRef.current.offsetWidth);
    return () => obs.disconnect();
  }, []);

  const { isRacing, winner, startRace, resetRace, laneRefs } = useRaceEngine(
    participants,
    settings,
    trackWidth,
  );

  useEffect(() => {
    if (!winner) return;
    setShowWinner(true);
    if (mode === 'people') {
      incrementRunnerWins(winner.id).catch(console.error);
      setPickupPerson({
        id: winner.id,
        name: winner.name,
        avatar: winner.avatar,
        setAt: null as never,
      }).catch(console.error);
    } else {
      incrementStoreWins(winner.id).catch(console.error);
    }
  }, [winner, mode]);

  const handleClose = () => {
    setShowWinner(false);
    resetRace();
  };

  const isEmpty = participants.length === 0;

  return (
    <>
      <div className="button-group" style={{ marginBottom: '0.75rem' }}>
        <button
          className="btn btn-primary"
          onClick={startRace}
          disabled={isRacing || participants.length < 2}
        >
          {isRacing ? 'Dang dua...' : mode === 'people' ? 'Bat dau dua' : 'Dua chon quan'}
        </button>
        <button className="btn btn-secondary" onClick={resetRace} disabled={isRacing}>
          Lam moi
        </button>
      </div>

      <div className={`race-track${isRacing ? ' racing' : ''}`} ref={trackRef}>
        <div className="race-header">
          <div className="start-flag">Start</div>
          <div className="finish-flag">{finishLabel ?? (mode === 'people' ? 'Com!' : 'Quan!')}</div>
        </div>
        <div>
          {participants.map((p, i) => (
            <RaceLane
              key={p.id}
              participant={p}
              index={i}
              racerRef={(el) => { laneRefs.current[i] = el; }}
            />
          ))}
        </div>
        {isEmpty && (
          <div className="empty-state">
            <div className="empty-state-icon">{emptyIcon ?? '🏁'}</div>
            <h3>Chua chon nguoi tham gia</h3>
            <p>{emptyMessage ?? 'Chon tung the ben tren de them vao race.'}</p>
          </div>
        )}
      </div>

      {showWinner && (
        <WinnerModal
          winner={winner}
          mode={mode}
          settings={settings}
          onClose={handleClose}
        />
      )}
    </>
  );
}
