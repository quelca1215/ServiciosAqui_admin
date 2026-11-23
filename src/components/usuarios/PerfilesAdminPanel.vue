<template>
  <div class="space-y-6">
    <PageHeader
      :tag="config.tag"
      :title="config.title"
      :description="config.description"
    >
      <template #actions>
        <button
          type="button"
          :disabled="isLoading"
          @click="cargarPerfiles"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold bg-white text-slate-700 border-2 border-slate-200 hover:border-emerald-500/40 hover:text-emerald-800 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-2xs"
        >
          <RefreshCw :class="['w-3.5 h-3.5', { 'animate-spin': isLoading }]" />
          <span>{{ isLoading ? 'Actualizando...' : 'Actualizar' }}</span>
        </button>
      </template>
    </PageHeader>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        :label="config.totalLabel"
        :value="displayMetric(perfiles.length)"
        subtext="Perfiles en consulta actual"
        :icon="config.icon"
        variant="dark"
        :pulse-dot="true"
      />

      <StatCard
        :label="config.activosLabel"
        :value="displayMetric(activosCount)"
        :icon="UserCheck"
        variant="emerald"
        :progress="porcentajeActivos"
        progress-label="Activos en plataforma:"
      />

      <StatCard
        label="CI Verificado"
        :value="displayMetric(verificadosCount)"
        subtext="Identidad validada (e-KYC)"
        :icon="BadgeCheck"
        variant="lime"
      />

      <StatCard
        label="Suspendidos / Otros"
        :value="displayMetric(noActivosCount)"
        subtext="Perfiles restringidos o inactivos"
        :icon="ShieldAlert"
        variant="amber"
        :pulse-dot="noActivosCount > 0"
      />
    </div>

    <div
      v-if="errorMessage"
      class="p-4 sm:p-5 rounded-3xl bg-rose-50 border-2 border-rose-200 text-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 border border-rose-200 flex items-center justify-center shrink-0"
        >
          <AlertCircle class="w-5 h-5" />
        </div>
        <div>
          <p class="text-xs font-mono font-bold uppercase text-rose-700">
            {{ config.errorTitle }}
          </p>
          <p class="text-sm font-medium text-rose-900">{{ errorMessage }}</p>
        </div>
      </div>

      <button
        type="button"
        :disabled="isLoading"
        @click="cargarPerfiles"
        class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer shrink-0 self-start sm:self-auto disabled:opacity-60"
      >
        Reintentar
      </button>
    </div>

    <div class="bg-white rounded-3xl border-2 border-slate-200/90 shadow-md shadow-slate-200/50 p-5 space-y-4">
      <div class="relative group">
        <span
          class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors"
        >
          <Search class="w-4 h-4" />
        </span>
        <input
          v-model="filters.buscar"
          type="text"
          :placeholder="config.searchPlaceholder"
          @keyup.enter="ejecutarBusquedaInmediata"
          class="w-full pl-11 pr-9 py-2.5 rounded-2xl border-2 border-slate-200 bg-slate-50/70 text-slate-900 text-xs sm:text-sm placeholder-slate-400 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 transition duration-150"
        />
        <button
          v-if="filters.buscar"
          type="button"
          @click="limpiarBusqueda"
          class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <div>
          <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-600 font-mono mb-1">
            Estado del Perfil
          </label>
          <select
            v-model="filters.estado"
            @change="onEstadoFilterChange"
            class="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 bg-slate-50 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          >
            <option value="todos">Todos los Estados</option>
            <option v-for="est in estadosDisponibles" :key="est" :value="est">
              {{ est }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-600 font-mono mb-1">
            Verificación CI
          </label>
          <select
            v-model="filters.verificacion"
            class="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 bg-slate-50 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          >
            <option value="todos">Todos</option>
            <option value="verificados">CI Verificado</option>
            <option value="sin_verificar">Sin Verificar</option>
          </select>
        </div>

        <div class="flex items-center justify-between sm:justify-end gap-2">
          <span class="text-[11px] font-mono text-slate-500">
            Mostrando <strong class="text-slate-900">{{ filteredPerfiles.length }}</strong> de {{ perfiles.length }}
          </span>
          <button
            v-if="hasActiveFilters"
            type="button"
            @click="resetFilters"
            class="px-3 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition cursor-pointer inline-flex items-center gap-1"
          >
            <X class="w-3.5 h-3.5" />
            <span>Limpiar</span>
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="isLoading && !hasLoaded"
      class="bg-white rounded-3xl border-2 border-slate-200/90 p-12 text-center shadow-sm"
    >
      <RefreshCw class="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
      <p class="text-sm font-bold text-slate-800">{{ config.loadingTitle }}</p>
      <p class="text-xs text-slate-500 mt-1">{{ config.loadingSubtitle }}</p>
    </div>

    <div
      v-else
      class="bg-white rounded-3xl border-2 border-slate-200/90 shadow-md shadow-slate-200/40 overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
              <th class="py-3.5 px-4 font-bold">{{ config.entitySingular }}</th>
              <th class="py-3.5 px-4 font-bold">Contacto</th>
              <th class="py-3.5 px-4 font-bold">Verificación CI</th>
              <th class="py-3.5 px-4 font-bold">Rating</th>
              <th class="py-3.5 px-4 font-bold">Registro</th>
              <th class="py-3.5 px-4 font-bold">Estado</th>
              <th class="py-3.5 px-4 font-bold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="perfil in filteredPerfiles"
              :key="perfil.idPerfil"
              class="hover:bg-slate-50/80 transition"
            >
              <td class="py-3.5 px-4">
                <div class="flex items-center gap-3">
                  <div
                    :class="[
                      'w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black shrink-0',
                      isEstadoActivo(perfil.estado)
                        ? 'bg-slate-900 text-emerald-400'
                        : 'bg-slate-200 text-slate-600',
                    ]"
                  >
                    {{ getIniciales(perfil.nombreCompleto, config.initialsFallback) }}
                  </div>
                  <div class="min-w-0">
                    <p class="font-bold text-slate-900 truncate max-w-[240px]">
                      {{ perfil.nombreCompleto || 'Sin nombre registrado' }}
                    </p>
                    <p class="text-[11px] text-slate-500 font-medium">
                      {{ perfil.tipoPerfil || config.entitySingular }}
                    </p>
                  </div>
                </div>
              </td>

              <td class="py-3.5 px-4">
                <div class="space-y-1">
                  <div class="flex items-center gap-1.5 text-slate-700">
                    <Mail class="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span class="truncate max-w-[220px]">{{ perfil.correo || 'Sin correo' }}</span>
                  </div>
                  <div class="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
                    <Phone class="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{{ perfil.telefono || 'Sin teléfono' }}</span>
                  </div>
                </div>
              </td>

              <td class="py-3.5 px-4">
                <span
                  :class="[
                    'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border',
                    perfil.verificacionDocumentoIdentidad
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200',
                  ]"
                >
                  <BadgeCheck v-if="perfil.verificacionDocumentoIdentidad" class="w-3.5 h-3.5 text-emerald-600" />
                  <span>{{ perfil.verificacionDocumentoIdentidad ? 'Verificado' : 'Sin verificar' }}</span>
                </span>
              </td>

              <td class="py-3.5 px-4">
                <span
                  v-if="perfil.rating > 0"
                  class="inline-flex items-center gap-1 font-mono font-bold text-amber-700"
                >
                  <Star class="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  {{ perfil.rating.toFixed(1) }}
                </span>
                <span v-else class="text-[11px] text-slate-400 font-mono">
                  Sin calificación
                </span>
              </td>

              <td class="py-3.5 px-4 font-mono text-slate-500">
                {{ formatFecha(perfil.fechaRegistro) }}
              </td>

              <td class="py-3.5 px-4">
                <StatusBadge :status="perfil.estado || 'Sin estado'" />
              </td>

              <td class="py-3.5 px-4 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    @click="abrirFichaPerfil(perfil)"
                    class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-emerald-400 hover:text-emerald-800 font-bold text-[11px] transition cursor-pointer"
                    title="Ver ficha y ubicaciones"
                  >
                    <Eye class="w-3.5 h-3.5" />
                    <span>Ficha</span>
                  </button>

                  <button
                    v-if="puedeEditar"
                    type="button"
                    :disabled="updatingPerfilId === perfil.idPerfil"
                    @click="solicitarToggleRapido(perfil)"
                    :class="[
                      'inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border font-bold text-[11px] transition cursor-pointer disabled:opacity-50',
                      isEstadoActivo(perfil.estado)
                        ? 'border-rose-200 bg-rose-50/70 text-rose-700 hover:bg-rose-100'
                        : 'border-emerald-200 bg-emerald-50/70 text-emerald-800 hover:bg-emerald-100',
                    ]"
                  >
                    <Power class="w-3.5 h-3.5" />
                    <span>{{ isEstadoActivo(perfil.estado) ? 'Suspender' : 'Activar' }}</span>
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredPerfiles.length === 0">
              <td colspan="7" class="py-12 text-center text-slate-500 text-xs">
                <component :is="config.icon" class="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p class="font-bold text-slate-700">
                  {{
                    perfiles.length === 0
                      ? config.emptyServerText
                      : config.emptyFilterText
                  }}
                </p>
                <button
                  v-if="hasActiveFilters"
                  type="button"
                  @click="resetFilters"
                  class="mt-2 font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  Limpiar filtros
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        class="px-5 py-3.5 bg-slate-50/80 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
      >
        <span class="font-mono text-slate-500">
          Página <strong class="text-slate-800">{{ paginaActual }}</strong> ·
          Mostrando <strong class="text-slate-800">{{ perfiles.length }}</strong> registros
        </span>

        <div class="flex items-center gap-2">
          <button
            type="button"
            :disabled="isLoading || pagination.omitir === 0"
            @click="paginaAnterior"
            class="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Anterior
          </button>
          <button
            type="button"
            :disabled="isLoading || perfiles.length < pagination.limite"
            @click="paginaSiguiente"
            class="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Siguiente →
          </button>
        </div>
      </div>
    </div>

    <DetailDrawer
      :is-open="Boolean(selectedPerfil)"
      :title="selectedPerfil?.nombreCompleto || `Ficha de ${config.entitySingular}`"
      :tag="`Perfil ${selectedPerfil?.tipoPerfil || config.entitySingular}`"
      @close="cerrarFichaPerfil"
    >
      <template v-if="selectedPerfil">
        <div class="p-4 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-[#0e1726] text-white space-y-3">
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-lime-400 p-[1.5px] shrink-0">
                <div class="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-sm text-emerald-400">
                  {{ getIniciales(selectedPerfil.nombreCompleto, config.initialsFallback) }}
                </div>
              </div>
              <div class="min-w-0">
                <h4 class="text-base font-black truncate">{{ selectedPerfil.nombreCompleto }}</h4>
                <p class="text-xs font-mono text-slate-400 truncate">{{ selectedPerfil.correo }}</p>
              </div>
            </div>
            <StatusBadge :status="selectedPerfil.estado || 'Sin estado'" />
          </div>

          <div class="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800 text-[11px] font-mono">
            <div>
              <span class="text-slate-400 block">Teléfono</span>
              <span class="text-white font-bold">{{ selectedPerfil.telefono || 'Sin teléfono' }}</span>
            </div>
            <div>
              <span class="text-slate-400 block">Verificación CI</span>
              <span :class="selectedPerfil.verificacionDocumentoIdentidad ? 'text-emerald-400 font-bold' : 'text-slate-300'">
                {{ selectedPerfil.verificacionDocumentoIdentidad ? 'Verificado' : 'Sin verificar' }}
              </span>
            </div>
            <div>
              <span class="text-slate-400 block">Rating</span>
              <span class="text-amber-400 font-bold">
                {{ selectedPerfil.rating > 0 ? `${selectedPerfil.rating.toFixed(1)} ★` : 'Sin calificación' }}
              </span>
            </div>
            <div>
              <span class="text-slate-400 block">Fecha de Registro</span>
              <span class="text-white font-bold">{{ formatFecha(selectedPerfil.fechaRegistro) }}</span>
            </div>
          </div>
        </div>

        <div class="p-4 rounded-2xl border-2 border-slate-200/80 bg-slate-50/50 space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <MapPin class="w-4 h-4 text-emerald-600" />
              <h5 class="text-xs font-mono font-bold uppercase text-slate-800">
                Ubicaciones GPS Registradas
              </h5>
            </div>
            <span class="text-[11px] font-mono font-bold text-slate-500">
              {{ ubicaciones.length }}
            </span>
          </div>

          <div v-if="isLoadingUbicaciones" class="py-4 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <RefreshCw class="w-4 h-4 animate-spin text-emerald-600" />
            <span>Consultando ubicaciones GPS...</span>
          </div>

          <div v-else-if="ubicacionesError" class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
            {{ ubicacionesError }}
          </div>

          <div v-else-if="ubicaciones.length === 0" class="py-3 text-xs text-slate-500 italic">
            Este perfil no tiene ubicaciones GPS registradas.
          </div>

          <ul v-else class="space-y-2.5">
            <li
              v-for="(ub, i) in ubicaciones"
              :key="`${ub.idPerfil}-${i}`"
              class="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-3 text-xs"
            >
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <p class="font-bold text-slate-900 truncate">
                    {{ ub.nombreUbicacion || `Ubicación #${i + 1}` }}
                  </p>
                  <span
                    :class="[
                      'px-2 py-0.5 rounded-full text-[10px] font-mono font-bold',
                      ub.activo ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-500',
                    ]"
                  >
                    {{ ub.activo ? 'Activa' : 'Inactiva' }}
                  </span>
                </div>
                <p class="text-[11px] font-mono text-slate-400 mt-0.5">
                  {{ ub.latitud.toFixed(5) }}, {{ ub.longitud.toFixed(5) }}
                </p>
              </div>

              <a
                :href="`https://www.google.com/maps?q=${ub.latitud},${ub.longitud}`"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-[11px] shrink-0 transition"
              >
                <span>Ver en mapa</span>
                <ExternalLink class="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>

        <div
          v-if="puedeEditar"
          class="p-4 rounded-2xl border-2 border-slate-200/80 bg-white space-y-3"
        >
          <h5 class="text-xs font-mono font-bold uppercase text-slate-800">
            Control Administrativo de Estado
          </h5>
          <p class="text-xs text-slate-500">
            Cambia el estado operativo del perfil en la plataforma.
          </p>

          <div class="flex flex-col sm:flex-row gap-2.5">
            <select
              v-model="drawerTargetEstado"
              class="flex-1 text-xs py-2.5 px-3 rounded-xl border border-slate-300 bg-slate-50 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="Activo">Activo</option>
              <option value="Suspendido">Suspendido</option>
              <option value="Inactivo">Inactivo</option>
            </select>

            <button
              type="button"
              :disabled="updatingPerfilId === selectedPerfil.idPerfil"
              @click="solicitarCambioEstadoDrawer"
              class="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer disabled:opacity-50"
            >
              Aplicar Estado
            </button>
          </div>
        </div>

        <details class="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs">
          <summary class="font-semibold text-slate-600 cursor-pointer select-none">
            Información técnica de soporte
          </summary>
          <div class="mt-3 space-y-2 text-[11px] font-mono text-slate-500">
            <div class="flex items-center justify-between gap-2">
              <span class="truncate">Referencia perfil: {{ selectedPerfil.idPerfil }}</span>
              <button
                type="button"
                @click="copiarIdentificador(selectedPerfil.idPerfil, 'Referencia de perfil')"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer shrink-0"
              >
                <Copy class="w-3 h-3" />
                <span>Copiar</span>
              </button>
            </div>
            <div v-if="selectedPerfil.userId" class="flex items-center justify-between gap-2">
              <span class="truncate">Referencia usuario: {{ selectedPerfil.userId }}</span>
              <button
                type="button"
                @click="copiarIdentificador(selectedPerfil.userId, 'Referencia de usuario')"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer shrink-0"
              >
                <Copy class="w-3 h-3" />
                <span>Copiar</span>
              </button>
            </div>
          </div>
        </details>
      </template>

      <template #footer>
        <button
          type="button"
          @click="cerrarFichaPerfil"
          class="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          Cerrar
        </button>
      </template>
    </DetailDrawer>

    <ConfirmModal
      :is-open="confirmModal.isOpen"
      :loading="Boolean(updatingPerfilId)"
      :title="`Cambiar estado a ${confirmModal.targetEstado}`"
      :subtitle="confirmModal.perfil?.correo || ''"
      :message="`¿Confirmas actualizar el perfil de ${confirmModal.perfil?.nombreCompleto || 'este usuario'} al estado '${confirmModal.targetEstado}'?`"
      :danger="!isEstadoActivo(confirmModal.targetEstado)"
      :confirm-text="`Confirmar (${confirmModal.targetEstado})`"
      @confirm="confirmarCambioEstado"
      @cancel="confirmModal.isOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch, type Component } from 'vue'
