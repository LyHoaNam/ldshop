import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useDailyState } from '../../hooks/useDailyState';
import { useStores } from '../../hooks/useStores';
import { setOrderLink, setSelectedStore, resetToday } from '../../services/dailyState';
import { serverTimestamp } from 'firebase/firestore';
import { SettingsModal } from '../settings/SettingsModal';

export function AdminTools() {
  const { logout } = useAdmin();
  const { dailyState } = useDailyState();
  const { stores } = useStores();
  const [orderInput, setOrderInput] = useState(dailyState?.orderLink ?? '');
  const [selectedStoreId, setSelectedStoreId] = useState(dailyState?.selectedStore?.id ?? '');
  const [showSettings, setShowSettings] = useState(false);

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
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="admin-tools">
        <div className="admin-status">Admin mode dang bat</div>
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
