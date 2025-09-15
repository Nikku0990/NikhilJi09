export function renderMarkdown(text: string): string {
  if (!text) return '';
  
  // Escape HTML first
  let html = escapeHtml(text);
  
  // Code blocks (triple backticks)
  html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-black/30 p-3 rounded-lg overflow-x-auto"><code>$1</code></pre>');
  
  // Inline code (single backticks)
  html = html.replace(/`([^`]+)`/g, '<code class="bg-white/10 px-1 py-0.5 rounded text-sm">$1</code>');
  
  // Bold text
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold">$1</strong>');
  
  // Italic text
  html = html.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');
  
  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2 text-white">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-4 mb-2 text-white">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-2 text-white">$1</h1>');
  
  // Lists
  html = html.replace(/\n- /g, '<br>• ');
  html = html.replace(/\n\d+\. /g, '<br>1. ');
  
  // Links
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" class="text-blue-400 hover:text-blue-300 underline">$1</a>');
  
  // Line breaks
  html = html.replace(/\n\n/g, '<br><br>');
  html = html.replace(/\n/g, '<br>');
  
  // Emojis and special formatting
  html = html.replace(/🚀/g, '<span class="text-orange-400">🚀</span>');
  html = html.replace(/⚠️/g, '<span class="text-yellow-400">⚠️</span>');
  html = html.replace(/✨/g, '<span class="text-purple-400">✨</span>');
  html = html.replace(/🧠/g, '<span class="text-blue-400">🧠</span>');
  html = html.replace(/💾/g, '<span class="text-green-400">💾</span>');
  html = html.replace(/📎/g, '<span class="text-gray-400">📎</span>');
  
  return html;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, '[code block]')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/^#+\s/gm, '')
    .replace(/\n/g, ' ')
    .trim();
}