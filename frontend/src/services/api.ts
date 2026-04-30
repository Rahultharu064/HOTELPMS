export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000') + '/api';

const getHeaders = (isFormData: boolean = false) => {
  const token = localStorage.getItem('guest_token');
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
      headers: getHeaders(),
    });
    const result = await response.json();
    if (!response.ok) {
      throw { response: { data: result } };
    }
    return result;
  },

  async post<T>(endpoint: string, data: any): Promise<T> {
    const isFormData = data instanceof FormData;
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(isFormData),
      body: isFormData ? data : JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      throw { response: { data: result } };
    }
    return result;
  },

  async put<T>(endpoint: string, data: any): Promise<T> {
    const isFormData = data instanceof FormData;
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(isFormData),
      body: isFormData ? data : JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      throw { response: { data: result } };
    }
    return result;
  },

  async patch<T>(endpoint: string, data: any): Promise<T> {
    const isFormData = data instanceof FormData;
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: getHeaders(isFormData),
      body: isFormData ? data : JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      throw { response: { data: result } };
    }
    return result;
  },

  async delete(endpoint: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const result = await response.json();
      throw { response: { data: result } };
    }
  },
};

export default api;
