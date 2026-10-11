<template>
  <div>
    <!-- Backdrop oscuro para móvil cuando el sidebar está abierto -->
    <transition name="fade">
      <div
        v-if="isMobileOpen"
        @click="closeMobile"
        class="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
      ></div>
    </transition>

    <!-- Barra lateral principal (Paleta Profesional Esmeralda y Lima) -->
    <aside
      class="fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white text-slate-700 border-r border-slate-200/90 transition-all duration-300 ease-in-out shadow-xl shadow-slate-200/50 overflow-hidden"
      :class="[
        // Ancho en escritorios según colapso
        isCollapsed ? 'lg:w-20' : 'lg:w-68',
        // Comportamiento responsivo móvil
        isMobileOpen ? 'translate-x-0 w-68' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <!-- Resplandores ambientales tenues para enriquecer el fondo claro -->
      <div class="pointer-events-none absolute -top-20 -left-20 w-52 h-52 rounded-full bg-emerald-500/5 blur-3xl" aria-hidden="true"></div>
      <div class="pointer-events-none absolute -bottom-20 -left-20 w-52 h-52 rounded-full bg-lime-500/5 blur-3xl" aria-hidden="true"></div>

      <!-- ============================================================== -->
      <!-- CABECERA DEL SIDEBAR: Logo y Toggle Móvil                      -->
      <!-- ============================================================== -->
      <div class="relative z-10 h-16 px-4 flex items-center justify-between border-b border-slate-200/80 bg-white/95 backdrop-blur-md shrink-0">
        <router-link to="/dashboard" class="flex items-center gap-3 overflow-hidden group">
          <!-- Icono con gradiente de marca y contraste verde oscuro en el interior -->
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-lime-500 p-[1.5px] shrink-0 shadow-sm shadow-emerald-500/25 group-hover:shadow-md group-hover:shadow-emerald-500/40 group-hover:scale-105 transition-all duration-300">
            <div class="w-full h-full bg-[#052e16] rounded-[10px] flex items-center justify-center">
              <ShieldCheck class="w-5 h-5 text-lime-400 stroke-[2.3]" />
            </div>
          </div>
          
          <div v-show="!isCollapsed" class="transition-opacity duration-200">
            <span class="text-lg font-black tracking-tight text-slate-900 flex items-center leading-none">
              Servicios<span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-lime-500">Aquí</span>
            </span>
            <span class="text-[9px] font-mono tracking-widest uppercase text-emerald-700 font-bold block mt-0.5">
              Admin Suite v2.0
            </span>
          </div>
        </router-link>

        <!-- Botón para cerrar en móvil -->
        <button
          @click="closeMobile"
          class="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
          aria-label="Cerrar menú"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- ============================================================== -->
      <!-- MENÚ DE NAVEGACIÓN: Secciones y Subsecciones Dinámicas        -->
      <!-- ============================================================== -->
      <nav class="relative z-10 flex-1 px-3 py-3 space-y-4 overflow-y-auto overflow-x-hidden custom-scrollbar">
        
        <!-- Iteración de Secciones (PRINCIPAL, USUARIOS, OPERACIONES, CATÁLOGO, etc.) -->
        <div 
          v-for="section in groupedSections" 
          :key="section.name" 
          class="space-y-1"
        >
          <!-- Título de Sección -->
          <div 
            v-show="!isCollapsed" 
            class="px-2 pt-2 pb-1 text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-900/70 flex items-center gap-2 select-none"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-[#16a34a]/60"></span>
            <span>{{ section.name }}</span>
            <span class="flex-1 h-px bg-slate-200/80"></span>
          </div>

          <!-- Módulos dentro de esta Sección -->
          <div 
            v-for="mod in section.modules" 
            :key="mod.moduloId" 
            class="relative"
          >
            <!-- CASO 1: Módulo Simple sin Submódulos (ej: Dashboard) -->
            <template v-if="!mod.submodulos || mod.submodulos.length === 0">
              <router-link
                :to="mod.ruta || '/dashboard'"
                @click="handleNavClick"
                class="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm transition-all duration-200 select-none overflow-hidden cursor-pointer"
                :class="[
                  isModuleActive(mod)
                    ? 'bg-gradient-to-r from-emerald-50/95 via-emerald-50/80 to-lime-50/60 text-emerald-950 font-bold border border-lime-300 shadow-2xs'
                    : 'text-slate-600 font-medium hover:text-emerald-950 hover:bg-gradient-to-r hover:from-emerald-50/60 hover:to-lime-50/30 hover:border-lime-200/80 border border-transparent'
                ]"
              >
                <!-- Barra indicadora vertical luminosa cuando está activo -->
                <span 
                  v-if="isModuleActive(mod)"
                  class="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-gradient-to-b from-emerald-700 to-lime-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                ></span>

                <!-- Icono -->
                <component 
                  :is="resolveIcon(mod.icono, mod.ruta || '')" 
                  class="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110"
                  :class="isModuleActive(mod) ? 'text-emerald-700 stroke-[2.3]' : 'text-slate-400 group-hover:text-emerald-600'"
                />

                <!-- Etiqueta -->
                <span 
                  v-show="!isCollapsed" 
                  class="truncate tracking-tight flex-1"
                  :class="isModuleActive(mod) ? 'font-bold text-emerald-950' : 'font-medium text-slate-700 group-hover:text-slate-900'"
                >
                  {{ mod.nombre }}
                </span>

                <!-- Tooltip flotante cuando está colapsado -->
                <div
                  v-if="isCollapsed"
                  class="hidden lg:block absolute left-full ml-3 px-3 py-1.5 rounded-xl bg-[#052e16] text-white text-xs font-semibold whitespace-nowrap shadow-xl border border-emerald-500/30 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 z-50 shadow-black/40"
                >
                  <span class="text-emerald-50 font-medium">{{ mod.nombre }}</span>
                  <div class="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#052e16] border-l border-b border-emerald-500/30 rotate-45"></div>
                </div>
              </router-link>
            </template>

            <!-- CASO 2: Módulo Padre con Submódulos (Acordeón Plegable) -->
            <template v-else>
              <!-- Botón Padre del Acordeón -->
              <button
                type="button"
                @click="toggleSubmenu(mod.moduloId)"
                class="w-full group relative flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm transition-all duration-200 select-none cursor-pointer"
                :class="[
                  isModuleActive(mod)
                    ? 'bg-emerald-50/80 text-emerald-950 font-bold border border-emerald-200/90 shadow-2xs'
                    : 'text-slate-600 font-medium hover:text-emerald-950 hover:bg-slate-100/70 border border-transparent'
                ]"
              >
                <!-- Indicador lateral cuando alguno de sus hijos está activo -->
                <span 
                  v-if="isModuleActive(mod)"
                  class="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-gradient-to-b from-emerald-600 to-lime-500 shadow-[0_0_8px_rgba(34,197,94,0.35)]"
                ></span>

                <div class="flex items-center gap-3 min-w-0">
                  <component 
                    :is="resolveIcon(mod.icono, mod.nombre)" 
                    class="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110"
                    :class="isModuleActive(mod) ? 'text-emerald-700 stroke-[2.3]' : 'text-slate-400 group-hover:text-emerald-600'"
                  />
                  <span 
                    v-show="!isCollapsed" 
                    class="truncate tracking-tight"
                    :class="isModuleActive(mod) ? 'font-bold text-emerald-950' : 'font-medium text-slate-700 group-hover:text-slate-900'"
                  >
                    {{ mod.nombre }}
                  </span>
                </div>

                <div v-show="!isCollapsed" class="flex items-center gap-1.5 shrink-0">
                  <!-- Badge con la cantidad de submódulos -->
                  <span class="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-slate-100 group-hover:bg-emerald-100/80 text-slate-500 group-hover:text-emerald-800 transition-colors">
                    {{ mod.submodulos.length }}
                  </span>
                  <!-- Flecha de despliegue que rota -->
                  <ChevronDown 
                    class="w-3.5 h-3.5 text-slate-400 transition-transform duration-200"
                    :class="{ 'rotate-180 text-emerald-700': isExpanded(mod.moduloId) }"
                  />
                </div>

                <!-- Menú Popover Flotante cuando el sidebar está colapsado -->
                <div
                  v-if="isCollapsed"
                  class="hidden lg:block absolute left-full top-0 ml-3 w-56 bg-white rounded-2xl shadow-2xl border border-emerald-500/20 p-2 z-50 text-slate-800 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 shadow-black/25"
                >
                  <div class="px-2.5 py-1.5 border-b border-slate-100 mb-1 flex items-center justify-between">
                    <span class="text-xs font-black text-slate-900">{{ mod.nombre }}</span>
                    <span class="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                      {{ mod.submodulos.length }}
                    </span>
                  </div>
                  <div class="space-y-0.5 max-h-56 overflow-y-auto custom-scrollbar">
                    <router-link
                      v-for="sub in mod.submodulos"
                      :key="sub.moduloId"
                      :to="sub.ruta || '#'"
                      @click="handleNavClick"
                      class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer"
                      :class="isSubActive(sub) ? 'bg-emerald-100/80 text-emerald-950 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-900'"
                    >
                      <component :is="resolveIcon(sub.icono, sub.ruta || '')" class="w-3.5 h-3.5 text-slate-400" />
                      <span class="truncate">{{ sub.nombre }}</span>
                    </router-link>
                  </div>
                  <!-- Flecha popover -->
                  <div class="absolute top-4 -left-1 w-2 h-2 bg-white border-l border-b border-emerald-500/20 rotate-45"></div>
                </div>
              </button>

              <!-- Lista de Submódulos (Árbol Plegable con Guía Lumínica) -->
              <transition name="accordion">
                <div 
                  v-if="!isCollapsed && isExpanded(mod.moduloId)" 
                  class="mt-1 ml-4 pl-3 border-l-2 border-emerald-500/20 space-y-0.5 py-0.5 overflow-hidden"
                >
                  <router-link
                    v-for="sub in mod.submodulos"
                    :key="sub.moduloId"
                    :to="sub.ruta || '#'"
                    @click="handleNavClick"
                    class="group/sub relative flex items-center justify-between gap-2.5 px-2.5 py-1.5 rounded-xl text-xs transition-all duration-150 select-none cursor-pointer"
                    :class="[
                      isSubActive(sub)
                        ? 'bg-gradient-to-r from-emerald-100/90 via-emerald-50/80 to-lime-50/60 text-emerald-950 font-bold border border-lime-300/80 shadow-2xs'
                        : 'text-slate-600 font-medium hover:text-emerald-950 hover:bg-slate-100/60 border border-transparent'
                    ]"
                  >
                    <!-- Indicador punto brillante si está activo -->
                    <span 
                      v-if="isSubActive(sub)"
                      class="absolute -left-[14px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-600 shadow-[0_0_6px_rgba(22,163,74,0.8)]"
                    ></span>

                    <div class="flex items-center gap-2.5 min-w-0">
                      <component 
                        :is="resolveIcon(sub.icono, sub.ruta || '')" 
                        class="w-3.5 h-3.5 shrink-0 transition-transform group-hover/sub:scale-110"
                        :class="isSubActive(sub) ? 'text-emerald-700 stroke-[2.3]' : 'text-slate-400 group-hover/sub:text-emerald-600'"
                      />
                      <span class="truncate">{{ sub.nombre }}</span>
                    </div>

                    <!-- Indicador sutil de flecha en hover -->
                    <ChevronRight 
                      class="w-3 h-3 text-slate-300 opacity-0 group-hover/sub:opacity-100 transition-opacity shrink-0"
                      :class="{ 'opacity-100 text-emerald-700': isSubActive(sub) }"
                    />
                  </router-link>
                </div>
              </transition>
            </template>
          </div>
        </div>

      </nav>

      <!-- ============================================================== -->
      <!-- PIE DEL SIDEBAR: Estado del Sistema y Toggle de Expansión      -->
      <!-- ============================================================== -->
      <div class="relative z-10 p-3 border-t border-slate-200/80 bg-slate-50/80 shrink-0">
        
        <!-- Tarjeta de estado del sistema -->
        <div 
          v-show="!isCollapsed" 
          class="mb-2 p-2.5 rounded-2xl bg-gradient-to-br from-[#031d10] via-[#052e16] to-[#0a3a1f] text-white border border-emerald-500/30 shadow-md shadow-emerald-950/20"
        >
          <div class="flex items-center justify-between mb-0.5">
            <span class="flex items-center gap-1.5 text-[11px] font-bold text-lime-300">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-lime-400"></span>
              </span>
              Consola Operativa
            </span>
            <span class="text-[10px] font-mono text-emerald-200 font-semibold">99.9%</span>
          </div>
          <p class="text-[10px] text-emerald-100/70 leading-tight">
            Control de módulos y permisos activo.
          </p>
        </div>

        <!-- Botón para Colapsar / Expandir (Escritorio) -->
        <button
          @click="toggleCollapse"
          class="hidden lg:flex w-full items-center justify-center gap-2.5 px-3 py-2 rounded-xl text-slate-600 hover:text-emerald-900 hover:bg-white hover:border-slate-200 border border-transparent text-xs font-semibold shadow-2xs transition-all duration-200 cursor-pointer"
          :title="isCollapsed ? 'Expandir menú lateral' : 'Contraer menú lateral'"
          aria-label="Contraer o expandir barra lateral"
        >
          <PanelLeftClose v-if="!isCollapsed" class="w-4 h-4 text-emerald-700" />
          <PanelLeftOpen v-else class="w-4 h-4 text-emerald-700" />
          <span v-show="!isCollapsed" class="font-mono text-[11px]">Contraer Menú</span>
        </button>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useSidebar } from '@/composables/useSidebar'
