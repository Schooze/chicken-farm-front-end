// hooks/useCompanyFarms.ts
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE_URL } from '../config';



export interface Farm {
  id: number;
  name: string;
  location: string;
  fan_count: number;
  company_id: number;
}

export interface FarmControls {
  fan: boolean;
  fanFrequency: number;
  feeder: boolean;
  coolingPad1: boolean;
  coolingPad2: boolean;
  lastFanToggle?: Date;
  lastFeederToggle?: Date;
  lastCoolingPad1Toggle?: Date;
  lastCoolingPad2Toggle?: Date;
}

export interface FarmWithControls extends Farm {
  controls: FarmControls;
}

export const useCompanyFarms = () => {
  const { token } = useAuth();
  const [farms, setFarms] = useState<FarmWithControls[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFarms = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/auth/company/farms`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const farmsData: Farm[] = await response.json();
        
        // Initialize each farm with default controls
        const farmsWithControls: FarmWithControls[] = farmsData.map(farm => ({
          ...farm,
          controls: {
            fan: false,
            fanFrequency: 0,
            feeder: false,
            coolingPad1: false,
            coolingPad2: false
          }
        }));

        setFarms(farmsWithControls);
        setError(null);
      } else {
        throw new Error('Failed to fetch farms');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching farms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchFarms();
    }
  }, [token]);

  const updateFarmControls = (farmId: number, controls: Partial<FarmControls>) => {
    setFarms(currentFarms =>
      currentFarms.map(farm =>
        farm.id === farmId
          ? {
              ...farm,
              controls: {
                ...farm.controls,
                ...controls
              }
            }
          : farm
      )
    );
  };

  return {
    farms,
    loading,
    error,
    refetch: fetchFarms,
    updateFarmControls
  };
};