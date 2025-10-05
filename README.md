# 🌌 NikkuAI09 Beast Mode

**The Ultimate Autonomous AI Development Platform**

Created by **Nikhil Mehra** | Version 2.0.0 | MIT License

---

## 🚀 What is NikkuAI09 Beast Mode?

A fully autonomous AI-powered development platform that combines:
- **Cosmic Orchestration Engine** - Nonstop coding loops with streaming
- **Multi-Agent System** - Specialized AI agents (Coder, Tester, Docs)
- **Plan → Approve → Execute** - Review before execution
- **Auto-Test & Auto-Fix** - Self-healing code generation (up to 3 retries)
- **Snapshots & Rollback** - Time travel for your code
- **Voice-to-Code** - Speak in 12+ languages
- **Command Palette (Ctrl+K)** - Professional developer shortcuts
- **Deployment Automation** - One-click deploy to Vercel/Netlify/GitHub

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure API (edit .env file)
VITE_OPENROUTER_API_KEY=your_key_here
VITE_BASE_URL=https://openrouter.ai/api/v1
VITE_MODEL=google/gemini-1.5-flash

# 3. Run development server
npm run dev

# 4. Open browser
# Visit http://localhost:5173
```

---

## 🏗️ Architecture

### Core Engines (Backend)

```
src/engine/
├── apiClient.ts           # Unified API client (streaming + single-shot)
├── monacoAdapter.ts       # Monaco editor integration
├── fileManager.ts         # File storage with events
├── snapshotManager.ts     # Version control & rollback
├── orchestrator.ts        # Nonstop orchestration loop
├── prompts.ts            # System prompts & templates
├── testRunner.ts         # Test execution engine
├── deploymentEngine.ts   # Deployment automation
├── voiceEngine.ts        # 12-language speech recognition
└── agents/
    ├── coderAgent.ts     # Code generation agent
    ├── testerAgent.ts    # Testing & auto-fix agent
    └── docsAgent.ts      # Documentation agent
```

### UI Components

```
src/components/
├── CommandPalette.tsx        # Ctrl+K quick actions
├── PlanApprovalModal.tsx     # Plan review UI
├── SnapshotManager.tsx       # Version control UI
├── VoiceControl.tsx          # Mic button
├── SettingsDrawer.tsx        # 200+ settings
└── main/
    ├── ChatWindow.tsx        # Chat interface
    ├── CodeArea.tsx          # Monaco editor
    ├── ChatBar.tsx           # Input area
    └── TopBar.tsx            # Navigation
```

---

## 🎯 Core Features

### 1. Plan → Approve → Execute Workflow

Every project starts with a plan that you review:

```typescript
// User sends task
orchestrator.generatePlan("Build a todo app")
  → AI generates detailed plan
  → User reviews in modal (Approve/Reject/Edit)
  → User approves
  → orchestrator.executePlan() starts autonomous execution
```

**UI Flow:**
1. User submits task
2. AI generates plan (file tree + steps)
3. Plan modal appears
4. User clicks "Approve"
5. Autonomous execution begins

### 2. Nonstop Orchestration Engine

Continuous coding loop with streaming:

```typescript
const orchestrator = new Orchestrator(apiClient, monacoAdapter);

// Set callbacks
orchestrator.setStatusCallback((status) => {
  console.log(`Progress: ${status.progress}%`);
  console.log(`Files: ${status.filesWritten}`);
});

orchestrator.setFileCreatedCallback((file) => {
  console.log(`Created: ${file.name}`);
});

// Start execution
await orchestrator.executePlan("Build authentication system");
```

**Features:**
- Streams AI responses in real-time
- Parses `FILE:` markers with fenced code blocks
- Writes to Monaco editor automatically
- Tracks progress with `[PROGRESS]` tokens
- Stops on `[ALL_DONE]` token
- Supports pause/resume/stop

### 3. Multi-Agent System

Three specialized AI agents working together:

#### Coder Agent
```typescript
const coderAgent = new CoderAgent(apiClient);

// Generate files
await coderAgent.produceFiles("Create login component");

// Explain code
await coderAgent.explainCode(selectedCode);

