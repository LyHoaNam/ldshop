import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';

export function AdminLoginForm() {
  const { login } = useAdmin();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    try {
      login(password);
      setPassword('');
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Loi dang nhap.');
    }
  };

  return (
    <div className="admin-login-row">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        placeholder="Mat khau admin"
        id="adminPasswordInput"
      />
      <button className="btn btn-primary" onClick={handleLogin}>
        Dang nhap admin
      </button>
      {error && <span style={{ color: 'red', fontSize: '0.85rem' }}>{error}</span>}
    </div>
  );
}
