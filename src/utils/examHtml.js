/** Strip editor fonts / black ink so the student exam theme can apply. Keep highlights and emphasis colors. */
export function sanitizeExamHtml(html) {
  if (html == null) return "";
  return String(html)
    .replace(/font-family\s*:\s*[^;"']+;?/gi, "")
    .replace(/\sface\s*=\s*(['"])[\s\S]*?\1/gi, "")
    .replace(
      /color\s*:\s*(#0{3,8}|black|#1a1a1a|#111827|#222|#222222|#333|#333333|#2e3760|#2E3760|#2F3B6C|rgb\(\s*0\s*,\s*0\s*,\s*0\s*\)|rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*1(?:\.0+)?\s*\))\s*;?/gi,
      "color: inherit;"
    )
    .replace(
      /color\s*=\s*(['"])(#0{3,8}|black|#2e3760|#2E3760)\1/gi,
      'color="inherit"'
    );
}
