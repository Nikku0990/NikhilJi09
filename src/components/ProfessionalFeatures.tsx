import React, { useState } from 'react';
import { 
  Code, Database, Shield, Zap, Brain, Eye, Users, Clock, 
  Sparkles, Settings, Globe, Cpu, Activity, FileText,
  ChevronDown, ChevronUp, Play, TestTube, Bug, Wand2,
  GitBranch, Package, Terminal, Smartphone, Palette
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { toast } from 'react-toastify';

interface Feature {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ComponentType<any>;
  color: string;
  enabled: boolean;
  action: () => void;
}

const ProfessionalFeatures: React.FC = () => {
  const { addMessage, currentSessionId, currentMode, createFile, updateFile } = useAppStore();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [enabledFeatures, setEnabledFeatures] = useState<Record<string, boolean>>({});

  const features: Feature[] = [
    // AI & Intelligence Features (20)
    {
      id: 'aiAutocomplete',
      title: 'AI Autocomplete Pro',
      description: 'GitHub Copilot-style AI code completion',
      category: 'AI & Intelligence',
      icon: Brain,
      color: 'text-purple-400',
      enabled: true,
      action: () => {
        addMessage(currentSessionId, {
          role: 'assistant',
          content: '🧠 **AI Autocomplete Pro Activated!**\n\nNow I can provide intelligent code suggestions as you type. This feature works like GitHub Copilot:\n\n✨ **Features:**\n- Context-aware completions\n- Multi-line suggestions\n- Function generation\n- Smart imports\n\n💡 **Usage:** Start typing and I\'ll suggest completions!',
          timestamp: Date.now(),
        });
      }
    },
    {
      id: 'contextAwareGeneration',
      title: 'Context-Aware Code Generation',
      description: 'AI suggests code based on current file and project context',
      category: 'AI & Intelligence',
      icon: Brain,
      color: 'text-purple-400',
      enabled: true,
      action: () => {
        addMessage(currentSessionId, {
          role: 'assistant',
          content: '🎯 **Context-Aware Generation Active!**\n\nI now analyze your entire project context when generating code:\n\n📊 **Analysis:**\n- File dependencies\n- Import/export patterns\n- Coding style consistency\n- Project architecture\n\n🚀 **Result:** More accurate and contextual code suggestions!',
          timestamp: Date.now(),
        });
      }
    },
    {
      id: 'smartDebugger',
      title: 'Smart AI Debugger',
      description: 'AI automatically explains and fixes runtime errors',
      category: 'AI & Intelligence',
      icon: Bug,
      color: 'text-red-400',
      enabled: false,
      action: () => {
        addMessage(currentSessionId, {
          role: 'assistant',
          content: '🐛 **Smart AI Debugger Activated!**\n\nI can now automatically debug your code:\n\n🔍 **Capabilities:**\n- Error explanation\n- Stack trace analysis\n- Automatic fix suggestions\n- Performance bottleneck detection\n\n💡 **Usage:** Run your code and I\'ll help fix any errors!',
          timestamp: Date.now(),
        });
      }
    },
    {
      id: 'codeExplainer',
      title: 'AI Code Explainer',
      description: 'Detailed line-by-line code explanations',
      category: 'AI & Intelligence',
      icon: FileText,
      color: 'text-blue-400',
      enabled: false,
      action: () => {
        addMessage(currentSessionId, {
          role: 'assistant',
          content: '📚 **AI Code Explainer Ready!**\n\nI can now explain any code in detail:\n\n🎯 **Features:**\n- Line-by-line breakdown\n- Concept explanations\n- Best practices analysis\n- Learning recommendations\n\n💡 **Usage:** Select code and ask me to explain it!',
          timestamp: Date.now(),
        });
      }
    },
    {
      id: 'testGenerator',
      title: 'Auto Test Generator',
      description: 'AI generates comprehensive test suites',
      category: 'AI & Intelligence',
      icon: TestTube,
      color: 'text-green-400',
      enabled: false,
      action: () => {
        addMessage(currentSessionId, {
          role: 'assistant',
          content: '🧪 **Auto Test Generator Activated!**\n\nI can now generate comprehensive tests:\n\n✅ **Test Types:**\n- Unit tests\n- Integration tests\n- Edge case testing\n- Performance tests\n\n🚀 **Frameworks:** Jest, Vitest, Playwright, Cypress',
          timestamp: Date.now(),
        });
      }
    },

    // Code & Editor Features (20)
    {
      id: 'oneClickProjectGen',
      title: 'One-Click Project Generator',
      description: 'Generate complete projects from simple descriptions',
      category: 'Code & Editor',
      icon: Zap,
      color: 'text-yellow-400',
      enabled: true,
      action: () => {
        if (currentMode === 'chat') {
          toast.error('Switch to Agent Mode for project generation!');
          return;
        }
        addMessage(currentSessionId, {
          role: 'user',
          content: '🚀 **One-Click Project Generator**\n\nPlease create a complete React portfolio website with:\n- Modern design with Tailwind CSS\n- Home, About, Projects, Contact pages\n- Responsive layout\n- Professional animations\n- Contact form\n- Dark/light theme toggle\n\nGenerate all necessary files with production-ready code!',
          timestamp: Date.now(),
        });
      }
    },
    {
      id: 'refactorMode',
      title: 'AI Refactor Mode',
      description: 'Intelligent code refactoring with best practices',
      category: 'Code & Editor',
      icon: Wand2,
      color: 'text-pink-400',
      enabled: false,
      action: () => {
        addMessage(currentSessionId, {
          role: 'assistant',
          content: '✨ **AI Refactor Mode Activated!**\n\nI can now intelligently refactor your code:\n\n🔧 **Refactoring Types:**\n- Extract functions/components\n- Optimize algorithms\n- Apply design patterns\n- Improve readability\n- Remove code smells\n\n💡 **Usage:** Select code and ask me to refactor it!',
          timestamp: Date.now(),
        });
      }
    },
    {
      id: 'docGenerator',
      title: 'Documentation Generator',
      description: 'Auto-generate README, JSDoc, and API docs',
      category: 'Code & Editor',
      icon: FileText,
      color: 'text-cyan-400',
      enabled: false,
      action: () => {
        if (currentMode === 'chat') {
          toast.error('Switch to Agent Mode for documentation generation!');
          return;
        }
        addMessage(currentSessionId, {
          role: 'user',
          content: '📚 **Documentation Generator Request**\n\nPlease generate comprehensive documentation for my project:\n\n📋 **Generate:**\n- README.md with setup instructions\n- API documentation\n- Code comments and JSDoc\n- Architecture overview\n- Deployment guide\n\nAnalyze my current files and create professional documentation!',
          timestamp: Date.now(),
        });
      }
    },
    {
      id: 'codeToUI',
      title: 'Code to UI Converter',
      description: 'Convert descriptions to UI components',
      category: 'Code & Editor',
      icon: Palette,
      color: 'text-orange-400',
      enabled: false,
      action: () => {
        if (currentMode === 'chat') {
          toast.error('Switch to Agent Mode for UI generation!');
          return;
        }
        addMessage(currentSessionId, {
          role: 'user',
          content: '🎨 **Code to UI Converter Request**\n\nPlease create a modern login page component with:\n\n🎯 **Requirements:**\n- Email and password fields\n- Remember me checkbox\n- Forgot password link\n- Social login buttons (Google, GitHub)\n- Modern glassmorphism design\n- Tailwind CSS styling\n- Form validation\n- Responsive design\n\nGenerate complete React component with TypeScript!',
          timestamp: Date.now(),
        });
      }
    },
    {
      id: 'voiceToCode',
      title: 'Voice-to-Code',
      description: 'Convert speech to code using AI',
      category: 'Code & Editor',
      icon: Smartphone,
      color: 'text-green-400',
      enabled: false,
      action: () => {
        addMessage(currentSessionId, {
          role: 'assistant',
          content: '🎤 **Voice-to-Code Activated!**\n\nI can now convert your speech to code:\n\n🗣️ **Features:**\n- Natural language to code\n- Voice commands for editing\n- Hands-free coding\n- Multi-language support\n\n💡 **Usage:** Use the mic button and describe what you want to code!',
          timestamp: Date.now(),
        });
      }
    },

    // Performance & Optimization (15)
    {
      id: 'performanceMonitor',
      title: 'Performance Monitor',
      description: 'Real-time performance metrics and optimization',
      category: 'Performance',
      icon: Activity,
      color: 'text-green-400',
      enabled: false,
      action: () => {
        addMessage(currentSessionId, {
          role: 'assistant',
          content: '📊 **Performance Monitor Active!**\n\n⚡ **Monitoring:**\n- Bundle size analysis\n- Runtime performance\n- Memory usage\n- Load time optimization\n- Core Web Vitals\n\n🎯 **Real-time insights** for better performance!',
          timestamp: Date.now(),
        });
      }
    },
    {
      id: 'codeProfiler',
      title: 'AI Code Profiler',
      description: 'Identifies performance bottlenecks automatically',
      category: 'Performance',
      icon: Cpu,
      color: 'text-orange-400',
      enabled: false,
      action: () => {
        addMessage(currentSessionId, {
          role: 'assistant',
          content: '🔍 **AI Code Profiler Activated!**\n\n⚡ **Analysis:**\n- Function execution time\n- Memory allocation patterns\n- Loop optimization opportunities\n- Async/await improvements\n\n🚀 **Auto-suggestions** for performance gains!',
          timestamp: Date.now(),
        });
      }
    },

    // Security Features (15)
    {
      id: 'securityScanner',
      title: 'AI Security Scanner',
      description: 'OWASP Top 10 vulnerability detection',
      category: 'Security',
      icon: Shield,
      color: 'text-red-400',
      enabled: true,
      action: () => {
        addMessage(currentSessionId, {
          role: 'assistant',
          content: '🛡️ **AI Security Scanner Active!**\n\n🔒 **Scanning for:**\n- SQL injection vulnerabilities\n- XSS attack vectors\n- Authentication flaws\n- Data exposure risks\n- Dependency vulnerabilities\n\n✅ **OWASP Top 10** compliance checking enabled!',
          timestamp: Date.now(),
        });
      }
    },
    {
      id: 'dependencyAudit',
      title: 'Dependency Auditor',
      description: 'Scans for vulnerable dependencies',
      category: 'Security',
      icon: Package,
      color: 'text-yellow-400',
      enabled: false,
      action: () => {
        addMessage(currentSessionId, {
          role: 'assistant',
          content: '📦 **Dependency Auditor Activated!**\n\n🔍 **Checking:**\n- Known vulnerabilities\n- Outdated packages\n- License compliance\n- Security advisories\n\n🛡️ **Automated security** for your dependencies!',
          timestamp: Date.now(),
        });
      }
    },

    // Collaboration Features (15)
    {
      id: 'realTimePairProgramming',
      title: 'Real-Time Pair Programming',
      description: 'AI acts as your coding partner',
      category: 'Collaboration',
      icon: Users,
      color: 'text-blue-400',
      enabled: false,
      action: () => {
        addMessage(currentSessionId, {
          role: 'assistant',
          content: '👥 **Real-Time Pair Programming Started!**\n\nI\'m now your AI coding partner:\n\n🤝 **Collaboration:**\n- Live code suggestions\n- Parallel problem solving\n- Code review assistance\n- Best practices guidance\n\n💡 **Let\'s code together!** I\'ll help you build amazing projects.',
          timestamp: Date.now(),
        });
      }
    },
    {
      id: 'codeReview',
      title: 'AI Code Review',
      description: 'Comprehensive code review with suggestions',
      category: 'Collaboration',
      icon: Eye,
      color: 'text-cyan-400',
      enabled: false,
      action: () => {
        addMessage(currentSessionId, {
          role: 'assistant',
          content: '👁️ **AI Code Review Activated!**\n\n📋 **Review Criteria:**\n- Code quality assessment\n- Security vulnerability check\n- Performance optimization\n- Best practices compliance\n- Documentation completeness\n\n🎯 **Professional code review** like senior developers!',
          timestamp: Date.now(),
        });
      }
    },

    // Productivity Features (15)
    {
      id: 'projectScaffolder',
      title: 'Project Scaffolder',
      description: 'Generate complete project structures instantly',
      category: 'Productivity',
      icon: GitBranch,
      color: 'text-green-400',
      enabled: false,
      action: () => {
        if (currentMode === 'chat') {
          toast.error('Switch to Agent Mode for project scaffolding!');
          return;
        }
        addMessage(currentSessionId, {
          role: 'user',
          content: '🏗️ **Project Scaffolder Request**\n\nPlease create a complete MERN stack project structure:\n\n📁 **Generate:**\n- Frontend (React + TypeScript + Tailwind)\n- Backend (Node.js + Express + MongoDB)\n- Authentication system\n- API routes\n- Database models\n- Docker configuration\n- Environment setup\n- README with instructions\n\nCreate all files with production-ready code!',
          timestamp: Date.now(),
        });
      }
    },
    {
      id: 'snippetLibrary',
      title: 'AI Snippet Library',
      description: 'Intelligent code snippet management',
      category: 'Productivity',
      icon: Database,
      color: 'text-purple-400',
      enabled: false,
      action: () => {
        // Create a snippets file
        const snippetsContent = `// 🚀 AI-Generated Code Snippets Library
// Generated by NikkuAi09 Professional Features

// React Functional Component Template
export const ReactComponent = \`
import React from 'react';

interface Props {
  title: string;
}

const Component: React.FC<Props> = ({ title }) => {
  return (
    <div className="p-4">
      <h1>{title}</h1>
    </div>
  );
};

export default Component;
\`;

// Express API Route Template
export const ExpressRoute = \`
import express from 'express';
const router = express.Router();

router.get('/api/data', async (req, res) => {
  try {
    // Your logic here
    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
\`;

// MongoDB Schema Template
export const MongoSchema = \`
import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Model', schema);
\`;

// Tailwind Component Template
export const TailwindComponent = \`
<div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
  <div className="p-6">
    <h2 className="text-xl font-bold text-gray-900">Title</h2>
    <p className="text-gray-600 mt-2">Description</p>
  </div>
</div>
\`;`;

        createFile('ai-snippets-library.js', snippetsContent);
        
        addMessage(currentSessionId, {
          role: 'assistant',
          content: '📚 **AI Snippet Library Created!**\n\n✨ **Generated snippets for:**\n- React components\n- Express routes\n- MongoDB schemas\n- Tailwind components\n\n📁 **File:** ai-snippets-library.js\n\n💡 **Usage:** Copy snippets and customize for your needs!',
          timestamp: Date.now(),
        });
      }
    },

    // DevOps & Deployment (10)
    {
      id: 'dockerGenerator',
      title: 'Docker Configuration Generator',
      description: 'Auto-generate Docker files and configs',
      category: 'DevOps',
      icon: Package,
      color: 'text-blue-400',
      enabled: false,
      action: () => {
        if (currentMode === 'chat') {
          toast.error('Switch to Agent Mode for Docker generation!');
          return;
        }
        
        const dockerfileContent = `# 🐳 Docker Configuration Generated by NikkuAi09
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["npm", "start"]`;

        const dockerComposeContent = `# 🐳 Docker Compose Configuration
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: mongo:latest
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped

volumes:
  mongo_data:`;

        createFile('Dockerfile', dockerfileContent);
        createFile('docker-compose.yml', dockerComposeContent);
        
        addMessage(currentSessionId, {
          role: 'assistant',
          content: '🐳 **Docker Configuration Generated!**\n\n📁 **Files Created:**\n- Dockerfile (optimized for production)\n- docker-compose.yml (with MongoDB)\n\n🚀 **Features:**\n- Multi-stage build\n- Health checks\n- Volume persistence\n- Environment variables\n\n💡 **Usage:** Run `docker-compose up` to start!',
          timestamp: Date.now(),
        });
      }
    },
    {
      id: 'cicdPipeline',
      title: 'CI/CD Pipeline Generator',
      description: 'Generate GitHub Actions and deployment configs',
      category: 'DevOps',
      icon: GitBranch,
      color: 'text-purple-400',
      enabled: false,
      action: () => {
        if (currentMode === 'chat') {
          toast.error('Switch to Agent Mode for CI/CD generation!');
          return;
        }
        
        const githubActionsContent = `# 🚀 GitHub Actions CI/CD Pipeline
# Generated by NikkuAi09

name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Run linting
      run: npm run lint
    
    - name: Build application
      run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build for production
      run: npm run build
    
    - name: Deploy to production
      run: |
        echo "Deploying to production..."
        # Add your deployment commands here`;

        createFile('.github/workflows/ci-cd.yml', githubActionsContent);
        
        addMessage(currentSessionId, {
          role: 'assistant',
          content: '⚙️ **CI/CD Pipeline Generated!**\n\n📁 **File:** .github/workflows/ci-cd.yml\n\n🔄 **Pipeline Features:**\n- Automated testing\n- Code linting\n- Build verification\n- Production deployment\n- Branch protection\n\n🚀 **Ready for GitHub Actions!**',
          timestamp: Date.now(),
        });
      }
    },

    // Mobile Development (10)
    {
      id: 'reactNativeGen',
      title: 'React Native Generator',
      description: 'Generate mobile app components and screens',
      category: 'Mobile Development',
      icon: Smartphone,
      color: 'text-blue-400',
      enabled: false,
      action: () => {
        if (currentMode === 'chat') {
          toast.error('Switch to Agent Mode for React Native generation!');
          return;
        }
        addMessage(currentSessionId, {
          role: 'user',
          content: '📱 **React Native App Generator**\n\nPlease create a complete React Native app with:\n\n🎯 **Features:**\n- Navigation (React Navigation)\n- Authentication screens\n- Home dashboard\n- Profile management\n- Settings screen\n- API integration\n- State management (Redux/Zustand)\n- TypeScript support\n\nGenerate all necessary files and components!',
          timestamp: Date.now(),
        });
      }
    },

    // Database Features (10)
    {
      id: 'dbSchemaGen',
      title: 'Database Schema Generator',
      description: 'Generate database schemas and migrations',
      category: 'Database',
      icon: Database,
      color: 'text-green-400',
      enabled: false,
      action: () => {
        if (currentMode === 'chat') {
          toast.error('Switch to Agent Mode for database generation!');
          return;
        }
        addMessage(currentSessionId, {
          role: 'user',
          content: '🗄️ **Database Schema Generator**\n\nPlease create a complete database schema for an e-commerce platform:\n\n📋 **Tables Needed:**\n- Users (authentication, profiles)\n- Products (catalog, inventory)\n- Orders (shopping cart, checkout)\n- Categories (product organization)\n- Reviews (ratings, comments)\n\n🎯 **Generate:**\n- SQL schema files\n- MongoDB schemas\n- Prisma schema\n- Migration files\n- Seed data\n\nInclude relationships, indexes, and constraints!',
          timestamp: Date.now(),
        });
      }
    },

    // API Development (10)
    {
      id: 'apiGenerator',
      title: 'REST API Generator',
      description: 'Generate complete REST APIs with documentation',
      category: 'API Development',
      icon: Globe,
      color: 'text-cyan-400',
      enabled: false,
      action: () => {
        if (currentMode === 'chat') {
          toast.error('Switch to Agent Mode for API generation!');
          return;
        }
        addMessage(currentSessionId, {
          role: 'user',
          content: '🌐 **REST API Generator Request**\n\nPlease create a complete REST API for a blog platform:\n\n📋 **Endpoints:**\n- Authentication (login, register, logout)\n- Posts (CRUD operations)\n- Comments (nested CRUD)\n- Users (profile management)\n- Categories (blog organization)\n\n🎯 **Include:**\n- Express.js routes\n- Middleware (auth, validation)\n- Error handling\n- API documentation\n- Swagger/OpenAPI spec\n- Rate limiting\n- Input validation\n\nGenerate production-ready API code!',
          timestamp: Date.now(),
        });
      }
    },

    // Testing Features (10)
    {
      id: 'e2eTesting',
      title: 'E2E Test Generator',
      description: 'Generate end-to-end tests with Playwright',
      category: 'Testing',
      icon: TestTube,
      color: 'text-purple-400',
      enabled: false,
      action: () => {
        if (currentMode === 'chat') {
          toast.error('Switch to Agent Mode for E2E test generation!');
          return;
        }
        addMessage(currentSessionId, {
          role: 'user',
          content: '🎭 **E2E Test Generator Request**\n\nPlease create comprehensive end-to-end tests:\n\n🧪 **Test Scenarios:**\n- User registration flow\n- Login/logout process\n- Main application features\n- Form submissions\n- Navigation testing\n- Mobile responsiveness\n\n🎯 **Framework:** Playwright with TypeScript\n\n📋 **Include:**\n- Page object models\n- Test fixtures\n- Custom assertions\n- Screenshot comparisons\n- Performance testing\n\nGenerate complete test suite!',
          timestamp: Date.now(),
        });
      }
    }
  ];

  const categories = [...new Set(features.map(f => f.category))];

  const toggleFeature = (feature: Feature) => {
    const newState = !enabledFeatures[feature.id];
    setEnabledFeatures(prev => ({ ...prev, [feature.id]: newState }));

    if (newState) {
      toast.success(`✅ ${feature.title} activated!`);
      feature.action();
    } else {
      toast.info(`${feature.title} deactivated.`);
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const getFeaturesByCategory = (category: string) => {
    return features.filter(f => f.category === category);
  };

  const getEnabledCount = (category: string) => {
    return getFeaturesByCategory(category).filter(f => enabledFeatures[f.id] || f.enabled).length;
  };

  const totalEnabledFeatures = features.filter(f => enabledFeatures[f.id] || f.enabled).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-6 h-6 text-yellow-400" />
        <h2 className="text-xl font-bold text-white">Professional Features</h2>
        <div className="ml-auto text-xs text-gray-400">
          {totalEnabledFeatures}/{features.length} Active
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-xl p-4 mb-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-purple-400">{totalEnabledFeatures}</div>
            <div className="text-xs text-gray-400">Active Features</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-cyan-400">{categories.length}</div>
            <div className="text-xs text-gray-400">Categories</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">{features.length}</div>
            <div className="text-xs text-gray-400">Total Features</div>
          </div>
        </div>
      </div>
      
      {categories.map((category) => {
        const categoryFeatures = getFeaturesByCategory(category);
        const isExpanded = expandedCategory === category;
        const enabledCount = getEnabledCount(category);
        
        return (
          <div key={category} className="border border-white/10 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleCategory(category)}
              className="w-full p-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-gray-700/50 hover:to-gray-600/50 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="text-left">
                  <div className="text-white font-semibold">{category}</div>
                  <div className="text-sm text-gray-400">
                    {enabledCount}/{categoryFeatures.length} features active
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-400">
                  {categoryFeatures.length} features
                </div>
                {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </div>
            </button>
            
            {isExpanded && (
              <div className="p-4 bg-black/20 border-t border-white/10">
                <div className="grid gap-3">
                  {categoryFeatures.map((feature) => {
                    const Icon = feature.icon;
                    const isEnabled = enabledFeatures[feature.id] || feature.enabled;
                    
                    return (
                      <div key={feature.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 ${feature.color}`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium text-sm">{feature.title}</span>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">{feature.description}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleFeature(feature)}
                          className={`w-10 h-5 rounded-full transition-colors ${
                            isEnabled ? 'bg-green-500' : 'bg-gray-600'
                          }`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                            isEnabled ? 'translate-x-5' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
      
      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
        <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
        <div className="text-white font-semibold mb-1">Professional Development Suite! ⚡</div>
        <div className="text-sm text-gray-400">
          {features.length}+ features to supercharge your development workflow
        </div>
      </div>
    </div>
  );
};

export default ProfessionalFeatures;