import {
  Users,
  Briefcase,
  UserCheck,
  BadgeCheck,
  ShieldAlert,
  Search,
  RefreshCw,
  AlertCircle,
  X,
  Mail,
  Phone,
  Star,
  Eye,
  Power,
  MapPin,
  ExternalLink,
  Copy,
} from 'lucide-vue-next'
import {
  PageHeader,
  StatCard,
  StatusBadge,
  DetailDrawer,
  ConfirmModal,
} from '@/components/common'
import {
  adminService,
  type PerfilAdministracionDto,
  type UbicacionPerfilDto,
} from '@/api'
import { copyToClipboard, formatFecha, getIniciales } from '@/utils/format'
import { usePermissions } from '@/composables/usePermissions'
import { useToast } from '@/composables/useToast'

const props = defineProps<{
  tipo: 'clientes' | 'proveedores'
}>()

interface PanelConfig {
  tag: string
  title: string
  description: string
  totalLabel: string
  activosLabel: string
  entitySingular: string
  initialsFallback: string
  searchPlaceholder: string
  loadingTitle: string
  loadingSubtitle: string
  errorTitle: string
  emptyServerText: string
  emptyFilterText: string
  icon: Component
}

const CONFIG_BY_TYPE: Record<'clientes' | 'proveedores', PanelConfig> = {
  clientes: {
    tag: 'Usuarios · Clientes',
    title: 'Gestión de Clientes',
    description:
      'Listado de clientes registrados, verificación de identidad, ubicaciones GPS y control de estado de perfil.',
    totalLabel: 'Total Clientes',
    activosLabel: 'Clientes Activos',
    entitySingular: 'Cliente',
    initialsFallback: 'CL',
    searchPlaceholder: 'Buscar cliente por nombre, correo o teléfono...',
    loadingTitle: 'Cargando clientes...',
    loadingSubtitle: 'Consultando perfiles de clientes registrados.',
    errorTitle: 'Error al consultar clientes',
    emptyServerText: 'No se encontraron clientes registrados en este criterio',
    emptyFilterText: 'Ningún cliente coincide con los filtros aplicados',
    icon: Users,
  },
  proveedores: {
    tag: 'Usuarios · Proveedores',
    title: 'Gestión de Proveedores',
    description:
      'Listado de prestadores de servicios registrados, verificación de identidad, ubicaciones GPS y control de estado de perfil.',
    totalLabel: 'Total Proveedores',
    activosLabel: 'Proveedores Activos',
    entitySingular: 'Proveedor',
    initialsFallback: 'PR',
    searchPlaceholder: 'Buscar proveedor por nombre, correo o teléfono...',
    loadingTitle: 'Cargando proveedores...',
    loadingSubtitle: 'Consultando prestadores de servicios registrados.',
    errorTitle: 'Error al consultar proveedores',
    emptyServerText: 'No se encontraron proveedores registrados en este criterio',
    emptyFilterText: 'Ningún proveedor coincide con los filtros aplicados',
    icon: Briefcase,
  },
}

