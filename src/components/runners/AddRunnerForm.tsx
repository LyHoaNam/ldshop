import { useState } from 'react';
import { addRunner } from '../../services/runners';

export function AddRunnerForm() {
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const handleAdd = async () => {
    if (!name.trim()) return;
    try {
      await addRunner(name.trim(), avatarUrl.trim() || '/avatars/default.png');
      setName('');
      setAvatarUrl('');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="add-racer-form">
      <h3>Them runner</h3>
      <div className="form-group">
        <label>Ten runner:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Nhap ten..."
        />
      </div>
      <div className="form-group">
        <label>Avatar URL:</label>
        <input
          type="text"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="/avatars/name.png hoac Firebase Storage URL"
        />
      </div>
      <button className="btn btn-primary" onClick={handleAdd}>
        Them runner
      </button>
    </div>
  );
}
