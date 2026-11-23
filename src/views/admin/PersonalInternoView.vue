<template>
  <div class="space-y-6">
    <PageHeader
      tag="Personal Interno · Usuarios del Sistema"
      title="Personal Interno"
      description="Visualización y administración del personal interno organizado por departamento, rol y estado de acceso."
    >
      <template #actions>
        <button
          type="button"
          :disabled="isLoading"
          @click="cargarDatos"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold bg-white text-slate-700 border-2 border-slate-200 hover:border-emerald-500/40 hover:text-emerald-800 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-2xs"
        >
          <RefreshCw :class="['w-3.5 h-3.5', { 'animate-spin': isLoading }]" />
          <span>{{ isLoading ? 'Actualizando...' : 'Actualizar' }}</span>
        </button>

        <button
          v-if="puedeCrear"
          type="button"
          @click="abrirModalCrear"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 shadow-md shadow-emerald-600/25 transition cursor-pointer"
        >
          <UserPlus class="w-4 h-4" />
          <span>Nuevo Personal</span>
        </button>
      </template>
    </PageHeader>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Personal"
        :value="displayMetric(usuarios.length)"
        subtext="Operadores registrados en sistema"
        :icon="Users"
        variant="dark"
        :pulse-dot="true"
      />

      <StatCard
        label="Personal Activo"
        :value="displayMetric(activosCount)"
        :icon="UserCheck"
        variant="emerald"
        :progress="porcentajeActivos"
        progress-label="Tasa activos:"
      />

      <StatCard
        label="Departamentos"
        :value="displayMetric(departamentosUnicos.length)"
        subtext="Áreas con personal registrado"
        :icon="Building2"
        variant="blue"
      />

      <StatCard
        label="Inactivos"
        :value="displayMetric(inactivosCount)"
        subtext="Accesos deshabilitados"
        :icon="UserX"
        variant="amber"
        :pulse-dot="inactivosCount > 0"
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
            Error al cargar personal interno
          </p>
          <p class="text-sm font-medium text-rose-900">{{ errorMessage }}</p>
        </div>
      </div>

      <button
        type="button"
        :disabled="isLoading"
        @click="cargarDatos"
        class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer shrink-0 self-start sm:self-auto disabled:opacity-60"
      >
        Reintentar
      </button>
    </div>

    <div class="bg-white rounded-3xl border-2 border-slate-200/90 shadow-md shadow-slate-200/50 p-5 space-y-4">
      <div class="flex flex-col lg:flex-row lg:items-center gap-3">
        <div class="relative flex-1 group">
          <span
            class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors"
          >
            <Search class="w-4 h-4" />
          </span>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Buscar por nombre completo, usuario, correo electrónico o departamento..."
            class="w-full pl-11 pr-9 py-2.5 rounded-2xl border-2 border-slate-200 bg-slate-50/70 text-slate-900 text-xs sm:text-sm placeholder-slate-400 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 transition duration-150"
          />
          <button
            v-if="filters.search"
            type="button"
            @click="filters.search = ''"
            class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <div class="inline-flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200 self-start lg:self-auto shrink-0">
          <button
            type="button"
            @click="viewMode = 'departamentos'"
            :class="[
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer',
              viewMode === 'departamentos'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900',
            ]"
          >
            <LayoutGrid class="w-3.5 h-3.5" />
            <span>Por Departamento</span>
          </button>
          <button
            type="button"
            @click="viewMode = 'tabla'"
            :class="[
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer',
              viewMode === 'tabla'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900',
            ]"
          >
            <List class="w-3.5 h-3.5" />
            <span>Tabla</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
        <div>
          <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-600 font-mono mb-1">
            Departamento
          </label>
          <select
            v-model="filters.departamento"
            class="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 bg-slate-50 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          >
            <option value="todos">Todos los Departamentos</option>
            <option v-for="dep in departamentosUnicos" :key="dep" :value="dep">
              {{ dep }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-600 font-mono mb-1">
            Rol del Sistema
          </label>
          <select
            v-model="filters.rol"
            class="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 bg-slate-50 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          >
            <option value="todos">Todos los Roles</option>
            <option v-for="rol in rolesEnLista" :key="rol" :value="rol">
              {{ rol }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-600 font-mono mb-1">
            Estado de Acceso
          </label>
          <select
            v-model="filters.estado"
            class="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 bg-slate-50 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          >
            <option value="todos">Todos los Estados</option>
            <option value="activos">Solo Activos</option>
            <option value="inactivos">Solo Inactivos</option>
          </select>
        </div>

        <div class="flex items-center justify-between sm:justify-end gap-2">
          <span class="text-[11px] font-mono text-slate-500">
            Mostrando <strong class="text-slate-900">{{ filteredUsers.length }}</strong> de {{ usuarios.length }}
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
      <p class="text-sm font-bold text-slate-800">Cargando personal interno...</p>
      <p class="text-xs text-slate-500 mt-1">Consultando registros agrupados por departamento.</p>
    </div>

    <div
      v-else-if="filteredUsers.length === 0"
      class="bg-white rounded-3xl border-2 border-slate-200/90 p-12 text-center shadow-sm"
    >
      <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
        <Users class="w-6 h-6" />
      </div>
      <p class="text-sm font-bold text-slate-800">
        {{
          usuarios.length === 0
            ? 'No existen usuarios internos registrados aún'
            : 'No hay personal que coincida con los filtros aplicados'
        }}
      </p>
      <p class="text-xs text-slate-500 mt-1">
        {{
          usuarios.length === 0
            ? 'Crea un nuevo miembro del personal interno para asignarlo a un departamento.'
            : 'Ajusta el buscador o limpia los filtros activos.'
        }}
      </p>
      <button
        v-if="hasActiveFilters"
        type="button"
        @click="resetFilters"
        class="mt-4 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs hover:bg-emerald-100 transition cursor-pointer"
      >
        Limpiar filtros
      </button>
    </div>

    <div v-else-if="viewMode === 'departamentos'" class="space-y-5">
      <div
        v-for="(grupo, idx) in usuariosPorDepartamento"
        :key="grupo.departamento"
        class="rounded-3xl bg-white border-2 border-slate-200/90 shadow-md shadow-slate-200/40 overflow-hidden"
      >
        <button
          type="button"
          @click="toggleDepartmentCollapse(grupo.departamento)"
          :class="[
            'w-full px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 text-left transition cursor-pointer',
            getDepartmentStyle(idx).headerBg,
          ]"
        >
          <div class="flex items-center gap-3.5 min-w-0">
            <div
              :class="[
                'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm',
                getDepartmentStyle(idx).iconBox,
              ]"
            >
              <Building2 class="w-5 h-5 stroke-[2.2]" />
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="text-base font-black text-slate-900 truncate">
                  {{ grupo.departamento }}
                </h3>
                <span
                  :class="[
                    'px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold',
                    getDepartmentStyle(idx).countBadge,
                  ]"
                >
                  {{ grupo.miembros.length }} {{ grupo.miembros.length === 1 ? 'miembro' : 'miembros' }}
                </span>
              </div>
              <p class="text-[11px] text-slate-500 font-medium mt-0.5">
                Área / Departamento operativo
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <span class="px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
              {{ grupo.activos }} activos
            </span>
            <span
              v-if="grupo.inactivos > 0"
              class="px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200/80"
            >
              {{ grupo.inactivos }} inactivos
            </span>
            <ChevronDown
              :class="[
                'w-4 h-4 text-slate-500 transition-transform duration-200 ml-1',
                collapsedDepartments[grupo.departamento] ? '-rotate-90' : 'rotate-0',
              ]"
            />
          </div>
        </button>

        <div
          v-show="!collapsedDepartments[grupo.departamento]"
          class="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 bg-slate-50/40"
        >
          <div
            v-for="user in grupo.miembros"
            :key="user.id"
            :class="[
              'p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between gap-4 bg-white',
              user.estado
                ? 'border-slate-200/90 hover:border-emerald-400/60 hover:shadow-md'
                : 'border-slate-200/70 opacity-85 hover:opacity-100',
            ]"
          >
            <div class="space-y-3">
              <div class="flex items-start justify-between gap-2.5">
                <div class="flex items-center gap-3 min-w-0">
                  <div
                    v-if="user.estado"
                    class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-lime-400 p-[1.5px] shadow-sm shadow-emerald-500/20 shrink-0"
                  >
                    <div
                      class="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-xs font-black text-emerald-400"
                    >
                      {{ getIniciales(user.nombreCompleto || user.nombreUsuario, 'PI') }}
                    </div>
                  </div>
                  <div
                    v-else
                    class="w-11 h-11 rounded-2xl bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-black shrink-0"
                  >
                    {{ getIniciales(user.nombreCompleto || user.nombreUsuario, 'PI') }}
                  </div>

                  <div class="min-w-0">
                    <h4 class="text-sm font-black text-slate-900 truncate leading-snug">
                      {{ user.nombreCompleto || user.nombreUsuario }}
                    </h4>
                    <p class="text-[11px] font-mono text-slate-500 truncate">
                      @{{ user.nombreUsuario }}
                    </p>
                  </div>
                </div>

                <span
                  :class="[
                    'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold shrink-0',
                    user.estado
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200',
                  ]"
                >
                  <span
                    :class="[
                      'w-1.5 h-1.5 rounded-full',
                      user.estado ? 'bg-emerald-500' : 'bg-rose-500',
                    ]"
                  ></span>
                  {{ user.estado ? 'Activo' : 'Inactivo' }}
                </span>
              </div>

              <div class="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div class="flex items-center gap-2 min-w-0">
                  <Mail class="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span class="truncate">{{ user.email }}</span>
                </div>
                <div class="flex items-center justify-between gap-2 pt-0.5">
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-mono text-[11px] font-bold">
                    <Shield class="w-3 h-3 text-emerald-600" />
                    {{ user.rol }}
                  </span>
                  <span class="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400">
                    <Calendar class="w-3 h-3" />
                    {{ formatFecha(user.fechaRegistro) }}
                  </span>
                </div>
              </div>
            </div>

            <div v-if="puedeEditar" class="pt-2 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                :disabled="togglingUserId === user.id"
                @click="solicitarCambioEstado(user)"
                :class="[
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer disabled:opacity-50',
                  user.estado
                    ? 'border-rose-200 bg-rose-50/70 text-rose-700 hover:bg-rose-100'
                    : 'border-emerald-200 bg-emerald-50/70 text-emerald-800 hover:bg-emerald-100',
                ]"
              >
                <Power class="w-3.5 h-3.5" />
                <span>{{ user.estado ? 'Desactivar acceso' : 'Activar acceso' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="bg-white rounded-3xl border-2 border-slate-200/90 shadow-md shadow-slate-200/40 overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
              <th class="py-3.5 px-4 font-bold">Personal</th>
              <th class="py-3.5 px-4 font-bold">Correo</th>
              <th class="py-3.5 px-4 font-bold">Departamento</th>
              <th class="py-3.5 px-4 font-bold">Rol</th>
              <th class="py-3.5 px-4 font-bold">Registro</th>
              <th class="py-3.5 px-4 font-bold">Estado</th>
              <th v-if="puedeEditar" class="py-3.5 px-4 font-bold text-right">Acción</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              class="hover:bg-slate-50/80 transition"
            >
              <td class="py-3.5 px-4">
                <div class="flex items-center gap-2.5">
                  <div
                    :class="[
                      'w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-black shrink-0',
                      user.estado ? 'bg-slate-900 text-emerald-400' : 'bg-slate-200 text-slate-500',
                    ]"
                  >
                    {{ getIniciales(user.nombreCompleto || user.nombreUsuario, 'PI') }}
                  </div>
                  <div>
                    <p class="font-bold text-slate-900">
                      {{ user.nombreCompleto || user.nombreUsuario }}
                    </p>
                    <p class="text-[11px] font-mono text-slate-500">@{{ user.nombreUsuario }}</p>
                  </div>
                </div>
              </td>
              <td class="py-3.5 px-4 text-slate-700">{{ user.email }}</td>
              <td class="py-3.5 px-4">
                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 font-semibold text-[11px]">
                  <Building2 class="w-3 h-3 text-blue-600" />
                  {{ user.areaDepartamento || 'Sin Departamento Asignado' }}
                </span>
              </td>
              <td class="py-3.5 px-4 font-mono font-bold text-slate-800">{{ user.rol }}</td>
              <td class="py-3.5 px-4 font-mono text-slate-500">
                {{ formatFecha(user.fechaRegistro) }}
              </td>
              <td class="py-3.5 px-4">
                <span
                  :class="[
                    'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold',
                    user.estado
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200',
                  ]"
                >
                  {{ user.estado ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td v-if="puedeEditar" class="py-3.5 px-4 text-right">
                <button
                  type="button"
                  :disabled="togglingUserId === user.id"
                  @click="solicitarCambioEstado(user)"
                  :class="[
                    'px-3 py-1.5 rounded-xl text-[11px] font-bold border transition cursor-pointer disabled:opacity-50',
                    user.estado
                      ? 'border-rose-200 text-rose-700 hover:bg-rose-50'
                      : 'border-emerald-200 text-emerald-800 hover:bg-emerald-50',
                  ]"
                >
                  {{ user.estado ? 'Desactivar' : 'Activar' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <transition name="modal-fade">
      <div
        v-if="isCreateModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs"
        @click.self="cerrarModalCrear"
      >
        <div
          class="relative w-full max-w-xl bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden text-slate-800"
          role="dialog"
          aria-modal="true"
        >
          <div class="bg-gradient-to-br from-slate-950 via-slate-900 to-[#0e1726] text-white p-6 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-lime-400 p-[1.5px]">
                <div class="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <UserPlus class="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div>
                <h3 class="text-lg font-black leading-tight">Registrar Personal Interno</h3>
                <p class="text-xs text-slate-300">Asignación de cuenta, rol y departamento operativo.</p>
              </div>
            </div>
            <button
              type="button"
              :disabled="isCreating"
              @click="cerrarModalCrear"
              class="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer disabled:opacity-40"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <form @submit.prevent="guardarNuevoPersonal" class="p-6 space-y-4">
            <div
              v-if="createError"
              class="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 flex items-center gap-2"
            >
              <AlertCircle class="w-4 h-4 text-rose-600 shrink-0" />
              <span>{{ createError }}</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="block text-[10px] font-mono font-bold uppercase text-slate-600 mb-1">
                  Nombres <span class="text-rose-500">*</span>
                </label>
                <input
                  v-model.trim="createForm.nombres"
                  type="text"
                  required
                  maxlength="100"
                  :disabled="isCreating"
                  placeholder="Ej. Carlos"
                  class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label class="block text-[10px] font-mono font-bold uppercase text-slate-600 mb-1">
                  Apellido Paterno
                </label>
                <input
                  v-model.trim="createForm.apellidoPaterno"
                  type="text"
                  maxlength="100"
                  :disabled="isCreating"
                  placeholder="Ej. Mendoza"
                  class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label class="block text-[10px] font-mono font-bold uppercase text-slate-600 mb-1">
                  Apellido Materno
                </label>
                <input
                  v-model.trim="createForm.apellidoMaterno"
                  type="text"
                  maxlength="100"
                  :disabled="isCreating"
                  placeholder="Ej. Quispe"
                  class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-mono font-bold uppercase text-slate-600 mb-1">
                  Nombre de Usuario <span class="text-rose-500">*</span>
                </label>
                <input
                  v-model.trim="createForm.nombreUsuario"
                  type="text"
                  required
                  maxlength="100"
                  :disabled="isCreating"
                  placeholder="Ej. cmendoza"
                  class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label class="block text-[10px] font-mono font-bold uppercase text-slate-600 mb-1">
                  Correo Electrónico <span class="text-rose-500">*</span>
                </label>
                <input
                  v-model.trim="createForm.email"
                  type="email"
                  required
                  maxlength="256"
                  :disabled="isCreating"
                  placeholder="carlos@serviciosaqui.bo"
                  class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-mono font-bold uppercase text-slate-600 mb-1">
                  Departamento / Área <span class="text-rose-500">*</span>
                </label>
                <input
                  v-model.trim="createForm.areaDepartamento"
                  type="text"
                  required
                  maxlength="100"
                  :disabled="isCreating"
                  list="departamentos-sugeridos"
                  placeholder="Ej. Operaciones, Finanzas, Soporte..."
                  class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <datalist id="departamentos-sugeridos">
                  <option v-for="dep in departamentosUnicos" :key="dep" :value="dep" />
                </datalist>
              </div>
              <div>
                <label class="block text-[10px] font-mono font-bold uppercase text-slate-600 mb-1">
                  Rol <span class="text-rose-500">*</span>
                </label>
                <select
                  v-if="rolesDisponibles.length > 0"
                  v-model="createForm.rol"
                  required
                  :disabled="isCreating"
                  class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="" disabled>Selecciona un rol...</option>
                  <option v-for="r in rolesDisponibles" :key="r.id || r.nombre" :value="r.nombre">
                    {{ r.nombre }}
                  </option>
                </select>
                <input
                  v-else
                  v-model.trim="createForm.rol"
                  type="text"
                  required
                  :disabled="isCreating"
                  placeholder="Ej. Administrador, Operador..."
                  class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-mono font-bold uppercase text-slate-600 mb-1">
                Contraseña Inicial (mínimo 8 caracteres) <span class="text-rose-500">*</span>
              </label>
              <div class="relative">
                <KeyRound class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  v-model="createForm.password"
                  type="password"
                  required
                  minlength="8"
                  maxlength="50"
                  :disabled="isCreating"
                  placeholder="••••••••"
                  class="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                :disabled="isCreating"
                @click="cerrarModalCrear"
                class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="isCreating"
                class="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-sm cursor-pointer disabled:opacity-60"
              >
                {{ isCreating ? 'Registrando...' : 'Crear Personal' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <ConfirmModal
      :is-open="confirmModal.isOpen"
      :loading="Boolean(togglingUserId)"
      :title="confirmModal.targetEstado ? 'Activar acceso de personal' : 'Desactivar acceso de personal'"
      :subtitle="confirmModal.user?.areaDepartamento || 'Sin Departamento Asignado'"
      :message="
        confirmModal.targetEstado
          ? `¿Confirmas habilitar el acceso al sistema para ${confirmModal.user?.nombreCompleto || confirmModal.user?.nombreUsuario}?`
          : `¿Confirmas desactivar el acceso al sistema para ${confirmModal.user?.nombreCompleto || confirmModal.user?.nombreUsuario}?`
      "
      :danger="!confirmModal.targetEstado"
      :confirm-text="confirmModal.targetEstado ? 'Activar acceso' : 'Desactivar acceso'"
      @confirm="confirmarCambioEstado"
      @cancel="confirmModal.isOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import {
  Users,
  UserCheck,
  Building2,
  UserX,
  Search,
  RefreshCw,
  UserPlus,
  LayoutGrid,
  List,
  Mail,
  Shield,
  Calendar,
  ChevronDown,
  Power,
  AlertCircle,
  X,
  KeyRound,
} from 'lucide-vue-next'
import { PageHeader, StatCard, ConfirmModal } from '@/components/common'
import {
  adminService,
  type CrearUsuarioInternoPayload,
  type RolDto,
  type UsuarioInternoDto,
} from '@/api'
import { formatFecha, getIniciales } from '@/utils/format'
import { usePermissions } from '@/composables/usePermissions'
import { useToast } from '@/composables/useToast'

interface DepartmentStyle {
  headerBg: string
  iconBox: string
  countBadge: string
}

const DEPARTMENT_PALETTE: DepartmentStyle[] = [
  {
    headerBg: 'bg-gradient-to-r from-emerald-50/70 via-white to-white',
    iconBox: 'bg-emerald-600 text-white shadow-emerald-600/25',
    countBadge: 'bg-emerald-100 text-emerald-900',
  },
  {
    headerBg: 'bg-gradient-to-r from-blue-50/70 via-white to-white',
    iconBox: 'bg-blue-600 text-white shadow-blue-600/25',
    countBadge: 'bg-blue-100 text-blue-900',
  },
  {
    headerBg: 'bg-gradient-to-r from-indigo-50/70 via-white to-white',
    iconBox: 'bg-indigo-600 text-white shadow-indigo-600/25',
    countBadge: 'bg-indigo-100 text-indigo-900',
  },
  {
    headerBg: 'bg-gradient-to-r from-teal-50/70 via-white to-white',
    iconBox: 'bg-teal-600 text-white shadow-teal-600/25',
    countBadge: 'bg-teal-100 text-teal-900',
  },
  {
    headerBg: 'bg-gradient-to-r from-purple-50/70 via-white to-white',
    iconBox: 'bg-purple-600 text-white shadow-purple-600/25',
    countBadge: 'bg-purple-100 text-purple-900',
  },
  {
    headerBg: 'bg-gradient-to-r from-lime-50/70 via-white to-white',
    iconBox: 'bg-lime-600 text-white shadow-lime-600/25',
    countBadge: 'bg-lime-100 text-lime-950',
  },
]

const { puedeCrear, puedeEditar } = usePermissions()
const toast = useToast()

const usuarios = ref<UsuarioInternoDto[]>([])
const rolesDisponibles = ref<RolDto[]>([])
const isLoading = ref(false)
const hasLoaded = ref(false)
const errorMessage = ref<string | null>(null)
const togglingUserId = ref<string | null>(null)
const viewMode = ref<'departamentos' | 'tabla'>('departamentos')
const collapsedDepartments = ref<Record<string, boolean>>({})

const filters = reactive({
  search: '',
  departamento: 'todos',
  rol: 'todos',
  estado: 'todos',
})

const isCreateModalOpen = ref(false)
const isCreating = ref(false)
const createError = ref<string | null>(null)
const createForm = reactive<CrearUsuarioInternoPayload>({
  nombres: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  nombreUsuario: '',
  email: '',
  password: '',
  rol: '',
  areaDepartamento: '',
})

const confirmModal = reactive<{
  isOpen: boolean
  user: UsuarioInternoDto | null
  targetEstado: boolean
}>({
  isOpen: false,
  user: null,
  targetEstado: false,
})

const activosCount = computed(() => usuarios.value.filter((u) => u.estado).length)
const inactivosCount = computed(() => usuarios.value.filter((u) => !u.estado).length)

const porcentajeActivos = computed(() => {
  if (usuarios.value.length === 0) return 0
  return Math.round((activosCount.value / usuarios.value.length) * 100)
})

const departamentosUnicos = computed(() => {
  const set = new Set<string>()
  for (const u of usuarios.value) {
    set.add(normalizeDepartmentName(u.areaDepartamento))
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'es'))
})

const rolesEnLista = computed(() => {
  const set = new Set<string>()
  for (const u of usuarios.value) {
    if (u.rol?.trim()) set.add(u.rol.trim())
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'es'))
})

const hasActiveFilters = computed(
  () =>
    filters.search.trim() !== '' ||
    filters.departamento !== 'todos' ||
    filters.rol !== 'todos' ||
    filters.estado !== 'todos'
)

const filteredUsers = computed(() => {
  const q = filters.search.trim().toLowerCase()

  return usuarios.value.filter((u) => {
    const dep = normalizeDepartmentName(u.areaDepartamento)
    if (filters.departamento !== 'todos' && dep !== filters.departamento) return false
    if (filters.rol !== 'todos' && u.rol !== filters.rol) return false
    if (filters.estado === 'activos' && !u.estado) return false
    if (filters.estado === 'inactivos' && u.estado) return false

    if (q) {
      const hayMatch =
        u.nombreCompleto.toLowerCase().includes(q) ||
        u.nombreUsuario.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        dep.toLowerCase().includes(q) ||
        u.rol.toLowerCase().includes(q)
      if (!hayMatch) return false
    }

    return true
  })
})

const usuariosPorDepartamento = computed(() => {
  const map = new Map<string, UsuarioInternoDto[]>()

  for (const user of filteredUsers.value) {
    const dep = normalizeDepartmentName(user.areaDepartamento)
    const list = map.get(dep)
    if (list) {
      list.push(user)
    } else {
      map.set(dep, [user])
    }
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b, 'es'))
    .map(([departamento, miembros]) => ({
      departamento,
      miembros,
      activos: miembros.filter((m) => m.estado).length,
      inactivos: miembros.filter((m) => !m.estado).length,
    }))
})

function normalizeDepartmentName(area?: string | null): string {
  const trimmed = area?.trim()
  return trimmed && trimmed.length > 0 ? trimmed : 'Sin Departamento Asignado'
}

function getDepartmentStyle(index: number): DepartmentStyle {
  return DEPARTMENT_PALETTE[index % DEPARTMENT_PALETTE.length]!
}

function displayMetric(value: number): number | string {
  return isLoading.value && !hasLoaded.value ? '...' : value
}

function toggleDepartmentCollapse(dep: string) {
  collapsedDepartments.value[dep] = !collapsedDepartments.value[dep]
}

function resetFilters() {
  filters.search = ''
  filters.departamento = 'todos'
  filters.rol = 'todos'
  filters.estado = 'todos'
}

async function cargarDatos() {
  if (isLoading.value) return
  isLoading.value = true
  errorMessage.value = null

  try {
    const [lista, roles] = await Promise.all([
      adminService.obtenerUsuariosSistema({ omitir: 0, limite: 100 }),
      adminService.obtenerRoles().catch(() => [] as RolDto[]),
    ])
    usuarios.value = lista
    if (roles.length > 0) rolesDisponibles.value = roles
    hasLoaded.value = true
  } catch (err: any) {
    errorMessage.value =
      err?.message || 'No se pudo obtener el personal interno desde la API.'
  } finally {
    isLoading.value = false
  }
}

function abrirModalCrear() {
  createError.value = null
  createForm.nombres = ''
  createForm.apellidoPaterno = ''
  createForm.apellidoMaterno = ''
  createForm.nombreUsuario = ''
  createForm.email = ''
  createForm.password = ''
  createForm.rol = rolesDisponibles.value[0]?.nombre || ''
  createForm.areaDepartamento = ''
  isCreateModalOpen.value = true
}

function cerrarModalCrear() {
  if (isCreating.value) return
  isCreateModalOpen.value = false
}

async function guardarNuevoPersonal() {
  if (isCreating.value) return
  createError.value = null

  if (createForm.password.length < 8) {
    createError.value = 'La contraseña debe tener al menos 8 caracteres.'
    return
  }

  isCreating.value = true
  try {
    await adminService.crearUsuarioSistema({
      nombres: createForm.nombres,
      apellidoPaterno: createForm.apellidoPaterno || null,
      apellidoMaterno: createForm.apellidoMaterno || null,
      nombreUsuario: createForm.nombreUsuario,
      email: createForm.email,
      password: createForm.password,
      rol: createForm.rol,
      areaDepartamento: createForm.areaDepartamento,
    })
    isCreateModalOpen.value = false
    toast.success('Personal interno registrado correctamente.')
    await cargarDatos()
  } catch (err: any) {
    createError.value =
      err?.message || 'No se pudo registrar el nuevo usuario interno.'
  } finally {
    isCreating.value = false
  }
}

function solicitarCambioEstado(user: UsuarioInternoDto) {
  confirmModal.user = user
  confirmModal.targetEstado = !user.estado
  confirmModal.isOpen = true
}

async function confirmarCambioEstado() {
  const user = confirmModal.user
  if (!user) return

  const nextEstado = confirmModal.targetEstado
  togglingUserId.value = user.id

  try {
    const actualizado = await adminService.cambiarEstadoUsuarioSistema(user.id, nextEstado)
    const idx = usuarios.value.findIndex((u) => u.id === user.id)
    if (idx !== -1) {
      usuarios.value[idx] = actualizado.id ? actualizado : { ...user, estado: nextEstado }
    }
    confirmModal.isOpen = false
    toast.success(nextEstado ? 'Acceso activado correctamente.' : 'Acceso desactivado.')
  } catch (err: any) {
    toast.error(err?.message || 'No se pudo actualizar el estado del usuario interno.')
  } finally {
    togglingUserId.value = null
  }
}

onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
