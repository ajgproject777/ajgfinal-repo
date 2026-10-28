import { useState, useEffect, useCallback } from 'react';
import { BackendHealth } from '../types';
import { apiClient } from '../services/apiClient';

export function useHealth() {
  const [health, setHealth] = useState<BackendHealth | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = useCallback(async () => {
    setLoading(true);
    const result = await apiClient.getHealth();
    if (result.data) {
      setHealth(result.data);
      setError(null);
    } else {
      setHealth(null);
      setError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  return { health, loading, error, refetch: checkHealth };
}
