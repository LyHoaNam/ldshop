import { useState } from 'react';
import { useStores } from '../../hooks/useStores';
import { useSettings } from '../../hooks/useSettings';
import { useSurvey } from '../../hooks/useSurvey';
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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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
                <RaceTrack
                  participants={participants}
                  mode="stores"
                  settings={settings}
                  finishLabel="Quan!"
                  emptyIcon="🍚"
                  emptyMessage="Admin chon danh sach quan an hom nay de bat dau race."
                />
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
