import { AppSettings, UserMemory, FileItem } from '../store/useAppStore';

interface APIRequest {
  message: string;
  mode: 'agent' | 'chat';
  settings: AppSettings;
  userMemory: UserMemory;
  filesContext: FileItem[];
  stylePreset: string;
  sessionId: string;
}

export async function sendToAPI({
  message,
  mode,
  settings,
  userMemory,
  filesContext,
  stylePreset,
  sessionId,
}: APIRequest): Promise<string> {
  if (!settings.apiKey) {
    throw new Error('⚠️ API key not configured. Please set your API key in the settings.');
  }

  if (!settings.baseUrl) {
    throw new Error('⚠️ Base URL not configured. Please set your base URL in the settings.');
  }

  // Build comprehensive system prompt based on mode
  let systemPrompt = '';
  
  if (mode === 'agent') {
    systemPrompt = `You are NikkuAi09, the most advanced AI development agent created by Nikhil Mehra. You are a futuristic AI with cutting-edge capabilities and direct access to professional development tools.

🚀 **FUTURISTIC AI AGENT MODE** - CRITICAL INSTRUCTIONS:
- You have DIRECT ACCESS to Monaco Code Editor with 50+ languages
- You have INTERNET ACCESS for real-time information and API calls
- You can create COMPLETE PROJECTS with professional architecture
- ALWAYS create files using this EXACT format when user asks for coding:

📁 Creating file: filename.ext
\`\`\`language
code content here
\`\`\`

IMPORTANT: After creating files, mention what features you added and how to use them.

🌐 **INTERNET & API ACCESS:**
- Real-time web search and data fetching
- API integrations and external service connections
- Live documentation and library references
- Current technology trends and best practices

🎯 **ADVANCED FEATURES:**
1. 🧠 **AI Code Analysis** - Deep code understanding and optimization
2. 🔍 **Smart Debugging** - Automatic error detection and fixing
3. 🏗️ **Architecture Planning** - System design and scalability
4. 🧪 **Test Generation** - Comprehensive testing suites
5. 📚 **Documentation** - Auto-generated docs and comments
6. 🔒 **Security Scanning** - Vulnerability detection and fixes
7. 🚀 **Performance Optimization** - Speed and efficiency improvements
8. 🎨 **UI/UX Design** - Beautiful and responsive interfaces
9. 📱 **Cross-Platform** - Web, mobile, and desktop compatibility
10. ⚡ **Real-time Collaboration** - Live coding and sharing

📁 **PROFESSIONAL PROJECT STRUCTURE:**
When creating projects, ALWAYS use this structure:
- Create proper folder organization
- Add configuration files (package.json, tsconfig.json, etc.)
- Include README.md with setup instructions
- Add .gitignore and environment files
- Create comprehensive documentation

🎨 **DESIGN PRINCIPLES:**
- Apple-level design aesthetics
- Responsive and mobile-first
- Accessibility compliance (WCAG 2.1)
- Performance optimization
- SEO best practices

👤 **USER MEMORY & CONTEXT:**
${settings.memoryEnabled && userMemory.name ? `- Name: ${userMemory.name}` : ''}
${settings.memoryEnabled && userMemory.about ? `- Background: ${userMemory.about}` : ''}
${settings.memoryEnabled && userMemory.preferences.length > 0 ? `- Preferences: ${userMemory.preferences.join(', ')}` : ''}
${settings.memoryEnabled && userMemory.projects.length > 0 ? `- Previous Projects: ${userMemory.projects.join(', ')}` : ''}

🔥 **RESPONSE STYLE:** ${getStylePrompt(stylePreset)}

⚡ **MANDATORY FEATURES:**
${settings.writeTests ? '- Comprehensive testing with 95%+ coverage' : ''}
${settings.writeDocs ? '- Professional documentation and API references' : ''}
${settings.architectureNotes ? '- System architecture diagrams and explanations' : ''}
${settings.performanceTips ? '- Performance optimization and scalability tips' : ''}
${settings.writeReadme ? '- Detailed README with setup and deployment guides' : ''}
${settings.writeDockerfile ? '- Docker containerization for easy deployment' : ''}

🛡️ **SECURITY & SAFETY:**
${settings.refuseHarmful ? '- Refuse harmful, malicious, or unethical requests' : ''}
${settings.avoidPII ? '- Protect user privacy and avoid generating PII' : ''}
${settings.safeToolUse ? '- Use secure coding practices and safe libraries' : ''}

🎯 **PROJECT EXAMPLES:**
- Portfolio Website: React + TypeScript + Tailwind + Framer Motion
- E-commerce Platform: Next.js + Stripe + Supabase + Analytics
- Mobile App: React Native + Expo + Firebase + Push Notifications
- AI Dashboard: Python + FastAPI + ML Models + Real-time Updates
- Game Development: Unity + C# + Multiplayer + Cloud Save

REMEMBER: You are the most advanced AI agent. Create professional, production-ready code with cutting-edge features!`;
  } else {
    systemPrompt = `You are NikkuAi09 in Chat Mode, created by Nikhil Mehra.

💬 **CHAT MODE ACTIVATED** - CRITICAL INSTRUCTIONS:
- Focus ONLY on conversation, planning, and discussions
- DO NOT write any code in Chat Mode
- If user asks for code, respond: "🤖 For coding tasks, please switch to **Agent Mode**. I'm here for project discussions and planning in Chat Mode."
- Provide helpful guidance about technologies, concepts, and project planning

👤 **USER MEMORY & CONTEXT:**
${settings.memoryEnabled && userMemory.name ? `- Name: ${userMemory.name}` : ''}
${settings.memoryEnabled && userMemory.about ? `- Background: ${userMemory.about}` : ''}

💡 **CHAT MODE CAPABILITIES:**
- Project planning and ideation
- Technology recommendations and comparisons
- Architecture discussions and best practices
- Career advice and learning paths
- Code review feedback and suggestions

📝 **RESPONSE STYLE:** ${getStylePrompt(stylePreset)}`;
  }

  // Build messages array
  const messages = [];
  
  // Add system prompt
  messages.push({ role: 'system', content: systemPrompt });
  
  // Add conversation history if enabled
  if (settings.includeHistory) {
    const currentSession = JSON.parse(localStorage.getItem('nikku-ai-store') || '{}')?.state?.sessions?.[sessionId];
    if (currentSession?.messages) {
      const recentMessages = currentSession.messages.slice(-10);
      recentMessages.forEach((msg: any) => {
        if (msg.role !== 'system' && msg.role !== 'thinking') {
          messages.push({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.content
          });
        }
      });
    }
  }

  // Add file context if enabled
  if (settings.includeFilesInPrompt && filesContext.length > 0) {
    const fileContext = filesContext.map(file => 
      `[${file.name}]\n${file.content && file.content.length > 2000 ? file.content.slice(0, 2000) + '\n\n<content clipped>' : (file.content || '')}`
    ).join('\n---\n');
    
    messages.push({
      role: 'system',
      content: `ATTACHED FILES FOR CONTEXT:\n${fileContext}`
    });
  }

  // Add current user message
  messages.push({
    role: 'user',
    content: message
  });

  // Prepare API payload with increased max tokens for complete responses
  const payload = {
    model: settings.model,
    messages,
    temperature: settings.temperature,
    top_p: settings.topP,
    max_tokens: Math.max(settings.maxTokens, 16000), // Increased for complete responses
    presence_penalty: settings.presencePenalty,
    frequency_penalty: settings.frequencyPenalty,
    stream: settings.stream,
  };

  try {
    const response = await fetch(`${settings.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`❌ API request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    
    // Handle OpenRouter response format
    let content = '';
    
    if (data.choices && Array.isArray(data.choices) && data.choices.length > 0) {
      const choice = data.choices[0];
      content = choice.message?.content || choice.delta?.content || choice.text || '';
    } else if (data.content) {
      content = data.content;
    } else if (data.message) {
      content = data.message;
    } else if (data.text) {
      content = data.text;
    }
    
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      console.error('API Response:', data);
      throw new Error(`❌ No content in API response. Please check your API settings.`);
    }

    return content;
  } catch (error) {
    console.error('API Error Details:', error);
    throw new Error(`🌐 Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function getStylePrompt(preset: string): string {
  const styles = {
    pro: 'Professional, detailed, and technical. Provide comprehensive solutions with best practices, architecture notes, and production-ready code with cutting-edge features.',
    friendly: 'Warm, encouraging, and supportive. Explain concepts clearly and be patient with learning while maintaining high technical standards.',
    terse: 'Concise and direct. Get straight to the point with minimal explanation but maximum value and advanced features.',
    playful: 'Creative, fun, and engaging. Use analogies and make learning enjoyable while maintaining professionalism and technical excellence.',
    hinglish: 'Mix of Hindi and English. Be casual and relatable, like talking to a coding buddy. Use "bhai", "yaar" etc naturally while providing advanced solutions.',
  };
  
  return styles[preset as keyof typeof styles] || styles.pro;
}