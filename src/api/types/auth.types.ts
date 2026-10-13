export interface BackendLoginData {
  nombreCompleto: string
  email: string
  jwtToken: string
  rol: string
}

export interface BackendResult<T = any> {
  isSuccess: boolean
  data: T
  message: string | null
  statusCode: number
}

export interface AdminUser {
  id?: string | number
  email: string
  nombreCompleto: string
  rol: string
  name?: string
  role?: string
  avatar?: string
  phone?: string
  isActive?: boolean
  createdAt?: string
}

export interface LoginPayload {
  email: string
  password: string
  remember?: boolean
}

export interface LoginResponse {
  token: string
  jwtToken?: string
  tokenType?: string
  expiresIn?: number
  user: AdminUser
  message?: string | null
}

export interface ForgotPasswordPayload {
  email: string
}

export interface VerifyCodePayload {
  email: string
  codigo: string
}

export interface ResetPasswordPayload {
  email: string
  newPassword: string
  confirmNewPassword: string
}

export interface ForgotPasswordResponse {
  message: string
  status?: string
}

export interface ChangePasswordPayload {
  oldPassword: string
  newPassword: string
  confirmNewPassword: string
}

export interface PermisosDto {
  puedeVer: boolean
  puedeCrear?: boolean | null
  puedeEditar?: boolean | null
  puedeEliminar?: boolean | null
}

export interface ModuloMenuDto {
  moduloId: string
  nombre: string
  ruta: string | null
  icono?: string | null
  seccion?: string | null
  orden: number
  permisos: PermisosDto
  submodulos?: ModuloMenuDto[] | null
}

export interface MostrarModulosDto {
  nombreCompleto?: string | null
  email?: string | null
  rol?: string | null
  modulos: ModuloMenuDto[]
}

