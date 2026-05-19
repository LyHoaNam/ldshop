import { useState } from 'react';
import { addStore } from '../../services/stores';
import { EmojiPicker } from '../ui/EmojiPicker';
import { STORE_EMOJIS } from '../../config/constants';

export function AddStoreForm() {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState(STORE_EMOJIS[0]);
  const [tags, setTags] = useState('');

  const handleAdd = async () => {
    if (!name.trim()) return;
    try {
      await addStore(
        name.trim(),
        emoji,
        tags.split(',').map((t) => t.trim()).filter(Boolean),
      );
      setName('');
      setTags('');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="add-racer-form">
      <h3>Them quan moi</h3>
      <div className="form-group">
        <label>Ten quan:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Nhap ten quan..."
        />
      </div>
      <div className="form-group">
        <label>Icon quan:</label>
        <EmojiPicker emojis={STORE_EMOJIS} selected={emoji} onSelect={setEmoji} />
      </div>
      <div className="form-group">
        <label>Tags:</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="com, bun, pho..."
        />
      </div>
      <button className="btn btn-primary" onClick={handleAdd}>
        Them quan an
      </button>
    </div>
  );
}
