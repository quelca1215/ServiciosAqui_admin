<template>
  <div>
    <!-- Backdrop oscuro para móvil cuando el sidebar está abierto -->
    <transition name="fade">
      <div
        v-if="isMobileOpen"
        @click="closeMobile"
        class="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden"
      ></div>
    </transition>

    <!-- Barra lateral principal -->
    <aside
      class="fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#0b1120] text-slate-300 border-r border-slate-800/80 transition-all duration-300 ease-in-out"
      :class="[
        // Tamaño en escritorio
        isCollapsed ? 'lg:w-20' : 'lg:w-64',
        // Comportamiento responsivo móvil
        isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <!-- Cabecera del Sidebar: Logo y Toggle -->
      <div class="h-16 px-4 flex items-center justify-between border-b border-slate-800/60 shrink-0">
        <router-link to="/dashboard" class="flex items-center gap-3 overflow-hidden group">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-lime-400 p-[1.5px] shrink-0 shadow-md shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition">
            <div class="w-full h-full bg-[#0b1120] rounded-[10px] flex items-center justify-center">
              <ShieldCheck class="w-5 h-5 text-emerald-400 stroke-[2.2]" />
            </div>
          </div>
          
          <div v-show="!isCollapsed" class="transition-opacity duration-200">
            <span class="text-lg font-black tracking-tight text-white flex items-center leading-none">
              Servicios<span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-400">Aquí</span>
            </span>
            <span class="text-[9px] font-mono tracking-widest uppercase text-emerald-400/90 font-semibold block mt-0.5">
              Admin Suite
            </span>
          </div>
        </router-link>

        <!-- Botón para cerrar en móvil -->
        <button
          @click="closeMobile"
          class="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
          aria-label="Cerrar menú"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Menú de Navegación -->
      <nav class="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div v-show="!isCollapsed" class="px-3 pb-2 text-[10px] font-mono font-bold tracking-wider uppercase text-slate-500">
          Módulos Principales
        </div>

        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          @click="handleNavClick"
          class="group relative flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 select-none"
          :class="[
            isItemActive(item)
              ? 'bg-gradient-to-r from-emerald-500/15 to-emerald-500/5 text-emerald-400 border border-emerald-500/20 shadow-xs'
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border border-transparent'
          ]"
        >
          <!-- Icono con resplandor en activo -->
          <component 
            :is="item.icon" 
            class="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110"
            :class="isItemActive(item) ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'"
          />

          <!-- Etiqueta del módulo -->
          <span 
            v-show="!isCollapsed" 
            class="truncate tracking-tight flex-1"
          >
            {{ item.label }}
          </span>

          <!-- Badge opcional -->
          <span
            v-if="item.badge && !isCollapsed"
            class="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md shrink-0 transition-colors"
            :class="item.badgeColor || 'bg-slate-800 text-slate-300'"
          >
            {{ item.badge }}
          </span>

          <!-- Tooltip flotante al estar colapsado -->
          <div
            v-if="isCollapsed"
            class="hidden lg:block absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold whitespace-nowrap shadow-xl border border-slate-700/80 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 z-50"
          >
            <div class="flex items-center gap-2">
              <span>{{ item.label }}</span>
              <span 
                v-if="item.badge" 
                class="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded"
                :class="item.badgeColor || 'bg-slate-800 text-slate-300'"
              >
                {{ item.badge }}
              </span>
            </div>
            <!-- Flecha del tooltip -->
            <div class="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-900 border-l border-b border-slate-700/80 rotate-45"></div>
          </div>
        </router-link>
      </nav>

      <!-- Pie del Sidebar: Tarjeta de Estado y Botón Toggle Expand/Collapse -->
      <div class="p-3 border-t border-slate-800/60 bg-[#090e1b] shrink-0">
        <!-- Tarjeta de Estado de Seguridad (solo si expandido) -->
        <div 
          v-show="!isCollapsed" 
          class="mb-3 p-3 rounded-xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/20 text-xs"
        >
          <div class="flex items-center justify-between text-emerald-400 font-semibold mb-1">
            <span class="flex items-center gap-1.5 text-[11px] font-mono">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Red Escrow Segura
            </span>
            <span class="text-[10px] font-mono text-slate-400">TLS 1.3</span>
          </div>
          <p class="text-[10px] text-slate-400 leading-tight">
            Transacciones y validaciones criptográficas activas.
          </p>
        </div>

        <!-- Botón para Colapsar / Expandir (Escritorio) -->
        <button
          @click="toggleCollapse"
          class="hidden lg:flex w-full items-center justify-center gap-2.5 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 text-xs font-semibold transition cursor-pointer"
          :title="isCollapsed ? 'Expandir menú lateral' : 'Contraer menú lateral'"
          aria-label="Contraer o expandir barra lateral"
        >
          <PanelLeftClose v-if="!isCollapsed" class="w-4 h-4 text-emerald-400" />
          <PanelLeftOpen v-else class="w-4 h-4 text-emerald-400" />
          <span v-show="!isCollapsed" class="font-mono text-[11px]">Contraer Menú</span>
        </button>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Users, 
  BadgeCheck, 
  CreditCard, 
  Layers, 
  BarChart3, 
  History, 
  Settings, 
  PanelLeftClose, 
  PanelLeftOpen, 
  X 
} from 'lucide-vue-next'
import { useSidebar } from '@/composables/useSidebar'
import { useRoute } from 'vue-router'

const route = useRoute()
const { isCollapsed, isMobileOpen, toggleCollapse, closeMobile } = useSidebar()

interface MenuItem {
  label: string
  path: string
  icon: any
  exact?: boolean
  badge?: string
  badgeColor?: string
}

const isItemActive = (item: MenuItem) => {
  if (item.exact) {
    return route.path === item.path
  }
  return route.path.startsWith(item.path)
}

const menuItems: MenuItem[] = [
  { 
    label: 'Dashboard', 
    path: '/dashboard', 
    icon: LayoutDashboard, 
    exact: true 
  },
  { 
    label: 'Usuarios', 
    path: '/usuarios', 
    icon: Users, 
    badge: '1.2k', 
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
  },
  { 
    label: 'Verificación (KYC)', 
    path: '/verificacion', 
    icon: BadgeCheck, 
    badge: '8 pend.', 
    badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
  },
  { 
    label: 'Pagos & Escrow', 
    path: '/pagos', 
    icon: CreditCard, 
    badge: 'Custodia', 
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
  },
  { 
    label: 'Categorías', 
    path: '/categorias', 
    icon: Layers 
  },
  { 
    label: 'Reportes', 
    path: '/reportes', 
    icon: BarChart3 
  },
  { 
    label: 'Auditoría', 
    path: '/auditoria', 
    icon: History, 
    badge: 'Live', 
    badgeColor: 'bg-lime-500/20 text-lime-300 border border-lime-500/30' 
  },
  { 
    label: 'Configuración', 
    path: '/configuracion', 
    icon: Settings 
  }
]

const handleNavClick = () => {
  // Si estamos en pantallas pequeñas, cerramos el drawer tras hacer clic
  closeMobile()
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #334155;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
