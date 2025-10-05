# 🏗️ NikkuAI09 Beast Mode - Engine Architecture

**Complete Code Logic Documentation**

---

## 📐 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      USER INTERFACE                          │
│  (React Components + Monaco Editor + Command Palette)       │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                   ORCHESTRATOR LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Orchestrator │  │   Prompts    │  │   Parsers    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    AGENT LAYER                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Coder Agent  │  │ Tester Agent │  │  Docs Agent  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                   SERVICE LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  API Client  │  │ Test Runner  │  │  Deployment  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                   STORAGE LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │FileManager   │  │  Snapshots   │  │ Monaco Models│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧠 Core Components

### 1. ApiClient (`src/engine/apiClient.ts`)

**Purpose:** Unified API client for all AI model interactions

**Capabilities:**
- Single-shot requests (non-streaming)
- Streaming requests with chunk handling
- Support for multiple providers (OpenRouter, Ollama, Custom)
- Automatic error handling and retries
- Token management

**Key Methods:**

```typescript
class ApiClient {
  // Single request (returns complete response)
  async callSingle(system: string, user: string, opts): Promise<string>

  // Streaming request (returns chunks via callback)
  async callStream(
    system: string,
    messages: ChatMessage[],
    handlers: {
      onChunk: (text: string) => void,
      onComplete?: () => void,
      onError?: (error: Error) => void,
      signal?: AbortSignal
    }
  ): Promise<void>

  // Update configuration
  setConfig(cfg: Partial<APIConfig>): void
}
```

**Streaming Flow:**
```
User Request
  ↓
ApiClient.callStream()
  ↓
Fetch with streaming enabled
  ↓
Read chunks from response.body
  ↓
Decode chunks (TextDecoder)
  ↓
Split by newlines
  ↓
Parse SSE format (data: prefix)
  ↓
Extract delta content
  ↓
Call onChunk(text)
  ↓
Repeat until [DONE]
  ↓
Call onComplete()
```

---

### 2. MonacoAdapter (`src/engine/monacoAdapter.ts`)

**Purpose:** Bridge between application logic and Monaco Editor

**Capabilities:**
- Create/open/update/delete files in editor
- Multi-file model management
- Language detection and syntax highlighting
- Cursor operations (insert, replace, selection)
- Model lifecycle management

**Key Methods:**

```typescript
class MonacoAdapter {
  // Initialize with editor instance
  setEditor(editorInstance: IStandaloneCodeEditor): void

  // File operations
  createFile(file: FileData): void
  openFile(name: string): void
  updateFile(name: string, content: string): void
  deleteFile(name: string): void

  // Content operations
  getCurrentContent(): string
  getSelection(): string
  insertAtCursor(text: string): void
  replaceSelection(text: string): void

  // Utilities
  hasFile(name: string): boolean
  getFileList(): string[]
}
```

**File Creation Flow:**
```
createFile({ name: 'App.tsx', content: '...' })
  ↓
Create Monaco URI (inmemory://model/App.tsx)
  ↓
Detect language from extension
  ↓
Create Monaco model with content
  ↓
Store in models map
  ↓
Set as active model in editor
  ↓
File ready for editing
```

---

### 3. FileManager (`src/engine/fileManager.ts`)

**Purpose:** Persistent file storage with event system

**Capabilities:**
- CRUD operations on files
- LocalStorage persistence
- File search functionality
- Event-driven change notifications
- Bulk operations
- Import/export capabilities

**Key Methods:**

```typescript
class FileManager {
  // Core operations
  create(file: Omit<FileData, 'version' | 'createdAt' | 'updatedAt'>): FileData
  read(name: string): FileData | null
  update(name: string, content: string): FileData
  delete(name: string): void
  rename(oldName: string, newName: string): boolean

  // Query operations
  list(): FileData[]
  exists(name: string): boolean
  search(query: string): FileData[]

  // Bulk operations
  bulkUpdate(files: FileData[]): void
  clear(): void

  // Events
  onChange(listener: (files: FileData[]) => void): () => void

  // Import/Export
  export(): string
  import(jsonData: string): boolean
}
```

**Update Flow with Events:**
```
fileManager.update('App.tsx', newContent)
  ↓
Find existing file or create new
  ↓
Update content, version++, updatedAt
  ↓
Save to localStorage
  ↓
Notify all registered listeners
  ↓
Listeners update UI / trigger actions
```

---

### 4. Orchestrator (`src/engine/orchestrator.ts`)

