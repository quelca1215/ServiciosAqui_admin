import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios'
import { getAuthToken, clearAuthSession } from './token'

/**
 * ==============================================================================
 * CONEXIÓN A LA API (IP / BASE URL) & CONFIGURACIÓN DE AXIOS
 * ==============================================================================
 * La IP y el puerto se obtienen de la variable de entorno `VITE_API_URL`.
 * Si no está definida en el archivo .env, utiliza una dirección local por defecto.
 */
export const API_BASE_URL: string = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

// Instancia principal de Axios configurada
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

/**
 * ==============================================================================
 * INTERCEPTOR DE PETICIONES (REQUEST INTERCEPTOR)
 * ==============================================================================
 * Inyecta automáticamente el token de autenticación (Bearer Token) en la cabecera
 * `Authorization` de cada solicitud que salga hacia la API.
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken()

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

/**
 * ==============================================================================
 * INTERCEPTOR DE RESPUESTAS (RESPONSE INTERCEPTOR)
 * ==============================================================================
 * Captura las respuestas del servidor:
 * 1. Si la respuesta trae isSuccess: false (patrón Result), la rechaza como error.
 * 2. Si recibe un error 401 (Unauthorized), limpia la sesión y redirige al login si no está en login.
 * 3. Procesa y normaliza los mensajes de error para que sean amigables en la interfaz.
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Manejo de respuestas con HTTP 200 pero isSuccess: false (ej: contraseña incorrecta)
    if (response.data && response.data.isSuccess === false) {
      const message = response.data.message || 'Error al procesar la solicitud.'
      return Promise.reject({
        status: response.data.statusCode || 401,
        message,
        data: response.data,
      })
    }
    return response
  },
  (error: AxiosError<{ message?: string; isSuccess?: boolean; data?: any; statusCode?: number; errors?: any }>) => {
    // Si la sesión expiró o el token es inválido (HTTP 401)
    if (error.response?.status === 401) {
      clearAuthSession()

      // Si no estamos ya en la pantalla de login, redirigir
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }

    // Normalización de mensajes de error
    let userFriendlyMessage = 'Ocurrió un error inesperado al procesar la solicitud.'

    if (error.response?.data?.message) {
      userFriendlyMessage = error.response.data.message
    } else if (error.code === 'ECONNABORTED') {
      userFriendlyMessage = 'El tiempo de espera de la solicitud ha expirado. Por favor, reintenta.'
    } else if (error.code === 'ERR_NETWORK' || !error.response) {
      userFriendlyMessage = `No se pudo conectar con el servidor en ${API_BASE_URL}. Verifica que el servicio esté encendido y la IP sea correcta.`
    } else if (error.response?.status === 401) {
      userFriendlyMessage = 'La contraseña o credenciales ingresadas son incorrectas.'
    } else if (error.response?.status === 403) {
      userFriendlyMessage = 'No tienes permisos suficientes para realizar esta acción.'
    } else if (error.response?.status === 404) {
      userFriendlyMessage = 'El recurso solicitado no fue encontrado en el servidor.'
    } else if (error.response && error.response.status >= 500) {
      userFriendlyMessage = 'Error interno en el servidor backend. Intenta nuevamente más tarde.'
    }

    // Retorna el error con mensaje normalizado
    return Promise.reject({
      status: error.response?.status || (error as any).status,
      message: userFriendlyMessage,
      data: error.response?.data || (error as any).data,
      originalError: error,
    })
  }
)

export default apiClient
