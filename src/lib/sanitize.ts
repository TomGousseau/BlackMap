// Escape markdown special characters to prevent rendering glitches
// Makes text display literally like plain text in a .md file

export function escapeMarkdown(text: string): string {
  if (!text) return '';
  
  // Escape common markdown special characters
  return text
    .replace(/\\/g, '\\\\')  // Backslash first
    .replace(/\*/g, '\\*')   // Asterisks (bold/italic)
    .replace(/_/g, '\\_')    // Underscores (italic)
    .replace(/`/g, '\\`')    // Backticks (code)
    .replace(/~/g, '\\~')    // Tildes (strikethrough)
    .replace(/\[/g, '\\[')   // Square brackets (links)
    .replace(/\]/g, '\\]')
    .replace(/\(/g, '\\(')   // Parentheses (links)
    .replace(/\)/g, '\\)')
    .replace(/#/g, '\\#')    // Hash (headers)
    .replace(/\+/g, '\\+')   // Plus (lists)
    .replace(/-/g, '\\-')    // Minus (lists/hr)
    .replace(/\./g, '\\.')   // Dots (ordered lists)
    .replace(/!/g, '\\!')    // Exclamation (images)
    .replace(/>/g, '\\>')    // Greater than (blockquote)
    .replace(/\|/g, '\\|');  // Pipe (tables)
}

// Escape HTML special characters to prevent XSS when inserting into HTML contexts
export function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// For display: just show the text as-is, preventing any interpretation
// This is simpler - just return plain text without HTML/markdown interpretation
export function sanitizeForDisplay(text: string): string {
  if (!text) return '';
  return text;
}

// Truncate text to max length with ellipsis
export function truncateText(text: string, maxLength: number = 200): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}
