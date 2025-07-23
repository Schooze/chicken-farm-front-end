import React, { useState } from 'react';
import { Activity, RefreshCw, AlertTriangle, AlertCircle, X, CheckCircle, PanelLeftOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSidebar } from '@/components/ui/sidebar';

// Mock data untuk demo - dalam implementasi nyata, ini akan datang dari props atau context
// const mockFarmAlerts = {
//   warnings: [
//     { farmId: 1, farmName: 'Kandang 1', sensor: 'Moisture', value: '66.2%', threshold: '45-65%' },
//     { farmId: 3, farmName: 'Kandang 3', sensor: 'Temperature', value: '26.8°C', threshold: '18-25°C' }
//   ],
//   destructive: [
//     { farmId: 1, farmName: 'Kandang 1', sensor: 'Temperature', value: '33.4°C', threshold: '18-25°C' },
//     { farmId: 2, farmName: 'Kandang 2', sensor: 'Ammonia', value: '25.3 ppm', threshold: '0-20 ppm' }
//   ]
// };

interface AppHeaderProps {
  alerts: {
    warnings: Array<{farmId: number, farmName: string, sensor: string, value: string, threshold: string}>;
    destructive: Array<{farmId: number, farmName: string, sensor: string, value: string, threshold: string}>;
  };
}

// interface AlertPopupProps {
//   isOpen: boolean;
//   onClose: () => void;
//   warnings: Array<{farmId: number, farmName: string, sensor: string, value: string, threshold: string}>;
//   destructive: Array<{farmId: number, farmName: string, sensor: string, value: string, threshold: string}>;
// }

const AlertPopup: React.FC<AlertPopupProps> = ({ isOpen, onClose, warnings, destructive }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl mx-4 bg-white shadow-2xl border-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-orange-500" />
            System Alerts Overview
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Destructive Alerts */}
          {destructive.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-semibold text-red-700">
                  Critical Alerts ({destructive.length})
                </h3>
              </div>
              <div className="space-y-2">
                {destructive.map((alert, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-red-800">{alert.farmName}</span>
                      <span className="text-sm text-red-600">{alert.sensor}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-red-800">{alert.value}</div>
                      <div className="text-xs text-red-600">Normal: {alert.threshold}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warning Alerts */}
          {warnings.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-yellow-700">
                  Warning Alerts ({warnings.length})
                </h3>
              </div>
              <div className="space-y-2">
                {warnings.map((alert, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-yellow-800">{alert.farmName}</span>
                      <span className="text-sm text-yellow-600">{alert.sensor}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-yellow-800">{alert.value}</div>
                      <div className="text-xs text-yellow-600">Normal: {alert.threshold}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Alerts */}
          {warnings.length === 0 && destructive.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-green-700 mb-2">All Systems Optimal</h3>
              <p className="text-gray-600">No alerts or warnings detected</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                // Implement refresh logic here
                console.log('Refreshing data...');
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export function AppHeader({ alerts }: AppHeaderProps) {
  const [showAlerts, setShowAlerts] = useState(false);
  const { toggleSidebar } = useSidebar();


  // Calculate alert counts
  // const warningCount = mockFarmAlerts.warnings.length;
  const warningCount = alerts.warnings.length;
  // const destructiveCount = mockFarmAlerts.destructive.length;
  const destructiveCount = alerts.destructive.length;
  const totalAlerts = warningCount + destructiveCount;
  
  // Determine status
  const getSystemStatus = () => {
    if (destructiveCount > 0) {
      return {
        status: 'critical',
        color: 'red',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        borderColor: 'border-red-200',
        dotColor: 'bg-red-500',
        message: `${destructiveCount} Critical Alert${destructiveCount > 1 ? 's' : ''}`
      };
    } else if (warningCount > 0) {
      return {
        status: 'warning',
        color: 'yellow',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-700',
        borderColor: 'border-yellow-200',
        dotColor: 'bg-yellow-500',
        message: `${warningCount} Warning${warningCount > 1 ? 's' : ''}`
      };
    } else {
      return {
        status: 'optimal',
        color: 'green',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        borderColor: 'border-green-200',
        dotColor: 'bg-green-500',
        message: 'All Systems Optimal'
      };
    }
  };

  const systemStatus = getSystemStatus();

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4 lg:px-6">
          {/* Left Section: Sidebar Toggle + Logo + Title */}
          <div className="flex items-center gap-3">
            {/* Sidebar Toggle Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleSidebar}
              className="h-8 w-8 p-0 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              title="Toggle Sidebar"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </Button>
            
            {/* Logo and Title */}
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-green-600" />
              <h1 className="text-lg font-semibold text-foreground">
                Chicken Farm Control System
              </h1>
            </div>
          </div>

          {/* Right Section: Status + Controls */}
          <div className="flex items-center gap-4">
            {/* System Status - Clickable */}
            <button
              onClick={() => setShowAlerts(true)}
              className={`flex items-center gap-2 px-3 py-1.5 ${systemStatus.bgColor} ${systemStatus.textColor} rounded-full border ${systemStatus.borderColor} hover:opacity-80 transition-opacity cursor-pointer group`}
            >
              <div className={`h-2 w-2 rounded-full ${systemStatus.dotColor} ${totalAlerts > 0 ? 'animate-pulse' : ''}`}></div>
              <span className="text-sm font-medium">{systemStatus.message}</span>
              {totalAlerts > 0 && (
                <div className="flex items-center gap-1 ml-1">
                  {destructiveCount > 0 && (
                    <div className="flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 text-red-600" />
                      <span className="text-xs font-bold">{destructiveCount}</span>
                    </div>
                  )}
                  {warningCount > 0 && (
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-yellow-600" />
                      <span className="text-xs font-bold">{warningCount}</span>
                    </div>
                  )}
                </div>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Alert Popup */}
      <AlertPopup
        isOpen={showAlerts}
        onClose={() => setShowAlerts(false)}
        warnings={alerts.warnings}
        destructive={alerts.destructive}
      />
    </>
  );
}