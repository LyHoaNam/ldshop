import { useState } from 'react';
import { useRunners } from '../../hooks/useRunners';
import { useStores } from '../../hooks/useStores';
import { useStoreVote } from '../../hooks/useStoreVote';
import { castRunnerVote, removeRunnerVote } from '../../services/storeVote';
import { RunnerCard } from '../runners/RunnerCard';
import type { Runner, Store } from '../../types';

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
  allowMultipleVotes?: boolean;
}

export function StoreVoteSection({ voteStatus, allowMultipleVotes = false }: Props) {
  const { runners, loading: runnersLoading } = useRunners();
  const { stores, loading: storesLoading } = useStores();
  const { votes } = useStoreVote();

  const [selectedRunner, setSelectedRunner] = useState<Runner | null>(loadSavedRunner);
  const [showRunnerPicker, setShowRunnerPicker] = useState<boolean>(() => loadSavedRunner() === null);
  const [pendingStoreId, setPendingStoreId] = useState<string | null>(null);
  const [hint, setHint] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // All votes cast by the currently selected runner
  const myVotes = selectedRunner
    ? votes.filter((v) => v.runnerId === selectedRunner.id)
    : [];

  const hasVotedFor = (storeId: string) => myVotes.some((v) => v.storeId === storeId);

  // Single-vote mode: pending selection falls back to existing vote
  const singleActiveStoreId = pendingStoreId ?? (myVotes[0]?.storeId ?? null);

  // Tally per store across all votes
  const storeTally = stores
    .map((s) => ({ ...s, count: votes.filter((v) => v.storeId === s.id).length }))
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count);

  const maxVotes = storeTally.length > 0 ? storeTally[0].count : 1;

  const showHint = (msg: string) => {
    setHint(msg);
    setTimeout(() => setHint(''), 3000);
  };

  const handleSelectRunner = (runner: Runner) => {
    setSelectedRunner(runner);
    sessionStorage.setItem(VOTE_PROFILE_KEY, JSON.stringify(runner));
    setPendingStoreId(null);
    setShowRunnerPicker(false);
  };

  const handleSingleVoteSubmit = async () => {
    if (!selectedRunner) { showHint('Hay chon profile cua ban truoc.'); return; }
    if (!singleActiveStoreId) { showHint('Hay chon quan an muon vote.'); return; }
    const store = stores.find((s) => s.id === singleActiveStoreId);
    if (!store) { showHint('Quan an khong hop le.'); return; }

    setSubmitting(true);
    try {
      await castRunnerVote(
        selectedRunner.id, selectedRunner.name, selectedRunner.avatar,
        store.id, store.name, store.emoji ?? '',
        false,
      );
      showHint(myVotes.length > 0 ? 'Da doi vote thanh cong!' : 'Da gui vote!');
      setPendingStoreId(null);
    } catch (e) {
      console.error(e);
      showHint('Loi gui vote. Thu lai sau.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMultiVoteToggle = async (store: Store) => {
    if (!selectedRunner || submitting) return;
    setSubmitting(true);
    try {
      if (hasVotedFor(store.id)) {
        await removeRunnerVote(selectedRunner.id, store.id);
        showHint(`Da bo vote: ${store.emoji} ${store.name}`);
      } else {
        await castRunnerVote(
          selectedRunner.id, selectedRunner.name, selectedRunner.avatar,
          store.id, store.name, store.emoji ?? '',
          true,
        );
        showHint(`Da vote: ${store.emoji} ${store.name}!`);
      }
    } catch (e) {
      console.error(e);
      showHint('Loi. Thu lai sau.');
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
        {storeTally.length > 0 && <VoteTally tally={storeTally} total={votes.length} maxVotes={maxVotes} />}
      </section>
    );
  }

  return (
    <section className="racer-management" id="storeVoteSection">
      <h2>Vote quan an hom nay</h2>

      {/* Live vote result tally */}
      {storeTally.length > 0 && (
        <>
          <VoteTally
            tally={storeTally}
            total={votes.length}
            maxVotes={maxVotes}
          />
          <br />
        </>
      )}

      {allowMultipleVotes && (
        <p className="vote-multi-badge">Co the vote nhieu quan cung luc</p>
      )}

      {/* Step 1: Profile — collapses to chip after selection */}
      <div style={{ marginBottom: "1.25rem" }}>
        {selectedRunner && !showRunnerPicker ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{ fontSize: "0.85rem", color: "#8B4513", fontWeight: 600 }}
            >
              Dang vote voi tu cach:
            </span>
            <div className="vote-profile-chip">
              <span className="vote-profile-chip-avatar">
                <img
                  src={selectedRunner.avatar}
                  alt={selectedRunner.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/avatars/default.png";
                  }}
                />
              </span>
              <span className="vote-profile-chip-name">
                {selectedRunner.name}
              </span>
              <button
                className="vote-profile-chip-change"
                onClick={() => setShowRunnerPicker(true)}
              >
                Thay doi
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 style={{ marginBottom: "0.5rem" }}>
              Buoc 1: Chon profile cua ban
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
          </>
        )}
      </div>

      {/* Step 2: Store selection */}
      {selectedRunner && !showRunnerPicker && (
        <div>
          <h3 style={{ marginBottom: "0.5rem" }}>
            {allowMultipleVotes
              ? "Chon quan an muon vote (co the chon nhieu):"
              : "Buoc 2: Chon quan an muon an"}
          </h3>
          {storesLoading ? (
            <p>Dang tai danh sach quan an...</p>
          ) : (
            <div className="racer-grid">
              {stores.map((store) => {
                const voteCount = votes.filter(
                  (v) => v.storeId === store.id,
                ).length;
                const isSelected = allowMultipleVotes
                  ? hasVotedFor(store.id)
                  : singleActiveStoreId === store.id;
                return (
                  <div
                    key={store.id}
                    className={`racer-card${isSelected ? " selected" : ""}`}
                    onClick={() => {
                      if (allowMultipleVotes) {
                        handleMultiVoteToggle(store);
                      } else {
                        setPendingStoreId(store.id);
                      }
                    }}
                    style={{ cursor: "pointer", position: "relative" }}
                  >
                    {isSelected && <span className="vote-store-check">✓</span>}
                    <div
                      className="racer-avatar"
                      style={{
                        fontSize: "2.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {store.avatar ? (
                        <img src={store.avatar} alt={store.name} />
                      ) : (
                        store.emoji
                      )}
                    </div>
                    <div className="racer-name">{store.name}</div>
                    {voteCount > 0 && (
                      <div style={{ fontSize: "0.75rem", color: "#888" }}>
                        {voteCount} phieu
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {!allowMultipleVotes && (
            <div
              style={{
                marginTop: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                flexWrap: "wrap",
              }}
            >
              <button
                className="btn btn-primary"
                onClick={handleSingleVoteSubmit}
                disabled={submitting || !singleActiveStoreId}
              >
                {submitting
                  ? "Dang gui..."
                  : myVotes.length > 0
                    ? "Doi vote"
                    : "Gui vote"}
              </button>
              {hint && (
                <span className="helper-text" style={{ margin: 0 }}>
                  {hint}
                </span>
              )}
            </div>
          )}
          {allowMultipleVotes && hint && (
            <p className="helper-text" style={{ marginTop: "0.5rem" }}>
              {hint}
            </p>
          )}
        </div>
      )}
    </section>
  );
}

interface TallyEntry { id: string; emoji: string; name: string; count: number; }

function VoteTally({ tally, total, maxVotes }: { tally: TallyEntry[]; total: number; maxVotes: number }) {
  const medals = ['🥇', '🥈', '🥉'];
  return (
    <div className="vote-result-tally">
      <h4>Ket qua vote ({total} phieu)</h4>
      {tally.map((s, i) => (
        <div key={s.id} className="vote-tally-row">
          <span className="vote-tally-medal">{medals[i] ?? `${i + 1}.`}</span>
          <span className="vote-tally-store">{s.emoji} {s.name}</span>
          <div className="vote-tally-bar-wrap">
            <div
              className="vote-tally-bar"
              style={{ width: `${Math.round((s.count / maxVotes) * 100)}%` }}
            />
          </div>
          <span className="vote-tally-count">{s.count} phieu</span>
        </div>
      ))}
    </div>
  );
}
