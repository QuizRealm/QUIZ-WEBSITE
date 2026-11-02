/* Legacy entry point: automatic Firebase telemetry has been retired. */
export const trackEvent = (name, data = {}) => window.GameEngine?.trackEvent(name, data);
