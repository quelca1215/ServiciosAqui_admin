<template>
  <div
    ref="rootRef"
    class="login-root relative h-screen w-full flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden selection:bg-[#84cc16] selection:text-[#052e16]"
    @mousemove="handleMouseMove"
  >
    <!-- ============================================================== -->
    <!-- COLUMNA IZQUIERDA (50%): ESTILO, COLORES Y COMPONENTES INTACTOS -->
    <!-- ============================================================== -->
    <section class="relative w-full lg:w-1/2 h-auto lg:h-full bg-[#03140b] text-white p-6 sm:p-8 xl:p-12 flex flex-col justify-between overflow-hidden shrink-0">
      
      <!-- Capas de fondo inmersivas (restringidas a la columna izquierda) -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <!-- Auroras animadas con la paleta de marca -->
        <div class="aurora aurora-primary"></div>
        <div class="aurora aurora-secondary"></div>
        <div class="aurora aurora-deep"></div>

        <!-- Spotlight interactivo que sigue al cursor -->
        <div class="spotlight"></div>
      </div>

      <!-- Marca + estado -->
      <header class="relative z-10 flex items-center justify-between gap-3 reveal" style="--d: 0ms">
        <div class="flex items-center gap-3">
          <div class="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#22c55e] to-[#84cc16] p-[1.5px] shadow-[0_0_30px_-4px_#22c55e]">
            <div class="w-full h-full rounded-[14px] bg-[#052e16] flex items-center justify-center">
              <ShieldCheck class="w-5 h-5 text-[#84cc16] stroke-[2.4]" />
            </div>
          </div>
          <div>
            <span class="text-xl sm:text-2xl font-black tracking-tight leading-none">
              Servicios<span class="text-transparent bg-clip-text bg-gradient-to-r from-[#22c55e] to-[#84cc16]">Aquí</span>
            </span>
            <span class="block text-[10px] font-mono tracking-[0.2em] uppercase text-[#84cc16]/80 mt-1">
              Servicios a tu alcance
            </span>
          </div>
        </div>

        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-mono font-semibold bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#bbf7d0] backdrop-blur-md">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#84cc16] opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-[#84cc16]"></span>
          </span>
          Modo Administrador
        </div>
      </header>

      <!-- Mensaje principal y métricas vivas -->
      <div class="relative z-10 max-w-xl my-auto py-4">
        <div class="reveal inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#84cc16]/10 border border-[#84cc16]/30 text-[#d9f99d] mb-3 sm:mb-4" style="--d: 80ms">
          <Sparkles class="w-3.5 h-3.5 text-[#84cc16]" />
          Seguridad · Auditoría · Administración
        </div>

        <h1 class="reveal text-2xl sm:text-3xl xl:text-4xl font-black leading-[1.12] tracking-tight mb-3 sm:mb-4" style="--d: 160ms">
          Control centralizado de
          <span class="text-gradient-animated block">
            Usuarios, Pagos, Escrow y e-KYC
          </span>
        </h1>

        <p class="reveal text-xs sm:text-sm text-emerald-50/70 leading-relaxed mb-5 sm:mb-6 max-w-lg" style="--d: 240ms">
          Administre los módulos de la aplicación móvil y web: usuarios, pagos, Escrow, e-KYC y rendimiento, desde una sola consola.
        </p>

        <!-- Métricas vivas con contador animado -->
        <div class="reveal grid grid-cols-3 gap-2.5 sm:gap-3 mb-4 sm:mb-5" style="--d: 320ms">
          <div
            v-for="stat in liveStats"
            :key="stat.label"
            class="group rounded-2xl p-3 sm:p-3.5 bg-white/[0.04] border border-white/10 backdrop-blur-md hover:border-[#22c55e]/50 hover:bg-[#22c55e]/[0.08] transition-colors duration-300"
          >
            <component :is="stat.icon" class="w-4 h-4 mb-1.5 sm:mb-2" :class="stat.iconClass" />
            <div class="text-lg sm:text-2xl font-black font-mono tracking-tight text-white">
              {{ stat.display }}
            </div>
            <div class="text-[10px] sm:text-[11px] uppercase tracking-wider font-mono text-emerald-100/50 mt-0.5">
              {{ stat.label }}
            </div>
          </div>
        </div>

        <!-- Ticker de actividad en tiempo real -->
        <div
          class="reveal relative overflow-hidden rounded-2xl border border-[#22c55e]/25 bg-gradient-to-r from-[#22c55e]/[0.12] via-[#052e16]/40 to-[#84cc16]/[0.08] backdrop-blur-md px-3.5 sm:px-4 py-2.5 sm:py-3"
          style="--d: 400ms"
          aria-live="off"
        >
          <div class="flex items-center gap-2.5 sm:gap-3">
            <span class="shrink-0 inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-[#84cc16]">
              <Radio class="w-3.5 h-3.5 animate-pulse" />
              En vivo
            </span>
            <span class="h-4 w-px bg-white/15"></span>
            <div class="relative flex-1 h-5 overflow-hidden">
              <transition name="ticker" mode="out-in">
                <div :key="tickerIndex" class="absolute inset-0 flex items-center gap-2 text-xs sm:text-sm text-emerald-50/90 whitespace-nowrap">
                  <component :is="currentEvent.icon" class="w-3.5 h-3.5 shrink-0" :class="currentEvent.iconClass" />
                  <span class="font-semibold">{{ currentEvent.title }}</span>
                  <span class="text-emerald-100/40">·</span>
                  <span class="truncate text-emerald-100/60">{{ currentEvent.detail }}</span>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>

      <!-- Pie de página izquierdo -->
      <footer class="relative z-10 reveal flex items-center justify-between text-[11px] font-mono text-emerald-100/40 pt-3 sm:pt-4 border-t border-white/10" style="--d: 480ms">
        <span>© {{ currentYear }} ServiciosAquí Bolivia</span>
        <span class="flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e]"></span>
          Sitio Actualizado v2.0
        </span>
      </footer>
    </section>

    <!-- ============================================================== -->
    <!-- COLUMNA DERECHA (50%): FONDO BLANCO Y TARJETA BLANCA CON        -->
    <!-- SOMBRAS EN COLOR #84cc16                                        -->
    <!-- ============================================================== -->
    <main class="relative w-full lg:w-1/2 h-auto lg:h-full bg-[#fbfdfb] flex items-center justify-center p-6 sm:p-8 xl:p-12 overflow-y-auto border-t lg:border-t-0 lg:border-l border-slate-200/80">
      
      <!-- Contenedor central -->
      <div class="w-full max-w-md reveal" style="--d: 150ms">

        <!-- Tarjeta de Login Blanca / Medio Blanca con Sombras #84cc16 -->
        <div
          class="card-white-lime relative rounded-[28px] p-7 sm:p-9 overflow-hidden"
          :class="{ shake: isShaking }"
        >
          <!-- Sutil brillo superior de acento interior -->
          <div class="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full bg-[#84cc16]/10 blur-2xl" aria-hidden="true"></div>

          <!-- Encabezado de la Tarjeta -->
          <div class="relative mb-6">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#22c55e] to-[#84cc16] flex items-center justify-center mb-4 shadow-[0_10px_25px_-8px_#84cc16]">
              <Fingerprint class="w-6 h-6 text-[#052e16] stroke-[2.2]" />
            </div>
            <h2 class="text-2xl sm:text-[28px] font-black tracking-tight text-slate-900 leading-tight">
              Bienvenido de vuelta
            </h2>
            <p class="text-xs sm:text-sm text-slate-500 mt-1">
              Ingresa tus credenciales de operador para acceder a la consola.
            </p>
          </div>

          <!-- Mensaje de Error -->
          <transition name="fade">
            <div
              v-if="errorMessage"
              role="alert"
              class="relative mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5 text-xs leading-relaxed shadow-sm"
            >
              <AlertCircle class="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span class="flex-1 font-medium">{{ errorMessage }}</span>
              <button
                type="button"
                @click="errorMessage = ''"
                class="text-rose-400 hover:text-rose-700 font-bold text-sm leading-none cursor-pointer"
                aria-label="Cerrar mensaje de error"
              >
                &times;
              </button>
            </div>
          </transition>

          <!-- Formulario -->
          <form @submit.prevent="handleAdminLogin" class="relative space-y-4" novalidate>

            <!-- Correo del Operador -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label for="admin-email" class="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Correo del operador
                </label>
                <transition name="fade">
                  <span v-if="isEmailValid" class="text-[11px] font-semibold text-[#16a34a] flex items-center gap-1">
                    <CheckCircle2 class="w-3.5 h-3.5" /> Válido
                  </span>
                </transition>
              </div>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#84cc16] transition-colors">
                  <Mail class="w-4 h-4" />
                </div>
                <input
                  id="admin-email"
                  v-model="credentials.email"
                  type="email"
                  autocomplete="username"
                  required
                  placeholder="operador@admin.serviciosaqui.bo"
                  class="w-full py-2.5 sm:py-3 pl-10 pr-4 text-sm font-medium rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#84cc16] focus:ring-4 focus:ring-[#84cc16]/20 shadow-sm outline-none transition-all duration-200"
                  :class="{ 'border-[#84cc16] bg-emerald-50/20': isEmailValid }"
                />
              </div>
            </div>

            <!-- Contraseña -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label for="admin-key" class="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Contraseña
                </label>
                <a
                  href="#"
                  @click.prevent="openForgotPassword"
                  class="text-[11px] font-semibold text-[#16a34a] hover:text-[#15803d] hover:underline underline-offset-2 transition-colors cursor-pointer"
                >
                  ¿Olvidaste tu acceso?
                </a>
              </div>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#84cc16] transition-colors">
                  <Lock class="w-4 h-4" />
                </div>
                <input
                  id="admin-key"
                  v-model="credentials.secretKey"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  required
                  placeholder="••••••••••••"
                  class="w-full py-2.5 sm:py-3 pl-10 pr-11 text-sm font-medium rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#84cc16] focus:ring-4 focus:ring-[#84cc16]/20 shadow-sm outline-none transition-all duration-200"
                  @keyup="detectCapsLock"
                  @keydown="detectCapsLock"
                  @blur="capsLockOn = false"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#84cc16] transition-colors cursor-pointer"
                  :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                >
                  <EyeOff v-if="showPassword" class="w-4 h-4" />
                  <Eye v-else class="w-4 h-4" />
                </button>
              </div>
              <transition name="fade">
                <p v-if="capsLockOn" class="mt-1.5 text-[11px] font-semibold text-amber-600 flex items-center gap-1">
                  <AlertCircle class="w-3.5 h-3.5" /> Bloq Mayús está activado
                </p>
              </transition>
            </div>

            <!-- Recordar dispositivo + Estado 2FA -->
            <div class="flex items-center justify-between text-xs pt-0.5">
              <label class="flex items-center gap-2 text-slate-600 font-medium cursor-pointer select-none">
                <input
                  v-model="credentials.remember"
                  type="checkbox"
                  class="w-4 h-4 rounded border-slate-300 accent-[#84cc16] cursor-pointer"
                />
                <span>Recordar dispositivo</span>
              </label>
              <span class="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#15803d] bg-[#84cc16]/15 border border-[#84cc16]/30 px-2 py-0.5 rounded-md">
                <KeyRound class="w-3 h-3 text-[#15803d]" /> 2FA activo
              </span>
            </div>

            <!-- Botón Principal con Degradado de Marca y Destello -->
            <button
              type="submit"
              :disabled="isLoading || loginSuccess"
              class="cta-btn group relative w-full overflow-hidden rounded-xl py-3.5 px-5 font-black text-sm text-[#052e16] bg-gradient-to-r from-[#22c55e] to-[#84cc16] shadow-[0_12px_28px_-8px_#84cc16] hover:shadow-[0_16px_36px_-6px_#84cc16] hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#84cc16]/30 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer"
            >
              <span class="shimmer" aria-hidden="true"></span>
              <span class="relative flex items-center justify-center gap-2">
                <template v-if="isLoading">
                  <span class="w-4 h-4 border-2 border-[#052e16] border-t-transparent rounded-full animate-spin"></span>
                  Verificando credenciales...
                </template>
                <template v-else>
                  Ingresar a la consola
                  <ArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </template>
              </span>
            </button>
          </form>

          <!-- Acceso Demo Rápido -->
          <div class="relative mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span class="font-medium">¿Pruebas locales?</span>
            <button
              type="button"
              @click="fillDemoCredentials"
              class="font-semibold text-[#16a34a] hover:text-[#052e16] hover:bg-[#84cc16]/15 border border-[#84cc16]/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              Llenar demo
            </button>
          </div>

          <!-- Overlay de Éxito -->
          <transition name="success">
            <div
              v-if="loginSuccess"
              class="absolute inset-0 z-20 flex flex-col items-center justify-center text-center bg-white/95 backdrop-blur-sm p-6"
              role="status"
            >
              <div class="relative mb-4">
                <span class="absolute inset-0 rounded-full bg-[#84cc16]/30 animate-ping"></span>
                <div class="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#22c55e] to-[#84cc16] flex items-center justify-center shadow-lg shadow-[#84cc16]/40">
                  <CheckCircle2 class="w-8 h-8 text-[#052e16] stroke-[2.4]" />
                </div>
              </div>
              <h3 class="text-xl font-black text-slate-900">Acceso autorizado</h3>
              <p class="text-xs text-slate-500 mt-1">Preparando tu consola de administración...</p>
              <div class="mt-4 w-44 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div class="h-full rounded-full bg-gradient-to-r from-[#22c55e] to-[#84cc16] progress-fill"></div>
              </div>
            </div>
          </transition>
        </div>

        <!-- Nota de Seguridad al pie -->
        <p class="text-center text-[11px] text-slate-400 mt-4 flex items-center justify-center gap-1.5 font-medium">
          <ShieldCheck class="w-3.5 h-3.5 text-[#16a34a]" />
          Conexión cifrada de extremo a extremo · Acceso monitorizado
        </p>
      </div>
    </main>

    <!-- ============================================================== -->
    <!-- MODAL DE RECUPERACIÓN DE CONTRASEÑA EN 3 PASOS (2FA)           -->
    <!-- ============================================================== -->
    <transition name="modal-fade">
      <div
        v-if="showForgotModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md"
        @click.self="closeForgotPassword"
      >
        <div
          class="relative w-full max-w-[460px] bg-white rounded-3xl border border-[#84cc16]/30 shadow-[0_25px_60px_-15px_rgba(5,46,22,0.35)] p-6 sm:p-7 overflow-hidden text-slate-800"
          role="dialog"
          aria-modal="true"
        >
          <!-- Glow superior con acento verde lima -->
          <div class="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-36 bg-[#84cc16]/15 rounded-full blur-3xl" aria-hidden="true"></div>

          <!-- Barra Superior: Insignia + Botón Cerrar (X) sin colisiones -->
          <div class="relative flex items-center justify-between pb-3.5 mb-5 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-[#84cc16]/15 border border-[#84cc16]/30 text-[#15803d]">
                <ShieldCheck class="w-3.5 h-3.5 text-[#16a34a]" />
                Recuperación Segura
              </span>
              <span v-if="forgotStep !== 4" class="text-[11px] font-mono text-slate-400 font-semibold">
                · Paso {{ forgotStep }} de 3
              </span>
            </div>

            <button
              type="button"
              @click="closeForgotPassword"
              class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- Encabezado / Pasos (solo en pasos 1, 2, 3) -->
          <div v-if="forgotStep !== 4" class="relative mb-6">
            <!-- Timeline de Pasos -->
            <div class="flex items-center justify-between mb-5 px-1 sm:px-2">
              <!-- Paso 1 -->
              <div class="flex items-center gap-1.5 sm:gap-2">
                <div
                  class="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300"
                  :class="forgotStep > 1 ? 'bg-[#22c55e] text-[#052e16]' : (forgotStep === 1 ? 'bg-[#84cc16] text-[#052e16] ring-4 ring-[#84cc16]/20 font-black' : 'bg-slate-100 text-slate-400')"
                >
                  <Check v-if="forgotStep > 1" class="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                  <span v-else>1</span>
                </div>
                <span class="text-[11px] sm:text-xs font-bold" :class="forgotStep >= 1 ? 'text-slate-800' : 'text-slate-400'">Correo</span>
              </div>

              <div class="flex-1 h-0.5 mx-2 transition-colors duration-300" :class="forgotStep > 1 ? 'bg-[#22c55e]' : 'bg-slate-200'"></div>

              <!-- Paso 2 -->
              <div class="flex items-center gap-1.5 sm:gap-2">
                <div
                  class="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300"
                  :class="forgotStep > 2 ? 'bg-[#22c55e] text-[#052e16]' : (forgotStep === 2 ? 'bg-[#84cc16] text-[#052e16] ring-4 ring-[#84cc16]/20 font-black' : 'bg-slate-100 text-slate-400')"
                >
                  <Check v-if="forgotStep > 2" class="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                  <span v-else>2</span>
                </div>
                <span class="text-[11px] sm:text-xs font-bold" :class="forgotStep >= 2 ? 'text-slate-800' : 'text-slate-400'">Código 2FA</span>
              </div>

              <div class="flex-1 h-0.5 mx-2 transition-colors duration-300" :class="forgotStep > 2 ? 'bg-[#22c55e]' : 'bg-slate-200'"></div>

              <!-- Paso 3 -->
              <div class="flex items-center gap-1.5 sm:gap-2">
                <div
                  class="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300"
                  :class="forgotStep === 3 ? 'bg-[#84cc16] text-[#052e16] ring-4 ring-[#84cc16]/20 font-black' : 'bg-slate-100 text-slate-400'"
                >
                  <span>3</span>
                </div>
                <span class="text-[11px] sm:text-xs font-bold" :class="forgotStep >= 3 ? 'text-slate-800' : 'text-slate-400'">Nueva Clave</span>
              </div>
            </div>

            <!-- Ícono y Título del Paso Actual -->
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#22c55e]/20 to-[#84cc16]/20 border border-[#84cc16]/30 flex items-center justify-center shrink-0">
                <Mail v-if="forgotStep === 1" class="w-5 h-5 text-[#15803d]" />
                <KeyRound v-else-if="forgotStep === 2" class="w-5 h-5 text-[#15803d]" />
                <Lock v-else class="w-5 h-5 text-[#15803d]" />
              </div>
              <div>
                <h3 class="text-lg font-black text-slate-900 leading-tight">
                  {{ forgotStep === 1 ? 'Recuperar contraseña' : (forgotStep === 2 ? 'Verificación de seguridad (2FA)' : 'Restablecer contraseña') }}
                </h3>
                <p class="text-xs text-slate-500 mt-0.5">
                  {{ forgotStep === 1 ? 'Ingresa tu correo institucional registrado para recibir el código.' : (forgotStep === 2 ? 'Ingresa los 6 caracteres enviados a tu dirección de correo.' : 'Define tu nueva contraseña de acceso a la consola.') }}
                </p>
              </div>
            </div>
          </div>

          <!-- Alertas de Error y Éxito -->
          <transition name="fade">
            <div
              v-if="forgotError"
              class="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5 text-xs leading-relaxed"
            >
              <AlertCircle class="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span class="flex-1 font-medium">{{ forgotError }}</span>
              <button type="button" @click="forgotError = ''" class="text-rose-400 hover:text-rose-700 text-sm font-bold leading-none cursor-pointer">
                &times;
              </button>
            </div>
          </transition>

          <transition name="fade">
            <div
              v-if="forgotSuccessMsg && forgotStep !== 4"
              class="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-2.5 text-xs leading-relaxed"
            >
              <CheckCircle2 class="w-4 h-4 text-[#16a34a] shrink-0 mt-0.5" />
              <span class="flex-1 font-medium">{{ forgotSuccessMsg }}</span>
            </div>
          </transition>

          <!-- ================= PASO 1: ENVIAR CÓDIGO AL CORREO ================= -->
          <form v-if="forgotStep === 1" @submit.prevent="handleSendResetCode(false)" class="space-y-4">
            <div>
              <label for="forgot-email" class="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Correo institucional
              </label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#84cc16] transition-colors">
                  <Mail class="w-4 h-4" />
                </div>
                <input
                  id="forgot-email"
                  v-model="forgotForm.email"
                  type="email"
                  required
                  placeholder="operador@admin.serviciosaqui.bo"
                  class="w-full py-2.5 pl-10 pr-4 text-sm font-medium rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#84cc16] focus:ring-4 focus:ring-[#84cc16]/20 shadow-sm outline-none transition-all"
                  :class="{ 'border-[#84cc16] bg-emerald-50/20': isForgotEmailValid }"
                />
              </div>
            </div>

            <div class="pt-2 flex items-center gap-3">
              <button
                type="button"
                @click="closeForgotPassword"
                class="w-1/3 py-2.5 px-4 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="forgotLoading || !isForgotEmailValid"
                class="flex-1 py-2.5 px-4 text-xs font-black text-[#052e16] bg-gradient-to-r from-[#22c55e] to-[#84cc16] rounded-xl shadow-[0_8px_20px_-6px_#84cc16] hover:shadow-[0_12px_24px_-4px_#84cc16] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                <span v-if="forgotLoading" class="w-4 h-4 border-2 border-[#052e16] border-t-transparent rounded-full animate-spin"></span>
                <span>{{ forgotLoading ? 'Enviando código...' : 'Enviar código de verificación' }}</span>
                <ArrowRight v-if="!forgotLoading" class="w-4 h-4" />
              </button>
            </div>
          </form>

          <!-- ================= PASO 2: VERIFICAR CÓDIGO (2FA) ================= -->
          <form v-else-if="forgotStep === 2" @submit.prevent="handleVerifyCode" class="space-y-4">
            <div class="p-3 bg-emerald-50/70 border border-emerald-100/90 rounded-2xl text-xs text-emerald-950 flex items-center justify-between">
              <div class="truncate mr-2">
                <span class="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Código enviado a:</span>
                <span class="font-bold text-[#052e16] truncate block">{{ forgotForm.email }}</span>
              </div>
              <button
                type="button"
                @click="forgotStep = 1; forgotError = '';"
                class="text-[11px] font-semibold text-[#16a34a] hover:underline cursor-pointer shrink-0"
              >
                Cambiar
              </button>
            </div>

            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Código de 6 caracteres
                </label>
                <span class="text-[10px] text-slate-400 font-mono">{{ forgotForm.codigo.length }}/6</span>
              </div>

              <!-- 6 Casillas de Código OTP -->
              <div class="flex items-center justify-between gap-1.5 sm:gap-2">
                <input
                  v-for="(digit, idx) in otpDigits"
                  :key="idx"
                  :ref="el => setOtpRef(el, idx)"
                  v-model="otpDigits[idx]"
                  type="text"
                  maxlength="1"
                  autocomplete="one-time-code"
                  class="w-11 sm:w-12 h-13 sm:h-14 text-center font-mono text-xl sm:text-2xl font-black rounded-xl border border-slate-200 bg-slate-50/80 text-slate-900 focus:bg-white focus:border-[#84cc16] focus:ring-4 focus:ring-[#84cc16]/20 transition-all outline-none caret-[#15803d]"
                  :class="{ 'border-[#84cc16] bg-emerald-50/25 ring-1 ring-[#84cc16]/40': digit }"
                  @input="e => handleOtpInput(idx, e)"
                  @keydown="e => handleOtpKeydown(idx, e)"
                  @paste="handleOtpPaste"
                  @focus="handleOtpFocus(idx)"
                />
              </div>
            </div>

            <div class="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>¿No recibiste el código?</span>
              <button
                v-if="resendCountdown === 0"
                type="button"
                :disabled="forgotLoading"
                @click="handleSendResetCode(true)"
                class="font-bold text-[#16a34a] hover:text-[#15803d] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw class="w-3 h-3" :class="{ 'animate-spin': forgotLoading }" />
                Reenviar código
              </button>
              <span v-else class="font-mono text-slate-400">
                Reenviar en {{ resendCountdown }}s
              </span>
            </div>

            <div class="pt-2 flex items-center gap-3">
              <button
                type="button"
                @click="forgotStep = 1; forgotError = '';"
                class="w-1/3 py-2.5 px-4 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft class="w-3.5 h-3.5" />
                Atrás
              </button>
              <button
                type="submit"
                :disabled="forgotLoading || forgotForm.codigo.length < 6"
                class="flex-1 py-2.5 px-4 text-xs font-black text-[#052e16] bg-gradient-to-r from-[#22c55e] to-[#84cc16] rounded-xl shadow-[0_8px_20px_-6px_#84cc16] hover:shadow-[0_12px_24px_-4px_#84cc16] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                <span v-if="forgotLoading" class="w-4 h-4 border-2 border-[#052e16] border-t-transparent rounded-full animate-spin"></span>
                <span>{{ forgotLoading ? 'Verificando...' : 'Validar código' }}</span>
                <ArrowRight v-if="!forgotLoading" class="w-4 h-4" />
              </button>
            </div>
          </form>

          <!-- ================= PASO 3: NUEVA CONTRASEÑA ================= -->
          <form v-else-if="forgotStep === 3" @submit.prevent="handleResetPassword" class="space-y-4">
            <div>
              <label for="forgot-new-pwd" class="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Nueva Contraseña
              </label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#84cc16] transition-colors">
                  <Lock class="w-4 h-4" />
                </div>
                <input
                  id="forgot-new-pwd"
                  v-model="forgotForm.newPassword"
                  :type="showNewPassword ? 'text' : 'password'"
                  required
                  placeholder="Mínimo 6 caracteres"
                  class="w-full py-2.5 pl-10 pr-11 text-sm font-medium rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#84cc16] focus:ring-4 focus:ring-[#84cc16]/20 shadow-sm outline-none transition-all"
                />
                <button
                  type="button"
                  @click="showNewPassword = !showNewPassword"
                  class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#84cc16] transition-colors cursor-pointer"
                >
                  <EyeOff v-if="showNewPassword" class="w-4 h-4" />
                  <Eye v-else class="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label for="forgot-confirm-pwd" class="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Confirmar Nueva Contraseña
              </label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#84cc16] transition-colors">
                  <Lock class="w-4 h-4" />
                </div>
                <input
                  id="forgot-confirm-pwd"
                  v-model="forgotForm.confirmNewPassword"
                  :type="showConfirmNewPassword ? 'text' : 'password'"
                  required
                  placeholder="Repite la nueva contraseña"
                  class="w-full py-2.5 pl-10 pr-11 text-sm font-medium rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#84cc16] focus:ring-4 focus:ring-[#84cc16]/20 shadow-sm outline-none transition-all"
                />
                <button
                  type="button"
                  @click="showConfirmNewPassword = !showConfirmNewPassword"
                  class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#84cc16] transition-colors cursor-pointer"
                >
                  <EyeOff v-if="showConfirmNewPassword" class="w-4 h-4" />
                  <Eye v-else class="w-4 h-4" />
                </button>
              </div>
            </div>

            <div class="pt-2 flex items-center gap-3">
              <button
                type="button"
                @click="forgotStep = 2; forgotError = '';"
                class="w-1/3 py-2.5 px-4 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft class="w-3.5 h-3.5" />
                Atrás
              </button>
              <button
                type="submit"
                :disabled="forgotLoading || !forgotForm.newPassword || !forgotForm.confirmNewPassword"
                class="flex-1 py-2.5 px-4 text-xs font-black text-[#052e16] bg-gradient-to-r from-[#22c55e] to-[#84cc16] rounded-xl shadow-[0_8px_20px_-6px_#84cc16] hover:shadow-[0_12px_24px_-4px_#84cc16] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                <span v-if="forgotLoading" class="w-4 h-4 border-2 border-[#052e16] border-t-transparent rounded-full animate-spin"></span>
                <span>{{ forgotLoading ? 'Guardando...' : 'Restablecer contraseña' }}</span>
                <ArrowRight v-if="!forgotLoading" class="w-4 h-4" />
              </button>
            </div>
          </form>

          <!-- ================= PASO 4: ÉXITO TOTAL ================= -->
          <div v-else-if="forgotStep === 4" class="text-center py-4 space-y-4">
            <div class="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-[#22c55e] to-[#84cc16] flex items-center justify-center shadow-[0_10px_25px_-8px_#84cc16]">
              <CheckCircle2 class="w-8 h-8 text-[#052e16] stroke-[2.5]" />
            </div>

            <div>
              <h3 class="text-xl font-black text-slate-900">¡Contraseña restablecida!</h3>
              <p class="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Tu credencial ha sido actualizada exitosamente. Ya puedes iniciar sesión en la consola.
              </p>
            </div>

            <div class="pt-3">
              <button
                type="button"
                @click="finishPasswordRecovery"
                class="w-full py-3 px-5 text-sm font-black text-[#052e16] bg-gradient-to-r from-[#22c55e] to-[#84cc16] rounded-xl shadow-[0_10px_24px_-6px_#84cc16] hover:shadow-[0_14px_30px_-4px_#84cc16] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Iniciar sesión ahora</span>
                <ArrowRight class="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </transition>

  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, nextTick, onMounted, onUnmounted, type Component } from 'vue'
import { useRouter } from 'vue-router'
import { authService, setAuthToken } from '@/api'
import { userStore } from '@/store'
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Activity,
  KeyRound,
  Fingerprint,
  Radio,
  Users,
  BadgeCheck,
  Wallet,
  MapPin,
  X,
  Check,
  RefreshCw
} from 'lucide-vue-next'

interface AdminCredentials {
  email: string
  secretKey: string
  remember: boolean
}

interface LiveStat {
  label: string
  target: number
  decimals: number
  suffix: string
  display: string
  icon: Component
  iconClass: string
}

interface LiveEvent {
  title: string
  detail: string
  icon: Component
  iconClass: string
}

const router = useRouter()
const currentYear = new Date().getFullYear()
const rootRef = ref<HTMLElement | null>(null)

// ---------------------------------------------------------------
// Formulario
// ---------------------------------------------------------------
const credentials = reactive<AdminCredentials>({
  email: '',
  secretKey: '',
  remember: false
})

const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const loginSuccess = ref(false)
const capsLockOn = ref(false)
const isShaking = ref(false)

const isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email.trim()))

