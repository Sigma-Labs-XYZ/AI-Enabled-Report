/* ==========================================
   MAIN APPLICATION
   ========================================== */

import { appState } from './core/state.js';
import {
  debounce,
  throttle,
  fetchJSON,
  getActiveSection,
  calculateProgress,
  prefersReducedMotion
} from './core/utils.js';

/* ==========================================
   Chart.js Configuration
   ========================================== */

// Custom Chart.js theme matching our design
const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index'
  },
  animation: {
    duration: prefersReducedMotion() ? 0 : 1000,
    easing: 'easeOutQuart'
  },
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        color: 'rgba(255, 255, 255, 0.8)',
        padding: 20,
        font: {
          size: 14,
          family: 'Raleway, sans-serif'
        },
        usePointStyle: true,
        pointStyle: 'circle'
      }
    },
    tooltip: {
      enabled: true,
      backgroundColor: '#4a4a4a',
      titleColor: '#e88856',
      bodyColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: 'rgba(232, 136, 86, 0.3)',
      borderWidth: 1,
      padding: 12,
      displayColors: true,
      titleFont: {
        size: 14,
        weight: 'bold'
      },
      bodyFont: {
        size: 13
      },
      callbacks: {
        // Custom tooltip formatting will be defined per chart
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.08)',
        drawBorder: false
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.7)',
        font: {
          size: 12
        }
      }
    },
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.08)',
        drawBorder: false
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.7)',
        font: {
          size: 12
        }
      }
    }
  }
};

/* ==========================================
   Chart Initialization Functions
   ========================================== */

/**
 * Initialize Line Chart - AI Adoption Trends
 */
async function initLineChart() {
  try {
    const data = await fetchJSON('./data/ai-adoption-trends.json');
    const ctx = document.getElementById('line-chart');

    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        ...chartDefaults,
        plugins: {
          ...chartDefaults.plugins,
          title: {
            display: true,
            text: 'AI Adoption Trends (2020-2025)',
            color: '#e88856',
            font: {
              size: 18,
              weight: 'bold'
            },
            padding: 20
          },
          tooltip: {
            ...chartDefaults.plugins.tooltip,
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.parsed.y}% adoption`;
              }
            }
          }
        },
        scales: {
          ...chartDefaults.scales,
          y: {
            ...chartDefaults.scales.y,
            min: 0,
            max: 100,
            ticks: {
              ...chartDefaults.scales.y.ticks,
              callback: function(value) {
                return value + '%';
              }
            }
          }
        }
      }
    });

    appState.setChart('line-chart', chart);
  } catch (error) {
    console.error('Error initializing line chart:', error);
  }
}

/**
 * Initialize Bar Chart - Industry Comparison
 */
async function initBarChart() {
  try {
    const data = await fetchJSON('./data/industry-comparison.json');
    const ctx = document.getElementById('bar-chart');

    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        ...chartDefaults,
        plugins: {
          ...chartDefaults.plugins,
          title: {
            display: true,
            text: 'AI Implementation by Industry',
            color: '#e88856',
            font: {
              size: 18,
              weight: 'bold'
            },
            padding: 20
          },
          tooltip: {
            ...chartDefaults.plugins.tooltip,
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.parsed.y}% implementation`;
              }
            }
          }
        },
        scales: {
          ...chartDefaults.scales,
          y: {
            ...chartDefaults.scales.y,
            min: 0,
            max: 100,
            ticks: {
              ...chartDefaults.scales.y.ticks,
              callback: function(value) {
                return value + '%';
              }
            }
          }
        }
      }
    });

    appState.setChart('bar-chart', chart);
  } catch (error) {
    console.error('Error initializing bar chart:', error);
  }
}

/**
 * Initialize Scatter Chart - Performance Metrics
 */
