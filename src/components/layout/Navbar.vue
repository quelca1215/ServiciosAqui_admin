<template>
  <header class="h-16 px-3 sm:px-6 bg-white/95 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between sticky top-0 z-30 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.03)] select-none">
    
    <!-- Línea luminosa inferior en la paleta de marca -->
    <div class="pointer-events-none absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#22c55e]/30 to-transparent"></div>

    <!-- ====================================================================== -->
    <!-- LADO IZQUIERDO: Toggle Móvil + Módulo Actual Dinámico con Icono        -->
    <!-- ====================================================================== -->
    <div class="flex items-center gap-3 shrink-0">
      <!-- Botón menú para pantallas pequeñas -->
      <button
        @click="toggleMobile"
        class="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-emerald-500/10 active:scale-95 transition-all cursor-pointer"
        aria-label="Abrir menú lateral"
      >
        <Menu class="w-5 h-5 text-slate-700" />
      </button>

      <!-- Badge & Breadcrumb Dinámico del Módulo Actual -->
      <div class="flex items-center gap-2.5">
        <!-- Icono animado del módulo actual -->
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-[#22c55e]/15 to-[#84cc16]/15 border border-[#22c55e]/30 flex items-center justify-center text-[#15803d] shadow-[0_0_15px_-3px_rgba(34,197,94,0.3)] transition-transform duration-300 hover:scale-105 shrink-0">
          <transition name="icon-fade" mode="out-in">
            <component :is="currentRouteInfo.icon" class="w-4 h-4 stroke-[2.4]" :key="currentRouteInfo.title" />
          </transition>
        </div>

        <div>
          <!-- Breadcrumb sutil -->
          <div class="flex items-center gap-1.5 text-[11px] font-mono tracking-tight text-slate-400">
            <span class="hover:text-slate-600 transition">Consola</span>
            <ChevronRight class="w-3 h-3 text-slate-300" />
            <span class="text-[#15803d] font-semibold tracking-normal">{{ currentRouteInfo.title }}</span>
          </div>
          <!-- Título en negrita -->
          <h1 class="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-none mt-0.5">
            {{ currentRouteInfo.title }}
          </h1>
        </div>
      </div>
    </div>

    <!-- ====================================================================== -->
    <!-- CENTRO: Buscador Integrado Directo (Sin modales ni pantallas oscuras)  -->
    <!-- ====================================================================== -->
    <div class="relative flex-1 max-w-xs sm:max-w-sm lg:max-w-md mx-3 lg:mx-8 hidden sm:block" ref="searchContainerRef">
      <div class="relative flex items-center">
        <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search class="w-4 h-4" />
        </span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar módulos (usuarios, pagos, reportes...)"
          @focus="isSearchDropdownOpen = true"
          @keydown.esc="isSearchDropdownOpen = false"
          @keydown.enter="handleSearchEnter"
          class="w-full pl-10 pr-9 py-2 text-xs font-medium rounded-xl border border-slate-200/90 bg-slate-50/80 text-slate-900 placeholder:text-slate-400 hover:bg-white hover:border-[#84cc16]/50 focus:bg-white focus:border-[#84cc16] focus:ring-4 focus:ring-[#84cc16]/15 outline-none transition-all duration-200 shadow-2xs"
        />
        <!-- Botón Limpiar texto -->
        <button
          v-if="searchQuery"
          type="button"
          @click="clearSearch"
          class="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
          aria-label="Limpiar búsqueda"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- Menú flotante ligero de coincidencias (aparece solo si el usuario escribe) -->
      <transition name="dropdown">
        <div
          v-if="isSearchDropdownOpen && searchQuery.trim().length > 0"
          class="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden z-50 text-slate-800"
        >
          <div class="p-1.5 max-h-64 overflow-y-auto divide-y divide-slate-50 custom-scrollbar">
            <button
              v-for="item in searchResults"
              :key="item.path"
              @click="selectSearchResult(item.path)"
              class="w-full flex items-center justify-between p-2 rounded-xl hover:bg-emerald-500/10 text-slate-700 hover:text-[#052e16] transition-all cursor-pointer group text-left"
            >
              <div class="flex items-center gap-2.5">
                <div class="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-[#22c55e] text-slate-600 group-hover:text-white flex items-center justify-center transition-colors">
                  <component :is="item.icon" class="w-3.5 h-3.5" />
                </div>
                <div>
                  <p class="text-xs font-bold leading-tight">{{ item.label }}</p>
                  <p class="text-[10px] text-slate-400 font-mono leading-none mt-0.5">{{ item.category }}</p>
                </div>
              </div>
              <ArrowRight class="w-3.5 h-3.5 text-slate-300 group-hover:text-[#16a34a] transition-transform group-hover:translate-x-0.5" />
            </button>

            <div v-if="searchResults.length === 0" class="py-4 text-center text-xs text-slate-400">
              No se encontraron módulos para "{{ searchQuery }}"
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- ====================================================================== -->
    <!-- LADO DERECHO: Estado Live + Pantalla Completa + Notificaciones + Perfil -->
    <!-- ====================================================================== -->
    <div class="flex items-center gap-1.5 sm:gap-2.5">
      
      <!-- Indicador Live de Conexión a la API -->
      <div 
        class="hidden xl:inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#15803d]"
        title="Conectado a la API https://crmbol26.runasp.net/api"
      >
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#84cc16] opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]"></span>
        </span>
        <span class="tracking-tight">API En Vivo</span>
      </div>

      <!-- Botón Pantalla Completa -->
      <button
        @click="toggleFullscreen"
        class="hidden sm:flex p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100/90 active:scale-95 transition-all cursor-pointer"
        :title="isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'"
        aria-label="Pantalla completa"
      >
        <Minimize2 v-if="isFullscreen" class="w-4 h-4 text-slate-600" />
        <Maximize2 v-else class="w-4 h-4 text-slate-600" />
      </button>

      <!-- Menú Desplegable de Notificaciones con Filtros Interactivos -->
      <div class="relative" ref="notificationsRef">
        <button
          @click="toggleNotifications"
          class="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100/90 active:scale-95 transition-all cursor-pointer group"
          :class="{ 'bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20': isNotificationsOpen }"
          aria-label="Notificaciones"
        >
          <Bell class="w-4 h-4 text-slate-600 group-hover:rotate-12 transition-transform duration-200" />
          
          <!-- Badge de notificaciones con resplandor en lima -->
          <span 
            v-if="unreadCount > 0"
            class="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 rounded-full text-[9px] font-mono font-black text-[#052e16] bg-gradient-to-r from-[#22c55e] to-[#84cc16] shadow-[0_0_10px_rgba(132,204,22,0.8)]"
          >
            {{ unreadCount }}
          </span>
        </button>

        <!-- Dropdown Panel de Notificaciones -->
        <transition name="dropdown">
          <div
            v-if="isNotificationsOpen"
            class="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-50 text-slate-800"
          >
            <!-- Cabecera con pestañas y botón marcar todas -->
            <div class="p-3.5 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-black tracking-tight text-slate-900">Centro de Notificaciones</span>
                  <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#84cc16]/20 text-[#15803d] border border-[#84cc16]/30">
                    {{ unreadCount }} pendientes
                  </span>
                </div>
                <button
                  v-if="unreadCount > 0"
                  @click="markAllAsRead"
                  class="text-[11px] font-semibold text-[#16a34a] hover:text-[#15803d] flex items-center gap-1 transition cursor-pointer"
                >
                  <CheckCheck class="w-3.5 h-3.5" />
                  Marcar leídas
                </button>
              </div>

              <!-- Filtros de Pestaña -->
              <div class="flex gap-1.5 p-0.5 bg-slate-100 rounded-lg text-[11px] font-medium">
                <button
                  @click="notificationTab = 'all'"
                  class="flex-1 py-1 rounded-md transition cursor-pointer"
                  :class="notificationTab === 'all' ? 'bg-white font-bold text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'"
                >
                  Todas ({{ notifications.length }})
                </button>
                <button
                  @click="notificationTab = 'unread'"
                  class="flex-1 py-1 rounded-md transition cursor-pointer"
                  :class="notificationTab === 'unread' ? 'bg-white font-bold text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'"
                >
                  No leídas ({{ unreadCount }})
                </button>
              </div>
            </div>

            <!-- Lista de Notificaciones -->
            <div class="max-h-80 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
              <div
                v-for="item in filteredNotifications"
                :key="item.id"
                @click="markAsRead(item.id)"
                class="group p-3 sm:p-3.5 hover:bg-slate-50/80 transition-all cursor-pointer flex gap-3 items-start relative"
                :class="{ 'bg-emerald-50/30': !item.read }"
              >
                <!-- Indicador de leído / no leído -->
                <span
                  v-if="!item.read"
                  class="absolute left-1.5 top-5 w-1.5 h-1.5 rounded-full bg-[#16a34a]"
                ></span>

                <!-- Icono de la notificación con fondo temático -->
                <div 
                  class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-transform group-hover:scale-105"
                  :class="item.iconBg"
                >
                  <component :is="item.icon" class="w-4 h-4" />
                </div>

                <!-- Contenido -->
                <div class="flex-1 min-w-0 pr-5">
                  <div class="flex items-center justify-between">
                    <p class="text-xs font-bold text-slate-800 leading-snug truncate">{{ item.title }}</p>
                  </div>
                  <p class="text-[11px] text-slate-500 leading-tight mt-0.5 line-clamp-2">{{ item.desc }}</p>
                  <span class="text-[10px] text-slate-400 font-mono mt-1 block">{{ item.time }}</span>
                </div>

                <!-- Botón eliminar notificación -->
                <button
                  @click.stop="deleteNotification(item.id)"
                  class="opacity-0 group-hover:opacity-100 absolute top-3 right-3 p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                  title="Descartar notificación"
                >
                  <X class="w-3.5 h-3.5" />
                </button>
              </div>

              <!-- Estado vacío -->
              <div v-if="filteredNotifications.length === 0" class="py-8 text-center text-slate-400">
                <Check class="w-6 h-6 mx-auto mb-1 text-emerald-500 stroke-[2.5]" />
                <p class="text-xs font-semibold text-slate-700">¡Todo al día!</p>
                <p class="text-[11px] text-slate-400 mt-0.5">No hay notificaciones en este filtro.</p>
              </div>
            </div>

            <!-- Footer con acceso a Auditoría -->
            <router-link
              to="/auditoria"
              @click="isNotificationsOpen = false"
              class="flex items-center justify-center gap-1.5 p-2.5 text-center text-xs font-bold text-[#15803d] bg-slate-50/70 hover:bg-emerald-50/60 border-t border-slate-100 transition"
            >
              <span>Ver bitácora de auditoría en vivo</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </router-link>
          </div>
        </transition>
      </div>

      <!-- Divisor vertical -->
      <div class="h-6 w-px bg-slate-200/90 mx-0.5 sm:mx-1"></div>

      <!-- ==================================================================== -->
      <!-- Menú del Usuario Operador (LIMPIO, ELEGANTE Y SIN RELLENOS)          -->
      <!-- ==================================================================== -->
      <div class="relative" ref="userMenuRef">
        <button
          @click="toggleUserMenu"
          class="flex items-center gap-2 p-1 sm:pl-1.5 sm:pr-2.5 rounded-2xl hover:bg-slate-100/90 active:scale-98 transition-all cursor-pointer select-none"
          :class="{ 'bg-slate-100 shadow-2xs': isUserMenuOpen }"
          aria-label="Menú de cuenta"
        >
          <!-- Avatar con anillo de gradiente y punto de estado en línea -->
          <div class="relative">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#22c55e] to-[#84cc16] p-[2px] shadow-sm shadow-[#22c55e]/25">
              <div class="w-full h-full bg-[#052e16] rounded-[9px] flex items-center justify-center text-[#84cc16] font-black text-xs tracking-tight">
                {{ displayInitials }}
              </div>
            </div>
            <!-- Punto online verde pulsante -->
            <span class="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-[#16a34a] border-2 border-white"></span>
            </span>
          </div>

          <!-- Información resumida (Desktop) -->
          <div class="hidden sm:block text-left">
            <div class="text-xs font-black text-slate-900 leading-tight flex items-center gap-1">
              <span class="truncate max-w-[120px] lg:max-w-[150px]">{{ displayName }}</span>
            </div>
            <div class="flex items-center gap-1 mt-0.5">
              <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-[#15803d] bg-[#84cc16]/15 border border-[#84cc16]/30 px-1.5 py-0.2 rounded leading-none">
                {{ displayRole }}
              </span>
            </div>
          </div>

          <ChevronDown 
            class="w-3.5 h-3.5 text-slate-400 transition-transform duration-200" 
            :class="{ 'rotate-180': isUserMenuOpen }"
          />
        </button>

        <!-- Dropdown del Usuario: Nuevo Modelo UI/UX Estético y Limpio -->
        <transition name="dropdown">
          <div
            v-if="isUserMenuOpen"
            class="absolute right-0 mt-2.5 w-76 bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(5,46,22,0.18),0_0_0_1px_rgba(226,232,240,0.9)] overflow-hidden z-50 text-slate-800"
          >
            <!-- Cabecera de Identidad: Estilo Glassmorphism Limpio con Acento Verde de Marca -->
            <div class="p-4 bg-gradient-to-br from-emerald-500/[0.08] via-lime-500/[0.04] to-transparent border-b border-slate-100">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#22c55e] to-[#84cc16] p-[2px] shadow-md shadow-[#22c55e]/25 shrink-0">
                  <div class="w-full h-full bg-[#052e16] rounded-[14px] flex items-center justify-center text-[#84cc16] font-black text-sm font-mono">
                    {{ displayInitials }}
                  </div>
                </div>

                <div class="min-w-0 flex-1">
                  <h4 class="text-xs sm:text-sm font-black text-slate-900 truncate tracking-tight leading-snug">
                    {{ displayName }}
                  </h4>
                  <p class="text-[11px] text-slate-500 truncate font-mono mt-0.5" :title="displayEmail">
                    {{ displayEmail }}
                  </p>
                  
                  <div class="mt-1.5 flex items-center gap-1.5">
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#84cc16]/15 text-[#15803d] border border-[#84cc16]/30">
                      <span class="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse"></span>
                      {{ displayRole }}
                    </span>
                    <span class="text-[10px] font-mono text-slate-400">· 2FA Activo</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Accesos Esenciales Únicos (Diseño Tactil y Estético) -->
            <div class="p-2 space-y-1">
              <!-- Mi Perfil -->
              <router-link
                to="/perfil"
                @click="isUserMenuOpen = false"
                class="group flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-emerald-50 text-[#16a34a] group-hover:bg-[#16a34a] group-hover:text-white flex items-center justify-center transition-colors">
                    <User class="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <p class="text-xs font-bold text-slate-800 leading-tight group-hover:text-[#052e16]">Mi Perfil</p>
                    <p class="text-[10px] text-slate-400 leading-tight mt-0.5">Datos personales & accesos</p>
                  </div>
                </div>
                <ChevronRight class="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
              </router-link>

              <!-- Configuración -->
              <router-link
                to="/configuracion"
                @click="isUserMenuOpen = false"
                class="group flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-slate-800 group-hover:text-white flex items-center justify-center transition-colors">
                    <Sliders class="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <p class="text-xs font-bold text-slate-800 leading-tight group-hover:text-[#052e16]">Configuración</p>
                    <p class="text-[10px] text-slate-400 leading-tight mt-0.5">Ajustes de la consola</p>
                  </div>
                </div>
                <ChevronRight class="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 transition-transform group-hover:translate-x-0.5" />
              </router-link>
            </div>

            <!-- Pie de Tarjeta: Cerrar Sesión (Acción Directa, Instantánea e Infalible) -->
            <div class="p-2 border-t border-slate-100 bg-slate-50/60">
              <button
                @click="handleLogout"
                :disabled="isLoggingOut"
                class="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-rose-600 hover:text-white hover:bg-rose-600 active:scale-98 transition-all duration-200 cursor-pointer group shadow-2xs disabled:opacity-50"
              >
                <div class="flex items-center gap-2.5">
                  <div class="w-7 h-7 rounded-lg bg-rose-100/70 text-rose-600 group-hover:bg-white/20 group-hover:text-white flex items-center justify-center transition-colors">
                    <span v-if="isLoggingOut" class="w-3.5 h-3.5 border-2 border-rose-600 group-hover:border-white border-t-transparent rounded-full animate-spin"></span>
                    <LogOut v-else class="w-3.5 h-3.5 stroke-[2.4]" />
                  </div>
                  <span>{{ isLoggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión' }}</span>
                </div>
                <span class="text-[10px] font-mono opacity-60 group-hover:opacity-100 transition-opacity">Salir →</span>
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
  ChevronDown, 
  ChevronRight, 
  User, 
  Sliders, 
  LogOut, 
  BadgeCheck, 
  CreditCard, 
  AlertTriangle,
  LayoutDashboard,
  Users,
  Layers,
  BarChart3,
  Sparkles,
  Check,
  CheckCheck,
  X,
  Maximize2,
  Minimize2,
  ArrowRight
} from 'lucide-vue-next'
import { useSidebar } from '@/composables/useSidebar'
import { storeToRefs } from 'pinia'
import { authService, clearAuthSession } from '@/api'
import { useUserStore } from '@/store'

const route = useRoute()
const router = useRouter()
const { toggleMobile } = useSidebar()
const userStore = useUserStore()
const { email, nombreCompleto, rol, initials } = storeToRefs(userStore)

// ----------------------------------------------------------------------
// Datos del Usuario Autenticado Dinámicos desde Pinia Store (/store)
// ----------------------------------------------------------------------
const displayName = computed(() => nombreCompleto.value || '--')
const displayEmail = computed(() => email.value || '--')
const displayRole = computed(() => rol.value || '--')
const displayInitials = computed(() => initials.value || '--')

// ----------------------------------------------------------------------
// Módulo y Título Actual según la ruta
// ----------------------------------------------------------------------
const currentRouteInfo = computed(() => {
  const metaTitle = route.meta?.title as string | undefined
  const path = route.path
  if (path.includes('dashboard')) return { title: 'Dashboard', icon: LayoutDashboard }
  if (path.includes('usuarios/')) return { title: metaTitle || 'Detalle de Usuario', icon: User }
  if (path.includes('usuarios')) return { title: metaTitle || 'Gestión de Usuarios', icon: Users }
  if (path.includes('verificacion')) return { title: 'Verificación (KYC)', icon: BadgeCheck }
  if (path.includes('pagos')) return { title: 'Pagos & Escrow', icon: CreditCard }
  if (path.includes('categorias')) return { title: 'Categorías', icon: Layers }
  if (path.includes('reportes')) return { title: 'Reportes y Analíticas', icon: BarChart3 }
  if (path.includes('auditoria')) return { title: 'Bitácora de Auditoría', icon: Layers }
  if (path.includes('configuracion')) return { title: 'Configuración', icon: Sliders }
  if (path.includes('perfil')) return { title: 'Mi Perfil', icon: User }
  if (metaTitle) return { title: metaTitle, icon: LayoutDashboard }
  return { title: 'Consola Backoffice', icon: LayoutDashboard }
})

// ----------------------------------------------------------------------
// Buscador Directo Integrado
// ----------------------------------------------------------------------
const searchContainerRef = ref<HTMLElement | null>(null)
const searchQuery = ref('')
const isSearchDropdownOpen = ref(false)

const quickLinks = [
  { label: 'Dashboard General', path: '/dashboard', icon: LayoutDashboard, category: 'Resumen' },
  { label: 'Gestión de Usuarios', path: '/usuarios', icon: Users, category: 'Comunidad' },
  { label: 'Verificaciones de Identidad (KYC)', path: '/verificacion', icon: BadgeCheck, category: 'Auditoría' },
  { label: 'Pagos y Garantías Escrow', path: '/pagos', icon: CreditCard, category: 'Finanzas' },
  { label: 'Categorías y Oficios', path: '/categorias', icon: Layers, category: 'Servicios' },
  { label: 'Reportes y Métricas', path: '/reportes', icon: BarChart3, category: 'Estadísticas' },
  { label: 'Configuración del Sistema', path: '/configuracion', icon: Sliders, category: 'Ajustes' },
  { label: 'Mi Perfil', path: '/perfil', icon: User, category: 'Cuenta' }
]

const searchResults = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return []
  return quickLinks.filter(item => 
    item.label.toLowerCase().includes(q) || 
    item.category.toLowerCase().includes(q)
  )
})

const clearSearch = () => {
  searchQuery.value = ''
  isSearchDropdownOpen.value = false
}

const selectSearchResult = (path: string) => {
  clearSearch()
  router.push(path)
}

const handleSearchEnter = () => {
  if (searchResults.value.length > 0 && searchResults.value[0]) {
    selectSearchResult(searchResults.value[0].path)
  }
}

// ----------------------------------------------------------------------
// Estado de Notificaciones
// ----------------------------------------------------------------------
const isNotificationsOpen = ref(false)
const notificationTab = ref<'all' | 'unread'>('all')
const notificationsRef = ref<HTMLElement | null>(null)

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

const filteredNotifications = computed(() => {
  if (notificationTab.value === 'unread') {
    return notifications.value.filter(n => !n.read)
  }
  return notifications.value
})

const toggleNotifications = () => {
  isNotificationsOpen.value = !isNotificationsOpen.value
  if (isNotificationsOpen.value) {
    isUserMenuOpen.value = false
  }
}

const markAsRead = (id: number) => {
  const item = notifications.value.find(n => n.id === id)
  if (item) item.read = true
}

const deleteNotification = (id: number) => {
  notifications.value = notifications.value.filter(n => n.id !== id)
}

const markAllAsRead = () => {
  notifications.value.forEach(n => (n.read = true))
}

// ----------------------------------------------------------------------
// Menú del Usuario Operador
// ----------------------------------------------------------------------
const isUserMenuOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)
const isLoggingOut = ref(false)

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
  if (isUserMenuOpen.value) {
    isNotificationsOpen.value = false
  }
}

const handleLogout = async () => {
  isLoggingOut.value = true
  isUserMenuOpen.value = false

  // 1. Limpieza inmediata e incondicional de la sesión local
  clearAuthSession()
  userStore.clearUser()

  // 2. Intentar llamar al backend en segundo plano
  try {
    await authService.logout()
  } catch (err) {
    console.warn('Sesión cerrada localmente:', err)
  }

  // 3. Redirección limpia a la pantalla de login
  try {
    await router.push('/login')
  } catch {
    window.location.href = '/login'
  } finally {
    isLoggingOut.value = false
  }
}

// ----------------------------------------------------------------------
// Modo Pantalla Completa
// ----------------------------------------------------------------------
const isFullscreen = ref(false)
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().then(() => {
      isFullscreen.value = true
    }).catch(() => {})
  } else {
    document.exitFullscreen().then(() => {
      isFullscreen.value = false
    }).catch(() => {})
  }
}

// ----------------------------------------------------------------------
// Cierre al hacer clic fuera
// ----------------------------------------------------------------------
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node
  if (notificationsRef.value && !notificationsRef.value.contains(target)) {
    isNotificationsOpen.value = false
  }
  if (userMenuRef.value && !userMenuRef.value.contains(target)) {
    isUserMenuOpen.value = false
  }
  if (searchContainerRef.value && !searchContainerRef.value.contains(target)) {
    isSearchDropdownOpen.value = false
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
/* Transición de Dropdown */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}

/* Transición suave para iconos dinámicos */
.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.icon-fade-enter-from {
  opacity: 0;
  transform: scale(0.85);
}

.icon-fade-leave-to {
  opacity: 0;
  transform: scale(1.15);
}

/* Scrollbar fina personalizada */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.4);
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(34, 197, 94, 0.6);
}
</style>