const config = computed(() => CONFIG_BY_TYPE[props.tipo])

const { puedeEditar } = usePermissions()
const toast = useToast()

const perfiles = ref<PerfilAdministracionDto[]>([])
const isLoading = ref(false)
const hasLoaded = ref(false)
const errorMessage = ref<string | null>(null)
const updatingPerfilId = ref<string | null>(null)
let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null

const pagination = reactive({
  omitir: 0,
  limite: 50,
})

const filters = reactive({
  buscar: '',
  estado: 'todos',
  verificacion: 'todos',
})

const selectedPerfil = ref<PerfilAdministracionDto | null>(null)
const drawerTargetEstado = ref<string>('Activo')
const ubicaciones = ref<UbicacionPerfilDto[]>([])
const isLoadingUbicaciones = ref(false)
const ubicacionesError = ref<string | null>(null)

const confirmModal = reactive<{
  isOpen: boolean
  perfil: PerfilAdministracionDto | null
  targetEstado: string
}>({
  isOpen: false,
  perfil: null,
  targetEstado: 'Activo',
})

const paginaActual = computed(() => Math.floor(pagination.omitir / pagination.limite) + 1)

const activosCount = computed(
  () => perfiles.value.filter((p) => isEstadoActivo(p.estado)).length
)

const noActivosCount = computed(
  () => perfiles.value.filter((p) => !isEstadoActivo(p.estado)).length
)

