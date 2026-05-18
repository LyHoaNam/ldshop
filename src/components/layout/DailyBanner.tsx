import { useDailyState } from '../../hooks/useDailyState';

export function DailyBanner() {
  const { dailyState } = useDailyState();

  const orderLink = dailyState?.orderLink || '';
  const pickup = dailyState?.pickupPerson;

  return (
    <div className="daily-banner" id="dailyBanner">
      <div className="daily-info">
        <span className="daily-label">Link dat com hom nay</span>
        {orderLink ? (
          <a href={orderLink} target="_blank" rel="noopener noreferrer" id="dailyOrderLink">
            {orderLink}
          </a>
        ) : (
          <span id="dailyOrderLink">Admin chua cap nhat link dat com hom nay.</span>
        )}
      </div>
      <div className="daily-info">
        <span className="daily-label">Nguoi nhan com</span>
        <span id="dailyPickupPerson">
          {pickup ? pickup.name : 'Chua chon nguoi nhan com hom nay.'}
        </span>
      </div>
    </div>
  );
}
