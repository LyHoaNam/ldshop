import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useDailyState } from '../../hooks/useDailyState';
import { useStores } from '../../hooks/useStores';
import { useStoreVote } from '../../hooks/useStoreVote';
import {
  setOrderLink,
  setSelectedStore,
  resetToday,
  setVoteMode,
  closeVotingWithWinner,
  publishVoteWinner,
} from '../../services/dailyState';
import { serverTimestamp } from 'firebase/firestore';
import { SettingsModal } from '../settings/SettingsModal';
import type { DailySelectedStore } from '../../types';

export function AdminTools() {
  const { logout } = useAdmin();
  const { dailyState } = useDailyState();
  const { stores } = useStores();
  const { votes } = useStoreVote();
  const [orderInput, setOrderInput] = useState(dailyState?.orderLink ?? '');
  const [selectedStoreId, setSelectedStoreId] = useState(dailyState?.selectedStore?.id ?? '');
  const [showSettings, setShowSettings] = useState(false);
  const [voteLink, setVoteLink] = useState('');

  const voteModeEnabled = dailyState?.voteModeEnabled ?? false;
  const voteStatus = dailyState?.voteStatus ?? 'open';
  const voteWinner = dailyState?.voteWinnerStore ?? null;

  // Tally votes per store
  const tally = stores
    .map((s) => ({ ...s, count: votes.filter((v) => v.storeId === s.id).length }))
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count);

  const computeWinner = (): DailySelectedStore | null => {
    if (tally.length === 0) return null;
    const top = tally[0];
    const store = stores.find((s) => s.id === top.id);
    return {
      id: top.id,
      name: top.name,
      emoji: top.emoji ?? '',
      avatar: store?.avatar ?? '',
      setAt: serverTimestamp() as any,
    };
  };

  const handleSaveLink = async () => {
    try {
      await setOrderLink(orderInput);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveStore = async () => {
    try {
      if (!selectedStoreId) {
        await setSelectedStore(null as any);
        return;
      }
      const store = stores.find((s) => s.id === selectedStoreId);
      if (!store) return;
      await setSelectedStore({
        id: store.id,
        name: store.name,
        emoji: store.emoji ?? '',
        avatar: store.avatar ?? '',
        setAt: serverTimestamp() as any,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleReset = async () => {
    if (!confirm('Reset toan bo trang thai hom nay?')) return;
    try {
      await resetToday();
      setSelectedStoreId('');
      setVoteLink('');
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleVoteMode = async () => {
    try {
      await setVoteMode(!voteModeEnabled);
      setVoteLink('');
    } catch (e) {
      console.error(e);
    }
  };

  const handleCloseVoting = async () => {
    const winner = computeWinner();
    if (!winner) {
      alert('Chua co phieu vote nao. Khong the xac dinh quan thang.');
      return;
    }
    if (!confirm(`Ket thuc vote? Quan thang: ${winner.emoji} ${winner.name}`)) return;
    try {
      await closeVotingWithWinner(winner);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePublishWinner = async () => {
    if (!voteWinner || !voteLink.trim()) return;
    try {
      await publishVoteWinner(voteWinner, voteLink.trim());
      setVoteLink('');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="admin-tools">
        <div className="admin-status">Admin mode dang bat</div>

        {/* Standard race-based store selection (hidden when vote mode on) */}
        {!voteModeEnabled && (
          <>
            <div className="form-group">
              <label>Quan an hom nay:</label>
              <select
                value={selectedStoreId}
                onChange={(e) => setSelectedStoreId(e.target.value)}
                id="dailyStoreSelect"
              >
                <option value="">-- Chua chon --</option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.emoji} {store.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Link order com hom nay:</label>
              <input
                type="url"
                value={orderInput}
                onChange={(e) => setOrderInput(e.target.value)}
                placeholder="https://..."
                id="dailyOrderInput"
              />
            </div>
            <div className="button-group">
              <button className="btn btn-primary" onClick={handleSaveStore}>
                Luu quan an
              </button>
              <button className="btn btn-primary" onClick={handleSaveLink}>
                Luu link order
              </button>
            </div>
          </>
        )}

        {/* Vote mode section */}
        <div
          style={{
            borderTop: voteModeEnabled ? 'none' : '1px solid rgba(255,255,255,0.15)',
            paddingTop: voteModeEnabled ? 0 : '0.75rem',
            marginTop: voteModeEnabled ? 0 : '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
            <button
              className={`btn ${voteModeEnabled ? 'btn-secondary' : 'btn-primary'}`}
              onClick={handleToggleVoteMode}
            >
              {voteModeEnabled ? 'Tat vote mode' : 'Bat vote mode'}
            </button>

            {voteModeEnabled && voteStatus === 'open' && (
              <button className="btn btn-primary" onClick={handleCloseVoting}>
                Ket thuc vote ({votes.length} phieu)
              </button>
            )}
          </div>

          {/* Live tally when voting is open */}
          {voteModeEnabled && voteStatus === 'open' && (
            <div style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
              {tally.length === 0 ? (
                <span style={{ color: '#888' }}>Chua co phieu vote nao.</span>
              ) : (
                <>
                  <span style={{ fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                    Ket qua hien tai:
                  </span>
                  {tally.map((s, i) => (
                    <div key={s.id} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <span>{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                      <span>{s.emoji} {s.name}</span>
                      <strong>{s.count} phieu</strong>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {/* Publish winner when voting is closed */}
          {voteModeEnabled && voteStatus === 'closed' && voteWinner && (
            <div
              style={{
                marginTop: '0.5rem',
                padding: '0.75rem',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '8px',
              }}
            >
              <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
                Quan thang: {voteWinner.emoji} {voteWinner.name}
              </p>
              <div className="form-group">
                <label>Link order com (bat buoc de cong bo):</label>
                <input
                  type="url"
                  value={voteLink}
                  onChange={(e) => setVoteLink(e.target.value)}
                  placeholder="https://..."
                  autoFocus
                />
              </div>
              <button
                className="btn btn-primary"
                onClick={handlePublishWinner}
                disabled={!voteLink.trim()}
              >
                Cong bo quan thang
              </button>
            </div>
          )}
        </div>

        <div className="button-group" style={{ marginTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={handleReset}>
            Reset hom nay
          </button>
          <button className="btn btn-secondary" onClick={() => setShowSettings(true)}>
            Cai dat
          </button>
          <button className="btn btn-secondary" onClick={logout}>
            Dang xuat
          </button>
        </div>
      </div>
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  );
}
