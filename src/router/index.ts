import { createRouter, createWebHistory } from 'vue-router'
import LoginAdminView from '../views/LoginView.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import DashboardView from '../views/DashboardView.vue'
import VerificationView from '../views/VerificationView.vue'
import ProfileView from '../views/ProfileView.vue'
import UnauthorizedView from '../views/UnauthorizedView.vue'
import { isAuthenticated } from '@/api'
import { userStore } from '@/store'
import { hasRouteAccess } from '@/composables/usePermissions'

const ModulePlaceholderView = () => import('../views/ModulePlaceholderView.vue')

const ClientesView = () => import('../views/usuarios/ClientesView.vue')
const ProveedoresView = () => import('../views/usuarios/ProveedoresView.vue')

const SolicitudesView = () => import('../views/operaciones/SolicitudesView.vue')

const CategoriasView = () => import('../views/catalogo/CategoriasView.vue')
const EspecialidadesView = () => import('../views/catalogo/EspecialidadesView.vue')
const ZonasView = () => import('../views/catalogo/ZonasView.vue')

const PagosView = () => import('../views/finanzas/PagosView.vue')
const RetirosView = () => import('../views/finanzas/RetirosView.vue')
const ComisionesView = () => import('../views/finanzas/ComisionesView.vue')

const PersonalInternoView = () => import('../views/admin/PersonalInternoView.vue')
const RolesView = () => import('../views/admin/RolesView.vue')
const ModulosView = () => import('../views/admin/ModulosView.vue')
const AuditoriaView = () => import('../views/admin/AuditoriaView.vue')
const ConfiguracionView = () => import('../views/admin/ConfiguracionView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginAdminView,
      meta: { title: 'Iniciar Sesión' }
    },
    {
      path: '/',
      component: AdminLayout,
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: DashboardView,
          meta: { title: 'Dashboard', section: 'PRINCIPAL' }
        },
        {
          path: 'usuarios',
          name: 'usuarios',
          component: ModulePlaceholderView,
          meta: { title: 'Gestión de Usuarios', section: 'USUARIOS' }
        },
        {
          path: 'clientes',
          redirect: '/usuarios/clientes'
        },
        {
          path: 'usuarios/clientes',
          name: 'usuarios-clientes',
          component: ClientesView,
          meta: { title: 'Clientes', section: 'USUARIOS' }
        },
        {
          path: 'proveedores',
          redirect: '/usuarios/prestadores'
        },
        {
          path: 'usuarios/prestadores',
          name: 'usuarios-prestadores',
          component: ProveedoresView,
          meta: { title: 'Prestadores de Servicios', section: 'USUARIOS' }
        },
        {
          path: 'usuarios/personal',
          name: 'usuarios-personal',
          component: PersonalInternoView,
          meta: { title: 'Personal Interno', section: 'USUARIOS' }
        },
        {
          path: 'usuarios/:id',
          name: 'usuario-detalle',
          component: ModulePlaceholderView,
          meta: { title: 'Detalle de Usuario', section: 'USUARIOS' }
        },
        {
          path: 'verificacion',
          name: 'verificacion',
          component: VerificationView,
          meta: { title: 'Verificación (KYC)', section: 'USUARIOS' }
        },

        {
          path: 'operaciones/solicitudes',
          name: 'operaciones-solicitudes',
          component: SolicitudesView,
          meta: { title: 'Solicitudes', section: 'OPERACIONES' }
        },
        {
          path: 'operaciones/cotizaciones',
          name: 'operaciones-cotizaciones',
          component: ModulePlaceholderView,
          meta: { title: 'Cotizaciones', section: 'OPERACIONES' }
        },
        {
          path: 'operaciones/servicios',
          name: 'operaciones-servicios',
          component: ModulePlaceholderView,
          meta: { title: 'Servicios y Tracking', section: 'OPERACIONES' }
        },
        {
          path: 'operaciones/conversaciones',
          name: 'operaciones-conversaciones',
          component: ModulePlaceholderView,
          meta: { title: 'Conversaciones', section: 'OPERACIONES' }
        },

        {
          path: 'categorias',
          name: 'categorias',
          component: CategoriasView,
          meta: { title: 'Categorías', section: 'CATÁLOGO' }
        },
        {
          path: 'catalogo/categorias',
          name: 'catalogo-categorias',
          component: CategoriasView,
          meta: { title: 'Categorías', section: 'CATÁLOGO' }
        },
        {
          path: 'catalogo/especialidades',
          name: 'catalogo-especialidades',
          component: EspecialidadesView,
          meta: { title: 'Especialidades', section: 'CATÁLOGO' }
        },
        {
          path: 'catalogo/zonas',
          name: 'catalogo-zonas',
          component: ZonasView,
          meta: { title: 'Zonas y Ubicaciones', section: 'CATÁLOGO' }
        },

        {
          path: 'moderacion/resenas',
          name: 'moderacion-resenas',
          component: ModulePlaceholderView,
          meta: { title: 'Reseñas y Calificaciones', section: 'MODERACIÓN' }
        },
        {
          path: 'moderacion/reportes',
          name: 'moderacion-reportes',
          component: ModulePlaceholderView,
          meta: { title: 'Reportes de Incidencias', section: 'MODERACIÓN' }
        },
        {
          path: 'moderacion/disputas',
          name: 'moderacion-disputas',
          component: ModulePlaceholderView,
          meta: { title: 'Disputas', section: 'MODERACIÓN' }
        },

        {
          path: 'soporte/tickets',
          name: 'soporte-tickets',
          component: ModulePlaceholderView,
          meta: { title: 'Tickets de Soporte', section: 'SOPORTE' }
        },
        {
          path: 'soporte/reclamaciones',
          name: 'soporte-reclamaciones',
          component: ModulePlaceholderView,
          meta: { title: 'Reclamaciones', section: 'SOPORTE' }
        },

        {
          path: 'pagos',
          name: 'pagos',
          component: PagosView,
          meta: { title: 'Pagos & Escrow', section: 'FINANZAS' }
        },
        {
          path: 'finanzas/pagos',
          name: 'finanzas-pagos',
          component: PagosView,
          meta: { title: 'Pagos & Escrow', section: 'FINANZAS' }
        },
        {
          path: 'finanzas/retiros',
          name: 'finanzas-retiros',
          component: RetirosView,
          meta: { title: 'Retiros', section: 'FINANZAS' }
        },
        {
          path: 'finanzas/comisiones',
          name: 'finanzas-comisiones',
          component: ComisionesView,
          meta: { title: 'Comisiones', section: 'FINANZAS' }
        },
        {
          path: 'finanzas/reportes',
          name: 'finanzas-reportes',
          component: ModulePlaceholderView,
          meta: { title: 'Reportes Financieros', section: 'FINANZAS' }
        },
        {
          path: 'reportes',
          name: 'reportes',
          component: ModulePlaceholderView,
          meta: { title: 'Reportes y Analíticas', section: 'FINANZAS' }
        },

        {
          path: 'marketing/cupones',
          name: 'marketing-cupones',
          component: ModulePlaceholderView,
          meta: { title: 'Cupones y Promociones', section: 'MARKETING' }
        },
        {
          path: 'marketing/notificaciones',
          name: 'marketing-notificaciones',
          component: ModulePlaceholderView,
          meta: { title: 'Notificaciones Push', section: 'MARKETING' }
        },

        {
          path: 'admin/usuarios',
          name: 'admin-usuarios',
          component: PersonalInternoView,
          meta: { title: 'Usuarios del Sistema', section: 'ADMINISTRACIÓN' }
        },
        {
          path: 'admin/roles',
          name: 'admin-roles',
          component: RolesView,
          meta: { title: 'Roles y Permisos', section: 'ADMINISTRACIÓN' }
        },
        {
          path: 'admin/modulos',
          name: 'admin-modulos',
          component: ModulosView,
          meta: { title: 'Módulos del Sistema', section: 'ADMINISTRACIÓN' }
        },
        {
          path: 'auditoria',
          name: 'auditoria',
          component: AuditoriaView,
          meta: { title: 'Bitácora de Auditoría', section: 'ADMINISTRACIÓN' }
        },
        {
          path: 'admin/auditoria',
          name: 'admin-auditoria',
          component: AuditoriaView,
          meta: { title: 'Logs y Auditoría', section: 'ADMINISTRACIÓN' }
        },
        {
          path: 'configuracion',
          name: 'configuracion',
          component: ConfiguracionView,
          meta: { title: 'Configuración Global', section: 'ADMINISTRACIÓN' }
        },
        {
          path: 'admin/configuracion',
          name: 'admin-configuracion',
          component: ConfiguracionView,
          meta: { title: 'Configuración Global', section: 'ADMINISTRACIÓN' }
        },

        {
          path: 'perfil',
          name: 'perfil',
          component: ProfileView,
          meta: { title: 'Mi Perfil' }
        },
        {
          path: 'sin-acceso',
          name: 'sin-acceso',
          component: UnauthorizedView,
          meta: { title: 'Acceso Restringido' }
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard'
    }
  ]
})

const EXEMPT_RBAC_ROUTES = new Set(['login', 'dashboard', 'perfil', 'sin-acceso'])

router.beforeEach(async (to, _from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} · ServiciosAquí Admin`
  }

  const loggedIn = isAuthenticated()
  const isLoginPage = to.name === 'login'

  if (!loggedIn && !isLoginPage) {
    return next({ name: 'login' })
  }

  if (loggedIn && isLoginPage) {
    return next({ name: 'dashboard' })
  }

  if (loggedIn && !EXEMPT_RBAC_ROUTES.has(String(to.name || ''))) {
    if (userStore.modulos.length === 0) {
      await userStore.cargarModulos()
    }

    if (!hasRouteAccess(to.path, userStore.modulos)) {
      return next({
        name: 'sin-acceso',
        query: { from: to.fullPath },
      })
    }
  }

  next()
})

export default router
