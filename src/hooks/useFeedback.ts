import { useState, useEffect, useCallback } from 'react';
import { feedbackApi } from '../services/api/feedback';
import { FeedbackResponse, FeedbackFilters, FeedbackItem } from '../dtos/feedback.dto';

interface UseFeedbackOptions {
  autoFetch?: boolean;
  initialFilters?: FeedbackFilters;
}

interface UseFeedbackReturn {
  data: FeedbackResponse | null;
  items: FeedbackItem[];
  count: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateFilters: (newFilters: Partial<FeedbackFilters>) => void;
  setFilters: (filters: FeedbackFilters) => void;
  clearFilters: () => void;
}

export const useFeedback = (options: UseFeedbackOptions = {}): UseFeedbackReturn => {
  const { autoFetch = false, initialFilters = {} } = options;
  
  const [data, setData] = useState<FeedbackResponse | null>(null);
  const [filters, setFiltersState] = useState<FeedbackFilters>(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await feedbackApi.getFeedbacks(filters);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در دریافت داده‌ها');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  const updateFilters = useCallback((newFilters: Partial<FeedbackFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  const setFilters = useCallback((newFilters: FeedbackFilters) => {
    setFiltersState(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState({});
  }, []);

  return {
    data,
    items: data?.items || [],
    count: data?.count || 0,
    loading,
    error,
    refetch: fetchData,
    updateFilters,
    setFilters,
    clearFilters
  };
};

// Hook مخصوص پروژه‌ها
export const useProjectFeedback = (projectId: number, options: UseFeedbackOptions = {}) => {
  const { autoFetch = false, initialFilters = {} } = options;
  
  const [data, setData] = useState<FeedbackResponse | null>(null);
  const [filters, setFiltersState] = useState<Omit<FeedbackFilters, 'subsys' | 'subsys_id'>>(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await feedbackApi.getProjectFeedbacks(projectId, filters);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در دریافت بازخوردهای پروژه');
    } finally {
      setLoading(false);
    }
  }, [projectId, filters]);

  useEffect(() => {
    if (autoFetch && projectId) {
      fetchData();
    }
  }, [autoFetch, projectId, fetchData]);

  const updateFilters = useCallback((newFilters: Partial<Omit<FeedbackFilters, 'subsys' | 'subsys_id'>>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    data,
    items: data?.items || [],
    count: data?.count || 0,
    loading,
    error,
    refetch: fetchData,
    updateFilters
  };
};

// Hook مخصوص کامنت‌های پروژه
export const useProjectComments = (projectId: number, options: UseFeedbackOptions = {}) => {
  const { autoFetch = false, initialFilters = {} } = options;
  
  const [data, setData] = useState<FeedbackResponse | null>(null);
  const [filters, setFiltersState] = useState<Omit<FeedbackFilters, 'subsys' | 'subsys_id' | 'feedback_type'>>(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await feedbackApi.getProjectComments(projectId, filters);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در دریافت کامنت‌های پروژه');
    } finally {
      setLoading(false);
    }
  }, [projectId, filters]);

  useEffect(() => {
    if (autoFetch && projectId) {
      fetchData();
    }
  }, [autoFetch, projectId, fetchData]);

  const updateFilters = useCallback((newFilters: Partial<Omit<FeedbackFilters, 'subsys' | 'subsys_id' | 'feedback_type'>>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    data,
    items: data?.items || [],
    count: data?.count || 0,
    loading,
    error,
    refetch: fetchData,
    updateFilters
  };
};

// Hook مخصوص نیکی یار
export const useNikiYarFeedback = (serviceId: number, options: UseFeedbackOptions = {}) => {
  const { autoFetch = false, initialFilters = {} } = options;
  
  const [data, setData] = useState<FeedbackResponse | null>(null);
  const [filters, setFiltersState] = useState<Omit<FeedbackFilters, 'subsys' | 'original_content_id'>>(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await feedbackApi.getNikiYarFeedbacks(serviceId, filters);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در دریافت بازخوردهای نیکی یار');
    } finally {
      setLoading(false);
    }
  }, [serviceId, filters]);

  useEffect(() => {
    if (autoFetch && serviceId) {
      fetchData();
    }
  }, [autoFetch, serviceId, fetchData]);

  const updateFilters = useCallback((newFilters: Partial<Omit<FeedbackFilters, 'subsys' | 'original_content_id'>>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    data,
    items: data?.items || [],
    count: data?.count || 0,
    loading,
    error,
    refetch: fetchData,
    updateFilters
  };
};

// Hook مخصوص کامنت‌های نیکی یار
export const useNikiYarComments = (serviceId: number, options: UseFeedbackOptions = {}) => {
  const { autoFetch = false, initialFilters = {} } = options;
  
  const [data, setData] = useState<FeedbackResponse | null>(null);
  const [filters, setFiltersState] = useState<Omit<FeedbackFilters, 'subsys' | 'original_content_id' | 'feedback_type'>>(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await feedbackApi.getNikiYarComments(serviceId, filters);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در دریافت کامنت‌های نیکی یار');
    } finally {
      setLoading(false);
    }
  }, [serviceId, filters]);

  useEffect(() => {
    if (autoFetch && serviceId) {
      fetchData();
    }
  }, [autoFetch, serviceId, fetchData]);

  const updateFilters = useCallback((newFilters: Partial<Omit<FeedbackFilters, 'subsys' | 'original_content_id' | 'feedback_type'>>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    data,
    items: data?.items || [],
    count: data?.count || 0,
    loading,
    error,
    refetch: fetchData,
    updateFilters
  };
};
