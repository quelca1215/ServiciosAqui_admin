<template>
  <div
    class="relative min-h-screen lg:h-screen w-full flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden selection:bg-[#84cc16] selection:text-[#052e16]"
  >
    <section class="relative w-full lg:w-1/2 h-auto lg:h-full bg-[#041815] text-white px-6 py-5 sm:px-8 sm:py-6 lg:p-12 xl:p-16 flex flex-col justify-between overflow-hidden shrink-0">
      <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div class="brand-glow"></div>
        <div class="brand-grid"></div>
      </div>

      <header class="hidden lg:flex relative z-10 items-center justify-between reveal" style="--d: 0ms">
        <span class="text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-200/55">
          Consola de Administración
        </span>
      </header>

      <div class="relative z-10 my-auto flex items-center gap-4 lg:flex-col lg:items-start lg:gap-0 max-w-md reveal" style="--d: 100ms">
        <div class="relative shrink-0">
          <div
            class="hidden lg:block pointer-events-none absolute -inset-4 rounded-[34px] bg-gradient-to-br from-[#0d9488]/30 via-[#22c55e]/20 to-[#84cc16]/10 blur-2xl"
            aria-hidden="true"
          ></div>
          <div class="relative w-14 h-14 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-[18px] lg:rounded-[28px] p-1 lg:p-1.5 bg-white/[0.05] ring-1 ring-white/15 backdrop-blur-sm shadow-[0_24px_60px_-12px_rgba(0,0,0,0.65)]">
            <img
              :src="logoUrl"
              alt="ServiciosAquí"
              class="w-full h-full object-contain rounded-[14px] lg:rounded-[22px]"
            />
          </div>
        </div>

        <div class="lg:mt-8">
          <h1 class="text-2xl sm:text-3xl lg:text-4xl xl:text-[42px] font-extrabold tracking-tight leading-none text-white">
            Servicios<span class="text-transparent bg-clip-text bg-gradient-to-r from-[#34d399] via-[#22c55e] to-[#84cc16]">Aquí</span>
          </h1>
          <p class="lg:hidden text-xs text-emerald-100/60 mt-1">
            Consola de Administración
          </p>

          <div class="hidden lg:block">
            <div class="w-12 h-[2px] rounded-full bg-gradient-to-r from-[#34d399] to-[#84cc16] my-6"></div>
            <p class="text-lg xl:text-xl font-medium text-white/90 leading-snug tracking-tight">
              Gestión centralizada de tu plataforma.
            </p>
            <p class="mt-3 text-sm text-emerald-100/55 leading-relaxed max-w-sm">
              Administra usuarios, pagos y operaciones desde un entorno seguro y unificado.
            </p>
          </div>
        </div>
      </div>

      <footer class="hidden lg:flex relative z-10 reveal items-center justify-between text-xs text-emerald-100/40 pt-5 border-t border-white/[0.08]" style="--d: 240ms">
        <span>© {{ currentYear }} ServiciosAquí Bolivia</span>
        <span class="flex items-center gap-2 font-mono">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          v2.0
        </span>
      </footer>
    </section>

    <main class="relative w-full lg:w-1/2 h-auto lg:h-full bg-[#fbfdfb] flex items-center justify-center p-6 sm:p-8 xl:p-12 overflow-y-auto border-t lg:border-t-0 lg:border-l border-slate-200/80">
      
      <div class="w-full max-w-md reveal" style="--d: 150ms">

        <div
          class="card-white-lime relative rounded-[28px] p-7 sm:p-9 overflow-hidden"
          :class="{ shake: isShaking }"
        >
          <div class="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full bg-[#84cc16]/10 blur-2xl" aria-hidden="true"></div>

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

          <form @submit.prevent="handleAdminLogin" class="relative space-y-4" novalidate>

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

            <button
              type="submit"
              :disabled="isLoading || loginSuccess"
              class="cta-btn group relative w-full overflow-hidden rounded-xl py-3.5 px-5 font-black text-sm text-[#052e16] bg-gradient-to-r from-[#22c55e] to-[#84cc16] shadow-[0_12px_28px_-8px_#84cc16] hover:shadow-[0_16px_36px_-6px_#84cc16] hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#84cc16]/30 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer"
            >
              <span class="shimmer" aria-hidden="true"></span>
              <span class="relative flex items-center justify-center gap-2">
                <template v-if="isLoading">
                  <span class="w-4 h-4 border-2 border-[#052e16] border-t-transparent rounded-full animate-spin"></span>
                  Accediendo a la consola...
                </template>
                <template v-else>
                  Ingresar a la consola
                  <ArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </template>
              </span>
            </button>
          </form>

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

        <p class="text-center text-[11px] text-slate-400 mt-4 flex items-center justify-center gap-1.5 font-medium">
          <ShieldCheck class="w-3.5 h-3.5 text-[#16a34a]" />
          Conexión cifrada de extremo a extremo · Acceso monitorizado
        </p>
      </div>
    </main>

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
          <div class="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-36 bg-[#84cc16]/15 rounded-full blur-3xl" aria-hidden="true"></div>

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

          <div v-if="forgotStep !== 4" class="relative mb-6">
            <div class="flex items-center justify-between mb-5 px-1 sm:px-2">
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
import { reactive, ref, computed, nextTick, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/api'
import logoUrl from '@/assets/serviciosAqui.png'
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
  KeyRound,
  Fingerprint,
  X,
  Check,
  RefreshCw
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
  remember: true
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

  if (!credentials.email.trim()) {
    triggerError('Por favor ingresa tu correo de operador.')
    return
  }

  if (!credentials.secretKey) {
    triggerError('Por favor ingresa tu contraseña.')
    return
  }

  isLoading.value = true

  try {
    await authService.login({
      email: credentials.email.trim(),
      password: credentials.secretKey,
      remember: credentials.remember
    })

    loginSuccess.value = true
    setTimeout(async () => {
      try {
        await router.push('/dashboard')
      } catch (navErr) {
        console.error('Redirección con router falló:', navErr)
        window.location.href = '/dashboard'
      }
    }, 800)
  } catch (error: any) {
    console.error('Error de login:', error)
    triggerError(error.message || 'Error al conectar con la API. Verifica tus credenciales.')
  } finally {
    isLoading.value = false
  }
}

onUnmounted(() => {
  if (resendTimer) clearInterval(resendTimer)
})
</script>

<style scoped>
.brand-glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(60% 50% at 24% 38%, rgba(13, 148, 136, 0.24) 0%, transparent 70%),
    radial-gradient(45% 40% at 78% 82%, rgba(34, 197, 94, 0.14) 0%, transparent 70%);
}

.brand-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-size: 24px 24px;
  mask-image: radial-gradient(ellipse 75% 65% at 30% 45%, #000 15%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 75% 65% at 30% 45%, #000 15%, transparent 100%);
}

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

.reveal {
  opacity: 0;
  animation: reveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: var(--d, 0ms);
}

@keyframes reveal {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
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

@media (prefers-reduced-motion: reduce) {
  .shimmer,
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