import { useUserStore } from '@/store'
import type { ModuloMenuDto } from '@/api/types/auth.types'

import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  User,
  HardHat,
  IdCard,
  Briefcase,
  ClipboardList,
  Receipt,
  Truck,
  MessagesSquare,
  Layers,
  Tag,
  Wrench,
  MapPin,
  Gavel,
  Star,
  AlertTriangle,
  Headphones,
  Ticket,
  LifeBuoy,
  Wallet,
  CreditCard,
  Landmark,
  Percent,
  TrendingUp,
  Megaphone,
  TicketPercent,
  BellRing,
  UserCog,
  Lock,
  LayoutGrid,
  FileClock,
  Settings,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  X
} from 'lucide-vue-next'

const route = useRoute()
const { isCollapsed, isMobileOpen, toggleCollapse, closeMobile } = useSidebar()
const userStore = useUserStore()
const { modulos } = storeToRefs(userStore)

// ----------------------------------------------------------------------
// Mapeo exhaustivo de iconos devueltos por el backend
// ----------------------------------------------------------------------
const iconMapping: Record<string, any> = {
  // Principal
  dashboard: LayoutDashboard,
  // Usuarios
  group: Users,
  users: Users,
  person: User,
  user: User,
  engineering: HardHat,
  badge: IdCard,
  manage_accounts: UserCog,
  // Operaciones
  work: Briefcase,
  assignment: ClipboardList,
  request_quote: Receipt,
  local_shipping: Truck,
  forum: MessagesSquare,
  // Catálogo
  category: Layers,
  style: Tag,
  build_circle: Wrench,
  map: MapPin,
  // Moderación
  gavel: Gavel,
  rate_review: Star,
  report_problem: AlertTriangle,
  // Soporte
  headset_mic: Headphones,
  confirmation_number: Ticket,
  support_agent: LifeBuoy,
  // Finanzas
  payments: Wallet,
  credit_card: CreditCard,
  account_balance: Landmark,
  percent: Percent,
  analytics: TrendingUp,
  // Marketing
  campaign: Megaphone,
  local_offer: TicketPercent,
  notifications_active: BellRing,
  // Administración
  admin_panel_settings: ShieldCheck,
  security: Lock,
  view_module: LayoutGrid,
  receipt_long: FileClock,
  settings: Settings
}

