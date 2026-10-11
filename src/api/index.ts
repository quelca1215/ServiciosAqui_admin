/**
 * ==============================================================================
 * EXPORTADOR PRINCIPAL DEL MÓDULO API (ServiciosAquí Admin)
 * ==============================================================================
 */

// Instancia base de Axios e IP configurada
export { apiClient, API_BASE_URL } from './client'
export { default } from './client'

// Catálogo de endpoints disponibles
export { API_ENDPOINTS } from './endpoints'

// Gestor de Tokens y Sesión
export {
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  getAuthUser,
  setAuthUser,
  removeAuthUser,
  clearAuthSession,
  isAuthenticated,
} from './token'

// Servicios HTTP
export { authService } from './services/auth.service'

// Tipos TypeScript
export * from './types/auth.types'
export * from './types/api.types'
