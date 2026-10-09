<template>
  <div class="space-y-6">
    
    <!-- Encabezado de la Sección -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            Directorio Activo
          </span>
          <span class="text-xs text-slate-400 font-mono">• 5 Departamentos de Bolivia</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Gestión de Usuarios y Profesionales
        </h2>
        <p class="text-slate-500 text-xs sm:text-sm mt-0.5">
          Filtre proveedores por oficio y zonas de cobertura, supervise clientes y audite estados e-KYC.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button 
          v-if="hasActiveFilters"
          @click="resetFilters" 
          class="px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs shadow-2xs transition cursor-pointer flex items-center gap-1.5"
        >
          <X class="w-3.5 h-3.5" />
          <span>Limpiar Filtros ({{ activeFiltersCount }})</span>
        </button>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- 4 TARJETAS KPI REDISEÑADAS CON ALTO CONTRASTE Y COLOR DE MARCA -->
    <!-- ============================================================== -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      <!-- KPI 1: Total Usuarios (Tarjeta Hero Oscura con Resplandor Esmeralda) -->
      <div class="p-5 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-[#0b1322] text-white border border-slate-800 shadow-xl shadow-slate-950/20 relative overflow-hidden group">
        <!-- Resplandor esmeralda decorativo -->
        <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
        <div class="absolute top-0 right-0 w-24 h-24 bg-lime-400/10 rounded-full blur-xl pointer-events-none"></div>

        <div class="relative z-10 flex items-center justify-between mb-3">
          <span class="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Total Registrados
          </span>
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-lime-400 p-[1.5px] shadow-lg shadow-emerald-500/25">
            <div class="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Users class="w-5 h-5 text-emerald-400 stroke-[2.2]" />
            </div>
          </div>
        </div>

        <div class="relative z-10 text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
          {{ totalUsersCount }}
        </div>

        <div class="relative z-10 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mt-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Base de datos sincronizada</span>
        </div>
      </div>

      <!-- KPI 2: Proveedores Técnicos (Tarjeta Esmeralda & Lima) -->
      <div class="p-5 rounded-3xl bg-gradient-to-br from-emerald-50/70 via-white to-white border-2 border-emerald-500/30 shadow-lg shadow-emerald-500/10 hover:border-emerald-500/50 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-mono font-bold uppercase tracking-wider text-emerald-900">
            Proveedores Activos
          </span>
          <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform">
            <Briefcase class="w-5 h-5 stroke-[2.2]" />
          </div>
        </div>

        <div class="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight">
          {{ totalProvidersCount }}
        </div>

        <!-- Barra de progreso esmeralda / lima -->
        <div class="mt-2.5">
          <div class="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
            <span>Proporción del padrón:</span>
            <span class="font-bold text-emerald-700">{{ providerPercentage }}%</span>
          </div>
          <div class="h-1.5 w-full bg-emerald-100 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-emerald-500 to-lime-500 rounded-full transition-all duration-500"
              :style="{ width: `${providerPercentage}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- KPI 3: KYC Aprobados (Verde Institucional) -->
      <div class="p-5 rounded-3xl bg-gradient-to-br from-lime-50/70 via-white to-white border-2 border-lime-500/30 shadow-lg shadow-lime-500/10 hover:border-lime-500/50 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-mono font-bold uppercase tracking-wider text-lime-950">
            e-KYC Verificados
          </span>
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-lime-500 to-emerald-500 text-slate-950 flex items-center justify-center shadow-md shadow-lime-500/30 group-hover:scale-105 transition-transform font-bold">
            <ShieldCheck class="w-5 h-5 stroke-[2.2]" />
          </div>
        </div>

        <div class="text-3xl sm:text-4xl font-black text-emerald-800 font-mono tracking-tight">
          {{ verifiedKycCount }}
        </div>

        <p class="text-xs text-emerald-700 font-semibold mt-2 flex items-center gap-1">
          <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600" />
          <span>Identidad biométrica blindada</span>
        </p>
      </div>

      <!-- KPI 4: Auditorías Pendientes (Alerta Ámbar Cálido) -->
      <div class="p-5 rounded-3xl bg-gradient-to-br from-amber-50/80 via-white to-white border-2 border-amber-500/30 shadow-lg shadow-amber-500/10 hover:border-amber-500/50 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-mono font-bold uppercase tracking-wider text-amber-950">
            Alertas & Auditoría
          </span>
          <div class="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30 group-hover:scale-105 transition-transform">
            <AlertTriangle class="w-5 h-5 stroke-[2.2]" />
          </div>
        </div>

        <div class="text-3xl sm:text-4xl font-black text-amber-700 font-mono tracking-tight">
          {{ pendingKycCount }}
        </div>

        <p class="text-xs text-amber-800 font-semibold mt-2 flex items-center gap-1">
          <span class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
          <span>Casos por revisar por el auditor</span>
        </p>
      </div>

    </div>

    <!-- ============================================================== -->
    <!-- PANEL DE FILTROS PULIDO (TARJETA CON PROFUNDIDAD Y ACENTOS)    -->
    <!-- ============================================================== -->
    <div class="bg-white rounded-3xl border-2 border-slate-200/90 shadow-md shadow-slate-200/50 p-6 space-y-4">
      
      <!-- Fila 1: Buscador en tiempo real con acento esmeralda -->
      <div class="relative group">
        <span class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
          <Search class="w-5 h-5" />
        </span>
        <input
          v-model="filters.search"
          type="text"
          placeholder="Buscar por nombre, CI, correo electrónico, teléfono o especialidad técnica..."
          class="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-slate-200 bg-slate-50/70 text-slate-900 text-xs sm:text-sm placeholder-slate-400 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 transition duration-150"
        />
        <button 
          v-if="filters.search" 
          @click="filters.search = ''"
          class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
        >
          &times;
        </button>
      </div>

      <!-- Fila 2: Selectores en Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <!-- Rol -->
        <div>
          <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-600 font-mono mb-1">Rol</label>
          <select 
            v-model="filters.role" 
            class="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 bg-slate-50 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          >
            <option value="todos">Todos los Roles</option>
            <option value="Proveedor">Proveedores</option>
            <option value="Cliente">Clientes</option>
          </select>
        </div>

        <!-- Oficio / Especialidad -->
        <div>
          <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-600 font-mono mb-1">Oficio</label>
          <select 
            v-model="filters.trade" 
            class="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 bg-slate-50 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          >
            <option value="todos">Todos los Oficios</option>
            <option value="Instalaciones Eléctricas">Electricidad</option>
            <option value="Construcción & Albañilería">Construcción</option>
            <option value="Plomería & Sanitarios">Plomería</option>
            <option value="Cerrajería de Alta Seguridad">Cerrajería</option>
            <option value="Limpieza & Desinfección">Limpieza</option>
          </select>
        </div>

        <!-- Ciudad / Dpto. -->
        <div>
          <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-600 font-mono mb-1">Ciudad / Dpto.</label>
          <select 
            v-model="filters.department" 
            class="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 bg-slate-50 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          >
            <option value="todos">Todas las Ciudades</option>
            <option value="La Paz">La Paz</option>
            <option value="Santa Cruz">Santa Cruz</option>
            <option value="Cochabamba">Cochabamba</option>
            <option value="El Alto">El Alto</option>
            <option value="Oruro">Oruro</option>
          </select>
        </div>

        <!-- Zona de Cobertura -->
        <div>
          <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-600 font-mono mb-1">Zona Cobertura</label>
          <select 
            v-model="filters.zone" 
            class="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 bg-slate-50 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          >
            <option value="todas">Todas las Zonas</option>
            <option value="Zona Sur">Zona Sur (LP)</option>
            <option value="Sopocachi">Sopocachi (LP)</option>
            <option value="Miraflores">Miraflores (LP)</option>
            <option value="Equipetrol">Equipetrol (SCZ)</option>
            <option value="Urubó">Urubó (SCZ)</option>
            <option value="Cala Cala">Cala Cala (CBBA)</option>
            <option value="Ceja">Ceja (El Alto)</option>
          </select>
        </div>

        <!-- Estado KYC -->
        <div>
          <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-600 font-mono mb-1">Estado KYC</label>
          <select 
            v-model="filters.kyc" 
            class="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 bg-slate-50 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          >
            <option value="todos">Todos los Estados</option>
            <option value="Verificado">Verificado</option>
            <option value="Pendiente">Pendiente</option>
            <option value="No Verificado">No Verificado</option>
          </select>
        </div>

        <!-- Estado de Cuenta -->
        <div>
          <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-600 font-mono mb-1">Estado Cuenta</label>
          <select 
            v-model="filters.accountStatus" 
            class="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 bg-slate-50 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          >
            <option value="todos">Todos los Estados</option>
            <option value="Activo">Activo</option>
            <option value="En Revisión">En Revisión</option>
            <option value="Suspendido">Suspendido</option>
          </select>
        </div>
      </div>

      <!-- Fila 3: Chips de filtros aplicados y contador -->
      <div class="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs">
        <div class="flex flex-wrap items-center gap-1.5 font-mono">
          <span class="text-slate-400">Filtros:</span>
          
          <span v-if="filters.role !== 'todos'" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">
            Rol: {{ filters.role }}
            <button @click="filters.role = 'todos'" class="hover:text-rose-600">&times;</button>
          </span>

          <span v-if="filters.trade !== 'todos'" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">
            Oficio: {{ filters.trade }}
            <button @click="filters.trade = 'todos'" class="hover:text-rose-600">&times;</button>
          </span>

          <span v-if="filters.department !== 'todos'" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">
            Ciudad: {{ filters.department }}
            <button @click="filters.department = 'todos'" class="hover:text-rose-600">&times;</button>
          </span>

          <span v-if="filters.zone !== 'todas'" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">
            Zona: {{ filters.zone }}
            <button @click="filters.zone = 'todas'" class="hover:text-rose-600">&times;</button>
          </span>

          <span v-if="!hasActiveFilters" class="text-slate-400 italic">Ningún filtro activo (mostrando todo)</span>
        </div>

        <span class="font-mono text-slate-500 font-bold">
          {{ filteredUsers.length }} resultados encontrados
        </span>
      </div>

    </div>

    <!-- ============================================================== -->
    <!-- ============================================================== -->
    <!-- TABLA COMPACTA DE USUARIOS (INFORMACIÓN ESENCIAL CON ICONOS)   -->
    <!-- ============================================================== -->
    <div class="bg-white rounded-3xl border-2 border-slate-200/90 shadow-md shadow-slate-200/40 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-gradient-to-r from-slate-950 to-slate-900 text-white uppercase font-mono border-b border-slate-800">
              <th class="py-3.5 px-4 font-bold tracking-wider">Usuario</th>
              <th class="py-3.5 px-4 font-bold tracking-wider">Rol / Oficio</th>
              <th class="py-3.5 px-4 font-bold tracking-wider">Ciudad</th>
              <th class="py-3.5 px-4 font-bold tracking-wider">e-KYC</th>
              <th class="py-3.5 px-4 font-bold tracking-wider">Rating</th>
              <th class="py-3.5 px-4 font-bold tracking-wider">Estado</th>
              <th class="py-3.5 px-4 font-bold tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-medium">
            <tr 
              v-for="user in filteredUsers" 
              :key="user.id" 
              class="hover:bg-emerald-50/20 transition group"
            >
              <!-- 1. Identidad Esencial (Avatar, Nombre y CI) -->
              <td class="py-3 px-4">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-lime-400 p-[1px] shrink-0 shadow-2xs">
                    <div class="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center text-white font-bold text-[11px]">
                      {{ user.firstName.charAt(0) }}{{ user.lastNamePaternal.charAt(0) }}
                    </div>
                  </div>
                  <div>
                    <button 
                      @click="openQuickView(user)"
                      class="font-bold text-slate-900 hover:text-emerald-600 text-left transition cursor-pointer leading-tight block text-xs sm:text-sm"
                    >
                      {{ user.name }}
                    </button>
                    <span class="text-[10px] text-slate-400 font-mono">
                      CI: {{ user.ci }} {{ user.ciExpedition }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- 2. Rol / Oficio Conciso -->
              <td class="py-3 px-4">
                <span 
                  v-if="user.role === 'Proveedor'"
                  class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
                >
                  <Briefcase class="w-3 h-3 text-emerald-600" />
                  <span>{{ user.tradeCategory?.split(' ')[0] || user.profession?.split(' ')[0] || 'Proveedor' }}</span>
                </span>
                <span 
                  v-else
                  class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200"
                >
                  <User class="w-3 h-3 text-purple-600" />
                  <span>Cliente</span>
                </span>
              </td>

              <!-- 3. Ciudad Principal -->
              <td class="py-3 px-4">
                <div class="flex items-center gap-1 text-slate-700 font-semibold text-xs" :title="`Zonas: ${user.coverageZones.join(', ')}`">
                  <MapPin class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{{ user.department }}</span>
                </div>
              </td>

              <!-- 4. Estado KYC con Iconos Claros -->
              <td class="py-3 px-4">
                <span 
                  v-if="user.kycStatus === 'Verificado'"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800 border border-emerald-300"
                  title="Identidad Oficial Aprobada"
                >
                  <ShieldCheck class="w-3.5 h-3.5 text-emerald-700" />
                  <span>Verificado</span>
                </span>
                <span 
                  v-else-if="user.kycStatus === 'Pendiente'"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-amber-100 text-amber-800 border border-amber-300"
                  title="Documentación en Espera de Auditoría"
                >
                  <Clock class="w-3.5 h-3.5 text-amber-700" />
                  <span>Pendiente</span>
                </span>
                <span 
                  v-else
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-slate-100 text-slate-600 border border-slate-200"
                >
                  <AlertTriangle class="w-3.5 h-3.5 text-slate-400" />
                  <span>No Verif.</span>
                </span>
              </td>

              <!-- 5. Calificación (Rating Compacto) -->
              <td class="py-3 px-4">
                <div class="flex items-center gap-1 font-mono font-bold text-slate-800 text-xs">
                  <Star class="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{{ user.rating }}</span>
                </div>
              </td>

              <!-- 6. Estado de la Cuenta (Dot Indicador) -->
              <td class="py-3 px-4">
                <span class="inline-flex items-center gap-1.5 text-xs font-semibold">
                  <span 
                    class="w-2 h-2 rounded-full"
                    :class="{
                      'bg-emerald-500 ring-2 ring-emerald-200': user.accountStatus === 'Activo',
                      'bg-amber-500 ring-2 ring-amber-200': user.accountStatus === 'En Revisión',
                      'bg-rose-500 ring-2 ring-rose-200': user.accountStatus === 'Suspendido'
                    }"
                  ></span>
                  <span 
                    class="text-[11px]"
                    :class="{
                      'text-emerald-800': user.accountStatus === 'Activo',
                      'text-amber-800': user.accountStatus === 'En Revisión',
                      'text-rose-800': user.accountStatus === 'Suspendido'
                    }"
                  >
                    {{ user.accountStatus }}
                  </span>
                </span>
              </td>

              <!-- 7. Acciones Compactas -->
              <td class="py-3 px-4 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <!-- Botón Vista Rápida Modal -->
                  <button
                    @click="openQuickView(user)"
                    class="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition cursor-pointer border border-slate-200"
                    title="Resumen Rápido (Modal)"
                  >
                    <Eye class="w-3.5 h-3.5" />
                  </button>

                  <!-- Botón Ir a Pantalla Detallada -->
                  <router-link
                    :to="`/usuarios/${user.id}`"
                    class="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition"
                    title="Ver Ficha Completa"
                  >
                    <ArrowRight class="w-3.5 h-3.5" />
                  </router-link>
                </div>
              </td>
            </tr>

            <!-- Estado Vacío -->
            <tr v-if="filteredUsers.length === 0">
              <td colspan="7" class="py-12 text-center text-slate-400 text-xs">
                No se encontraron usuarios que coincidan con los filtros seleccionados.
                <button @click="resetFilters" class="block mx-auto mt-2 font-bold text-emerald-600 hover:underline">
                  Limpiar filtros
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- MODAL DE RESUMEN RÁPIDO (QUICK VIEW MODAL)                     -->
    <!-- ============================================================== -->
    <transition name="modal">
      <div 
        v-if="selectedUserModal" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
        @click.self="selectedUserModal = null"
      >
        <div class="bg-white rounded-3xl max-w-xl w-full border border-slate-200/90 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          <!-- Encabezado del Modal con Banner -->
          <div class="relative bg-gradient-to-br from-slate-950 via-slate-900 to-[#0e1726] text-white p-6">
            <button 
              @click="selectedUserModal = null"
              class="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
            >
              &times;
            </button>

            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-lime-400 p-[1.5px] shadow-lg shrink-0">
                <div class="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white font-black text-xl">
                  {{ selectedUserModal.firstName.charAt(0) }}{{ selectedUserModal.lastNamePaternal.charAt(0) }}
                </div>
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {{ selectedUserModal.role }}
                  </span>
                  <span class="text-xs font-mono text-slate-400">{{ selectedUserModal.id }}</span>
                </div>
                <h3 class="text-lg font-black text-white mt-0.5 truncate">{{ selectedUserModal.name }}</h3>
                <p class="text-xs text-slate-300 font-medium">{{ selectedUserModal.profession || 'Cliente Contratante' }}</p>
              </div>
            </div>
          </div>

          <!-- Cuerpo del Modal: Datos Resumidos -->
          <div class="p-6 space-y-5 text-xs">
            
            <!-- 4 Mini Estadísticas con estilo colorido -->
            <div class="grid grid-cols-4 gap-2.5 text-center">
              <div class="p-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/70">
                <span class="text-[10px] text-emerald-800 font-mono block">Calificación</span>
                <span class="font-black text-slate-900 text-sm mt-0.5 flex items-center justify-center gap-1">
                  <Star class="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {{ selectedUserModal.rating }}
                </span>
              </div>
              <div class="p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span class="text-[10px] text-slate-500 font-mono block">Contratos</span>
                <span class="font-black text-slate-900 text-sm mt-0.5 font-mono">{{ selectedUserModal.completedContracts }}</span>
              </div>
              <div class="p-2.5 rounded-2xl bg-lime-50/70 border border-lime-200/70">
                <span class="text-[10px] text-lime-800 font-mono block">Puntualidad</span>
                <span class="font-black text-emerald-700 text-sm mt-0.5 font-mono">{{ selectedUserModal.onTimeRate }}%</span>
              </div>
              <div class="p-2.5 rounded-2xl bg-blue-50/70 border border-blue-200/70">
                <span class="text-[10px] text-blue-800 font-mono block">En Escrow</span>
                <span class="font-black text-blue-900 text-sm mt-0.5 font-mono truncate" :title="selectedUserModal.escrowTotalAmount">
                  {{ selectedUserModal.escrowTotalAmount.split(' ')[1] }}
                </span>
              </div>
            </div>

            <!-- Datos de Contacto y Ubicación -->
            <div class="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-slate-500 font-medium">CI / Documento:</span>
                <span class="font-mono font-bold text-slate-900">{{ selectedUserModal.ci }} {{ selectedUserModal.ciExpedition }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-500 font-medium">Correo Electrónico:</span>
                <span class="font-mono text-slate-900 truncate max-w-[240px]">{{ selectedUserModal.email }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-500 font-medium">Teléfono / WhatsApp:</span>
                <span class="font-mono text-slate-900 font-bold">{{ selectedUserModal.phone }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-500 font-medium">Ciudad Principal:</span>
                <span class="text-slate-900 font-semibold">{{ selectedUserModal.department }}</span>
              </div>
            </div>

            <!-- Zonas de Cobertura -->
            <div>
              <span class="text-slate-600 font-bold block mb-1.5 uppercase font-mono text-[10px]">
                Zonas donde ofrece servicios:
              </span>
              <div class="flex flex-wrap gap-1.5">
                <span 
                  v-for="z in selectedUserModal.coverageZones" 
                  :key="z"
                  class="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[10px] font-semibold"
                >
                  {{ z }}
                </span>
              </div>
            </div>

            <!-- Breve Bio / Presentación -->
            <div v-if="selectedUserModal.bio">
              <span class="text-slate-600 font-bold block mb-1 uppercase font-mono text-[10px]">Presentación:</span>
              <p class="text-slate-700 text-xs italic leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                "{{ selectedUserModal.bio }}"
              </p>
            </div>
          </div>

          <!-- Pie del Modal: Botón a Pantalla Completa -->
          <div class="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <button
              @click="toggleAccountStatus(selectedUserModal)"
              class="px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
              :class="selectedUserModal.accountStatus === 'Activo' ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-700 hover:bg-emerald-50'"
            >
              {{ selectedUserModal.accountStatus === 'Activo' ? 'Suspender Operador' : 'Activar Operador' }}
            </button>

            <router-link
              :to="`/usuarios/${selectedUserModal.id}`"
              class="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 shadow-md shadow-emerald-600/25 transition flex items-center gap-2"
            >
              <span>Ver Historial, Estadísticas y Reseñas Completas</span>
              <ExternalLink class="w-3.5 h-3.5" />
            </router-link>
          </div>

        </div>
      </div>
    </transition>

  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { 
  Users, 
  Briefcase, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Search, 
  X, 
  MapPin, 
  Star, 
  Eye, 
  ExternalLink,
  Clock,
  ArrowRight,
  User
} from 'lucide-vue-next'
import { mockUsers, type UserItem } from '@/data/mockUsers'

// Estado de los Filtros
const filters = reactive({
  search: '',
  role: 'todos',
  trade: 'todos',
  department: 'todos',
  zone: 'todas',
  kyc: 'todos',
  accountStatus: 'todos'
})

// Modal de Resumen Rápido
const selectedUserModal = ref<UserItem | null>(null)

const openQuickView = (user: UserItem) => {
  selectedUserModal.value = user
}

// Métricas de Cabecera
const totalUsersCount = computed(() => mockUsers.length)
const totalProvidersCount = computed(() => mockUsers.filter(u => u.role === 'Proveedor').length)
const verifiedKycCount = computed(() => mockUsers.filter(u => u.kycStatus === 'Verificado').length)
const pendingKycCount = computed(() => mockUsers.filter(u => u.kycStatus === 'Pendiente').length)

const providerPercentage = computed(() => {
  if (totalUsersCount.value === 0) return 0
  return Math.round((totalProvidersCount.value / totalUsersCount.value) * 100)
})

// Comprobación de si hay filtros activos
const hasActiveFilters = computed(() => {
  return filters.search.trim() !== '' ||
    filters.role !== 'todos' ||
    filters.trade !== 'todos' ||
    filters.department !== 'todos' ||
    filters.zone !== 'todas' ||
    filters.kyc !== 'todos' ||
    filters.accountStatus !== 'todos'
})

const activeFiltersCount = computed(() => {
  let count = 0
  if (filters.search.trim()) count++
  if (filters.role !== 'todos') count++
  if (filters.trade !== 'todos') count++
  if (filters.department !== 'todos') count++
  if (filters.zone !== 'todas') count++
  if (filters.kyc !== 'todos') count++
  if (filters.accountStatus !== 'todos') count++
  return count
})

const resetFilters = () => {
  filters.search = ''
  filters.role = 'todos'
  filters.trade = 'todos'
  filters.department = 'todos'
  filters.zone = 'todas'
  filters.kyc = 'todos'
  filters.accountStatus = 'todos'
}

// Filtrado reactivo multidimensional
const filteredUsers = computed(() => {
  return mockUsers.filter(user => {
    // 1. Buscador texto
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase()
      const matchesSearch = 
        user.name.toLowerCase().includes(q) ||
        user.ci.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.phone.toLowerCase().includes(q) ||
        (user.profession && user.profession.toLowerCase().includes(q))
      
      if (!matchesSearch) return false
    }

    // 2. Rol
    if (filters.role !== 'todos' && user.role !== filters.role) {
      return false
    }

    // 3. Oficio / Especialidad
    if (filters.trade !== 'todos' && user.tradeCategory !== filters.trade) {
      return false
    }

    // 4. Departamento / Ciudad
    if (filters.department !== 'todos' && user.department !== filters.department) {
      return false
    }

    // 5. Zona de cobertura
    if (filters.zone !== 'todas') {
      const inZone = user.coverageZones.some(z => z.toLowerCase().includes(filters.zone.toLowerCase()))
      if (!inZone) return false
    }

    // 6. Estado KYC
    if (filters.kyc !== 'todos' && user.kycStatus !== filters.kyc) {
      return false
    }

    // 7. Estado de Cuenta
    if (filters.accountStatus !== 'todos' && user.accountStatus !== filters.accountStatus) {
      return false
    }

    return true
  })
})

const toggleAccountStatus = (user: UserItem) => {
  if (user.accountStatus === 'Activo') {
    user.accountStatus = 'Suspendido'
  } else {
    user.accountStatus = 'Activo'
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
