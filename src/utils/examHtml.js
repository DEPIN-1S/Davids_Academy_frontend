/** Strip editor fonts and dark default ink so the exam theme can apply.
 *  Keep highlight backgrounds and author emphasis colors (green, red, etc.). */

const DARK_INK_HEX = new Set([
  "000",
  "000000",
  "111",
  "111111",
  "1a1a1a",
  "111827",
  "0f172a",
  "1f2937",
  "222",
  "222222",
  "333",
  "333333",
  "444",
  "444444",
  "2e3760",
  "2f3b6c",
  "374151",
  "4b5563",
  "212121",
  "424242",
]);

function normalizeColorToken(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
}

function isDarkEditorInk(value) {
  const token = normalizeColorToken(value);
  if (!token) return false;
  if (token === "black" || token === "navy") return true;

  const hex = token.startsWith("#") ? token.slice(1) : "";
  if (hex && DARK_INK_HEX.has(hex)) return true;

  if (/^rgb\(\s*0\s*,\s*0\s*,\s*0\s*\)$/.test(token)) return true;
  if (/^rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*1(?:\.0+)?\s*\)$/.test(token)) return true;

  return false;
}

export function sanitizeExamHtml(html) {
  if (html == null) return "";
  return String(html)
    .replace(/font-family\s*:\s*[^;"']+;?/gi, "")
    .replace(/\sface\s*=\s*(['"])[\s\S]*?\1/gi, "")
    .replace(/(?<![-a-zA-Z])color\s*:\s*([^;"']+)/gi, (match, value) =>
      isDarkEditorInk(value) ? "color: inherit" : match
    )
    .replace(/\scolor\s*=\s*(['"])([\s\S]*?)\1/gi, (match, _quote, value) =>
      isDarkEditorInk(value) ? "" : match
    )
    .replace(/\scolor\s*=\s*([^\s>'"]+)/gi, (match, value) =>
      isDarkEditorInk(value) ? "" : match
    );
}
