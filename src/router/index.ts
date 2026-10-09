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
          meta: { title: 'Dashboard' }
        },
        {
          path: 'usuarios',
          name: 'usuarios',
          component: UsersView,
          meta: { title: 'Gestión de Usuarios' }
        },
        {
          path: 'verificacion',
          name: 'verificacion',
          component: VerificationView,
          meta: { title: 'Verificación (KYC)' }
        },
        {
          path: 'pagos',
          name: 'pagos',
          component: PaymentsView,
          meta: { title: 'Pagos & Escrow' }
        },
        {
          path: 'categorias',
          name: 'categorias',
          component: CategoriesView,
          meta: { title: 'Categorías' }
        },
        {
          path: 'reportes',
          name: 'reportes',
          component: ReportsView,
          meta: { title: 'Reportes y Analíticas' }
        },
        {
          path: 'auditoria',
          name: 'auditoria',
          component: AuditView,
          meta: { title: 'Bitácora de Auditoría' }
        },
        {
          path: 'configuracion',
          name: 'configuracion',
          component: SettingsView,
          meta: { title: 'Configuración' }
        },
        {
          path: 'perfil',
          name: 'perfil',
          component: ProfileView,
          meta: { title: 'Mi Perfil' }
        },
        {
          path: 'usuarios/:id',
          name: 'usuario-detalle',
          component: UserDetailView,
          meta: { title: 'Detalle de Usuario' }
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard'
    }
  ]
})

export default router