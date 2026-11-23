import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { ModuloMenuDto } from '@/api/types/auth.types'
import { useUserStore } from '@/store/user'

export interface EffectivePermissions {
  puedeVer: boolean
  puedeCrear: boolean
  puedeEditar: boolean
  puedeEliminar: boolean
}

const ROUTE_ALIAS_GROUPS: string[][] = [
  ['/pagos', '/finanzas/pagos'],
  ['/categorias', '/catalogo/categorias'],
  ['/auditoria', '/admin/auditoria'],
  ['/configuracion', '/admin/configuracion'],
  ['/usuarios/personal', '/admin/usuarios'],
  ['/usuarios/clientes', '/clientes'],
  ['/usuarios/prestadores', '/proveedores'],
  ['/finanzas/reportes', '/reportes'],
]

function normalizeRoutePath(path?: string | null): string {
  const cleaned = (path || '').trim().toLowerCase().replace(/\/+$/, '')
  if (!cleaned) return '/'
  return cleaned.startsWith('/') ? cleaned : `/${cleaned}`
}

function getRouteCandidates(path?: string | null): string[] {
  const normalized = normalizeRoutePath(path)
  for (const group of ROUTE_ALIAS_GROUPS) {
    if (group.includes(normalized)) {
      return group
    }
  }
  return [normalized]
}

function flattenModulos(lista: ModuloMenuDto[]): ModuloMenuDto[] {
  const result: ModuloMenuDto[] = []
  for (const mod of lista) {
    result.push(mod)
    if (Array.isArray(mod.submodulos) && mod.submodulos.length > 0) {
      result.push(...flattenModulos(mod.submodulos))
    }
  }
  return result
}

function findModuloByPath(
  path: string,
  modulos: ModuloMenuDto[]
): ModuloMenuDto | undefined {
  if (!Array.isArray(modulos) || modulos.length === 0) return undefined
  const candidates = getRouteCandidates(path)
  const flat = flattenModulos(modulos)

  return flat.find((mod) => {
    if (!mod.ruta) return false
    const normMod = normalizeRoutePath(mod.ruta)
    return candidates.includes(normMod)
  })
}

export function getModulePermissions(
  path: string,
  modulos: ModuloMenuDto[]
): EffectivePermissions {
  const matched = findModuloByPath(path, modulos)
  if (!matched || !matched.permisos) {
    return {
      puedeVer: false,
      puedeCrear: false,
      puedeEditar: false,
      puedeEliminar: false,
    }
  }

  return {
    puedeVer: Boolean(matched.permisos.puedeVer),
    puedeCrear: Boolean(matched.permisos.puedeCrear),
    puedeEditar: Boolean(matched.permisos.puedeEditar),
    puedeEliminar: Boolean(matched.permisos.puedeEliminar),
  }
}

export function hasRouteAccess(path: string, modulos: ModuloMenuDto[]): boolean {
  return getModulePermissions(path, modulos).puedeVer
}

export function usePermissions(routePath?: string) {
  const route = useRoute()
  const store = useUserStore()

  const permissions = computed<EffectivePermissions>(() =>
    getModulePermissions(routePath ?? route.path, store.modulos)
  )

  const puedeVer = computed(() => permissions.value.puedeVer)
  const puedeCrear = computed(() => permissions.value.puedeCrear)
  const puedeEditar = computed(() => permissions.value.puedeEditar)
  const puedeEliminar = computed(() => permissions.value.puedeEliminar)

  return {
    permissions,
    puedeVer,
    puedeCrear,
    puedeEditar,
    puedeEliminar,
  }
}

export default usePermissions
