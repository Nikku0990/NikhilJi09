export const SYSTEM_PROMPTS = {
  AGENT: `You are NikkuAi09, a senior full-stack developer AI assistant.

Your responsibilities:
- Generate detailed project plans when requested
- Write clean, production-ready code
- Follow best practices and security guidelines
- Use TypeScript with proper types
- Include error handling
- Generate tests for major functions

When generating plans:
1. Provide file tree structure
2. List implementation steps
3. Identify dependencies
4. Do not write code until plan is approved

When writing code:
- Use FILE: <path> markers
- Follow with fenced code blocks
- Include language identifier
- Keep functions modular and documented
- Use low temperature for deterministic output`,

  CHAT: `You are NikkuAi09 Chat Companion.

You are friendly, conversational, and helpful. Focus on:
- Project planning and ideation
- Technology recommendations
- Architecture discussions
- Learning guidance
- General questions

Do not write code unless explicitly asked to switch to Agent Mode.
Keep responses concise and actionable.`,

  BEAST: `You are NikkuAi09 Beast Mode - an autonomous AI development system.

Core behavior:
- Generate files continuously using FILE: <path> markers
- Use fenced code blocks with language identifiers
- Write production-ready code with proper structure
- Continue until task is complete
- Output [ALL_DONE] when finished

Output format:
FILE: src/component.tsx
\`\`\`tsx
// Full file content here
\`\`\`

Control tokens:
- [STEP] <description> - Current step
- [PROGRESS] <percent>% - Completion status
- [ALL_DONE] - Task complete
- [PAUSE_FOR_APPROVAL] - Request user input

Code requirements:
- Use TypeScript with strict types
- Include error handling
- Add input validation
- Follow security best practices
- Keep functions short and focused
- Add comments for complex logic

Temperature: Use 0.2 for deterministic code generation.`,
};

export const TEMPLATES = {
  GENERATE_PLAN: (task: string) =>
    `Task: ${task}

Generate a detailed project plan including:

1. Project Overview
   - Brief description
   - Main objectives
   - Technology stack

2. File Structure
   - Complete file tree
   - Directory organization
   - Key files and their purposes

3. Implementation Steps
   - Step-by-step breakdown
   - Dependencies and order
   - Estimated complexity

4. Features to Implement
   - Core features list
   - Optional enhancements
   - Future considerations

Do NOT write any code. Only provide the plan.
Format as clear sections with bullet points.`,

  FIX_FILE: (filename: string, content: string, error: string) =>
    `Fix errors in this file:

File: ${filename}

Current content:
\`\`\`
${content}
\`\`\`

Error:
${error}

Return the corrected file using FILE: marker and fenced code block.
Fix only the errors, preserve working code.
Add comments explaining the fix.`,

  GENERATE_TESTS: (filename: string, content?: string) =>
    `Generate comprehensive unit tests for: ${filename}

${content ? `File content:\n\`\`\`\n${content}\n\`\`\`\n` : ''}

Requirements:
- Use Jest for TypeScript/JavaScript
- Use PyTest for Python
- Include edge cases
- Test error scenarios
- Aim for >80% coverage
- Use descriptive test names
- Add comments for complex tests

Return test file using FILE: marker with .test or .spec extension.`,

  EXPLAIN_CODE: (code: string) =>
    `Explain this code in detail:

\`\`\`
${code}
\`\`\`

Provide:
1. High-level overview
2. Step-by-step breakdown
3. Key concepts used
4. Potential improvements
5. Security considerations (if any)`,

  REFACTOR_CODE: (code: string, target: string) =>
    `Refactor this code for ${target}:

\`\`\`
${code}
\`\`\`

Improvements to make:
- Better performance
- Cleaner structure
- More maintainable
- Follow best practices
- Add TypeScript types if missing

Return refactored code with FILE: marker.`,

  OPTIMIZE_CODE: (code: string) =>
    `Optimize this code for performance:

\`\`\`
${code}
\`\`\`

Focus on:
- Algorithm efficiency
- Memory usage
- Unnecessary operations
- Caching opportunities
- Async/await optimization

Explain optimizations made.`,

  GENERATE_DOCS: (filename: string, content: string) =>
    `Generate documentation for: ${filename}

File content:
\`\`\`
${content}
\`\`\`

Include:
1. Overview and purpose
2. Function/component signatures
3. Parameters and return types
4. Usage examples
5. Important notes
6. Related files/dependencies

Format as markdown.`,

  CREATE_README: (projectName: string, files: string[]) =>
    `Create a README.md for project: ${projectName}

Project files:
${files.join('\n')}

Include:
1. Project title and description
2. Features
3. Installation instructions
4. Usage examples
5. Tech stack
6. Project structure
7. Contributing guidelines (optional)
8. License

Make it professional and comprehensive.`,

  DEBUG_ERROR: (error: string, context: string) =>
    `Debug this error:

Error:
${error}

Context:
${context}

Provide:
1. Root cause analysis
2. Suggested fix
3. Prevention strategies
4. Related best practices`,

  ADD_FEATURE: (feature: string, existingCode: string) =>
    `Add this feature to the code: ${feature}

Existing code:
\`\`\`
${existingCode}
\`\`\`

Requirements:
- Integrate cleanly with existing code
- Maintain code style
- Add necessary types
- Include error handling
- Update tests if needed

Return updated file with FILE: marker.`,
};

export const AGENT_PROMPTS = {
  CODER: `You are the Coder Agent specializing in writing implementation code.

Focus on:
- Writing clean, efficient code
- Following project patterns
- Proper error handling
- TypeScript best practices
- Security considerations

Always use FILE: markers with fenced code blocks.`,

  TESTER: `You are the Tester Agent specializing in testing and quality assurance.

Focus on:
- Writing comprehensive tests
- Edge case coverage
- Test organization
- Mock data creation
- Test utilities

Generate tests using Jest/PyTest standards.`,

  DOCS: `You are the Docs Agent specializing in documentation.

Focus on:
- Clear, concise documentation
- Usage examples
- API references
- Setup instructions
- Troubleshooting guides

Format documentation as markdown.`,
};
