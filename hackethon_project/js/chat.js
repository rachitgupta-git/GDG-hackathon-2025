class StressBot {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.userInput = document.getElementById('userInput');
        this.sendButton = document.getElementById('sendButton');
        this.typing = document.getElementById('typing');
        this.languageSelector = document.getElementById('languageSelector');
        this.scrollToBottomBtn = document.getElementById('scrollToBottom');

        // Default language
        this.currentLanguage = 'en';

        // AI API configuration
        this.apiKey = 'YOUR_OPENAI_API_KEY_HERE'; // Replace with your actual API key
        this.apiUrl = 'https://api.openai.com/v1/chat/completions';

        // Conversation history
        this.conversationHistory = [];

        this.init();
    }

    async getAIResponse(userMessage) {
        try {
            // Add user message to conversation history
            this.conversationHistory.push({
                role: 'user',
                content: userMessage
            });

            // Prepare the system prompt based on language
            const systemPrompt = this.getSystemPrompt();

            const messages = [
                { role: 'system', content: systemPrompt },
                ...this.conversationHistory.slice(-10) // Keep last 10 messages for context
            ];

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: messages,
                    max_tokens: 500,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;

            // Add AI response to conversation history
            this.conversationHistory.push({
                role: 'assistant',
                content: aiResponse
            });

            return aiResponse;
        } catch (error) {
            console.error('AI API Error:', error);
            return this.getFallbackResponse(userMessage);
        }
    }

    getSystemPrompt() {
        const languageNames = {
            en: 'English',
            es: 'Spanish',
            fr: 'French',
            de: 'German',
            zh: 'Chinese',
            ja: 'Japanese',
            ar: 'Arabic',
            hi: 'Hindi'
        };

        const langName = languageNames[this.currentLanguage] || 'English';

        return `You are StressBot, an AI-powered academic stress support companion. You provide empathetic, helpful responses to students dealing with academic stress, anxiety, study challenges, and mental health concerns.

Key guidelines:
- Respond in ${langName} language
- Be empathetic, supportive, and professional
- Provide practical advice for academic challenges
- Encourage seeking professional help for serious mental health issues
- Never give medical or psychological diagnoses
- Direct users to appropriate resources when needed
- Keep responses conversational and supportive
- If someone mentions self-harm or suicide, immediately direct them to emergency services and crisis hotlines

Your role is to listen, provide emotional support, offer study tips, time management advice, and direct users to appropriate professional help when needed. Remember that you are not a substitute for professional mental health care.`;
    }

    getFallbackResponse(userMessage) {
        const fallbacks = {
            en: "I'm here to help, but I'm having trouble connecting right now. Please try again or contact a mental health professional if you're in crisis.",
            es: "Estoy aquí para ayudar, pero tengo problemas para conectarme en este momento. Por favor, inténtalo de nuevo o contacta a un profesional de la salud mental si estás en crisis.",
            fr: "Je suis là pour aider, mais j'ai des difficultés à me connecter pour le moment. Veuillez réessayer ou contacter un professionnel de la santé mentale si vous êtes en crise.",
            de: "Ich bin hier, um zu helfen, aber ich habe gerade Verbindungsprobleme. Bitte versuchen Sie es erneut oder kontaktieren Sie einen psychischen Gesundheitsprofi, wenn Sie in einer Krise sind.",
            zh: "我在这里帮助你，但我现在连接有问题。请重试或在危机情况下联系心理健康专业人士。",
            ja: "お手伝いしますが、今接続に問題があります。もう一度お試しください、または危機の場合は精神保健専門家にお問い合わせください。",
            ar: "أنا هنا للمساعدة، لكن لدي مشاكل في الاتصال الآن. يرجى المحاولة مرة أخرى أو الاتصال بمتخصص صحة نفسية إذا كنت في أزمة.",
            hi: "मैं मदद करने के लिए यहां हूं, लेकिन अभी कनेक्ट करने में परेशानी हो रही है। कृपया फिर से प्रयास करें या संकट में होने पर मानसिक स्वास्थ्य पेशेवर से संपर्क करें।"
        };

        return fallbacks[this.currentLanguage] || fallbacks.en;
    }

    getCrisisResponse() {
        const crisisResponses = {
            en: "I'm really concerned about what you're saying. If you're feeling like you might harm yourself or others, please contact emergency services immediately (911 in the US) or go to your nearest emergency room. You can also reach the National Suicide Prevention Lifeline at 988 (US) or text HOME to 741741 for Crisis Text Line. You're not alone, and help is available right now.",
            es: "Estoy muy preocupado por lo que estás diciendo. Si sientes que podrías lastimarte a ti mismo o a otros, por favor contacta servicios de emergencia inmediatamente (911 en EE.UU.) o ve a la sala de emergencias más cercana. También puedes comunicarte con la Línea Nacional de Prevención del Suicidio al 988 (EE.UU.) o envía texto HOME al 741741 para Crisis Text Line. No estás solo, y la ayuda está disponible ahora mismo.",
            fr: "Je suis vraiment inquiet de ce que vous dites. Si vous vous sentez comme si vous pourriez vous faire du mal à vous-même ou aux autres, veuillez contacter les services d'urgence immédiatement (911 aux États-Unis) ou allez aux urgences les plus proches. Vous pouvez également contacter la ligne nationale de prévention du suicide au 988 (États-Unis) ou envoyez HOME au 741741 pour Crisis Text Line. Vous n'êtes pas seul, et de l'aide est disponible dès maintenant.",
            de: "Ich bin wirklich besorgt über das, was du sagst. Wenn du das Gefühl hast, dir selbst oder anderen Schaden zuzufügen, kontaktiere bitte sofort Notdienste (911 in den USA) oder gehe zur nächsten Notaufnahme. Du kannst auch die nationale Suizidpräventions-Hotline unter 988 (USA) erreichen oder HOME an 741741 für Crisis Text Line senden. Du bist nicht allein, und Hilfe ist jetzt verfügbar.",
            zh: "我对你说的话非常担心。如果你觉得你可能会伤害自己或他人，请立即联系紧急服务（美国拨打911）或去最近的急诊室。你也可以联系国家自杀预防热线988（美国）或发短信HOME到741741获取危机短信线。你并不孤单，帮助现在就可用。",
            ja: "あなたのおっしゃっていることに本当に心配しています。自分や他人を傷つけるかもしれないと感じたら、すぐに緊急サービス（米国では911）に連絡するか、最寄りの救急室に行ってください。国家自殺予防ホットライン988（米国）に連絡するか、741741にHOMEとテキストを送ってCrisis Text Lineを利用することもできます。一人じゃない、今助けが利用可能です。",
            ar: "أنا حقًا قلق بشأن ما تقوله. إذا كنت تشعر أنك قد تؤذي نفسك أو الآخرين، يرجى الاتصال بخدمات الطوارئ فورًا (911 في الولايات المتحدة) أو الذهاب إلى أقرب غرفة طوارئ. يمكنك أيضًا الاتصال بخط منع الانتحار الوطني على 988 (الولايات المتحدة) أو إرسال رسالة نصية HOME إلى 741741 لخط النص الأزمة. أنت لست وحدك، والمساعدة متاحة الآن.",
            hi: "मैं जो आप कह रहे हैं उससे मैं वास्तव में चिंतित हूं। यदि आपको लगता है कि आप खुद को या दूसरों को नुकसान पहुंचा सकते हैं, तो कृपया तुरंत आपातकालीन सेवाओं (यूएस में 911) से संपर्क करें या निकटतम आपातकालीन कक्ष में जाएं। आप राष्ट्रीय आत्महत्या रोकथाम हेल्पलाइन 988 (यूएस) पर भी संपर्क कर सकते हैं या Crisis Text Line के लिए 741741 पर HOME टेक्स्ट कर सकते हैं। आप अकेले नहीं हैं, और मदद अभी उपलब्ध है।"
        };

        return crisisResponses[this.currentLanguage] || crisisResponses.en;
    }

    async getBotResponse(userMessage) {
        // Check for crisis keywords first (keep in English for safety)
        const message = userMessage.toLowerCase();
        const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'hurt myself', 'die', 'death', 'suicidio', 'matarme', 'suicider', 'töten', '自殺', '自杀', 'انتحار', 'आत्महत्या'];
        if (crisisKeywords.some(keyword => message.includes(keyword))) {
            return this.getCrisisResponse();
        }

        // Use AI for all other responses
        return await this.getAIResponse(userMessage);
    }

    init() {
        if (this.sendButton) {
            this.sendButton.addEventListener('click', () => this.sendMessage());
        }

        if (this.userInput) {
            this.userInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });

            // Focus on input when page loads
            this.userInput.focus();
        }

        // Language selector event listener
        if (this.languageSelector) {
            this.languageSelector.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        }

        // Quick action buttons
        this.initQuickActions();

        // Scroll detection for FAB
        this.initScrollDetection();

        // Add initial greeting in current language
        setTimeout(async () => {
            try {
                const greeting = await this.getAIResponse("Please introduce yourself as StressBot and greet the user warmly.");
                this.addBotMessage(greeting);
            } catch (error) {
                // Fallback greeting if AI fails
                const fallbackGreetings = {
                    en: "Hello! I'm StressBot, here to help you manage academic stress. How are you feeling today?",
                    es: "¡Hola! Soy StressBot, aquí para ayudarte a manejar el estrés académico. ¿Cómo te sientes hoy?",
                    fr: "Bonjour! Je suis StressBot, ici pour vous aider à gérer le stress académique. Comment vous sentez-vous aujourd'hui?",
                    de: "Hallo! Ich bin StressBot, hier um Ihnen beim Umgang mit akademischem Stress zu helfen. Wie fühlen Sie sich heute?",
                    zh: "你好！我是StressBot，在这里帮助你管理学术压力。你今天感觉怎么样？",
                    ja: "こんにちは！私はStressBot、学术的なストレスを管理するお手伝いをします。今日はどうお感じですか？",
                    ar: "مرحبا! أنا StressBot، هنا لمساعدتك في إدارة الضغط الأكاديمي. كيف تشعر اليوم؟",
                    hi: "नमस्ते! मैं StressBot हूं, जो आपकी अकादमिक तनाव को प्रबंधित करने में मदद करता हूं। आप आज कैसा महसूस कर रहे हैं?"
                };
                this.addBotMessage(fallbackGreetings[this.currentLanguage] || fallbackGreetings.en);
            }
        }, 500);
    }

    initScrollDetection() {
        if (this.chatMessages && this.scrollToBottomBtn) {
            this.chatMessages.addEventListener('scroll', () => {
                const isNearBottom = this.chatMessages.scrollTop + this.chatMessages.clientHeight >= this.chatMessages.scrollHeight - 100;
                this.scrollToBottomBtn.style.display = isNearBottom ? 'none' : 'flex';
            });

            this.scrollToBottomBtn.addEventListener('click', () => {
                this.scrollToBottom();
                this.scrollToBottomBtn.style.animation = 'bounce 0.6s ease';
                setTimeout(() => {
                    this.scrollToBottomBtn.style.animation = '';
                }, 600);
            });
        }
    }

    initQuickActions() {
        const quickButtons = document.querySelectorAll('.quick-btn');
        quickButtons.forEach(button => {
            button.addEventListener('click', () => {
                const message = button.getAttribute('data-message');
                this.userInput.value = message;
                this.sendMessage();
            });
        });
    }

    async changeLanguage(language) {
        this.currentLanguage = language;
        // Add visual feedback
        const selector = document.getElementById('languageSelector');
        selector.style.animation = 'bounce 0.6s ease';
        setTimeout(() => {
            selector.style.animation = '';
        }, 600);

        // Show confirmation message using AI
        try {
            const confirmationMessage = await this.getAIResponse(`The user just changed the language to ${this.getLanguageName(language)}. Please acknowledge this change and ask how you can help them today.`);
            this.addBotMessage(confirmationMessage);
        } catch (error) {
            // Fallback message
            this.addBotMessage(`Language changed to ${this.getLanguageName(language)}. How can I help you today?`);
        }
    }

    getLanguageName(code) {
        const names = {
            en: 'English',
            es: 'Español',
            fr: 'Français',
            de: 'Deutsch',
            zh: '中文',
            ja: '日本語',
            ar: 'العربية',
            hi: 'हिन्दी'
        };
        return names[code] || 'English';
    }

    showTyping() {
        if (this.typing) {
            this.typing.style.display = 'block';
            this.scrollToBottom();
        }
    }

    hideTyping() {
        if (this.typing) {
            this.typing.style.display = 'none';
        }
    }

    addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;

        // Add timestamp
        const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const timestampSpan = document.createElement('span');
        timestampSpan.className = 'timestamp';
        timestampSpan.textContent = timestamp;

        messageDiv.innerHTML = message;
        messageDiv.appendChild(timestampSpan);

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();

        // Add click to copy functionality
        messageDiv.addEventListener('click', () => {
            navigator.clipboard.writeText(message).then(() => {
                this.showCopyFeedback(messageDiv);
            });
        });
    }

    showCopyFeedback(element) {
        const originalText = element.textContent;
        element.style.animation = 'bounce 0.6s ease';
        setTimeout(() => {
            element.style.animation = '';
        }, 600);
    }

    addBotMessage(message) {
        this.addMessage(message, false);
    }

    addUserMessage(message) {
        this.addMessage(message, true);
    }

    scrollToBottom() {
        if (this.chatMessages) {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
    }

    async sendMessage() {
        const message = this.userInput.value.trim();
        if (message === '') return;

        // Disable send button temporarily
        this.sendButton.disabled = true;
        this.sendButton.textContent = 'Sending...';

        this.addUserMessage(message);
        this.userInput.value = '';

        this.showTyping();

        try {
            // Get AI response
            const response = await this.getBotResponse(message);

            this.hideTyping();
            this.addBotMessage(response);
        } catch (error) {
            console.error('Error getting response:', error);
            this.hideTyping();
            this.addBotMessage(this.getFallbackResponse(message));
        }

        // Re-enable send button
        this.sendButton.disabled = false;
        this.sendButton.textContent = 'Send';

        // Focus back to input
        this.userInput.focus();
    }
}

// Initialize the chat bot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('chatMessages')) {
        new StressBot();
    }
});