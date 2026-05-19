import type { Participant } from '../../types';

interface RaceLaneProps {
  participant: Participant;
  index: number;
  racerRef: (el: HTMLDivElement | null) => void;
}

export function RaceLane({ participant, index, racerRef }: RaceLaneProps) {
  const runnerClass = `runner-${(index % 9) + 1}`;

  return (
    <div className="lane">
      <div className="racer" ref={racerRef} style={{ left: '20px' }}>
        <div className={`runner-sprite ${runnerClass}`} />
        <div className="racer-name">{participant.name}</div>
      </div>
    </div>
  );
}
