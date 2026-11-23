import type { AdminUser } from './types/auth.types'

const TOKEN_KEY = 'sa_admin_auth_token'
const USER_KEY = 'sa_admin_auth_user'

export const getAuthToken = (): string | null => {
  return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY)
}

export const setAuthToken = (token: string, _remember?: boolean): void => {
  sessionStorage.setItem(TOKEN_KEY, token)
  localStorage.removeItem(TOKEN_KEY)
}

export const removeAuthToken = (): void => {
  sessionStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(TOKEN_KEY)
}

export const getAuthUser = (): AdminUser | null => {
  const raw = sessionStorage.getItem(USER_KEY) || localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AdminUser
  } catch {
    return null
  }
}

export const setAuthUser = (user: AdminUser, _remember?: boolean): void => {
  const payload = JSON.stringify(user)
  sessionStorage.setItem(USER_KEY, payload)
  localStorage.removeItem(USER_KEY)
}

export const removeAuthUser = (): void => {
  sessionStorage.removeItem(USER_KEY)
  localStorage.removeItem(USER_KEY)
}

export const clearAuthSession = (): void => {
  removeAuthToken()
  removeAuthUser()
}

export const isAuthenticated = (): boolean => {
  return !!getAuthToken()
}
