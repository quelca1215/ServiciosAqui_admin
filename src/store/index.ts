import { createPinia } from 'pinia'

/**
 * ==============================================================================
 * INSTANCIA GLOBAL DE PINIA Y EXPORTACIÓN DE STORES
 * ==============================================================================
 */
export const pinia = createPinia()

export * from './user'

export default pinia
