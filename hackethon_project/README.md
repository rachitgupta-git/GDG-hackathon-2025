# StressBot - Academic Stress Support Website

A comprehensive web platform designed to help students manage academic stress through AI-powered chat support, resources, and mental health guidance.

## 🚀 Features

- **AI-Powered Chat Bot**: Advanced conversational AI using OpenAI GPT for personalized academic stress support
- **Multi-language Support**: Conversations in 8 languages (English, Spanish, French, German, Chinese, Japanese, Arabic, Hindi)
- **Resource Library**: Curated collection of study techniques, mental health resources, and wellness tools
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Privacy-Focused**: Secure API communication with conversation context management
- **Crisis Support**: Direct links to emergency mental health resources

## 📁 Project Structure

```
hackethon_project/
├── index.html          # Home page with hero section and features
├── chat.html           # Interactive chat bot interface
├── resources.html      # Resource library and helpful links
├── about.html          # About page with mission and statistics
├── css/
│   └── styles.css      # Main stylesheet with responsive design
├── js/
│   ├── main.js         # General JavaScript functionality
│   └── chat.js         # Chat bot logic and responses
└── images/             # Image assets (favicon, etc.)
```

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Flexbox, Grid, and animations
- **Vanilla JavaScript**: Interactive functionality and chat bot logic
- **OpenAI API**: AI-powered conversational responses
- **Responsive Design**: Mobile-first approach with media queries

## 🔧 API Setup

To enable the AI-powered chat functionality:

1. **Get an OpenAI API Key**:
   - Sign up at [OpenAI Platform](https://platform.openai.com/)
   - Navigate to API Keys section
   - Create a new API key

2. **Configure the API Key**:
   - Open `js/chat.js`
   - Find the line: `this.apiKey = 'YOUR_OPENAI_API_KEY_HERE';`
   - Replace with your actual API key: `this.apiKey = 'sk-your-actual-api-key-here';`

3. **Alternative Setup (Recommended for Production)**:
   - For security, consider setting up a backend proxy server
   - This prevents exposing your API key in client-side code
   - Example proxy endpoints: `/api/chat` that forwards to OpenAI

**Note**: The current implementation uses OpenAI's GPT-3.5-turbo model. You can modify the model in the `getAIResponse` method if needed.

## 🎯 Chat Bot Capabilities

The StressBot AI provides support for:

- **Stress Management**: Breathing techniques, grounding exercises
- **Study Techniques**: Pomodoro, active recall, spaced repetition
- **Anxiety Support**: Coping strategies and mindfulness tips
- **Time Management**: Eisenhower matrix, time blocking
- **Motivation**: Goal setting and positive mindset development
- **Self-Care**: Wellness tips and work-life balance
- **Crisis Intervention**: Emergency resources and professional help

## 🚨 Important Notes

- **Not a Substitute for Professional Care**: StressBot provides support but is not a replacement for professional mental health treatment
- **Crisis Resources**: Direct links to 988 Lifeline, Crisis Text Line, and other emergency services
- **Privacy**: All conversations are processed locally with no data storage

## 🌐 How to Use

1. Open `index.html` in any modern web browser
2. Navigate through the site using the menu
3. Click "Chat with StressBot" to start an interactive conversation
4. Browse resources for additional tools and techniques
5. Access crisis support links if needed

## 📱 Browser Support

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## 🤝 Contributing

This project was created to support student mental health. If you'd like to contribute:

1. Fork the repository
2. Add new resources or improve chat responses
3. Enhance the UI/UX
4. Add accessibility features
5. Test across different devices

## 📞 Support

If you need help or have suggestions:
- Use the chat bot for immediate support
- Check the resources page for additional tools
- Contact mental health professionals for serious concerns

## 📄 License

Created for educational and supportive purposes. Please use responsibly and direct users to professional help when needed.

---

**Remember**: If you're in crisis, please seek immediate help from qualified professionals or emergency services.