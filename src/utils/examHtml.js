/** Strip editor fonts and ink colors so the dark exam theme can apply. Keep highlight backgrounds. */
export function sanitizeExamHtml(html) {
  if (html == null) return "";
  return String(html)
    .replace(/font-family\s*:\s*[^;"']+;?/gi, "")
    .replace(/\sface\s*=\s*(['"])[\s\S]*?\1/gi, "")
    .replace(/color\s*:\s*[^;"']+;?/gi, "")
    .replace(/\scolor\s*=\s*(['"])[\s\S]*?\1/gi, "")
    .replace(/\scolor\s*=\s*[^\s>]+/gi, "");
}
