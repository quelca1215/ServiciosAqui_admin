import apiClient from '../client'
import { API_ENDPOINTS } from '../endpoints'
import type { BackendResult } from '../types/auth.types'
import type {
  ActualizarPermisoModuloPayload,
  CategoriaDto,
  ComisionDto,
  ConfiguracionAdministrativaDto,
  EspecialidadDto,
  GuardarCategoriaPayload,
  GuardarComisionPayload,
  GuardarConfiguracionPayload,
  GuardarEspecialidadPayload,
  ModuloAdministrativoDto,
  PermisoModuloDto,
  RolDto,
  UbicacionPerfilDto,
} from '../types/admin.types'
import { extractResultData } from './admin.service'

function normalizeConfiguracion(
  item: Partial<ConfiguracionAdministrativaDto> | undefined
): ConfiguracionAdministrativaDto {
  return {
    id: String(item?.id ?? ''),
    clave: String(item?.clave ?? ''),
    valor: String(item?.valor ?? ''),
    descripcion: String(item?.descripcion ?? ''),
    tipoDato: String(item?.tipoDato ?? 'String'),
    fechaActualizacion: String(item?.fechaActualizacion ?? ''),
  }
}

function normalizeModulo(
  item: Partial<ModuloAdministrativoDto> | undefined
): ModuloAdministrativoDto {
  return {
    id: String(item?.id ?? ''),
    nombre: String(item?.nombre ?? ''),
    ruta: String(item?.ruta ?? ''),
    seccion: String(item?.seccion ?? ''),
    orden: Number(item?.orden ?? 0),
    moduloPadreId: item?.moduloPadreId ? String(item.moduloPadreId) : null,
  }
}

function normalizePermisoModulo(
  item: Partial<PermisoModuloDto> | undefined
): PermisoModuloDto {
  return {
    rolId: String(item?.rolId ?? ''),
    rol: String(item?.rol ?? ''),
    moduloId: String(item?.moduloId ?? ''),
    modulo: String(item?.modulo ?? ''),
    puedeVer: Boolean(item?.puedeVer),
    puedeCrear: Boolean(item?.puedeCrear),
    puedeEditar: Boolean(item?.puedeEditar),
    puedeEliminar: Boolean(item?.puedeEliminar),
  }
}

function normalizeCategoria(
  item: Partial<CategoriaDto> | undefined
): CategoriaDto {
  return {
    idCategoria: String(item?.idCategoria ?? ''),
    nombre: String(item?.nombre ?? ''),
    descripcion: String(item?.descripcion ?? ''),
    tipoCategoria: String(item?.tipoCategoria ?? ''),
    icono: String(item?.icono ?? ''),
  }
}

function normalizeEspecialidad(
  item: Partial<EspecialidadDto> | undefined
): EspecialidadDto {
  return {
    idEspecialidad: String(item?.idEspecialidad ?? ''),
    idCategoria: String(item?.idCategoria ?? ''),
    nombre: String(item?.nombre ?? ''),
  }
}

function normalizeComision(
  item: Partial<ComisionDto> | undefined
): ComisionDto {
  return {
    idConfiguracionComision: String(item?.idConfiguracionComision ?? ''),
    porsentajeComision: Number(item?.porsentajeComision ?? 0),
    activo: Boolean(item?.activo),
    fechaCreacion: String(item?.fechaCreacion ?? ''),
    fechaActualizacion: item?.fechaActualizacion
      ? String(item.fechaActualizacion)
      : null,
  }
}

