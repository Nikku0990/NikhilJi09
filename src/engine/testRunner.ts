import type { TestResult } from './agents/testerAgent';

export interface TestFile {
  name: string;
  content: string;
}

export class TestRunner {
  private apiEndpoint = '/api/run-tests';

  async runTests(files: TestFile[]): Promise<TestResult> {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ files }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return this.createErrorResult(errorText);
      }

      const result = await response.json();
      return this.normalizeResult(result);
    } catch (error: any) {
      console.error('[TestRunner] Error:', error);
      return this.createErrorResult(error.message);
    }
  }

  async runInBrowser(files: TestFile[]): Promise<TestResult> {
    try {
      const testFiles = files.filter((f) => f.name.includes('test') || f.name.includes('spec'));

      if (testFiles.length === 0) {
        return {
          ok: true,
          logs: 'No test files found',
          passed: 0,
          failed: 0,
          errors: [],
        };
      }

      const passed: string[] = [];
      const failed: string[] = [];
      const errors: string[] = [];

      for (const file of testFiles) {
        try {
          const result = await this.executeTestFile(file);
          if (result.success) {
            passed.push(file.name);
          } else {
            failed.push(file.name);
            errors.push(result.error || 'Unknown error');
          }
        } catch (error: any) {
          failed.push(file.name);
          errors.push(error.message);
        }
      }

      return {
        ok: failed.length === 0,
        logs: this.formatLogs(passed, failed, errors),
        passed: passed.length,
        failed: failed.length,
        errors,
      };
    } catch (error: any) {
      return this.createErrorResult(error.message);
    }
  }

  private async executeTestFile(file: TestFile): Promise<{ success: boolean; error?: string }> {
    try {
      const codeToRun = this.prepareTestCode(file.content);

      const testFunction = new Function('expect', 'describe', 'it', 'test', codeToRun);

      const expect = this.createExpectFunction();
      const describe = this.createDescribeFunction();
      const it = this.createItFunction();
      const test = it;

      testFunction(expect, describe, it, test);

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  private prepareTestCode(content: string): string {
    let code = content;

    code = code.replace(/import\s+.*?from\s+['"].*?['"];?\s*/g, '');
    code = code.replace(/export\s+(default\s+)?/g, '');

    return code;
  }

  private createExpectFunction() {
    return (actual: any) => ({
      toBe: (expected: any) => {
        if (actual !== expected) {
          throw new Error(`Expected ${actual} to be ${expected}`);
        }
      },
      toEqual: (expected: any) => {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
          throw new Error(`Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`);
        }
      },
      toBeTruthy: () => {
        if (!actual) {
          throw new Error(`Expected ${actual} to be truthy`);
        }
      },
      toBeFalsy: () => {
        if (actual) {
          throw new Error(`Expected ${actual} to be falsy`);
        }
      },
      toContain: (item: any) => {
        if (!actual.includes(item)) {
          throw new Error(`Expected ${actual} to contain ${item}`);
        }
      },
      toThrow: () => {
        try {
          actual();
          throw new Error('Expected function to throw');
        } catch (e) {
          // Expected
        }
      },
    });
  }

  private createDescribeFunction() {
    return (description: string, fn: () => void) => {
      try {
        fn();
      } catch (error: any) {
        throw new Error(`${description}: ${error.message}`);
      }
    };
  }

  private createItFunction() {
    return (description: string, fn: () => void | Promise<void>) => {
      return fn();
    };
  }

  private formatLogs(passed: string[], failed: string[], errors: string[]): string {
    let logs = '';

    if (passed.length > 0) {
      logs += `✅ Passed (${passed.length}):\n`;
      logs += passed.map((name) => `  • ${name}`).join('\n');
      logs += '\n\n';
    }

    if (failed.length > 0) {
      logs += `❌ Failed (${failed.length}):\n`;
      failed.forEach((name, idx) => {
        logs += `  • ${name}\n`;
        if (errors[idx]) {
          logs += `    Error: ${errors[idx]}\n`;
        }
      });
    }

    return logs;
  }

  private createErrorResult(error: string): TestResult {
    return {
      ok: false,
      logs: `Test runner error: ${error}`,
      passed: 0,
      failed: 1,
      errors: [error],
    };
  }

  private normalizeResult(result: any): TestResult {
    return {
      ok: result.ok ?? result.success ?? false,
      logs: result.logs ?? result.output ?? result.message ?? '',
      passed: result.passed ?? result.passedTests ?? 0,
      failed: result.failed ?? result.failedTests ?? 0,
      errors: result.errors ?? result.failures ?? [],
    };
  }

  setApiEndpoint(endpoint: string) {
    this.apiEndpoint = endpoint;
  }
}

export const testRunner = new TestRunner();
