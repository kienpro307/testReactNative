/* eslint-disable prettier/prettier */
import React, {createContext, useContext, useState} from 'react';

interface AppContextType {
  indexEvent: number | null;
  indexWheel: number | null;
  setIndexEvent: (index: number | null) => void;
  setIndexWheel: (index: number | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: React.ReactNode; // Thay thế any bằng React.ReactNode
}

export const AppProvider: React.FC<AppProviderProps> = ({children}) => {
  const [indexEvent, setIndexEvent] = useState<number | null>(null);
  const [indexWheel, setIndexWheel] = useState<number | null>(null);

  const value = {
    indexEvent,
    indexWheel,
    setIndexEvent,
    setIndexWheel,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
