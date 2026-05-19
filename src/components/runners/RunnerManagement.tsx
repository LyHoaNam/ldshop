import { useState } from 'react';
import { useRunners } from '../../hooks/useRunners';
import { useSettings } from '../../hooks/useSettings';
import { deleteRunner } from '../../services/runners';
import { RunnerCard } from './RunnerCard';
import { AddRunnerForm } from './AddRunnerForm';
import { RaceTrack } from '../race/RaceTrack';
import { TabPanel } from '../ui/TabPanel';
import type { Participant } from '../../types';

export function RunnerManagement() {
  const { runners } = useRunners();
  const { settings } = useSettings();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const participants: Participant[] = runners
    .filter((r) => selectedIds.has(r.id))
    .map((r) => ({ id: r.id, name: r.name, avatar: r.avatar }));

  return (
    <section className="racer-management admin-only">
      <h2>Quan ly nguoi dua</h2>
      <TabPanel
        tabs={[
          {
            label: 'Select runner daily',
            content: (
              <>
                <div className="racer-grid">
                  {runners.map((r) => (
                    <RunnerCard
                      key={r.id}
                      runner={r}
                      selectable
                      selected={selectedIds.has(r.id)}
                      onToggle={() => toggle(r.id)}
                    />
                  ))}
                </div>
                <RaceTrack
                  participants={participants}
                  mode="people"
                  settings={settings}
                  emptyIcon={<img src="/images/runner-sprite.gif" width={120} height={120} alt="" />}
                  emptyMessage="Admin chon danh sach nguoi order de bat dau race."
                />
              </>
            ),
          },
          {
            label: 'Add runner',
            content: <AddRunnerForm />,
          },
          {
            label: 'Danh sach hien tai',
            content: (
              <div className="racer-grid">
                {runners.map((r) => (
                  <RunnerCard
                    key={r.id}
                    runner={r}
                    manageable
                    onDelete={() => deleteRunner(r.id)}
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
