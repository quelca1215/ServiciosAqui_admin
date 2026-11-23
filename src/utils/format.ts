export interface JsonDiffRow {
  campo: string
  antes: string
  despues: string
  cambio: boolean
}

export function formatBs(monto: number): string {
  const num = Number.isFinite(monto) ? monto : 0
  return `Bs. ${num.toLocaleString('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function formatFecha(iso?: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('es-BO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatFechaHora(iso?: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString('es-BO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getIniciales(nombre?: string | null, fallback = 'SA'): string {
  const parts = (nombre || '').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return fallback
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return `${parts[0]!.charAt(0)}${parts[1]!.charAt(0)}`.toUpperCase()
}

export function shortId(id?: string | null): string {
  const trimmed = (id || '').trim()
  if (!trimmed) return '—'
  return trimmed.length > 10 ? `${trimmed.slice(0, 8)}...` : trimmed
}

export function maskAccountNumber(cuenta?: string | null): string {
  const trimmed = (cuenta || '').trim()
  if (!trimmed) return '—'
  if (trimmed.length <= 4) return '••••'
  return `••••${trimmed.slice(-4)}`
}

export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export function parseUserAgent(ua?: string | null): string {
  const raw = (ua || '').trim()
  if (!raw) return 'Dispositivo desconocido'
  const lower = raw.toLowerCase()

  if (lower.includes('dart') || lower.includes('flutter') || lower.includes('okhttp')) {
    return 'App Móvil'
  }
  if (lower.includes('postman') || lower.includes('insomnia') || lower.includes('curl')) {
    return 'Cliente HTTP'
  }

  let browser = 'Navegador web'
  if (lower.includes('edg/')) browser = 'Edge'
  else if (lower.includes('opr/') || lower.includes('opera')) browser = 'Opera'
  else if (lower.includes('chrome/') && !lower.includes('edg/')) browser = 'Chrome'
  else if (lower.includes('firefox/')) browser = 'Firefox'
  else if (lower.includes('safari/') && !lower.includes('chrome/')) browser = 'Safari'

  let os = ''
  if (lower.includes('iphone')) os = 'iPhone'
  else if (lower.includes('ipad')) os = 'iPad'
  else if (lower.includes('android')) os = 'Android'
  else if (lower.includes('windows')) os = 'Windows'
  else if (lower.includes('mac os') || lower.includes('macintosh')) os = 'macOS'
  else if (lower.includes('linux')) os = 'Linux'

  return os ? `${browser} · ${os}` : browser
}

function tryParseJsonObject(raw?: string | null): Record<string, unknown> | null {
  if (!raw || !raw.trim()) return null
  try {
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>
    }
    return null
  } catch {
    return null
  }
}

function formatDiffValue(val: unknown): string {
  if (val === undefined) return '—'
  if (val === null) return 'Sin valor'
  if (typeof val === 'boolean') return val ? 'Sí' : 'No'
  if (typeof val === 'object') return JSON.stringify(val)
  return String(val)
}

export function buildJsonDiffRows(
  beforeJson?: string | null,
  afterJson?: string | null
): JsonDiffRow[] {
  const beforeObj = tryParseJsonObject(beforeJson)
  const afterObj = tryParseJsonObject(afterJson)

  if (!beforeObj && !afterObj) return []

  const keys = new Set<string>([
    ...Object.keys(beforeObj || {}),
    ...Object.keys(afterObj || {}),
  ])

  return Array.from(keys).map((campo) => {
    const antes = formatDiffValue(beforeObj?.[campo])
    const despues = formatDiffValue(afterObj?.[campo])
    return {
      campo,
      antes,
      despues,
      cambio: antes !== despues,
    }
  })
}

export function formatConfigKey(clave?: string | null): string {
  const raw = (clave || '').trim()
  if (!raw) return 'Parámetro del sistema'
  const words = raw
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_.-]+/g, ' ')
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)

  if (words.length === 0) return raw
  words[0] = words[0]!.charAt(0).toUpperCase() + words[0]!.slice(1)
  return words.join(' ')
}
