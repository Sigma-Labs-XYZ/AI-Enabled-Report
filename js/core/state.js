/* ==========================================
   STATE MANAGEMENT - Simple Pub/Sub Pattern
   ========================================== */

export class StateManager {
  constructor() {
    this.state = {
      currentSection: 'hero',
      scrollProgress: 0,
      mobileMenuOpen: false,
      chartsInitialized: false,
      charts: {}
    };

    this.listeners = new Map();
  }

  /**
   * Get current state or specific key
   */
  getState(key = null) {
    return key ? this.state[key] : { ...this.state };
  }

  /**
   * Set state and notify listeners
   */
  setState(key, value) {
    const oldValue = this.state[key];

    if (oldValue !== value) {
      this.state[key] = value;
      this.notify(key, value, oldValue);
    }
  }

  /**
   * Update multiple state values at once
   */
  updateState(updates) {
    Object.entries(updates).forEach(([key, value]) => {
      this.setState(key, value);
    });
  }

  /**
   * Subscribe to state changes
   */
  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }

    this.listeners.get(key).push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(key);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  /**
   * Notify all listeners for a specific key
   */
  notify(key, newValue, oldValue) {
    const callbacks = this.listeners.get(key) || [];
    callbacks.forEach(callback => {
      callback(newValue, oldValue);
    });
  }

  /**
   * Store chart instance
   */
  setChart(id, chart) {
    this.state.charts[id] = chart;
  }

  /**
   * Get chart instance
   */
  getChart(id) {
    return this.state.charts[id];
  }

  /**
   * Destroy all charts
   */
  destroyAllCharts() {
    Object.values(this.state.charts).forEach(chart => {
      if (chart && typeof chart.destroy === 'function') {
        chart.destroy();
      }
    });
    this.state.charts = {};
  }
}

// Create singleton instance
export const appState = new StateManager();