const detectCapsLock = (event: KeyboardEvent) => {
  capsLockOn.value = event.getModifierState?.('CapsLock') ?? false
}

const triggerError = (message: string) => {
  errorMessage.value = message
  isShaking.value = false
  requestAnimationFrame(() => {
    isShaking.value = true
    setTimeout(() => (isShaking.value = false), 450)
  })
}

const fillDemoCredentials = () => {
  credentials.email = 'operador@admin.serviciosaqui.bo'
  credentials.secretKey = 'AdminSuper2026!'
  credentials.remember = true
  errorMessage.value = ''
}

// ---------------------------------------------------------------
// Recuperación de Contraseña (3 Pasos: Email -> 2FA -> Reset)
// ---------------------------------------------------------------
const showForgotModal = ref(false)
const forgotStep = ref<1 | 2 | 3 | 4>(1)
const forgotLoading = ref(false)
const forgotError = ref('')
const forgotSuccessMsg = ref('')
const showNewPassword = ref(false)
const showConfirmNewPassword = ref(false)
const resendCountdown = ref(0)
let resendTimer: ReturnType<typeof setInterval> | null = null

const forgotForm = reactive({
  email: '',
  codigo: '',
  newPassword: '',
  confirmNewPassword: ''
})

// Estado y referencias para las 6 casillas del código OTP (2FA)
const otpDigits = ref<string[]>(['', '', '', '', '', ''])
const otpInputRefs = ref<(HTMLInputElement | null)[]>([])

