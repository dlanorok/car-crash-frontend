/**
 * Helper fake template string literal tagger to enable css syntax highlighting
 * Credit: https://dev.to/patarapolw/fake-tagged-template-string-literal-to-enable-syntax-highlighting-in-vscode-34g1
 */
export const css = (s: TemplateStringsArray, ...args: any[]): string =>
  s.map((ss, i) => `${ss}${args[i] || ''}`).join('');
