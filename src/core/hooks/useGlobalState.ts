/**
 * Hook para manejar estado global compartido entre instancias
 * Este tipo de patrón es útil cuando necesitamos compartir estado
 * entre diferentes hooks y componentes sin usar un estado global
 * completo como Redux o Context.
 */

// Valores por defecto para las variables globales
const globalState = {
  lastErrorTimestamp: { value: 0 },
  isNetworkErrorActive: { value: false },
  globalCooldownUntil: { value: 0 }
};

/**
 * Hook que proporciona acceso a un estado global simple para tracking
 * de errores y estado de la red.
 * 
 * Al no usar useState, estos valores persisten entre renderizados
 * y son compartidos entre todos los componentes
 */
export function useGlobalState() {
  /**
   * Registra un error de red y establece un cooldown global
   */
  const setNetworkError = (cooldownMs = 5000) => {
    globalState.lastErrorTimestamp.value = Date.now();
    globalState.isNetworkErrorActive.value = true;
    globalState.globalCooldownUntil.value = Date.now() + cooldownMs;
    
    // Establecer un timeout para limpiar el estado de error después del cooldown
    setTimeout(() => {
      if (Date.now() >= globalState.globalCooldownUntil.value) {
        globalState.isNetworkErrorActive.value = false;
      }
    }, cooldownMs);
  };
  
  /**
   * Comprueba si estamos en un período de cooldown global por error de red
   */
  const isInGlobalCooldown = () => {
    return Date.now() < globalState.globalCooldownUntil.value;
  };
  
  /**
   * Limpia manualmente el estado de error
   */
  const clearNetworkError = () => {
    globalState.isNetworkErrorActive.value = false;
    globalState.globalCooldownUntil.value = 0;
  };
  
  /**
   * Devuelve el estado actual del sistema respecto a errores de red
   */
  const getNetworkErrorState = () => {
    return {
      lastErrorTime: globalState.lastErrorTimestamp.value,
      isErrorActive: globalState.isNetworkErrorActive.value,
      cooldownUntil: globalState.globalCooldownUntil.value,
      isInCooldown: isInGlobalCooldown()
    };
  };
  
  return {
    setNetworkError,
    isInGlobalCooldown,
    clearNetworkError,
    getNetworkErrorState
  };
} 