// Refactor
await coderAgent.refactorCode(code, "better performance");

// Fix errors
await coderAgent.fixCode(filename, content, errorMessage);
```

#### Tester Agent
```typescript
const testerAgent = new TesterAgent(apiClient);

// Generate tests
const tests = await testerAgent.generateTests(filename, content);

// Run tests
const result = await testerAgent.runTests(files);

// Auto-fix failed tests (up to 3 retries)
const { testsPassed, fixAttempts } =
  await testerAgent.generateAndRunTests(filename, content, true);
```

#### Docs Agent
```typescript
const docsAgent = new DocsAgent(apiClient);

// Generate README
await docsAgent.generateReadme("MyProject", files);

// API docs
await docsAgent.generateApiDocs(files);

// Component docs
await docsAgent.generateComponentDocs(files);
```

### 4. File Management

Complete file system with persistence:

```typescript
import { fileManager } from './engine/fileManager';

// Create
fileManager.create({ name: 'App.tsx', content: '...' });

// Read
const file = fileManager.read('App.tsx');

// Update
fileManager.update('App.tsx', newContent);

// Delete
fileManager.delete('App.tsx');

// Search
const results = fileManager.search('useState');

// Listen to changes
fileManager.onChange((files) => {
  console.log(`Files updated: ${files.length}`);
});
```

### 5. Snapshots & Rollback

Version control built-in:

```typescript
import { snapshotManager } from './engine/snapshotManager';

// Save snapshot
snapshotManager.saveSnapshot("Added authentication");

// List all
const snapshots = snapshotManager.list();

// Restore
snapshotManager.restore(snapshotId);

// Compare
const diff = snapshotManager.compare(id1, id2);
console.log(diff.added, diff.removed, diff.modified);
```

### 6. Test Runner & Auto-Fix

Automated testing with self-healing:

```typescript
import { testRunner } from './engine/testRunner';

// Run tests
const result = await testRunner.runTests(files);

// Auto-fix loop (in TesterAgent)
let attempts = 0;
while (!result.ok && attempts < 3) {
  const fixed = await testerAgent.fixFailedTests(filename, content, result.logs);
  result = await testRunner.runTests([{ name: filename, content: fixed }]);
  attempts++;
}
```

### 7. Deployment Engine

One-click deployment to multiple platforms:

```typescript
import { deploymentEngine } from './engine/deploymentEngine';

// Deploy to Vercel
const status = await deploymentEngine.deploy({
  platform: 'vercel',
  buildCommand: 'npm run build',
  outputDir: 'dist'
}, files);

// Deploy to Netlify
await deploymentEngine.deploy({
  platform: 'netlify',
  buildCommand: 'npm run build',
  outputDir: 'dist'
}, files);

// Create GitHub repo first
const repoUrl = await deploymentEngine.createGitHubRepo(
  'my-project',
  files,
  githubToken
);
```

### 8. Monaco Editor Integration

Professional code editing:

```typescript
import { MonacoAdapter } from './engine/monacoAdapter';

const monaco = new MonacoAdapter();
monaco.setEditor(editorInstance);

// Create file
monaco.createFile({ name: 'App.tsx', content: '...' });

// Open file
monaco.openFile('App.tsx');

// Update file
monaco.updateFile('App.tsx', newContent);

// Get content
const content = monaco.getCurrentContent();

// Get selection
const selected = monaco.getSelection();
```

---

## 🎨 UI Components Usage

### Command Palette (Ctrl+K)

```typescript
// Built-in commands:
- Refactor Code
- Generate Tests
- Create Documentation
- Deploy Project
- Create Snapshot
- Optimize Performance
- Explain Selection
```

### Voice Control

```typescript
// Activate voice input
<VoiceControl onTranscript={(text) => {
  // Process voice command
  handleUserMessage(text);
}} />
```

### Plan Approval Modal

```typescript
<PlanApprovalModal
  plan={generatedPlan}
  onApprove={() => orchestrator.executePlan(task)}
  onReject={() => setShowModal(false)}
  onEdit={(editedPlan) => regeneratePlan(editedPlan)}
