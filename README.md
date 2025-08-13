# AI Dumb Charades

A fun, interactive word guessing game built with React, Framer Motion, and Tailwind CSS. Perfect for team building activities and parties!

## 🎮 Features

- **Team-based gameplay** with score tracking
- **Multi-language support** (English & Hindi)
- **Category selection** (General & Movies)
- **Sound effects** for better user experience
- **Responsive design** that works on all devices
- **Smooth animations** powered by Framer Motion
- **Auto-generated phrases** for endless gameplay

## 🚀 Quick Start

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd guess-the-word
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📱 How to Play

1. **Select Language & Category**: Choose between English/Hindi and General/Movies
2. **Tap the white card** to reveal the phrase
3. **Team A acts out** the phrase while Team B guesses
4. **Click "Guessed!"** if correct, or "Skip" if too difficult
5. **Switch turns** and continue playing!

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 🚀 Deployment

### Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Netlify
1. Build the project: `npm run build`
2. Drag the `dist` folder to Netlify
3. Configure custom domain if needed

### GitHub Pages
1. Add to package.json:
   ```json
   "homepage": "https://yourusername.github.io/guess-the-word",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
2. Install gh-pages: `npm install --save-dev gh-pages`
3. Deploy: `npm run deploy`

### Manual Deployment
1. Build: `npm run build`
2. Upload `dist` folder contents to your web server
3. Configure server to serve `index.html` for all routes

## 🎨 Customization

### Adding New Phrases
Edit the `PHRASES` object in `src/App.jsx`:

```javascript
const PHRASES = useRef({
  English: {
    General: [
      'Your new phrase here',
      'Another phrase'
    ],
    // Add new categories
    Sports: [
      'Playing basketball',
      'Swimming'
    ]
  }
});
```

### Styling
- Modify `src/index.css` for custom styles
- Update `tailwind.config.js` for theme customization
- Colors and gradients are in the main App component

## 🔧 Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS compatibility

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with React and modern web technologies
- Inspired by the classic party game Dumb Charades
- Special thanks to the open source community

---

**Happy Gaming! 🎉** 