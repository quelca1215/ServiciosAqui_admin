<template>
  <div class="space-y-6">
    
    <!-- Barra Superior: Navegación de Regreso y Acciones de Control -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <router-link
          to="/usuarios"
          class="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
          title="Volver al Directorio"
        >
          <ArrowLeft class="w-4 h-4" />
        </router-link>

        <div>
          <div class="flex items-center gap-1.5 text-xs text-slate-400 font-medium font-mono">
            <span>Usuarios</span>
            <span>/</span>
            <span class="text-slate-600">{{ user.id }}</span>
          </div>
          <h2 class="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            {{ user.name }}
          </h2>
        </div>
      </div>

      <!-- Acciones de Administración del Usuario -->
      <div class="flex items-center gap-2">
        <button
          @click="toggleUserAccountStatus"
          class="px-3.5 py-2 rounded-xl font-bold text-xs transition cursor-pointer border"
          :class="user.accountStatus === 'Activo' ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'"
        >
          {{ user.accountStatus === 'Activo' ? 'Suspender Cuenta' : 'Reactivar Cuenta' }}
        </button>

        <button
          v-if="user.kycStatus === 'Pendiente'"
          @click="approveKyc"
          class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer"
        >
          Aprobar e-KYC
        </button>

        <button
          @click="exportAuditSummary"
          class="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center gap-1.5"
        >
          <Download class="w-3.5 h-3.5" />
          <span>Ficha de Auditoría</span>
        </button>
      </div>
    </div>

    <!-- Ficha Principal de Identidad del Usuario -->
    <div class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs relative overflow-hidden">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div class="flex items-center gap-5">
          <!-- Avatar Grande con Iniciales -->
          <div class="w-20 h-20 rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-emerald-950 p-[2px] shadow-lg shrink-0">
            <div class="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white font-black text-2xl">
              {{ user.firstName.charAt(0) }}{{ user.lastNamePaternal.charAt(0) }}
            </div>
          </div>

          <!-- Datos de Identidad -->
          <div>
            <div class="flex flex-wrap items-center gap-2 mb-1">
              <h3 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {{ user.name }}
              </h3>
              <span 
                class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold"
                :class="user.role === 'Proveedor' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-purple-50 text-purple-700 border border-purple-200'"
              >
                {{ user.role }}
              </span>
              <span 
                class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold"
                :class="{
                  'bg-emerald-50 text-emerald-700 border border-emerald-200': user.accountStatus === 'Activo',
                  'bg-rose-50 text-rose-700 border border-rose-200': user.accountStatus === 'Suspendido',
                  'bg-amber-50 text-amber-700 border border-amber-200': user.accountStatus === 'En Revisión'
                }"
              >
                Cuenta {{ user.accountStatus }}
              </span>
            </div>

            <p class="text-sm font-semibold text-emerald-700 flex items-center gap-1.5">
              <Briefcase class="w-4 h-4 text-emerald-600" />
              <span>{{ user.profession || 'Cliente Contratante en la Plataforma' }}</span>
            </p>

            <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-mono mt-2">
              <span>CI: <strong class="text-slate-800">{{ user.ci }} {{ user.ciExpedition }}</strong></span>
              <span>•</span>
              <span>Email: <strong class="text-slate-800">{{ user.email }}</strong></span>
              <span>•</span>
              <span>Tel: <strong class="text-slate-800">{{ user.phone }}</strong></span>
              <span>•</span>
              <span class="flex items-center gap-1">
                <MapPin class="w-3.5 h-3.5 text-emerald-600" />
                <strong class="text-slate-800">{{ user.department }}, Bolivia</strong>
              </span>
            </div>
          </div>
        </div>

        <!-- Zonas de Cobertura Geográfica -->
        <div class="w-full md:w-auto md:text-right border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
          <span class="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1.5">
            Zonas donde ofrece servicios:
          </span>
          <div class="flex flex-wrap md:justify-end gap-1.5 max-w-sm">
            <span 
              v-for="z in user.coverageZones" 
              :key="z"
              class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[11px] font-semibold"
            >
              {{ z }}
            </span>
          </div>
          <p class="text-[10px] text-slate-400 font-mono mt-2">
            Registrado: {{ user.joinedDate }} • Activo: {{ user.lastActive }}
          </p>
        </div>

      </div>
    </div>

    <!-- 4 Métricas Clave (KPIs) -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div class="flex items-center justify-between text-slate-400 mb-2">
          <span class="text-xs font-bold uppercase tracking-wider font-mono">Calificación General</span>
          <Star class="w-4 h-4 fill-amber-400 text-amber-400" />
        </div>
        <div class="text-3xl font-black text-slate-900 font-mono flex items-baseline gap-1.5">
          <span>{{ user.rating }}</span>
          <span class="text-xs text-slate-400 font-normal">/ 5.0</span>
        </div>
        <p class="text-[11px] text-slate-500 mt-1 font-semibold">Basado en {{ user.reviewsCount }} valoraciones</p>
      </div>

      <div class="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div class="flex items-center justify-between text-slate-400 mb-2">
          <span class="text-xs font-bold uppercase tracking-wider font-mono">Trabajos Completados</span>
          <Award class="w-4 h-4 text-emerald-600" />
        </div>
        <div class="text-3xl font-black text-slate-900 font-mono">{{ user.completedContracts }}</div>
        <p class="text-[11px] text-emerald-600 font-semibold mt-1">100% liquidados en Escrow</p>
      </div>

      <div class="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div class="flex items-center justify-between text-slate-400 mb-2">
          <span class="text-xs font-bold uppercase tracking-wider font-mono">Volumen en Custodia</span>
          <TrendingUp class="w-4 h-4 text-blue-600" />
        </div>
        <div class="text-2xl sm:text-3xl font-black text-slate-900 font-mono truncate" :title="user.escrowTotalAmount">
          {{ user.escrowTotalAmount }}
        </div>
        <p class="text-[11px] text-slate-500 mt-1">Garantías financieras procesadas</p>
      </div>

      <div class="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div class="flex items-center justify-between text-slate-400 mb-2">
          <span class="text-xs font-bold uppercase tracking-wider font-mono">Puntualidad de Entrega</span>
          <CheckCircle2 class="w-4 h-4 text-emerald-600" />
        </div>
        <div class="text-3xl font-black text-emerald-600 font-mono">{{ user.onTimeRate }}%</div>
        <p class="text-[11px] text-slate-500 mt-1">Tasa de cumplimiento a tiempo</p>
      </div>
    </div>

    <!-- Pestañas de Navegación del Detalle -->
    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      <!-- Selector de pestañas -->
      <div class="border-b border-slate-200/80 bg-slate-50/70 px-6 pt-3 flex gap-4 text-xs font-bold overflow-x-auto">
        <button
          @click="activeTab = 'reviews'"
          class="pb-3 px-1 border-b-2 flex items-center gap-2 transition cursor-pointer whitespace-nowrap"
          :class="activeTab === 'reviews' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'"
        >
          <MessageSquare class="w-4 h-4" />
          <span>Valoraciones & Reseñas ({{ user.reviews.length }})</span>
        </button>

        <button
          @click="activeTab = 'contracts'"
          class="pb-3 px-1 border-b-2 flex items-center gap-2 transition cursor-pointer whitespace-nowrap"
          :class="activeTab === 'contracts' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'"
        >
          <FileText class="w-4 h-4" />
          <span>Historial de Contratos ({{ user.contracts.length }})</span>
        </button>

        <button
          @click="activeTab = 'documents'"
          class="pb-3 px-1 border-b-2 flex items-center gap-2 transition cursor-pointer whitespace-nowrap"
          :class="activeTab === 'documents' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'"
        >
          <Shield class="w-4 h-4" />
          <span>Documentos & e-KYC ({{ user.documents.length }})</span>
        </button>
      </div>

      <!-- CONTENIDO PESTAÑA 1: RESEÑAS Y VALORACIONES -->
      <div v-show="activeTab === 'reviews'" class="p-6 sm:p-8 space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 class="text-base font-bold text-slate-900 tracking-tight">
              Opiniones y Calificaciones de Clientes
            </h4>
            <p class="text-xs text-slate-500 mt-0.5">
              Trazabilidad de calificaciones otorgadas tras la liberación del fondo en custodia de cada trabajo.
            </p>
          </div>

          <div class="inline-flex items-center gap-2 p-2 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
            <Star class="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>Promedio: {{ user.rating }} de 5 estrellas</span>
          </div>
        </div>

        <!-- Lista de Reseñas Individuales -->
        <div class="space-y-4">
          <div 
            v-for="rev in user.reviews" 
            :key="rev.id"
            class="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/70 space-y-3"
          >
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                  {{ rev.clientName.charAt(0) }}
                </div>
                <div>
                  <h5 class="text-xs font-bold text-slate-900">{{ rev.clientName }}</h5>
                  <span class="text-[10px] text-slate-400 font-mono">{{ rev.clientRole }}</span>
                </div>
              </div>

              <!-- Puntuación y Fecha -->
              <div class="flex items-center gap-3">
                <div class="flex items-center gap-0.5">
                  <Star 
                    v-for="n in 5" 
                    :key="n" 
                    class="w-3.5 h-3.5" 
                    :class="n <= Math.round(rev.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'"
                  />
                </div>
                <span class="text-[11px] font-mono text-slate-400">{{ rev.date }}</span>
              </div>
            </div>

            <!-- Contrato Asignado -->
            <div class="text-[11px] font-mono text-emerald-700 bg-emerald-50/60 px-2.5 py-1 rounded-lg border border-emerald-100 inline-block">
              Trabajo: {{ rev.contractTitle }} ({{ rev.contractId }})
            </div>

            <!-- Comentario Textual -->
            <p class="text-xs text-slate-700 leading-relaxed italic">
              "{{ rev.comment }}"
            </p>

            <!-- Respuesta del Proveedor si existe -->
            <div v-if="rev.providerReply" class="ml-4 pl-3 border-l-2 border-emerald-500 text-xs bg-white p-2.5 rounded-r-xl border border-slate-100">
              <span class="font-bold text-slate-800 text-[11px] block">Respuesta de {{ user.firstName }}:</span>
              <p class="text-slate-600 text-xs mt-0.5">{{ rev.providerReply }}</p>
            </div>
          </div>

          <div v-if="user.reviews.length === 0" class="py-8 text-center text-slate-400 text-xs">
            Este usuario todavía no ha recibido valoraciones en la plataforma.
          </div>
        </div>
      </div>

      <!-- CONTENIDO PESTAÑA 2: HISTORIAL DE CONTRATOS -->
      <div v-show="activeTab === 'contracts'" class="p-6 sm:p-8 space-y-4">
        <div>
          <h4 class="text-base font-bold text-slate-900 tracking-tight">
            Contratos y Acuerdos de Servicios
          </h4>
          <p class="text-xs text-slate-500 mt-0.5">
            Registro de todas las órdenes de servicio, contrapartes y estado de los fondos en garantía.
          </p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="text-slate-400 uppercase font-mono border-b border-slate-100">
                <th class="pb-3 font-semibold">ID Contrato</th>
                <th class="pb-3 font-semibold">Servicio / Tarea</th>
                <th class="pb-3 font-semibold">Contraparte</th>
                <th class="pb-3 font-semibold">Monto Acordado</th>
                <th class="pb-3 font-semibold">Fecha</th>
                <th class="pb-3 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-medium">
              <tr v-for="ctr in user.contracts" :key="ctr.id" class="hover:bg-slate-50/60 transition">
                <td class="py-3 font-mono font-bold text-slate-600">{{ ctr.id }}</td>
                <td class="py-3 text-slate-900 font-bold">{{ ctr.title }}</td>
                <td class="py-3 text-slate-700">{{ ctr.counterparty }}</td>
                <td class="py-3 font-mono font-bold text-slate-900">{{ ctr.amount }}</td>
                <td class="py-3 font-mono text-slate-400 text-[11px]">{{ ctr.date }}</td>
                <td class="py-3">
                  <span :class="['px-2 py-0.5 rounded font-mono text-[10px] font-bold', ctr.statusClass]">
                    {{ ctr.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- CONTENIDO PESTAÑA 3: DOCUMENTACIÓN Y e-KYC -->
      <div v-show="activeTab === 'documents'" class="p-6 sm:p-8 space-y-4">
        <div>
          <h4 class="text-base font-bold text-slate-900 tracking-tight">
            Documentación Respaldada y Validación Legal
          </h4>
          <p class="text-xs text-slate-500 mt-0.5">
            Verificación de identidad oficial, certificados penales y acreditaciones profesionales.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="doc in user.documents" 
            :key="doc.name"
            class="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-600">
                <FileText class="w-5 h-5" />
              </div>
              <div>
                <h5 class="text-xs font-bold text-slate-900">{{ doc.name }}</h5>
                <p class="text-[10px] text-slate-400 font-mono">{{ doc.type }} • {{ doc.date }}</p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <span 
                class="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                :class="doc.status === 'Aprobado' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'"
              >
                {{ doc.status }}
              </span>
              <button 
                @click="viewDocument(doc.name)"
                class="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-white transition cursor-pointer"
                title="Descargar o Ver Documento"
              >
                <Download class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div v-if="user.documents.length === 0" class="col-span-2 py-8 text-center text-slate-400 text-xs">
            No se han registrado documentos oficiales para este perfil.
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ArrowLeft, 
  Briefcase, 
  MapPin, 
  Star, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  MessageSquare, 
  FileText, 
  Shield, 
  Download 
} from 'lucide-vue-next'
import { mockUsers, type UserItem } from '@/data/mockUsers'

const route = useRoute()
const router = useRouter()

const activeTab = ref<'reviews' | 'contracts' | 'documents'>('reviews')

// Cargar usuario según el parámetro en la URL
const user = computed<UserItem>(() => {
  const userId = route.params.id as string
  const found = mockUsers.find(u => u.id === userId)
  return found || mockUsers[0]!
})

const toggleUserAccountStatus = () => {
  if (user.value.accountStatus === 'Activo') {
    user.value.accountStatus = 'Suspendido'
    alert(`La cuenta de ${user.value.name} ha sido suspendida.`)
  } else {
    user.value.accountStatus = 'Activo'
    alert(`La cuenta de ${user.value.name} ha sido reactivada.`)
  }
}

const approveKyc = () => {
  user.value.kycStatus = 'Verificado'
  alert(`e-KYC de ${user.value.name} aprobado exitosamente.`)
}

const exportAuditSummary = () => {
  alert(`Descargando Ficha Completa de Auditoría para ${user.value.name} (PDF generado).`)
}

const viewDocument = (docName: string) => {
  alert(`Abriendo visualizador seguro para: "${docName}"`)
}
</script>

