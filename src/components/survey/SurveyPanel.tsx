import { useState } from 'react';
import { useStores } from '../../hooks/useStores';
import { useSurvey } from '../../hooks/useSurvey';
import { getBrowserId, replaceBrowserVotes } from '../../services/survey';

export function SurveyPanel() {
  const { stores } = useStores();
  const { votes } = useSurvey();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [hint, setHint] = useState('');

  const browserId = getBrowserId();
  const myVotes = votes.filter((v) => v.browserId === browserId);
  const hasVoted = myVotes.length > 0;

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleSubmit = async () => {
    if (selected.size === 0) { setHint('Hay chon it nhat 1 quan an.'); return; }
    try {
      const storeIds = [...selected].map((id) => {
        const store = stores.find((s) => s.id === id);
        return { id, name: store?.name ?? '' };
      });
      await replaceBrowserVotes(myVotes as unknown as object[], storeIds);
      setSelected(new Set());
      setHint('Da gui khao sat!');
      setTimeout(() => setHint(''), 3000);
    } catch (e) {
      console.error(e);
      setHint('Loi gui khao sat.');
    }
  };

  return (
    <section className="sidebar-section">
      <h2>Khao sat quan muon an hom nay</h2>
      {hasVoted && (
        <p style={{ fontSize: '0.8rem', color: '#4CAF50' }}>
          Ban da vote: {myVotes.map((v) => v.storeName).join(', ')}
        </p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', margin: '0.5rem 0' }}>
        {stores.map((s) => (
          <label key={s.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={selected.has(s.id)}
              onChange={() => toggle(s.id)}
            />
            {s.emoji} {s.name}
          </label>
        ))}
      </div>
      <button className="btn btn-primary" onClick={handleSubmit}>
        Gui khao sat
      </button>
      {hint && <p className="helper-text">{hint}</p>}
    </section>
  );
}
