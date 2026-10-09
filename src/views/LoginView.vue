<template>
  <div class="h-screen w-full flex flex-col lg:flex-row bg-[#f8fafc] text-slate-800 selection:bg-emerald-500 selection:text-white overflow-y-auto lg:overflow-hidden">
    
    <!-- COLUMNA 1 (50%): PANEL INSTITUCIONAL & SEGURIDAD INFORMATIVA   -->
    <aside class="relative w-full lg:w-1/2 h-auto lg:h-full bg-gradient-to-br from-slate-950 via-slate-900 to-[#0c1322] text-white p-6 sm:p-10 xl:p-14 flex flex-col justify-between overflow-hidden shadow-2xl shrink-0">
      
      <!-- Fondo decorativo con efectos de resplandor radial -->
      <div class="absolute -top-32 -left-32 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-32 -right-32 w-80 h-80 bg-lime-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-emerald-600/10 rounded-full blur-[90px] pointer-events-none"></div>
      
      <!-- Patrón de cuadrícula tenue -->
      <div class="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-60"></div>

      <!-- Cabecera del Panel: Branding y Estado en Vivo -->
      <header class="relative z-10 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-lime-400 p-[1.5px] shadow-lg shadow-emerald-500/20">
            <div class="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <ShieldCheck class="w-5 h-5 text-emerald-400 stroke-[2.2]" />
            </div>
          </div>
          <div>
            <span class="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center">
              Servicios<span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-400">Aquí</span>
            </span>
            <span class="text-[10px] font-mono tracking-widest uppercase text-slate-400 block -mt-0.5">
              Servicios a tu alcance
            </span>
          </div>
        </div>

        <!-- Indicador de Sistema Operativo en Vivo -->
        <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-mono bg-white/5 border border-white/10 backdrop-blur-md">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span class="text-slate-300">Modo Administrador</span>
        </div>
      </header>

      <!-- Mensaje Central y Propuesta de Valor -->
      <div class="my-6 lg:my-auto relative z-10 max-w-lg">
        <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 backdrop-blur-md mb-3.5">
          <Sparkles class="w-3 h-3 text-lime-400" />
          <span>Seguridad - Auditoria - Administracion</span>
        </div>

        <h1 class="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-white leading-tight tracking-tight mb-3">
          Control centralizado de
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-lime-400 block sm:inline">
            Usuarios, Pagos, Escrow y e-KYC
          </span>
        </h1>
        
        <p class="text-slate-300/90 text-xs sm:text-sm leading-relaxed mb-6">
          Administre los modulos de la apicacion mobil y web, con los usuarios, pagos, rendimiento, Escrow, e-KYC y rendimiento
        </p>

        <!-- Tarjetas interactivas de confianza / métricas clave -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md hover:bg-white/[0.07] transition duration-200">
            <div class="flex items-center gap-2 text-emerald-400 mb-1">
              <KeyRound class="w-4 h-4 shrink-0" />
              <span class="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-200">Cifrado de Bóveda</span>
            </div>
            <p class="text-[11px] text-slate-400 leading-snug">Protocolo TLS 1.3 con firmas SHA-384 en cada operación.</p>
          </div>

          <div class="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md hover:bg-white/[0.07] transition duration-200">
            <div class="flex items-center gap-2 text-lime-400 mb-1">
              <Activity class="w-4 h-4 shrink-0" />
              <span class="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-200">Uptime 99.9%</span>
            </div>
            <p class="text-[11px] text-slate-400 leading-snug">Monitoreo 24/7 y conciliación bancaria continua.</p>
          </div>
        </div>
      </div>

      <!-- Pie del Panel Izquierdo -->
      <footer class="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>© {{ currentYear }} ServiciosAquí Bolivia</span>
        <span class="flex items-center gap-1.5 text-slate-500">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Sitio Actualizado v2.0
        </span>
      </footer>
    </aside>

    <!-- ============================================================== -->
    <!-- COLUMNA 2 (50%): FORMULARIO DE ACCESO CENTRADO                 -->
    <!-- ============================================================== -->
    <main class="w-full lg:w-1/2 h-auto lg:h-full flex items-center justify-center p-6 sm:p-10 xl:p-14 relative shrink-0">
      
      <!-- Fondo sutil decorativo -->
      <div class="absolute inset-0 bg-radial from-slate-100/90 via-transparent to-transparent pointer-events-none"></div>

      <div class="w-full max-w-md relative z-10">
        
        <!-- Tarjeta del Formulario -->
        <div class="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-200/80">
          
          <!-- Encabezado del Formulario -->
          <div class="mb-5">
            <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 border border-emerald-100">
              <Lock class="w-4 h-4 stroke-[2.2]" />
            </div>
            <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Acceso a la Consola
            </h2>
            <p class="text-slate-500 text-xs sm:text-sm mt-1">
              Ingresa tus credenciales autorizadas de operador administrativo.
            </p>
          </div>

          <!-- Banner de Notificación de Error -->
          <transition name="fade">
            <div 
              v-if="errorMessage" 
              class="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5 text-xs leading-relaxed"
            >
              <AlertCircle class="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div class="flex-1 font-medium">
                {{ errorMessage }}
              </div>
              <button 
                type="button" 
                @click="errorMessage = ''" 
                class="text-rose-400 hover:text-rose-700 font-bold ml-1 text-sm leading-none"
              >
                &times;
              </button>
            </div>
          </transition>

          <!-- Banner de Autenticación Exitosa -->
          <transition name="fade">
            <div 
              v-if="loginSuccess" 
              class="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2.5 text-xs leading-relaxed"
            >
              <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
              <div class="flex-1 font-semibold">
                ¡Autenticación correcta! Redirigiendo a la consola...
              </div>
            </div>
          </transition>

          <!-- Formulario -->
          <form @submit.prevent="handleAdminLogin" class="space-y-4">
            
            <!-- Campo: Correo Institucional -->
            <div>
              <div class="flex items-center justify-between mb-1">
                <label for="admin-email" class="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Correo del Operador
                </label>
                <span v-if="isEmailValid" class="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 class="w-3.5 h-3.5" /> Válido
                </span>
              </div>
              
              <div class="relative group">
                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                  <Mail class="w-4 h-4" />
                </span>
                <input
                  id="admin-email"
                  v-model="credentials.email"
                  type="email"
                  autocomplete="username"
                  required
                  placeholder="operador@admin.serviciosaqui.bo"
                  class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm placeholder-slate-400 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 transition duration-150"
                  :class="{ 'border-emerald-500 bg-emerald-50/20': isEmailValid }"
                />
              </div>
            </div>

            <!-- Campo: Contraseña / Clave de Seguridad -->
            <div>
              <div class="flex items-center justify-between mb-1">
                <label for="admin-key" class="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Contraseña Maestra
                </label>
                <a 
                  href="#" 
                  @click.prevent="handleForgotPassword"
                  class="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition"
                >
                  ¿Olvidaste tu acceso?
                </a>
              </div>

              <div class="relative group">
                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                  <Lock class="w-4 h-4" />
                </span>
                <input
                  id="admin-key"
                  v-model="credentials.secretKey"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  required
                  placeholder="••••••••••••"
                  class="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm placeholder-slate-400 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 transition duration-150"
                />
                
                <!-- Botón Alternar Visibilidad -->
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 focus:outline-none cursor-pointer transition"
                  :title="showPassword ? 'Ocultar contraseña' : 'Ver contraseña'"
                  aria-label="Alternar visibilidad de contraseña"
                >
                  <EyeOff v-if="showPassword" class="w-4 h-4" />
                  <Eye v-else class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Opciones Adicionales: Recordar y Soporte -->
            <div class="flex items-center justify-between text-xs pt-0.5">
              <label class="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                <input
                  v-model="credentials.remember"
                  type="checkbox"
                  class="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/30 accent-emerald-600 cursor-pointer"
                />
                <span>Recordar dispositivo</span>
              </label>
              
              <span class="text-slate-400 font-mono text-[11px]">2FA Habilitado</span>
            </div>

            <!-- Botón de Envío Principal -->
            <button
              type="submit"
              :disabled="isLoading || loginSuccess"
              class="w-full py-2.5 sm:py-3 px-5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 active:scale-[0.99] shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/35 focus:outline-none focus:ring-4 focus:ring-emerald-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group cursor-pointer"
            >
              <template v-if="isLoading">
                <span class="inline-block animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                <span>Verificando credenciales...</span>
              </template>
              
              <template v-else-if="loginSuccess">
                <CheckCircle2 class="w-4 h-4" />
                <span>Acceso Autorizado</span>
              </template>

              <template v-else>
                <span>Ingresar a la Consola</span>
                <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </template>
            </button>
          </form>

          <!-- Acceso Rápido Demo (Testing ágil) -->
          <div class="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>¿Pruebas locales?</span>
            <button 
              type="button" 
              @click="fillDemoCredentials"
              class="font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-2 py-1 rounded-lg transition cursor-pointer"
            >
              Llenar demo
            </button>
          </div>
        </div>

        <!-- Mensaje de seguridad al pie -->
        <p class="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1.5 font-medium">
          <ShieldCheck class="w-3.5 h-3.5 text-emerald-600" />
          Conexión cifrada de extremo a extremo • Acceso monitorizado
        </p>
      </div>
    </main>

  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Activity, 
  KeyRound 
} from 'lucide-vue-next'

