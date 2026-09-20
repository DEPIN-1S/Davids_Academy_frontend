/** Strip editor fonts and default ink so the exam theme can apply.
 *  Keep highlight backgrounds and author emphasis colors (green, red, yellow). */
function normalizeColorToken(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
}

function parseRgbChannels(value) {
  const token = normalizeColorToken(value);
  const hexMatch = token.match(/^#?([0-9a-f]{3,8})$/);
  if (hexMatch && !token.startsWith("rgb")) {
    let hex = hexMatch[1];
    if (hex.length === 3 || hex.length === 4) {
      hex = hex
        .slice(0, 3)
        .split("")
        .map((c) => c + c)
        .join("");
    }
    if (hex.length >= 6) {
      return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16),
      ];
    }
  }
  const rgb = token.match(/^rgba?\((.+)\)$/);
  if (rgb) {
    const parts = rgb[1].split(",").map((part) => parseFloat(part));
    if (parts.length >= 3 && parts.every((n) => Number.isFinite(n))) {
      return parts.slice(0, 3);
    }
  }
  return null;
}

function rgbToHue(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  if (d === 0) return 0;
  let hue;
  if (max === r) hue = ((g - b) / d) % 6;
  else if (max === g) hue = (b - r) / d + 2;
  else hue = (r - g) / d + 4;
  hue *= 60;
  if (hue < 0) hue += 360;
  return hue;
}

function isEmphasisColor(value) {
  const token = normalizeColorToken(value);
  if (/^(red|green|lime|yellow|orange|crimson|coral|tomato|gold|chartreuse|springgreen)$/.test(token)) {
    return true;
  }
  const rgb = parseRgbChannels(value);
  if (!rgb) return false;
  const [r, g, b] = rgb;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sat = max === 0 ? 0 : (max - min) / max;
  if (sat < 0.4) return false;
  const hue = rgbToHue(r, g, b);
  const isRed = hue <= 25 || hue >= 345;
  const isYellow = hue >= 40 && hue <= 75;
  const isGreen = hue >= 85 && hue <= 165;
  return isRed || isYellow || isGreen;
}

function shouldStripInk(value) {
  return !isEmphasisColor(value);
}

export const examHtmlSx = {
  color: "#ffffff !important",
  fontWeight: 700,
  "&, & *": {
    color: "#ffffff !important",
    WebkitTextFillColor: "#ffffff !important",
    fontWeight: 700,
  },
};

export function sanitizeExamHtml(html) {
  if (html == null) return "";
  return String(html)
    .replace(/font-family\s*:\s*[^;"']+;?/gi, "")
    .replace(/\sface\s*=\s*(['"])[\s\S]*?\1/gi, "")
    .replace(/(?<![-a-zA-Z])color\s*:\s*([^;"']+)/gi, (match, value) =>
      shouldStripInk(value) ? "color: inherit" : match
    )
    .replace(/\scolor\s*=\s*(['"])([\s\S]*?)\1/gi, (match, _quote, value) =>
      shouldStripInk(value) ? "" : match
    )
    .replace(/\scolor\s*=\s*([^\s>'"]+)/gi, (match, value) =>
      shouldStripInk(value) ? "" : match
    );
}
