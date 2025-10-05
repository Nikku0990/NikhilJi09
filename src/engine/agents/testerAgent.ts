import { ApiClient } from '../apiClient';
import { AGENT_PROMPTS, TEMPLATES } from '../prompts';

export interface TestResult {
  ok: boolean;
  logs: string;
  passed: number;
  failed: number;
  errors: string[];
}

export class TesterAgent {
  private api: ApiClient;
  private maxRetries = 3;

  constructor(api: ApiClient) {
    this.api = api;
  }

  async generateTests(filename: string, content?: string): Promise<string> {
    const prompt = TEMPLATES.GENERATE_TESTS(filename, content);

    return await this.api.callSingle(AGENT_PROMPTS.TESTER, prompt, {
      temperature: 0.3,
      max_tokens: 2000,
    });
  }

  async runTests(files: { name: string; content: string }[]): Promise<TestResult> {
    try {
      const response = await fetch('/api/run-tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ files }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          ok: false,
          logs: errorText,
          passed: 0,
          failed: 1,
          errors: [errorText],
        };
      }

      const result = await response.json();
      return result;
    } catch (error: any) {
      console.error('[TesterAgent] Run tests error:', error);
      return {
        ok: false,
        logs: `Test runner error: ${error.message}`,
        passed: 0,
        failed: 1,
        errors: [error.message],
      };
    }
  }

  async runTestsForFile(filename: string, content: string): Promise<TestResult> {
    const testFiles = [{ name: filename, content }];
    return await this.runTests(testFiles);
  }

  async generateAndRunTests(
    filename: string,
    content: string,
    autoFix = true
  ): Promise<{
    testsGenerated: boolean;
    testsPassed: boolean;
    testCode: string;
    result: TestResult | null;
    fixAttempts: number;
  }> {
    let fixAttempts = 0;
    let testsPassed = false;
    let testCode = '';
    let result: TestResult | null = null;

    try {
      testCode = await this.generateTests(filename, content);

      if (!testCode) {
        return {
          testsGenerated: false,
          testsPassed: false,
          testCode: '',
          result: null,
          fixAttempts: 0,
        };
      }

      result = await this.runTests([
        { name: filename, content },
        { name: this.getTestFilename(filename), content: testCode },
      ]);

      testsPassed = result.ok;

      if (!testsPassed && autoFix) {
        while (fixAttempts < this.maxRetries && !testsPassed) {
          fixAttempts++;

          const fixedContent = await this.fixFailedTests(filename, content, result.logs);

          if (fixedContent) {
            result = await this.runTests([
              { name: filename, content: fixedContent },
              { name: this.getTestFilename(filename), content: testCode },
            ]);

            testsPassed = result.ok;

            if (testsPassed) {
              break;
            }
          }
        }
      }

      return {
        testsGenerated: true,
        testsPassed,
        testCode,
        result,
        fixAttempts,
      };
    } catch (error) {
      console.error('[TesterAgent] Generate and run tests error:', error);
      return {
        testsGenerated: false,
        testsPassed: false,
        testCode,
        result,
        fixAttempts,
      };
    }
  }

  async fixFailedTests(filename: string, content: string, errorLog: string): Promise<string> {
    const prompt = `Fix the code to make tests pass.

File: ${filename}
Content:
\`\`\`
${content}
\`\`\`

Test errors:
${errorLog}

Return the fixed code using FILE: marker and fenced code block.
Only fix what's broken, preserve working code.`;

    try {
      const fixed = await this.api.callSingle(AGENT_PROMPTS.TESTER, prompt, {
        temperature: 0.1,
      });

      const fileMatch = fixed.match(/FILE:\s*[^\n]+\s*\n```\w*\s*\n([\s\S]*?)```/i);
      if (fileMatch) {
        return fileMatch[1];
      }

      return fixed;
    } catch (error) {
      console.error('[TesterAgent] Fix failed tests error:', error);
      return content;
    }
  }

  private getTestFilename(filename: string): string {
    const parts = filename.split('.');
    const ext = parts.pop();
    const base = parts.join('.');

    if (ext === 'tsx' || ext === 'ts') {
      return `${base}.test.${ext}`;
    } else if (ext === 'jsx' || ext === 'js') {
      return `${base}.test.${ext}`;
    } else if (ext === 'py') {
      return `test_${base}.py`;
    }

    return `${filename}.test`;
  }

  async validateCodeQuality(filename: string, content: string): Promise<{
    quality: 'excellent' | 'good' | 'fair' | 'poor';
    issues: string[];
    suggestions: string[];
  }> {
    const prompt = `Analyze code quality for: ${filename}

Content:
\`\`\`
${content}
\`\`\`

Provide:
1. Quality rating (excellent/good/fair/poor)
2. Issues found
3. Improvement suggestions

Format as JSON:
{
  "quality": "good",
  "issues": ["list of issues"],
  "suggestions": ["list of suggestions"]
}`;

    try {
      const response = await this.api.callSingle(AGENT_PROMPTS.TESTER, prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('[TesterAgent] Validate code quality error:', error);
    }

    return {
      quality: 'fair',
      issues: [],
      suggestions: [],
    };
  }
}
