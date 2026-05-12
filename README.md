# 🍚 Tiệm Cơm Nam Vinh - Đường Đua Lấy Cơm

A fun, lightweight racing game website to randomly select someone to pick up lunch at Tiệm Cơm Nam Vinh.

## 🎯 Features

✨ **Visual Design**
- Vietnamese cultural style (red, yellow, golden colors)
- Cute & playful running animations with bouncing
- Header banner with shop and owner photos
- Traditional decorative elements (lanterns 🏮)

🏃 **Race Features**
- Horizontal running animation with speed variations
- Random winner selection with dramatic finish
- Confetti celebration & winner modal
- Support for 2-8 racers per race

👥 **CRUD Management**
- Add racers with emoji avatars
- Delete racers
- Select/deselect participants
- View win statistics

💾 **Data Management**
- Auto-save to browser localStorage
- Export to JSON file
- Import from JSON file
- Data persists between sessions

🔗 **URL Parameters**
- `?start=true` - Auto-start race on page load
- `?racers=Name1,Name2` - Pre-select specific racers
- `?all=true` - Include all racers
- Example: `index.html?start=true&racers=Alice,Bob`

📱 **Responsive Design** - Works on mobile & desktop

## 📁 Project Structure

```
tiemcom-race-app/
├── index.html              # Main HTML file
├── styles/
│   └── main.css           # All styles
├── js/
│   ├── config.js          # Configuration and constants
│   ├── data.js            # Data management (CRUD, localStorage)
│   ├── ui.js              # UI rendering and interactions
│   ├── race.js            # Race logic and animations
│   └── app.js             # Application initialization
├── assets/
│   └── images/
│       ├── shop.jpg       # Shop photo (replace with actual)
│       └── owner.jpg      # Owner photo (replace with actual)
├── sample-data.json       # Sample racer data
├── README.md              # This file
└── .gitignore            # Git ignore rules
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server required - runs completely in the browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tiemcom-race-app.git
   cd tiemcom-race-app
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local server (optional):
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Python 2
     python -m SimpleHTTPServer 8000
     
     # Node.js (with http-server)
     npx http-server
     ```

3. **Add photos**
   - Replace placeholder images in `assets/images/`
   - Update `shop.jpg` - shop photo
   - Update `owner.jpg` - owner photo (circular will be applied via CSS)

## 📖 Usage

### Adding Racers
1. Click "👥 Quản lý người đua" button
2. Enter racer name and select an avatar emoji
3. Click "Thêm người đua"

### Starting a Race
1. Select 2+ racers from the list (click to select/deselect)
2. Click "🏁 BẮT ĐẦU ĐUA!"
3. Watch the race animation
4. Winner is announced with celebration!

### Exporting/Importing Data
1. Click "💾 Xuất dữ liệu JSON" to download racer list
2. Click "📂 Nhập từ JSON" to restore from backup

### Using URL Parameters
```
# Auto-start with all racers
index.html?start=true&all=true

# Pre-select specific racers
index.html?start=true&racers=Alice,Bob,Charlie

# Just pre-select without auto-start
index.html?racers=Alice,Bob
```

## ⚙️ Configuration

Edit `js/config.js` to customize:

```javascript
CONFIG = {
    // Available avatar emojis
    avatarEmojis: [...],
    
    // Race settings
    race: {
        minRacers: 2,
        maxRacers: 8,
        baseSpeed: 2,
        speedVariation: 3
    },
    
    // Confetti settings
    confetti: {
        count: 100,
        colors: [...]
    }
}
```

## 🎨 Customization

### Colors
Edit `styles/main.css` to change color scheme:
```css
/* Primary colors */
#DA251D - Vietnamese Red
#FFCD00 - Golden Yellow
#FF6B35 - Warm Orange
#FFF8E7 - Rice White
#8B4513 - Wood Brown
```

### Fonts
The app uses:
- Nunito - Main font
- Be Vietnam Pro - Headers
- Open Sans - Body text

Change in CSS or HTML:
```html
<link href="https://fonts.googleapis.com/css2?family=YourFont:wght@400;700&display=swap" rel="stylesheet">
```

## 📊 Sample Data

Import `sample-data.json` to test with sample racers:
```json
{
  "version": "1.0",
  "racers": [
    {"id": 1, "name": "Alice", "avatar": "👨‍💼", "wins": 0},
    {"id": 2, "name": "Bob", "avatar": "👩‍💼", "wins": 0}
  ]
}
```

## 🔧 Development

### Project Architecture
- **Modular Design**: Separated concerns (config, data, UI, race)
- **Class-based**: DataManager, UIManager, RaceEngine classes
- **No Dependencies**: Pure vanilla JavaScript
- **Responsive**: Mobile and desktop support

### Key Classes

**DataManager** (`data.js`)
- CRUD operations for racers
- localStorage management
- Import/export functionality

**UIManager** (`ui.js`)
- Render UI components
- Handle user interactions
- Animation management

**RaceEngine** (`race.js`)
- Race logic and animation loop
- Winner selection
- Race state management

### Extending the App

1. **Add new features**: Edit relevant module
2. **Add new race types**: Create new class extending RaceEngine
3. **Add new animations**: Add keyframes to `main.css`
4. **Add new data fields**: Update DataManager and racer object

## 🐛 Troubleshooting

**Data not saving?**
- Check browser localStorage is enabled
- Try clearing browser cache
- Try importing/exporting JSON instead

**Images not showing?**
- Ensure image paths are correct in `assets/images/`
- Check browser console for error messages
- Images should be JPG or PNG format

**Race not starting?**
- Need at least 2 racers selected
- Check browser console for JavaScript errors

**CSS not loading?**
- Ensure `styles/main.css` is in correct path
- Check file permissions
- Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

## 📱 Browser Support

- Chrome/Chromium 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📝 License

This project is free to use and modify.

## 🤝 Contributing

Feel free to fork and improve! Suggestions:
- Add more avatar options
- Add sound effects
- Create mobile app version
- Add multiplayer support

## 📞 Contact

For questions about Tiệm Cơm Nam Vinh:
- **Chi nhánh Teq**
- **Bà chủ: Linh Đa**

---

**Made with ❤️ for fun lunch picking!** 🍚🏃
