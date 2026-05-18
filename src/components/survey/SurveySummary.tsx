import { useState } from 'react';
import { useSurvey } from '../../hooks/useSurvey';

const SHOW_DEFAULT = 5;

export function SurveySummary() {
  const { votes } = useSurvey();
  const [expanded, setExpanded] = useState(false);

  const counts = votes.reduce<Record<string, { name: string; count: number }>>(
    (acc, v) => {
      acc[v.storeId] = { name: v.storeName, count: (acc[v.storeId]?.count ?? 0) + 1 };
      return acc;
    },
    {},
  );
  const ranked = Object.values(counts).sort((a, b) => b.count - a.count);
  const shown = expanded ? ranked : ranked.slice(0, SHOW_DEFAULT);

  return (
    <section className="sidebar-section">
      <h2>Bang xep hang</h2>
      <div id="surveySummary">
        {ranked.length === 0 && <p style={{ fontSize: '0.85rem' }}>Chua co ai vote hom nay.</p>}
        {shown.map(({ name, count }, i) => (
          <div key={name} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', fontSize: '0.9rem' }}>
            <span>{i + 1}. {name}</span>
            <span>{count} vote{count !== 1 ? 's' : ''}</span>
          </div>
        ))}
      </div>
      {ranked.length > SHOW_DEFAULT && (
        <button
          className="btn btn-secondary"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? 'Thu gon' : 'Xem them'}
        </button>
      )}
    </section>
  );
}
