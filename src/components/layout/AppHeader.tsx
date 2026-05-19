import { useState } from 'react';
import { DailyBanner } from './DailyBanner';
import { AdminPanel } from '../admin/AdminPanel';

export function AppHeader() {
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div className="header-banner" style={{ backgroundImage: "url('/images/header-bg.gif')" }}>
      <div className="header-content">
        <div className="shop-photo">
          <img src="/images/shop.gif" alt="Tiem Com Nam Vinh" />
        </div>
        <div className="header-title">
          <h1>TIEM COM NAM VINH</h1>
          <p>Chi nhanh Teq | Ba chu: Linh Da</p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.3rem' }}>
            Hom nay ai di lay com trua ne!
          </p>
        </div>
        <div
          className="owner-photo"
          onClick={() => setShowAdmin((v) => !v)}
          title="Admin login"
          style={{ cursor: 'pointer' }}
        >
          <img src="/images/owner.gif" alt="Ba chu Linh Da" />
        </div>
      </div>
      <DailyBanner />
      {showAdmin && (
        <div style={{ padding: '0 1rem 1rem' }}>
          <AdminPanel />
        </div>
      )}
    </div>
  );
}
