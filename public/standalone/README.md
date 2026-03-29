# Katyayani Jyotish - Standalone Version

This is a standalone, offline-working version of the Katyayani Jyotish website converted from TypeScript/React to vanilla HTML, CSS, and JavaScript.

## Files Structure

```
standalone/
├── index.html      # Main HTML file
├── styles.css      # All CSS styles
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## Features

✅ **Fully Offline** - Works without any external dependencies (except Google Fonts)
✅ **Multi-language Support** - Hindi, Gujarati, and English
✅ **Dark/Light Theme** - Toggle between themes with localStorage persistence
✅ **Responsive Design** - Mobile-friendly layout
✅ **Smooth Animations** - CSS animations and canvas starfield
✅ **No Build Required** - Just open index.html in a browser

## How to Use

1. **Download all files** from the `standalone/` folder
2. **Open `index.html`** in any modern web browser
3. **No server required** - Works directly from file system

## Features Breakdown

### HTML (index.html)
- Semantic HTML5 structure
- Accessibility-friendly markup
- SVG icons inline (no external icon dependencies)
- Data attributes for translations (`data-i18n`)

### CSS (styles.css)
- CSS Custom Properties for theming
- Responsive grid layouts
- Smooth transitions and animations
- Dark and light theme classes
- Mobile-first approach

### JavaScript (script.js)
- Translation system with 3 languages
- Theme toggle with localStorage
- Canvas-based starfield animation
- Dynamic content rendering
- Smooth scroll navigation
- Intersection Observer for scroll animations

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Customization

### Change Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #ff6b35;
    --primary-hover: #ff8c5e;
    /* ... */
}
```

### Add/Edit Translations
Edit the `translations` object in `script.js`:
```javascript
const translations = {
    en: { /* English translations */ },
    hi: { /* Hindi translations */ },
    gu: { /* Gujarati translations */ }
};
```

### Modify Content
- **Testimonials**: Edit `testimonialsData` in `script.js`
- **Contact Info**: Edit directly in `index.html` footer section
- **Services**: Edit service cards in HTML

## External Dependencies

Only one external dependency:
- **Google Fonts** (Cinzel & Inter) - Can be removed for 100% offline use

To make it 100% offline, download the fonts and reference them locally.

## License

© 2024 Katyayani Jyotish. All rights reserved.

## Contact

For questions or support, contact:
- Email: rudramjoshi@katyaayani.com
- Phone: +91 98765 43210