**Purpose:** Core autonomous execution engine

**Capabilities:**
- Plan generation and review workflow
- Nonstop execution with streaming
- FILE: marker parsing
- Progress tracking
- Pause/resume/stop controls
- Automatic file creation in Monaco

**Key Methods:**

```typescript
class Orchestrator {
  // Plan generation
  async generatePlan(task: string): Promise<string>

  // Autonomous execution
  async executePlan(task: string): Promise<void>

  // Controls
  pause(): void
  resume(): void
  stop(): void

  // Status callbacks
  setStatusCallback(callback: (status: OrchestratorStatus) => void): void
  setFileCreatedCallback(callback: (file: FileData) => void): void
  setChunkCallback(callback: (chunk: string) => void): void

  // State
  getStatus(): OrchestratorStatus
  isRunning(): boolean
}
```

**Execution Flow:**
```
orchestrator.executePlan(task)
  ↓
Initialize streaming with BEAST prompt
  ↓
Start streaming API call
  ↓
Receive chunks → handleChunk()
  ↓
Buffer accumulation
  ↓
Parse FILE: markers with regex
  ↓
Extract: filename, language, content
  ↓
For each parsed block:
  ├─→ fileManager.update(name, content)
  ├─→ monaco.updateFile(name, content)
  ├─→ snapshotManager.saveSnapshot()
  ├─→ Emit fileCreated callback
  └─→ Update progress
  ↓
Check for [ALL_DONE] token
  ↓
If found → stop execution
  ↓
Otherwise continue streaming
```

**FILE: Marker Parsing:**
```regex
/FILE:\s*([^\n\r]+)\s*\n```(\w+)?\s*\n([\s\S]*?)```/gi

Captures:
1. Filename (e.g., "src/App.tsx")
2. Language (e.g., "tsx")
3. Content (multiline code)
```

---

### 5. SnapshotManager (`src/engine/snapshotManager.ts`)

**Purpose:** Version control and rollback system

**Capabilities:**
- Create snapshots of entire project state
- List all snapshots with metadata
- Restore to any previous snapshot
- Compare snapshots (diff)
- Import/export snapshots
- Automatic pruning (max 50 snapshots)

**Key Methods:**

```typescript
class SnapshotManager {
  // Core operations
  saveSnapshot(message: string): Snapshot
  list(): Snapshot[]
  get(id: string): Snapshot | null
  restore(id: string): boolean
  delete(id: string): boolean

  // Utilities
  getLatest(): Snapshot | null
  compare(id1: string, id2: string): { added, removed, modified }
  export(id: string): string | null
  import(jsonData: string): boolean
}
```

**Snapshot Structure:**
```typescript
interface Snapshot {
  id: string;              // Unique identifier
  timestamp: number;       // Creation time
  message: string;         // Description
  files: FileData[];       // Complete file state
  filesCount: number;      // Quick stat
  totalSize: number;       // Quick stat
}
```

**Restore Flow:**
```
snapshotManager.restore(snapshotId)
  ↓
Retrieve snapshot from localStorage
  ↓
fileManager.clear()
  ↓
fileManager.bulkUpdate(snapshot.files)
  ↓
Trigger change events
  ↓
UI updates Monaco editor
  ↓
Create new snapshot ("Restored from...")
```

---

## 🤖 Agent System

### 6. CoderAgent (`src/engine/agents/coderAgent.ts`)

**Purpose:** Code generation and manipulation

**Capabilities:**
- Generate new files
- Explain existing code
- Refactor for improvements
- Optimize for performance
- Fix errors automatically
- Add features to existing code

**Key Methods:**

```typescript
class CoderAgent {
  async produceFiles(task: string, context?: string): Promise<string>
  async explainCode(code: string): Promise<string>
  async refactorCode(code: string, target: string): Promise<string>
  async optimizeCode(code: string): Promise<string>
  async fixCode(filename: string, content: string, error: string): Promise<string>
  async addFeature(feature: string, existingCode: string): Promise<string>

  // Streaming variant
  async streamProduceFiles(
    task: string,
    context: string | undefined,
    handlers: { onChunk, onComplete, onError }
  ): Promise<void>
}
```

**Temperature Settings:**
- Code generation: 0.2 (deterministic)
- Error fixing: 0.1 (very deterministic)
- Refactoring: 0.2 (mostly deterministic)

---

### 7. TesterAgent (`src/engine/agents/testerAgent.ts`)

**Purpose:** Testing and quality assurance

