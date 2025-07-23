//This is Dashboard.tsx

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Settings, AlertTriangle, Thermometer, Droplets, Wind } from 'lucide-react';
import { AppHeader } from './AppHeader';
import { useAlerts } from '@/contexts/AlertContext';


export interface SensorData {
  temperature: number;
  humidity: number;
  ammonia: number;
  lastUpdate: Date;
}

interface Farm {
  id: number;
  name: string;
  data: SensorData;
}


//Function to generate Alert Status
const generateAlerts = (farms: Farm[]) => {
  const warnings: Array<{farmId: number, farmName: string, sensor: string, value: string, threshold: string}> = [];
  const destructive: Array<{farmId: number, farmName: string, sensor: string, value: string, threshold: string}> = [];

  farms.forEach(farm => {
    const { data } = farm;
    
    // Check temperature
    const tempStatus = getStatus(data.temperature, 'temperature');
    if (tempStatus === 'warning') {
      warnings.push({
        farmId: farm.id,
        farmName: farm.name,
        sensor: 'Temperature',
        value: `${data.temperature.toFixed(1)}°C`,
        threshold: '18-25°C'
      });
    } else if (tempStatus === 'destructive') {
      destructive.push({
        farmId: farm.id,
        farmName: farm.name,
        sensor: 'Temperature',
        value: `${data.temperature.toFixed(1)}°C`,
        threshold: '18-25°C'
      });
    }

    // Check humidity
    const humidityStatus = getStatus(data.humidity, 'humidity');
    if (humidityStatus === 'warning') {
      warnings.push({
        farmId: farm.id,
        farmName: farm.name,
        sensor: 'humidity',
        value: `${data.humidity.toFixed(1)}%`,
        threshold: '45-65%'
      });
    } else if (humidityStatus === 'destructive') {
      destructive.push({
        farmId: farm.id,
        farmName: farm.name,
        sensor: 'humidity',
        value: `${data.humidity.toFixed(1)}%`,
        threshold: '45-65%'
      });
    }

    // Check ammonia
    const ammoniaStatus = getStatus(data.ammonia, 'ammonia');
    if (ammoniaStatus === 'warning') {
      warnings.push({
        farmId: farm.id,
        farmName: farm.name,
        sensor: 'Ammonia',
        value: `${data.ammonia.toFixed(1)} ppm`,
        threshold: '0-20 ppm'
      });
    } else if (ammoniaStatus === 'destructive') {
      destructive.push({
        farmId: farm.id,
        farmName: farm.name,
        sensor: 'Ammonia',
        value: `${data.ammonia.toFixed(1)} ppm`,
        threshold: '0-20 ppm'
      });
    }
  });

  return { warnings, destructive };
};

//Function to get status based on value and type
const getStatus = (value: number, type: string) => {
  if (type === 'temperature') {
    if (value >= 18 && value <= 25) return 'success';
    if (value > 30) return 'destructive';
    return 'warning';
  }
  if (type === 'humidity') {
    if (value >= 45 && value <= 65) return 'success';
    if (value > 80) return 'destructive';
    return 'warning';
  }
  if (type === 'ammonia') {
    if (value <= 20) return 'success';
    return 'destructive';
  }
};

