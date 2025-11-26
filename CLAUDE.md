# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an interactive whitepaper showcasing AI adoption trends through data visualizations. It's a vanilla JavaScript application with no build tools or framework dependencies - designed for simplicity and direct browser execution.

## Development Commands

### Starting the Development Server

```bash
# Recommended: Live-server with auto-reload
live-server --port=8080

# Alternative: Python HTTP server (requires manual refresh)
python3 -m http.server 8000
```

### Stopping the Server
Press `Ctrl+C` in the terminal where the server is running.

## Architecture

### Module Structure

The application follows a modular ES6 architecture with clear separation of concerns:

- **js/main.js** - Application entry point that orchestrates all functionality:
  - Chart initialization with Chart.js
  - Navigation and scroll handling
  - Event listener setup
  - Application lifecycle management

- **js/core/state.js** - Centralized state management using a pub/sub pattern:
  - `StateManager` class handles all application state
  - Singleton instance `appState` exported for global access
  - Manages current section, scroll progress, mobile menu state, and chart instances
  - Provides subscribe/notify pattern for reactive updates

- **js/core/utils.js** - Reusable utility functions:
  - Performance optimizations: `debounce()` and `throttle()`
  - Data fetching: `fetchJSON()` with error handling
  - Scroll calculations: `getActiveSection()`, `calculateProgress()`
  - Accessibility: `prefersReducedMotion()`

### Data Flow

1. HTML imports `js/main.js` as ES6 module
2. `main.js` imports dependencies from `core/` modules
3. On DOM ready, `initApp()` orchestrates:
   - Navigation setup
   - Chart initialization (parallel async data loading)
   - Event listener registration
4. Charts load data from `data/*.json` via `fetchJSON()`
5. State changes flow through `StateManager` pub/sub system

### Chart System

Charts are managed through a unified system:
- All charts use shared `chartDefaults` configuration
- Chart.js instances stored in `appState.state.charts` object
- Three chart types: line (trends), bar (comparisons), scatter (metrics)
- Charts respect `prefers-reduced-motion` accessibility setting
- Charts auto-resize on window resize via debounced handler

## Styling Architecture

CSS is modular and organized by concern:

- **css/theme.css** - Design system foundation with CSS custom properties:
  - Color palette (dark theme with coral/orange accents matching Sigma Labs brand)
  - Typography scale and font definitions (Raleway font family)
  - Spacing system (8px base unit)
  - Shadow definitions
  - Animation timing variables

- **css/main.css** - Global styles and imports orchestrator
- **css/typography.css** - Text styles and hierarchy
- **css/layout.css** - Grid system and responsive layouts
- **css/navigation.css** - Navigation bar and progress indicator
- **css/components.css** - Reusable UI components
- **css/animations.css** - Keyframes and transition effects

### Design Tokens

Key color scheme (from theme.css):
- Primary background: `#3a3a3a`
- Accent color: `#e88856` (coral orange - Sigma Labs brand)
- Dark, professional aesthetic with subtle gradients

## Key Patterns

### Event Handling Performance
All scroll and resize handlers use `throttle()` or `debounce()` to prevent performance issues:
```javascript
const handleScroll = throttle(() => { /* ... */ }, 100);
const handleResize = debounce(() => { /* ... */ }, 250);
```

### Async Chart Initialization
Charts initialize in parallel for better performance:
```javascript
await Promise.all([
  initLineChart(),
  initBarChart(),
  initScatterChart()
]);
```

### State Management Pattern
Use `appState` singleton for all shared state:
```javascript
appState.setState('key', value);  // Set state
appState.getState('key');         // Get state
appState.subscribe('key', callback); // React to changes
```

### Chart Lifecycle
- Charts stored via `appState.setChart(id, chart)`
- Retrieved via `appState.getChart(id)`
- Cleanup on page unload via `appState.destroyAllCharts()`

## File Locations

- **HTML**: Single page application in `index.html`
- **JavaScript modules**: `js/main.js` and `js/core/`
- **Stylesheets**: `css/` directory (modular organization)
- **Chart data**: `data/` directory (JSON format)
- **Assets**: `assets/` directory (images, icons)

## Important Constraints

1. **No build tools** - This is intentional. The project uses vanilla JavaScript and runs directly in the browser.
2. **ES6 modules** - Use `import`/`export` syntax, not CommonJS.
3. **Browser-native APIs** - No polyfills or transpilation. Target modern browsers (Chrome/Edge 90+, Firefox 88+, Safari 14+).
4. **Local server required** - Charts load JSON via fetch API, which requires HTTP protocol (not file://).
5. **Chart.js via CDN** - Version 4.4.1 loaded from jsdelivr CDN in HTML.

## Accessibility Features

- Semantic HTML5 elements used throughout
- Keyboard navigation support on all interactive elements
- `prefers-reduced-motion` respected in animations and chart transitions
- ARIA labels on mobile menu toggle
- Focus indicators on interactive elements
- Progress indicator for reading progress

## Common Tasks

### Adding a New Chart
1. Create JSON data file in `data/` directory following Chart.js format
2. Add chart initialization function in `js/main.js` (follow `initLineChart` pattern)
3. Call new init function in `initializeCharts()` Promise.all
4. Add canvas element to `index.html` with appropriate ID

### Modifying Colors
Edit CSS custom properties in `css/theme.css`:
```css
:root {
  --color-accent-primary: #e88856; /* Coral orange */
}
```

### Adding New Sections
1. Add section to `index.html` with class `content-section observe-fade`
2. Add navigation link to `nav-menu` in HTML
3. Section ID will automatically integrate with scroll tracking and navigation system