export const parametrosService = {
  async obtenerRoles(id?: string): Promise<RolDto[]> {
    const params: Record<string, string> = {}
    if (id?.trim()) params.Id = id.trim()

    const response = await apiClient.get<BackendResult<RolDto[]> | RolDto[]>(
      API_ENDPOINTS.PARAMETROS.ROLES,
      { params }
    )

    const payload = extractResultData(response.data)
    if (!Array.isArray(payload)) return []
    return payload.map((item) => ({
      id: String(item?.id ?? ''),
      nombre: String(item?.nombre ?? ''),
    }))
  },

  async obtenerConfiguraciones(): Promise<ConfiguracionAdministrativaDto[]> {
    const response = await apiClient.get<
      | BackendResult<ConfiguracionAdministrativaDto[]>
      | ConfiguracionAdministrativaDto[]
    >(API_ENDPOINTS.PARAMETROS.CONFIGURACIONES.LIST)

    const payload = extractResultData(response.data)
    if (!Array.isArray(payload)) return []
    return payload.map((item) => normalizeConfiguracion(item))
  },

  async guardarConfiguracion(
    payload: GuardarConfiguracionPayload
  ): Promise<ConfiguracionAdministrativaDto> {
    const response = await apiClient.put<
      | BackendResult<ConfiguracionAdministrativaDto>
      | ConfiguracionAdministrativaDto
    >(API_ENDPOINTS.PARAMETROS.CONFIGURACIONES.UPDATE, payload)

    return normalizeConfiguracion(extractResultData(response.data))
  },

  async obtenerModulos(): Promise<ModuloAdministrativoDto[]> {
    const response = await apiClient.get<
      BackendResult<ModuloAdministrativoDto[]> | ModuloAdministrativoDto[]
    >(API_ENDPOINTS.PARAMETROS.MODULOS)

    const payload = extractResultData(response.data)
    if (!Array.isArray(payload)) return []
    return payload.map((item) => normalizeModulo(item))
  },

  async obtenerPermisosModulos(rolId?: string): Promise<PermisoModuloDto[]> {
    const params: Record<string, string> = {}
    if (rolId?.trim()) params.rolId = rolId.trim()

    const response = await apiClient.get<
      BackendResult<PermisoModuloDto[]> | PermisoModuloDto[]
    >(API_ENDPOINTS.PARAMETROS.PERMISOS_MODULOS.LIST, { params })

    const payload = extractResultData(response.data)
    if (!Array.isArray(payload)) return []
    return payload.map((item) => normalizePermisoModulo(item))
  },

  async actualizarPermisoModulo(
    payload: ActualizarPermisoModuloPayload
  ): Promise<PermisoModuloDto> {
    const response = await apiClient.put<
      BackendResult<PermisoModuloDto> | PermisoModuloDto
    >(API_ENDPOINTS.PARAMETROS.PERMISOS_MODULOS.UPDATE, payload)

    return normalizePermisoModulo(extractResultData(response.data))
  },

  async obtenerCategorias(idCategoria?: string): Promise<CategoriaDto[]> {
    const params: Record<string, string> = {}
    if (idCategoria?.trim()) params.IdCategoria = idCategoria.trim()

    const response = await apiClient.get<
      BackendResult<CategoriaDto[]> | CategoriaDto[]
    >(API_ENDPOINTS.PARAMETROS.CATEGORIAS.LIST, { params })

    const payload = extractResultData(response.data)
    if (!Array.isArray(payload)) return []
    return payload.map((item) => normalizeCategoria(item))
  },

  async crearCategoria(
    payload: GuardarCategoriaPayload
  ): Promise<CategoriaDto> {
    const response = await apiClient.post<
      BackendResult<CategoriaDto> | CategoriaDto
    >(API_ENDPOINTS.PARAMETROS.CATEGORIAS.CREATE, payload)

    return normalizeCategoria(extractResultData(response.data))
  },

  async editarCategoria(
    id: string,
    payload: GuardarCategoriaPayload
  ): Promise<CategoriaDto> {
    const response = await apiClient.put<
      BackendResult<CategoriaDto> | CategoriaDto
    >(API_ENDPOINTS.PARAMETROS.CATEGORIAS.UPDATE(id), { ...payload, id })

    return normalizeCategoria(extractResultData(response.data))
  },

  async eliminarCategoria(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.PARAMETROS.CATEGORIAS.DELETE(id))
  },

  async obtenerEspecialidades(filtro?: {
    idEspecialidad?: string
    idCategoria?: string
  }): Promise<EspecialidadDto[]> {
    const params: Record<string, string> = {}
    if (filtro?.idEspecialidad?.trim()) {
      params.IdEspecialidad = filtro.idEspecialidad.trim()
    }
    if (filtro?.idCategoria?.trim()) {
      params.IdCategoria = filtro.idCategoria.trim()
    }

    const response = await apiClient.get<
      BackendResult<EspecialidadDto[]> | EspecialidadDto[]
    >(API_ENDPOINTS.PARAMETROS.ESPECIALIDADES.LIST, { params })

    const payload = extractResultData(response.data)
    if (!Array.isArray(payload)) return []
    return payload.map((item) => normalizeEspecialidad(item))
  },

  async crearEspecialidad(
    payload: GuardarEspecialidadPayload
  ): Promise<EspecialidadDto> {
    const response = await apiClient.post<
      BackendResult<EspecialidadDto> | EspecialidadDto
    >(API_ENDPOINTS.PARAMETROS.ESPECIALIDADES.CREATE, payload)

    return normalizeEspecialidad(extractResultData(response.data))
  },

  async editarEspecialidad(
    id: string,
    payload: GuardarEspecialidadPayload
  ): Promise<EspecialidadDto> {
    const response = await apiClient.put<
      BackendResult<EspecialidadDto> | EspecialidadDto
    >(API_ENDPOINTS.PARAMETROS.ESPECIALIDADES.UPDATE(id), { ...payload, id })

    return normalizeEspecialidad(extractResultData(response.data))
  },

  async eliminarEspecialidad(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.PARAMETROS.ESPECIALIDADES.DELETE(id))
  },

  async obtenerComisiones(filtro?: {
    id?: string
    activo?: boolean
  }): Promise<ComisionDto[]> {
    const params: Record<string, string | boolean> = {}
    if (filtro?.id?.trim()) params.Id = filtro.id.trim()
    if (typeof filtro?.activo === 'boolean') params.Activo = filtro.activo

    const response = await apiClient.get<
      BackendResult<ComisionDto[]> | ComisionDto[]
    >(API_ENDPOINTS.PARAMETROS.COMISIONES.LIST, { params })

    const payload = extractResultData(response.data)
    if (!Array.isArray(payload)) return []
    return payload.map((item) => normalizeComision(item))
  },

  async crearComision(payload: GuardarComisionPayload): Promise<ComisionDto> {
    const response = await apiClient.post<
      BackendResult<ComisionDto> | ComisionDto
    >(API_ENDPOINTS.PARAMETROS.COMISIONES.CREATE, payload)

    return normalizeComision(extractResultData(response.data))
  },

  async editarComision(
    id: string,
    payload: GuardarComisionPayload
  ): Promise<ComisionDto> {
    const response = await apiClient.put<
      BackendResult<ComisionDto> | ComisionDto
    >(API_ENDPOINTS.PARAMETROS.COMISIONES.UPDATE(id), { ...payload, id })

    return normalizeComision(extractResultData(response.data))
  },

  async eliminarComision(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.PARAMETROS.COMISIONES.DELETE(id))
  },

  async obtenerUbicaciones(filtro?: {
    idPerfil?: string
    activo?: boolean
  }): Promise<UbicacionPerfilDto[]> {
    const params: Record<string, string | boolean> = {}
    if (filtro?.idPerfil?.trim()) params.IdPerfil = filtro.idPerfil.trim()
    if (typeof filtro?.activo === 'boolean') params.Activo = filtro.activo

    const response = await apiClient.get<
      BackendResult<UbicacionPerfilDto[]> | UbicacionPerfilDto[]
    >(API_ENDPOINTS.PARAMETROS.UBICACIONES_CLIENTE_PROVEEDOR, { params })

    const payload = extractResultData(response.data)
    if (!Array.isArray(payload)) return []

    return payload.map((item) => ({
      idPerfil: String(item?.idPerfil ?? ''),
      nombreUbicacion: String(item?.nombreUbicacion ?? ''),
      latitud: Number(item?.latitud ?? 0),
      longitud: Number(item?.longitud ?? 0),
      activo: Boolean(item?.activo),
    }))
  },
}

export default parametrosService
