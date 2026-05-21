import { AdminProvider } from './context/AdminContext';
import { RaceModeProvider } from './context/RaceModeContext';
import { AppHeader } from './components/layout/AppHeader';
import { AppSidebar } from './components/layout/AppSidebar';
import { PickupAnnouncement } from './components/layout/PickupAnnouncement';
import { UserStoreSection } from './components/stores/UserStoreSection';
import { StoreManagement } from './components/stores/StoreManagement';
import { RunnerManagement } from './components/runners/RunnerManagement';
import { StoreVoteSection } from './components/vote/StoreVoteSection';
import { useAdmin } from './context/AdminContext';
import { useDailyState } from './hooks/useDailyState';

function AppMain() {
  const { isAdmin } = useAdmin();
  const { dailyState } = useDailyState();

  const voteModeEnabled = dailyState?.voteModeEnabled ?? false;
  const voteStatus = dailyState?.voteStatus ?? 'open';

  return (
    <>
      {!isAdmin && <PickupAnnouncement />}
      {!isAdmin && voteModeEnabled && (
        <StoreVoteSection voteStatus={voteStatus} />
      )}
      {!isAdmin && !voteModeEnabled && <UserStoreSection />}
      {isAdmin && <StoreManagement />}
      {isAdmin && <RunnerManagement />}
    </>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <RaceModeProvider>
        <AppHeader />
        <div
          className="container-bg"
          style={{ backgroundImage: "url('/images/bg.gif')" }}
        >
          <div className="container app-shell">
            <main className="app-main">
              <AppMain />
            </main>
            <AppSidebar />
          </div>
        </div>
      </RaceModeProvider>
    </AdminProvider>
  );
}
