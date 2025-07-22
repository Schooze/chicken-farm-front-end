import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';
import { FarmCard }      from './FarmCard';
import { Button }        from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge }         from '@/components/ui/badge';
import { RefreshCw, Settings, Activity, AlertTriangle } from 'lucide-react';

export interface SensorData {
  temperature: number;
  moisture:    number;
  ammonia:     number;
  lastUpdate:  Date;
}

interface Farm {
  id:   number;
  name: string;      // "Kandang 1" dst.
  data: SensorData;
}

const fetchSensorData = async (name: string): Promise<SensorData> => {
  try {
    const locTag = name.replace(' ', '_'); // "Kandang_1"
    const res    = await fetch(`${API_BASE_URL}/api/kandang/${locTag}`);
    const json   = await res.json();
    console.log('RAW PAYLOAD FOR', name, json);

    // Mapping properti Influx → SensorData
    const d = json.data;
    return {
      temperature: d.S_T1,    // Influx field "S_T1"
      moisture:    d.S_H1,    // Influx field "S_H1"
      ammonia:     d.anemo,   // Influx field "anemo"
      lastUpdate:  new Date() // atau parse d._time jika ada
    };
  } catch (err) {
    console.error(`Failed to fetch data for ${name}:`, err);
    return {
      temperature: 0,
      moisture:    0,
      ammonia:     0,
      lastUpdate:  new Date()
    };
  }
};

export const Dashboard: React.FC = () => {
  const [farms, setFarms]         = useState<Farm[]>([
    { id: 1, name: 'Kandang 1', data: { temperature: 0, moisture: 0, ammonia: 0, lastUpdate: new Date() } },
    { id: 2, name: 'Kandang 2', data: { temperature: 0, moisture: 0, ammonia: 0, lastUpdate: new Date() } },
    { id: 3, name: 'Kandang 3', data: { temperature: 0, moisture: 0, ammonia: 0, lastUpdate: new Date() } }
  ]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh]   = useState(true);

  // fungsi untuk update semua kandang
  const updateAll = async () => {
    const updated = await Promise.all(
      farms.map(farm => fetchSensorData(farm.name).then(data => ({ ...farm, data })))
    );
    setFarms(updated);
  };

  // Auto-refresh setiap 5 detik
  useEffect(() => {
    if (!autoRefresh) return;
    updateAll(); // initial
    const iv = setInterval(updateAll, 5000);
    return () => clearInterval(iv);
  }, [autoRefresh]);

  // Manual refresh via tombol
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await updateAll();
    setIsRefreshing(false);
  };

  // Hitung status keseluruhan (bisa kamu sesuaikan kembali)
  const systemStatus = (() => {
    const all = farms.flatMap(farm => [
      farm.data.temperature,
      farm.data.moisture,
      farm.data.ammonia
    ]);
    const warnings = all.filter(v => v === 0 || isNaN(v)).length; // misal 0 dianggap warning
    return {
      status: warnings === 0 ? 'optimal' : 'warning',
      warningCount: warnings,
      totalSensors: all.length
    };
  })();

  return (
    <div className="min-h-screen bg-gradient-earth">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Chicken Farm Control System</h1>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => setAutoRefresh(!autoRefresh)}>
                {autoRefresh ? 'Auto-Refresh: ON' : 'Auto-Refresh: OFF'}
              </Button>

              <Button variant="farm" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
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
                <div className="text-2xl font-bold text-success">
                  {systemStatus.totalSensors - systemStatus.warningCount}
                </div>
                <div className="text-sm text-muted-foreground">Normal Readings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">{systemStatus.warningCount}</div>
                <div className="text-sm text-muted-foreground">Alerts</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid FarmCard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map(farm => (
            <FarmCard
              key={farm.id}
              farmId={farm.id}
              farmName={farm.name}
              data={farm.data}
            />
          ))}
        </div>

        {/* Optimal Ranges */}
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
                <span>18°C – 25°C</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-moisture bg-opacity-10">
                <span className="font-medium">Moisture:</span>
                <span>45% – 65%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-ammonia bg-opacity-10">
                <span className="font-medium">Ammonia:</span>
                <span>0 – 20 ppm</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};