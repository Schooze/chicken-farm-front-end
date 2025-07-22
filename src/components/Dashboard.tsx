import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Settings, AlertTriangle, Thermometer, Droplets, Wind } from 'lucide-react';

export interface SensorData {
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

// Mock FarmCard component for demo
const FarmCard = ({ farmId, farmName, data }) => {
  const getStatusColor = (value, type) => {
    if (type === 'temperature') {
      if (value >= 18 && value <= 25) return 'bg-green-500';
      if (value > 30) return 'bg-red-500';
      return 'bg-yellow-500';
    }
    if (type === 'moisture') {
      if (value >= 45 && value <= 65) return 'bg-green-500';
      if (value > 80) return 'bg-red-500';
      return 'bg-yellow-500';
    }
    if (type === 'ammonia') {
      if (value <= 20) return 'bg-green-500';
      return 'bg-red-500';
    }
  };

  const getStatus = (value, type) => {
    if (type === 'temperature') {
      if (value >= 18 && value <= 25) return 'success';
      if (value > 30) return 'destructive';
      return 'warning';
    }
    if (type === 'moisture') {
      if (value >= 45 && value <= 65) return 'success';
      if (value > 80) return 'destructive';
      return 'warning';
    }
    if (type === 'ammonia') {
      if (value <= 20) return 'success';
      return 'destructive';
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false 
    });
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800">{farmName}</CardTitle>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              getStatus(data.temperature, 'temperature') === 'success' && 
              getStatus(data.moisture, 'moisture') === 'success' && 
              getStatus(data.ammonia, 'ammonia') === 'success' 
                ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              getStatus(data.temperature, 'temperature') === 'success' && 
              getStatus(data.moisture, 'moisture') === 'success' && 
              getStatus(data.ammonia, 'ammonia') === 'success' 
                ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {getStatus(data.temperature, 'temperature') === 'success' && 
               getStatus(data.moisture, 'moisture') === 'success' && 
               getStatus(data.ammonia, 'ammonia') === 'success' ? 'Normal' : 'Critical'}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Temperature */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-100 to-red-100">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Temperature</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-800">{data.temperature.toFixed(1)}°C</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              getStatus(data.temperature, 'temperature') === 'success' ? 'bg-green-100 text-green-800' :
              getStatus(data.temperature, 'temperature') === 'warning' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {getStatus(data.temperature, 'temperature')}
            </span>
          </div>
        </div>

        {/* Moisture */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-200">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Moisture</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-800">{data.moisture.toFixed(1)}%</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              getStatus(data.moisture, 'moisture') === 'success' ? 'bg-green-100 text-green-800' :
              getStatus(data.moisture, 'moisture') === 'warning' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {getStatus(data.moisture, 'moisture')}
            </span>
          </div>
        </div>

        {/* Ammonia */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-200">
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-gray-700">Ammonia</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-800">{data.ammonia.toFixed(1)} ppm</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              getStatus(data.ammonia, 'ammonia') === 'success' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {getStatus(data.ammonia, 'ammonia')}
            </span>
          </div>
        </div>

        <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200">
          Last updated: {formatTime(data.lastUpdate)}
        </div>
      </CardContent>
    </Card>
  );
};

const fetchSensorData = async (name: string): Promise<SensorData> => {
  // Mock data for demo
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        temperature: Math.random() * 15 + 20, // 20-35°C
        moisture: Math.random() * 40 + 40,    // 40-80%
        ammonia: Math.random() * 25,          // 0-25 ppm
        lastUpdate: new Date()
      });
    }, 500);
  });
};

export const Dashboard: React.FC = () => {
  const [farms, setFarms] = useState<Farm[]>([
    { id: 1, name: 'Kandang 1', data: { temperature: 28.0, moisture: 83.0, ammonia: 4.8, lastUpdate: new Date() } },
    { id: 2, name: 'Kandang 2', data: { temperature: 28.3, moisture: 65.7, ammonia: 15.3, lastUpdate: new Date() } },
    { id: 3, name: 'Kandang 3', data: { temperature: 33.4, moisture: 66.2, ammonia: 1.5, lastUpdate: new Date() } }
  ]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

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

  // Hitung status keseluruhan
  const systemStatus = (() => {
    const all = farms.flatMap(farm => [
      farm.data.temperature,
      farm.data.moisture,
      farm.data.ammonia
    ]);
    const warnings = all.filter(v => v === 0 || isNaN(v)).length;
    return {
      status: warnings === 0 ? 'optimal' : 'warning',
      warningCount: warnings,
      totalSensors: all.length
    };
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">Chicken Farm Control System</h1>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setAutoRefresh(!autoRefresh)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                {autoRefresh ? 'Auto-Refresh: ON' : 'Auto-Refresh: OFF'}
              </Button>

              <Button 
                variant="default" 
                size="sm" 
                onClick={handleRefresh} 
                disabled={isRefreshing}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Fixed container consistency */}
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {/* System Overview */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Settings className="h-5 w-5" />
              System Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{farms.length}</div>
                <div className="text-sm text-gray-600">Active Farms</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{systemStatus.totalSensors}</div>
                <div className="text-sm text-gray-600">Total Sensors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {systemStatus.totalSensors - systemStatus.warningCount}
                </div>
                <div className="text-sm text-gray-600">Normal Readings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{systemStatus.warningCount}</div>
                <div className="text-sm text-gray-600">Alerts</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid FarmCard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {farms.map(farm => (
            <FarmCard
              key={farm.id}
              farmId={farm.id}
              farmName={farm.name}
              data={farm.data}
            />
          ))}
        </div>

        {/* Optimal Ranges - Fixed width alignment */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <AlertTriangle className="h-5 w-5" />
              Optimal Ranges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-100 to-red-100 border border-gray-200">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-gray-600" />
                  <span className="font-medium text-gray-700">Temperature:</span>
                </div>
                <span className="font-semibold text-gray-800">18°C – 25°C</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-100 to-blue-200 border border-gray-200">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-gray-700">Moisture:</span>
                </div>
                <span className="font-semibold text-gray-800">45% – 65%</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-yellow-100 to-orange-200 border border-gray-200">
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-gray-700">Ammonia:</span>
                </div>
                <span className="font-semibold text-gray-800">0 – 20 ppm</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};