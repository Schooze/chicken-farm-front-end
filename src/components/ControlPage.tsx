import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Fan, Utensils, Power, Settings, Activity, Clock } from 'lucide-react';

interface FarmControls {
  fan: boolean;
  feeder: boolean;
  lastFanToggle?: Date;
  lastFeederToggle?: Date;
}

interface Farm {
  id: string;
  name: string;
  controls: FarmControls;
}

export const ControlPage: React.FC = () => {
  const [farms, setFarms] = useState<Farm[]>([
    { 
      id: 'alpha', 
      name: 'Farm Alpha', 
      controls: { fan: false, feeder: false } 
    },
    { 
      id: 'beta', 
      name: 'Farm Beta', 
      controls: { fan: true, feeder: false } 
    },
    { 
      id: 'gamma', 
      name: 'Farm Gamma', 
      controls: { fan: false, feeder: true } 
    }
  ]);

  const [selectedFarmId, setSelectedFarmId] = useState<string>('alpha');
  const selectedFarm = farms.find(farm => farm.id === selectedFarmId);

  const handleControlToggle = (controlType: 'fan' | 'feeder') => {
    setFarms(currentFarms => 
      currentFarms.map(farm => 
        farm.id === selectedFarmId 
          ? {
              ...farm,
              controls: {
                ...farm.controls,
                [controlType]: !farm.controls[controlType],
                [`last${controlType.charAt(0).toUpperCase() + controlType.slice(1)}Toggle`]: new Date()
              }
            }
          : farm
      )
    );
  };

  const getStatusColor = (isActive: boolean) => isActive ? 'success' : 'secondary';
  const getStatusText = (isActive: boolean) => isActive ? 'ON' : 'OFF';

  return (
    <div className="min-h-screen bg-gradient-earth p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Farm Control Center</h1>
        </div>
        <p className="text-muted-foreground">Control fans and feeders for all chicken farms</p>
      </div>

      {/* Farm Selection */}
      <Card className="mb-8 bg-card/80 backdrop-blur-sm shadow-farm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Select Farm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedFarmId} onValueChange={setSelectedFarmId}>
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Choose a farm to control" />
            </SelectTrigger>
            <SelectContent>
              {farms.map((farm) => (
                <SelectItem key={farm.id} value={farm.id}>
                  {farm.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Control Panel */}
      {selectedFarm && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Fan Control */}
          <Card className="hover:shadow-elevated transition-all duration-300 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fan className={`h-6 w-6 ${selectedFarm.controls.fan ? 'animate-spin text-accent' : 'text-muted-foreground'}`} />
                Fan Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-tech bg-opacity-10">
                <div>
                  <p className="font-medium text-foreground">Ventilation Fan</p>
                  <p className="text-sm text-muted-foreground">Controls air circulation</p>
                </div>
                <Badge 
                  variant={getStatusColor(selectedFarm.controls.fan) as any}
                  className="text-sm px-3 py-1"
                >
                  {getStatusText(selectedFarm.controls.fan)}
                </Badge>
              </div>
              
              <Button 
                variant={selectedFarm.controls.fan ? 'danger' : 'success'}
                size="lg"
                onClick={() => handleControlToggle('fan')}
                className="w-full transition-all duration-300"
              >
                <Power className="h-4 w-4 mr-2" />
                Turn {selectedFarm.controls.fan ? 'OFF' : 'ON'} Fan
              </Button>

              {selectedFarm.controls.lastFanToggle && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Last toggled: {selectedFarm.controls.lastFanToggle.toLocaleTimeString()}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Feeder Control */}
          <Card className="hover:shadow-elevated transition-all duration-300 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className={`h-6 w-6 ${selectedFarm.controls.feeder ? 'text-warning' : 'text-muted-foreground'}`} />
                Feeder Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-ammonia bg-opacity-10">
                <div>
                  <p className="font-medium text-foreground">Automatic Feeder</p>
                  <p className="text-sm text-muted-foreground">Controls food dispensing</p>
                </div>
                <Badge 
                  variant={getStatusColor(selectedFarm.controls.feeder) as any}
                  className="text-sm px-3 py-1"
                >
                  {getStatusText(selectedFarm.controls.feeder)}
                </Badge>
              </div>
              
              <Button 
                variant={selectedFarm.controls.feeder ? 'danger' : 'success'}
                size="lg"
                onClick={() => handleControlToggle('feeder')}
                className="w-full transition-all duration-300"
              >
                <Power className="h-4 w-4 mr-2" />
                Turn {selectedFarm.controls.feeder ? 'OFF' : 'ON'} Feeder
              </Button>

              {selectedFarm.controls.lastFeederToggle && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Last toggled: {selectedFarm.controls.lastFeederToggle.toLocaleTimeString()}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Status Overview */}
      <Card className="bg-card/80 backdrop-blur-sm shadow-farm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            All Farms Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {farms.map((farm) => (
              <div 
                key={farm.id} 
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  farm.id === selectedFarmId 
                    ? 'border-primary bg-primary/5 shadow-glow-success' 
                    : 'border-border bg-background/50'
                }`}
              >
                <h3 className="font-semibold text-foreground mb-3">{farm.name}</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Fan className={`h-4 w-4 ${farm.controls.fan ? 'animate-spin text-accent' : 'text-muted-foreground'}`} />
                      <span className="text-sm">Fan</span>
                    </div>
                    <Badge 
                      variant={getStatusColor(farm.controls.fan) as any}
                      className="text-xs"
                    >
                      {getStatusText(farm.controls.fan)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Utensils className={`h-4 w-4 ${farm.controls.feeder ? 'text-warning' : 'text-muted-foreground'}`} />
                      <span className="text-sm">Feeder</span>
                    </div>
                    <Badge 
                      variant={getStatusColor(farm.controls.feeder) as any}
                      className="text-xs"
                    >
                      {getStatusText(farm.controls.feeder)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};