const resolveIcon = (nameOrIcon?: string | null, path?: string) => {
  const key = (nameOrIcon || '').toLowerCase().trim()
  if (key && iconMapping[key]) return iconMapping[key]

  if (path) {
    const parts = path.replace(/^\//, '').toLowerCase().split('/')
    const firstPart = parts[0]
    if (firstPart && iconMapping[firstPart]) return iconMapping[firstPart]
    const lastPart = parts[parts.length - 1]
    if (lastPart && iconMapping[lastPart]) return iconMapping[lastPart]
  }

  return Layers
}

// ----------------------------------------------------------------------
// Agrupación de Módulos por Sección
// ----------------------------------------------------------------------
interface SectionGroup {
  name: string
  modules: ModuloMenuDto[]
}

const groupedSections = computed<SectionGroup[]>(() => {
  const list = modulos.value || []
  const visible = list
    .filter(m => m.permisos?.puedeVer !== false)
    .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))

  const sectionMap = new Map<string, ModuloMenuDto[]>()

  for (const m of visible) {
    const secName = (m.seccion || 'GENERAL').toUpperCase().trim()
    if (!sectionMap.has(secName)) {
      sectionMap.set(secName, [])
    }
    sectionMap.get(secName)!.push(m)
  }

  const result: SectionGroup[] = []
  for (const [name, modules] of sectionMap.entries()) {
    result.push({ name, modules })
  }

  return result
})