/>
```

---

## 📊 Complete Example

Here's a full workflow:

```typescript
import { ApiClient } from './engine/apiClient';
import { MonacoAdapter } from './engine/monacoAdapter';
import { Orchestrator } from './engine/orchestrator';
import { CoderAgent } from './engine/agents/coderAgent';
import { TesterAgent } from './engine/agents/testerAgent';
import { DocsAgent } from './engine/agents/docsAgent';

// 1. Initialize
const apiClient = new ApiClient({
  engine: 'openrouter',
  baseUrl: 'https://openrouter.ai/api/v1',
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
  model: 'google/gemini-1.5-flash'
});

const monacoAdapter = new MonacoAdapter();
const orchestrator = new Orchestrator(apiClient, monacoAdapter);
const coderAgent = new CoderAgent(apiClient);
const testerAgent = new TesterAgent(apiClient);
const docsAgent = new DocsAgent(apiClient);

// 2. Generate Plan
const plan = await orchestrator.generatePlan("Build a todo app with React");

// 3. Show plan to user (in modal)
showPlanModal(plan, {
  onApprove: async () => {
    // 4. Execute plan
    await orchestrator.executePlan("Build a todo app with React");
  }
});

// 5. Monitor progress
orchestrator.setStatusCallback((status) => {
  updateProgressBar(status.progress);
  showCurrentStep(status.step);
});

// 6. When file is created
orchestrator.setFileCreatedCallback(async (file) => {
  // Generate tests
  const tests = await testerAgent.generateTests(file.name, file.content);

  // Run tests with auto-fix
  const { testsPassed } = await testerAgent.generateAndRunTests(
    file.name,
    file.content,
    true
  );

  if (testsPassed) {
    console.log(`✅ ${file.name} - Tests passed!`);
  }
});

// 7. Generate docs when done
orchestrator.setStatusCallback((status) => {
  if (status.progress === 100) {
    const readme = await docsAgent.generateReadme("TodoApp", fileManager.list());
    fileManager.create({ name: 'README.md', content: readme });
  }
});
```

---

## 🔧 Configuration

### API Setup

Edit `.env`:
```env
# OpenRouter (Recommended)
VITE_BASE_URL=https://openrouter.ai/api/v1
VITE_OPENROUTER_API_KEY=sk-or-v1-xxxxx
VITE_MODEL=google/gemini-1.5-flash

# Or Ollama (Local)
VITE_BASE_URL=http://localhost:11434/api
VITE_MODEL=llama3
```

### System Prompts

Customize in `src/engine/prompts.ts`:
```typescript
export const SYSTEM_PROMPTS = {
  AGENT: "You are NikkuAi09...",
  CHAT: "You are NikkuAi09 Chat Companion...",
  BEAST: "You are NikkuAi09 Beast Mode..."
};
```

---

## 🧪 Testing

```bash
# Run build (includes type checking)
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```

---

## 📚 Documentation

- **FEATURES.md** - Complete feature list
- **DEPLOYMENT_GUIDE.md** - Production deployment
- **MASTER_PROMPT.txt** - AI system prompt
- **PROMPTS.md** - Prompt engineering guide
- **PACKAGE_README.md** - Package overview

---

## 🌟 What Makes It BEAST?

❌ **Not just a chatbot** → Complete autonomous platform
❌ **Not manual** → Nonstop orchestration loops
❌ **Not basic** → Multi-agent, self-healing, voice-enabled
❌ **Not toy project** → Production-ready, professional quality

✅ **Fully Autonomous** - Runs without hand-holding
✅ **Self-Healing** - Auto-fixes its own errors
✅ **Voice-Enabled** - Speak your code into existence
✅ **Multi-Agent** - Specialized AI agents collaborate
✅ **Professional UI** - Beautiful, smooth, modern
✅ **Complete Docs** - Every feature explained

---

## 📜 License

MIT License - Copyright (c) 2025 Nikhil Mehra

---

## 🎉 Get Started

```bash
npm install
npm run dev
```

Then press `Ctrl+K` and explore! 🚀

---

**Built with ❤️ by Nikhil Mehra**

*Making AI development accessible to everyone.*
