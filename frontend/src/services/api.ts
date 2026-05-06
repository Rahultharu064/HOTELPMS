export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const BACKEND_ROOT = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const API_BASE_URL = BACKEND_ROOT + '/api';

console.log('[API] Backend Root:', BACKEND_ROOT);
console.log('[API] Using environment:', import.meta.env.MODE);

/**
 * Construct a full URL for an image, handling both relative and absolute paths.
 * Useful for images stored locally on the backend or on a CDN like Cloudinary.
 */
export const getImageUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  // Ensure we don't have double slashes
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return `${BACKEND_ROOT}${cleanUrl}`;
};

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Retry wrapper with exponential backoff for resilient API calls
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 2,
  baseDelay = 1000
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Don't retry on client errors (4xx), only on server errors (5xx)
      if (response.ok || (response.status >= 400 && response.status < 500)) {
        return response;
      }

      // Server error — retry if attempts remain
      if (attempt < retries) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.warn(`API request failed (${response.status}), retrying in ${delay}ms... (attempt ${attempt + 1}/${retries})`);
        await sleep(delay);
        continue;
      }

      return response; // Return the failed response on last attempt
    } catch (error: any) {
      lastError = error;

      if (error.name === 'AbortError') {
        console.warn(`Request to ${url} timed out`);
      }

      if (attempt < retries) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.warn(`Network error, retrying in ${delay}ms... (attempt ${attempt + 1}/${retries})`);
        await sleep(delay);
      }
    }
  }

  throw lastError || new Error('Request failed after retries');
}

const getHeaders = (isFormData: boolean = false, isAdminEndpoint: boolean = false) => {
  let token = localStorage.getItem('guest_token');
  
  if (isAdminEndpoint) {
    token = localStorage.getItem('admin_token');
  }

  const headers: Record<string, string> = {};
  
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export const api = {
  async get<T = any>(endpoint: string, options?: { params?: Record<string, any> }): Promise<T> {
    const isAdminEndpoint = endpoint.startsWith('/admin') || endpoint.includes('admin');
    let url = `${API_BASE_URL}${endpoint}`;
    if (options?.params) {
      const params = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    const response = await fetchWithRetry(url, {
      headers: getHeaders(false, isAdminEndpoint),
    });
    const result = await response.json();
    if (!response.ok) {
      throw { response: { data: result, status: response.status } };
    }
    return result;
  },

  async post<T = any>(endpoint: string, data: any): Promise<T> {
    const isFormData = data instanceof FormData;
    const isAdminEndpoint = endpoint.startsWith('/admin') || endpoint.includes('admin');
    const response = await fetchWithRetry(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(isFormData, isAdminEndpoint),
      body: isFormData ? data : JSON.stringify(data),
    }, 1); // Fewer retries for mutations
    const result = await response.json();
    if (!response.ok) {
      throw { response: { data: result, status: response.status } };
    }
    return result;
  },

  async put<T = any>(endpoint: string, data: any): Promise<T> {
    const isFormData = data instanceof FormData;
    const isAdminEndpoint = endpoint.startsWith('/admin') || endpoint.includes('admin');
    const response = await fetchWithRetry(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(isFormData, isAdminEndpoint),
      body: isFormData ? data : JSON.stringify(data),
    }, 1);
    const result = await response.json();
    if (!response.ok) {
      throw { response: { data: result, status: response.status } };
    }
    return result;
  },

  async patch<T = any>(endpoint: string, data: any): Promise<T> {
    const isFormData = data instanceof FormData;
    const isAdminEndpoint = endpoint.startsWith('/admin') || endpoint.includes('admin');
    const response = await fetchWithRetry(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: getHeaders(isFormData, isAdminEndpoint),
      body: isFormData ? data : JSON.stringify(data),
    }, 1);
    const result = await response.json();
    if (!response.ok) {
      throw { response: { data: result, status: response.status } };
    }
    return result;
  },

  async delete<T = any>(endpoint: string): Promise<T> {
    const isAdminEndpoint = endpoint.startsWith('/admin') || endpoint.includes('admin');
    const response = await fetchWithRetry(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(false, isAdminEndpoint),
    }, 1);
    
    if (!response.ok) {
      const result = await response.json();
      throw { response: { data: result, status: response.status } };
    }

    // Handle empty response for 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    try {
      return await response.json();
    } catch {
      return {} as T;
    }
  },
};

export default api;
