import { useDailyState } from '../../hooks/useDailyState';

export function PickupAnnouncement() {
  const { dailyState } = useDailyState();
  const store = dailyState?.selectedStore;
  const pickup = dailyState?.pickupPerson;
  const orderLink = dailyState?.orderLink || '';

  if (!store && !pickup) return null;

  return (
    <div className="pickup-announcement">
      <div className="pickup-announcement-header">
        🎉 Hom nay da chot!
      </div>
      <div className="pickup-announcement-body">
        {store && (
          <div className="pickup-ann-item">
            <div className="pickup-ann-icon">
              {store.avatar ? (
                <img src={store.avatar} alt={store.name} />
              ) : (
                <span>{store.emoji}</span>
              )}
            </div>
            <div className="pickup-ann-info">
              <div className="pickup-ann-label">Quan an hom nay</div>
              <div className="pickup-ann-name">{store.name}</div>
              {orderLink ? (
                <a
                  className="btn btn-primary pickup-ann-link"
                  href={orderLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Dat com ngay &rarr;
                </a>
              ) : (
                <span className="pickup-ann-sub">Chua co link dat com</span>
              )}
            </div>
          </div>
        )}
        {pickup && (
          <div className="pickup-ann-item">
            <div className="pickup-ann-icon pickup-ann-icon--person">
              {pickup.avatar ? (
                <img src={pickup.avatar} alt={pickup.name} />
              ) : (
                <span>🏃</span>
              )}
            </div>
            <div className="pickup-ann-info">
              <div className="pickup-ann-label">Nguoi di lay com</div>
              <div className="pickup-ann-name">{pickup.name}</div>
              <div className="pickup-ann-sub">Di lay com nhe! 🛵</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