interface AdminCredentials {
  email: string
  secretKey: string
  remember: boolean
}

const router = useRouter()
const currentYear = new Date().getFullYear()

const credentials = reactive<AdminCredentials>({
  email: '',
  secretKey: '',
  remember: false
})

const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const loginSuccess = ref(false)

// Validación reactiva de correo
const isEmailValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(credentials.email.trim())
})

// Simulación de credenciales de prueba para agilizar testing
const fillDemoCredentials = () => {
  credentials.email = 'operador@admin.serviciosaqui.bo'
  credentials.secretKey = 'AdminSuper2026!'
  credentials.remember = true
  errorMessage.value = ''
}

const handleForgotPassword = () => {
  alert('Comunícate con el Administrador de Infraestructura para rotar tu llave criptográfica.')
}

const handleAdminLogin = () => {
  errorMessage.value = ''
  
  if (!isEmailValid.value) {
    errorMessage.value = 'Por favor, ingresa un formato de correo institucional válido.'
    return
  }

  if (credentials.secretKey.length < 6) {
    errorMessage.value = 'La contraseña debe contener al menos 6 caracteres.'
    return
  }

  isLoading.value = true

  // Simulación de autenticación (reemplazar por la llamada al API de autenticación)
  setTimeout(() => {
    isLoading.value = false
    loginSuccess.value = true
    console.log('Operador autenticado exitosamente:', {
      email: credentials.email,
      remember: credentials.remember,
      timestamp: new Date().toISOString()
    })

    setTimeout(() => {
      router.push('/dashboard')
    }, 800)
  }, 1000)
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
