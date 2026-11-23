import apiClient from '../client'
import { API_ENDPOINTS } from '../endpoints'
import type { BackendResult } from '../types/auth.types'
import type {
  AccesoAdministrativoDto,
  AccesosFiltro,
  AuditoriaFiltro,
  CrearUsuarioInternoPayload,
  PerfilAdministracionDto,
  PerfilesFiltro,
  RegistroAuditoriaAdministrativaDto,
  ResolverVerificacionPayload,
  ResumenAdministrativoDto,
  RolDto,
  SolicitudAdministracionDto,
  SolicitudesFiltro,
  UbicacionPerfilDto,
  UsuarioInternoDto,
  UsuariosSistemaFiltro,
  VerificacionesFiltro,
  VerificacionIdentidadDto,
} from '../types/admin.types'

export function extractResultData<T>(raw: BackendResult<T> | T): T {
  if (raw && typeof raw === 'object' && 'data' in raw) {
    return (raw as BackendResult<T>).data
  }
  return raw as T
}

function normalizeUsuarioInterno(
  item: Partial<UsuarioInternoDto> | undefined
): UsuarioInternoDto {
  return {
    id: String(item?.id ?? ''),
    nombreUsuario: String(item?.nombreUsuario ?? ''),
    nombreCompleto: String(item?.nombreCompleto ?? ''),
    email: String(item?.email ?? ''),
    rol: String(item?.rol ?? ''),
    areaDepartamento: String(item?.areaDepartamento ?? ''),
    estado: Boolean(item?.estado),
    fechaRegistro: String(item?.fechaRegistro ?? ''),
  }
}

function normalizePerfilAdministracion(
  item: Partial<PerfilAdministracionDto> | undefined
): PerfilAdministracionDto {
  return {
    idPerfil: String(item?.idPerfil ?? ''),
    userId: String(item?.userId ?? ''),
    tipoPerfil: String(item?.tipoPerfil ?? ''),
    nombreCompleto: String(item?.nombreCompleto ?? ''),
    correo: String(item?.correo ?? ''),
    telefono: String(item?.telefono ?? ''),
    estado: String(item?.estado ?? ''),
    fechaRegistro: String(item?.fechaRegistro ?? ''),
    verificacionDocumentoIdentidad: Boolean(item?.verificacionDocumentoIdentidad),
    rating: Number(item?.rating ?? 0),
  }
}

function normalizeSolicitudAdministracion(
  item: Partial<SolicitudAdministracionDto> | undefined
): SolicitudAdministracionDto {
  return {
    idSolicitudServicio: String(item?.idSolicitudServicio ?? ''),
    titulo: String(item?.titulo ?? ''),
    descripcion: String(item?.descripcion ?? ''),
    estado: String(item?.estado ?? ''),
    presupuesto:
      item?.presupuesto === null || item?.presupuesto === undefined
        ? null
        : Number(item.presupuesto),
    direccion: String(item?.direccion ?? ''),
    fechaCreacion: String(item?.fechaCreacion ?? ''),
    idPerfilCliente: String(item?.idPerfilCliente ?? ''),
    nombreCliente: String(item?.nombreCliente ?? ''),
    idServicioAsignado: item?.idServicioAsignado ? String(item.idServicioAsignado) : null,
    estadoServicio: item?.estadoServicio ? String(item.estadoServicio) : null,
    montoServicio:
      item?.montoServicio === null || item?.montoServicio === undefined
        ? null
        : Number(item.montoServicio),
    idPerfilProveedor: item?.idPerfilProveedor ? String(item.idPerfilProveedor) : null,
    nombreProveedor: item?.nombreProveedor ? String(item.nombreProveedor) : null,
  }
}

function normalizeVerificacionIdentidad(
  item: Partial<VerificacionIdentidadDto> | undefined
): VerificacionIdentidadDto {
  return {
    idDocumentoDeIdentidad: String(item?.idDocumentoDeIdentidad ?? ''),
    idUsuario: String(item?.idUsuario ?? ''),
    nombreCompleto: String(item?.nombreCompleto ?? ''),
    correo: String(item?.correo ?? ''),
    tipoDocumento: String(item?.tipoDocumento ?? ''),
    numeroDocumento: String(item?.numeroDocumento ?? ''),
    fotoFrontal: String(item?.fotoFrontal ?? ''),
    fotoPosterior: String(item?.fotoPosterior ?? ''),
    fotoSelfie: String(item?.fotoSelfie ?? ''),
    estado: String(item?.estado ?? ''),
    observacion: String(item?.observacion ?? ''),
    fechaRegistro: String(item?.fechaRegistro ?? ''),
  }
}

function normalizeAuditoria(
  item: Partial<RegistroAuditoriaAdministrativaDto> | undefined
): RegistroAuditoriaAdministrativaDto {
  return {
    id: String(item?.id ?? ''),
    administrador: String(item?.administrador ?? ''),
    accion: String(item?.accion ?? ''),
    moduloAfectado: String(item?.moduloAfectado ?? ''),
    idRegistroAfectado: String(item?.idRegistroAfectado ?? ''),
    datosAnterioresJson: String(item?.datosAnterioresJson ?? ''),
    datosNuevosJson: String(item?.datosNuevosJson ?? ''),
    direccionIp: String(item?.direccionIp ?? ''),
    fechaRegistro: String(item?.fechaRegistro ?? ''),
  }
}

