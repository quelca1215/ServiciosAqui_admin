<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Bitácora de Auditoría (Audit Log)</h2>
        <p class="text-slate-500 text-sm mt-0.5">
          Trazabilidad inmutable de acciones administrativas, accesos a bóveda y autorizaciones de pago.
        </p>
      </div>

      <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-mono">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        Streaming de eventos activo
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
      <div class="space-y-3 font-mono text-xs">
        <div 
          v-for="log in auditLogs" 
          :key="log.id"
          class="p-3 rounded-xl bg-slate-50/70 border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
        >
          <div class="flex items-center gap-3">
            <span :class="['px-2 py-0.5 rounded text-[10px] font-bold', log.badgeClass]">
              {{ log.level }}
            </span>
            <span class="text-slate-400 text-[11px]">{{ log.timestamp }}</span>
            <span class="text-slate-800 font-semibold">{{ log.event }}</span>
          </div>

          <div class="flex items-center gap-4 text-slate-500 text-[11px]">
            <span>Operador: <strong class="text-slate-700">{{ log.operator }}</strong></span>
            <span>IP: {{ log.ip }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const auditLogs = [
  { id: 1, level: 'INFO', badgeClass: 'bg-emerald-100 text-emerald-800', timestamp: '2026-10-08 13:28:10', event: 'Liberación de fondo Escrow #CTR-9020 autorizada', operator: 'Gabriel Admin', ip: '190.181.42.12' },
  { id: 2, level: 'KYC', badgeClass: 'bg-blue-100 text-blue-800', timestamp: '2026-10-08 13:14:02', event: 'Aprobación de documento de identidad CI: 6849201 LP', operator: 'Gabriel Admin', ip: '190.181.42.12' },
  { id: 3, level: 'SECURITY', badgeClass: 'bg-purple-100 text-purple-800', timestamp: '2026-10-08 12:45:00', event: 'Inicio de sesión administrativo con autenticación de dos factores (2FA)', operator: 'Gabriel Admin', ip: '190.181.42.12' },
  { id: 4, level: 'WARN', badgeClass: 'bg-amber-100 text-amber-800', timestamp: '2026-10-08 11:30:22', event: 'Disputa abierta por el cliente en contrato #CTR-9019', operator: 'Sistema Automático', ip: 'NODO-CORE-01' }
]
</script>