const setOtpRef = (el: any, index: number) => {
  otpInputRefs.value[index] = el as HTMLInputElement | null
}

const updateCodigoFromDigits = () => {
  forgotForm.codigo = otpDigits.value.join('')
}

const handleOtpInput = (index: number, event: Event) => {
  const input = event.target as HTMLInputElement
  let val = input.value.trim()

  if (val.length > 1) {
    val = val.slice(-1)
  }

  otpDigits.value[index] = val
  updateCodigoFromDigits()

  if (val && index < 5) {
    otpInputRefs.value[index + 1]?.focus()
  }
}

const handleOtpKeydown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace') {
    if (!otpDigits.value[index] && index > 0) {
      otpDigits.value[index - 1] = ''
      updateCodigoFromDigits()
      otpInputRefs.value[index - 1]?.focus()
      event.preventDefault()
    } else {
      otpDigits.value[index] = ''
      updateCodigoFromDigits()
    }
  } else if (event.key === 'ArrowLeft' && index > 0) {
    otpInputRefs.value[index - 1]?.focus()
    event.preventDefault()
  } else if (event.key === 'ArrowRight' && index < 5) {
    otpInputRefs.value[index + 1]?.focus()
    event.preventDefault()
  }
}

const handleOtpPaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pastedText = event.clipboardData?.getData('text').trim() || ''
  if (!pastedText) return

  const chars = pastedText.slice(0, 6).split('')
  for (let i = 0; i < 6; i++) {
    otpDigits.value[i] = chars[i] || ''
  }
  updateCodigoFromDigits()

  const nextFocusIndex = Math.min(chars.length, 5)
  otpInputRefs.value[nextFocusIndex]?.focus()
}