const verificadosCount = computed(
  () => perfiles.value.filter((p) => p.verificacionDocumentoIdentidad).length
)

const porcentajeActivos = computed(() => {
  if (perfiles.value.length === 0) return 0
  return Math.round((activosCount.value / perfiles.value.length) * 100)
})

const estadosDisponibles = computed(() => {
  const base = ['Activo', 'Suspendido', 'Inactivo']
  const set = new Set<string>(base)
  for (const p of perfiles.value) {
    if (p.estado?.trim()) set.add(p.estado.trim())
  }
  return Array.from(set)
})

const hasActiveFilters = computed(
  () =>
    filters.buscar.trim() !== '' ||
    filters.estado !== 'todos' ||
    filters.verificacion !== 'todos'
)

const filteredPerfiles = computed(() => {
  const q = filters.buscar.trim().toLowerCase()

  return perfiles.value.filter((p) => {
    if (
      filters.estado !== 'todos' &&
      p.estado.toLowerCase() !== filters.estado.toLowerCase()
    ) {
      return false
    }
    if (filters.verificacion === 'verificados' && !p.verificacionDocumentoIdentidad) {
      return false
    }
    if (filters.verificacion === 'sin_verificar' && p.verificacionDocumentoIdentidad) {
      return false
    }
    if (q) {
      const match =
        p.nombreCompleto.toLowerCase().includes(q) ||
        p.correo.toLowerCase().includes(q) ||
        p.telefono.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })
})

function isEstadoActivo(estado?: string | null): boolean {
  return (estado || '').trim().toLowerCase() === 'activo'
}

function displayMetric(value: number): number | string {
  return isLoading.value && !hasLoaded.value ? '...' : value
}

async function copiarIdentificador(val: string, etiqueta: string) {
  const ok = await copyToClipboard(val)
  if (ok) toast.success(`${etiqueta} copiada al portapapeles.`)
  else toast.error('No se pudo copiar al portapapeles.')
}

async function cargarPerfiles() {
  if (isLoading.value) return
  isLoading.value = true
  errorMessage.value = null

  const filtroReq = {
    omitir: pagination.omitir,
    limite: pagination.limite,
    estado: filters.estado !== 'todos' ? filters.estado : undefined,
    buscar: filters.buscar.trim() || undefined,
  }

  try {
    perfiles.value =
      props.tipo === 'clientes'
        ? await adminService.obtenerClientes(filtroReq)
        : await adminService.obtenerProveedores(filtroReq)
    hasLoaded.value = true
  } catch (err: any) {
    errorMessage.value =
      err?.message || `No se pudo obtener la lista de ${props.tipo}.`
  } finally {
    isLoading.value = false
  }
}

watch(
  () => filters.buscar,
  () => {
    if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
    searchDebounceTimer = setTimeout(() => {
      pagination.omitir = 0
      cargarPerfiles()
    }, 350)
  }
)

function ejecutarBusquedaInmediata() {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
  pagination.omitir = 0
  cargarPerfiles()
}

function onEstadoFilterChange() {
  pagination.omitir = 0
  cargarPerfiles()
}

function limpiarBusqueda() {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
  filters.buscar = ''
  pagination.omitir = 0
  cargarPerfiles()
}

function resetFilters() {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
  filters.buscar = ''
  filters.estado = 'todos'
  filters.verificacion = 'todos'
  pagination.omitir = 0
  cargarPerfiles()
}

function paginaAnterior() {
  if (pagination.omitir === 0) return
  pagination.omitir = Math.max(0, pagination.omitir - pagination.limite)
  cargarPerfiles()
}

function paginaSiguiente() {
  if (perfiles.value.length < pagination.limite) return
  pagination.omitir += pagination.limite
  cargarPerfiles()
}

async function abrirFichaPerfil(perfil: PerfilAdministracionDto) {
  selectedPerfil.value = perfil
  drawerTargetEstado.value = perfil.estado || 'Activo'
  ubicaciones.value = []
  ubicacionesError.value = null
  isLoadingUbicaciones.value = true

  try {
    ubicaciones.value = await adminService.obtenerUbicacionesPerfil(
      perfil.idPerfil
    )
  } catch (err: any) {
    ubicacionesError.value =
      err?.message || 'No se pudieron consultar las ubicaciones GPS registradas.'
  } finally {
    isLoadingUbicaciones.value = false
  }
}

function cerrarFichaPerfil() {
  selectedPerfil.value = null
}

function solicitarToggleRapido(perfil: PerfilAdministracionDto) {
  confirmModal.perfil = perfil
  confirmModal.targetEstado = isEstadoActivo(perfil.estado) ? 'Suspendido' : 'Activo'
  confirmModal.isOpen = true
}

function solicitarCambioEstadoDrawer() {
  if (!selectedPerfil.value) return
  confirmModal.perfil = selectedPerfil.value
  confirmModal.targetEstado = drawerTargetEstado.value
  confirmModal.isOpen = true
}

async function confirmarCambioEstado() {
  const perfil = confirmModal.perfil
  if (!perfil) return

  const nuevoEstado = confirmModal.targetEstado
  updatingPerfilId.value = perfil.idPerfil

  try {
    const actualizado = await adminService.cambiarEstadoPerfil(
      perfil.idPerfil,
      nuevoEstado
    )
    const registroFinal: PerfilAdministracionDto = actualizado.idPerfil
      ? actualizado
      : { ...perfil, estado: nuevoEstado }

    const idx = perfiles.value.findIndex((p) => p.idPerfil === perfil.idPerfil)
    if (idx !== -1) {
      perfiles.value[idx] = registroFinal
    }
    if (selectedPerfil.value?.idPerfil === perfil.idPerfil) {
      selectedPerfil.value = registroFinal
      drawerTargetEstado.value = registroFinal.estado || nuevoEstado
    }
    confirmModal.isOpen = false
    toast.success(`Estado actualizado a '${nuevoEstado}'.`)
  } catch (err: any) {
    toast.error(err?.message || 'No se pudo actualizar el estado del perfil.')
  } finally {
    updatingPerfilId.value = null
  }
}

onBeforeUnmount(() => {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
})

onMounted(() => {
  cargarPerfiles()
})
</script>
