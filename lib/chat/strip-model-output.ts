/** Remove MiniMax / reasoning artifacts from model output before display or parsing. */
export function stripModelArtifacts(text: string): string {
  let s = String(text ?? "");
  const blocks = [
    /<think>[\s\S]*?<\/redacted_thinking>/gi,
    /[\s\S]*?<\/think>/gi,
    /<thinking>[\s\S]*?<\/thinking>/gi,
  ];
  for (const pattern of blocks) {
    s = s.replace(pattern, "");
  }
  s = s.replace(/\*\*([^*]+)\*\*/g, "$1");
  return s.replace(/\n{3,}/g, "\n\n").trim();
}
