import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Droplets, Wind, AlertTriangle, CheckCircle } from 'lucide-react';

interface SensorData {
  temperature: number;
  moisture: number;
  ammonia: number;
  lastUpdate: Date;
}

interface FarmCardProps {
  farmId: number;
  farmName: string;
  data: SensorData;
}

const formatNumber = (value: number | undefined | null, unit: string) => {
  return typeof value === 'number' ? `${value.toFixed(1)}${unit}` : '—';
};

const getStatusColor = (value: number, type: 'temperature' | 'moisture' | 'ammonia') => {
  const ranges = {
    temperature: { min: 18, max: 25, unit: '°C' },
    moisture: { min: 45, max: 65, unit: '%' },
    ammonia: { min: 0, max: 20, unit: 'ppm' }
  };

  const range = ranges[type];
  if (value >= range.min && value <= range.max) {
    return 'success';
  } else if (
    (value >= range.min - 3 && value < range.min) ||
    (value > range.max && value <= range.max + 3)
  ) {
    return 'warning';
  } else {
    return 'danger';
  }
};

const getSensorIcon = (type: 'temperature' | 'moisture' | 'ammonia') => {
  switch (type) {
    case 'temperature':
      return <Thermometer className="h-4 w-4" />;
    case 'moisture':
      return <Droplets className="h-4 w-4" />;
    case 'ammonia':
      return <Wind className="h-4 w-4" />;
  }
};

const StatusIcon = ({ status }: { status: string }) => {
  if (status === 'success') return <CheckCircle className="h-4 w-4 text-success" />;
  return <AlertTriangle className="h-4 w-4 text-warning" />;
};

export const FarmCard: React.FC<FarmCardProps> = ({ farmId, farmName, data }) => {
  const tempStatus = getStatusColor(data.temperature, 'temperature');
  const moistureStatus = getStatusColor(data.moisture, 'moisture');
  const ammoniaStatus = getStatusColor(data.ammonia, 'ammonia');

  const overallStatus = [tempStatus, moistureStatus, ammoniaStatus].some(s => s === 'danger') 
    ? 'danger' 
    : [tempStatus, moistureStatus, ammoniaStatus].some(s => s === 'warning')
    ? 'warning'
    : 'success';

  return (
    <Card className="hover:shadow-farm transition-all duration-300 transform hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            {farmName}
          </CardTitle>
          <div className="flex items-center gap-2">
            <StatusIcon status={overallStatus} />
            <Badge 
              variant={overallStatus === 'success' ? 'default' : overallStatus === 'warning' ? 'secondary' : 'destructive'}
              className="text-xs"
            >
              {overallStatus === 'success' ? 'Optimal' : overallStatus === 'warning' ? 'Warning' : 'Critical'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Temperature */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-temperature bg-opacity-10">
          <div className="flex items-center gap-2">
            {getSensorIcon('temperature')}
            <span className="font-medium text-sm">Temperature</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{formatNumber(data.temperature, '°C')}</span>
            <Badge 
              variant={tempStatus === 'success' ? 'default' : tempStatus === 'warning' ? 'secondary' : 'destructive'}
              className="text-xs"
            >
              {tempStatus}
            </Badge>
          </div>
        </div>

        {/* Moisture */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-moisture bg-opacity-10">
          <div className="flex items-center gap-2">
            {getSensorIcon('moisture')}
            <span className="font-medium text-sm">Moisture</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{formatNumber(data.moisture, '%')}</span>
            <Badge 
              variant={moistureStatus === 'success' ? 'default' : moistureStatus === 'warning' ? 'secondary' : 'destructive'}
              className="text-xs"
            >
              {moistureStatus}
            </Badge>
          </div>
        </div>

        {/* Ammonia */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-ammonia bg-opacity-10">
          <div className="flex items-center gap-2">
            {getSensorIcon('ammonia')}
            <span className="font-medium text-sm">Ammonia</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{formatNumber(data.ammonia, ' ppm')}</span>
            <Badge 
              variant={ammoniaStatus === 'success' ? 'default' : ammoniaStatus === 'warning' ? 'secondary' : 'destructive'}
              className="text-xs"
            >
              {ammoniaStatus}
            </Badge>
          </div>
        </div>

        {/* Last Update */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          Last updated: {data.lastUpdate ? new Date(data.lastUpdate).toLocaleTimeString() : '—'}
        </div>
      </CardContent>
    </Card>
  );
};