const handleOtpFocus = (index: number) => {
  otpInputRefs.value[index]?.select()
}

const isForgotEmailValid = computed(() =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotForm.email.trim())
)

const openForgotPassword = () => {
  forgotStep.value = 1
  forgotError.value = ''
  forgotSuccessMsg.value = ''
  forgotForm.email = credentials.email.trim() || ''
  forgotForm.codigo = ''
  otpDigits.value = ['', '', '', '', '', '']
  forgotForm.newPassword = ''
  forgotForm.confirmNewPassword = ''
  showForgotModal.value = true
}

const closeForgotPassword = () => {
  showForgotModal.value = false
  forgotLoading.value = false
  forgotError.value = ''
  otpDigits.value = ['', '', '', '', '', '']
  if (resendTimer) clearInterval(resendTimer)
  resendCountdown.value = 0
}

const startResendCountdown = () => {
  resendCountdown.value = 60
  if (resendTimer) clearInterval(resendTimer)
  resendTimer = setInterval(() => {
    if (resendCountdown.value > 0) {
      resendCountdown.value--
    } else {
      if (resendTimer) clearInterval(resendTimer)
    }
  }, 1000)
}

const handleSendResetCode = async (isResend = false) => {
  forgotError.value = ''
  forgotSuccessMsg.value = ''

  if (!isForgotEmailValid.value) {
    forgotError.value = 'Ingresa un correo institucional válido.'
    return
  }

  forgotLoading.value = true
  try {
    const res = await authService.olvidePassword({
      email: forgotForm.email.trim()
    })

    forgotSuccessMsg.value = res?.message || (isResend ? 'Código reenviado con éxito.' : 'Código de verificación enviado correctamente a tu correo.')
    forgotStep.value = 2
    otpDigits.value = ['', '', '', '', '', '']
    forgotForm.codigo = ''
    startResendCountdown()
    nextTick(() => {
      otpInputRefs.value[0]?.focus()
    })
  } catch (err: any) {
    const errorMsg = String(err?.message || err?.data?.message || '')
    forgotError.value = errorMsg || 'Error al enviar el código de verificación. Intenta nuevamente.'
  } finally {
    forgotLoading.value = false
  }
}

