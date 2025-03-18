// Types for request options
export interface RequestOptions {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  cache?: boolean;
  signal?: AbortSignal;
}

// Client configurations
export interface ApiClientConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  tokenProvider?: () => string | null | undefined;
  onError?: (error: Error, endpoint: string) => void;
  onResponse?: <T>(response: Response, data: T) => void;
}

/**
 * Generic HTTP client for making requests to APIs
 */
export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private tokenProvider?: () => string | null | undefined;
  private onError?: (error: Error, endpoint: string) => void;
  private onResponse?: <T>(response: Response, data: T) => void;
  
  constructor({
    baseUrl,
    defaultHeaders = {},
    tokenProvider,
    onError,
    onResponse
  }: ApiClientConfig) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders
    };
    this.tokenProvider = tokenProvider;
    this.onError = onError;
    this.onResponse = onResponse;
  }
  
  /**
   * Builds and normalizes the URL for a request
   */
  private buildUrl(endpoint: string, params?: Record<string, unknown>): string {
    // Asegurar que el endpoint comience con /
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    let fullUrl: string;
    try {
      // Try to build the full URL
      fullUrl = `${this.baseUrl}${normalizedEndpoint}`;
      const url = new URL(fullUrl);
      
      // Add query parameters if provided
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        });
      }
      
      return url.toString();
    } catch (error) {
      console.error('Error construyendo URL:', { 
        baseUrl: this.baseUrl, 
        endpoint: normalizedEndpoint,
        error
      });
      
      // Fallback to handle possible errors
      fullUrl = `${this.baseUrl}${normalizedEndpoint}`;
      
      // Add parameters manually if there is an error
      if (params && Object.keys(params).length > 0) {
        const queryParams = Object.entries(params)
          .filter(([, value]) => value !== undefined && value !== null)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
          .join('&');
          
        fullUrl += (fullUrl.includes('?') ? '&' : '?') + queryParams;
      }
      
      return fullUrl;
    }
  }
  
  /**
   * prepares the headers for a request
   */
  private prepareHeaders(customHeaders?: Record<string, string>): Headers {
    console.log('ApiClient.prepareHeaders - Preparando encabezados');
    const headers = new Headers(this.defaultHeaders);
    
    // Add the authentication token if available
    if (this.tokenProvider) {
      const token = this.tokenProvider();
      console.log('ApiClient.prepareHeaders - Token:', token ? 'Available' : 'Not available');
      
      if (token) {
        console.log('ApiClient.prepareHeaders - Añadiendo token de autenticación');
        headers.set('Authorization', `token ${token}`);
      } else {
        console.log('ApiClient.prepareHeaders - No hay token, se usará API sin autenticación (limitada)');
      }
    }
    
    // Add custom headers if provided
    if (customHeaders) {
      console.log('ApiClient.prepareHeaders - Adding custom headers');
      Object.entries(customHeaders).forEach(([key, value]) => {
        headers.set(key, value);
      });
    }
    
    // Register the configured headers (without sensitive values)
    const headerKeys = Array.from(headers.keys());
    console.log('ApiClient.prepareHeaders - Headers configured:', headerKeys);
    
    return headers;
  }
  
  /**
   * Processes the response of a request
   */
  private async processResponse<T>(response: Response, endpoint: string): Promise<T> {
    console.log(`ApiClient.processResponse - Procesando respuesta [${endpoint}]`);
    
    if (!response.ok) {
      console.log(`ApiClient.processResponse - Respuesta no válida [${endpoint}]`, { 
        status: response.status, 
        statusText: response.statusText 
      });
      
      let errorMessage: string;
      
      try {
        // Try to analyze the response body to get error details
        const errorData = await response.json();
        errorMessage = errorData.message || `HTTP error ${response.status}`;
        console.log(`ApiClient.processResponse - Analyzed error message [${endpoint}]:`, errorMessage);
      } catch {
        // If it cannot be analyzed, use a generic message
        errorMessage = `HTTP error ${response.status}`;
        console.log(`ApiClient.processResponse - Error analyzing message [${endpoint}], using generic:`, errorMessage);
      }
      
      const error = new Error(errorMessage);
      if (this.onError) {
        console.log(`ApiClient.processResponse - Llamando manejador de errores [${endpoint}]`);
        this.onError(error, endpoint);
      }
      throw error;
    }
    
    // For responses 204 No Content, return undefined
    if (response.status === 204) {
      console.log(`ApiClient.processResponse - Response without content (204) [${endpoint}]`);
      return undefined as unknown as T;
    }
    
    try {
      console.log(`ApiClient.processResponse - Analizando respuesta JSON [${endpoint}]`);
      const data = await response.json() as T;
      
      // Notify about the processed response
      if (this.onResponse) {
        console.log(`ApiClient.processResponse - Calling response handler [${endpoint}]`);
        this.onResponse(response, data);
      }
      
      return data;
    } catch (error) {
      console.error(`ApiClient.processResponse - Error al analizar JSON [${endpoint}]:`, error);
      throw new Error(`Error al procesar la respuesta: ${error}`);
    }
  }
  
  /**
   * Realiza una solicitud HTTP GET
   */
  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, headers, signal } = options;
    const url = this.buildUrl(endpoint, params);
    
    console.log(`ApiClient.get - Inicio [${endpoint}]`, { url, params });
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.prepareHeaders(headers),
        signal
      });
      
      console.log(`ApiClient.get - Respuesta recibida [${endpoint}]`, { 
        status: response.status, 
        ok: response.ok 
      });
      
      return this.processResponse<T>(response, endpoint);
    } catch (error) {
      console.error(`ApiClient.get - Error en petición [${endpoint}]:`, error);
      throw error;
    }
  }
  
  /**
   * Makes a HTTP POST request
   */
  async post<T>(endpoint: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
    const { params, headers, signal } = options;
    const url = this.buildUrl(endpoint, params);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: this.prepareHeaders(headers),
      body: body ? JSON.stringify(body) : undefined,
      signal
    });
    
    return this.processResponse<T>(response, endpoint);
  }
  
  /**
   * Makes a HTTP PUT request
   */
  async put<T>(endpoint: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
    const { params, headers, signal } = options;
    const url = this.buildUrl(endpoint, params);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: this.prepareHeaders(headers),
      body: body ? JSON.stringify(body) : undefined,
      signal
    });
    
    return this.processResponse<T>(response, endpoint);
  }
  
  /**
   * Makes a HTTP DELETE request
   */
  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, headers, signal } = options;
    const url = this.buildUrl(endpoint, params);
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.prepareHeaders(headers),
      signal
    });
    
    return this.processResponse<T>(response, endpoint);
  }
  
  /**
   * Makes a HTTP PATCH request
   */
  async patch<T>(endpoint: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
    const { params, headers, signal } = options;
    const url = this.buildUrl(endpoint, params);
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: this.prepareHeaders(headers),
      body: body ? JSON.stringify(body) : undefined,
      signal
    });
    
    return this.processResponse<T>(response, endpoint);
  }
}

/**
 * Hook to create and access an ApiClient instance
 */
export function useApiClient(config: ApiClientConfig): ApiClient {
  // Create a unique instance of the client
  return new ApiClient(config);
} 