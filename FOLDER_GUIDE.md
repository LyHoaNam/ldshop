# 📂 Folder Structure & File Guide

Complete visual guide to the project structure and what each file does.

---

## 🗂️ Full Directory Tree

```
tiemcom-race-app/
│
├── 📄 .git/
│   └── [Git repository data - auto-managed]
│       └── Contains 4 commits with full history
│
├── 📄 .gitignore
│   └── Git configuration - tells Git which files to ignore
│       • node_modules/
│       • IDE files (.vscode/, .idea/)
│       • OS files (.DS_Store, Thumbs.db)
│       • Local cache and temp files
│
├── 🌐 index.html (5.3 KB)
│   └── MAIN ENTRY POINT - Open this in your browser!
│       • HTML5 structure
│       • Links all CSS & JS files
│       • Defines page layout
│       • Image placeholders (replace with your photos)
│
├── 📚 README.md (6.5 KB)
│   └── Full documentation
│       • Feature list
│       • Usage instructions
│       • Browser compatibility
│       • License info
│
├── ⚡ QUICKSTART.md (2.1 KB)
│   └── Fast getting started guide
│       • 2-minute setup
│       • Basic usage
│       • Deployment options
│       • Troubleshooting
│
├── 🔧 SETUP.md (12 KB)
│   └── Complete setup & configuration guide
│       • Installation instructions
│       • Configuration options
│       • Development guide
│       • Deployment walkthrough
│       • Git workflows
│
├── 📊 PROJECT_SUMMARY.md (8 KB)
│   └── Complete project overview
│       • What you have
│       • Tech stack
│       • Architecture
│       • Quick reference
│
├── 📂 styles/
│   │
│   └── 🎨 main.css (17 KB, 581 lines)
│       └── ALL styling for the entire app
│           • Header banner design
│           • Race track animation
│           • Button styles
│           • Colors & theme
│           • Responsive design
│           • Animations & transitions
│           • Mobile optimization
│
├── 📂 js/
│   │
│   ├── ⚙️ config.js (1.4 KB, 53 lines)
│   │   └── CONFIGURATION & CONSTANTS
│   │       • Avatar emoji list (30 emojis)
│   │       • Race settings (min/max racers, speed)
│   │       • Confetti settings
│   │       • UI element selectors
│   │       • Storage key names
│   │       ➜ EDIT THIS to customize settings!
│   │
│   ├── 💾 data.js (7.8 KB, 220 lines)
│   │   └── DATA MANAGEMENT (DataManager class)
│   │       • CRUD operations:
│   │         - addRacer(name, avatar)
│   │         - deleteRacer(id)
│   │         - getRacerById(id)
│   │         - getAllRacers()
│   │       • localStorage management
│   │       • Import/export JSON
│   │       • Win tracking
│   │       • Data validation
│   │
│   ├── 🎨 ui.js (8.5 KB, 240 lines)
│   │   └── USER INTERFACE (UIManager class)
│   │       • Render racer grid
│   │       • Render race lanes
│   │       • Handle button clicks
│   │       • Avatar selection
│   │       • Winner modal display
│   │       • Confetti animation
│   │       • Import/export UI
│   │
│   ├── 🏁 race.js (6.1 KB, 173 lines)
│   │   └── RACE LOGIC (RaceEngine class)
│   │       • startRace()
│   │       • runRace() - animation loop
│   │       • finishRace() - winner handling
│   │       • resetRace() - state management
│   │       • Speed calculations
│   │       • requestAnimationFrame logic
│   │
│   └── 📱 app.js (2.5 KB, 87 lines)
│       └── INITIALIZATION (App class)
│           • Initialize data & UI
│           • Check URL parameters
│           • Setup keyboard shortcuts
│           • DOMContentLoaded handler
│
├── 📂 assets/
│   │
│   └── 📂 images/
│       ├── 🏪 shop.jpg (MISSING - add your shop photo)
│       │   └── Recommended: 120x120px, <50KB
│       │       Can be JPG, PNG, or GIF
│       │       Will appear in header
│       │       Replace this file!
│       │
│       └── 👩 owner.jpg (MISSING - add owner photo)
│           └── Recommended: 120x120px, <50KB
│               Circular crop will be applied via CSS
│               Can be JPG, PNG, or GIF
│               Replace this file!
│
└── 📄 sample-data.json (948 bytes)
    └── EXAMPLE DATA for import/export testing
        • 6 sample racers
        • Demonstrates JSON format
        • Use to test import functionality
        • Safe to delete after testing
```