// ----------------------------------------------------------------------
// Estado de Acordeones / Despliegue de Submódulos
// ----------------------------------------------------------------------
const expandedModules = ref<Record<string, boolean>>({})

const isExpanded = (moduloId: string): boolean => {
  return !!expandedModules.value[moduloId]
}

const toggleSubmenu = (moduloId: string) => {
  expandedModules.value[moduloId] = !expandedModules.value[moduloId]
}

// ----------------------------------------------------------------------
// Lógica de Módulos Activos
// ----------------------------------------------------------------------
const isSubActive = (sub: ModuloMenuDto): boolean => {
  if (!sub.ruta) return false
  if (sub.ruta === '/dashboard') return route.path === '/dashboard'
  return route.path === sub.ruta || route.path.startsWith(`${sub.ruta}/`)
}

const isModuleActive = (m: ModuloMenuDto): boolean => {
  if (m.ruta) {
    if (m.ruta === '/dashboard') return route.path === '/dashboard'
    return route.path === m.ruta || route.path.startsWith(`${m.ruta}/`)
  }
  if (m.submodulos && m.submodulos.length > 0) {
    return m.submodulos.some(s => isSubActive(s))
  }
  return false
}

// Auto-expandir el módulo padre si la ruta activa corresponde a uno de sus hijos
watch(
  () => route.path,
  () => {
    const list = modulos.value || []
    for (const m of list) {
      if (m.submodulos && m.submodulos.some(s => isSubActive(s))) {
        expandedModules.value[m.moduloId] = true
      }
    }
  },
  { immediate: true }
)

const handleNavClick = () => {
  closeMobile()
}
</script>

<style scoped>
/* Transición suave para acordeón de submódulos */
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-4px);
}

.accordion-enter-to,
.accordion-leave-from {
  opacity: 1;
  max-height: 500px;
  transform: translateY(0);
}

/* Scrollbar fina personalizada con acento verde de marca */
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
