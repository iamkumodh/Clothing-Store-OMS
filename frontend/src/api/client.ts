/**
 * D'fine Clothing Store OMS — Central API Client
 * Supports Dual-Mode (Live Spring Boot 3 Backend or Reactive Local Mock Store)
 */

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('dfine_jwt_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Execute an API request with seamless fallback to reactive mockDb.
 * In development or when the Spring Boot backend is offline,
 * the frontend operates with 100% fidelity using mockDb.
 */
export async function executeWithFallback<T>(
  networkCall: () => Promise<T>,
  fallbackCall: () => T | Promise<T>,
  simulatedDelayMs = 120
): Promise<T> {
  // If explicitly told not to use mock and base URL is configured, try live backend
  const liveMode = import.meta.env.VITE_LIVE_BACKEND === 'true';

  if (liveMode) {
    try {
      return await networkCall();
    } catch (err: any) {
      if (!err.response || err.code === 'ECONNABORTED' || err.message === 'Network Error') {
        console.warn('[API Client] Live backend unreachable, falling back to mockDb:', err.message);
      } else {
        throw err;
      }
    }
  }

  // delay for network simulation
  if (simulatedDelayMs > 0) {
    await new Promise(resolve => setTimeout(resolve, simulatedDelayMs));
  }

  return await fallbackCall();
}
