// Extract balanced JSON values that follow a given key in a string
function readValue(s, start) {
  const open = s[start];
  const close = open === "[" ? "]" : open === "{" ? "}" : null;
  if (!close) {
    // primitive
    const m = s.slice(start).match(/^("(?:[^"\\]|\\.)*"|-?\d+(?:\.\d+)?|true|false|null)/);
    return m ? JSON.parse(m[1]) : undefined;
  }
  let depth = 0, inStr = false;
  for (let i = start; i < s.length; i++) {
    const c = s[i];
    if (inStr) {
      if (c === "\\") i++;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') inStr = true;
    else if (c === "[" || c === "{") depth++;
    else if (c === "]" || c === "}") {
      depth--;
      if (depth === 0) return JSON.parse(s.slice(start, i + 1));
    }
  }
}
function after(s, key, from = 0) {
  const k = `"${key}":`;
  const i = s.indexOf(k, from);
  if (i < 0) return undefined;
  return readValue(s, i + k.length);
}
function all(s, key) {
  const k = `"${key}":`;
  const res = [];
  let i = -1;
  while ((i = s.indexOf(k, i + 1)) >= 0) {
    try { res.push({ at: i, value: readValue(s, i + k.length) }); } catch (e) {}
  }
  return res;
}
// Find object literal enclosing position p: scan back to the matching '{'
function enclosingObject(s, p) {
  let depth = 0, i = p;
  for (; i >= 0; i--) {
    const c = s[i];
    if (c === "}") depth++;
    else if (c === "{") { if (depth === 0) break; depth--; }
  }
  return readValue(s, i);
}
module.exports = { readValue, after, all, enclosingObject };