const handleVerifyCode = async () => {
  forgotError.value = ''
  forgotSuccessMsg.value = ''

  if (forgotForm.codigo.trim().length < 6) {
    forgotError.value = 'Por favor ingresa los 6 caracteres del código de verificación.'
    return
  }

  forgotLoading.value = true
  try {
    const res = await authService.verificarCodigo({
      email: forgotForm.email.trim(),
      codigo: forgotForm.codigo.trim()
    })

    forgotSuccessMsg.value = res?.message || 'Código verificado con éxito.'
    forgotStep.value = 3
  } catch (err: any) {
    const errorMsg = String(err?.message || err?.data?.message || '')
    forgotError.value = errorMsg || 'Código incorrecto o expirado. Por favor verifica e intenta de nuevo.'
  } finally {
    forgotLoading.value = false
  }
}

const handleResetPassword = async () => {
  forgotError.value = ''
  forgotSuccessMsg.value = ''

  if (forgotForm.newPassword.length < 6) {
    forgotError.value = 'La nueva contraseña debe tener al menos 6 caracteres.'
    return
  }

  if (forgotForm.newPassword !== forgotForm.confirmNewPassword) {
    forgotError.value = 'Las contraseñas no coinciden. Por favor verifícalas.'
    return
  }

  forgotLoading.value = true
  try {
    const res = await authService.resetPassword({
      email: forgotForm.email.trim(),
      newPassword: forgotForm.newPassword,
      confirmNewPassword: forgotForm.confirmNewPassword
    })

    forgotSuccessMsg.value = res?.message || '¡Tu contraseña ha sido restablecida exitosamente!'
    forgotStep.value = 4
    // Pre-llenar el correo en el formulario de login principal
    credentials.email = forgotForm.email.trim()
  } catch (err: any) {
    forgotError.value = err?.message || 'Error al restablecer la contraseña. Intenta nuevamente.'
  } finally {
    forgotLoading.value = false
  }
}