function normalizeAcceso(
  item: Partial<AccesoAdministrativoDto> | undefined
): AccesoAdministrativoDto {
  return {
    id: String(item?.id ?? ''),
    administrador: String(item?.administrador ?? ''),
    direccionIp: String(item?.direccionIp ?? ''),
    userAgent: String(item?.userAgent ?? ''),
    exitoso: Boolean(item?.exitoso),
    motivoFallo: String(item?.motivoFallo ?? ''),
    fechaIntento: String(item?.fechaIntento ?? ''),
  }
}

async function fetchPerfilesLista(
  endpoint: string,
  filtro?: PerfilesFiltro
): Promise<PerfilAdministracionDto[]> {
  const params: Record<string, string | number> = {
    omitir: filtro?.omitir ?? 0,
    limite: filtro?.limite ?? 50,
  }

  if (filtro?.estado?.trim()) params.estado = filtro.estado.trim()
  if (filtro?.buscar?.trim()) params.buscar = filtro.buscar.trim()

  const response = await apiClient.get<
    BackendResult<PerfilAdministracionDto[]> | PerfilAdministracionDto[]
  >(endpoint, { params })

  const payload = extractResultData(response.data)
  if (!Array.isArray(payload)) return []

  return payload.map((item) => normalizePerfilAdministracion(item))
}

