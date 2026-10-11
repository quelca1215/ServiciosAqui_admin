import { createRouter, createWebHistory } from 'vue-router'
import LoginAdminView from '../views/LoginView.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import DashboardView from '../views/DashboardView.vue'
import UsersView from '../views/UsersView.vue'
import VerificationView from '../views/VerificationView.vue'
import PaymentsView from '../views/PaymentsView.vue'
import CategoriesView from '../views/CategoriesView.vue'
import ReportsView from '../views/ReportsView.vue'
import AuditView from '../views/AuditView.vue'
import SettingsView from '../views/SettingsView.vue'
import ProfileView from '../views/ProfileView.vue'
import UserDetailView from '../views/UserDetailView.vue'
import ModulePlaceholderView from '../views/ModulePlaceholderView.vue'
import { isAuthenticated } from '@/api'

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
        // Usuarios y Perfiles
        {
          path: 'usuarios',
          name: 'usuarios',
          component: UsersView,
          meta: { title: 'Gestión de Usuarios', section: 'USUARIOS' }
        },
        {
          path: 'usuarios/clientes',
          name: 'usuarios-clientes',
          component: UsersView,
          meta: { title: 'Clientes', section: 'USUARIOS' }
        },
        {
          path: 'usuarios/prestadores',
          name: 'usuarios-prestadores',
          component: UsersView,
          meta: { title: 'Prestadores de Servicios', section: 'USUARIOS' }
        },
        {
          path: 'usuarios/personal',
          name: 'usuarios-personal',
          component: UsersView,
          meta: { title: 'Personal Interno', section: 'USUARIOS' }
        },
        {
          path: 'usuarios/:id',
          name: 'usuario-detalle',
          component: UserDetailView,
          meta: { title: 'Detalle de Usuario', section: 'USUARIOS' }
        },
        {
          path: 'verificacion',
          name: 'verificacion',
          component: VerificationView,
          meta: { title: 'Verificación (KYC)', section: 'USUARIOS' }
        },

        // Operaciones
        {
          path: 'operaciones/solicitudes',
          name: 'operaciones-solicitudes',
          component: ModulePlaceholderView,
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

        // Catálogo
        {
          path: 'categorias',
          name: 'categorias',
          component: CategoriesView,
          meta: { title: 'Categorías', section: 'CATÁLOGO' }
        },
        {
          path: 'catalogo/categorias',
          name: 'catalogo-categorias',
          component: CategoriesView,
          meta: { title: 'Categorías', section: 'CATÁLOGO' }
        },
        {
          path: 'catalogo/especialidades',
          name: 'catalogo-especialidades',
          component: ModulePlaceholderView,
          meta: { title: 'Especialidades', section: 'CATÁLOGO' }
        },
        {
          path: 'catalogo/zonas',
          name: 'catalogo-zonas',
          component: ModulePlaceholderView,
          meta: { title: 'Zonas y Ubicaciones', section: 'CATÁLOGO' }
        },

        // Moderación
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

        // Soporte
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

        // Finanzas
        {
          path: 'pagos',
          name: 'pagos',
          component: PaymentsView,
          meta: { title: 'Pagos & Escrow', section: 'FINANZAS' }
        },
        {
          path: 'finanzas/pagos',
          name: 'finanzas-pagos',
          component: PaymentsView,
          meta: { title: 'Pagos & Escrow', section: 'FINANZAS' }
        },
        {
          path: 'finanzas/retiros',
          name: 'finanzas-retiros',
          component: ModulePlaceholderView,
          meta: { title: 'Retiros', section: 'FINANZAS' }
        },
        {
          path: 'finanzas/comisiones',
          name: 'finanzas-comisiones',
          component: ModulePlaceholderView,
          meta: { title: 'Comisiones', section: 'FINANZAS' }
        },
        {
          path: 'finanzas/reportes',
          name: 'finanzas-reportes',
          component: ReportsView,
          meta: { title: 'Reportes Financieros', section: 'FINANZAS' }
        },
        {
          path: 'reportes',
          name: 'reportes',
          component: ReportsView,
          meta: { title: 'Reportes y Analíticas', section: 'FINANZAS' }
        },

        // Marketing
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

        // Administración
        {
          path: 'admin/usuarios',
          name: 'admin-usuarios',
          component: UsersView,
          meta: { title: 'Usuarios del Sistema', section: 'ADMINISTRACIÓN' }
        },
        {
          path: 'admin/roles',
          name: 'admin-roles',
          component: ModulePlaceholderView,
          meta: { title: 'Roles y Permisos', section: 'ADMINISTRACIÓN' }
        },
        {
          path: 'admin/modulos',
          name: 'admin-modulos',
          component: ModulePlaceholderView,
          meta: { title: 'Módulos del Sistema', section: 'ADMINISTRACIÓN' }
        },
        {
          path: 'auditoria',
          name: 'auditoria',
          component: AuditView,
          meta: { title: 'Bitácora de Auditoría', section: 'ADMINISTRACIÓN' }
        },
        {
          path: 'admin/auditoria',
          name: 'admin-auditoria',
          component: AuditView,
          meta: { title: 'Logs y Auditoría', section: 'ADMINISTRACIÓN' }
        },
        {
          path: 'configuracion',
          name: 'configuracion',
          component: SettingsView,
          meta: { title: 'Configuración Global', section: 'ADMINISTRACIÓN' }
        },
        {
          path: 'admin/configuracion',
          name: 'admin-configuracion',
          component: SettingsView,
          meta: { title: 'Configuración Global', section: 'ADMINISTRACIÓN' }
        },

        // Perfil
        {
          path: 'perfil',
          name: 'perfil',
          component: ProfileView,
          meta: { title: 'Mi Perfil' }
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard'
    }
  ]
})

router.beforeEach((to, _from, next) => {
  // Actualizar el título de la pestaña del navegador
  if (to.meta.title) {
    document.title = `${to.meta.title} · ServiciosAquí Admin`
  }

  const loggedIn = isAuthenticated()
  const isLoginPage = to.name === 'login'

  // Si no ha iniciado sesión e intenta acceder a una ruta protegida
  if (!loggedIn && !isLoginPage) {
    return next({ name: 'login' })
  }

  next()
})

export default router