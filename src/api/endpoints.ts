/**
 * ==============================================================================
 * CATÁLOGO CENTRALIZADO DE ENDPOINTS DE LA API (ServiciosAquí Admin)
 * ==============================================================================
 * Define todas las rutas relativas de la API para mantener el código desacoplado
 * y facilitar actualizaciones cuando cambie una versión o ruta del backend.
 */
export const API_ENDPOINTS = {
  // Autenticación y Cuentas de Operador
  AUTH: {
    LOGIN: '/AdminAuth/login',
    LOGOUT: '/Auth/CerrarSesion',
    MODULOS_PERMITIDOS: '/AdminAuth/MostrarModulosPermitidos',
    MODULOS: '/AdminAuth/MostrarModulosPermitidos',

    ME: '/auth/me',
    REFRESH: '/auth/refresh',

    FORGOT_PASSWORD: '/AdminAuth/OlvidePassword',
    RESET_PASSWORD: '/AdminAuth/ResetPassword',
    CHANGE_PASSWORD: '/AdminAuth/CambiarPassword',
    VERIFY_2FA: '/AdminAuth/VerificarCodigo',
  },

  // Gestión de Usuarios (Clientes y Proveedores de Servicios)
  USERS: {
    LIST: '/users',
    DETAIL: (id: string | number) => `/users/${id}`,
    UPDATE: (id: string | number) => `/users/${id}`,
    DELETE: (id: string | number) => `/users/${id}`,
    CHANGE_STATUS: (id: string | number) => `/users/${id}/status`,
    SUSPEND: (id: string | number) => `/users/${id}/suspend`,
    REACTIVATE: (id: string | number) => `/users/${id}/reactivate`,
    ACTIVITY_LOGS: (id: string | number) => `/users/${id}/activity`,
  },

  // Verificación de Identidad (e-KYC)
  VERIFICATION: {
    LIST: '/verifications',
    DETAIL: (id: string | number) => `/verifications/${id}`,
    APPROVE: (id: string | number) => `/verifications/${id}/approve`,
    REJECT: (id: string | number) => `/verifications/${id}/reject`,
    REQUEST_CHANGES: (id: string | number) => `/verifications/${id}/request-changes`,
  },

  // Pagos, Transacciones y Custodia Escrow
  PAYMENTS: {
    TRANSACTIONS: '/payments/transactions',
    TRANSACTION_DETAIL: (id: string | number) => `/payments/transactions/${id}`,
    ESCROW_LIST: '/payments/escrow',
    ESCROW_DETAIL: (id: string | number) => `/payments/escrow/${id}`,
    RELEASE_ESCROW: (id: string | number) => `/payments/escrow/${id}/release`,
    REFUND_ESCROW: (id: string | number) => `/payments/escrow/${id}/refund`,
    DISPUTES: '/payments/disputes',
  },

  // Categorías y Subcategorías de Oficios/Servicios
  CATEGORIES: {
    LIST: '/categories',
    CREATE: '/categories',
    DETAIL: (id: string | number) => `/categories/${id}`,
    UPDATE: (id: string | number) => `/categories/${id}`,
    DELETE: (id: string | number) => `/categories/${id}`,
    REORDER: '/categories/reorder',
  },

  // Métricas, Analíticas y Reportes de Plataforma
  REPORTS: {
    DASHBOARD_STATS: '/reports/dashboard-stats',
    REVENUE_CHART: '/reports/revenue',
    USER_GROWTH: '/reports/user-growth',
    EXPORT_EXCEL: '/reports/export/excel',
    EXPORT_PDF: '/reports/export/pdf',
  },

  // Bitácora de Auditoría del Sistema
  AUDIT: {
    LOGS: '/audit/logs',
    SECURITY_EVENTS: '/audit/security-events',
    EXPORT: '/audit/export',
  },

  // Configuración Global de la Plataforma
  SETTINGS: {
    GENERAL: '/settings/general',
    FEES: '/settings/fees',
    SECURITY: '/settings/security',
  },
} as const
