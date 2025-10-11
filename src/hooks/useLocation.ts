import { useState, useEffect, useCallback } from 'react';
import { locationApi } from '../services/api/locations';
import { StateItemDto, CountyItemDto, CityItemDto, UseLocationOptions } from '../dtos/location.dto';

// Hook برای دریافت لیست استان‌ها
interface UseStatesReturn {
  data: StateItemDto[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useStates = (options: UseLocationOptions = {}): UseStatesReturn => {
  const { autoFetch = false } = options;
  
  const [data, setData] = useState<StateItemDto[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await locationApi.getStates();
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در دریافت لیست استان‌ها');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};

// Hook برای دریافت لیست شهرستان‌ها
interface UseCountiesReturn {
  data: CountyItemDto[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCounties = (stateCode: string, options: UseLocationOptions = {}): UseCountiesReturn => {
  const { autoFetch = false } = options;
  
  const [data, setData] = useState<CountyItemDto[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!stateCode) {
      setData(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await locationApi.getCounties(stateCode);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در دریافت لیست شهرستان‌ها');
    } finally {
      setLoading(false);
    }
  }, [stateCode]);

  useEffect(() => {
    if (autoFetch && stateCode) {
      fetchData();
    }
  }, [autoFetch, stateCode, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};

// Hook برای دریافت لیست شهرها
interface UseCitiesReturn {
  data: CityItemDto[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCities = (stateCode: string, countyCode: string, options: UseLocationOptions = {}): UseCitiesReturn => {
  const { autoFetch = false } = options;
  
  const [data, setData] = useState<CityItemDto[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!stateCode || !countyCode) {
      setData(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await locationApi.getCities(stateCode, countyCode);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در دریافت لیست شهرها');
    } finally {
      setLoading(false);
    }
  }, [stateCode, countyCode]);

  useEffect(() => {
    if (autoFetch && stateCode && countyCode) {
      fetchData();
    }
  }, [autoFetch, stateCode, countyCode, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};

// Hook ترکیبی برای مدیریت کامل مکان
interface UseLocationReturn {
  states: StateItemDto[] | null;
  counties: CountyItemDto[] | null;
  cities: CityItemDto[] | null;
  selectedState: string | null;
  selectedCounty: string | null;
  selectedCity: string | null;
  statesLoading: boolean;
  countiesLoading: boolean;
  citiesLoading: boolean;
  error: string | null;
  setSelectedState: (stateCode: string | null) => void;
  setSelectedCounty: (countyCode: string | null) => void;
  setSelectedCity: (cityId: string | null) => void;
  refetchStates: () => Promise<void>;
  refetchCounties: () => Promise<void>;
  refetchCities: () => Promise<void>;
  clearSelection: () => void;
}

export const useLocation = (options: UseLocationOptions = {}): UseLocationReturn => {
  const { autoFetch = false } = options;
  
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const {
    data: states,
    loading: statesLoading,
    error: statesError,
    refetch: refetchStates
  } = useStates({ autoFetch });

  const {
    data: counties,
    loading: countiesLoading,
    error: countiesError,
    refetch: refetchCounties
  } = useCounties(selectedState || '', { autoFetch: false });

  const {
    data: cities,
    loading: citiesLoading,
    error: citiesError,
    refetch: refetchCities
  } = useCities(selectedState || '', selectedCounty || '', { autoFetch: false });

  // وقتی استان تغییر می‌کند، شهرستان و شهر را پاک کن
  useEffect(() => {
    if (selectedState) {
      setSelectedCounty(null);
      setSelectedCity(null);
      refetchCounties();
    }
  }, [selectedState, refetchCounties]);

  // وقتی شهرستان تغییر می‌کند، شهر را پاک کن
  useEffect(() => {
    if (selectedCounty) {
      setSelectedCity(null);
      refetchCities();
    }
  }, [selectedCounty, refetchCities]);

  const clearSelection = useCallback(() => {
    setSelectedState(null);
    setSelectedCounty(null);
    setSelectedCity(null);
  }, []);

  const error = statesError || countiesError || citiesError;

  return {
    states,
    counties,
    cities,
    selectedState,
    selectedCounty,
    selectedCity,
    statesLoading,
    countiesLoading,
    citiesLoading,
    error,
    setSelectedState,
    setSelectedCounty,
    setSelectedCity,
    refetchStates,
    refetchCounties,
    refetchCities,
    clearSelection
  };
};