**Capabilities:**
- Generate unit tests
- Run tests (via API or in-browser)
- Auto-fix failed tests (up to 3 retries)
- Validate code quality
- Generate test reports

**Key Methods:**

```typescript
class TesterAgent {
  async generateTests(filename: string, content?: string): Promise<string>
  async runTests(files: { name, content }[]): Promise<TestResult>
  async runTestsForFile(filename: string, content: string): Promise<TestResult>

  // Auto-fix loop
  async generateAndRunTests(
    filename: string,
    content: string,
    autoFix: boolean
  ): Promise<{
    testsGenerated: boolean,
    testsPassed: boolean,
    testCode: string,
    result: TestResult | null,
    fixAttempts: number
  }>

  async fixFailedTests(
    filename: string,
    content: string,
    errorLog: string
  ): Promise<string>

  async validateCodeQuality(
    filename: string,
    content: string
  ): Promise<{ quality, issues, suggestions }>
}
```

**Auto-Fix Loop:**
```
generateAndRunTests(file, content, autoFix=true)
  ↓
Generate test code
  ↓
Run tests
  ↓
Tests passed? → Return success
  ↓
Tests failed AND autoFix=true?
  ↓
fixAttempts = 0
  ↓
LOOP (while fixAttempts < 3 AND !passed):
  ├─→ Call AI to fix code based on error logs
  ├─→ Parse fixed code from response
  ├─→ Run tests again with fixed code
  ├─→ passed = result.ok
  ├─→ fixAttempts++
  └─→ If passed, break loop
  ↓
Return result with fixAttempts count
```

---

### 8. DocsAgent (`src/engine/agents/docsAgent.ts`)

**Purpose:** Documentation generation

**Capabilities:**
- Generate README files
- Create API documentation
- Generate component documentation
- Create changelogs
- Generate contributing guides
- Create tutorials
- Explain project structure

**Key Methods:**

```typescript
class DocsAgent {
  async generateReadme(
    projectName: string,
    files: FileData[],
    projectMeta?: { description, techStack, features }
  ): Promise<string>

  async generateDocsForFile(filename: string, content: string): Promise<string>
  async generateApiDocs(files: FileData[]): Promise<string>
  async generateComponentDocs(files: FileData[]): Promise<string>
  async generateChangelog(prev: string, current: string, changes: string[]): Promise<string>
  async generateContributingGuide(): Promise<string>
  async generateLicense(type: 'MIT' | 'Apache-2.0' | ...): Promise<string>
  async explainProject(files: FileData[]): Promise<string>
  async generateTutorial(topic: string, files: FileData[]): Promise<string>
}
```

---

## 🧪 Testing & Deployment

### 9. TestRunner (`src/engine/testRunner.ts`)

**Purpose:** Execute tests in various environments

**Capabilities:**
- Run tests via API (server-side)
- Run tests in browser (client-side)
- Create mock test framework (expect, describe, it)
- Format test results
- Handle test errors

**Key Methods:**

```typescript
class TestRunner {
  // Run via API
  async runTests(files: TestFile[]): Promise<TestResult>

  // Run in browser (fallback)
  async runInBrowser(files: TestFile[]): Promise<TestResult>

  // Configuration
  setApiEndpoint(endpoint: string): void
}
```

**In-Browser Test Execution:**
```
runInBrowser(files)
  ↓
Filter test files (*.test.*, *.spec.*)
  ↓
For each test file:
  ├─→ Remove import statements
  ├─→ Remove export statements
  ├─→ Create test function with Function()
  ├─→ Inject mock expect/describe/it
  ├─→ Execute function
  ├─→ Catch errors
  └─→ Track pass/fail
  ↓
Format results with ✅/❌
  ↓
Return TestResult
```

---

### 10. DeploymentEngine (`src/engine/deploymentEngine.ts`)

**Purpose:** Automated deployment to platforms

**Capabilities:**
- Deploy to Vercel
- Deploy to Netlify
- Deploy to GitHub Pages
- Deploy to Supabase
- Create GitHub repositories
- Validate deployment configs
- Track deployment progress

**Key Methods:**

```typescript
class DeploymentEngine {
  async deploy(
    config: DeploymentConfig,
    files: { name, content }[]
  ): Promise<DeploymentStatus>

  async createGitHubRepo(
    repoName: string,
    files: { name, content }[],
    token: string
  ): Promise<string>

  async validateDeploymentConfig(
    config: DeploymentConfig
  ): Promise<{ valid: boolean, errors: string[] }>

  // Status management
  getStatus(): DeploymentStatus
  setStatusCallback(callback: (status) => void): void
  reset(): void
}
```

