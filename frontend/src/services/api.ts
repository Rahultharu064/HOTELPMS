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
  
  // Map dummy sample data paths to the frontend placeholder
  if (url.startsWith('/images/')) {
    return '/room-standard.png';
  }

  // Ensure we don't have double slashes
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return `${BACKEND_ROOT}${cleanUrl}`;
};

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function parseResponseBody(response: Response): Promise<any> {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function toRequestError(response: Response, result: any) {
  const message = result?.message || `Request failed with status ${response.status}`;
  const error = new Error(message) as Error & { response?: { data: any; status: number } };
  error.response = { data: result, status: response.status };
  return error;
}

/**
 * Retry wrapper with exponential backoff for resilient API calls
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 2,
  baseDelay = 1000,
  timeout = 60000
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

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

  const networkError = lastError || new Error('Network error: unable to reach the server');
  if (networkError.name === 'AbortError') {
    throw new Error('Network error: request timed out');
  }
  if (networkError.message?.includes('Failed to fetch')) {
    throw new Error('Network error: unable to reach the server');
  }
  throw networkError;
}

const getHeaders = (isFormData: boolean = false, isAdminEndpoint: boolean = false) => {
  const adminToken = localStorage.getItem('admin_token');
  const guestToken = localStorage.getItem('guest_token');
  
  // Choose the primary token based on the endpoint type
  let token = isAdminEndpoint ? adminToken : guestToken;
  
  // Fallback: If the preferred token is missing, try the other one.
  // This allows shared routes (like /rooms or /bookings) to work for both guests and staff.
  if (!token) {
    token = adminToken || guestToken;
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

const checkIfAdminEndpoint = (endpoint: string) => {
  return endpoint.startsWith('/admin') || 
         endpoint.startsWith('/frontoffice') || 
         endpoint.startsWith('/housekeeping') || 
         endpoint.startsWith('/guests') ||
         endpoint.startsWith('/bookings') ||
         endpoint.includes('admin');
};



export const api = {
  async get<T = any>(endpoint: string, options?: { params?: Record<string, any> }): Promise<T> {
    const isAdminEndpoint = checkIfAdminEndpoint(endpoint);


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
    }, 3);
    const result = await parseResponseBody(response);
    if (!response.ok) {
      throw toRequestError(response, result);
    }
    return result;
  },

  async post<T = any>(endpoint: string, data: any): Promise<T> {
    const isFormData = data instanceof FormData;
    const isAdminEndpoint = checkIfAdminEndpoint(endpoint);

    const response = await fetchWithRetry(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(isFormData, isAdminEndpoint),
      body: isFormData ? data : JSON.stringify(data),
    }, endpoint.includes('/auth/') ? 2 : 1);
    const result = await parseResponseBody(response);
    if (!response.ok) {
      throw toRequestError(response, result);
    }
    return result;
  },

  async put<T = any>(endpoint: string, data: any): Promise<T> {
    const isFormData = data instanceof FormData;
    const isAdminEndpoint = checkIfAdminEndpoint(endpoint);

    const response = await fetchWithRetry(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(isFormData, isAdminEndpoint),
      body: isFormData ? data : JSON.stringify(data),
    }, 2, 1000, 90000); // 90s timeout for room updates (Render cold starts)
    const result = await parseResponseBody(response);
    if (!response.ok) {
      throw toRequestError(response, result);
    }
    return result;
  },

  async patch<T = any>(endpoint: string, data: any): Promise<T> {
    const isFormData = data instanceof FormData;
    const isAdminEndpoint = checkIfAdminEndpoint(endpoint);

    const response = await fetchWithRetry(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: getHeaders(isFormData, isAdminEndpoint),
      body: isFormData ? data : JSON.stringify(data),
    }, 1);
    const result = await parseResponseBody(response);
    if (!response.ok) {
      throw toRequestError(response, result);
    }
    return result;
  },

  async delete<T = any>(endpoint: string): Promise<T> {
    const isAdminEndpoint = checkIfAdminEndpoint(endpoint);

    const response = await fetchWithRetry(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(false, isAdminEndpoint),
    }, 1);

    if (!response.ok) {
      const result = await parseResponseBody(response);
      throw toRequestError(response, result);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return parseResponseBody(response);
  },
};

export default api;
