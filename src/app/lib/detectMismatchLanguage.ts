export function detectLanguageMismatch(code: string, language: string): boolean {
  const patterns: Record<string, RegExp> = {
    javascript: /\b(function|let|const|=>)\b/,
    python: /\b(def|import|print|elif)\b/,
    cpp: /\b(#include|std::|int\s+main|cout)\b/,
    java: /\b(public\s+class|System\.out\.println|static\s+void\s+main)\b/,
  };

  const pattern = patterns[language.toLowerCase()];
  if (!pattern) return false;

  return !pattern.test(code);
}