**Deployment Flow:**
```
deploymentEngine.deploy(config, files)
  ↓
updateStatus({ status: 'preparing', progress: 10 })
  ↓
Switch by platform:
  ├─→ Vercel: POST /api/deploy/vercel
  ├─→ Netlify: POST /api/deploy/netlify
  ├─→ GitHub Pages: POST /api/deploy/github-pages
  └─→ Supabase: POST /api/deploy/supabase (Edge Functions)
  ↓
updateStatus({ status: 'deploying', progress: 30 })
  ↓
Wait for API response
  ↓
If success:
  └─→ updateStatus({ status: 'success', progress: 100, url })
If error:
  └─→ updateStatus({ status: 'error', error: message })
```

---

## 📝 Prompts System

### 11. Prompts (`src/engine/prompts.ts`)

**Purpose:** Centralized prompt management

**Structure:**

```typescript
export const SYSTEM_PROMPTS = {
  AGENT: "...",   // For normal agent mode
  CHAT: "...",    // For conversational mode
  BEAST: "..."    // For autonomous beast mode
};

export const TEMPLATES = {
  GENERATE_PLAN: (task) => `...`,
  FIX_FILE: (filename, content, error) => `...`,
  GENERATE_TESTS: (filename, content) => `...`,
  EXPLAIN_CODE: (code) => `...`,
  REFACTOR_CODE: (code, target) => `...`,
  OPTIMIZE_CODE: (code) => `...`,
  GENERATE_DOCS: (filename, content) => `...`,
  CREATE_README: (projectName, files) => `...`,
  DEBUG_ERROR: (error, context) => `...`,
  ADD_FEATURE: (feature, existingCode) => `...`
};

export const AGENT_PROMPTS = {
  CODER: "...",   // Coder agent specific
  TESTER: "...",  // Tester agent specific
  DOCS: "..."     // Docs agent specific
};
```

**Usage Pattern:**
```typescript
// Generate plan
const plan = await apiClient.callSingle(
  SYSTEM_PROMPTS.AGENT,
  TEMPLATES.GENERATE_PLAN(task)
);

// Fix file
const fixed = await apiClient.callSingle(
  AGENT_PROMPTS.CODER,
  TEMPLATES.FIX_FILE(filename, content, error),
  { temperature: 0.1 }
);
```

---

## 🔄 Complete Workflow Example

### User Story: "Build a todo app with tests"

```
1. USER INITIATES
   User: "Build a todo app with React"
   ↓

2. PLAN GENERATION
   orchestrator.generatePlan(task)
   ↓
   ApiClient.callSingle(SYSTEM_PROMPTS.AGENT, GENERATE_PLAN template)
   ↓
   AI returns detailed plan (file tree + steps)
   ↓
   UI shows PlanApprovalModal
   ↓

3. USER APPROVES
   User clicks "Approve"
   ↓
   orchestrator.executePlan(task)
   ↓

4. AUTONOMOUS EXECUTION
   ApiClient.callStream(SYSTEM_PROMPTS.BEAST, messages)
   ↓
   AI starts streaming response with FILE: markers
   ↓
   orchestrator.handleChunk(chunk)
   ↓
   Parse FILE: blocks → ["App.tsx", "TodoList.tsx", ...]
   ↓

5. FILE CREATION LOOP
   For each file:
   ├─→ fileManager.update(name, content)
   ├─→ monaco.updateFile(name, content)
   ├─→ snapshotManager.saveSnapshot(`Created ${name}`)
   ├─→ Emit fileCreated callback
   └─→ Update progress (filesWritten++, progress += 10%)
   ↓

6. TESTING (for each file)
   testerAgent.generateTests(filename, content)
   ↓
   Create test file (e.g., "App.test.tsx")
   ↓
   testRunner.runTests([file, testFile])
   ↓
   If failed:
     ├─→ testerAgent.fixFailedTests(filename, content, logs)
     ├─→ Parse fixed code
     ├─→ testRunner.runTests again
     └─→ Repeat up to 3 times
   ↓

7. DOCUMENTATION
   When progress === 100%:
   ├─→ docsAgent.generateReadme(projectName, files)
   ├─→ fileManager.create({ name: 'README.md', content })
   └─→ monaco.createFile(README)
   ↓

8. COMPLETION
   AI outputs [ALL_DONE]
   ↓
   orchestrator.stop()
   ↓
   Final snapshot created
   ↓
   UI shows success message
   ↓
   User can now edit, deploy, or rollback
```

