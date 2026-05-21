import { useState } from 'react';
import { useRunners } from '../../hooks/useRunners';
import { useStores } from '../../hooks/useStores';
import { useStoreVote } from '../../hooks/useStoreVote';
import { castRunnerVote } from '../../services/storeVote';
import { RunnerCard } from '../runners/RunnerCard';
import type { Runner } from '../../types';

const VOTE_PROFILE_KEY = 'ldshop_vote_profile';

function loadSavedRunner(): Runner | null {
  try {
    const raw = sessionStorage.getItem(VOTE_PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

interface Props {
  voteStatus: 'open' | 'closed';
}

export function StoreVoteSection({ voteStatus }: Props) {
  const { runners, loading: runnersLoading } = useRunners();
  const { stores, loading: storesLoading } = useStores();
  const { votes } = useStoreVote();

  const [selectedRunner, setSelectedRunner] = useState<Runner | null>(loadSavedRunner);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [hint, setHint] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const myVote = selectedRunner
    ? votes.find((v) => v.runnerId === selectedRunner.id) ?? null
    : null;

  const activeStoreId = selectedStoreId ?? myVote?.storeId ?? null;

  const handleSelectRunner = (runner: Runner) => {
    setSelectedRunner(runner);
    sessionStorage.setItem(VOTE_PROFILE_KEY, JSON.stringify(runner));
    setSelectedStoreId(null);
  };

  const handleSubmit = async () => {
    if (!selectedRunner) { setHint('Hay chon profile cua ban truoc.'); return; }
    if (!activeStoreId) { setHint('Hay chon quan an muon vote.'); return; }
    const store = stores.find((s) => s.id === activeStoreId);
    if (!store) { setHint('Quan an khong hop le.'); return; }

    setSubmitting(true);
    try {
      await castRunnerVote(
        selectedRunner.id,
        selectedRunner.name,
        selectedRunner.avatar,
        store.id,
        store.name,
        store.emoji ?? '',
      );
      setHint(myVote ? 'Da doi vote thanh cong!' : 'Da gui vote!');
      setTimeout(() => setHint(''), 3000);
    } catch (e) {
      console.error(e);
      setHint('Loi gui vote. Thu lai sau.');
    } finally {
      setSubmitting(false);
    }
  };

  if (voteStatus === 'closed') {
    return (
      <section className="racer-management">
        <h2>Vote quan an hom nay</h2>
        <p style={{ color: '#888', marginTop: '0.5rem' }}>
          Viec vote da ket thuc. Admin dang cong bo quan thang — vui long cho!
        </p>
      </section>
    );
  }

  return (
    <section className="racer-management" id="storeVoteSection">
      <h2>Vote quan an hom nay</h2>

      {/* Step 1: Choose profile */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>
          Buoc 1: Chon profile cua ban
          {selectedRunner && (
            <span style={{ fontWeight: 400, fontSize: '0.85rem', color: '#4CAF50', marginLeft: '0.5rem' }}>
              ✓ {selectedRunner.name}
            </span>
          )}
        </h3>
        {runnersLoading ? (
          <p>Dang tai danh sach...</p>
        ) : (
          <div className="racer-grid">
            {runners.map((runner) => (
              <RunnerCard
                key={runner.id}
                runner={runner}
                selectable
                selected={selectedRunner?.id === runner.id}
                onToggle={() => handleSelectRunner(runner)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Step 2: Choose store */}
      {selectedRunner && (
        <div>
          <h3 style={{ marginBottom: '0.5rem' }}>
            Buoc 2: Chon quan an muon an
            {myVote && (
              <span style={{ fontWeight: 400, fontSize: '0.85rem', color: '#4CAF50', marginLeft: '0.5rem' }}>
                (hien tai: {myVote.storeEmoji} {myVote.storeName})
              </span>
            )}
          </h3>
          {storesLoading ? (
            <p>Dang tai danh sach quan an...</p>
          ) : (
            <div className="racer-grid">
              {stores.map((store) => {
                const voteCount = votes.filter((v) => v.storeId === store.id).length;
                const isSelected = activeStoreId === store.id;
                return (
                  <div
                    key={store.id}
                    className={`racer-card${isSelected ? ' selected' : ''}`}
                    onClick={() => setSelectedStoreId(store.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div
                      className="racer-avatar"
                      style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      {store.avatar ? (
                        <img src={store.avatar} alt={store.name} />
                      ) : (
                        store.emoji
                      )}
                    </div>
                    <div className="racer-name">{store.name}</div>
                    {voteCount > 0 && (
                      <div style={{ fontSize: '0.75rem', color: '#888' }}>
                        {voteCount} phieu
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={submitting || !activeStoreId}
            >
              {submitting ? 'Dang gui...' : myVote ? 'Doi vote' : 'Gui vote'}
            </button>
            {hint && <span className="helper-text" style={{ margin: 0 }}>{hint}</span>}
          </div>
        </div>
      )}
    </section>
  );
}
