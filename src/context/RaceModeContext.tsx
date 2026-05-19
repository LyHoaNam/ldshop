import { createContext, useContext, useState, type ReactNode } from 'react';
import type { RaceMode } from '../types';

interface RaceModeContextValue {
  mode: RaceMode;
  setMode: (m: RaceMode) => void;
}

const RaceModeContext = createContext<RaceModeContextValue>({
  mode: 'people',
  setMode: () => {},
});

export function RaceModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<RaceMode>('people');
  return (
    <RaceModeContext.Provider value={{ mode, setMode }}>
      {children}
    </RaceModeContext.Provider>
  );
}

export const useRaceMode = () => useContext(RaceModeContext);
