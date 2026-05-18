import { useCallback, useEffect, useRef, useState } from 'react';
import type { Participant, AppSettings } from '../../types';

interface RaceEngineResult {
  isRacing: boolean;
  winner: Participant | null;
  startRace: () => void;
  resetRace: () => void;
  laneRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

export function useRaceEngine(
  participants: Participant[],
  settings: AppSettings,
  trackWidth: number,
): RaceEngineResult {
  const [isRacing, setIsRacing] = useState(false);
  const [winner, setWinner] = useState<Participant | null>(null);
  const rafId = useRef(0);
  const positionRefs = useRef<number[]>([]);
  const laneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const finishedRef = useRef(false);

  const resetRace = useCallback(() => {
    cancelAnimationFrame(rafId.current);
    setIsRacing(false);
    setWinner(null);
    finishedRef.current = false;
    positionRefs.current = [];
    laneRefs.current.forEach((el) => {
      if (el) el.style.left = '20px';
    });
  }, []);

  const startRace = useCallback(() => {
    if (participants.length < 2) return;
    finishedRef.current = false;
    positionRefs.current = participants.map(() => 20);
    const speeds = participants.map(
      () => settings.race.baseSpeed + Math.random() * settings.race.speedVariation,
    );
    const finishLine = trackWidth - 80;
    setIsRacing(true);
    setWinner(null);

    const animate = () => {
      if (finishedRef.current) return;
      let foundWinner = false;
      positionRefs.current.forEach((pos, i) => {
        if (pos >= finishLine) {
          if (!finishedRef.current) {
            finishedRef.current = true;
            foundWinner = true;
            setWinner(participants[i]);
            setIsRacing(false);
          }
          return;
        }
        const newPos = pos + speeds[i] * (0.8 + Math.random() * 0.4);
        positionRefs.current[i] = newPos;
        const el = laneRefs.current[i];
        if (el) el.style.left = `${Math.min(newPos, finishLine)}px`;
      });
      if (!foundWinner) {
        rafId.current = requestAnimationFrame(animate);
      }
    };
    rafId.current = requestAnimationFrame(animate);
  }, [participants, settings, trackWidth]);

  useEffect(() => () => cancelAnimationFrame(rafId.current), []);

  return { isRacing, winner, startRace, resetRace, laneRefs };
}
