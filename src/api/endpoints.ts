export const API_ENDPOINTS = {

  AUTH: {
    LOGIN: '/AdminAuth/login',
    PERFIL: '/AdminAuth/Perfil',
    ME: '/AdminAuth/Perfil',
    MODULOS_PERMITIDOS: '/AdminAuth/MostrarModulosPermitidos',
    MODULOS: '/AdminAuth/MostrarModulosPermitidos',
    CHANGE_PASSWORD: '/AdminAuth/CambiarPassword',
    FORGOT_PASSWORD: '/AdminAuth/OlvidePassword',
    RESET_PASSWORD: '/AdminAuth/ResetPassword',
    VERIFY_2FA: '/AdminAuth/VerificarCodigo',
    LOGOUT: '/Auth/CerrarSesion',
    REFRESH: '/Auth/RefreshToken',
  },

  ADMINISTRACION: {
    RESUMEN: '/Administracion/Resumen',
    AUDITORIA: '/Administracion/Auditoria',
    ACCESOS: '/Administracion/Accesos',

    USUARIOS_SISTEMA: {
      LIST: '/Administracion/UsuariosSistema',
      CREATE: '/Administracion/UsuariosSistema',
      CAMBIAR_ESTADO: (id: string | number) => `/Administracion/UsuariosSistema/${id}/Estado`,
    },

    CLIENTES: '/Administracion/Clientes',
    PROVEEDORES: '/Administracion/Proveedores',
    SOLICITUDES: '/Administracion/Solicitudes',

    VERIFICACIONES: {
      LIST: '/Administracion/Verificaciones',
      RESOLVER: (id: string | number) => `/Administracion/Verificaciones/${id}/Resolver`,
    },

    PERFILES: {
      CAMBIAR_ESTADO: (id: string | number) => `/Administracion/Perfiles/${id}/Estado`,
    },
  },

  PAGOS: {
    LIST: '/Pagos/Administracion',
    PENDIENTES: '/Pagos/Administracion/Pendientes',
    CONFIRMAR: (id: string | number) => `/Pagos/${id}/Confirmar`,
    RECHAZAR: (id: string | number) => `/Pagos/${id}/Rechazar`,
  },

  RETIROS: {
    LIST: '/Retiros/Administracion',
    PENDIENTES: '/Retiros/Administracion/Pendientes',
    COMPLETAR: (id: string | number) => `/Retiros/${id}/Completar`,
    RECHAZAR: (id: string | number) => `/Retiros/${id}/Rechazar`,
  },

  PARAMETROS: {
    ROLES: '/Parametros/Roles',

    CONFIGURACIONES: {
      LIST: '/Parametros/Configuraciones',
      UPDATE: '/Parametros/Configuraciones',
    },

    MODULOS: '/Parametros/Modulos',

    PERMISOS_MODULOS: {
      LIST: '/Parametros/PermisosModulos',
      UPDATE: '/Parametros/PermisosModulos',
    },

    CATEGORIAS: {
      LIST: '/Parametros/Categorias',
      CREATE: '/Parametros/Categorias',
      UPDATE: (id: string | number) => `/Parametros/Categorias/${id}`,
      DELETE: (id: string | number) => `/Parametros/Categorias/${id}`,
    },

    ESPECIALIDADES: {
      LIST: '/Parametros/Especialidades',
      CREATE: '/Parametros/Especialidades',
      UPDATE: (id: string | number) => `/Parametros/Especialidades/${id}`,
      DELETE: (id: string | number) => `/Parametros/Especialidades/${id}`,
    },

    COMISIONES: {
      LIST: '/Parametros/Comisiones',
      CREATE: '/Parametros/Comisiones',
      UPDATE: (id: string | number) => `/Parametros/Comisiones/${id}`,
      DELETE: (id: string | number) => `/Parametros/Comisiones/${id}`,
    },

    UBICACIONES_CLIENTE_PROVEEDOR: '/Parametros/UbicacionesClienteProveedor',
  },
} as const