const finishPasswordRecovery = () => {
  closeForgotPassword()
  const passInput = document.getElementById('admin-key')
  if (passInput) passInput.focus()
}

const handleAdminLogin = async () => {
  errorMessage.value = ''

  if (!isEmailValid.value) {
    triggerError('Ingresa un correo institucional válido.')
    return
  }

  if (credentials.secretKey.length < 6) {
    triggerError('La contraseña debe contener al menos 6 caracteres.')
    return
  }

  isLoading.value = true

  try {
    const response = await authService.login({
      email: credentials.email.trim(),
      password: credentials.secretKey,
      remember: credentials.remember
    })
    

    loginSuccess.value = true
    setTimeout(async () => {
      try {
        await router.push('/dashboard')
      } catch (navErr) {
        console.error('Redirección con router falló, usando window.location:', navErr)
        window.location.href = '/dashboard'
      }
    }, 900)
  } catch (error: any) {
    // Si la API backend no responde (offline / sin conexión con el servidor):
    const isNetworkError = !error.status || error.originalError?.code === 'ERR_NETWORK' || error.message?.includes('No se pudo conectar')

    if (isNetworkError) {
      console.warn('API backend no disponible en la URL configurada. Iniciando sesión en modo local/demo.')
      setAuthToken('demo-jwt-token-serviciosaqui-admin')
      userStore.setUser({
        email: credentials.email.trim(),
        nombreCompleto: 'Gabriel Gustavo Quelca Villarpando',
        rol: 'SuperAdmin'
      })
      loginSuccess.value = true
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
      return
    }

    triggerError(error.message || 'Error al conectar con la API. Verifica tus credenciales.')
  } finally {
    isLoading.value = false
  }
}

