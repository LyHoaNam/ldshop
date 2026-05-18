import { useStoreRequests } from '../../hooks/useStoreRequests';
import { STORAGE_KEYS } from '../../config/constants';

export function MyRequestList() {
  const { requests } = useStoreRequests();
  const myIds: string[] = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.myRequests) ?? '[]');
  const mine = requests.filter((r) => myIds.includes(r.id));

  if (mine.length === 0) return <p>Ban chua gui request nao trong phien nay.</p>;

  return (
    <div className="request-list">
      {mine.map((r) => (
        <div key={r.id} className="request-item" style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>
          <strong>{r.emoji} {r.name}</strong>
          {r.tags.length > 0 && <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: '#888' }}>{r.tags.join(', ')}</span>}
          {r.note && <p style={{ fontSize: '0.85rem', margin: '0.2rem 0 0' }}>{r.note}</p>}
          <span style={{ fontSize: '0.75rem', color: r.status === 'approved' ? 'green' : r.status === 'rejected' ? 'red' : '#888' }}>
            {r.status === 'pending' ? 'Dang cho duyet' : r.status === 'approved' ? 'Da duoc duyet' : 'Bi tu choi'}
          </span>
        </div>
      ))}
    </div>
  );
}
