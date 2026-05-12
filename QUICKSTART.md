# ⚡ Quick Start Guide

Get up and running in **2 minutes**! 🚀

## 1️⃣ Open the App

Simply open `index.html` in your web browser.

That's it! The app works offline with no server needed.

## 2️⃣ Add Racers

1. Click **"👥 Quản lý người đua"**
2. Enter a name
3. Pick an emoji avatar
4. Click **"Thêm người đua"**
5. Repeat for at least 2 people

## 3️⃣ Start a Race

1. Click to select 2+ racers from the list (they'll highlight)
2. Click **"🏁 BẮT ĐẦU ĐUA!"**
3. Watch the race! 🏃💨
4. Winner is announced! 👑🎉

## 💡 Tips

**Add custom photos:**
- Replace images in `assets/images/`
- `shop.jpg` - Shop photo
- `owner.jpg` - Owner photo

**Use URL shortcuts:**
```
# Auto-start race with specific people
index.html?start=true&racers=Alice,Bob

# Start with everyone
index.html?start=true&all=true
```

**Backup your data:**
- Click "💾 Xuất dữ liệu JSON"
- Download your racer list
- Import it back anytime

**Customize:**
- Edit `js/config.js` for settings
- Edit `styles/main.css` for colors
- Add more emoji avatars

---

## 📂 File Structure

```
tiemcom-race-app/
├── index.html          ← Open this!
├── js/                 ← App logic
├── styles/             ← Colors & design
├── assets/images/      ← Add your photos here
└── README.md           ← Full documentation
```

---

## 🌐 Deploy (Free)

### GitHub Pages
```bash
git push origin master
# Go to Settings → Pages → Enable
# Your site: yourname.github.io/tiemcom-race
```

### Netlify
```bash
# Drag & drop this folder to app.netlify.com
# Or: npx netlify-cli deploy
```

### Any Web Server
- Upload files via FTP
- Works on Apache, Nginx, etc.
- No database needed!

---

## 🎨 Customize

**Change colors (edit `styles/main.css`):**
```css
#DA251D = Red (main color)
#FFCD00 = Yellow (accent)
#FF6B35 = Orange
#FFF8E7 = Cream (background)
```

**Add avatars (edit `js/config.js`):**
```javascript
CONFIG.avatarEmojis = [
    '👨‍💼', '👩‍💼', // More emoji...
    '🎭', '🎪' // Add your favorites!
];
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Data lost after refresh | Check localStorage enabled |
| Images not showing | Copy images to `assets/images/` |
| Won't start race | Need 2+ racers selected |
| Styles look wrong | Hard refresh (Ctrl+Shift+R) |

---

## 📚 Next Steps

- [Full Documentation](README.md)
- [Setup Guide](SETUP.md)
- [View Code](js/)

---

**Start racing now!** 🍚🏃💨
