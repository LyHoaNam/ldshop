import { useStores } from '../../hooks/useStores';
import { StoreCard } from './StoreCard';

export function UserStoreList() {
  const { stores, loading } = useStores();

  if (loading) return <p>Dang tai danh sach quan an...</p>;

  return (
    <div className="racer-grid">
      {stores.map((s) => (
        <StoreCard key={s.id} store={s} />
      ))}
    </div>
  );
}
