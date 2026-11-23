import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios'
import { getAuthToken, clearAuthSession } from './token'

export const API_BASE_URL: string = import.meta.env.VITE_API_URL 

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

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

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
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
    if (error.response?.status === 401) {
      clearAuthSession()

      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }

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

    return Promise.reject({
      status: error.response?.status || (error as any).status,
      message: userFriendlyMessage,
      data: error.response?.data || (error as any).data,
      originalError: error,
    })
  }
)

export default apiClient