// Mock FarmCard component for demo
const FarmCard = ({ farmId, farmName, data }) => {
  const getStatusColor = (value, type) => {
    if (type === 'temperature') {
      if (value >= 18 && value <= 25) return 'bg-green-500';
      if (value > 30) return 'bg-red-500';
      return 'bg-yellow-500';
    }
    if (type === 'humidity') {
      if (value >= 45 && value <= 65) return 'bg-green-500';
      if (value > 80) return 'bg-red-500';
      return 'bg-yellow-500';
    }
    if (type === 'ammonia') {
      if (value <= 20) return 'bg-green-500';
      return 'bg-red-500';
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
              getStatus(data.humidity, 'humidity') === 'success' && 
              getStatus(data.ammonia, 'ammonia') === 'success' 
                ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              getStatus(data.temperature, 'temperature') === 'success' && 
              getStatus(data.humidity, 'humidity') === 'success' && 
              getStatus(data.ammonia, 'ammonia') === 'success' 
                ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {getStatus(data.temperature, 'temperature') === 'success' && 
               getStatus(data.humidity, 'humidity') === 'success' && 
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

        {/* Humidity */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-200">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Humidity</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-800">{data.humidity.toFixed(1)}%</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              getStatus(data.humidity, 'humidity') === 'success' ? 'bg-green-100 text-green-800' :
              getStatus(data.humidity, 'humidity') === 'warning' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {getStatus(data.humidity, 'humidity')}
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

// const fetchSensorData = async (name: string): Promise<SensorData> => {
//   // Mock data for demo
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         temperature: Math.random() * 15 + 20, // 20-35°C
//         humidity: Math.random() * 40 + 40,    // 40-80%
//         ammonia: Math.random() * 25,          // 0-25 ppm
//         lastUpdate: new Date()
//       });
//     }, 500);
//   });
// };

// Simulate realistic sensor data with some variation
const generateSensorData = (): SensorData => ({
  temperature: 0,
  humidity: 0,
  ammonia: 0,
  lastUpdate: new Date()
});

const fetchSensorData = async (location: string): Promise<SensorData> => {
  try {
    const res = await fetch(`http://192.167.100.30:8000/api/kandang/${location.replace(" ", "_")}`);
    const json = await res.json();

    return {
      temperature: json.data.temperature,
      humidity: json.data.humidity,
      ammonia: json.data.ammonia,
      lastUpdate: new Date()
    };
  } catch (err) {
    console.error(`Failed to fetch data for ${location}:`, err);
    return {
      temperature: 0,
      humidity: 0,
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
  const { setAlerts } = useAlerts();
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
    const newAlerts = generateAlerts(farms);
    setAlerts(newAlerts);
    const iv = setInterval(updateAll, 5000);
    return () => clearInterval(iv);
  }, [autoRefresh, farms]);

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
      farm.data.humidity,
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

        {/* Farm Statistics */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Chickens */}
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-orange-100">
                    <svg className="h-5 w-5 text-orange-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5C13.1 1.9 12.6 1.4 12 1.4C11.4 1.4 10.9 1.9 10.5 2.5L9 1L3 7V9H5V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V9H21ZM11 20H7V9H11V20ZM17 20H13V9H17V20Z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Total Chickens</h3>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">247</div>
                <div className="text-sm text-green-600 font-medium mb-1">+12 this month</div>
                <div className="text-xs text-gray-500">Active laying hens</div>
              </div>

              {/* Feed Consumption */}
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-green-100">
                    <svg className="h-5 w-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L13.09 5.26L16 2L14.74 5.62L18 4L15.75 7.26L20 8L16.5 9.24L19 12L15.5 10.76L16 14L12.76 11.24L12 15L11.24 11.24L8 14L8.5 10.76L5 12L7.5 9.24L2 8L6.25 7.26L4 4L7.26 5.62L6 2L8.91 5.26L12 2Z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Feed Consumption</h3>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">145 kg</div>
                <div className="text-sm text-blue-600 font-medium mb-1">Normal levels</div>
                <div className="text-xs text-gray-500">Daily feed usage</div>
              </div>

              {/* Health Score */}
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-red-100">
                    <svg className="h-5 w-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Health Score</h3>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">94%</div>
                <div className="text-sm text-green-600 font-medium mb-1">+2% this week</div>
                <div className="text-xs text-gray-500">Flock health average</div>
              </div>

              {/* Production Rate - Added 4th item for balance */}
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-yellow-100">
                    <svg className="h-5 w-5 text-yellow-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5C13.1 1.9 12.6 1.4 12 1.4C11.4 1.4 10.9 1.9 10.5 2.5L9 1L3 7V9H5V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V9H21ZM11 20H7V9H11V20ZM17 20H13V9H17V20Z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Production Rate</h3>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">87%</div>
                <div className="text-sm text-green-600 font-medium mb-1">+5% this week</div>
                <div className="text-xs text-gray-500">Daily egg production</div>
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
                  <span className="font-medium text-gray-700">Humidity:</span>
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