import type { Store } from '../../types';

interface StoreCardProps {
  store: Store;
  selected?: boolean;
  selectable?: boolean;
  manageable?: boolean;
  onToggle?: () => void;
  onDelete?: () => void;
}

export function StoreCard({ store, selected, selectable, manageable, onToggle, onDelete }: StoreCardProps) {
  return (
    <div
      className={`racer-card${selected ? ' selected' : ''}`}
      onClick={selectable ? onToggle : undefined}
      style={{ cursor: selectable ? 'pointer' : 'default' }}
    >
      <div className="racer-avatar" style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {store.emoji}
      </div>
      <div className="racer-name">{store.name}</div>
      {store.tags?.length > 0 && (
        <div className="racer-tags" style={{ fontSize: '0.75rem', color: '#888' }}>
          {store.tags.join(', ')}
        </div>
      )}
      <div className="racer-wins">🏆 {store.wins} wins</div>
      {manageable && (
        <button
          className="btn btn-danger"
          style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}
          onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
        >
          Xoa
        </button>
      )}
    </div>
  );
}
