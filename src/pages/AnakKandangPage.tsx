import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Warehouse, Egg, Package, CheckCircle, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Farm {
  id: number;
  name: string;
  location: string;
}

interface ManualInput {
  farm_id: string;
  total_chickens: string;
  feed_kg: string;
}

const AnakKandangPage: React.FC = () => {
  const { token, user } = useAuth();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<ManualInput>({
    farm_id: '',
    total_chickens: '',
    feed_kg: ''
  });

  // Today's date for display
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      const response = await fetch('http://192.168.100.30:8000/api/company/farms', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setFarms(data);
        // Auto-select first farm if available
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, farm_id: data[0].id.toString() }));
        }
      }
    } catch (error) {
      console.error('Error fetching farms:', error);
      setError('Failed to load farms');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch('http://192.168.100.30:8000/api/auth/anak-kandang/manual-input', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          farm_id: parseInt(formData.farm_id),
          total_chickens: parseInt(formData.total_chickens),
          feed_kg: parseFloat(formData.feed_kg)
        })
      });

      if (response.ok) {
        setSuccess(true);
        // Clear form
        setFormData({
          farm_id: formData.farm_id, // Keep farm selection
          total_chickens: '',
          feed_kg: ''
        });
        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await response.json();
        setError(data.detail || 'Failed to submit data');
      }
    } catch (error) {
      setError('Failed to submit data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Farm Input</h1>
          <p className="text-gray-600">Welcome, {user?.username}! Please enter today's farm data.</p>
          <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {today}
          </p>
        </div>

        {/* Main Input Card */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Warehouse className="h-6 w-6 text-orange-600" />
              Farm Data Entry
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Data submitted successfully!
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Farm Selection */}
              <div className="space-y-2">
                <Label htmlFor="farm">Select Farm</Label>
                <Select
                  value={formData.farm_id}
                  onValueChange={(value) => setFormData({ ...formData, farm_id: value })}
                >
                  <SelectTrigger id="farm">
                    <SelectValue placeholder="Choose a farm" />
                  </SelectTrigger>
                  <SelectContent>
                    {farms.map((farm) => (
                      <SelectItem key={farm.id} value={farm.id.toString()}>
                        {farm.name} - {farm.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Total Chickens */}
              <div className="space-y-2">
                <Label htmlFor="chickens" className="flex items-center gap-2">
                  <Egg className="h-4 w-4 text-orange-500" />
                  Total Chickens
                </Label>
                <Input
                  id="chickens"
                  type="number"
                  placeholder="Enter total number of chickens"
                  value={formData.total_chickens}
                  onChange={(e) => setFormData({ ...formData, total_chickens: e.target.value })}
                  required
                  min="0"
                  className="text-lg"
                />
                <p className="text-sm text-gray-500">
                  Count all living chickens in this farm
                </p>
              </div>

              {/* Feed Amount */}
              <div className="space-y-2">
                <Label htmlFor="feed" className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-green-600" />
                  Feed Amount (kg)
                </Label>
                <Input
                  id="feed"
                  type="number"
                  step="0.1"
                  placeholder="Enter feed amount in kilograms"
                  value={formData.feed_kg}
                  onChange={(e) => setFormData({ ...formData, feed_kg: e.target.value })}
                  required
                  min="0"
                  className="text-lg"
                />
                <p className="text-sm text-gray-500">
                  Total feed distributed today in kilograms
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg py-6"
                disabled={loading || !formData.farm_id}
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Submit Daily Data
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="mt-6 bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-lg text-yellow-900">Daily Input Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-yellow-800">
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 mt-0.5">•</span>
                <span>Count chickens during morning feeding for accuracy</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 mt-0.5">•</span>
                <span>Weigh feed bags before and after distribution</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 mt-0.5">•</span>
                <span>Report any unusual deaths or behavior to your supervisor</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 mt-0.5">•</span>
                <span>Submit data before 10 AM daily for best tracking</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnakKandangPage;