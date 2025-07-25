import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, Warehouse, Fan, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Company {
  id: number;
  name: string;
  farm_count: number;
  total_fans: number;
  anak_kandang_count: number;
}

interface Stats {
  total_companies: number;
  total_company_accounts: number;
  total_anak_kandang: number;
  total_farms: number;
  total_fans: number;
}

const AdminPage: React.FC = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [showCreateCompany, setShowCreateCompany] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showCreateFarm, setShowCreateFarm] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    account_type: 'company',
    company_id: ''
  });
  const [newFarm, setNewFarm] = useState({
    company_id: '',
    name: '',
    location: '',
    fan_count: 0
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await fetch('http://192.168.100.30:8000/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setStats(data.stats);
      setCompanies(data.companies);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const handleCreateCompany = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`http://192.168.100.30:8000/api/auth/admin/companies?name=${encodeURIComponent(newCompanyName)}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setNewCompanyName('');
        setShowCreateCompany(false);
        fetchAdminData();
      } else {
        const data = await response.json();
        setError(data.detail || 'Failed to create company');
      }
    } catch (error) {
      setError('Failed to create company');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch('http://192.168.100.30:8000/api/auth/admin/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newUser,
          company_id: newUser.company_id ? parseInt(newUser.company_id) : null
        })
      });
      
      if (response.ok) {
        setNewUser({ username: '', password: '', account_type: 'company', company_id: '' });
        setShowCreateUser(false);
        fetchAdminData();
      } else {
        const data = await response.json();
        setError(data.detail || 'Failed to create user');
      }
    } catch (error) {
      setError('Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFarm = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch('http://192.168.100.30:8000/api/auth/admin/farms', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          company_id: parseInt(newFarm.company_id),
          name: newFarm.name,
          location: newFarm.location,
          fan_count: newFarm.fan_count
        })
      });
      
      if (response.ok) {
        setNewFarm({ company_id: '', name: '', location: '', fan_count: 0 });
        setShowCreateFarm(false);
        fetchAdminData();
      } else {
        const data = await response.json();
        console.error('Farm creation error:', data);
        
        // Handle different types of error responses
        if (data.detail) {
          // Simple error message
          if (typeof data.detail === 'string') {
            setError(data.detail);
          } 
          // Validation error array
          else if (Array.isArray(data.detail)) {
            const errorMessages = data.detail.map((err: any) => {
              if (typeof err === 'object' && err.msg) {
                return `${err.loc ? err.loc.join('.') + ': ' : ''}${err.msg}`;
              }
              return String(err);
            });
            setError(errorMessages.join(', '));
          }
          // Single validation error object
          else if (typeof data.detail === 'object' && data.detail.msg) {
            setError(`${data.detail.loc ? data.detail.loc.join('.') + ': ' : ''}${data.detail.msg}`);
          }
          else {
            setError('Failed to create farm');
          }
        }
        // If no detail, check for other error formats
        else if (Array.isArray(data)) {
          const errorMessages = data.map((err: any) => {
            if (typeof err === 'object' && err.msg) {
              return `${err.loc ? err.loc.join('.') + ': ' : ''}${err.msg}`;
            }
            return String(err);
          });
          setError(errorMessages.join(', '));
        }
        else {
          setError('Failed to create farm');
        }
      }
    } catch (error) {
      console.error('Network error:', error);
      setError('Network error: Failed to create farm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage companies, users, farms, and system configuration</p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Companies</p>
                    <p className="text-2xl font-bold">{stats.total_companies}</p>
                  </div>
                  <Building2 className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Company Accounts</p>
                    <p className="text-2xl font-bold">{stats.total_company_accounts}</p>
                  </div>
                  <Users className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Anak Kandang</p>
                    <p className="text-2xl font-bold">{stats.total_anak_kandang}</p>
                  </div>
                  <Users className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Farms</p>
                    <p className="text-2xl font-bold">{stats.total_farms}</p>
                  </div>
                  <Warehouse className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Fans</p>
                    <p className="text-2xl font-bold">{stats.total_fans}</p>
                  </div>
                  <Fan className="h-8 w-8 text-cyan-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Button onClick={() => setShowCreateCompany(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Company
          </Button>
          <Button onClick={() => setShowCreateUser(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
          <Button onClick={() => setShowCreateFarm(true)} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Farm
          </Button>
        </div>

        {/* Companies List */}
        <Card>
          <CardHeader>
            <CardTitle>Companies Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Company Name</th>
                    <th className="text-center p-4">Farms</th>
                    <th className="text-center p-4">Total Fans</th>
                    <th className="text-center p-4">Anak Kandang</th>
                    <th className="text-center p-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company) => (
                    <tr key={company.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{company.name}</td>
                      <td className="text-center p-4">{company.farm_count}</td>
                      <td className="text-center p-4">{company.total_fans}</td>
                      <td className="text-center p-4">{company.anak_kandang_count}</td>
                      <td className="text-center p-4">
                        <Badge variant="default" className="bg-green-500">Active</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Create Company Modal */}
        {showCreateCompany && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Create New Company</CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>
                )}
                <div className="space-y-4">
                  <div>
                    <Label>Company Name</Label>
                    <Input
                      value={newCompanyName}
                      onChange={(e) => setNewCompanyName(e.target.value)}
                      placeholder="Enter company name"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCreateCompany} disabled={loading}>
                      {loading ? 'Creating...' : 'Create'}
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setShowCreateCompany(false);
                      setNewCompanyName('');
                      setError('');
                    }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Create User Modal */}
        {showCreateUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Create New User</CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>
                )}
                <div className="space-y-4">
                  <div>
                    <Label>Username</Label>
                    <Input
                      value={newUser.username}
                      onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                      placeholder="Enter username"
                    />
                  </div>
                  <div>
                    <Label>Password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        placeholder="Enter password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>Account Type</Label>
                    <Select
                      value={newUser.account_type}
                      onValueChange={(value) => setNewUser({ ...newUser, account_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="company">Company</SelectItem>
                        <SelectItem value="anak_kandang">Anak Kandang</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {newUser.account_type !== 'admin' && (
                    <div>
                      <Label>Company</Label>
                      <Select
                        value={newUser.company_id}
                        onValueChange={(value) => setNewUser({ ...newUser, company_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select company" />
                        </SelectTrigger>
                        <SelectContent>
                          {companies.map((company) => (
                            <SelectItem key={company.id} value={company.id.toString()}>
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button onClick={handleCreateUser} disabled={loading}>
                      {loading ? 'Creating...' : 'Create'}
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setShowCreateUser(false);
                      setNewUser({ username: '', password: '', account_type: 'company', company_id: '' });
                      setError('');
                    }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Create Farm Modal */}
        {showCreateFarm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Create New Farm</CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm max-h-32 overflow-y-auto">
                    {error}
                  </div>
                )}
                <div className="space-y-4">
                  <div>
                    <Label>Company *</Label>
                    <Select
                      value={newFarm.company_id}
                      onValueChange={(value) => setNewFarm({ ...newFarm, company_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id.toString()}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Farm Name *</Label>
                    <Input
                      value={newFarm.name}
                      onChange={(e) => setNewFarm({ ...newFarm, name: e.target.value })}
                      placeholder="Enter farm name"
                    />
                  </div>
                  <div>
                    <Label>Location *</Label>
                    <Input
                      value={newFarm.location}
                      onChange={(e) => setNewFarm({ ...newFarm, location: e.target.value })}
                      placeholder="Enter location (e.g., Kandang_1)"
                    />
                  </div>
                  <div>
                    <Label>Number of Fans</Label>
                    <Input
                      type="number"
                      value={newFarm.fan_count}
                      onChange={(e) => setNewFarm({ ...newFarm, fan_count: parseInt(e.target.value) || 0 })}
                      placeholder="Enter number of fans"
                      min="0"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleCreateFarm} 
                      disabled={loading || !newFarm.company_id || !newFarm.name || !newFarm.location}
                    >
                      {loading ? 'Creating...' : 'Create'}
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setShowCreateFarm(false);
                      setNewFarm({ company_id: '', name: '', location: '', fan_count: 0 });
                      setError('');
                    }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;