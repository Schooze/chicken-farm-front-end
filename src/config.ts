// src/config.ts

export const API_BASE_URL = 'http://192.168.100.30:8000';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/token`,
  GET_ME: `${API_BASE_URL}/api/auth/users/me`,
  
  // Admin endpoints
  ADMIN_STATS: `${API_BASE_URL}/api/admin/stats`,
  ADMIN_COMPANIES: `${API_BASE_URL}/api/auth/admin/companies`,
  ADMIN_USERS: `${API_BASE_URL}/api/auth/admin/users`,
  ADMIN_FARMS: `${API_BASE_URL}/api/auth/admin/farms`,
  
  // Company endpoints
  COMPANY_FARMS: `${API_BASE_URL}/api/company/farms`,
  COMPANY_DASHBOARD: `${API_BASE_URL}/api/company/dashboard-data`,
  
  // Anak Kandang endpoints
  MANUAL_INPUT: `${API_BASE_URL}/api/auth/anak-kandang/manual-input`,
  
  // Sensor data
  KANDANG_DATA: (name: string) => `${API_BASE_URL}/api/kandang/${name}`,
};