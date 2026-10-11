import type { AdminUser } from './types/auth.types'

const TOKEN_KEY = 'sa_admin_auth_token'
const USER_KEY = 'sa_admin_auth_user'

/**
 * Obtiene el token de autenticación almacenado (prioriza sessionStorage).
 */
export const getAuthToken = (): string | null => {
  return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY)
}

/**
 * Guarda el token de autenticación en sessionStorage.
 * @param token Token JWT devuelto por la API
 * @param _remember Parámetro opcional para compatibilidad; almacena en sessionStorage
 */
export const setAuthToken = (token: string, _remember?: boolean): void => {
  sessionStorage.setItem(TOKEN_KEY, token)
  localStorage.removeItem(TOKEN_KEY)
}

/**
 * Elimina el token de autenticación de todos los almacenamientos.
 */
export const removeAuthToken = (): void => {
  sessionStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(TOKEN_KEY)
}

/**
 * Obtiene los datos del usuario autenticado guardados en sessionStorage.
 */
export const getAuthUser = (): AdminUser | null => {
  const raw = sessionStorage.getItem(USER_KEY) || localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AdminUser
  } catch {
    return null
  }
}

/**
 * Guarda los datos del usuario autenticado exclusivamente en sessionStorage.
 * @param user Objeto de usuario
 * @param _remember Parámetro opcional para compatibilidad; almacena en sessionStorage
 */
export const setAuthUser = (user: AdminUser, _remember?: boolean): void => {
  const payload = JSON.stringify(user)
  sessionStorage.setItem(USER_KEY, payload)
  localStorage.removeItem(USER_KEY)
}

/**
 * Elimina la información del usuario autenticado de sessionStorage.
 */
export const removeAuthUser = (): void => {
  sessionStorage.removeItem(USER_KEY)
  localStorage.removeItem(USER_KEY)
}

/**
 * Limpia por completo la sesión (token y usuario) en sessionStorage.
 */
export const clearAuthSession = (): void => {
  removeAuthToken()
  removeAuthUser()
}

/**
 * Verifica si existe un token activo.
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken()
}
