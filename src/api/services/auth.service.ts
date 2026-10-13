import apiClient from '../client'
import { API_ENDPOINTS } from '../endpoints'
import { setAuthToken, setAuthUser, clearAuthSession, getAuthToken } from '../token'
import { userStore } from '@/store'
import type {
  LoginPayload,
  LoginResponse,
  AdminUser,
  BackendResult,
  BackendLoginData,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  MostrarModulosDto,
  ChangePasswordPayload,
  VerifyCodePayload,
  ResetPasswordPayload
} from '../types/auth.types'

/**
 * ==============================================================================
 * SERVICIO DE AUTENTICACIÓN (AUTH SERVICE)
 * ==============================================================================
 * Funciones y tipos de peticiones HTTP para los endpoints de autenticación.
 */
export const authService = {
  /**
   * Petición POST para iniciar sesión de operador / administrador.
   * Soporta la respuesta de la API con jwtToken, isSuccess, y datos del usuario.
   */
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await apiClient.post<BackendResult<BackendLoginData> | any>(
      API_ENDPOINTS.AUTH.LOGIN,
      {
        email: payload.email,
        password: payload.password,
      }
    )

    const rawData = response.data

    // Si la respuesta vino con isSuccess: false
    if (rawData && rawData.isSuccess === false) {
      throw {
        status: rawData.statusCode || 401,
        message: rawData.message || 'La contraseña o credenciales ingresadas son incorrectas.',
        data: rawData
      }
    }

    // Extraer datos (soporta { data: { jwtToken, ... } } o directamente el objeto)
    const backendData: BackendLoginData = (rawData && rawData.data) ? rawData.data : rawData

    // Extraer el token (priorizando jwtToken que envía tu API)
    const token: string | undefined =
      backendData?.jwtToken ||
      (backendData as any)?.token ||
      (backendData as any)?.accessToken ||
      (backendData as any)?.access_token

    if (!token) {
      throw {
        status: 500,
        message: 'No se recibió el token de autenticación (jwtToken) de la API.',
        data: rawData
      }
    }

    // Mapear el usuario recibido para la sesión
    const user: AdminUser = {
      email: backendData?.email || payload.email,
      nombreCompleto: backendData?.nombreCompleto || '',
      rol: backendData?.rol || '',
    }

    // Guardar token y usuario en sessionStorage y en Pinia store
    setAuthToken(token)
    setAuthUser(user)
    userStore.setUser(user)

    // Cargar inmediatamente los módulos permitidos con el token de jwt
    try {
      await userStore.cargarModulos(token)
    } catch (modErr) {
      console.warn('Advertencia al cargar módulos permitidos tras el login:', modErr)
    }

    return {
      token,
      jwtToken: token,
      user,
      message: rawData?.message || null
    }
  },

  /**
   * Petición GET para obtener los datos del usuario autenticado actual.
   */
  async getProfile(): Promise<AdminUser> {
    const response = await apiClient.get<BackendResult<AdminUser> | AdminUser>(
      API_ENDPOINTS.AUTH.ME
    )

    const rawData = response.data
    const user: AdminUser = ('data' in rawData && rawData.data)
      ? (rawData.data as AdminUser)
      : (rawData as AdminUser)

    if (user) {
      setAuthUser(user)
      userStore.setUser(user)
    }

    return user
  },

  /**
   * Petición GET para obtener los módulos y permisos asignados al operador.
   * Endpoint: /api/AdminAuth/MostrarModulosPermitidos
   * Envía el token JWT en el encabezado Authorization.
   */
  async obtenerModulosPermitidos(token?: string): Promise<MostrarModulosDto | null> {
    return await userStore.cargarModulos(token)
  },

  /**
   * Petición POST para cerrar la sesión actual en el backend y limpiar tokens locales.
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
    } catch (err) {
      console.warn('Advertencia al cerrar sesión en el servidor:', err)
    } finally {
      clearAuthSession()
      userStore.clearUser()
    }
  },

  /**
   * Petición POST para refrescar el token de acceso antes de su expiración.
   */
  async refreshToken(): Promise<string> {
    const response = await apiClient.post<any>(
      API_ENDPOINTS.AUTH.REFRESH
    )

    const raw = response.data
    const token = raw?.data?.jwtToken || raw?.data?.token || raw?.jwtToken || raw?.token

    if (token) {
      setAuthToken(token)
    }

    return token
  },

  /**
   * Paso 1: Petición PUT para solicitar código de recuperación de contraseña al correo.
   * Endpoint: /api/AdminAuth/OlvidePassword
   * Payload: { email }
   */
  async olvidePassword(payload: ForgotPasswordPayload): Promise<BackendResult<any> | any> {
    const response = await apiClient.put(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      {
        email: payload.email
      }
    )
    return response.data
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<BackendResult<any> | any> {
    return this.olvidePassword(payload)
  },

  /**
   * Paso 2: Petición PUT para verificar el código 2FA enviado al correo.
   * Endpoint: /api/AdminAuth/VerificarCodigo
   * Payload: { email, codigo }
   */
  async verificarCodigo(payload: VerifyCodePayload): Promise<BackendResult<any> | any> {
    const response = await apiClient.put(
      API_ENDPOINTS.AUTH.VERIFY_2FA,
      {
        email: payload.email,
        codigo: payload.codigo
      }
    )
    return response.data
  },

  /**
   * Paso 3: Petición PUT para resetear la contraseña con la nueva credencial.
   * Endpoint: /api/AdminAuth/ResetPassword
   * Payload: { email, newPassword, confirmNewPassword }
   */
  async resetPassword(payload: ResetPasswordPayload): Promise<BackendResult<any> | any> {
    const response = await apiClient.put(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      {
        email: payload.email,
        newPassword: payload.newPassword,
        confirmNewPassword: payload.confirmNewPassword
      }
    )
    return response.data
  },

  /**
   * Petición PUT para cambiar la contraseña del operador autenticado.
   * Endpoint: /api/AdminAuth/CambiarPassword
   * Payload: { oldPassword, newPassword, confirmNewPassword }
   * Requiere el token JWT en el encabezado Authorization.
   */
  async changePassword(payload: ChangePasswordPayload, token?: string): Promise<BackendResult<any> | any> {
    const activeToken = token || getAuthToken()
    const headers = activeToken ? { Authorization: `Bearer ${activeToken}` } : undefined

    const response = await apiClient.put<BackendResult<any> | any>(
      API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
      {
        oldPassword: payload.oldPassword,
        newPassword: payload.newPassword,
        confirmNewPassword: payload.confirmNewPassword
      },
      { headers }
    )
    return response.data
  },
}

export default authService