---

## 🚀 Quick File Reference

### To GET STARTED
1. **Open:** `index.html`
2. **Read:** `QUICKSTART.md`
3. **Use:** The app!

### To CUSTOMIZE
1. **Colors:** Edit `styles/main.css` (search hex colors)
2. **Settings:** Edit `js/config.js` (avatars, speed)
3. **Features:** Edit `js/ui.js`, `js/race.js`

### To ADD PHOTOS
1. Save photos as: `assets/images/shop.jpg` and `owner.jpg`
2. Recommended size: 120x120px
3. Formats: JPG, PNG, or GIF

### To CONFIGURE GIT
```bash
# These are already done, but reference:
git config user.name "Your Name"
git config user.email "your@email.com"
git remote add origin https://github.com/you/repo
git push -u origin master
```

### To DEPLOY
1. Push to GitHub (git push)
2. Enable Pages in Settings
3. Or drag to Netlify.com
4. Or upload to web server via FTP

---

## 📊 File Sizes

```
main.css        17 KB  ▓▓▓▓▓▓ CSS styles
ui.js            8 KB  ▓▓▓ UI rendering
data.js          8 KB  ▓▓▓ Data management
race.js          6 KB  ▓▓ Race logic
config.js        1 KB  ▓ Configuration
app.js           3 KB  ▓ Initialization
index.html       5 KB  ▓▓ HTML structure
───────────────────────────────
TOTAL           ~50 KB  Total app size
```

---

## 🔄 File Dependencies

```
index.html
    ↓
    ├─→ styles/main.css (styling)
    │
    └─→ js files (in order):
        ├─→ config.js (constants)
        ├─→ data.js (DataManager - needs config)
        ├─→ ui.js (UIManager - needs config & data)
        ├─→ race.js (RaceEngine - needs config & data)
        └─→ app.js (App init - orchestrates all)
```

**Load Order Matters!** Files are loaded in this order in `index.html`.

---

## 📝 What Each File Does

### index.html
```html
✓ Contains all HTML markup
✓ Links CSS file: <link href="styles/main.css">
✓ Links JS files: <script src="js/config.js">
✓ Image placeholders with onerror fallback
✓ Modal, forms, race track structure
```

### styles/main.css
```css
✓ 581 lines of pure CSS
✓ No preprocessing (SASS/LESS)
✓ Responsive design media queries
✓ Animation keyframes (@keyframes)
✓ CSS Grid & Flexbox layouts
✓ Color scheme (red, yellow, gold)
✓ Vietnamese fonts (Nunito, Be Vietnam Pro)
```

### js/config.js
```javascript
✓ CONFIG object with all settings
✓ Avatar emoji array (30 options)
✓ Race parameters (min/max racers, speeds)
✓ Confetti settings (count, colors, duration)
✓ DOM selectors for elements
✓ Storage key names
✓ Change these to customize!
```

### js/data.js
```javascript
✓ DataManager class (CRUD operations)
✓ Methods:
  - loadData() → load from localStorage
  - saveData() → save to localStorage
  - addRacer() → create new racer
  - deleteRacer() → remove racer
  - getRacerById() → get single racer
  - getAllRacers() → get all racers
  - toggleRacerSelection() → select for race
  - addWin() → increment wins
  - exportToJSON() → serialize data
  - importFromJSON() → deserialize data
✓ Creates global: dataManager instance
```

