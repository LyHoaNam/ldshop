import { useAdmin } from '../../context/AdminContext';
import { AdminLoginForm } from './AdminLoginForm';
import { AdminTools } from './AdminTools';

export function AdminPanel() {
  const { isAdmin } = useAdmin();

  return (
    <div className="control-panel app-admin-panel">
      {isAdmin ? <AdminTools /> : <AdminLoginForm />}
    </div>
  );
}
