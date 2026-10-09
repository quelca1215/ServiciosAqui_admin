<template>
  <div class="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col selection:bg-emerald-500 selection:text-white">
    <!-- Barra lateral interactiva y colapsable -->
    <Sidebar />

    <!-- Área de Contenido Principal (con padding lateral dinámico según el estado del sidebar) -->
    <div 
      class="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out"
      :class="isCollapsed ? 'lg:pl-20' : 'lg:pl-64'"
    >
      <!-- Barra de navegación superior -->
      <Navbar />

      <!-- Contenedor de la vista activa -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

      <!-- Pie de página discreto del panel -->
      <footer class="py-4 px-6 border-t border-slate-200/80 text-center text-xs text-slate-400 font-mono flex items-center justify-between">
        <span>ServiciosAquí Bolivia • Enterprise Backoffice v2.4</span>
        <span class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          Sistema Operativo
        </span>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/layout/Sidebar.vue'
import Navbar from '@/components/layout/Navbar.vue'
import { useSidebar } from '@/composables/useSidebar'

const { isCollapsed } = useSidebar()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>

