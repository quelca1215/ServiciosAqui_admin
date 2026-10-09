<template>
  <div class="space-y-6">
    
    <!-- Encabezado de la Sección -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Mi Perfil Administrativo</h2>
        <p class="text-slate-500 text-sm mt-0.5">
          Gestiona tu identidad de operador, información personal verificada y credenciales de seguridad.
        </p>
      </div>

      <!-- Badge de Estado de Cuenta -->
      <div class="flex items-center gap-2">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Operador Verificado • Acceso Nivel 1</span>
        </div>
      </div>
    </div>

    <!-- Banner de Notificación / Alerta Global -->
    <transition name="fade">
      <div 
        v-if="feedbackMessage.text" 
        :class="[
          'p-4 rounded-2xl flex items-center justify-between text-xs font-medium border shadow-xs',
          feedbackMessage.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
        ]"
      >
        <div class="flex items-center gap-2.5">
          <CheckCircle2 v-if="feedbackMessage.type === 'success'" class="w-4 h-4 text-emerald-600 shrink-0" />
          <AlertCircle v-else class="w-4 h-4 text-rose-600 shrink-0" />
          <span>{{ feedbackMessage.text }}</span>
        </div>
        <button 
          @click="feedbackMessage.text = ''" 
          class="text-slate-400 hover:text-slate-600 font-bold ml-2 text-sm leading-none cursor-pointer"
        >
          &times;
        </button>
      </div>
    </transition>

    <!-- Layout Principal: 2 Columnas -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      <!-- ============================================== -->
      <!-- COLUMNA IZQUIERDA: RESUMEN DE IDENTIDAD (4 col) -->
      <!-- ============================================== -->
      <div class="lg:col-span-4 space-y-6">
        
        <!-- Tarjeta de Foto y Resumen del Operador -->
        <div class="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs text-center relative overflow-hidden">
          <!-- Brillo decorativo superior -->
          <div class="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-900 opacity-90"></div>

          <!-- Avatar con selector de foto -->
          <div class="relative inline-block mt-8 mb-4">
            <div class="w-28 h-28 rounded-2xl p-1 bg-white shadow-xl mx-auto">
              <!-- Vista previa de foto o Avatar generado -->
              <div class="w-full h-full rounded-[14px] overflow-hidden bg-gradient-to-tr from-slate-900 to-[#0e1726] flex items-center justify-center text-white font-black text-2xl relative group">
                <img 
                  v-if="profile.avatarUrl" 
                  :src="profile.avatarUrl" 
                  alt="Foto de Perfil" 
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-transparent bg-clip-text bg-gradient-to-tr from-emerald-400 to-lime-300">
                  {{ userInitials }}
                </span>

                <!-- Overlay al hacer hover sobre la foto -->
                <label 
                  for="avatar-upload" 
                  class="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 text-white text-[11px] font-medium cursor-pointer transition-opacity duration-150 backdrop-blur-2xs"
                >
                  <Camera class="w-5 h-5 text-emerald-400" />
                  <span>Cambiar</span>
                </label>
              </div>
            </div>

            <!-- Botón flotante para subir foto -->
            <label
              for="avatar-upload"
              class="absolute bottom-1 right-1 p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 cursor-pointer transition transform hover:scale-105"
              title="Subir nueva fotografía"
            >
              <Camera class="w-4 h-4" />
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/png, image/jpeg, image/webp" 
                class="hidden" 
                @change="handleAvatarChange" 
              />
            </label>
          </div>

          <!-- Nombres y Rol -->
          <h3 class="text-lg font-black text-slate-900 leading-tight">
            {{ fullName }}
          </h3>
          <p class="text-xs font-mono text-emerald-600 font-semibold mt-1 flex items-center justify-center gap-1">
            <ShieldCheck class="w-3.5 h-3.5" />
            Super Administrador
          </p>
          <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-600 mt-2">
            ID Operador: #ADM-0042
          </span>

          <!-- Acciones de Foto -->
          <div v-if="profile.avatarUrl" class="mt-3">
            <button 
              type="button" 
              @click="removeAvatar"
              class="text-[11px] text-rose-500 hover:text-rose-700 font-medium inline-flex items-center gap-1 cursor-pointer transition"
            >
              <Trash2 class="w-3 h-3" />
              Eliminar fotografía
            </button>
          </div>

          <!-- Datos de acceso institucional -->
          <div class="mt-6 pt-5 border-t border-slate-100 text-left space-y-3 text-xs">
            <div class="flex items-center justify-between">
              <span class="text-slate-400 font-medium">Cédula de Identidad</span>
              <span class="font-mono font-bold text-slate-800">{{ profile.ci }} {{ profile.ciExpedition }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-400 font-medium">Correo Institucional</span>
              <span class="font-mono text-slate-700 truncate max-w-[180px]">{{ profile.email }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-400 font-medium">Estado de Verificación</span>
              <span class="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 class="w-3.5 h-3.5" /> Verificado
              </span>
            </div>
          </div>
        </div>

        <!-- Tarjeta de Seguridad & Sesión Actual -->
        <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div class="flex items-center gap-2.5 mb-3 text-slate-900 font-bold text-xs uppercase tracking-wider font-mono">
            <Laptop class="w-4 h-4 text-emerald-600" />
            <span>Terminal y Sesión Actual</span>
          </div>

          <div class="space-y-2.5 text-xs">
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p class="font-bold text-slate-800">Linux x86_64 • Google Chrome</p>
                <p class="text-[11px] text-slate-400 font-mono mt-0.5">IP: 190.181.42.12 (La Paz, BO)</p>
              </div>
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Sesión activa"></span>
            </div>

            <div class="flex items-center justify-between text-slate-500 text-[11px] pt-1">
              <span>Último cambio de clave:</span>
              <span class="font-mono text-slate-700 font-semibold">Hace 28 días</span>
            </div>
            <div class="flex items-center justify-between text-slate-500 text-[11px]">
              <span>Autenticación 2FA:</span>
              <span class="font-semibold text-emerald-600">Activo (Authy / TOTP)</span>
            </div>
          </div>
        </div>

      </div>

      <!-- ============================================== -->
      <!-- COLUMNA DERECHA: PESTAÑAS Y FORMULARIOS (8 col) -->
      <!-- ============================================== -->
      <div class="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        
        <!-- Pestañas de Navegación del Perfil -->
        <div class="border-b border-slate-200/80 bg-slate-50/60 px-6 pt-3 flex gap-4 text-xs font-bold">
          <button
            @click="activeTab = 'personal'"
            class="pb-3 px-1 border-b-2 flex items-center gap-2 transition cursor-pointer"
            :class="activeTab === 'personal' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'"
          >
            <User class="w-4 h-4" />
            <span>Información Personal</span>
          </button>

          <button
            @click="activeTab = 'security'"
            class="pb-3 px-1 border-b-2 flex items-center gap-2 transition cursor-pointer"
            :class="activeTab === 'security' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'"
          >
            <Lock class="w-4 h-4" />
            <span>Seguridad y Contraseña</span>
          </button>
        </div>

        <!-- CONTENIDO PESTAÑA 1: DATOS PERSONALES -->
        <div v-show="activeTab === 'personal'" class="p-6 sm:p-8">
          <div class="mb-6">
            <h3 class="text-base font-bold text-slate-900 tracking-tight">Datos de Identidad del Operador</h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Esta información está vinculada a tus registros de auditoría y firmas de contratos.
            </p>
          </div>

          <form @submit.prevent="savePersonalData" class="space-y-5">
            <!-- Fila: Nombres -->
            <div>
              <label for="first-name" class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Nombres <span class="text-rose-500">*</span>
              </label>
              <div class="relative">
                <input
                  id="first-name"
                  v-model="profile.firstName"
                  type="text"
                  required
                  placeholder="Ej. Gabriel"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <!-- Fila: Apellidos (Paterno y Materno) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="last-name-pat" class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Apellido Paterno <span class="text-rose-500">*</span>
                </label>
                <input
                  id="last-name-pat"
                  v-model="profile.lastNamePaternal"
                  type="text"
                  required
                  placeholder="Ej. Flores"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label for="last-name-mat" class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Apellido Materno <span class="text-slate-400 font-normal">(Opcional)</span>
                </label>
                <input
                  id="last-name-mat"
                  v-model="profile.lastNameMaternal"
                  type="text"
                  placeholder="Ej. Quispe"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <!-- Fila: CI y Expedición -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="sm:col-span-2">
                <label for="ci-number" class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Cédula de Identidad (CI) <span class="text-rose-500">*</span>
                </label>
                <input
                  id="ci-number"
                  v-model="profile.ci"
                  type="text"
                  required
                  placeholder="Ej. 6849201"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-mono focus:outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label for="ci-exp" class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Expedido <span class="text-rose-500">*</span>
                </label>
                <select
                  id="ci-exp"
                  v-model="profile.ciExpedition"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-semibold bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 transition"
                >
                  <option value="LP">LP - La Paz</option>
                  <option value="SC">SC - Santa Cruz</option>
                  <option value="CB">CB - Cochabamba</option>
                  <option value="OR">OR - Oruro</option>
                  <option value="PT">PT - Potosí</option>
                  <option value="TJ">TJ - Tarija</option>
                  <option value="CH">CH - Chuquisaca</option>
                  <option value="BE">BE - Beni</option>
                  <option value="PA">PA - Pando</option>
                </select>
              </div>
            </div>

            <!-- Fila: Correo y Teléfono -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="email" class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Correo Electrónico Institucional <span class="text-rose-500">*</span>
                </label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail class="w-4 h-4" />
                  </span>
                  <input
                    id="email"
                    v-model="profile.email"
                    type="email"
                    required
                    placeholder="gabriel@admin.serviciosaqui.bo"
                    class="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-mono focus:outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div>
                <label for="phone" class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Teléfono / WhatsApp Corporativo
                </label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Smartphone class="w-4 h-4" />
                  </span>
                  <input
                    id="phone"
                    v-model="profile.phone"
                    type="tel"
                    placeholder="+591 76543210"
                    class="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-mono focus:outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 transition"
                  />
                </div>
              </div>
            </div>

            <!-- Botón Guardar Cambios -->
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="submit"
                :disabled="isSavingPersonal"
                class="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 shadow-md shadow-emerald-600/25 transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                <span v-if="isSavingPersonal" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <Save v-else class="w-4 h-4" />
                <span>{{ isSavingPersonal ? 'Guardando...' : 'Guardar Información' }}</span>
              </button>
            </div>
          </form>
        </div>

        <!-- CONTENIDO PESTAÑA 2: SEGURIDAD Y CAMBIO DE CONTRASEÑA -->
        <div v-show="activeTab === 'security'" class="p-6 sm:p-8">
          <div class="mb-6">
            <h3 class="text-base font-bold text-slate-900 tracking-tight">Actualizar Contraseña de Acceso</h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Por protocolo institucional, tu clave debe cumplir con los requisitos de robustez criptográfica.
            </p>
          </div>

          <form @submit.prevent="updatePassword" class="space-y-5">
            
            <!-- Contraseña Actual -->
            <div>
              <label for="current-pwd" class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Contraseña Actual <span class="text-rose-500">*</span>
              </label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock class="w-4 h-4" />
                </span>
                <input
                  id="current-pwd"
                  v-model="securityForm.currentPassword"
                  :type="showCurrentPassword ? 'text' : 'password'"
                  required
                  placeholder="Ingresa tu contraseña actual"
                  class="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 transition"
                />
                <button
                  type="button"
                  @click="showCurrentPassword = !showCurrentPassword"
                  class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
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
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound class="w-4 h-4" />
                </span>
                <input
                  id="new-pwd"
                  v-model="securityForm.newPassword"
                  :type="showNewPassword ? 'text' : 'password'"
                  required
                  placeholder="Nueva contraseña segura"
                  class="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 transition"
                />
                <button
                  type="button"
                  @click="showNewPassword = !showNewPassword"
                  class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <EyeOff v-if="showNewPassword" class="w-4 h-4" />
                  <Eye v-else class="w-4 h-4" />
                </button>
              </div>

              <!-- Indicador de Fuerza de Contraseña -->
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

              <!-- Lista de verificación de requisitos de seguridad -->
              <div class="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div class="flex items-center gap-1.5" :class="hasMinLength ? 'text-emerald-700' : 'text-slate-400'">
                  <CheckCircle2 class="w-3.5 h-3.5 shrink-0" :class="hasMinLength ? 'text-emerald-500' : 'text-slate-300'" />
                  <span>Mínimo 8 caracteres</span>
                </div>
                <div class="flex items-center gap-1.5" :class="hasUpperAndLower ? 'text-emerald-700' : 'text-slate-400'">
                  <CheckCircle2 class="w-3.5 h-3.5 shrink-0" :class="hasUpperAndLower ? 'text-emerald-500' : 'text-slate-300'" />
                  <span>Mayúscula y minúscula</span>
                </div>
                <div class="flex items-center gap-1.5" :class="hasNumber ? 'text-emerald-700' : 'text-slate-400'">
                  <CheckCircle2 class="w-3.5 h-3.5 shrink-0" :class="hasNumber ? 'text-emerald-500' : 'text-slate-300'" />
                  <span>Al menos un número</span>
                </div>
                <div class="flex items-center gap-1.5" :class="hasSpecialChar ? 'text-emerald-700' : 'text-slate-400'">
                  <CheckCircle2 class="w-3.5 h-3.5 shrink-0" :class="hasSpecialChar ? 'text-emerald-500' : 'text-slate-300'" />
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
                <span v-if="passwordsMatch" class="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 class="w-3 h-3" /> Las contraseñas coinciden
                </span>
              </div>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock class="w-4 h-4" />
                </span>
                <input
                  id="confirm-pwd"
                  v-model="securityForm.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  required
                  placeholder="Repite la nueva contraseña"
                  class="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 transition"
                  :class="{ 'border-rose-300 bg-rose-50/20': securityForm.confirmPassword && !passwordsMatch }"
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <EyeOff v-if="showConfirmPassword" class="w-4 h-4" />
                  <Eye v-else class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Botón Actualizar Contraseña -->
            <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="submit"
                :disabled="isUpdatingPassword || !isPasswordValid"
                class="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-slate-900 hover:bg-slate-800 shadow-md shadow-slate-900/20 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
              >
                <span v-if="isUpdatingPassword" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <KeyRound v-else class="w-4 h-4 text-emerald-400" />
                <span>{{ isUpdatingPassword ? 'Actualizando llaves...' : 'Actualizar Contraseña' }}</span>
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
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
  EyeOff 
} from 'lucide-vue-next'

const activeTab = ref<'personal' | 'security'>('personal')

// Estado del Perfil
const profile = reactive({
  avatarUrl: '',
  firstName: 'Gabriel',
  lastNamePaternal: 'Flores',
  lastNameMaternal: 'Quispe',
  ci: '6849201',
  ciExpedition: 'LP',
  email: 'gabriel@admin.serviciosaqui.bo',
  phone: '+591 76543210'
})

// Estado de Seguridad / Cambio de Clave
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

// Nombre completo e iniciales
const fullName = computed(() => {
  return `${profile.firstName} ${profile.lastNamePaternal} ${profile.lastNameMaternal}`.trim()
})

const userInitials = computed(() => {
  const f = profile.firstName ? profile.firstName.charAt(0) : 'G'
  const l = profile.lastNamePaternal ? profile.lastNamePaternal.charAt(0) : 'A'
  return `${f}${l}`.toUpperCase()
})

// Subida de fotografía con vista previa en memoria
const handleAvatarChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    
    if (file.size > 2 * 1024 * 1024) {
      feedbackMessage.text = 'La imagen supera el límite permitido de 2MB.'
      feedbackMessage.type = 'error'
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      profile.avatarUrl = e.target?.result as string
      feedbackMessage.text = 'Fotografía actualizada correctamente.'
      feedbackMessage.type = 'success'
    }
    reader.readAsDataURL(file)
  }
}

