<template>
  <div class="space-y-6">
    <PageHeader
      tag="Administración · Catálogo de Módulos"
      title="Módulos del Sistema"
      description="Estructura oficial de módulos, secciones, rutas y jerarquías registrados en el backend."
    >
      <template #actions>
        <button
          type="button"
          :disabled="isLoading"
          @click="cargarModulos"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold bg-white text-slate-700 border-2 border-slate-200 hover:border-emerald-500/40 hover:text-emerald-800 transition cursor-pointer disabled:opacity-60 shadow-2xs"
        >
          <RefreshCw :class="['w-3.5 h-3.5', { 'animate-spin': isLoading }]" />
          <span>Actualizar</span>
        </button>
      </template>
    </PageHeader>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Módulos"
        :value="displayMetric(modulos.length)"
        subtext="Registros en sistema"
        :icon="LayoutGrid"
        variant="dark"
        :pulse-dot="true"
      />

      <StatCard
        label="Secciones"
        :value="displayMetric(seccionesUnicas.length)"
        subtext="Agrupadores del menú"
        :icon="Layers"
        variant="blue"
      />

      <StatCard
        label="Módulos Raíz"
        :value="displayMetric(raizCount)"
        subtext="Sin módulo padre"
        :icon="Folder"
        variant="emerald"
      />

      <StatCard
        label="Submódulos"
        :value="displayMetric(submodulosCount)"
        subtext="Dependientes de un módulo"
        :icon="GitBranch"
        variant="purple"
      />
    </div>

    <div
      v-if="errorMessage"
      class="p-4 rounded-3xl bg-rose-50 border-2 border-rose-200 text-rose-900 flex items-center justify-between gap-4"
    >
      <div class="flex items-center gap-3">
        <AlertCircle class="w-5 h-5 text-rose-700 shrink-0" />
        <p class="text-sm font-medium">{{ errorMessage }}</p>
      </div>
      <button
        type="button"
        @click="cargarModulos"
        class="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs cursor-pointer"
      >
        Reintentar
      </button>
    </div>

    <div class="bg-white rounded-3xl border-2 border-slate-200/90 shadow-md p-5 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
      <div class="sm:col-span-2 relative">
        <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          v-model="filters.buscar"
          type="text"
          placeholder="Buscar por nombre de módulo, ruta o sección..."
          class="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        />
      </div>

      <div>
        <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-600 font-mono mb-1">
          Sección
        </label>
        <select
          v-model="filters.seccion"
          class="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 bg-slate-50 font-semibold text-slate-800"
        >
          <option value="todas">Todas las Secciones</option>
          <option v-for="sec in seccionesUnicas" :key="sec" :value="sec">{{ sec }}</option>
        </select>
      </div>
    </div>

    <div v-if="modulosPorSeccion.length > 0" class="space-y-4">
      <div
        v-for="grupo in modulosPorSeccion"
        :key="grupo.seccion"
        class="bg-white rounded-3xl border-2 border-slate-200/90 shadow-md overflow-hidden"
      >
        <div class="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Layers class="w-4 h-4 text-emerald-600" />
            <h3 class="text-sm font-black uppercase font-mono text-slate-800">
              {{ grupo.seccion }}
            </h3>
          </div>
          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-100 text-emerald-900">
            {{ grupo.items.length }} módulos
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="text-slate-400 uppercase font-mono text-[10px] border-b border-slate-100">
                <th class="py-3 px-4 font-bold">Orden</th>
                <th class="py-3 px-4 font-bold">Nombre</th>
                <th class="py-3 px-4 font-bold">Ruta</th>
                <th class="py-3 px-4 font-bold">Jerarquía</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="mod in grupo.items" :key="mod.id" class="hover:bg-slate-50/80">
                <td class="py-3 px-4 font-mono font-bold text-slate-700">#{{ mod.orden }}</td>
                <td class="py-3 px-4 font-bold text-slate-900">{{ mod.nombre }}</td>
                <td class="py-3 px-4 font-mono text-emerald-700">{{ mod.ruta || '—' }}</td>
                <td class="py-3 px-4">
                  <span
                    :class="[
                      'px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold',
                      mod.moduloPadreId
                        ? 'bg-purple-50 text-purple-800 border border-purple-200'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200',
                    ]"
                  >
                    {{ mod.moduloPadreId ? 'Submódulo' : 'Raíz' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div
      v-else-if="!isLoading"
      class="bg-white rounded-3xl border-2 border-slate-200/90 p-12 text-center shadow-sm text-xs text-slate-500"
    >
      <LayoutGrid class="w-8 h-8 text-slate-300 mx-auto mb-2" />
      <p class="font-bold text-slate-700">No se encontraron módulos</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import {
  LayoutGrid,
  Layers,
  Folder,
  GitBranch,
  RefreshCw,
  AlertCircle,
  Search,
} from 'lucide-vue-next'
import { PageHeader, StatCard } from '@/components/common'
import { parametrosService, type ModuloAdministrativoDto } from '@/api'

const modulos = ref<ModuloAdministrativoDto[]>([])
const isLoading = ref(false)
const hasLoaded = ref(false)
const errorMessage = ref<string | null>(null)

const filters = reactive({
  buscar: '',
  seccion: 'todas',
})

const seccionesUnicas = computed(() => {
  const set = new Set<string>()
  for (const m of modulos.value) {
    set.add(m.seccion?.trim() || 'General')
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'es'))
})

const raizCount = computed(() => modulos.value.filter((m) => !m.moduloPadreId).length)
const submodulosCount = computed(() => modulos.value.filter((m) => Boolean(m.moduloPadreId)).length)

const modulosPorSeccion = computed(() => {
  const q = filters.buscar.trim().toLowerCase()
  const map = new Map<string, ModuloAdministrativoDto[]>()

  for (const mod of modulos.value) {
    const sec = mod.seccion?.trim() || 'General'
    if (filters.seccion !== 'todas' && sec !== filters.seccion) continue
    if (q) {
      const match =
        mod.nombre.toLowerCase().includes(q) ||
        mod.ruta.toLowerCase().includes(q) ||
        sec.toLowerCase().includes(q)
      if (!match) continue
    }
    const list = map.get(sec)
    if (list) list.push(mod)
    else map.set(sec, [mod])
  }

  return Array.from(map.entries()).map(([seccion, items]) => ({
    seccion,
    items: [...items].sort((a, b) => a.orden - b.orden),
  }))
})

function displayMetric(value: number): number | string {
  return isLoading.value && !hasLoaded.value ? '...' : value
}

async function cargarModulos() {
  if (isLoading.value) return
  isLoading.value = true
  errorMessage.value = null

  try {
    modulos.value = await parametrosService.obtenerModulos()
    hasLoaded.value = true
  } catch (err: any) {
    errorMessage.value = err?.message || 'No se pudieron obtener los módulos.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  cargarModulos()
})
</script>
