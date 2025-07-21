import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Droplets, Wind, AlertTriangle, CheckCircle } from 'lucide-react';

interface SensorData {
  temperature?: number;
  moisture?: number;
  ammonia?: number;
  lastUpdate?: string | Date;
}

interface FarmCardProps {
  farmId: number;
  farmName: string;
  data: SensorData;
}

// Helper untuk format angka secara aman
const formatNumber = (value: number | undefined, unit: string) =>
  typeof value === 'number' ? `${value.toFixed(1)}${unit}` : '—';

// Dapatkan warna status berdasarkan rentang
const getStatusColor = (value: number | undefined, type: 'temperature' | 'moisture' | 'ammonia') => {
  if (typeof value !== 'number') return 'destructive';
  const ranges = {
    temperature: { min: 18, max: 25 },
    moisture:    { min: 45, max: 65 },
    ammonia:     { min: 0,  max: 20 }
  }[type];

  if (value >= ranges.min && value <= ranges.max) return 'success';
  if (
    (value >= ranges.min - 3 && value < ranges.min) ||
    (value > ranges.max && value <= ranges.max + 3)
  ) return 'warning';
  return 'destructive';
};

// Icon sensor
const getSensorIcon = (type: 'temperature' | 'moisture' | 'ammonia') => {
  switch (type) {
    case 'temperature': return <Thermometer className="h-4 w-4" />;
    case 'moisture':    return <Droplets    className="h-4 w-4" />;
    case 'ammonia':     return <Wind        className="h-4 w-4" />;
  }
};

// Icon overall status
const StatusIcon = ({ status }: { status: 'success' | 'warning' | 'destructive' }) =>
  status === 'success'
    ? <CheckCircle    className="h-4 w-4 text-success" />
    : <AlertTriangle  className="h-4 w-4 text-warning" />;

export const FarmCard: React.FC<FarmCardProps> = ({ farmName, data }) => {
  const tempStatus     = getStatusColor(data.temperature, 'temperature');
  const moistureStatus = getStatusColor(data.moisture,    'moisture');
  const ammoniaStatus  = getStatusColor(data.ammonia,     'ammonia');

  // Overall: any destructive→destructive, else any warning→warning, else success
  const overallStatus: 'success' | 'warning' | 'destructive' =
    [tempStatus, moistureStatus, ammoniaStatus].includes('destructive')
      ? 'destructive'
      : [tempStatus, moistureStatus, ammoniaStatus].includes('warning')
        ? 'warning'
        : 'success';

  // Format lastUpdate dengan aman
  let formattedTime = '—';
  if (data.lastUpdate) {
    const dt = typeof data.lastUpdate === 'string'
      ? new Date(data.lastUpdate)
      : data.lastUpdate;
    if (!isNaN(dt.getTime())) {
      formattedTime = dt.toLocaleTimeString();
    }
  }

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
              variant={
                overallStatus === 'success'     ? 'default' :
                overallStatus === 'warning'     ? 'secondary' :
                                                  'destructive'
              }
              className="text-xs"
            >
              {overallStatus === 'success'     ? 'Optimal' :
               overallStatus === 'warning'     ? 'Warning' :
                                                 'Critical'}
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
              variant={
                tempStatus === 'success' ? 'default' :
                tempStatus === 'warning' ? 'secondary' :
                                           'destructive'
              }
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
              variant={
                moistureStatus === 'success' ? 'default' :
                moistureStatus === 'warning' ? 'secondary' :
                                              'destructive'
              }
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
              variant={
                ammoniaStatus === 'success' ? 'default' :
                ammoniaStatus === 'warning' ? 'secondary' :
                                             'destructive'
              }
              className="text-xs"
            >
              {ammoniaStatus}
            </Badge>
          </div>
        </div>

        {/* Last Update */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          Last updated: {formattedTime}
        </div>
      </CardContent>
    </Card>
  );
};