const removeAvatar = () => {
  profile.avatarUrl = ''
  feedbackMessage.text = 'Se ha eliminado la fotografía de perfil.'
  feedbackMessage.type = 'success'
}

// Validación de Requisitos de Contraseña
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

// Medidor de fuerza de contraseña
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
  return 'Excelente (Segura)'
})

const passwordStrengthColor = computed(() => {
  if (passwordStrength.value <= 25) return 'text-rose-600'
  if (passwordStrength.value <= 50) return 'text-amber-600'
  if (passwordStrength.value <= 75) return 'text-blue-600'
  return 'text-emerald-600'
})

const passwordStrengthBarClass = computed(() => {
  if (passwordStrength.value <= 25) return 'bg-rose-500'
  if (passwordStrength.value <= 50) return 'bg-amber-500'
  if (passwordStrength.value <= 75) return 'bg-blue-500'
  return 'bg-emerald-500'
})

// Acciones de Guardado
const savePersonalData = () => {
  isSavingPersonal.value = true
  setTimeout(() => {
    isSavingPersonal.value = false
    feedbackMessage.text = 'Tus datos personales han sido actualizados con éxito en el sistema.'
    feedbackMessage.type = 'success'
  }, 900)
}

const updatePassword = () => {
  if (!isPasswordValid.value) {
    feedbackMessage.text = 'La contraseña no cumple con todos los requisitos de seguridad o no coincide.'
    feedbackMessage.type = 'error'
    return
  }

  isUpdatingPassword.value = true
  setTimeout(() => {
    isUpdatingPassword.value = false
    securityForm.currentPassword = ''
    securityForm.newPassword = ''
    securityForm.confirmPassword = ''
    feedbackMessage.text = 'Contraseña maestra actualizada correctamente. Tus sesiones activas se han renovado.'
    feedbackMessage.type = 'success'
  }, 1100)
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

