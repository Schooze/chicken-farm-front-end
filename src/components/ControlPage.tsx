import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Fan, Utensils, Power, Settings, Activity, Clock, Snowflake, Loader2, AlertCircle } from 'lucide-react';
import { useCompanyFarms, FarmWithControls, FarmControls } from '@/hooks/useCompanyFarms';


export const ControlPage: React.FC = () => {
  const { farms, loading, error, updateFarmControls } = useCompanyFarms();
  const [selectedFarmId, setSelectedFarmId] = useState<string>('');
  const [tempFrequency, setTempFrequency] = useState<string>('');

  // Auto-select first farm when farms are loaded
  useEffect(() => {
    if (farms.length > 0 && !selectedFarmId) {
      setSelectedFarmId(farms[0].id.toString());
    }
  }, [farms, selectedFarmId]);

  const selectedFarm = farms.find(farm => farm.id.toString() === selectedFarmId);

  const handleControlToggle = (controlType: 'fan' | 'feeder' | 'coolingPad1' | 'coolingPad2') => {
    if (!selectedFarm) return;

    const currentValue = selectedFarm.controls[controlType];
    const updates: Partial<FarmControls> = {
      [controlType]: !currentValue,
      [`last${controlType.charAt(0).toUpperCase() + controlType.slice(1)}Toggle`]: new Date()
    };

    // When fan is turned off, set frequency to 0
    if (controlType === 'fan' && currentValue) {
      updates.fanFrequency = 0;
    }

    updateFarmControls(selectedFarm.id, updates);
  };

  const handleFrequencyChange = (value: number) => {
    if (!selectedFarm) return;

    // Ensure value is within 0-50Hz range
    const clampedValue = Math.max(0, Math.min(50, value));
    
    updateFarmControls(selectedFarm.id, {
      fanFrequency: clampedValue,
      // Fan is on only if frequency > 0
      fan: clampedValue > 0,
      lastFanToggle: new Date()
    });
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

  useEffect(() => {
    if (selectedFarm) {
      setTempFrequency(selectedFarm.controls.fanFrequency.toString());
    }
  }, [selectedFarmId, selectedFarm?.controls.fanFrequency]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading farm data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading farm data: {error}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // No farms state
  if (farms.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No farms found for your company. Please contact your administrator to set up farms.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Farm Control Center</h1>
        </div>
        <p className="text-gray-600">Control fans, feeders, and cooling systems for all chicken farms</p>
        <p className="text-sm text-gray-500 mt-1">
          Managing {farms.length} farm{farms.length !== 1 ? 's' : ''} • Total fans: {farms.reduce((sum, farm) => sum + farm.fan_count, 0)}
        </p>
      </div>

      {/* Farm Selection and Status Overview - Side by Side */}
      <div className="grid grid-cols-10 gap-6 mb-8">
        {/* Farm Selection - 2/10 */}
        <div className="col-span-2">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Select Farm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedFarmId} onValueChange={setSelectedFarmId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a farm to control" />
                </SelectTrigger>
                <SelectContent>
                  {farms.map((farm) => (
                    <SelectItem key={farm.id} value={farm.id.toString()}>
                      {farm.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedFarm && (
                <div className="mt-2 text-xs text-gray-600">
                  <p>Location: {selectedFarm.location}</p>
                  <p>Fans: {selectedFarm.fan_count}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Status Overview - 8/10 */}
        <div className="col-span-8">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                All Farms Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {farms.map((farm) => (
                  <div 
                    key={farm.id} 
                    className={`p-4 rounded-lg border transition-all duration-300 ${
                      farm.id.toString() === selectedFarmId 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 bg-white/50'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900 mb-1">{farm.name}</h3>
                    <p className="text-xs text-gray-500 mb-3">{farm.location} • {farm.fan_count} fans</p>
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
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Snowflake className={`h-4 w-4 ${farm.controls.coolingPad1 || farm.controls.coolingPad2 ? 'text-cyan-500' : 'text-gray-400'}`} />
                          <span className="text-sm">Cooling</span>
                          <div className="flex gap-1">
                            {farm.controls.coolingPad1 && (
                              <span className="text-xs text-cyan-600 bg-cyan-100 px-1 rounded">1</span>
                            )}
                            {farm.controls.coolingPad2 && (
                              <span className="text-xs text-cyan-600 bg-cyan-100 px-1 rounded">2</span>
                            )}
                          </div>
                        </div>
                        <Badge 
                          variant={getStatusColor(farm.controls.coolingPad1 || farm.controls.coolingPad2) as any}
                          className={`text-xs ${(farm.controls.coolingPad1 || farm.controls.coolingPad2) ? 'bg-green-500 text-white hover:bg-green-600' : ''}`}
                        >
                          {getStatusText(farm.controls.coolingPad1 || farm.controls.coolingPad2)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Control Panel */}
      {selectedFarm && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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
                  <p className="font-medium text-gray-900">Ventilation Fans</p>
                  <p className="text-sm text-gray-600">Controls air circulation ({selectedFarm.fan_count} fans available)</p>
                </div>
                <Badge 
                  variant={getStatusColor(selectedFarm.controls.fan) as any}
                  className={`text-sm px-3 py-1 ${selectedFarm.controls.fan ? 'bg-green-500 text-white hover:bg-green-600' : ''}`}
                >
                  {getStatusText(selectedFarm.controls.fan)}
                </Badge>
              </div>

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
                  Range: 0-50Hz. Controls all {selectedFarm.fan_count} fans simultaneously.
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
                  <p className="text-sm text-gray-600">Controls food dispensing for {selectedFarm.name}</p>
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

          {/* Cooling Pad Control */}
          <Card className="hover:shadow-xl transition-all duration-300 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Snowflake className={`h-6 w-6 ${selectedFarm.controls.coolingPad1 || selectedFarm.controls.coolingPad2 ? 'text-cyan-500' : 'text-gray-400'}`} />
                Cooling Pad Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-cyan-50">
                <div>
                  <p className="font-medium text-gray-900">Evaporative Cooling</p>
                  <p className="text-sm text-gray-600">Controls temperature reduction for {selectedFarm.name}</p>
                </div>
                <div className="flex gap-2">
                  {selectedFarm.controls.coolingPad1 && (
                    <Badge className="text-xs bg-cyan-500 text-white">PAD 1</Badge>
                  )}
                  {selectedFarm.controls.coolingPad2 && (
                    <Badge className="text-xs bg-cyan-500 text-white">PAD 2</Badge>
                  )}
                  {!selectedFarm.controls.coolingPad1 && !selectedFarm.controls.coolingPad2 && (
                    <Badge variant="secondary" className="text-xs">OFF</Badge>
                  )}
                </div>
              </div>
              
              {/* Cooling Pad 1 Button */}
              <Button 
                variant={selectedFarm.controls.coolingPad1 ? 'destructive' : 'default'}
                size="lg"
                onClick={() => handleControlToggle('coolingPad1')}
                className={`w-full transition-all duration-300 text-white ${
                  selectedFarm.controls.coolingPad1 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-cyan-600 hover:bg-cyan-700'
                }`}
              >
                <Snowflake className="h-4 w-4 mr-2" />
                Turn {selectedFarm.controls.coolingPad1 ? 'OFF' : 'ON'} Cooling Pad 1
              </Button>

              {/* Cooling Pad 2 Button */}
              <Button 
                variant={selectedFarm.controls.coolingPad2 ? 'destructive' : 'default'}
                size="lg"
                onClick={() => handleControlToggle('coolingPad2')}
                className={`w-full transition-all duration-300 text-white ${
                  selectedFarm.controls.coolingPad2 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-cyan-600 hover:bg-cyan-700'
                }`}
              >
                <Snowflake className="h-4 w-4 mr-2" />
                Turn {selectedFarm.controls.coolingPad2 ? 'OFF' : 'ON'} Cooling Pad 2
              </Button>

              <div className="p-3 rounded-lg bg-cyan-50/50 border border-cyan-200">
                <div className="flex items-center gap-2 mb-2">
                  <Snowflake className="h-4 w-4 text-cyan-500" />
                  <span className="text-sm font-medium text-cyan-700">Cooling System Info</span>
                </div>
                <p className="text-xs text-cyan-600">
                  Dual evaporative cooling system helps reduce ambient temperature by 5-10°C through water evaporation. Use both pads for maximum cooling efficiency.
                </p>
              </div>

              {/* Last Toggle Times */}
              <div className="space-y-1">
                {selectedFarm.controls.lastCoolingPad1Toggle && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    Pad 1 last toggled: {selectedFarm.controls.lastCoolingPad1Toggle.toLocaleTimeString()}
                  </div>
                )}
                {selectedFarm.controls.lastCoolingPad2Toggle && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    Pad 2 last toggled: {selectedFarm.controls.lastCoolingPad2Toggle.toLocaleTimeString()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
};

export default ControlPage;