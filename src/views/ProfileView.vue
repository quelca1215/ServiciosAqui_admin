<template>
  <div class="space-y-6 max-w-7xl mx-auto selection:bg-[#84cc16] selection:text-[#052e16]">
    
    <!-- ====================================================================== -->
    <!-- ENCABEZADO DE LA VISTA: TÍTULO Y BADGE INSTITUCIONAL                   -->
    <!-- ====================================================================== -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-[#84cc16]/15 border border-[#84cc16]/30 text-[#15803d] mb-1.5">
          <Sparkles class="w-3.5 h-3.5 text-[#16a34a]" />
          Cuenta de Operador
        </div>
        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Mi Perfil Administrativo
        </h2>
        <p class="text-slate-500 text-xs sm:text-sm mt-0.5">
          Gestiona tu identidad, credenciales de acceso institucional y parámetros de seguridad.
        </p>
      </div>

      <!-- Badge de Estado en Vivo -->
      <div class="flex items-center gap-2 self-start sm:self-center">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-[#22c55e]/10 text-[#15803d] border border-[#22c55e]/30 shadow-2xs">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#84cc16] opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]"></span>
          </span>
          <span>Acceso Autorizado · SuperAdmin</span>
        </div>
      </div>
    </div>

    <!-- ====================================================================== -->
    <!-- ALERTA / TOAST DE RETROALIMENTACIÓN (SUCCESS / ERROR)                  -->
    <!-- ====================================================================== -->
    <transition name="fade">
      <div 
        v-if="feedbackMessage.text" 
        :class="[
          'p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-semibold border shadow-sm transition-all duration-300',
          feedbackMessage.type === 'success' 
            ? 'bg-emerald-50/90 border-[#22c55e]/30 text-emerald-900 shadow-[0_4px_20px_-4px_rgba(34,197,94,0.15)]' 
            : 'bg-rose-50/90 border-rose-200 text-rose-900 shadow-[0_4px_20px_-4px_rgba(244,63,94,0.15)]'
        ]"
      >
        <div class="flex items-center gap-3">
          <div 
            class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            :class="feedbackMessage.type === 'success' ? 'bg-[#22c55e]/20 text-[#15803d]' : 'bg-rose-100 text-rose-600'"
          >
            <CheckCircle2 v-if="feedbackMessage.type === 'success'" class="w-4 h-4 stroke-[2.4]" />
            <AlertCircle v-else class="w-4 h-4 stroke-[2.4]" />
          </div>
          <span>{{ feedbackMessage.text }}</span>
        </div>
        <button 
          @click="feedbackMessage.text = ''" 
          class="text-slate-400 hover:text-slate-700 font-bold ml-3 text-lg leading-none cursor-pointer"
          aria-label="Cerrar notificación"
        >
          &times;
        </button>
      </div>
    </transition>

    <!-- ====================================================================== -->
    <!-- LAYOUT PRINCIPAL: 2 COLUMNAS (4 COL IZQ / 8 COL DER)                   -->
    <!-- ====================================================================== -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      <!-- ==================================================================== -->
      <!-- COLUMNA IZQUIERDA: TARJETA DE IDENTIDAD & SEGURIDAD DE SESIÓN        -->
      <!-- ==================================================================== -->
      <div class="lg:col-span-4 space-y-6">
        
        <!-- Tarjeta de Perfil con Paleta Institucional -->
        <div class="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm text-center relative overflow-hidden">
          
          <!-- Cabecera decorativa en verde oscuro profundo de la marca -->
          <div class="absolute top-0 left-0 right-0 h-28 bg-gradient-to-br from-[#03140b] via-[#052e16] to-[#041e0f]">
            <div class="pointer-events-none absolute -top-8 -right-8 w-28 h-28 rounded-full bg-[#84cc16]/20 blur-xl"></div>
            <div class="pointer-events-none absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-[#22c55e]/20 blur-xl"></div>
          </div>

          <!-- Avatar con anillo gradiente y carga de imagen -->
          <div class="relative inline-block mt-10 mb-4">
            <div class="w-28 h-28 rounded-3xl p-1 bg-white shadow-xl mx-auto">
              <div class="w-full h-full rounded-[20px] overflow-hidden bg-gradient-to-tr from-[#052e16] to-[#03140b] flex items-center justify-center text-white font-black text-2xl relative group">
                <img 
                  v-if="profile.avatarUrl" 
                  :src="profile.avatarUrl" 
                  alt="Foto de Perfil" 
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-transparent bg-clip-text bg-gradient-to-r from-[#22c55e] to-[#84cc16] font-black text-3xl font-mono">
                  {{ userInitials }}
                </span>

                <!-- Overlay al pasar el cursor sobre la foto -->
                <label 
                  for="avatar-upload" 
                  class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 text-white text-[11px] font-semibold cursor-pointer transition-opacity duration-200 backdrop-blur-2xs"
                >
                  <Camera class="w-5 h-5 text-[#84cc16]" />
                  <span>Cambiar</span>
                </label>
              </div>
            </div>

            <!-- Botón flotante para subir foto -->
            <label
              for="avatar-upload"
              class="absolute bottom-1 right-1 p-2.5 rounded-xl bg-gradient-to-r from-[#22c55e] to-[#84cc16] text-[#052e16] shadow-md shadow-[#84cc16]/40 cursor-pointer transition transform hover:scale-105 active:scale-95"
              title="Subir fotografía"
            >
              <Camera class="w-4 h-4 stroke-[2.4]" />
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/png, image/jpeg, image/webp" 
                class="hidden" 
                @change="handleAvatarChange" 
              />
            </label>
          </div>

          <!-- Nombre y Rol del Operador -->
          <h3 class="text-lg font-black text-slate-900 leading-tight">
            {{ profile.fullName }}
          </h3>
          <div class="mt-1 flex items-center justify-center gap-1.5">
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#84cc16]/15 text-[#15803d] border border-[#84cc16]/30">
              <ShieldCheck class="w-3.5 h-3.5 text-[#16a34a]" />
              {{ profile.role }}
            </span>
          </div>

          <!-- Botón opcional para quitar foto -->
          <div v-if="profile.avatarUrl" class="mt-2.5">
            <button 
              type="button" 
              @click="removeAvatar"
              class="text-[11px] text-rose-500 hover:text-rose-700 font-semibold inline-flex items-center gap-1 cursor-pointer transition"
            >
              <Trash2 class="w-3 h-3" />
              Eliminar foto
            </button>
          </div>

          <!-- Detalles Rápidos del Operador -->
          <div class="mt-6 pt-5 border-t border-slate-100 text-left space-y-3 text-xs">
            <div class="flex items-center justify-between">
              <span class="text-slate-400 font-medium">Correo Electrónico</span>
              <span class="font-mono font-bold text-slate-800 truncate max-w-[170px]" :title="profile.email">
                {{ profile.email }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-400 font-medium">Nivel de Acceso</span>
              <span class="font-mono text-[#15803d] font-bold">Total / Backoffice</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-400 font-medium">Autenticación 2FA</span>
              <span class="inline-flex items-center gap-1 text-[#15803d] font-semibold text-[11px]">
                <KeyRound class="w-3 h-3 text-[#16a34a]" /> Activa
              </span>
            </div>
          </div>
        </div>

        <!-- Tarjeta de Estado del Sistema & Terminal Actual -->
        <div class="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-3">
          <div class="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider font-mono">
            <Laptop class="w-4 h-4 text-[#16a34a]" />
            <span>Terminal & Conexión API</span>
          </div>

          <div class="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse"></span>
                <span class="text-xs font-bold text-slate-800">Servidor Backend</span>
              </div>
              <span class="text-[10px] font-mono font-bold text-[#15803d] bg-emerald-100/70 px-1.5 py-0.5 rounded">
                HTTPS Online
              </span>
            </div>
            <p class="text-[11px] font-mono text-slate-500 break-all leading-tight">
              https://crmbol26.runasp.net/api
            </p>
          </div>

          <div class="space-y-2 pt-1 text-[11px] text-slate-500">
            <div class="flex items-center justify-between">
              <span>Token de Sesión:</span>
              <span class="font-mono font-bold text-slate-700">JWT (Bearer) Activo</span>
            </div>
            <div class="flex items-center justify-between">
              <span>Plataforma Detectada:</span>
              <span class="font-mono text-slate-700 font-semibold">{{ clientPlatform }}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- ==================================================================== -->
      <!-- COLUMNA DERECHA: PESTAÑAS (DATOS PERSONALES & SEGURIDAD)              -->
      <!-- ==================================================================== -->
      <div class="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        
        <!-- Pestañas de Navegación con Paleta Institucional -->
        <div class="border-b border-slate-200/80 bg-slate-50/70 px-6 pt-3 flex gap-4 text-xs font-bold">
          <button
            @click="activeTab = 'personal'"
            class="pb-3 px-2 border-b-2 flex items-center gap-2 transition cursor-pointer"
            :class="activeTab === 'personal' ? 'border-[#84cc16] text-[#15803d]' : 'border-transparent text-slate-500 hover:text-slate-800'"
          >
            <User class="w-4 h-4" />
            <span>Datos Personales</span>
          </button>

          <button
            @click="activeTab = 'security'"
            class="pb-3 px-2 border-b-2 flex items-center gap-2 transition cursor-pointer"
            :class="activeTab === 'security' ? 'border-[#84cc16] text-[#15803d]' : 'border-transparent text-slate-500 hover:text-slate-800'"
          >
            <Lock class="w-4 h-4" />
            <span>Seguridad & Contraseña</span>
          </button>
        </div>

        <!-- ================================================================== -->
        <!-- PESTAÑA 1: DATOS PERSONALES DEL OPERADOR                           -->
        <!-- ================================================================== -->
        <div v-show="activeTab === 'personal'" class="p-6 sm:p-8">
          <div class="mb-6">
            <h3 class="text-base font-bold text-slate-900 tracking-tight">
              Información del Operador
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Datos vinculados a tu cuenta de operador administrativo y firma de acciones.
            </p>
          </div>

          <form @submit.prevent="savePersonalData" class="space-y-5" novalidate>
            
            <!-- Nombre Completo -->
            <div>
              <label for="full-name" class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Nombre Completo <span class="text-rose-500">*</span>
              </label>
              <div class="relative group">
                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#16a34a] transition-colors">
                  <User class="w-4 h-4" />
                </span>
                <input
                  id="full-name"
                  v-model="profile.fullName"
                  type="text"
                  required
                  placeholder="Ej. Juan Pérez"
                  class="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm font-medium rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 focus:bg-white focus:border-[#84cc16] focus:ring-4 focus:ring-[#84cc16]/20 outline-none transition-all duration-200"
                />
              </div>
            </div>

            <!-- Correo y Teléfono -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Correo -->
              <div>
                <label for="email" class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Correo Electrónico <span class="text-rose-500">*</span>
                </label>
                <div class="relative group">
                  <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#16a34a] transition-colors">
                    <Mail class="w-4 h-4" />
                  </span>
                  <input
                    id="email"
                    v-model="profile.email"
                    type="email"
                    required
                    placeholder="operador@serviciosaqui.bo"
                    class="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm font-mono rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 focus:bg-white focus:border-[#84cc16] focus:ring-4 focus:ring-[#84cc16]/20 outline-none transition-all duration-200"
                  />
                </div>
              </div>

              <!-- Teléfono -->
              <div>
                <label for="phone" class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Teléfono / WhatsApp de Contacto
                </label>
                <div class="relative group">
                  <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#16a34a] transition-colors">
                    <Smartphone class="w-4 h-4" />
                  </span>
                  <input
                    id="phone"
                    v-model="profile.phone"
                    type="tel"
                    placeholder="+591 76543210"
                    class="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm font-mono rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 focus:bg-white focus:border-[#84cc16] focus:ring-4 focus:ring-[#84cc16]/20 outline-none transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            <!-- Rol de la Cuenta (Informativo Protegido) -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Rol Administrativo
              </label>
              <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <ShieldCheck class="w-4 h-4 text-[#16a34a]" />
                  <span class="text-xs font-bold text-slate-800">{{ profile.role }}</span>
                  <span class="text-[10px] text-slate-400">(Privilegios de gestión de usuarios, pagos y KYC)</span>
                </div>
                <span class="text-[10px] font-mono text-slate-400 font-bold uppercase">Solo SuperAdmin</span>
              </div>
            </div>

            <!-- Botón Guardar Cambios con Gradiente Institucional -->
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                :disabled="isSavingPersonal"
                class="group px-6 py-3 rounded-xl font-black text-xs text-[#052e16] bg-gradient-to-r from-[#22c55e] to-[#84cc16] shadow-[0_8px_20px_-6px_#84cc16] hover:shadow-[0_12px_28px_-4px_#84cc16] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
              >
                <span v-if="isSavingPersonal" class="w-3.5 h-3.5 border-2 border-[#052e16] border-t-transparent rounded-full animate-spin"></span>
                <Save v-else class="w-4 h-4" />
                <span>{{ isSavingPersonal ? 'Guardando...' : 'Guardar Información' }}</span>
              </button>
            </div>

          </form>
        </div>

        <!-- ================================================================== -->
        <!-- PESTAÑA 2: SEGURIDAD Y CAMBIO DE CONTRASEÑA                        -->
        <!-- ================================================================== -->
        <div v-show="activeTab === 'security'" class="p-6 sm:p-8">
          <div class="mb-6">
            <h3 class="text-base font-bold text-slate-900 tracking-tight">
              Actualizar Contraseña de Acceso
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Tu contraseña debe cumplir con los requisitos de robustez institucional para proteger tu consola.
            </p>
          </div>

          <form @submit.prevent="updatePassword" class="space-y-5" novalidate>
            
            <!-- Contraseña Actual -->
            <div>
              <label for="current-pwd" class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Contraseña Actual <span class="text-rose-500">*</span>
              </label>
              <div class="relative group">
                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#16a34a] transition-colors">
                  <Lock class="w-4 h-4" />
                </span>
                <input
                  id="current-pwd"
                  v-model="securityForm.currentPassword"
                  :type="showCurrentPassword ? 'text' : 'password'"
                  required
                  placeholder="••••••••••••"
                  class="w-full pl-10 pr-11 py-2.5 sm:py-3 text-sm font-medium rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 focus:bg-white focus:border-[#84cc16] focus:ring-4 focus:ring-[#84cc16]/20 outline-none transition-all duration-200"
                />
                <button
                  type="button"
                  @click="showCurrentPassword = !showCurrentPassword"
                  class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#16a34a] cursor-pointer"
                  :aria-label="showCurrentPassword ? 'Ocultar contraseña' : 'Ver contraseña'"
                >
                  <EyeOff v-if="showCurrentPassword" class="w-4 h-4" />
                  <Eye v-else class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Nueva Contraseña -->
            <div>
              <label for="new-pwd" class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Nueva Contraseña <span class="text-rose-500">*</span>
              </label>
              <div class="relative group">
                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#16a34a] transition-colors">
                  <KeyRound class="w-4 h-4" />
                </span>
                <input
                  id="new-pwd"
                  v-model="securityForm.newPassword"
                  :type="showNewPassword ? 'text' : 'password'"
                  required
                  placeholder="••••••••••••"
                  class="w-full pl-10 pr-11 py-2.5 sm:py-3 text-sm font-medium rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 focus:bg-white focus:border-[#84cc16] focus:ring-4 focus:ring-[#84cc16]/20 outline-none transition-all duration-200"
                />
                <button
                  type="button"
                  @click="showNewPassword = !showNewPassword"
                  class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#16a34a] cursor-pointer"
                  :aria-label="showNewPassword ? 'Ocultar contraseña' : 'Ver contraseña'"
                >
                  <EyeOff v-if="showNewPassword" class="w-4 h-4" />
                  <Eye v-else class="w-4 h-4" />
                </button>
              </div>

              <!-- Indicador de Fuerza de Contraseña con paleta de marca -->
              <div v-if="securityForm.newPassword" class="mt-2.5 space-y-1.5">
                <div class="flex items-center justify-between text-[11px] font-mono">
                  <span class="text-slate-500">Nivel de seguridad:</span>
                  <span :class="['font-bold', passwordStrengthColor]">{{ passwordStrengthLabel }}</span>
                </div>
                <div class="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                  <div 
                    class="h-full rounded-full transition-all duration-300"
                    :class="[passwordStrengthBarClass]"
                    :style="{ width: `${passwordStrengthPercent}%` }"
                  ></div>
                </div>
              </div>

              <!-- Lista interactiva de requisitos de seguridad -->
              <div class="mt-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div class="flex items-center gap-1.5" :class="hasMinLength ? 'text-emerald-700 font-bold' : 'text-slate-400'">
                  <CheckCircle2 class="w-3.5 h-3.5 shrink-0" :class="hasMinLength ? 'text-[#16a34a]' : 'text-slate-300'" />
                  <span>Mínimo 8 caracteres</span>
                </div>
                <div class="flex items-center gap-1.5" :class="hasUpperAndLower ? 'text-emerald-700 font-bold' : 'text-slate-400'">
                  <CheckCircle2 class="w-3.5 h-3.5 shrink-0" :class="hasUpperAndLower ? 'text-[#16a34a]' : 'text-slate-300'" />
                  <span>Mayúscula y minúscula</span>
                </div>
                <div class="flex items-center gap-1.5" :class="hasNumber ? 'text-emerald-700 font-bold' : 'text-slate-400'">
                  <CheckCircle2 class="w-3.5 h-3.5 shrink-0" :class="hasNumber ? 'text-[#16a34a]' : 'text-slate-300'" />
                  <span>Al menos un número</span>
                </div>
                <div class="flex items-center gap-1.5" :class="hasSpecialChar ? 'text-emerald-700 font-bold' : 'text-slate-400'">
                  <CheckCircle2 class="w-3.5 h-3.5 shrink-0" :class="hasSpecialChar ? 'text-[#16a34a]' : 'text-slate-300'" />
                  <span>Carácter especial (@, $, !, etc.)</span>
                </div>
              </div>
            </div>

            <!-- Confirmar Nueva Contraseña -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label for="confirm-pwd" class="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Confirmar Nueva Contraseña <span class="text-rose-500">*</span>
                </label>
                <span v-if="passwordsMatch" class="text-[11px] font-semibold text-[#16a34a] flex items-center gap-1">
                  <CheckCircle2 class="w-3.5 h-3.5" /> Coinciden
                </span>
              </div>
              <div class="relative group">
                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#16a34a] transition-colors">
                  <Lock class="w-4 h-4" />
                </span>
                <input
                  id="confirm-pwd"
                  v-model="securityForm.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  required
                  placeholder="••••••••••••"
                  class="w-full pl-10 pr-11 py-2.5 sm:py-3 text-sm font-medium rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 focus:bg-white focus:border-[#84cc16] focus:ring-4 focus:ring-[#84cc16]/20 outline-none transition-all duration-200"
                  :class="{ 'border-rose-300 bg-rose-50/20': securityForm.confirmPassword && !passwordsMatch }"
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#16a34a] cursor-pointer"
                  :aria-label="showConfirmPassword ? 'Ocultar contraseña' : 'Ver contraseña'"
                >
                  <EyeOff v-if="showConfirmPassword" class="w-4 h-4" />
                  <Eye v-else class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Botón Actualizar Contraseña -->
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                :disabled="isUpdatingPassword || !isPasswordValid"
                class="group px-6 py-3 rounded-xl font-black text-xs text-[#052e16] bg-gradient-to-r from-[#22c55e] to-[#84cc16] shadow-[0_8px_20px_-6px_#84cc16] hover:shadow-[0_12px_28px_-4px_#84cc16] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
              >
                <span v-if="isUpdatingPassword" class="w-3.5 h-3.5 border-2 border-[#052e16] border-t-transparent rounded-full animate-spin"></span>
                <KeyRound v-else class="w-4 h-4" />
                <span>{{ isUpdatingPassword ? 'Actualizando contraseña...' : 'Actualizar Contraseña' }}</span>
              </button>
            </div>

          </form>
        </div>

      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { 
  User, 
  Mail, 
  Lock, 
  KeyRound, 
  Camera, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Smartphone, 
  Laptop, 
  Save, 
  Eye, 
  EyeOff,
  Sparkles
} from 'lucide-vue-next'
import { authService } from '@/api'
import { useUserStore } from '@/store'

const activeTab = ref<'personal' | 'security'>('personal')
const userStore = useUserStore()

// ----------------------------------------------------------------------
// Datos del Perfil (Cargados dinámicamente desde Pinia store)
// ----------------------------------------------------------------------
const profile = reactive({
  avatarUrl: userStore.currentUser?.avatar || '',
  fullName: userStore.currentUser?.nombreCompleto || '',
  email: userStore.currentUser?.email || '',
  phone: userStore.currentUser?.phone || '',
  role: userStore.currentUser?.rol || ''
})

onMounted(() => {
  const current = userStore.currentUser
  if (current) {
    if (current.nombreCompleto) profile.fullName = current.nombreCompleto
    if (current.email) profile.email = current.email
    if (current.rol) profile.role = current.rol
    if (current.phone) profile.phone = current.phone
    if (current.avatar) profile.avatarUrl = current.avatar
  }
})

// ----------------------------------------------------------------------
// Iniciales del Usuario
// ----------------------------------------------------------------------
const userInitials = computed(() => {
  const name = profile.fullName.trim()
  const parts = name.split(/\s+/)
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase() || '--'
})

// Detección del cliente
const clientPlatform = computed(() => {
  if (typeof navigator !== 'undefined') {
    return navigator.userAgent.includes('Linux') 
      ? 'Linux Desktop' 
      : navigator.userAgent.includes('Mac') 
        ? 'macOS' 
        : navigator.userAgent.includes('Windows') 
          ? 'Windows' 
          : 'Navegador Web'
  }
  return 'Navegador Web'
})

// ----------------------------------------------------------------------
// Seguridad / Formulario de Cambio de Contraseña
// ----------------------------------------------------------------------
const securityForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const isSavingPersonal = ref(false)
const isUpdatingPassword = ref(false)

const feedbackMessage = reactive({
  text: '',
  type: 'success' as 'success' | 'error'
})

// ----------------------------------------------------------------------
// Subida y eliminación de foto de avatar
// ----------------------------------------------------------------------
const handleAvatarChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    
    if (file.size > 2 * 1024 * 1024) {
      feedbackMessage.text = 'La fotografía no debe superar los 2MB de peso.'
      feedbackMessage.type = 'error'
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      profile.avatarUrl = e.target?.result as string
      // Guardar también en la sesión y en el store
      userStore.updateUser({ avatar: profile.avatarUrl })
      feedbackMessage.text = 'Fotografía de perfil actualizada con éxito.'
      feedbackMessage.type = 'success'
    }
    reader.readAsDataURL(file)
  }
}

const removeAvatar = () => {
  profile.avatarUrl = ''
  userStore.updateUser({ avatar: '' })
  feedbackMessage.text = 'Se ha eliminado la fotografía de perfil.'
  feedbackMessage.type = 'success'
}

// ----------------------------------------------------------------------
// Validación de Requisitos de Contraseña
// ----------------------------------------------------------------------
const hasMinLength = computed(() => securityForm.newPassword.length >= 8)
const hasUpperAndLower = computed(() => /[a-z]/.test(securityForm.newPassword) && /[A-Z]/.test(securityForm.newPassword))
const hasNumber = computed(() => /\d/.test(securityForm.newPassword))
const hasSpecialChar = computed(() => /[@$!%*?&#^._-]/.test(securityForm.newPassword))

const passwordsMatch = computed(() => {
  return securityForm.newPassword.length > 0 && securityForm.newPassword === securityForm.confirmPassword
})

const isPasswordValid = computed(() => {
  return hasMinLength.value && hasUpperAndLower.value && hasNumber.value && hasSpecialChar.value && passwordsMatch.value
})

const passwordStrength = computed(() => {
  let score = 0
  if (hasMinLength.value) score += 25
  if (hasUpperAndLower.value) score += 25
  if (hasNumber.value) score += 25
  if (hasSpecialChar.value) score += 25
  return score
})

const passwordStrengthPercent = computed(() => passwordStrength.value)

const passwordStrengthLabel = computed(() => {
  if (passwordStrength.value <= 25) return 'Muy Débil'
  if (passwordStrength.value <= 50) return 'Regular'
  if (passwordStrength.value <= 75) return 'Buena'
  return 'Excelente (Robusta)'
})

const passwordStrengthColor = computed(() => {
  if (passwordStrength.value <= 25) return 'text-rose-600'
  if (passwordStrength.value <= 50) return 'text-amber-600'
  if (passwordStrength.value <= 75) return 'text-blue-600'
  return 'text-[#16a34a]'
})

const passwordStrengthBarClass = computed(() => {
  if (passwordStrength.value <= 25) return 'bg-rose-500'
  if (passwordStrength.value <= 50) return 'bg-amber-500'
  if (passwordStrength.value <= 75) return 'bg-blue-500'
  return 'bg-gradient-to-r from-[#22c55e] to-[#84cc16]'
})

// ----------------------------------------------------------------------
// Guardar Datos Personales
// ----------------------------------------------------------------------
const savePersonalData = () => {
  isSavingPersonal.value = true

  setTimeout(() => {
    isSavingPersonal.value = false
    userStore.updateUser({
      nombreCompleto: profile.fullName,
      email: profile.email,
      phone: profile.phone
    })
    feedbackMessage.text = 'Tus datos han sido actualizados correctamente en la consola.'
    feedbackMessage.type = 'success'
  }, 700)
}

// ----------------------------------------------------------------------
// Actualizar Contraseña en el Backend
// ----------------------------------------------------------------------
const updatePassword = async () => {
  if (!isPasswordValid.value) {
    feedbackMessage.text = 'La contraseña no cumple los requisitos mínimos de seguridad o no coincide.'
    feedbackMessage.type = 'error'
    return
  }

  isUpdatingPassword.value = true

  try {
    const response = await authService.changePassword({
      oldPassword: securityForm.currentPassword,
      newPassword: securityForm.newPassword,
      confirmNewPassword: securityForm.confirmPassword
    })

    securityForm.currentPassword = ''
    securityForm.newPassword = ''
    securityForm.confirmPassword = ''
    feedbackMessage.text = response?.message || '¡Contraseña actualizada exitosamente en el servidor!'
    feedbackMessage.type = 'success'
  } catch (error: any) {
    feedbackMessage.text = error.message || 'Error al cambiar la contraseña en el servidor. Verifica tu contraseña actual.'
    feedbackMessage.type = 'error'
  } finally {
    isUpdatingPassword.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
