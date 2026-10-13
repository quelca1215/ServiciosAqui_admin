import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AdminUser, ModuloMenuDto, MostrarModulosDto, BackendResult } from '@/api/types/auth.types'
import { getAuthUser, setAuthUser, clearAuthSession, getAuthToken, setAuthToken } from '@/api/token'
import { apiClient } from '@/api/client'
import { API_ENDPOINTS } from '@/api/endpoints'
import { pinia } from './index'

import { DEFAULT_MODULOS } from '@/data/defaultModules'

const MODULOS_SESSION_KEY = 'sa_admin_auth_modulos'

/**
 * Carga los módulos guardados previamente en sessionStorage (o defaults).
 */
function loadModulosFromSession(): ModuloMenuDto[] {
  if (typeof window === 'undefined') return DEFAULT_MODULOS
  const raw = sessionStorage.getItem(MODULOS_SESSION_KEY)
  if (!raw) return DEFAULT_MODULOS
  try {
    const parsed = JSON.parse(raw) as ModuloMenuDto[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_MODULOS
  } catch {
    return DEFAULT_MODULOS
  }
}

/**
 * ==============================================================================
 * STORE DE USUARIO Y MÓDULOS (PINIA + SESSIONSTORAGE)
 * ==============================================================================
 * Administra el usuario autenticado y los módulos permitidos retornados por
 * /api/AdminAuth/MostrarModulosPermitidos con el token JWT.
 */
export const useUserStore = defineStore('user', () => {
  // Estado reactivo cargado desde sessionStorage
  const currentUser = ref<AdminUser | null>(getAuthUser())
  const modulos = ref<ModuloMenuDto[]>(loadModulosFromSession())
  const isLoadingModulos = ref(false)

  // Getters computados
  const user = computed(() => currentUser.value)
  const email = computed(() => currentUser.value?.email || '')
  const nombreCompleto = computed(() => currentUser.value?.nombreCompleto || '')
  const rol = computed(() => currentUser.value?.rol || '')
  const isAuthenticated = computed(() => !!currentUser.value && !!getAuthToken())

  const initials = computed(() => {
    const name = (nombreCompleto.value || '').trim()
    if (!name) return 'SA'
    const parts = name.split(/\s+/)
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase()
    }
    if (name.length > 0) {
      return name.slice(0, 2).toUpperCase()
    }
    return 'SA'
  })

  // Acciones (Actions)
  function setUser(userData: AdminUser) {
    currentUser.value = { ...userData }
    setAuthUser(currentUser.value)
  }

  function setEmail(newEmail: string) {
    if (currentUser.value) {
      currentUser.value = { ...currentUser.value, email: newEmail }
      setAuthUser(currentUser.value)
    } else {
      currentUser.value = {
        email: newEmail,
        nombreCompleto: '',
        rol: ''
      }
      setAuthUser(currentUser.value)
    }
  }

  function updateUser(patch: Partial<AdminUser>) {
    if (currentUser.value) {
      currentUser.value = { ...currentUser.value, ...patch }
      setAuthUser(currentUser.value)
    }
  }

  function clearUser() {
    currentUser.value = null
    modulos.value = []
    sessionStorage.removeItem(MODULOS_SESSION_KEY)
    clearAuthSession()
  }

  function reloadFromSession() {
    currentUser.value = getAuthUser()
    modulos.value = loadModulosFromSession()
  }

  /**
   * Carga los módulos permitidos desde /api/AdminAuth/MostrarModulosPermitidos.
   * Añade el token JWT en la cabecera Authorization (Bearer).
   * @param jwtToken Token JWT opcional; si no se provee, utiliza el de sessionStorage.
   */
  async function cargarModulos(jwtToken?: string): Promise<MostrarModulosDto | null> {
    const token = jwtToken || getAuthToken()
    if (!token) {
      console.warn('No hay token JWT disponible para ejecutar cargarModulos.')
      return null
    }

    if (jwtToken) {
      setAuthToken(jwtToken)
    }

    isLoadingModulos.value = true

    try {
      const response = await apiClient.get<BackendResult<MostrarModulosDto> | any>(
        API_ENDPOINTS.AUTH.MODULOS_PERMITIDOS,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const raw = response.data
      const data: MostrarModulosDto = (raw && 'data' in raw && raw.data) ? raw.data : raw

      if (data && Array.isArray(data.modulos)) {
        modulos.value = data.modulos
        sessionStorage.setItem(MODULOS_SESSION_KEY, JSON.stringify(data.modulos))
      }

      // Si la respuesta incluye información del usuario, mantener sincronizado el store
      if (data && (data.email || data.nombreCompleto || data.rol)) {
        updateUser({
          email: data.email || currentUser.value?.email || '',
          nombreCompleto: data.nombreCompleto || currentUser.value?.nombreCompleto || '',
          rol: data.rol || currentUser.value?.rol || '',
        })
      }

      return data
    } catch (error) {
      console.error('Error al ejecutar /api/AdminAuth/MostrarModulosPermitidos:', error)
      return null
    } finally {
      isLoadingModulos.value = false
    }
  }

  return {
    currentUser,
    user,
    email,
    nombreCompleto,
    rol,
    isAuthenticated,
    initials,
    modulos,
    isLoadingModulos,
    setUser,
    setEmail,
    updateUser,
    clearUser,
    reloadFromSession,
    cargarModulos
  }
})

/**
 * Acceso directo al store de Pinia para llamadas fuera de setup() (ej: servicios Axios / authService)
 */
export const getUserStore = () => useUserStore(pinia)

export const userStore = {
  get state(): AdminUser | null {
    return getUserStore().currentUser
  },
  get email(): string {
    return getUserStore().email
  },
  get isAuthenticated(): boolean {
    return getUserStore().isAuthenticated
  },
  get modulos(): ModuloMenuDto[] {
    return getUserStore().modulos
  },
  setUser(userData: AdminUser) {
    getUserStore().setUser(userData)
  },
  setEmail(newEmail: string) {
    getUserStore().setEmail(newEmail)
  },
  updateUser(patch: Partial<AdminUser>) {
    getUserStore().updateUser(patch)
  },
  clearUser() {
    getUserStore().clearUser()
  },
  reloadFromSession() {
    getUserStore().reloadFromSession()
  },
  cargarModulos(jwtToken?: string): Promise<MostrarModulosDto | null> {
    return getUserStore().cargarModulos(jwtToken)
  }
}

export default useUserStore
