import React, { createContext, useState, useContext } from 'react';

interface Alert {
  farmId: number;
  farmName: string;
  sensor: string;
  value: string;
  threshold: string;
}

interface AlertsData {
  warnings: Alert[];
  destructive: Alert[];
}

interface AlertContextType {
  alerts: AlertsData | null;
  setAlerts: (alerts: AlertsData) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertsData | null>(null);

  return (
    <AlertContext.Provider value={{ alerts, setAlerts }}>
      {children}
    </AlertContext.Provider>
  );
};