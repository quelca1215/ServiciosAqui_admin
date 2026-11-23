import apiClient from '../client'
import { API_ENDPOINTS } from '../endpoints'
import type { BackendResult } from '../types/auth.types'
import type {
  CompletarRetiroPayload,
  PagoAdministracionDto,
  RetiroAdministracionDto,
} from '../types/admin.types'
import { extractResultData } from './admin.service'

function normalizePago(
  item: Partial<PagoAdministracionDto> | undefined
): PagoAdministracionDto {
  return {
    idPago: String(item?.idPago ?? ''),
    idServicioAsignado: String(item?.idServicioAsignado ?? ''),
    montoServicio: Number(item?.montoServicio ?? 0),
    montoUsoApp: Number(item?.montoUsoApp ?? 0),
    montoTotal: Number(item?.montoTotal ?? 0),
    metodoPago: String(item?.metodoPago ?? ''),
    estado: String(item?.estado ?? ''),
    fechaCreacion: String(item?.fechaCreacion ?? ''),
    tituloSolicitud: String(item?.tituloSolicitud ?? ''),
    nombreCliente: String(item?.nombreCliente ?? ''),
    nombreProveedor: String(item?.nombreProveedor ?? ''),
  }
}

function normalizeRetiro(
  item: Partial<RetiroAdministracionDto> | undefined
): RetiroAdministracionDto {
  return {
    idRetiro: String(item?.idRetiro ?? ''),
    monto: Number(item?.monto ?? 0),
    estado: String(item?.estado ?? ''),
    bancoDestino: String(item?.bancoDestino ?? ''),
    nroCuentaDestino: String(item?.nroCuentaDestino ?? ''),
    nroTransaccion: String(item?.nroTransaccion ?? ''),
    fechaCreacion: String(item?.fechaCreacion ?? ''),
    fechaRetiro: item?.fechaRetiro ? String(item.fechaRetiro) : null,
    idPerfilProveedor: String(item?.idPerfilProveedor ?? ''),
    nombreProveedor: String(item?.nombreProveedor ?? ''),
  }
}

export const finanzasService = {
  async obtenerPagos(estado?: string): Promise<PagoAdministracionDto[]> {
    const params: Record<string, string> = {}
    if (estado?.trim()) params.estado = estado.trim()

    const response = await apiClient.get<
      BackendResult<PagoAdministracionDto[]> | PagoAdministracionDto[]
    >(API_ENDPOINTS.PAGOS.LIST, { params })

    const payload = extractResultData(response.data)
    if (!Array.isArray(payload)) return []
    return payload.map((item) => normalizePago(item))
  },

  async obtenerPagosPendientes(): Promise<PagoAdministracionDto[]> {
    const response = await apiClient.get<
      BackendResult<PagoAdministracionDto[]> | PagoAdministracionDto[]
    >(API_ENDPOINTS.PAGOS.PENDIENTES)

    const payload = extractResultData(response.data)
    if (!Array.isArray(payload)) return []
    return payload.map((item) => normalizePago(item))
  },

  async confirmarPago(id: string): Promise<PagoAdministracionDto> {
    const response = await apiClient.post<
      BackendResult<PagoAdministracionDto> | PagoAdministracionDto
    >(API_ENDPOINTS.PAGOS.CONFIRMAR(id))

    return normalizePago(extractResultData(response.data))
  },

  async rechazarPago(id: string): Promise<PagoAdministracionDto> {
    const response = await apiClient.post<
      BackendResult<PagoAdministracionDto> | PagoAdministracionDto
    >(API_ENDPOINTS.PAGOS.RECHAZAR(id))

    return normalizePago(extractResultData(response.data))
  },

  async obtenerRetiros(estado?: string): Promise<RetiroAdministracionDto[]> {
    const params: Record<string, string> = {}
    if (estado?.trim()) params.estado = estado.trim()

    const response = await apiClient.get<
      BackendResult<RetiroAdministracionDto[]> | RetiroAdministracionDto[]
    >(API_ENDPOINTS.RETIROS.LIST, { params })

    const payload = extractResultData(response.data)
    if (!Array.isArray(payload)) return []
    return payload.map((item) => normalizeRetiro(item))
  },

  async obtenerRetirosPendientes(): Promise<RetiroAdministracionDto[]> {
    const response = await apiClient.get<
      BackendResult<RetiroAdministracionDto[]> | RetiroAdministracionDto[]
    >(API_ENDPOINTS.RETIROS.PENDIENTES)

    const payload = extractResultData(response.data)
    if (!Array.isArray(payload)) return []
    return payload.map((item) => normalizeRetiro(item))
  },

  async completarRetiro(
    id: string,
    payload: CompletarRetiroPayload
  ): Promise<RetiroAdministracionDto> {
    const response = await apiClient.post<
      BackendResult<RetiroAdministracionDto> | RetiroAdministracionDto
    >(API_ENDPOINTS.RETIROS.COMPLETAR(id), payload)

    return normalizeRetiro(extractResultData(response.data))
  },

  async rechazarRetiro(id: string): Promise<RetiroAdministracionDto> {
    const response = await apiClient.post<
      BackendResult<RetiroAdministracionDto> | RetiroAdministracionDto
    >(API_ENDPOINTS.RETIROS.RECHAZAR(id))

    return normalizeRetiro(extractResultData(response.data))
  },
}

export default finanzasService
