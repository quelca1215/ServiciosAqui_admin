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

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await apiClient.post<BackendResult<BackendLoginData> | any>(
      API_ENDPOINTS.AUTH.LOGIN,
      {
        email: payload.email,
        password: payload.password,
      }
    )

    const rawData = response.data

    if (rawData && rawData.isSuccess === false) {
      throw {
        status: rawData.statusCode || 401,
        message: rawData.message || 'La contraseña o credenciales ingresadas son incorrectas.',
        data: rawData
      }
    }

    const backendData: BackendLoginData = (rawData && rawData.data) ? rawData.data : rawData

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

    const user: AdminUser = {
      email: backendData?.email || payload.email,
      nombreCompleto: backendData?.nombreCompleto || '',
      rol: backendData?.rol || '',
    }

    setAuthToken(token)
    setAuthUser(user)
    userStore.setUser(user)

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

  async obtenerModulosPermitidos(token?: string): Promise<MostrarModulosDto | null> {
    return await userStore.cargarModulos(token)
  },

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
