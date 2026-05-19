import { useState } from 'react';
import { addRequest } from '../../services/storeRequests';
import { EmojiPicker } from '../ui/EmojiPicker';
import { STORE_EMOJIS, STORAGE_KEYS } from '../../config/constants';

export function StoreRequestForm() {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState(STORE_EMOJIS[0]);
  const [tags, setTags] = useState('');
  const [note, setNote] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async () => {
    if (!name.trim()) { setMsg('Nhap ten quan truoc.'); return; }
    try {
      const id = await addRequest(
        name.trim(),
        emoji,
        tags.split(',').map((t) => t.trim()).filter(Boolean),
        note.trim(),
      );
      // track my requests in sessionStorage
      const mine: string[] = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.myRequests) ?? '[]');
      mine.push(id);
      sessionStorage.setItem(STORAGE_KEYS.myRequests, JSON.stringify(mine));
      setName(''); setTags(''); setNote('');
      setMsg('Da gui request!');
      setTimeout(() => setMsg(''), 3000);
    } catch (e) {
      console.error(e);
      setMsg('Loi gui request.');
    }
  };

  return (
    <div className="add-racer-form">
      <h3>Gui request quan moi</h3>
      <div className="form-group">
        <label>Ten quan:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nhap ten quan..." />
      </div>
      <div className="form-group">
        <label>Icon quan:</label>
        <EmojiPicker emojis={STORE_EMOJIS} selected={emoji} onSelect={setEmoji} />
      </div>
      <div className="form-group">
        <label>Tags:</label>
        <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="com, bun, pho..." />
      </div>
      <div className="form-group">
        <label>Ghi chu:</label>
        <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Dia chi, mon nen goi..." />
      </div>
      <div className="button-group">
        <button className="btn btn-primary" onClick={handleSubmit}>Gui request</button>
      </div>
      {msg && <p className="helper-text">{msg}</p>}
    </div>
  );
}
