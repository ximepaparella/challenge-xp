/**
 * Hook for managing global state shared between instances.
 * This pattern is useful when we need to share state
 * between different hooks and components without using
 * a full global state solution like Redux or Context.
 */

// Default values for global variables
const globalState = {
  lastErrorTimestamp: { value: 0 },
  isNetworkErrorActive: { value: false },
  globalCooldownUntil: { value: 0 }
};

/**
 * Hook that provides access to a simple global state for tracking
 * errors and network status.
 * 
 * By not using useState, these values persist between renders
 * and are shared between all components
 */
export function useGlobalState() {
  /**
   * Registers a network error and sets a global cooldown
   * @param cooldownMs - Duration of the cooldown period in milliseconds
   */
  const setNetworkError = (cooldownMs = 5000) => {
    globalState.lastErrorTimestamp.value = Date.now();
    globalState.isNetworkErrorActive.value = true;
    globalState.globalCooldownUntil.value = Date.now() + cooldownMs;
    
    // Set a timeout to clear the error state after the cooldown
    setTimeout(() => {
      if (Date.now() >= globalState.globalCooldownUntil.value) {
        globalState.isNetworkErrorActive.value = false;
      }
    }, cooldownMs);
  };
  
  /**
   * Checks if we are in a global cooldown period due to a network error
   * @returns {boolean} True if in global cooldown
   */
  const isInGlobalCooldown = () => {
    return Date.now() < globalState.globalCooldownUntil.value;
  };
  
  /**
   * Manually clears the error state
   */
  const clearNetworkError = () => {
    globalState.isNetworkErrorActive.value = false;
    globalState.globalCooldownUntil.value = 0;
  };
  
  /**
   * Returns the current system state regarding network errors
   * @returns Current network error state object
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