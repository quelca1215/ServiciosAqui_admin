import type { ModuloMenuDto } from '@/api/types/auth.types'

/**
 * ==============================================================================
 * MÓDULOS DEL SISTEMA POR DEFECTO (ServiciosAquí Admin)
 * ==============================================================================
 * Corresponden a la estructura oficial del backend para Administradores / SuperAdmin.
 * Se utilizan como estado inicial o fallback offline antes de la sincronización.
 */
export const DEFAULT_MODULOS: ModuloMenuDto[] = [
  {
    moduloId: '11111111-1111-1111-1111-111111111111',
    nombre: 'Dashboard',
    ruta: '/dashboard',
    icono: 'dashboard',
    seccion: 'PRINCIPAL',
    orden: 1,
    permisos: {
      puedeVer: true,
      puedeCrear: null,
      puedeEditar: null,
      puedeEliminar: null
    }
  },
  {
    moduloId: '22222222-2222-2222-2222-222222222222',
    nombre: 'Usuarios y Perfiles',
    ruta: null,
    icono: 'group',
    seccion: 'USUARIOS',
    orden: 2,
    permisos: {
      puedeVer: true,
      puedeCrear: null,
      puedeEditar: null,
      puedeEliminar: null
    },
    submodulos: [
      {
        moduloId: '22222222-2222-2222-2222-222222222201',
        nombre: 'Clientes',
        ruta: '/usuarios/clientes',
        icono: 'person',
        seccion: 'USUARIOS',
        orden: 1,
        permisos: {
          puedeVer: true,
          puedeCrear: true,
          puedeEditar: true,
          puedeEliminar: true
        }
      },
      {
        moduloId: '22222222-2222-2222-2222-222222222202',
        nombre: 'Prestadores',
        ruta: '/usuarios/prestadores',
        icono: 'engineering',
        seccion: 'USUARIOS',
        orden: 2,
        permisos: {
          puedeVer: true,
          puedeCrear: true,
          puedeEditar: true,
          puedeEliminar: true
        }
      },
      {
        moduloId: '22222222-2222-2222-2222-222222222203',
        nombre: 'Personal Interno',
        ruta: '/usuarios/personal',
        icono: 'badge',
        seccion: 'USUARIOS',
        orden: 3,
        permisos: {
          puedeVer: true,
          puedeCrear: true,
          puedeEditar: true,
          puedeEliminar: true
        }
      }
    ]
  },
  {
    moduloId: '33333333-3333-3333-3333-333333333333',
    nombre: 'Operaciones',
    ruta: null,
    icono: 'work',
    seccion: 'OPERACIONES',
    orden: 3,
    permisos: {
      puedeVer: true,
      puedeCrear: null,
      puedeEditar: null,
      puedeEliminar: null
    },
    submodulos: [
      {
        moduloId: '33333333-3333-3333-3333-333333333301',
        nombre: 'Solicitudes',
        ruta: '/operaciones/solicitudes',
        icono: 'assignment',
        seccion: 'OPERACIONES',
        orden: 1,
        permisos: {
          puedeVer: true,
          puedeCrear: true,
          puedeEditar: true,
          puedeEliminar: true
        }
      },
      {
        moduloId: '33333333-3333-3333-3333-333333333302',
        nombre: 'Cotizaciones',
        ruta: '/operaciones/cotizaciones',
        icono: 'request_quote',
        seccion: 'OPERACIONES',
        orden: 2,
        permisos: {
          puedeVer: true,
          puedeCrear: true,
          puedeEditar: true,
          puedeEliminar: true
        }
      },
      {
        moduloId: '33333333-3333-3333-3333-333333333303',
        nombre: 'Servicios y Tracking',
        ruta: '/operaciones/servicios',
        icono: 'local_shipping',
        seccion: 'OPERACIONES',
        orden: 3,
        permisos: {
          puedeVer: true,
          puedeCrear: true,
          puedeEditar: true,
          puedeEliminar: true
        }
      },
      {
        moduloId: '33333333-3333-3333-3333-333333333304',
        nombre: 'Conversaciones',
        ruta: '/operaciones/conversaciones',
        icono: 'forum',
        seccion: 'OPERACIONES',
        orden: 4,
        permisos: {
          puedeVer: true,
          puedeCrear: true,
          puedeEditar: true,
          puedeEliminar: true
        }
      }
    ]
  },
  {
    moduloId: '44444444-4444-4444-4444-444444444444',
    nombre: 'Catálogo',
    ruta: null,
    icono: 'category',
    seccion: 'CATÁLOGO',
    orden: 4,
    permisos: {
      puedeVer: true,
      puedeCrear: null,
      puedeEditar: null,
      puedeEliminar: null
    },
    submodulos: [
      {
        moduloId: '44444444-4444-4444-4444-444444444401',
        nombre: 'Categorías',
        ruta: '/catalogo/categorias',
        icono: 'style',
        seccion: 'CATÁLOGO',
        orden: 1,
        permisos: {
          puedeVer: true,
          puedeCrear: true,
          puedeEditar: true,
          puedeEliminar: true
        }
      },
      {
        moduloId: '44444444-4444-4444-4444-444444444402',
        nombre: 'Especialidades',
        ruta: '/catalogo/especialidades',
        icono: 'build_circle',
        seccion: 'CATÁLOGO',
        orden: 2,
        permisos: {
          puedeVer: true,
          puedeCrear: true,
          puedeEditar: true,
          puedeEliminar: true
        }
      },
      {
        moduloId: '44444444-4444-4444-4444-444444444403',
        nombre: 'Zonas y Ubicaciones',
        ruta: '/catalogo/zonas',
        icono: 'map',
        seccion: 'CATÁLOGO',
        orden: 3,
        permisos: {
          puedeVer: true,
          puedeCrear: true,
          puedeEditar: true,
          puedeEliminar: true
        }
      }
    ]
  },
  {
    moduloId: '55555555-5555-5555-5555-555555555555',
    nombre: 'Moderación',
    ruta: null,
    icono: 'gavel',
    seccion: 'MODERACIÓN',
    orden: 5,
    permisos: {
      puedeVer: true,
      puedeCrear: null,
      puedeEditar: null,
      puedeEliminar: null
    },
    submodulos: [
      {
        moduloId: '55555555-5555-5555-5555-555555555501',
        nombre: 'Reseñas y Calificaciones',
        ruta: '/moderacion/resenas',
        icono: 'rate_review',
        seccion: 'MODERACIÓN',
        orden: 1,
        permisos: {
          puedeVer: true,
          puedeCrear: true,
          puedeEditar: true,
          puedeEliminar: true
        }
      },
      {
        moduloId: '55555555-5555-5555-5555-555555555502',
        nombre: 'Reportes de Incidencias',
        ruta: '/moderacion/reportes',
        icono: 'report_problem',
        seccion: 'MODERACIÓN',
        orden: 2,
        permisos: {
          puedeVer: true,
          puedeCrear: true,
          puedeEditar: true,
          puedeEliminar: true
        }
      },
      {
        moduloId: '55555555-5555-5555-5555-555555555503',
        nombre: 'Disputas',
        ruta: '/moderacion/disputas',
        icono: 'gavel',
        seccion: 'MODERACIÓN',
        orden: 3,
        permisos: {
          puedeVer: true,
          puedeCrear: true,
          puedeEditar: true,
          puedeEliminar: true
        }
      }
    ]
  },
  {
    moduloId: '66666666-6666-6666-6666-666666666666',
    nombre: 'Soporte',
    ruta: null,
    icono: 'headset_mic',
    seccion: 'SOPORTE',
    orden: 6,
    permisos: {
      puedeVer: true,
      puedeCrear: null,
      puedeEditar: null,
      puedeEliminar: null
    },
    submodulos: [
      {
        moduloId: '66666666-6666-6666-6666-666666666601',
        nombre: 'Tickets de Soporte',
        ruta: '/soporte/tickets',
        icono: 'confirmation_number',
        seccion: 'SOPORTE',
        orden: 1,
        permisos: {
          puedeVer: true,
          puedeCrear: true,
          puedeEditar: true,
          puedeEliminar: true
        }
      },
      {
        moduloId: '66666666-6666-6666-6666-666666666602',
        nombre: 'Reclamaciones',
        ruta: '/soporte/reclamaciones',
        icono: 'support_agent',
        seccion: 'SOPORTE',
        orden: 2,
        permisos: {
          puedeVer: true,
          puedeCrear: true,
          puedeEditar: true,
          puedeEliminar: true
        }
      }
    ]
  },
  {
    moduloId: '77777777-7777-7777-7777-777777777777',
    nombre: 'Finanzas',
    ruta: null,
    icono: 'payments',
    seccion: 'FINANZAS',
    orden: 7,
    permisos: {
      puedeVer: true,
      puedeCrear: null,
      puedeEditar: null,
      puedeEliminar: null
    },
    submodulos: [
      {
        moduloId: '77777777-7777-7777-7777-777777777701',
        nombre: 'Pagos',
        ruta: '/finanzas/pagos',
        icono: 'credit_card',
        seccion: 'FINANZAS',
        orden: 1,
        permisos: {
          puedeVer: true,
          puedeCrear: true,
          puedeEditar: true,
          puedeEliminar: true
        }
      },
      {
        moduloId: '77777777-7777-7777-7777-777777777702',
        nombre: 'Retiros',
        ruta: '/finanzas/retiros',
        icono: 'account_balance',
        seccion: 'FINANZAS',
        orden: 2,
        permisos: {
          puedeVer: true,
          puedeCrear: true,
          puedeEditar: true,
          puedeEliminar: true
        }
      },
      {
        moduloId: '77777777-7777-7777-7777-777777777703',
        nombre: 'Comisiones',
        ruta: '/finanzas/comisiones',
        icono: 'percent',
        seccion: 'FINANZAS',
        orden: 3,
        permisos: {
          puedeVer: true,
          puedeCrear: true,
          puedeEditar: true,
          puedeEliminar: true
        }
      },
      {
        moduloId: '77777777-7777-7777-7777-777777777704',
        nombre: 'Reportes Financieros',
        ruta: '/finanzas/reportes',
        icono: 'analytics',
        seccion: 'FINANZAS',
        orden: 4,
        permisos: {
          puedeVer: true,
          puedeCrear: true,
          puedeEditar: true,
          puedeEliminar: true
        }
      }
    ]
  },
  {
    moduloId: '88888888-8888-8888-8888-888888888888',
    nombre: 'Marketing',
    ruta: null,
    icono: 'campaign',
    seccion: 'MARKETING',
    orden: 8,
    permisos: {
      puedeVer: true,
      puedeCrear: null,
      puedeEditar: null,
      puedeEliminar: null
    },
    submodulos: [
      {
        moduloId: '88888888-8888-8888-8888-888888888801',
        nombre: 'Cupones y Promociones',
        ruta: '/marketing/cupones',
        icono: 'local_offer',
        seccion: 'MARKETING',
        orden: 1,
        permisos: {
          puedeVer: true,
          puedeCrear: true,
          puedeEditar: true,
          puedeEliminar: true
        }
      },
      {
        moduloId: '88888888-8888-8888-8888-888888888802',
        nombre: 'Notificaciones Push',
        ruta: '/marketing/notificaciones',
        icono: 'notifications_active',
        seccion: 'MARKETING',
        orden: 2,
        permisos: {
          puedeVer: true,
          puedeCrear: true,
          puedeEditar: true,
          puedeEliminar: true
        }
      }
    ]
  },
  {
    moduloId: '99999999-9999-9999-9999-999999999999',
    nombre: 'Administración',
    ruta: null,
    icono: 'admin_panel_settings',
    seccion: 'ADMINISTRACIÓN',
    orden: 9,
    permisos: {
      puedeVer: true,
      puedeCrear: null,
      puedeEditar: null,
      puedeEliminar: null
    },
    submodulos: [
      {
        moduloId: '99999999-9999-9999-9999-999999999901',
        nombre: 'Usuarios del Sistema',
        ruta: '/admin/usuarios',
        icono: 'manage_accounts',
        seccion: 'ADMINISTRACIÓN',
        orden: 1,
        permisos: {
          puedeVer: true,
          puedeCrear: true,
          puedeEditar: true,
          puedeEliminar: true
        }
      },
      {
        moduloId: '99999999-9999-9999-9999-999999999902',
        nombre: 'Roles y Permisos',
        ruta: '/admin/roles',
        icono: 'security',
        seccion: 'ADMINISTRACIÓN',
        orden: 2,
        permisos: {
          puedeVer: true,
          puedeCrear: true,
          puedeEditar: true,
          puedeEliminar: true
        }
      },
      {
        moduloId: '99999999-9999-9999-9999-999999999903',
        nombre: 'Módulos del Sistema',
        ruta: '/admin/modulos',
        icono: 'view_module',
        seccion: 'ADMINISTRACIÓN',
        orden: 3,
        permisos: {
          puedeVer: true,
          puedeCrear: true,
          puedeEditar: true,
          puedeEliminar: true
        }
      },
      {
        moduloId: '99999999-9999-9999-9999-999999999904',
        nombre: 'Logs y Auditoría',
        ruta: '/admin/auditoria',
        icono: 'receipt_long',
        seccion: 'ADMINISTRACIÓN',
        orden: 4,
        permisos: {
          puedeVer: true,
          puedeCrear: true,
          puedeEditar: true,
          puedeEliminar: true
        }
      },
      {
        moduloId: '99999999-9999-9999-9999-999999999905',
        nombre: 'Configuración Global',
        ruta: '/admin/configuracion',
        icono: 'settings',
        seccion: 'ADMINISTRACIÓN',
        orden: 5,
        permisos: {
          puedeVer: true,
          puedeCrear: true,
          puedeEditar: true,
          puedeEliminar: true
        }
      }
    ]
  }
]

