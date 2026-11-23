export interface ResumenAdministrativoDto {
  clientes: number
  proveedores: number
  solicitudesPendientes: number
  serviciosEnProceso: number
  pagosPendientes: number
  retirosPendientes: number
  verificacionesPendientes: number
}

export interface UsuarioInternoDto {
  id: string
  nombreUsuario: string
  nombreCompleto: string
  email: string
  rol: string
  areaDepartamento: string
  estado: boolean
  fechaRegistro: string
}

export interface UsuariosSistemaFiltro {
  buscar?: string
  rol?: string
  estado?: boolean
  omitir?: number
  limite?: number
}

export interface CrearUsuarioInternoPayload {
  nombreUsuario: string
  email: string
  nombres: string
  apellidoPaterno?: string | null
  apellidoMaterno?: string | null
  password: string
  rol: string
  areaDepartamento: string
}

export interface CambiarEstadoUsuarioInternoPayload {
  estado: boolean
}

export interface RolDto {
  id: string
  nombre: string
}

export interface PerfilAdministracionDto {
  idPerfil: string
  userId: string
  tipoPerfil: string
  nombreCompleto: string
  correo: string
  telefono: string
  estado: string
  fechaRegistro: string
  verificacionDocumentoIdentidad: boolean
  rating: number
}

export interface PerfilesFiltro {
  estado?: string
  buscar?: string
  omitir?: number
  limite?: number
}

export interface CambiarEstadoPerfilPayload {
  estado: string
}

export interface UbicacionPerfilDto {
  idPerfil: string
  nombreUbicacion: string
  latitud: number
  longitud: number
  activo: boolean
}

export interface SolicitudAdministracionDto {
  idSolicitudServicio: string
  titulo: string
  descripcion: string
  estado: string
  presupuesto: number | null
  direccion: string
  fechaCreacion: string
  idPerfilCliente: string
  nombreCliente: string
  idServicioAsignado: string | null
  estadoServicio: string | null
  montoServicio: number | null
  idPerfilProveedor: string | null
  nombreProveedor: string | null
}

export interface SolicitudesFiltro {
  estado?: string
  buscar?: string
  omitir?: number
  limite?: number
}

export interface VerificacionIdentidadDto {
  idDocumentoDeIdentidad: string
  idUsuario: string
  nombreCompleto: string
  correo: string
  tipoDocumento: string
  numeroDocumento: string
  fotoFrontal: string
  fotoPosterior: string
  fotoSelfie: string
  estado: string
  observacion: string
  fechaRegistro: string
}

export interface VerificacionesFiltro {
  estado?: string
  omitir?: number
  limite?: number
}

export interface ResolverVerificacionPayload {
  aprobar: boolean
  observacion?: string | null
}

export interface RegistroAuditoriaAdministrativaDto {
  id: string
  administrador: string
  accion: string
  moduloAfectado: string
  idRegistroAfectado: string
  datosAnterioresJson: string
  datosNuevosJson: string
  direccionIp: string
  fechaRegistro: string
}

export interface AuditoriaFiltro {
  modulo?: string
  desde?: string
  hasta?: string
  omitir?: number
  limite?: number
}

export interface AccesoAdministrativoDto {
  id: string
  administrador: string
  direccionIp: string
  userAgent: string
  exitoso: boolean
  motivoFallo: string
  fechaIntento: string
}

export interface AccesosFiltro {
  administradorId?: string
  exitoso?: boolean
  desde?: string
  hasta?: string
  omitir?: number
  limite?: number
}

export interface PagoAdministracionDto {
  idPago: string
  idServicioAsignado: string
  montoServicio: number
  montoUsoApp: number
  montoTotal: number
  metodoPago: string
  estado: string
  fechaCreacion: string
  tituloSolicitud: string
  nombreCliente: string
  nombreProveedor: string
}

export interface RetiroAdministracionDto {
  idRetiro: string
  monto: number
  estado: string
  bancoDestino: string
  nroCuentaDestino: string
  nroTransaccion: string
  fechaCreacion: string
  fechaRetiro: string | null
  idPerfilProveedor: string
  nombreProveedor: string
}

export interface CompletarRetiroPayload {
  bancoOrigen?: string | null
  nroCuentaOrigen?: string | null
  nroTransaccion?: string | null
}

export type TipoDatoConfiguracion =
  | 'String'
  | 'Integer'
  | 'Decimal'
  | 'Boolean'
  | 'Json'

export interface ConfiguracionAdministrativaDto {
  id: string
  clave: string
  valor: string
  descripcion: string
  tipoDato: TipoDatoConfiguracion | string
  fechaActualizacion: string
}

export interface GuardarConfiguracionPayload {
  clave: string
  valor: string
  descripcion?: string | null
  tipoDato: TipoDatoConfiguracion | string
}

export interface ModuloAdministrativoDto {
  id: string
  nombre: string
  ruta: string
  seccion: string
  orden: number
  moduloPadreId: string | null
}

export interface PermisoModuloDto {
  rolId: string
  rol: string
  moduloId: string
  modulo: string
  puedeVer: boolean | null
  puedeCrear: boolean | null
  puedeEditar: boolean | null
  puedeEliminar: boolean | null
}

export interface ActualizarPermisoModuloPayload {
  rolId: string
  moduloId: string
  puedeVer: boolean
  puedeCrear: boolean
  puedeEditar: boolean
  puedeEliminar: boolean
}

export interface CategoriaDto {
  idCategoria: string
  nombre: string
  descripcion: string
  tipoCategoria: string
  icono: string
}

export interface GuardarCategoriaPayload {
  id?: string
  nombre: string
  descripcion?: string | null
  tipoCategoria?: string | null
  icono?: string | null
}

export interface EspecialidadDto {
  idEspecialidad: string
  idCategoria: string
  nombre: string
}

export interface GuardarEspecialidadPayload {
  id?: string
  idCategoria: string
  nombre: string
}

export interface ComisionDto {
  idConfiguracionComision: string
  porsentajeComision: number
  activo: boolean
  fechaCreacion: string
  fechaActualizacion: string | null
}

export interface GuardarComisionPayload {
  id?: string
  porsentajeComision: number
  activo: boolean
}
