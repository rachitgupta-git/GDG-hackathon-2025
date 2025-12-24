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
                study_tips: ["Essayez la technique Pomodoro: 25 minutes de travail concentré, puis une pause de 5 minutes. Cela aide vraiment à maintenir la concentration!", "Le rappel actif est puissant - testez-vous sur le matériel au lieu de simplement relire vos notes.", "Assurez-vous de dormir suffisamment (7-9 heures) et de bien manger. Votre cerveau a besoin de carburant approprié pour fonctionner au maximum!", "Trouvez un environnement d'étude qui fonctionne pour vous - certains préfèrent le silence complet, d'autres aiment la musique de fond ou les sons ambiants."],
                motivation: ["Rappelez-vous pourquoi vous avez commencé ce voyage. Qu'est-ce qui vous excite le plus dans votre domaine d'études?", "Le progrès peut sembler lent, mais chaque petit pas compte. Célébrez vos victoires, peu importe leur taille!", "Il est complètement normal d'avoir des jours difficiles. Soyez gentil avec vous-même et essayez à nouveau demain avec une énergie fraîche."],
                time_management: ["La gestion du temps est clé pour réduire le stress! Essayez de prioriser les tâches en utilisant la matrice Eisenhower: urgent/important, important/non urgent, etc.", "Utilisez un planificateur ou un calendrier numérique pour programmer le temps d'étude et les pauses. La cohérence bat souvent l'intensité.", "Si vous procrastinez, commencez par seulement 5 minutes de travail. Souvent, commencer est la partie la plus difficile."],
                self_care: ["Les soins personnels sont cruciaux pour le succès académique. Prenez du temps pour des activités que vous aimez en dehors de l'étude.", "Même une promenade de 10 minutes peut réduire le stress et améliorer votre concentration.", "Restez connecté avec vos amis et votre famille. Le soutien social est incroyablement important pour la santé mentale."],
                resources: ["Voici quelques ressources utiles pour vous soutenir:", "Envisagez de parler à un conseiller dans votre école - ils sont là spécifiquement pour aider des étudiants comme vous!", "Des applications comme Headspace ou Calm peuvent aider avec la méditation et les techniques de réduction du stress.", "Le centre de conseil académique de votre école pourrait offrir des ateliers de compétences d'étude ou du tutorat."],
                crisis: ["Si vous vous sentez comme si vous pourriez vous faire du mal à vous-même ou aux autres, veuillez contacter les services d'urgence immédiatement (911 aux États-Unis) ou allez aux urgences les plus proches.", "Si vous êtes en crise, contactez la ligne nationale de prévention du suicide au 988 (États-Unis) ou envoyez HOME au 741741 pour Crisis Text Line.", "Vous n'êtes pas seul, et de l'aide est disponible. Veuillez contacter un professionnel de la santé mentale ou un adulte de confiance dès maintenant."],
                default: ["Je suis là pour écouter. Pouvez-vous me dire plus sur ce qui vous préoccupe?", "Cela semble difficile. Comment vous sentez-vous à ce sujet en ce moment?", "Je veux mieux comprendre. Quelle a été la partie la plus difficile pour vous récemment?", "Merci de partager cela avec moi. Qu'est-ce qui vous aiderait à vous sentir un peu mieux en ce moment?"]
            },
            de: {
                greetings: ["Hallo! Ich bin StressBot, hier um Ihnen beim Umgang mit akademischem Stress zu helfen. Wie fühlen Sie sich heute?", "Hallo! Ich bin Ihr akademischer Support-Begleiter. Was haben Sie im Kopf?", "Hey! Ich bin hier, um zuzuhören und bei allen akademischen Herausforderungen zu helfen, denen Sie gegenüberstehen."],
                stress: ["Ich verstehe, dass akademischer Stress überwältigend wirken kann. Denken Sie daran, tief durchzuatmen - probieren Sie die 4-7-8-Technik: atmen Sie 4 Sekunden ein, halten Sie 7 Sekunden, atmen Sie 8 Sekunden aus.", "Akademischer Druck ist völlig normal. Welcher spezifische Aspekt stresst Sie im Moment am meisten?", "Sie sind nicht allein, wenn Sie sich durch das Studium gestresst fühlen. Viele Studenten erleben das. Was können wir gemeinsam bearbeiten?"],
                anxiety: ["Angst vor dem Studium ist sehr verbreitet. Versuchen Sie, sich zu erden: nennen Sie 5 Dinge, die Sie sehen können, 4, die Sie berühren können, 3, die Sie hören können, 2, die Sie riechen können, 1, das Sie schmecken können.", "Wenn die Angst zuschlägt, kann sie das Lernen unmöglich machen. Haben Sie versucht, Ihre Arbeit in kleinere, handhabbare Abschnitte zu unterteilen?", "Ich höre, wie hart Angst sein kann. Denken Sie daran, dass Ihr Wert nicht durch Ihre Noten definiert wird - Sie geben Ihr Bestes, und das reicht."],
                study_tips: ["Probieren Sie die Pomodoro-Technik: 25 Minuten konzentrierte Arbeit, dann eine 5-minütige Pause. Das hilft wirklich, die Konzentration zu erhalten!", "Aktives Abrufen ist mächtig - testen Sie sich selbst zum Material, anstatt nur Ihre Notizen wieder zu lesen.", "Stellen Sie sicher, dass Sie genug schlafen (7-9 Stunden) und gut essen. Ihr Gehirn braucht den richtigen Treibstoff, um optimal zu funktionieren!", "Finden Sie eine Lernumgebung, die für Sie funktioniert - manche bevorzugen völlige Stille, andere mögen Hintergrundmusik oder Umgebungsgeräusche."],
                motivation: ["Erinnern Sie sich, warum Sie diese Reise begonnen haben. Was begeistert Sie am meisten an Ihrem Studienfach?", "Fortschritt mag langsam erscheinen, aber jeder kleine Schritt zählt. Feiern Sie Ihre Siege, egal wie klein sie scheinen!", "Es ist völlig in Ordnung, schlechte Tage zu haben. Seien Sie nett zu sich selbst und versuchen Sie es morgen mit frischer Energie erneut."],
                time_management: ["Zeitmanagement ist der Schlüssel zur Stressreduzierung! Versuchen Sie, Aufgaben mit der Eisenhower-Matrix zu priorisieren: dringend/wichtig, wichtig/nicht dringend, etc.", "Verwenden Sie einen Planer oder digitalen Kalender, um Lernzeit und Pausen zu planen. Konsistenz schlägt oft Intensität.", "Wenn Sie prokrastinieren, beginnen Sie mit nur 5 Minuten Arbeit. Oft ist das Anfangen der schwierigste Teil."],
                self_care: ["Selbstfürsorge ist entscheidend für akademischen Erfolg. Nehmen Sie sich Zeit für Aktivitäten, die Sie außerhalb des Lernens genießen.", "Selbst ein 10-minütiger Spaziergang kann Stress reduzieren und Ihren Fokus verbessern.", "Bleiben Sie mit Freunden und Familie in Verbindung. Soziale Unterstützung ist unglaublich wichtig für die psychische Gesundheit."],
                resources: ["Hier sind einige hilfreiche Ressourcen, um Sie zu unterstützen:", "Zögern Sie nicht, mit einem Berater an Ihrer Schule zu sprechen - sie sind speziell da, um Studenten wie Ihnen zu helfen!", "Apps wie Headspace oder Calm können bei Meditation und Stressreduzierungstechniken helfen.", "Das akademische Beratungszentrum Ihrer Schule bietet möglicherweise Workshops zu Lernfähigkeiten oder Nachhilfe an."],
                crisis: ["Wenn Sie das Gefühl haben, sich selbst oder anderen Schaden zuzufügen, kontaktieren Sie bitte sofort Notdienste (911 in den USA) oder gehen Sie zur nächsten Notaufnahme.", "Wenn Sie in einer Krise sind, wenden Sie sich an die nationale Suizidpräventions-Hotline unter 988 (USA) oder senden Sie HOME an 741741 für Crisis Text Line.", "Sie sind nicht allein, und Hilfe ist verfügbar. Bitte wenden Sie sich sofort an einen psychischen Gesundheitsprofi oder einen vertrauten Erwachsenen."],
                default: ["Ich bin hier, um zuzuhören. Können Sie mir mehr darüber erzählen, was Ihnen im Kopf herumgeht?", "Das klingt herausfordernd. Wie fühlen Sie sich im Moment dazu?", "Ich möchte es besser verstehen. Was war in letzter Zeit der schwierigste Teil für Sie?", "Danke, dass Sie das mit mir teilen. Was würde Ihnen im Moment helfen, sich ein bisschen besser zu fühlen?"]
            },
            zh: {
                greetings: ["你好！我是StressBot，在这里帮助你管理学术压力。你今天感觉怎么样？", "嗨！我是你的学术支持伙伴。你在想什么？", "嘿！我在听你倾诉，并帮助你应对任何学术挑战。"],
                stress: ["我理解学术压力可能让人感到不知所措。记住要深呼吸 - 试试4-7-8技巧：吸气4秒，屏住7秒，呼气8秒。", "学术压力是完全正常的。现在是什么具体方面让你最有压力？", "你不是唯一一个因为学业感到有压力的人。许多学生都经历过这个。我们可以一起做什么呢？"],
                anxiety: ["对学习的焦虑很常见。试着让自己接地：说出5件你能看到的东西，4件你能触摸的，3件你能听到的，2件你能闻到的，1件你能尝到的。", "当焦虑来袭时，它可能让学习变得不可能。你试过把工作分成更小、更易管理的部分吗？", "我听到焦虑有多难受。记住你的价值不是由成绩定义的 - 你正在尽力而为，这就足够了。"],
                study_tips: ["试试番茄工作法：25分钟专注工作，然后5分钟休息。这真的有助于保持注意力！", "主动回忆很强大 - 测试自己对材料，而不是只是重读笔记。", "确保你睡够了（7-9小时）并且吃得好。你的脑子需要适当的燃料来发挥最佳性能！", "找到适合你的学习环境 - 有些人喜欢完全安静，有些人喜欢背景音乐或环境声音。"],
                motivation: ["记住你为什么开始这段旅程。你的研究领域最让你兴奋的是什么？", "进步可能感觉很慢，但每一步都很重要。庆祝你的胜利，不管多么小！", "有糟糕的日子是完全正常的。对自己好一点，明天带着新鲜能量再试一次。"],
                time_management: ["时间管理是减少压力的关键！试着用艾森豪威尔矩阵来优先排序任务：紧急/重要，重要/不紧急等。", "使用计划本或数字日历来安排学习时间和休息。持续性往往胜过强度。", "如果你在拖延，从5分钟的工作开始。通常，开始是最难的部分。"],
                self_care: ["自我关怀对学术成功至关重要。抽出时间做你喜欢的学习之外的活动。", "即使10分钟的散步也能减少压力并改善你的注意力和专注力。", "与朋友和家人保持联系。社会支持对心理健康非常重要。"],
                resources: ["这里有一些有用的资源来支持你：", "考虑和学校的辅导员谈谈 - 他们专门在那里帮助像你这样的学生！", "像Headspace或Calm这样的应用可以帮助冥想和压力缓解技巧。", "你学校的学术咨询中心可能提供学习技能研讨会或辅导。"],
                crisis: ["如果你觉得你可能会伤害自己或他人，请立即联系紧急服务（美国拨打911）或去最近的急诊室。", "如果你处于危机中，请联系国家自杀预防热线988（美国）或发短信HOME到741741获取危机短信线。", "你并不孤单，帮助是可用的。请立即联系心理健康专业人士或值得信任的成年人。"],
                default: ["我在听你说。你能告诉我更多关于你脑海中的想法吗？", "这听起来很有挑战性。你现在对此感觉如何？", "我想更好地理解。最近对你来说最难的部分是什么？", "谢谢你和我分享这个。现在什么能让你感觉好一点？"]
            },
            ja: {
                greetings: ["こんにちは！私はStressBot、学术的なストレスを管理するお手伝いをします。今日はどうお感じですか？", "こんにちは！私はあなたの学术サポートパートナーです。何を考えていますか？", "やあ！私はあなたが直面しているあらゆる学术的な課題を聞き、手伝います。"],
                stress: ["学术的なストレスが圧倒的に感じるのは理解できます。深呼吸を思い出してください - 4-7-8テクニックを試してみてください：4秒吸って、7秒止めて、8秒吐く。", "学术的なプレッシャーは完全に正常です。今、何が一番ストレスを感じさせていますか？", "あなたは学术的なことでストレスを感じている唯一の人ではありません。多くの学生がこれを経験しています。私たちは一緒に何を解決できますか？"],
                anxiety: ["学習に関する不安は非常に一般的です。グラウンディングを試してみてください：見えるものを5つ、触れるものを4つ、聞こえるものを3つ、匂うものを2つ、味わえるものを1つ挙げてください。", "不安が襲ってくると、勉強が不可能に感じるかもしれません。仕事を小さく管理しやすい部分に分けてみましたか？", "不安がどれほど辛いか聞こえます。あなたの価値は成績で決まるものではないことを思い出してください - あなたはベストを尽くしていて、それで十分です。"],
                study_tips: ["ポモドーロテクニックを試してみてください：25分の集中した仕事、5分の休憩。これで集中力を維持できます！", "アクティブリコールは強力です - ノートを読み返すのではなく、資料について自分をテストしてください。", "十分な睡眠（7-9時間）を確保し、よく食べるようにしてください。あなたの脳は最適に機能するために適切な燃料が必要です！", "あなたに合った学習環境を見つけてください - 完全な静寂を好む人もいれば、背景音楽や環境音を好む人もいます。"],
                motivation: ["なぜこの旅を始めたのか思い出してください。あなたの研究分野で何が一番ワクワクしますか？", "進歩は遅く感じるかもしれませんが、毎日の小さな一歩が重要です。どんなに小さくても勝利を祝いましょう！", "悪い日があるのは完全に正常です。自分に優しく、明日新鮮なエネルギーで再挑戦してください。"],
                time_management: ["時間管理はストレスを減らす鍵です！アイゼンハワーマトリックスを使ってタスクを優先順位付けしてみてください：緊急/重要、重要/緊急でないなど。", "プランナーやデジタルカレンダーを使って勉強時間と休憩をスケジュールしましょう。一貫性が強度を上回ることが多いです。", "先延ばしをしているなら、5分だけの仕事から始めてください。始めることが一番難しいことが多いです。"],
                self_care: ["セルフケアは学术的な成功に不可欠です。勉強以外で楽しめる活動に時間を割いてください。", "10分の散歩でもストレスを減らし、集中力を改善できます。", "友人や家族とのつながりを保ちましょう。社会的なサポートは精神衛生にとって非常に重要です。"],
                resources: ["あなたをサポートするための役立つリソースをいくつか紹介します：", "学校のカウンセラーに相談することを検討してください - 彼らはあなたのような学生を助けるために特別にいます！", "HeadspaceやCalmのようなアプリは瞑想やストレス軽減テクニックに役立ちます。", "あなたの学校の学术アドバイジングセンターは学習スキルワークショップやチューターを提供するかもしれません。"],
                crisis: ["自分や他人を傷つけるかもしれないと感じたら、すぐに緊急サービス（米国では911）に連絡するか、最寄りの救急室に行ってください。", "危機的状況にある場合は、国家自殺予防ホットライン988（米国）に連絡するか、741741にHOMEとテキストを送ってCrisis Text Lineを利用してください。", "あなたは一人ではなく、助けは利用可能です。今すぐ精神保健専門家や信頼できる大人に連絡してください。"],
                default: ["私は聞いています。頭に浮かんでいることについてもっと教えてくれますか？", "それは挑戦的に聞こえます。今それについてどう感じていますか？", "もっとよく理解したいです。最近あなたにとって一番大変だった部分は何ですか？", "それを私と共有してくれてありがとう。今少し気分を良くするために何が役立つでしょうか？"]
            },
            ar: {
                greetings: ["مرحبا! أنا StressBot، هنا لمساعدتك في إدارة الضغط الأكاديمي. كيف تشعر اليوم؟", "مرحبا! أنا رفيق دعمك الأكاديمي. ما الذي يدور في ذهنك؟", "مرحبا! أنا هنا للاستماع ومساعدتك في أي تحديات أكاديمية تواجهها."],
                stress: ["أفهم أن الضغط الأكاديمي يمكن أن يشعر بالإرهاق. تذكر أن تأخذ أنفاسا عميقة - جرب تقنية 4-7-8: استنشق لمدة 4 ثوان، احبس لمدة 7 ثوان، أخرج لمدة 8 ثوان.", "الضغط الأكاديمي أمر طبيعي تماما. أي جانب محدد يسبب لك أكبر قدر من الضغط الآن؟", "أنت لست وحدك تشعر بالضغط من الدراسات. يعاني العديد من الطلاب من ذلك. ما الذي يمكننا العمل عليه معا؟"],
                anxiety: ["القلق بشأن الدراسات شائع جدا. حاول أن ترسخ نفسك: سم 5 أشياء يمكنك رؤيتها، 4 يمكنك لمسها، 3 يمكنك سماعها، 2 يمكنك شمها، 1 يمكنك تذوقها.", "عندما يضرب القلق، يمكن أن يجعل الدراسة مستحيلة. هل جربت تقسيم عملك إلى أجزاء أصغر وأكثر قابلية للإدارة؟", "أسمع مدى صعوبة القلق. تذكر أن قيمتك لا تحددها درجاتك - أنت تقوم بأفضل ما لديك، وهذا يكفي."],
                study_tips: ["جرب تقنية البومودورو: 25 دقيقة من العمل المركز، ثم استراحة 5 دقائق. هذا يساعد حقا في الحفاظ على التركيز!", "الاسترجاع النشط قوي - اختبر نفسك على المادة بدلا من مجرد إعادة قراءة ملاحظاتك.", "تأكد من أنك تحصل على قسط كاف من النوم (7-9 ساعات) وتأكل جيدا. عقلك يحتاج إلى الوقود المناسب للأداء بشكل أمثل!", "اعثر على بيئة دراسة تناسبك - يفضل البعض الصمت التام، يحب الآخرون الموسيقى الخلفية أو الأصوات البيئية."],
                motivation: ["تذكر لماذا بدأت هذه الرحلة. ما الذي يثير إعجابك أكثر في مجال دراستك؟", "قد يبدو التقدم بطيئا، لكن كل خطوة صغيرة مهمة. احتفل بانتصاراتك، مهما كانت صغيرة!", "من الطبيعي تماما أن يكون لديك أيام سيئة. كن لطيفا مع نفسك وحاول مرة أخرى غدا بطاقة جديدة."],
                time_management: ["إدارة الوقت هي المفتاح لتقليل الضغط! جرب تحديد أولويات المهام باستخدام مصفوفة أيزنهاور: عاجل/مهم، مهم/غير عاجل، إلخ.", "استخدم مخططا أو تقويما رقميا لجدولة وقت الدراسة والاستراحات. الاتساق غالبا ما يتفوق على الكثافة.", "إذا كنت تؤجل، ابدأ بـ5 دقائق فقط من العمل. غالبا ما يكون البدء هو الجزء الأصعب."],
                self_care: ["الرعاية الذاتية أمر حاسم للنجاح الأكاديمي. خصص وقتا للأنشطة التي تستمتع بها خارج الدراسة.", "حتى المشي لمدة 10 دقائق يمكن أن يقلل الضغط ويحسن تركيزك.", "ابق على اتصال مع الأصدقاء والعائلة. الدعم الاجتماعي مهم جدا للصحة النفسية."],
                resources: ["إليك بعض الموارد المفيدة لدعمك:", "فكر في التحدث مع مستشار في مدرستك - هم هناك خصيصا لمساعدة الطلاب مثلك!", "يمكن للتطبيقات مثل Headspace أو Calm مساعدتك في التأمل وتقنيات تقليل الضغط.", "قد يقدم مركز الاستشارات الأكاديمية في مدرستك ورش عمل مهارات الدراسة أو التعليم."],
                crisis: ["إذا شعرت أنك قد تؤذي نفسك أو الآخرين، يرجى الاتصال بخدمات الطوارئ فورا (911 في الولايات المتحدة) أو الذهاب إلى أقرب غرفة طوارئ.", "إذا كنت في أزمة، اتصل بخط منع الانتحار الوطني على 988 (الولايات المتحدة) أو أرسل رسالة نصية HOME إلى 741741 لخط النص الأزمة.", "أنت لست وحدك، والمساعدة متاحة. يرجى التواصل مع متخصص صحة نفسية أو بالغ موثوق به الآن."],
                default: ["أنا هنا للاستماع. هل يمكنك إخباري بمزيد من التفاصيل عما يدور في ذهنك؟", "هذا يبدو تحديا. كيف تشعر تجاه ذلك الآن؟", "أريد أن أفهم بشكل أفضل. ما كان الجزء الأصعب بالنسبة لك مؤخرا؟", "شكرا لمشاركة ذلك معي. ماذا يمكن أن يساعدك في الشعور بتحسن قليلا الآن؟"]
            },
            hi: {
                greetings: ["नमस्ते! मैं StressBot हूं, जो आपकी अकादमिक तनाव को प्रबंधित करने में मदद करता हूं। आप आज कैसा महसूस कर रहे हैं?", "नमस्ते! मैं आपका अकादमिक सपोर्ट साथी हूं। आपके दिमाग में क्या है?", "अरे! मैं सुनने और आपके सामने आने वाली किसी भी अकादमिक चुनौती में मदद करने के लिए यहां हूं।"],
                stress: ["मैं समझता हूं कि अकादमिक तनाव भारी महसूस हो सकता है। गहरी सांस लेना याद रखें - 4-7-8 तकनीक आजमाएं: 4 सेकंड सांस लें, 7 सेकंड रोकें, 8 सेकंड बाहर छोड़ें।", "अकादमिक दबाव पूरी तरह से सामान्य है। अभी कौन सा विशिष्ट पहलू आपको सबसे ज्यादा तनाव दे रहा है?", "आप अकेले नहीं हैं जो अध्ययन से तनाव महसूस कर रहे हैं। कई छात्र इसे अनुभव करते हैं। हम साथ में क्या काम कर सकते हैं?"],
                anxiety: ["अध्ययन के बारे में चिंता बहुत आम है। खुद को ग्राउंड करने की कोशिश करें: 5 चीजें नाम बताएं जिन्हें आप देख सकते हैं, 4 जिन्हें आप छू सकते हैं, 3 जिन्हें आप सुन सकते हैं, 2 जिन्हें आप सूंघ सकते हैं, 1 जिसका आप स्वाद ले सकते हैं।", "जब चिंता आती है, तो यह अध्ययन को असंभव बना सकती है। क्या आपने अपना काम छोटे, प्रबंधनीय हिस्सों में विभाजित करने की कोशिश की है?", "मैं सुनता हूं कि चिंता कितनी कठिन हो सकती है। याद रखें कि आपकी कीमत आपके ग्रेड से तय नहीं होती - आप अपना सर्वश्रेष्ठ कर रहे हैं, और यह काफी है।"],
                study_tips: ["पomodoro तकनीक आजमाएं: 25 मिनट केंद्रित काम, फिर 5 मिनट ब्रेक। यह वाकई ध्यान बनाए रखने में मदद करता है!", "सक्रिय रिकॉल शक्तिशाली है - अपनी नोट्स को फिर से पढ़ने के बजाय सामग्री पर खुद को टेस्ट करें।", "सुनिश्चित करें कि आप पर्याप्त नींद ले रहे हैं (7-9 घंटे) और अच्छा खा रहे हैं। आपके दिमाग को इष्टतम प्रदर्शन के लिए उचित ईंधन की आवश्यकता है!", "एक अध्ययन वातावरण खोजें जो आपके लिए काम करता हो - कुछ लोग पूरी तरह से शांति पसंद करते हैं, अन्य पृष्ठभूमि संगीत या पर्यावरण ध्वनियों को पसंद करते हैं।"],
                motivation: ["याद रखें कि आपने यह यात्रा क्यों शुरू की। आपके अध्ययन क्षेत्र में क्या सबसे ज्यादा रोमांचित करता है?", "प्रगति धीमी महसूस हो सकती है, लेकिन हर छोटा कदम मायने रखता है। अपनी जीत का जश्न मनाएं, चाहे वे कितनी भी छोटी हों!", "खराब दिन होना पूरी तरह से ठीक है। अपने साथ दयालु बनें और कल ताजा ऊर्जा के साथ फिर से प्रयास करें।"],
                time_management: ["समय प्रबंधन तनाव को कम करने की कुंजी है! Eisenhower मैट्रिक्स का उपयोग करके कार्यों को प्राथमिकता देने की कोशिश करें: अत्यंत महत्वपूर्ण/महत्वपूर्ण, महत्वपूर्ण/गैर-अत्यंत महत्वपूर्ण, आदि।", "अध्ययन समय और ब्रेक को शेड्यूल करने के लिए एक प्लानर या डिजिटल कैलेंडर का उपयोग करें। निरंतरता अक्सर तीव्रता से बेहतर होती है।", "यदि आप टाल रहे हैं, तो सिर्फ 5 मिनट के काम से शुरू करें। अक्सर, शुरू करना सबसे कठिन हिस्सा होता है।"],
                self_care: ["स्वयं देखभाल अकादमिक सफलता के लिए महत्वपूर्ण है। अध्ययन के अलावा जिन गतिविधियों का आप आनंद लेते हैं, उनके लिए समय निकालें।", "10 मिनट की भी सैर तनाव कम कर सकती है और आपके फोकस में सुधार कर सकती है।", "मित्रों और परिवार से जुड़े रहें। मानसिक स्वास्थ्य के लिए सामाजिक समर्थन अविश्वसनीय रूप से महत्वपूर्ण है।"],
                resources: ["यहां आपके समर्थन के लिए कुछ सहायक संसाधन हैं:", "अपनी स्कूल के काउंसलर से बात करने पर विचार करें - वे विशेष रूप से आपके जैसे छात्रों की मदद के लिए हैं!", "Headspace या Calm जैसे ऐप ध्यान और तनाव कम करने की तकनीकों में मदद कर सकते हैं।", "आपकी स्कूल की अकादमिक एडवाइजिंग सेंटर अध्ययन कौशल कार्यशालाएं या ट्यूशन प्रदान कर सकती है।"],
                crisis: ["यदि आपको लगता है कि आप खुद को या दूसरों को नुकसान पहुंचा सकते हैं, तो कृपया तुरंत आपातकालीन सेवाओं (यूएस में 911) से संपर्क करें या निकटतम आपातकालीन कक्ष में जाएं।", "यदि आप संकट में हैं, तो राष्ट्रीय आत्महत्या रोकथाम हेल्पलाइन 988 (यूएस) पर संपर्क करें या Crisis Text Line के लिए 741741 पर HOME टेक्स्ट करें।", "आप अकेले नहीं हैं, और मदद उपलब्ध है। कृपया अभी मानसिक स्वास्थ्य पेशेवर या विश्वसनीय वयस्क से संपर्क करें।"],
                default: ["मैं सुन रहा हूं। क्या आप मुझे बता सकते हैं कि आपके दिमाग में क्या चल रहा है?", "यह चुनौतीपूर्ण लगता है। आप अभी इसके बारे में कैसा महसूस कर रहे हैं?", "मैं बेहतर ढंग से समझना चाहता हूं। हाल ही में आपके लिए सबसे कठिन हिस्सा क्या रहा है?", "इसको मेरे साथ साझा करने के लिए धन्यवाद। अभी क्या आपको थोड़ा बेहतर महसूस करने में मदद कर सकता है?"]
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