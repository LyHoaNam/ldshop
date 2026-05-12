# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Tiệm Cơm Nam Vinh - Đường Đua Lấy Cơm** is a lightweight, zero-dependency web application that randomly selects someone to pick up lunch using a playful racing game animation. It's entirely client-side with no build process, server, or external dependencies.

## Running the Application

This is a **static HTML/CSS/JS site** — no build step required.

### Development
```bash
# Option 1: Open directly in browser (simplest)
open index.html

# Option 2: Use a local HTTP server (recommended for testing)
# Python 3
python -m http.server 8000
# Then navigate to http://localhost:8000

# Node.js
npx http-server
```

### Testing
There is no test suite. Test features manually by:
1. Opening the app in a browser
2. Adding racers (2+ required)
3. Selecting participants and starting a race
4. Verifying animations, confetti, and winner modal display
5. Testing data persistence (refresh page, verify racers still exist)
6. Testing export/import JSON functionality

## Architecture

The application uses a **modular, class-based design** with clear separation of concerns:

### Core Modules (js/ directory)

**config.js** (Constants)
- Avatar emoji list (30+ options)
- Race settings (min/max racers, speed, animation frame rate)
- Confetti configuration (colors, count, duration)
- CSS selectors for DOM elements
- localStorage key names

**data.js** (DataManager class)
- CRUD operations on racers (add, delete, update)
- localStorage read/write (auto-persist after each operation)
- JSON import/export functionality
- Selection state management (selectedRacers array)
- Avatar selection state

**ui.js** (UIManager class)
- DOM rendering (racer grid, management panel, race track)
- Event handling (click listeners for buttons, racer selection)
- Modal management (winner announcement modal)
- Confetti animation generation
- Class toggling for visibility and interaction states

**race.js** (RaceEngine class)
- Animation loop using `setInterval` with CONFIG.race.animationSpeed
- Speed calculation with randomization (baseSpeed ± speedVariation)
- Horizontal lane positioning (moves racers across screen from 0% to 100%)
- Finish detection and winner determination
- Modal show/hide logic

**app.js** (Application initialization)
- Page load setup (load data, attach event listeners, populate UI)
- URL parameter parsing (`?start=true`, `?racers=Name1,Name2`, `?all=true`)
- Keyboard shortcuts (e.g., Enter key to start race)

**index.html** (DOM structure)
- Header with shop/owner photos and title
- Control buttons (start race, manage racers, reset)
- Race track with animated lane dividers
- Racer management modal (add/delete interface)
- Emoji avatar picker dropdown
- Winner announcement modal with confetti background
- Import/export file inputs

### Data Flow

1. **Initialization** → app.js loads localStorage via DataManager.loadData()
2. **Racer Management** → UIManager renders grid; user clicks to add/delete; DataManager persists to localStorage
3. **Race Start** → UIManager toggles visibility; RaceEngine.startRace() runs animation loop
4. **Animation Loop** → Each frame (every 50ms), RaceEngine updates racer position % based on randomized speed
5. **Finish** → When racer reaches 100%, RaceEngine determines winner and displays modal
6. **Stats Update** → DataManager increments winner's win count; persisted to localStorage

### Key Constraints & Tradeoffs

- **No Build Process**: All code must be vanilla JavaScript (ES6 at most). No transpilation or bundling.
- **Browser-Only**: No backend. All data lives in localStorage (5-10MB limit depending on browser). Sessions are not shared across devices/browsers.
- **Animation Loop**: Uses `setInterval` with fixed 50ms frame rate. RaceEngine doesn't use requestAnimationFrame (consider upgrading for smoother motion if needed).
- **Confetti**: Generated via DOM elements, not canvas. Higher CPU on slower devices if count is high (currently 100).
- **CSS Classes**: UI state heavily relies on class toggling (display: none/block, opacity). Consider reviewing selectors in main.css if styling issues occur.

## Configuration Points

Most customization is in **js/config.js**:

- **Avatar emojis**: Add/remove from `CONFIG.avatarEmojis` array
- **Race speed**: Adjust `baseSpeed` (default 2) and `speedVariation` (default 3)
- **Min/max racers**: Change `minRacers` (2) and `maxRacers` (8)
- **Confetti**: Modify `count`, `colors`, `duration`, `delay`
- **Storage key**: If changing localStorage behavior, update `CONFIG.storage.racerData`

Colors and fonts are in **styles/main.css**:
- Primary colors: #DA251D (red), #FFCD00 (gold), #FF6B35 (orange)
- Fonts: Nunito (body), Be Vietnam Pro (headers) — loaded from Google Fonts
- Animations: CSS keyframes for running, bouncing, confetti

## Common Tasks

### Adding a New Feature
1. Determine which module owns it (data-related → DataManager, UI → UIManager, animation → RaceEngine)
2. Add logic to that class
3. Call the new method from app.js or UI event handlers
4. Update config.js if new constants are needed
5. Test manually in browser

### Fixing a Bug
1. Identify which module is affected
2. Check browser console for errors
3. Use `console.log()` for debugging (no debugger breakpoints assumed)
4. Test in multiple browsers if CSS/animation related
5. Verify localStorage isn't corrupted (`localStorage.clear()` to reset if needed)

### Changing Race Animation Behavior
Edit the `startRace()` method in race.js:
- Modify the `setInterval` logic to change frame timing
- Update position calculation to change movement pattern
- Adjust speed randomization logic if needed

### Modifying the Winner Modal
Edit **ui.js** `showWinnerModal()` and **styles/main.css** `.winner-modal` class. Note that confetti is generated programmatically with DOM elements during the animation.

## Important Notes

- **No Git Hooks**: Commit directly; there are no pre-commit checks.
- **localStorage Limits**: If racer count grows very large (100+), consider using IndexedDB or adding data cleanup logic.
- **Image Paths**: Shop and owner photos use relative paths (`assets/images/shop.jpg`, `assets/images/owner.jpg`). If paths change, update both index.html and config references.
- **Vietnamese Text**: UI labels are in Vietnamese. Be careful when searching/replacing text strings to avoid breaking UX.
- **Event Delegation**: Most events are attached via `onclick` attributes in HTML or direct addEventListener calls in JS. No event delegation pattern used.

## File Editing Guidelines

- Keep modules focused: config.js = constants, data.js = storage, ui.js = rendering, race.js = animation
- Avoid circular dependencies (all modules safely import config.js, but don't cross-import each other)
- DOM selectors must match config.js selectors object
- Any new CSS classes should follow existing naming (e.g., `.btn-*`, `.racer-*`)
- Console logs are left in for debugging; feel free to remove before production if needed
