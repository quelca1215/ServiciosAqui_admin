<template>
  <header class="h-16 px-4 sm:px-6 bg-white/95 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between sticky top-0 z-30 shadow-xs">
    
    <!-- LADO IZQUIERDO: Toggle Móvil + Indicador de Página (Breadcrumb) -->
    <div class="flex items-center gap-3 sm:gap-4">
      <!-- Botón menú para dispositivos móviles -->
      <button
        @click="toggleMobile"
        class="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
        aria-label="Abrir menú de navegación"
      >
        <Menu class="w-5 h-5" />
      </button>

      <!-- Indicador dinámico del módulo actual -->
      <div>
        <div class="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <span class="hover:text-slate-600 transition">Consola</span>
          <ChevronRight class="w-3 h-3 text-slate-300" />
          <span class="text-emerald-600 font-semibold">{{ currentTitle }}</span>
        </div>
        <h1 class="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {{ currentTitle }}
        </h1>
      </div>
    </div>

    <!-- CENTRO: Buscador Inteligente Rápido (Desktop) -->
    <div class="hidden md:flex items-center flex-1 max-w-md mx-6">
      <div class="relative w-full group">
        <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
          <Search class="w-4 h-4" />
        </span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar usuarios, transacciones, ID de contrato..."
          class="w-full pl-10 pr-16 py-2 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-800 text-xs placeholder-slate-400 hover:bg-white focus:bg-white focus:outline-none focus:ring-3 focus:ring-emerald-500/15 focus:border-emerald-500 transition duration-150"
        />
        <!-- Indicador de Atajo de Teclado -->
        <div class="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
          <kbd class="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-200/70 border border-slate-300 rounded shadow-2xs">
            ⌘K
          </kbd>
        </div>
      </div>
    </div>

    <!-- LADO DERECHO: Acciones (Modo Oscuro, Notificaciones y Menú de Usuario) -->
    <div class="flex items-center gap-2 sm:gap-3">
      
      <!-- Botón de Modo Oscuro (Preparado para expansión) -->
      <div class="relative">
        <button
          @click="toggleDarkModeToast"
          class="p-2 sm:p-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer relative group"
          title="Alternar Modo Oscuro (Próximamente)"
          aria-label="Cambiar tema de la aplicación"
        >
          <Moon class="w-4 h-4 transition-transform group-hover:-rotate-12" />
        </button>
      </div>

      <!-- Menú Desplegable de Notificaciones -->
      <div class="relative" ref="notificationsRef">
        <button
          @click="isNotificationsOpen = !isNotificationsOpen"
          class="p-2 sm:p-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer relative"
          :class="{ 'bg-slate-100 text-slate-800': isNotificationsOpen }"
          aria-label="Notificaciones"
        >
          <Bell class="w-4 h-4" />
          <!-- Badge contador de alertas no leídas -->
          <span 
            v-if="unreadCount > 0"
            class="absolute top-1.5 right-1.5 flex h-2 w-2"
          >
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </button>

        <!-- Dropdown de Notificaciones -->
        <transition name="dropdown">
          <div
            v-if="isNotificationsOpen"
            class="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-50 text-slate-800"
          >
            <!-- Cabecera -->
            <div class="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-slate-900">Notificaciones</span>
                <span class="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-700">
                  {{ unreadCount }} nuevas
                </span>
              </div>
              <button
                @click="markAllAsRead"
                class="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 transition cursor-pointer"
              >
                Marcar leídas
              </button>
            </div>

            <!-- Lista de Notificaciones -->
            <div class="max-h-72 overflow-y-auto divide-y divide-slate-100">
              <div
                v-for="item in notifications"
                :key="item.id"
                class="p-3 hover:bg-slate-50/80 transition cursor-pointer flex gap-3 items-start"
                :class="{ 'bg-emerald-50/30': !item.read }"
              >
                <div 
                  class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold"
                  :class="item.iconBg"
                >
                  <component :is="item.icon" class="w-3.5 h-3.5" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-semibold text-slate-800 leading-snug">{{ item.title }}</p>
                  <p class="text-[11px] text-slate-500 leading-tight mt-0.5 truncate">{{ item.desc }}</p>
                  <span class="text-[10px] text-slate-400 font-mono mt-1 block">{{ item.time }}</span>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <router-link
              to="/auditoria"
              @click="isNotificationsOpen = false"
              class="block p-2.5 text-center text-xs font-semibold text-emerald-600 hover:bg-emerald-50/60 border-t border-slate-100 transition"
            >
              Ver registro completo de auditoría →
            </router-link>
          </div>
        </transition>
      </div>

      <!-- Separador vertical fino -->
      <div class="h-6 w-px bg-slate-200 mx-1"></div>

      <!-- Tarjeta Personal del Usuario / Menú Expandible -->
      <div class="relative" ref="userMenuRef">
        <button
          @click="isUserMenuOpen = !isUserMenuOpen"
          class="flex items-center gap-2.5 p-1 sm:pl-2 sm:pr-2.5 rounded-xl hover:bg-slate-100 transition cursor-pointer select-none"
          :class="{ 'bg-slate-100': isUserMenuOpen }"
          aria-label="Menú de cuenta de usuario"
        >
          <!-- Avatar con Estado Online -->
          <div class="relative">
            <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-lime-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              GA
            </div>
            <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white"></span>
          </div>

          <!-- Información resumida (Desktop) -->
          <div class="hidden sm:block text-left">
            <div class="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1">
              Gabriel Admin
            </div>
            <div class="text-[10px] font-mono text-emerald-600 font-semibold leading-tight">
              Super Admin
            </div>
          </div>

          <ChevronDown 
            class="w-3.5 h-3.5 text-slate-400 transition-transform duration-200" 
            :class="{ 'rotate-180': isUserMenuOpen }"
          />
        </button>

        <!-- Menú Desplegable del Usuario -->
        <transition name="dropdown">
          <div
            v-if="isUserMenuOpen"
            class="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-50 text-slate-800"
          >
            <!-- Cabecera de la Tarjeta Personal -->
            <div class="p-4 bg-gradient-to-br from-slate-900 to-[#0c1322] text-white">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-lime-400 text-slate-950 font-black text-sm flex items-center justify-center shadow-md">
                  GA
                </div>
                <div class="min-w-0 flex-1">
                  <h4 class="text-sm font-bold text-white truncate">Gabriel Admin</h4>
                  <p class="text-[11px] text-slate-400 truncate">gabriel@admin.serviciosaqui.bo</p>
                  <div class="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <ShieldCheck class="w-3 h-3" />
                    <span>Nivel: Acceso Total</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Opciones del Perfil -->
            <div class="p-2 space-y-0.5 text-xs">
              <router-link
                to="/perfil"
                @click="isUserMenuOpen = false"
                class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/60 font-medium transition"
              >
                <User class="w-4 h-4 text-slate-400" />
                <span>Mi Perfil & Datos</span>
              </router-link>

              <router-link
                to="/perfil"
                @click="isUserMenuOpen = false"
                class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/60 font-medium transition"
              >
                <Key class="w-4 h-4 text-slate-400" />
                <span>Seguridad & Llaves 2FA</span>
              </router-link>

              <router-link
                to="/auditoria"
                @click="isUserMenuOpen = false"
                class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/60 font-medium transition"
              >
                <History class="w-4 h-4 text-slate-400" />
                <span>Registro de Actividad</span>
              </router-link>

              <router-link
                to="/configuracion"
                @click="isUserMenuOpen = false"
                class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/60 font-medium transition"
              >
                <Sliders class="w-4 h-4 text-slate-400" />
                <span>Preferencias de Consola</span>
              </router-link>

              <a
                href="#"
                @click.prevent="showActionAlert('Documentación y Soporte')"
                class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/60 font-medium transition"
              >
                <HelpCircle class="w-4 h-4 text-slate-400" />
                <span>Centro de Soporte Técnico</span>
              </a>
            </div>

            <!-- Cierre de Sesión -->
            <div class="p-2 border-t border-slate-100 bg-slate-50/50">
              <button
                @click="handleLogout"
                class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              >
                <LogOut class="w-4 h-4 text-rose-500" />
                <span>Cerrar Sesión (Sign Out)</span>
              </button>
            </div>
          </div>
        </transition>
      </div>

    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  Menu, 
  Search, 
  Bell, 
  Moon, 
  ChevronDown, 
  ChevronRight, 
  ShieldCheck, 
  User, 
  Key, 
  History, 
  Sliders, 
  HelpCircle, 
  LogOut,
  BadgeCheck,
  CreditCard,
  AlertTriangle
} from 'lucide-vue-next'
import { useSidebar } from '@/composables/useSidebar'

