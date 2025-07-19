import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Activity } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-earth p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Farm Analytics</h1>
        </div>
        <p className="text-muted-foreground">Historical data and trends for all chicken farms</p>
      </div>

      {/* Coming Soon Card */}
      <Card className="bg-card/80 backdrop-blur-sm shadow-farm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Analytics Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <Activity className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Coming Soon</h3>
          <p className="text-muted-foreground mb-6">
            Advanced analytics and reporting features are currently in development.
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Historical temperature, moisture, and ammonia trends</p>
            <p>• Farm performance comparisons</p>
            <p>• Predictive analytics and alerts</p>
            <p>• Export reports and data visualization</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};