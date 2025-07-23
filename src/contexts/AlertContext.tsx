import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Alert {
  farmId: number;
  farmName: string;
  sensor: string;
  value: string;
  threshold: string;
}

interface AlertContextType {
  alerts: {
    warnings: Alert[];
    destructive: Alert[];
  };
  setAlerts: (alerts: { warnings: Alert[]; destructive: Alert[] }) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<{ warnings: Alert[]; destructive: Alert[] }>({
    warnings: [],
    destructive: []
  });

  return (
    <AlertContext.Provider value={{ alerts, setAlerts }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlerts() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
}