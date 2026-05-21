import { useState } from 'react';
import { useStores } from '../../hooks/useStores';
import { useSettings } from '../../hooks/useSettings';
import { useSurvey } from '../../hooks/useSurvey';
import { useDailyState } from '../../hooks/useDailyState';
import { useStoreVote } from '../../hooks/useStoreVote';
import { deleteStore } from '../../services/stores';
import { StoreCard } from './StoreCard';
import { AddStoreForm } from './AddStoreForm';
import { RaceTrack } from '../race/RaceTrack';
import { TabPanel } from '../ui/TabPanel';
import { AdminRequestList } from '../storeRequests/AdminRequestList';
import type { Participant } from '../../types';

export function StoreManagement() {
  const { stores } = useStores();
  const { settings } = useSettings();
  const { votes } = useSurvey();
  const { dailyState } = useDailyState();
  const { votes: storeVotes } = useStoreVote();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const voteModeEnabled = dailyState?.voteModeEnabled ?? false;
  const voteStatus = dailyState?.voteStatus ?? 'open';

  const toggle = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const participants: Participant[] = stores
    .filter((s) => selectedIds.has(s.id))
    .map((s) => ({ id: s.id, name: s.name, avatar: s.avatar, emoji: s.emoji }));

  // tally survey votes per store
  const voteCounts = votes.reduce<Record<string, number>>((acc, v) => {
    acc[v.storeId] = (acc[v.storeId] ?? 0) + 1;
    return acc;
  }, {});
  const recommended = [...stores]
    .filter((s) => voteCounts[s.id])
    .sort((a, b) => (voteCounts[b.id] ?? 0) - (voteCounts[a.id] ?? 0));

  return (
    <section className="racer-management admin-only">
      <h2>Quan ly quan an</h2>
      <TabPanel
        tabs={[
          {
            label: 'Chon quan an hom nay',
            content: (
              <>
                {recommended.length > 0 && (
                  <>
                    <h3>Danh sach quan user recommend</h3>
                    <div className="racer-grid">
                      {recommended.map((s) => (
                        <StoreCard
                          key={s.id}
                          store={s}
                          selectable
                          selected={selectedIds.has(s.id)}
                          onToggle={() => toggle(s.id)}
                        />
                      ))}
                    </div>
                  </>
                )}
                <h3>Chon quan an hom nay</h3>
                <div className="racer-grid">
                  {stores.map((s) => (
                    <StoreCard
                      key={s.id}
                      store={s}
                      selectable
                      selected={selectedIds.has(s.id)}
                      onToggle={() => toggle(s.id)}
                    />
                  ))}
                </div>
                {voteModeEnabled ? (
                  <div
                    style={{
                      marginTop: '1rem',
                      padding: '1rem',
                      background: 'rgba(0,0,0,0.1)',
                      borderRadius: '8px',
                      textAlign: 'center',
                      color: '#888',
                    }}
                  >
                    <p style={{ marginBottom: '0.5rem' }}>
                      Vote mode dang bat — race quan an bi tat.
                    </p>
                    {voteStatus === 'open' && storeVotes.length > 0 && (
                      <div style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                        {stores
                          .map((s) => ({ ...s, count: storeVotes.filter((v) => v.storeId === s.id).length }))
                          .filter((s) => s.count > 0)
                          .sort((a, b) => b.count - a.count)
                          .map((s) => (
                            <div key={s.id}>{s.emoji} {s.name}: <strong>{s.count}</strong> phieu</div>
                          ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <RaceTrack
                    participants={participants}
                    mode="stores"
                    settings={settings}
                    finishLabel="Quan!"
                    emptyIcon="🍚"
                    emptyMessage="Admin chon danh sach quan an hom nay de bat dau race."
                  />
                )}
              </>
            ),
          },
          {
            label: 'User request quan an',
            content: <AdminRequestList />,
          },
          {
            label: 'Add quan moi',
            content: <AddStoreForm />,
          },
          {
            label: 'Danh sach hien tai',
            content: (
              <div className="racer-grid">
                {stores.map((s) => (
                  <StoreCard
                    key={s.id}
                    store={s}
                    manageable
                    onDelete={() => deleteStore(s.id)}
                  />
                ))}
              </div>
            ),
          },
        ]}
      />
    </section>
  );
}
