import { useState } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { saveSettings, resetSettings } from '../../services/settings';
import type { AppSettings } from '../../types';

export function SettingsModal({ onClose }: { onClose: () => void }) {
  const { settings } = useSettings();
  const [form, setForm] = useState<AppSettings>(settings);

  const set = (section: keyof AppSettings, key: string, value: number) =>
    setForm((prev) => ({ ...prev, [section]: { ...prev[section], [key]: value } }));

  const handleSave = async () => {
    await saveSettings(form);
    onClose();
  };

  const handleReset = async () => {
    await resetSettings();
    onClose();
  };

  return (
    <div className="settings-modal" style={{ display: 'flex' }}>
      <div className="settings-content">
        <h2>Cai dat ung dung</h2>
        <h3>Dua</h3>
        {([
          ['Base speed', 'baseSpeed', 1],
          ['Speed variation', 'speedVariation', 0],
          ['Animation speed (ms)', 'animationSpeed', 1],
        ] as [string, keyof AppSettings['race'], number][]).map(([label, key, min]) => (
          <div className="form-row" key={key}>
            <label>{label}:</label>
            <input
              type="number"
              min={min}
              value={form.race[key]}
              onChange={(e) => set('race', key, Number(e.target.value))}
            />
          </div>
        ))}

        <h3>Confetti</h3>
        {([
          ['Count', 'count', 0],
          ['Duration (ms)', 'duration', 0],
        ] as [string, keyof AppSettings['confetti'], number][]).map(([label, key, min]) => (
          <div className="form-row" key={key}>
            <label>{label}:</label>
            <input
              type="number"
              min={min}
              value={form.confetti[key]}
              onChange={(e) => set('confetti', key, Number(e.target.value))}
            />
          </div>
        ))}

        <div className="form-actions">
          <button className="btn btn-primary" onClick={handleSave}>Luu</button>
          <button className="btn btn-secondary" onClick={handleReset}>Khoi phuc mac dinh</button>
          <button className="btn" onClick={onClose}>Dong</button>
        </div>
      </div>
    </div>
  );
}