### js/ui.js
```javascript
✓ UIManager class (UI rendering)
✓ Methods:
  - renderRacerGrid() → show all racers
  - updateRaceTrack() → show selected racers
  - initializeAvatarPicker() → show emoji options
  - showWinnerModal() → winner announcement
  - createConfetti() → celebrate effect
  - exportData() → download JSON
  - importData() → upload JSON
✓ Creates global: uiManager instance
```

### js/race.js
```javascript
✓ RaceEngine class (game logic)
✓ Methods:
  - startRace() → validate & begin
  - runRace() → animation loop
  - finishRace() → show winner
  - resetRace() → cleanup state
✓ Global functions:
  - startRace() → onclick handler
  - resetRace() → onclick handler
  - closeWinnerModal() → onclick handler
✓ Uses requestAnimationFrame for smooth 60fps
```

### js/app.js
```javascript
✓ App class (initialization)
✓ Methods:
  - init() → startup sequence
  - checkUrlParameters() → parse URL
  - setupKeyboardShortcuts() → Enter key support
✓ Event listeners:
  - DOMContentLoaded → start when DOM ready
  - window.load → ensure loaded
```

---

## 🎯 Which File to Edit?

| What to Change | Edit This File |
|---|---|
| Colors, fonts, styling | `styles/main.css` |
| Avatar options | `js/config.js` |
| Race speeds | `js/config.js` |
| Button text (Vietnamese) | `index.html` |
| Add racer logic | `js/data.js` |
| UI rendering | `js/ui.js` |
| Race animation | `js/race.js` |
| Add new features | Create in appropriate module |

---

## 📱 Mobile vs Desktop

**Responsive Breakpoint:**
```css
@media (max-width: 768px) {
    /* Mobile styles in main.css */
    /* Smaller fonts, stack layout, etc. */
}
```

Both are in `styles/main.css`.

---

## 🔐 Version Control

### Git Structure
```
.git/
├── objects/          All file versions & commits
├── refs/             Branch pointers
├── HEAD              Current branch
└── config            Local settings
```

### Commits
```
e513512  docs: add project summary overview
e515694  docs: add quick start guide
d274cb1  docs: add comprehensive setup and configuration guide
62ba739  Initial commit: Complete race picker app
```

### Current Branch
```
master (4 commits)
All changes committed
Clean working directory
Ready to push to GitHub
```

---

## 🚀 Deployment File Structure

When deploying, upload **all files except:**
- `.git/` folder (optional, if not using GitHub)
- `.gitignore` (optional)

**Upload these:**
- ✅ `index.html`
- ✅ `styles/` folder
- ✅ `js/` folder
- ✅ `assets/` folder
- ✅ Documentation (optional but nice)

---

## 💡 Tips

1. **Don't modify** `.git/` - Git manages this
2. **Always backup** before major changes
3. **Keep git commits** to track history
4. **Add your photos** to `assets/images/`
5. **Edit config.js** before code for customization
6. **Test locally** before deploying
7. **Use git branches** for major changes

---

## 🎓 Learning Path

**For beginners:**
1. Open `index.html` - see what happens
2. Read `QUICKSTART.md` - understand features
3. Edit `styles/main.css` - change colors
4. Modify `js/config.js` - adjust settings

**For intermediate:**
1. Read `SETUP.md` - understand architecture
2. Review `js/data.js` - learn CRUD operations
3. Modify `js/ui.js` - change UI rendering
4. Create a feature branch - practice git

**For advanced:**
1. Study all modules - understand design
2. Extend classes - add new features
3. Refactor code - improve organization
4. Deploy to production - make it live

---

## ✅ Checklist

- [ ] Understand folder structure
- [ ] Know what each file does
- [ ] Can find files to edit
- [ ] Know how to add your photos
- [ ] Ready to customize!

---

**Happy coding!** 🚀
