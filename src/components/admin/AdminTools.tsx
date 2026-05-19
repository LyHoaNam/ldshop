import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useDailyState } from '../../hooks/useDailyState';
import { setOrderLink, resetToday } from '../../services/dailyState';
import { SettingsModal } from '../settings/SettingsModal';

export function AdminTools() {
  const { logout } = useAdmin();
  const { dailyState } = useDailyState();
  const [orderInput, setOrderInput] = useState(dailyState?.orderLink ?? '');
  const [showSettings, setShowSettings] = useState(false);

  const handleSaveLink = async () => {
    try {
      await setOrderLink(orderInput);
    } catch (e) {
      console.error(e);
    }
  };

  const handleReset = async () => {
    if (!confirm('Reset toan bo trang thai hom nay?')) return;
    try {
      await resetToday();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="admin-tools">
        <div className="admin-status">Admin mode dang bat</div>
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
