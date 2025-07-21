import API_BASE_URL from '../config';
import React, { useState, useEffect } from 'react';
import { FarmCard } from './FarmCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Settings, Activity, AlertTriangle } from 'lucide-react';

interface SensorData {
  temperature: number;
  moisture: number;
  ammonia: number;
  lastUpdate: Date;
}

interface Farm {
  id: number;
  name: string;
  data: SensorData;
}

// Simulate realistic sensor data with some variation
const generateSensorData = (): SensorData => ({
  temperature: 18 + Math.random() * 12, // 18-30°C
  moisture: 40 + Math.random() * 30,    // 40-70%
  ammonia: Math.random() * 30,          // 0-30 ppm
  lastUpdate: new Date()
});

const fetchSensorData = async (location: string): Promise<SensorData> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/kandang/${location.replace(' ', '_')}`);
    const json = await res.json();
    console.log('RAW PAYLOAD FOR', location, json);

    return {
      temperature: json.data.temperature,
      moisture: json.data.moisture,
      ammonia: json.data.ammonia,
      lastUpdate: new Date()
    };
  } catch (err) {
    console.error(`Failed to fetch data for ${location}:`, err);
    return {
      temperature: 0,
      moisture: 0,
      ammonia: 0,
      lastUpdate: new Date()
    };
  }
};


export const Dashboard: React.FC = () => {
  const [farms, setFarms] = useState<Farm[]>([
    { id: 1, name: 'Kandang 1', data: generateSensorData() },
    { id: 2, name: 'Kandang 2', data: generateSensorData() },
    { id: 3, name: 'Kandang 3', data: generateSensorData() }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto-refresh data every 5 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setFarms(prevFarms => {
        Promise.all(
          prevFarms.map(async farm => ({
            ...farm,
            data: await fetchSensorData(farm.name)
          }))
        ).then(updated => setFarms(updated));

        return prevFarms;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);



  const handleRefresh = async () => {
    setIsRefreshing(true);

    const updatedFarms = await Promise.all(
      farms.map(async farm => ({
        ...farm,
        data: await fetchSensorData(farm.name)
      }))
    );

    setFarms(updatedFarms);
    setIsRefreshing(false);
  };


  // Calculate overall system status
  const getOverallStatus = () => {
    const allSensors = farms.flatMap(farm => [
      { value: farm.data.temperature, type: 'temperature' as const },
      { value: farm.data.moisture, type: 'moisture' as const },
      { value: farm.data.ammonia, type: 'ammonia' as const }
    ]);

    const getStatusForValue = (value: number, type: 'temperature' | 'moisture' | 'ammonia') => {
      const ranges = {
        temperature: { min: 18, max: 25 },
        moisture: { min: 45, max: 65 },
        ammonia: { min: 0, max: 20 }
      };
      const range = ranges[type];
      return value >= range.min && value <= range.max ? 'good' : 'warning';
    };

    const statuses = allSensors.map(sensor => getStatusForValue(sensor.value, sensor.type));
    const warningCount = statuses.filter(s => s === 'warning').length;
    
    return { 
      status: warningCount === 0 ? 'optimal' : warningCount <= 3 ? 'warning' : 'critical',
      warningCount,
      totalSensors: statuses.length
    };
  };

  const systemStatus = getOverallStatus();

  return (
    <div className="min-h-screen bg-gradient-earth">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">
                Chicken Farm Control System
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge 
                variant={systemStatus.status === 'optimal' ? 'default' : 'secondary'}
                className="text-sm px-3 py-1"
              >
                {systemStatus.status === 'optimal' ? '✓ All Systems Optimal' : 
                 `⚠ ${systemStatus.warningCount} Alerts`}
              </Badge>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                {autoRefresh ? 'Auto-Refresh: ON' : 'Auto-Refresh: OFF'}
              </Button>
              
              <Button 
                variant="farm" 
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* System Overview */}
        <Card className="mb-8 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{farms.length}</div>
                <div className="text-sm text-muted-foreground">Active Farms</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{systemStatus.totalSensors}</div>
                <div className="text-sm text-muted-foreground">Total Sensors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{systemStatus.totalSensors - systemStatus.warningCount}</div>
                <div className="text-sm text-muted-foreground">Normal Readings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">{systemStatus.warningCount}</div>
                <div className="text-sm text-muted-foreground">Alerts</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Farm Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm) => (
            <FarmCard
              key={farm.id}
              farmId={farm.id}
              farmName={farm.name}
              data={farm.data}
            />
          ))}
        </div>

        {/* Status Indicators */}
        <Card className="mt-8 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Optimal Ranges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-temperature bg-opacity-10">
                <span className="font-medium">Temperature:</span>
                <span>18°C - 25°C</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-moisture bg-opacity-10">
                <span className="font-medium">Moisture:</span>
                <span>45% - 65%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-ammonia bg-opacity-10">
                <span className="font-medium">Ammonia:</span>
                <span>0 - 20 ppm</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};