import { ApiClient } from '../apiClient';
import { AGENT_PROMPTS, TEMPLATES } from '../prompts';
import type { FileData } from '../monacoAdapter';

export class DocsAgent {
  private api: ApiClient;

  constructor(api: ApiClient) {
    this.api = api;
  }

  async generateReadme(
    projectName: string,
    files: FileData[],
    projectMeta?: {
      description?: string;
      techStack?: string[];
      features?: string[];
    }
  ): Promise<string> {
    const fileList = files.map((f) => f.name);
    const prompt = TEMPLATES.CREATE_README(projectName, fileList);

    const enhancedPrompt = projectMeta
      ? `${prompt}

Additional context:
${projectMeta.description ? `Description: ${projectMeta.description}` : ''}
${projectMeta.techStack ? `Tech stack: ${projectMeta.techStack.join(', ')}` : ''}
${projectMeta.features ? `Features:\n${projectMeta.features.map((f) => `- ${f}`).join('\n')}` : ''}`
      : prompt;

    return await this.api.callSingle(AGENT_PROMPTS.DOCS, enhancedPrompt, {
      temperature: 0.4,
      max_tokens: 2500,
    });
  }

  async generateDocsForFile(filename: string, content: string): Promise<string> {
    return await this.api.callSingle(AGENT_PROMPTS.DOCS, TEMPLATES.GENERATE_DOCS(filename, content), {
      temperature: 0.3,
      max_tokens: 2000,
    });
  }

  async generateApiDocs(files: FileData[]): Promise<string> {
    const apiFiles = files.filter((f) =>
      f.name.includes('api') || f.name.includes('route') || f.name.includes('controller')
    );

    const prompt = `Generate API documentation for these files:

${apiFiles.map((f) => `File: ${f.name}\n\`\`\`\n${f.content}\n\`\`\`\n`).join('\n')}

Include:
1. Overview
2. Endpoints (method, path, description)
3. Request/response formats
4. Authentication requirements
5. Error codes
6. Usage examples

Format as markdown.`;

    return await this.api.callSingle(AGENT_PROMPTS.DOCS, prompt, {
      temperature: 0.3,
      max_tokens: 3000,
    });
  }

  async generateComponentDocs(files: FileData[]): Promise<string> {
    const componentFiles = files.filter(
      (f) =>
        (f.name.includes('component') || f.name.endsWith('.tsx') || f.name.endsWith('.jsx')) &&
        !f.name.includes('test')
    );

    const prompt = `Generate component documentation for:

${componentFiles.map((f) => `Component: ${f.name}\n\`\`\`\n${f.content}\n\`\`\`\n`).join('\n')}

Include:
1. Component overview
2. Props interface
3. Usage examples
4. Styling notes
5. Related components

Format as markdown.`;

    return await this.api.callSingle(AGENT_PROMPTS.DOCS, prompt, {
      temperature: 0.3,
      max_tokens: 2500,
    });
  }

  async generateChangelog(
    previousVersion: string,
    currentVersion: string,
    changes: string[]
  ): Promise<string> {
    const prompt = `Generate a changelog entry:

Version: ${previousVersion} → ${currentVersion}

Changes:
${changes.map((c) => `- ${c}`).join('\n')}

Format as markdown with:
- Version heading
- Date
- Changes grouped by: Added, Changed, Fixed, Removed
- Professional tone`;

    return await this.api.callSingle(AGENT_PROMPTS.DOCS, prompt, {
      temperature: 0.3,
    });
  }

  async generateContributingGuide(): Promise<string> {
    const prompt = `Generate a CONTRIBUTING.md file with:

1. How to contribute
2. Code of conduct
3. Development setup
4. Coding standards
5. Pull request process
6. Testing requirements
7. Documentation requirements

Make it welcoming and clear.`;

    return await this.api.callSingle(AGENT_PROMPTS.DOCS, prompt, {
      temperature: 0.4,
      max_tokens: 2000,
    });
  }

  async generateLicense(type: 'MIT' | 'Apache-2.0' | 'GPL-3.0' | 'BSD-3-Clause'): Promise<string> {
    const templates: Record<string, string> = {
      MIT: `MIT License

Copyright (c) ${new Date().getFullYear()}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`,
      'Apache-2.0': 'Apache License 2.0 template...',
      'GPL-3.0': 'GPL 3.0 template...',
      'BSD-3-Clause': 'BSD 3-Clause template...',
    };

    return templates[type] || templates.MIT;
  }

  async explainProject(files: FileData[]): Promise<string> {
    const fileTree = files.map((f) => f.name).join('\n');

    const prompt = `Explain this project structure:

Files:
${fileTree}

Provide:
1. Project type and purpose
2. Architecture overview
3. Key components
4. Data flow
5. Technologies used

Keep it concise and high-level.`;

    return await this.api.callSingle(AGENT_PROMPTS.DOCS, prompt, {
      temperature: 0.4,
    });
  }

  async generateTutorial(topic: string, files: FileData[]): Promise<string> {
    const prompt = `Create a step-by-step tutorial for: ${topic}

Project files available:
${files.map((f) => f.name).join('\n')}

Include:
1. Prerequisites
2. Step-by-step instructions
3. Code examples
4. Expected output
5. Troubleshooting tips
6. Next steps

Make it beginner-friendly.`;

    return await this.api.callSingle(AGENT_PROMPTS.DOCS, prompt, {
      temperature: 0.4,
      max_tokens: 3000,
    });
  }
}
