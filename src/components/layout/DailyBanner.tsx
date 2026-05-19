import { useDailyState } from '../../hooks/useDailyState';

export function DailyBanner() {
  const { dailyState } = useDailyState();

  const orderLink = dailyState?.orderLink || '';
  const pickup = dailyState?.pickupPerson;
  const store = dailyState?.selectedStore;

  return (
    <div className="daily-banner" id="dailyBanner">
      {/* Store card */}
      <div className="pickup-card">
        <span className="pickup-card-label">Quan an hom nay</span>
        {store ? (
          <div className="pickup-card-body">
            <div className="pickup-card-avatar pickup-card-avatar--store">
              {store.avatar ? (
                <img src={store.avatar} alt={store.name} />
              ) : (
                <span className="pickup-card-emoji">{store.emoji}</span>
              )}
            </div>
            <div className="pickup-card-info">
              <span className="pickup-card-name">{store.name}</span>
              {orderLink && (
                <a
                  className="pickup-card-link"
                  href={orderLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {'>'} Link dat com
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="pickup-card-body pickup-card-body--empty">
            <div className="pickup-card-avatar pickup-card-avatar--store pickup-card-avatar--empty">
              <span className="pickup-card-emoji">🍽️</span>
            </div>
            <div className="pickup-card-info">
              <span className="pickup-card-name pickup-card-name--muted">Chua chon quan</span>
              {orderLink && (
                <a
                  className="pickup-card-link"
                  href={orderLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {'>'} Link dat com
                </a>
              )}
              {!orderLink && (
                <span className="pickup-card-name pickup-card-name--muted" style={{ fontSize: '0.6rem' }}>
                  Admin chua cap nhat link.
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pickup person card */}
      <div className="pickup-card">
        <span className="pickup-card-label">Nguoi nhan com</span>
        {pickup ? (
          <div className="pickup-card-body">
            <div className="pickup-card-avatar pickup-card-avatar--person">
              {pickup.avatar ? (
                <img src={pickup.avatar} alt={pickup.name} />
              ) : (
                <span className="pickup-card-emoji">🏃</span>
              )}
            </div>
            <div className="pickup-card-info">
              <span className="pickup-card-name">{pickup.name}</span>
              <span className="pickup-card-sub">Di lay com nhe!</span>
            </div>
          </div>
        ) : (
          <div className="pickup-card-body pickup-card-body--empty">
            <div className="pickup-card-avatar pickup-card-avatar--person pickup-card-avatar--empty">
              <span className="pickup-card-emoji">❓</span>
            </div>
            <div className="pickup-card-info">
              <span className="pickup-card-name pickup-card-name--muted">Chua chon nguoi</span>
              <span className="pickup-card-sub">Hay dua de chon!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
