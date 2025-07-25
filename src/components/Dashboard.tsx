//This is Dashboard.tsx

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Settings, AlertTriangle, Thermometer, Droplets, Wind, Activity } from 'lucide-react';
import { useAlerts } from '@/contexts/AlertContext';
import { useAuth } from '@/contexts/AuthContext';

export interface SensorData {
  temperature: number;
  humidity: number;
  ammonia: number;
  lastUpdate: Date;
}

interface Farm {
  id: number;
  name: string;
  location: string;
  fan_count: number;
  sensor_data?: any;
  data?: SensorData;
}

interface DailyData {
  farm_name: string;
  total_chickens: number;
  total_feed_kg: number;
  anak_kandang_count: number;
}

//Function to generate Alert Status
const generateAlerts = (farms: Farm[]) => {
  const warnings: Array<{farmId: number, farmName: string, sensor: string, value: string, threshold: string}> = [];
  const destructive: Array<{farmId: number, farmName: string, sensor: string, value: string, threshold: string}> = [];

  farms.forEach(farm => {
    const data = farm.data || farm.sensor_data;
    if (!data) return;
    
    // Check temperature
    const temp = data.S_TM || data.temperature;
    if (temp !== undefined) {
      const tempStatus = getStatus(temp, 'temperature');
      if (tempStatus === 'warning') {
        warnings.push({
          farmId: farm.id,
          farmName: farm.name,
          sensor: 'Temperature',
          value: `${temp.toFixed(1)}°C`,
          threshold: '18-25°C'
        });
      } else if (tempStatus === 'destructive') {
        destructive.push({
          farmId: farm.id,
          farmName: farm.name,
          sensor: 'Temperature',
          value: `${temp.toFixed(1)}°C`,
          threshold: '18-25°C'
        });
      }
    }

    // Check humidity
    const humidity = data.S_HM || data.humidity;
    if (humidity !== undefined) {
      const humidityStatus = getStatus(humidity, 'humidity');
      if (humidityStatus === 'warning') {
        warnings.push({
          farmId: farm.id,
          farmName: farm.name,
          sensor: 'Humidity',
          value: `${humidity.toFixed(1)}%`,
          threshold: '45-65%'
        });
      } else if (humidityStatus === 'destructive') {
        destructive.push({
          farmId: farm.id,
          farmName: farm.name,
          sensor: 'Humidity',
          value: `${humidity.toFixed(1)}%`,
          threshold: '45-65%'
        });
      }
    }

    // Check ammonia
    const ammonia = data.S_A1 || data.ammonia;
    if (ammonia !== undefined) {
      const ammoniaStatus = getStatus(ammonia, 'ammonia');
      if (ammoniaStatus === 'warning') {
        warnings.push({
          farmId: farm.id,
          farmName: farm.name,
          sensor: 'Ammonia',
          value: `${ammonia.toFixed(1)} ppm`,
          threshold: '0-20 ppm'
        });
      } else if (ammoniaStatus === 'destructive') {
        destructive.push({
          farmId: farm.id,
          farmName: farm.name,
          sensor: 'Ammonia',
          value: `${ammonia.toFixed(1)} ppm`,
          threshold: '0-20 ppm'
        });
      }
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
  return 'warning';
};

// FarmCard component
const FarmCard = ({ farm }) => {
  const data = farm.sensor_data || {};
  const temperature = data.S_TM || 0;
  const humidity = data.S_HM || 0;
  const ammonia = data.S_A1 || 0;

  const formatTime = (date) => {
    return new Date().toLocaleTimeString('en-US', { 
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
          <CardTitle className="text-lg font-semibold text-gray-800">{farm.name}</CardTitle>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              getStatus(temperature, 'temperature') === 'success' && 
              getStatus(humidity, 'humidity') === 'success' && 
              getStatus(ammonia, 'ammonia') === 'success' 
                ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              getStatus(temperature, 'temperature') === 'success' && 
              getStatus(humidity, 'humidity') === 'success' && 
              getStatus(ammonia, 'ammonia') === 'success' 
                ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {getStatus(temperature, 'temperature') === 'success' && 
               getStatus(humidity, 'humidity') === 'success' && 
               getStatus(ammonia, 'ammonia') === 'success' ? 'Normal' : 'Critical'}
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-500">Location: {farm.location}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Temperature */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-100 to-red-100">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Temperature</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-800">{temperature.toFixed(1)}°C</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              getStatus(temperature, 'temperature') === 'success' ? 'bg-green-100 text-green-800' :
              getStatus(temperature, 'temperature') === 'warning' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {getStatus(temperature, 'temperature')}
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
            <span className="text-lg font-bold text-gray-800">{humidity.toFixed(1)}%</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              getStatus(humidity, 'humidity') === 'success' ? 'bg-green-100 text-green-800' :
              getStatus(humidity, 'humidity') === 'warning' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {getStatus(humidity, 'humidity')}
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
            <span className="text-lg font-bold text-gray-800">{ammonia.toFixed(1)} ppm</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              getStatus(ammonia, 'ammonia') === 'success' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {getStatus(ammonia, 'ammonia')}
            </span>
          </div>
        </div>

        <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200">
          Last updated: {formatTime(new Date())}
        </div>
      </CardContent>
    </Card>
  );
};

export const Dashboard: React.FC = () => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const { setAlerts } = useAlerts();
  const { token } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://192.168.100.30:8000/api/company/dashboard-data', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFarms(data.farms || []);
        setDailyData(data.daily_data || []);
        
        // Generate and set alerts
        const newAlerts = generateAlerts(data.farms || []);
        setAlerts(newAlerts);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  // Auto-refresh every 5 seconds
  useEffect(() => {
    fetchDashboardData(); // Initial fetch
    
    if (autoRefresh) {
      const interval = setInterval(fetchDashboardData, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, token]);

  // Manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboardData();
    setIsRefreshing(false);
  };

  // Calculate totals from daily data
  const totals = dailyData.reduce((acc, data) => ({
    chickens: acc.chickens + (data.total_chickens || 0),
    feed: acc.feed + (data.total_feed_kg || 0),
    workers: acc.workers + (data.anak_kandang_count || 0)
  }), { chickens: 0, feed: 0, workers: 0 });

  // Calculate system status
  const systemStatus = (() => {
    const alerts = generateAlerts(farms);
    return {
      status: alerts.destructive.length > 0 ? 'critical' : alerts.warnings.length > 0 ? 'warning' : 'optimal',
      warningCount: alerts.warnings.length,
      criticalCount: alerts.destructive.length,
      totalSensors: farms.length * 3 // 3 sensors per farm
    };
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
            
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

      {/* Main Content */}
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
                  {systemStatus.totalSensors - systemStatus.warningCount - systemStatus.criticalCount}
                </div>
                <div className="text-sm text-gray-600">Normal Readings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {systemStatus.warningCount + systemStatus.criticalCount}
                </div>
                <div className="text-sm text-gray-600">Alerts</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Farm Statistics */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <div className="text-3xl font-bold text-gray-900 mb-1">{totals.chickens}</div>
                <div className="text-sm text-green-600 font-medium mb-1">Today's count</div>
                <div className="text-xs text-gray-500">From {totals.workers} workers</div>
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
                <div className="text-3xl font-bold text-gray-900 mb-1">{totals.feed.toFixed(1)} kg</div>
                <div className="text-sm text-blue-600 font-medium mb-1">Today's usage</div>
                <div className="text-xs text-gray-500">Across all farms</div>
              </div>

              {/* Active Workers */}
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Activity className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Active Workers</h3>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{totals.workers}</div>
                <div className="text-sm text-green-600 font-medium mb-1">Reported today</div>
                <div className="text-xs text-gray-500">Anak Kandang accounts</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Farm Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {farms.length > 0 ? (
            farms.map(farm => (
              <FarmCard key={farm.id} farm={farm} />
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="text-center py-12">
                <p className="text-gray-500">No farms found. Please contact your administrator.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Optimal Ranges */}
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