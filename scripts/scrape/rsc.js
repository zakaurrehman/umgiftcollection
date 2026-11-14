// Decode Next.js RSC flight payload from an HTML file and print it
const fs = require("fs");
function decode(html) {
  const re = /self\.__next_f\.push\(\[1,"((?:[^"\\]|\\.)*)"\]\)/g;
  let m, out = "";
  while ((m = re.exec(html))) out += JSON.parse('"' + m[1] + '"');
  return out;
}
module.exports = { decode };
if (require.main === module) {
  const h = fs.readFileSync(process.argv[2], "utf8");
  const out = decode(h);
  if (process.argv[3]) fs.writeFileSync(process.argv[3], out);
  const needle = process.argv[4];
  if (needle) {
    let i = -1, n = 0;
    while ((i = out.indexOf(needle, i + 1)) >= 0 && n < 3) {
      console.log("@@", i, out.slice(Math.max(0, i - 1500), i + 2500));
      n++;
    }
  }
  console.log("len", out.length);
}