async function initScatterChart() {
  try {
    const data = await fetchJSON('./data/performance-metrics.json');
    const ctx = document.getElementById('scatter-chart');

    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'scatter',
      data: data,
      options: {
        ...chartDefaults,
        plugins: {
          ...chartDefaults.plugins,
          title: {
            display: true,
            text: 'AI Model Performance vs. Complexity',
            color: '#e88856',
            font: {
              size: 18,
              weight: 'bold'
            },
            padding: 20
          },
          legend: {
            display: false
          },
          tooltip: {
            ...chartDefaults.plugins.tooltip,
            callbacks: {
              title: function(context) {
                const point = context[0].raw;
                return point.label || 'AI Model';
              },
              label: function(context) {
                const point = context.raw;
                return [
                  `Complexity: ${point.x}B parameters`,
                  `Performance: ${point.y}%`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            ...chartDefaults.scales.x,
            type: 'logarithmic',
            title: {
              display: true,
              text: 'Model Complexity (Billion Parameters)',
              color: 'rgba(255, 255, 255, 0.9)',
              font: {
                size: 14
              }
            }
          },
          y: {
            ...chartDefaults.scales.y,
            min: 0,
            max: 100,
            title: {
              display: true,
              text: 'Performance Score (%)',
              color: 'rgba(255, 255, 255, 0.9)',
              font: {
                size: 14
              }
            },
            ticks: {
              ...chartDefaults.scales.y.ticks,
              callback: function(value) {
                return value + '%';
              }
            }
          }
        }
      }
    });

    appState.setChart('scatter-chart', chart);
  } catch (error) {
    console.error('Error initializing scatter chart:', error);
  }
}

/**
 * Initialize all charts
 */
async function initializeCharts() {
  if (appState.getState('chartsInitialized')) return;

  try {
    await Promise.all([
      initLineChart(),
      initBarChart(),
      initScatterChart()
    ]);

    appState.setState('chartsInitialized', true);
    console.log('All charts initialized successfully');
  } catch (error) {
    console.error('Error initializing charts:', error);
  }
}

/* ==========================================
   Navigation & Scroll Handling
   ========================================== */

/**
 * Update active navigation link
 */
function updateActiveNav(sectionId) {
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === `#${sectionId}`) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  appState.setState('currentSection', sectionId);
}

/**
 * Update progress indicator
 */
function updateProgressIndicator() {
  const progress = calculateProgress();
  const progressBar = document.getElementById('progress-indicator');

  if (progressBar) {
    progressBar.style.width = `${progress}%`;
  }

  appState.setState('scrollProgress', progress);
}

/**
 * Handle scroll events
 */
const handleScroll = throttle(() => {
  // Update progress bar
  updateProgressIndicator();

  // Update active section
  const sections = document.querySelectorAll('.content-section, #hero');
  const activeSectionId = getActiveSection(Array.from(sections));

  if (activeSectionId) {
    updateActiveNav(activeSectionId);
  }

  // Add scrolled class to nav
  const nav = document.getElementById('main-nav');
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }

  // Reveal sections on scroll (Intersection Observer alternative)
  const observeElements = document.querySelectorAll('.observe-fade');
  observeElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight * 0.8;

    if (isVisible) {
      el.classList.add('visible');
    }
  });
}, 100);

/**
 * Setup navigation click handlers
 */
function setupNavigation() {
  // Navigation links
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').slice(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const offset = targetId === 'hero' ? 0 : 80;
        const targetPosition = targetElement.offsetTop - offset;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        if (appState.getState('mobileMenuOpen')) {
          toggleMobileMenu();
        }
      }
    });
  });

  // Mobile menu toggle
  const menuToggle = document.getElementById('mobile-menu-toggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMobileMenu);
  }

  // Initial scroll handling
  handleScroll();
}

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
  const navMenu = document.getElementById('nav-menu');
  const isOpen = appState.getState('mobileMenuOpen');

  if (navMenu) {
    if (isOpen) {
      navMenu.classList.remove('open');
      appState.setState('mobileMenuOpen', false);
    } else {
      navMenu.classList.add('open');
      appState.setState('mobileMenuOpen', true);
    }
  }
}

/* ==========================================
   Window Resize Handling
   ========================================== */

const handleResize = debounce(() => {
  // Resize charts
  Object.values(appState.getState('charts')).forEach(chart => {
    if (chart && typeof chart.resize === 'function') {
      chart.resize();
    }
  });

  // Close mobile menu on desktop
  if (window.innerWidth > 768 && appState.getState('mobileMenuOpen')) {
    toggleMobileMenu();
  }
}, 250);

/* ==========================================
   Application Initialization
   ========================================== */

async function initApp() {
  console.log('Initializing AI-Native Report...');

  try {
    // Set current month and year in hero subtitle
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
      const now = new Date();
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                         'July', 'August', 'September', 'October', 'November', 'December'];
      dateElement.textContent = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
    }

    // Setup navigation and scroll handling
    setupNavigation();

    // Initialize charts
    await initializeCharts();

    // Setup event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    // Initial visibility check for observe elements
    const observeElements = document.querySelectorAll('.observe-fade');
    observeElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 0.8;
      if (isVisible) {
        el.classList.add('visible');
      }
    });

    console.log('App initialized successfully!');
  } catch (error) {
    console.error('Error initializing app:', error);
  }
}

/* ==========================================
   Start Application
   ========================================== */

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  appState.destroyAllCharts();
});
