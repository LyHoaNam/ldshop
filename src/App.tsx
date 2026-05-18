import { AdminProvider } from './context/AdminContext';
import { RaceModeProvider } from './context/RaceModeContext';
import { AppHeader } from './components/layout/AppHeader';
import { AppSidebar } from './components/layout/AppSidebar';
import { UserStoreSection } from './components/stores/UserStoreSection';
import { StoreManagement } from './components/stores/StoreManagement';
import { RunnerManagement } from './components/runners/RunnerManagement';
import { useAdmin } from './context/AdminContext';

function AppMain() {
  const { isAdmin } = useAdmin();

  return (
    <>
      {!isAdmin && <UserStoreSection />}
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
