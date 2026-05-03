export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000') + '/api';

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
  async get<T>(endpoint: string, options?: { params?: Record<string, any> }): Promise<T> {
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
    const response = await fetch(url, {
      headers: getHeaders(false, isAdminEndpoint),
    });
    const result = await response.json();
    if (!response.ok) {
      throw { response: { data: result, status: response.status } };
    }
    return result;
  },

  async post<T>(endpoint: string, data: any): Promise<T> {
    const isFormData = data instanceof FormData;
    const isAdminEndpoint = endpoint.startsWith('/admin') || endpoint.includes('admin');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(isFormData, isAdminEndpoint),
      body: isFormData ? data : JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      throw { response: { data: result, status: response.status } };
    }
    return result;
  },

  async put<T>(endpoint: string, data: any): Promise<T> {
    const isFormData = data instanceof FormData;
    const isAdminEndpoint = endpoint.startsWith('/admin') || endpoint.includes('admin');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(isFormData, isAdminEndpoint),
      body: isFormData ? data : JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      throw { response: { data: result, status: response.status } };
    }
    return result;
  },

  async patch<T>(endpoint: string, data: any): Promise<T> {
    const isFormData = data instanceof FormData;
    const isAdminEndpoint = endpoint.startsWith('/admin') || endpoint.includes('admin');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: getHeaders(isFormData, isAdminEndpoint),
      body: isFormData ? data : JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      throw { response: { data: result, status: response.status } };
    }
    return result;
  },

  async delete(endpoint: string): Promise<void> {
    const isAdminEndpoint = endpoint.startsWith('/admin') || endpoint.includes('admin');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(false, isAdminEndpoint),
    });
    if (!response.ok) {
      const result = await response.json();
      throw { response: { data: result, status: response.status } };
    }
  },
};

export default api;