const route = useRoute()
const router = useRouter()
const { toggleMobile } = useSidebar()

const searchQuery = ref('')
const isNotificationsOpen = ref(false)
const isUserMenuOpen = ref(false)
const notificationsRef = ref<HTMLElement | null>(null)
const userMenuRef = ref<HTMLElement | null>(null)

// Título dinámico del módulo actual según la ruta
const currentTitle = computed(() => {
  const metaTitle = route.meta?.title as string | undefined
  if (metaTitle) return metaTitle

  const path = route.path
  if (path.includes('dashboard')) return 'Dashboard'
  if (path.includes('usuarios/')) return 'Ficha Detallada de Usuario'
  if (path.includes('usuarios')) return 'Gestión de Usuarios'
  if (path.includes('verificacion')) return 'Verificación de Identidad (KYC)'
  if (path.includes('pagos')) return 'Pagos y Garantías Escrow'
  if (path.includes('categorias')) return 'Categorías de Servicios'
  if (path.includes('reportes')) return 'Reportes Financieros y Métricas'
  if (path.includes('auditoria')) return 'Bitácora de Auditoría'
  if (path.includes('configuracion')) return 'Configuración del Sistema'
  if (path.includes('perfil')) return 'Mi Perfil Administrativo'
  return 'Consola Backoffice'
})

