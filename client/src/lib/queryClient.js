import { QueryClient } from "@tanstack/react-query";

async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  
  // Extract data from new API response format { success: true, data: {...} }
  // Handle different response structures
  if (data.success && data.gigs) return data.gigs;
  if (data.success && data.applications) return data.applications;
  if (data.success && data.user) return data.user;
  if (data.success && data.gig) return data.gig;
  if (data.success && data.application) return data.application;
  
  // If it's just the success wrapper, return the whole data object minus success
  if (data.success) {
    const { success, ...rest } = data;
    return Object.keys(rest).length === 1 ? Object.values(rest)[0] : rest;
  }
  
  return data;
}

export async function apiRequest(method, url, data) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  const responseData = await response.json();
  
  // Extract data from new API response format { success: true, data: {...} }
  if (responseData.success && responseData.gigs) return responseData.gigs;
  if (responseData.success && responseData.applications) return responseData.applications;
  if (responseData.success && responseData.user) return responseData.user;
  if (responseData.success && responseData.gig) return responseData.gig;
  if (responseData.success && responseData.application) return responseData.application;
  
  // If it's just the success wrapper, return the whole data object minus success
  if (responseData.success) {
    const { success, ...rest } = responseData;
    return Object.keys(rest).length === 1 ? Object.values(rest)[0] : rest;
  }
  
  return responseData;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const url = queryKey[0];
        return fetchWithAuth(url);
      },
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});
