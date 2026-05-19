import { createContext, useContext, useState, type ReactNode } from 'react';
import { ADMIN_SESSION_KEY } from '../config/constants';

interface AdminContextValue {
  isAdmin: boolean;
  login: (password: string) => void;
  logout: () => void;
}

const AdminContext = createContext<AdminContextValue>({
  isAdmin: false,
  login: () => {},
  logout: () => {},
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      const raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
      return raw ? JSON.parse(raw).isAdmin === true : false;
    } catch {
      return false;
    }
  });

  const login = (password: string) => {
    if (password !== import.meta.env.VITE_ADMIN_PASSWORD) {
      throw new Error('Mat khau admin khong dung.');
    }
    sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ isAdmin: true }));
    setIsAdmin(true);
  };

  const logout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAdmin(false);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
