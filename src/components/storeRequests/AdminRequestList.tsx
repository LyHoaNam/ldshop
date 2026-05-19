import { useStoreRequests } from '../../hooks/useStoreRequests';
import { approveRequest, rejectRequest } from '../../services/storeRequests';

export function AdminRequestList() {
  const { requests } = useStoreRequests();
  const pending = requests.filter((r) => r.status === 'pending');

  if (pending.length === 0) return <p>Khong co request nao dang cho duyet.</p>;

  return (
    <div className="request-list">
      {pending.map((r) => (
        <div key={r.id} className="request-item" style={{ padding: '0.75rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>{r.emoji} {r.name}</strong>
            {r.tags.length > 0 && <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: '#888' }}>{r.tags.join(', ')}</span>}
            {r.note && <p style={{ fontSize: '0.85rem', margin: '0.2rem 0 0' }}>{r.note}</p>}
          </div>
          <div className="button-group">
            <button className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem' }} onClick={() => approveRequest(r.id)}>
              Duyet
            </button>
            <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem' }} onClick={() => rejectRequest(r.id)}>
              Tu choi
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