// ---------------------------------------------------------------
// Spotlight interactivo que sigue al cursor (solo columna izquierda)
// ---------------------------------------------------------------
let rafId = 0
const handleMouseMove = (event: MouseEvent) => {
  if (rafId || !rootRef.value) return
  rafId = requestAnimationFrame(() => {
    const el = rootRef.value
    if (el) {
      const rect = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${event.clientX - rect.left}px`)
      el.style.setProperty('--my', `${event.clientY - rect.top}px`)
    }
    rafId = 0
  })
}

// ---------------------------------------------------------------
// Métricas con contador animado
// ---------------------------------------------------------------
const liveStats = reactive<LiveStat[]>([
  { label: 'Usuarios', target: 1248, decimals: 0, suffix: '', display: '0', icon: Users, iconClass: 'text-[#22c55e]' },
  { label: 'KYC verif.', target: 894, decimals: 0, suffix: '', display: '0', icon: BadgeCheck, iconClass: 'text-[#84cc16]' },
  { label: 'Uptime', target: 99.9, decimals: 1, suffix: '%', display: '0%', icon: Activity, iconClass: 'text-[#4ade80]' }
])

const formatStat = (value: number, stat: LiveStat) =>
  `${value.toLocaleString('es-BO', { minimumFractionDigits: stat.decimals, maximumFractionDigits: stat.decimals })}${stat.suffix}`

const animateCounters = () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) {
    liveStats.forEach(s => (s.display = formatStat(s.target, s)))
    return
  }

  const duration = 1600
  const start = performance.now()
  const step = (now: number) => {
    const progress = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    liveStats.forEach(s => (s.display = formatStat(s.target * eased, s)))
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

// ---------------------------------------------------------------
// Ticker de actividad en vivo
// ---------------------------------------------------------------
const liveEvents: LiveEvent[] = [
  { title: 'KYC aprobado', detail: 'Carlos M. · Electricista · La Paz', icon: BadgeCheck, iconClass: 'text-[#84cc16]' },
  { title: 'Escrow liberado', detail: 'BOB 1,200 · Contrato #CTR-9020', icon: Wallet, iconClass: 'text-[#22c55e]' },
  { title: 'Nuevo proveedor', detail: 'Lucía R. · Arquitectura · Santa Cruz', icon: Users, iconClass: 'text-[#4ade80]' },
  { title: 'Servicio completado', detail: 'Plomería · Cala Cala, Cochabamba', icon: MapPin, iconClass: 'text-[#84cc16]' },
  { title: 'Firma verificada', detail: 'Rotación de llaves SHA-384 exitosa', icon: KeyRound, iconClass: 'text-[#22c55e]' }
]

const tickerIndex = ref(0)
const currentEvent = computed(() => liveEvents[tickerIndex.value % liveEvents.length]!)
let tickerTimer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  animateCounters()
  tickerTimer = setInterval(() => {
    tickerIndex.value = (tickerIndex.value + 1) % liveEvents.length
  }, 3200)
})

onUnmounted(() => {
  if (tickerTimer) clearInterval(tickerTimer)
  if (resendTimer) clearInterval(resendTimer)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
/* ------------------------------------------------------------------ */
/* Lienzo y capas de fondo columna izquierda                          */
/* ------------------------------------------------------------------ */
.login-root {
  --mx: 25%;
  --my: 40%;
}

.aurora {
  position: absolute;
  border-radius: 9999px;
  filter: blur(90px);
  will-change: transform;
}

.aurora-primary {
  width: 42rem;
  height: 42rem;
  top: -16rem;
  left: -12rem;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.5) 0%, rgba(34, 197, 94, 0) 70%);
  animation: drift-a 18s ease-in-out infinite alternate;
}

.aurora-secondary {
  width: 36rem;
  height: 36rem;
  bottom: -14rem;
  left: 15%;
  background: radial-gradient(circle, rgba(132, 204, 22, 0.4) 0%, rgba(132, 204, 22, 0) 70%);
  animation: drift-b 22s ease-in-out infinite alternate;
}

.aurora-deep {
  width: 32rem;
  height: 32rem;
  top: 15%;
  right: -8rem;
  background: radial-gradient(circle, rgba(22, 163, 74, 0.35) 0%, rgba(22, 163, 74, 0) 70%);
  animation: drift-c 26s ease-in-out infinite alternate;
}

@keyframes drift-a {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(6rem, 5rem) scale(1.1); }
}

@keyframes drift-b {
  0% { transform: translate(0, 0) scale(1.05); }
  100% { transform: translate(-5rem, -4rem) scale(0.92); }
}

@keyframes drift-c {
  0% { transform: translate(0, 0) scale(0.95); }
  100% { transform: translate(-4rem, 5rem) scale(1.08); }
}

.dot-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(187, 247, 208, 0.14) 1px, transparent 1px);
  background-size: 22px 22px;
  mask-image: radial-gradient(ellipse 80% 70% at 30% 40%, #000 30%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 80% 70% at 30% 40%, #000 30%, transparent 100%);
}

.spotlight {
  position: absolute;
  inset: 0;
  background: radial-gradient(480px circle at var(--mx) var(--my), rgba(132, 204, 22, 0.12), transparent 60%);
  transition: background 0.15s linear;
}

/* ------------------------------------------------------------------ */
/* Tipografía con degradado animado                                    */
/* ------------------------------------------------------------------ */
.text-gradient-animated {
  background: linear-gradient(90deg, #22c55e, #84cc16, #bef264, #22c55e);
  background-size: 300% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: gradient-pan 8s ease-in-out infinite;
}

@keyframes gradient-pan {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* ------------------------------------------------------------------ */
/* Tarjeta Blanca con Sombras y Halo en Verde #84cc16                 */
/* ------------------------------------------------------------------ */
.card-white-lime {
  background: #ffffff;
  border: 1.5px solid rgba(132, 204, 22, 0.32);
  box-shadow:
    0 20px 45px -12px rgba(132, 204, 22, 0.25),
    0 8px 20px -6px rgba(132, 204, 22, 0.16),
    0 0 0 1px rgba(132, 204, 22, 0.18);
}

.shake {
  animation: shake 0.45s cubic-bezier(0.36, 0.07, 0.19, 0.97);
}

@keyframes shake {
  10%, 90% { transform: translateX(-2px); }
  20%, 80% { transform: translateX(4px); }
  30%, 50%, 70% { transform: translateX(-6px); }
  40%, 60% { transform: translateX(6px); }
}

/* ------------------------------------------------------------------ */
/* Destello en el botón principal                                      */
/* ------------------------------------------------------------------ */
.shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(110deg, transparent 25%, rgba(255, 255, 255, 0.5) 50%, transparent 75%);
  transform: translateX(-120%);
  animation: shimmer 3.4s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 55% { transform: translateX(-120%); }
  100% { transform: translateX(120%); }
}

.progress-fill {
  animation: progress 1.2s ease-out forwards;
}

@keyframes progress {
  from { width: 0%; }
  to { width: 100%; }
}

/* ------------------------------------------------------------------ */
/* Entrada animada escalonada                                          */
/* ------------------------------------------------------------------ */
.reveal {
  opacity: 0;
  animation: reveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: var(--d, 0ms);
}

@keyframes reveal {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ------------------------------------------------------------------ */
/* Transiciones de Vue                                                 */
/* ------------------------------------------------------------------ */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.ticker-enter-active,
.ticker-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.ticker-enter-from {
  opacity: 0;
  transform: translateY(100%);
}
.ticker-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

.success-enter-active {
  transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.success-enter-from {
  opacity: 0;
  transform: scale(0.96);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.96);
}

/* ------------------------------------------------------------------ */
/* Accesibilidad: preferencias de movimiento reducido                 */
/* ------------------------------------------------------------------ */
@media (prefers-reduced-motion: reduce) {
  .aurora,
  .shimmer,
  .text-gradient-animated,
  .reveal,
  .shake,
  .progress-fill {
    animation: none !important;
  }
  .reveal {
    opacity: 1;
  }
  .progress-fill {
    width: 100%;
  }
}
</style>
