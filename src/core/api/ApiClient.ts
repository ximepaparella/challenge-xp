// Tipos para las opciones de solicitud
export interface RequestOptions {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  cache?: boolean;
  signal?: AbortSignal;
}

// Configuraciones del cliente
export interface ApiClientConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  tokenProvider?: () => string | null | undefined;
  onError?: (error: Error, endpoint: string) => void;
  onResponse?: <T>(response: Response, data: T) => void;
}

/**
 * Cliente HTTP genérico para realizar solicitudes a APIs
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
   * Construye y normaliza la URL para una solicitud
   */
  private buildUrl(endpoint: string, params?: Record<string, unknown>): string {
    // Asegurar que el endpoint comience con /
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    let fullUrl: string;
    try {
      // Intentar construir URL completa
      fullUrl = `${this.baseUrl}${normalizedEndpoint}`;
      const url = new URL(fullUrl);
      
      // Añadir parámetros de consulta si se proporcionan
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
      
      // Fallback para manejar posibles errores
      fullUrl = `${this.baseUrl}${normalizedEndpoint}`;
      
      // Añadir parámetros manualmente si hay un error
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
   * Prepara los encabezados para una solicitud
   */
  private prepareHeaders(customHeaders?: Record<string, string>): Headers {
    console.log('ApiClient.prepareHeaders - Preparando encabezados');
    const headers = new Headers(this.defaultHeaders);
    
    // Añadir el token de autenticación si está disponible
    if (this.tokenProvider) {
      const token = this.tokenProvider();
      console.log('ApiClient.prepareHeaders - Token:', token ? 'Disponible' : 'No disponible');
      
      if (token) {
        console.log('ApiClient.prepareHeaders - Añadiendo token de autenticación');
        headers.set('Authorization', `token ${token}`);
      } else {
        console.log('ApiClient.prepareHeaders - No hay token, se usará API sin autenticación (limitada)');
      }
    }
    
    // Añadir encabezados personalizados si se proporcionan
    if (customHeaders) {
      console.log('ApiClient.prepareHeaders - Añadiendo encabezados personalizados');
      Object.entries(customHeaders).forEach(([key, value]) => {
        headers.set(key, value);
      });
    }
    
    // Registrar los headers configurados (sin valores sensibles)
    const headerKeys = Array.from(headers.keys());
    console.log('ApiClient.prepareHeaders - Headers configurados:', headerKeys);
    
    return headers;
  }
  
  /**
   * Procesa la respuesta de una solicitud
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
        // Intentar analizar el cuerpo de la respuesta para obtener detalles del error
        const errorData = await response.json();
        errorMessage = errorData.message || `HTTP error ${response.status}`;
        console.log(`ApiClient.processResponse - Mensaje de error analizado [${endpoint}]:`, errorMessage);
      } catch {
        // Si no se puede analizar, usar un mensaje genérico
        errorMessage = `HTTP error ${response.status}`;
        console.log(`ApiClient.processResponse - Error al analizar mensaje [${endpoint}], usando genérico:`, errorMessage);
      }
      
      const error = new Error(errorMessage);
      if (this.onError) {
        console.log(`ApiClient.processResponse - Llamando manejador de errores [${endpoint}]`);
        this.onError(error, endpoint);
      }
      throw error;
    }
    
    // Para respuestas 204 No Content, devolver undefined
    if (response.status === 204) {
      console.log(`ApiClient.processResponse - Respuesta sin contenido (204) [${endpoint}]`);
      return undefined as unknown as T;
    }
    
    try {
      console.log(`ApiClient.processResponse - Analizando respuesta JSON [${endpoint}]`);
      const data = await response.json() as T;
      
      // Notificar sobre la respuesta procesada
      if (this.onResponse) {
        console.log(`ApiClient.processResponse - Llamando manejador de respuesta [${endpoint}]`);
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
   * Realiza una solicitud HTTP POST
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
   * Realiza una solicitud HTTP PUT
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
   * Realiza una solicitud HTTP DELETE
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
   * Realiza una solicitud HTTP PATCH
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
 * Hook para crear y acceder a una instancia de ApiClient
 */
export function useApiClient(config: ApiClientConfig): ApiClient {
  // Crear una instancia única del cliente
  return new ApiClient(config);
} 