export const adminService = {
  async obtenerResumen(): Promise<ResumenAdministrativoDto> {
    const response = await apiClient.get<
      BackendResult<ResumenAdministrativoDto> | ResumenAdministrativoDto
    >(API_ENDPOINTS.ADMINISTRACION.RESUMEN)

    const payload = extractResultData(response.data) as
      | Partial<ResumenAdministrativoDto>
      | undefined

    return {
      clientes: Number(payload?.clientes ?? 0),
      proveedores: Number(payload?.proveedores ?? 0),
      solicitudesPendientes: Number(payload?.solicitudesPendientes ?? 0),
      serviciosEnProceso: Number(payload?.serviciosEnProceso ?? 0),
      pagosPendientes: Number(payload?.pagosPendientes ?? 0),
      retirosPendientes: Number(payload?.retirosPendientes ?? 0),
      verificacionesPendientes: Number(payload?.verificacionesPendientes ?? 0),
    }
  },

  async obtenerUsuariosSistema(
    filtro?: UsuariosSistemaFiltro
  ): Promise<UsuarioInternoDto[]> {
    const params: Record<string, string | number | boolean> = {
      omitir: filtro?.omitir ?? 0,
      limite: filtro?.limite ?? 100,
    }

    if (filtro?.buscar?.trim()) params.buscar = filtro.buscar.trim()
    if (filtro?.rol?.trim()) params.rol = filtro.rol.trim()
    if (typeof filtro?.estado === 'boolean') params.estado = filtro.estado

    const response = await apiClient.get<
      BackendResult<UsuarioInternoDto[]> | UsuarioInternoDto[]
    >(API_ENDPOINTS.ADMINISTRACION.USUARIOS_SISTEMA.LIST, { params })

    const payload = extractResultData(response.data)
    if (!Array.isArray(payload)) return []

    return payload.map((item) => normalizeUsuarioInterno(item))
  },

  async crearUsuarioSistema(
    payload: CrearUsuarioInternoPayload
  ): Promise<UsuarioInternoDto> {
    const response = await apiClient.post<
      BackendResult<UsuarioInternoDto> | UsuarioInternoDto
    >(API_ENDPOINTS.ADMINISTRACION.USUARIOS_SISTEMA.CREATE, payload)

    const created = extractResultData(response.data)
    return normalizeUsuarioInterno(created)
  },

  async cambiarEstadoUsuarioSistema(
    id: string,
    estado: boolean
  ): Promise<UsuarioInternoDto> {
    const response = await apiClient.put<
      BackendResult<UsuarioInternoDto> | UsuarioInternoDto
    >(API_ENDPOINTS.ADMINISTRACION.USUARIOS_SISTEMA.CAMBIAR_ESTADO(id), {
      estado,
    })

    const updated = extractResultData(response.data)
    return normalizeUsuarioInterno(updated)
  },

  async obtenerClientes(
    filtro?: PerfilesFiltro
  ): Promise<PerfilAdministracionDto[]> {
    return fetchPerfilesLista(API_ENDPOINTS.ADMINISTRACION.CLIENTES, filtro)
  },

  async obtenerProveedores(
    filtro?: PerfilesFiltro
  ): Promise<PerfilAdministracionDto[]> {
    return fetchPerfilesLista(API_ENDPOINTS.ADMINISTRACION.PROVEEDORES, filtro)
  },

  async cambiarEstadoPerfil(
    idPerfil: string,
    estado: string
  ): Promise<PerfilAdministracionDto> {
    const response = await apiClient.put<
      BackendResult<PerfilAdministracionDto> | PerfilAdministracionDto
    >(API_ENDPOINTS.ADMINISTRACION.PERFILES.CAMBIAR_ESTADO(idPerfil), {
      estado,
    })

    const updated = extractResultData(response.data)
    return normalizePerfilAdministracion(updated)
  },

  async obtenerSolicitudes(
    filtro?: SolicitudesFiltro
  ): Promise<SolicitudAdministracionDto[]> {
    const params: Record<string, string | number> = {
      omitir: filtro?.omitir ?? 0,
      limite: filtro?.limite ?? 50,
    }

    if (filtro?.estado?.trim()) params.estado = filtro.estado.trim()
    if (filtro?.buscar?.trim()) params.buscar = filtro.buscar.trim()

    const response = await apiClient.get<
      BackendResult<SolicitudAdministracionDto[]> | SolicitudAdministracionDto[]
    >(API_ENDPOINTS.ADMINISTRACION.SOLICITUDES, { params })

    const payload = extractResultData(response.data)
    if (!Array.isArray(payload)) return []

    return payload.map((item) => normalizeSolicitudAdministracion(item))
  },

  async obtenerVerificaciones(
    filtro?: VerificacionesFiltro
  ): Promise<VerificacionIdentidadDto[]> {
    const params: Record<string, string | number> = {
      omitir: filtro?.omitir ?? 0,
      limite: filtro?.limite ?? 50,
    }

    if (filtro?.estado?.trim()) params.estado = filtro.estado.trim()

    const response = await apiClient.get<
      BackendResult<VerificacionIdentidadDto[]> | VerificacionIdentidadDto[]
    >(API_ENDPOINTS.ADMINISTRACION.VERIFICACIONES.LIST, { params })

    const payload = extractResultData(response.data)
    if (!Array.isArray(payload)) return []

    return payload.map((item) => normalizeVerificacionIdentidad(item))
  },

  async resolverVerificacion(
    id: string,
    payload: ResolverVerificacionPayload
  ): Promise<VerificacionIdentidadDto> {
    const response = await apiClient.post<
      BackendResult<VerificacionIdentidadDto> | VerificacionIdentidadDto
    >(API_ENDPOINTS.ADMINISTRACION.VERIFICACIONES.RESOLVER(id), payload)

    const resolved = extractResultData(response.data)
    return normalizeVerificacionIdentidad(resolved)
  },

  async obtenerAuditoria(
    filtro?: AuditoriaFiltro
  ): Promise<RegistroAuditoriaAdministrativaDto[]> {
    const params: Record<string, string | number> = {
      omitir: filtro?.omitir ?? 0,
      limite: filtro?.limite ?? 50,
    }

    if (filtro?.modulo?.trim()) params.modulo = filtro.modulo.trim()
    if (filtro?.desde?.trim()) params.desde = filtro.desde.trim()
    if (filtro?.hasta?.trim()) params.hasta = filtro.hasta.trim()

    const response = await apiClient.get<
      | BackendResult<RegistroAuditoriaAdministrativaDto[]>
      | RegistroAuditoriaAdministrativaDto[]
    >(API_ENDPOINTS.ADMINISTRACION.AUDITORIA, { params })

    const payload = extractResultData(response.data)
    if (!Array.isArray(payload)) return []

    return payload.map((item) => normalizeAuditoria(item))
  },

  async obtenerAccesos(
    filtro?: AccesosFiltro
  ): Promise<AccesoAdministrativoDto[]> {
    const params: Record<string, string | number | boolean> = {
      omitir: filtro?.omitir ?? 0,
      limite: filtro?.limite ?? 50,
    }

    if (filtro?.administradorId?.trim()) {
      params.administradorId = filtro.administradorId.trim()
    }
    if (typeof filtro?.exitoso === 'boolean') params.exitoso = filtro.exitoso
    if (filtro?.desde?.trim()) params.desde = filtro.desde.trim()
    if (filtro?.hasta?.trim()) params.hasta = filtro.hasta.trim()

    const response = await apiClient.get<
      BackendResult<AccesoAdministrativoDto[]> | AccesoAdministrativoDto[]
    >(API_ENDPOINTS.ADMINISTRACION.ACCESOS, { params })

    const payload = extractResultData(response.data)
    if (!Array.isArray(payload)) return []

    return payload.map((item) => normalizeAcceso(item))
  },

  async obtenerUbicacionesPerfil(
    idPerfil: string,
    activo?: boolean
  ): Promise<UbicacionPerfilDto[]> {
    const params: Record<string, string | boolean> = {
      IdPerfil: idPerfil,
    }
    if (typeof activo === 'boolean') params.Activo = activo

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

  async obtenerRoles(): Promise<RolDto[]> {
    const response = await apiClient.get<BackendResult<RolDto[]> | RolDto[]>(
      API_ENDPOINTS.PARAMETROS.ROLES
    )

    const payload = extractResultData(response.data)
    if (!Array.isArray(payload)) return []

    return payload.map((item) => ({
      id: String(item?.id ?? ''),
      nombre: String(item?.nombre ?? ''),
    }))
  },
}

export default adminService