---

## 🎛️ Control Tokens

### Orchestrator Control Tokens

**[STEP] <description>**
- Indicates current step
- Example: `[STEP] Creating authentication system`
- Captured by: `/\[STEP\]\s*(.+?)(?:\n|$)/`

**[PROGRESS] <percent>%**
- Shows completion percentage
- Example: `[PROGRESS] 45%`
- Captured by: `/\[PROGRESS\]\s*(\d+)%/`

**[ALL_DONE]**
- Signals task completion
- Triggers orchestrator.stop()
- Example: `[ALL_DONE] Project complete!`

**[PAUSE_FOR_APPROVAL]**
- Requests user input mid-flow
- Triggers orchestrator.pause()
- Example: `[PAUSE_FOR_APPROVAL] Database schema designed. Approve?`

---

## 🔐 Security Considerations

### 1. API Key Protection
```typescript
// ❌ Never hardcode
const apiKey = "sk-xxxxx";

// ✅ Use environment variables
const apiKey = import.meta.env.VITE_API_KEY;

// ✅ Best: Server-side proxy
fetch('/api/chat', { body: JSON.stringify(payload) });
```

### 2. Input Sanitization
```typescript
// Sanitize user input before processing
const sanitize = (input: string) => {
  return input
    .replace(/<script>/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
};
```

### 3. Code Execution Safety
```typescript
// ⚠️ eval() used in ChatWindow (for markdown rendering)
// Consider alternatives like:
// - DOMPurify for HTML sanitization
// - Sandboxed iframes for execution
// - Web Workers for isolated execution
```

---

## 📊 Performance Optimization

### 1. Streaming Response Handling
- Decode chunks incrementally
- Split by newlines to avoid buffering entire response
- Parse JSON chunks safely with try-catch

### 2. File Storage
- Use LocalStorage for persistence
- Implement lazy loading for large files
- Consider IndexedDB for larger projects

### 3. Monaco Editor
- Create models lazily (on-demand)
- Dispose unused models to free memory
- Use Web Workers for syntax checking (built-in)

### 4. Snapshot Management
- Limit to 50 snapshots (automatic pruning)
- Store diffs instead of full copies (future optimization)
- Compress snapshots before storage (future optimization)

---

## 🧩 Extension Points

### Adding New Agents

```typescript
// src/engine/agents/designerAgent.ts
import { ApiClient } from '../apiClient';
import { AGENT_PROMPTS } from '../prompts';

export class DesignerAgent {
  private api: ApiClient;

  constructor(api: ApiClient) {
    this.api = api;
  }

  async generateDesignSystem(): Promise<string> {
    const prompt = `Create a design system with:
    - Color palette
    - Typography scale
    - Spacing system
    - Component library
    Format as CSS variables.`;

    return await this.api.callSingle(
      AGENT_PROMPTS.DESIGNER, // Add to prompts.ts
      prompt,
      { temperature: 0.5 }
    );
  }
}
```

### Adding New Deployment Platforms

```typescript
// In deploymentEngine.ts
private async deployToCloudflare(
  config: DeploymentConfig,
  files: { name: string; content: string }[]
): Promise<DeploymentStatus> {
  this.updateStatus({
    status: 'deploying',
    progress: 30,
    message: 'Deploying to Cloudflare Pages...',
  });

  const response = await fetch('/api/deploy/cloudflare', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ files, config }),
  });

  // ... handle response

  this.updateStatus({
    status: 'success',
    progress: 100,
    message: 'Deployed to Cloudflare Pages',
    url: result.url,
  });

  return this.status;
}
```

---

## 🎓 Learning Resources

### Understanding the Orchestrator
1. Read `orchestrator.ts` line by line
2. Trace handleChunk() flow
3. Understand parseFileBlocks() regex
4. See how callbacks are used for UI updates

### Understanding Streaming
1. Review ApiClient.callStream()
2. See how ReadableStream works
3. Understand SSE (Server-Sent Events) format
4. Practice with fetch + streaming

### Understanding Agents
1. Each agent is a wrapper around API calls
2. Agents have specific prompts and temperatures
3. Agents can be composed (one agent calls another)
4. Agents emit events for UI updates

---

**This architecture enables a fully autonomous, self-healing, multi-agent AI development system that runs continuously until task completion! 🚀**
