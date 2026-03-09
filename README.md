# 🎤 AI Voice Assistant - Your Personal Alexa
...
Enjoy talking to your personal AI assistant! 🎤

## ✨ Features

- **Voice Recognition**: Speak naturally and get instant responses
- **Voice Synthesis**: Hear responses in a natural female voice (Alexa-like)
- **Cross-Platform**: Works on iPhone, Android, Desktop, and Safari
- **Multiple Commands**: Responds to greetings, expressions of love, and more
- **Beautiful UI**: Modern gradient design with animations
- **Dark/Light Mode**: Toggle between themes
- **Conversation History**: Track all your interactions
- **Text Input Fallback**: Type commands if voice isn't available

## 🗣️ Supported Commands

Try saying any of these phrases:

- **Greetings**: "Hello", "Hi", "Hiii", "Hey"
- **Time-based**: "Good Morning", "Good Afternoon", "Good Evening", "Good Night"
- **Emotional**: "I Love You", "I Love Youu", "I Miss You", "I Miss Youu"
- **Supportive**: "I Am Always There For You", "I Am Always There For Youu"
- **Questions**: "How Are You", "What Is Your Name", "What Time Is It", "What Day Is Today"
- **General**: "Thank You", "Thanks", "Goodbye", "Bye", "What Can You Do", "Help"

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd voice-assistant-ai
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## 📱 Browser Compatibility

This app works on all modern browsers:

- ✅ **Safari** (iPhone, iPad, Mac)
- ✅ **Chrome** (Android, Desktop)
- ✅ **Edge** (Desktop, Mobile)
- ✅ **Firefox** (Desktop, Mobile)

**Note**: Safari on iOS requires user interaction (tap) before voice recognition can start.

## 🔧 How It Works

### Web Speech API

The app uses two main Web Speech API interfaces:

1. **SpeechRecognition**: Converts speech to text
2. **SpeechSynthesis**: Converts text to speech

### Response Logic

The app matches user input against a predefined set of phrases and returns appropriate responses. The matching is case-insensitive and supports partial matches.

## 🌐 Deployment

### GitHub Pages

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to GitHub Pages

### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### Vercel

1. Import your GitHub repository to Vercel
2. Vercel will automatically detect the Vite configuration
3. Deploy!

## 📂 Project Structure

```
voice-assistant-ai/
├── src/
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Entry point
│   ├── index.css        # Global styles
│   └── utils/
│       └── cn.ts        # Utility functions
├── index.html           # HTML template
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── README.md            # This file
```

## 🎨 Customization

### Adding New Responses

Edit the `responseMap` object in `src/App.tsx`:

```typescript
const responseMap: Record<string, string[]> = {
  'your phrase': ['Response 1', 'Response 2', 'Response 3'],
  // Add more phrases here
};
```

### Changing Voice

Modify the `speakResponse` function to select different voices:

```typescript
const preferredVoice = voices.find(voice => 
  voice.name.includes('Your Preferred Voice Name')
);
```

## 🐛 Troubleshooting

### Microphone Not Working

1. Ensure you've granted microphone permissions
2. Try using HTTPS (required for some browsers)
3. Check browser settings for microphone access

### Voice Not Playing

1. Ensure your device volume is up
2. Check if voice is enabled in the app
3. Try a different browser

### Safari Issues

1. Tap the microphone button to start (Safari requires user interaction)
2. Ensure you're using iOS 14.3+ or macOS 11+
3. Allow microphone access when prompted

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

If you encounter any issues, please open an issue on GitHub with:
- Browser and version
- Device information
- Steps to reproduce the problem

---

**Made with ❤️ using React, Vite, and Tailwind CSS**

Enjoy talking to your personal AI assistant! 🎤

## 🌐 Live Demo

Try the AI Voice Assistant here:

https://voice-assistant-kappa-nine.vercel.app/

## 📂 GitHub Repository

https://github.com/isha0222/voice-assistant
