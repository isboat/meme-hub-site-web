// client/src/hooks/useApi.ts
import { useState, useEffect, useCallback } from 'react';
import api from '../api/api';

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: (params?: Record<string, any>) => Promise<void>;
}

type HttpMethod = 'get' | 'post' | 'put' | 'delete';

export const useApi = <T>(
  url: string,
  method: HttpMethod = 'get',
  initialData: T | null = null,
  body: Record<string, any> | null = null,
  skipInitialFetch: boolean = false
): ApiResponse<T> => {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState<boolean>(!skipInitialFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (params?: Record<string, any>) => {
      setLoading(true);
      setError(null);
      try {
        let response;
        if (method === 'get') {
          response = await api.get<T>(url, { params });
        } else if (method === 'post') {
          response = await api.post<T>(url, body || params);
        } else if (method === 'put') {
          response = await api.put<T>(url, body || params);
        } else if (method === 'delete') {
          response = await api.delete<T>(url, { params, data: body });
        } else {
          throw new Error('Unsupported HTTP method');
        }
        setData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'An unknown error occurred');
        setData(null); // Clear data on error
      } finally {
        setLoading(false);
      }
    },
    [url, method, body]
  );

  useEffect(() => {
    if (!skipInitialFetch) {
      fetchData();
    }
  }, [fetchData, skipInitialFetch]);

  return { data, loading, error, refetch: fetchData };
};