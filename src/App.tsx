import { AdminProvider } from './context/AdminContext';
import { RaceModeProvider } from './context/RaceModeContext';
import { AppHeader } from './components/layout/AppHeader';
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
  const allowMultipleVotes = dailyState?.allowMultipleVotes ?? false;

  return (
    <>
      {!isAdmin && <PickupAnnouncement />}
      {!isAdmin && !voteModeEnabled && <UserStoreSection />}
      {!isAdmin && voteModeEnabled && (
        <StoreVoteSection voteStatus={voteStatus} allowMultipleVotes={allowMultipleVotes} />
      )}
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
          <div className="container">
            <main className="app-main">
              <AppMain />
            </main>
          </div>
        </div>
      </RaceModeProvider>
    </AdminProvider>
  );
}
