import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Fan, Utensils, Power, Settings, Activity, Clock } from 'lucide-react';

interface FarmControls {
  fan: boolean;
  fanFrequency: number;
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
      controls: { fan: false, fanFrequency: 0, feeder: false } 
    },
    { 
      id: 'beta', 
      name: 'Farm Beta', 
      controls: { fan: true, fanFrequency: 30, feeder: false } 
    },
    { 
      id: 'gamma', 
      name: 'Farm Gamma', 
      controls: { fan: false, fanFrequency: 0, feeder: true } 
    }
  ]);

  const [selectedFarmId, setSelectedFarmId] = useState<string>('alpha');
  const [tempFrequency, setTempFrequency] = useState<string>('');
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
                ...(controlType === 'fan' && !farm.controls.fan ? { fanFrequency: 0 } : {}),
                [`last${controlType.charAt(0).toUpperCase() + controlType.slice(1)}Toggle`]: new Date()
              }
            }
          : farm
      )
    );
  };

  const handleFrequencyChange = (value: number) => {
    // Ensure value is within 0-50Hz range
    const clampedValue = Math.max(0, Math.min(50, value));
    
    setFarms(currentFarms => 
      currentFarms.map(farm => 
        farm.id === selectedFarmId 
          ? {
              ...farm,
              controls: {
                ...farm.controls,
                fanFrequency: clampedValue,
                fan: clampedValue > 0, // Auto turn on fan if frequency > 0
                lastFanToggle: new Date()
              }
            }
          : farm
      )
    );
  };

  const handleFrequencyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseFloat(value);
    
    if (!isNaN(numValue)) {
      // Clamp the display value as well
      const clampedValue = Math.max(0, Math.min(50, numValue));
      setTempFrequency(clampedValue.toString());
      handleFrequencyChange(numValue);
    } else {
      setTempFrequency(value);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    handleFrequencyChange(value);
    setTempFrequency(value.toString());
  };

  const getStatusColor = (isActive: boolean) => isActive ? 'success' : 'secondary';
  const getStatusText = (isActive: boolean) => isActive ? 'ON' : 'OFF';

  React.useEffect(() => {
    if (selectedFarm) {
      setTempFrequency(selectedFarm.controls.fanFrequency.toString());
    }
  }, [selectedFarmId, selectedFarm?.controls.fanFrequency]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Farm Control Center</h1>
        </div>
        <p className="text-gray-600">Control fans and feeders for all chicken farms</p>
      </div>

      {/* Farm Selection */}
      <Card className="mb-8 bg-white/80 backdrop-blur-sm shadow-lg">
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
          <Card className="hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fan className={`h-6 w-6 ${selectedFarm.controls.fan ? 'animate-spin text-blue-500' : 'text-gray-400'}`} />
                Fan Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50">
                <div>
                  <p className="font-medium text-gray-900">Ventilation Fan</p>
                  <p className="text-sm text-gray-600">Controls air circulation</p>
                </div>
                <Badge 
                  variant={getStatusColor(selectedFarm.controls.fan) as any}
                  className={`text-sm px-3 py-1 ${selectedFarm.controls.fan ? 'bg-green-500 text-white hover:bg-green-600' : ''}`}
                >
                  {getStatusText(selectedFarm.controls.fan)}
                </Badge>
              </div>
              
              {/* On/Off Toggle */}
              <Button 
                variant={selectedFarm.controls.fan ? 'destructive' : 'default'}
                size="lg"
                onClick={() => handleControlToggle('fan')}
                className={`w-full transition-all duration-300 text-white ${
                  selectedFarm.controls.fan 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                <Power className="h-4 w-4 mr-2" />
                Turn {selectedFarm.controls.fan ? 'OFF' : 'ON'} Fan
              </Button>

              {/* Frequency Control */}
              <div className="space-y-4 p-4 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Frequency Control
                  </label>
                  <span className="text-sm text-gray-600">
                    {selectedFarm.controls.fanFrequency}Hz
                  </span>
                </div>
                
                {/* Slider and Manual Input Side by Side */}
                <div className="flex items-center gap-4">
                  {/* Slider - 8/10 width */}
                  <div className="flex-[8] space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={selectedFarm.controls.fanFrequency}
                      onChange={handleSliderChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(selectedFarm.controls.fanFrequency / 50) * 100}%, #e5e7eb ${(selectedFarm.controls.fanFrequency / 50) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0Hz</span>
                      <span>25Hz</span>
                      <span>50Hz</span>
                    </div>
                  </div>

                  {/* Manual Input - 2/10 width */}
                  <div className="flex-[2] flex flex-col items-center gap-1">
                    <label className="text-xs text-gray-600">Manual</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={tempFrequency}
                        onChange={handleFrequencyInput}
                        className="px-2 py-1 border border-gray-300 rounded-md text-sm w-16 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                        placeholder="0-50"
                      />
                      <span className="text-xs text-gray-600">Hz</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500">
                  Range: 0-50Hz. Values outside this range will be automatically adjusted.
                </p>
              </div>

              {selectedFarm.controls.lastFanToggle && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  Last updated: {selectedFarm.controls.lastFanToggle.toLocaleTimeString()}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Feeder Control */}
          <Card className="hover:shadow-xl transition-all duration-300 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className={`h-6 w-6 ${selectedFarm.controls.feeder ? 'text-orange-500' : 'text-gray-400'}`} />
                Feeder Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-orange-50">
                <div>
                  <p className="font-medium text-gray-900">Automatic Feeder</p>
                  <p className="text-sm text-gray-600">Controls food dispensing</p>
                </div>
                <Badge 
                  variant={getStatusColor(selectedFarm.controls.feeder) as any}
                  className={`text-sm px-3 py-1 ${selectedFarm.controls.feeder ? 'bg-green-500 text-white hover:bg-green-600' : ''}`}
                >
                  {getStatusText(selectedFarm.controls.feeder)}
                </Badge>
              </div>
              
              <Button 
                variant={selectedFarm.controls.feeder ? 'destructive' : 'default'}
                size="lg"
                onClick={() => handleControlToggle('feeder')}
                className={`w-full transition-all duration-300 text-white ${
                  selectedFarm.controls.feeder 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                <Power className="h-4 w-4 mr-2" />
                Turn {selectedFarm.controls.feeder ? 'OFF' : 'ON'} Feeder
              </Button>

              {selectedFarm.controls.lastFeederToggle && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  Last toggled: {selectedFarm.controls.lastFeederToggle.toLocaleTimeString()}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Status Overview */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
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
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-gray-200 bg-white/50'
                }`}
              >
                <h3 className="font-semibold text-gray-900 mb-3">{farm.name}</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Fan className={`h-4 w-4 ${farm.controls.fan ? 'animate-spin text-blue-500' : 'text-gray-400'}`} />
                      <span className="text-sm">Fan</span>
                      {farm.controls.fan && (
                        <span className="text-xs text-gray-500">({farm.controls.fanFrequency}Hz)</span>
                      )}
                    </div>
                    <Badge 
                      variant={getStatusColor(farm.controls.fan) as any}
                      className={`text-xs ${farm.controls.fan ? 'bg-green-500 text-white hover:bg-green-600' : ''}`}
                    >
                      {getStatusText(farm.controls.fan)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Utensils className={`h-4 w-4 ${farm.controls.feeder ? 'text-orange-500' : 'text-gray-400'}`} />
                      <span className="text-sm">Feeder</span>
                    </div>
                    <Badge 
                      variant={getStatusColor(farm.controls.feeder) as any}
                      className={`text-xs ${farm.controls.feeder ? 'bg-green-500 text-white hover:bg-green-600' : ''}`}
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

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}