// Notificaciones del sistema
const notifications = ref([
  {
    id: 1,
    title: 'Nueva verificación KYC enviada',
    desc: 'Operador María Gómez subió CI y selfie para auditoría.',
    time: 'Hace 5 min',
    read: false,
    icon: BadgeCheck,
    iconBg: 'bg-amber-100 text-amber-700'
  },
  {
    id: 2,
    title: 'Garantía Escrow liberada',
    desc: 'Contrato #5821 de Plomería calificado 5 estrellas.',
    time: 'Hace 24 min',
    read: false,
    icon: CreditCard,
    iconBg: 'bg-emerald-100 text-emerald-700'
  },
  {
    id: 3,
    title: 'Firma de seguridad actualizada',
    desc: 'Rotación de llave criptográfica completada con éxito.',
    time: 'Hace 2 horas',
    read: false,
    icon: AlertTriangle,
    iconBg: 'bg-blue-100 text-blue-700'
  }
])

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

const markAllAsRead = () => {
  notifications.value.forEach(n => (n.read = true))
}

const toggleDarkModeToast = () => {
  alert('El Modo Oscuro estará disponible en el próximo sprint.')
}

const showActionAlert = (section: string) => {
  alert(`Sección "${section}" seleccionada. Conectando con el módulo correspondiente.`)
  isUserMenuOpen.value = false
}

const handleLogout = () => {
  if (confirm('¿Estás seguro de que deseas cerrar tu sesión administrativa?')) {
    isUserMenuOpen.value = false
    router.push('/login')
  }
}

// Cierre al hacer clic fuera de los menús desplegables
const handleClickOutside = (event: MouseEvent) => {
  if (notificationsRef.value && !notificationsRef.value.contains(event.target as Node)) {
    isNotificationsOpen.value = false
  }
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    isUserMenuOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}
</style>

