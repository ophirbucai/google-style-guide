const fs = require("fs");
const path = require("path");
function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const eq = token.indexOf("=");
    if (eq !== -1) {
      const key = token.slice(2, eq);
      const val = token.slice(eq + 1);
      args[key] = val;
    } else {
      const key = token.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        args[key] = next;
        i++;
      } else {
        args[key] = true;
      }
    }
  }
  return args;
}

function loadJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}
function fmtScore(n) { return n == null ? "—" : String(Math.round((n || 0) * 100)); }
function ms(v) { return v == null ? "—" : `${Math.round(v)} ms`; }
function cls(v) { return v == null ? "—" : v.toFixed(3); }
function deltaPts(a, b) {
  if (a == null || b == null) return "—";
  const d = Math.round(a*100) - Math.round(b*100);
  if (d === 0) return "±0";
  return `${d > 0 ? "▲" : "▼"} ${Math.abs(d)}`;
}
function deltaMs(a, b) {
  if (a == null || b == null) return "—";
  const d = Math.round(a - b);
  if (d === 0) return "±0 ms";
  return `${d > 0 ? "▲" : "▼"} ${Math.abs(d)} ms`;
}
function deltaCls(a, b) {
  if (a == null || b == null) return "—";
  const d = +(a - b).toFixed(3);
  if (d === 0) return "±0.000";
  return `${d > 0 ? "▲" : "▼"} ${Math.abs(d).toFixed(3)}`;
}
function get(lh, id) { return lh?.audits?.[id]?.numericValue; }
function cats(lh) {
  return {
    perf: lh?.categories?.performance?.score ?? null,
    a11y: lh?.categories?.accessibility?.score ?? null,
    bp:   lh?.categories?.["best-practices"]?.score ?? null,
    seo:  lh?.categories?.seo?.score ?? null,
  };
}
function table(rows) {
  const [head, ...rest] = rows;
  const header = `| ${head.join(" | ")} |\n| ${head.map(()=>"-").join(" | ")} |\n`;
  return header + rest.map(r => `| ${r.join(" | ")} |`).join("\n") + "\n";
}

(function main(argv){
  const args = parseArgs(argv.slice(2));
  const cur = loadJson(args.current);
  const base = loadJson(args.baseline);
  const hasBaseline = !!base;

  const outPath = args.out || "lighthouse/report.md";
  const url = cur?.finalDisplayedUrl || cur?.requestedUrl || "http://localhost:8080";

  const c = cats(cur);
  const b = hasBaseline ? cats(base) : null;

  const metricDefs = [
    ["FCP",  get(cur,"first-contentful-paint"),     hasBaseline ? get(base,"first-contentful-paint")     : null, ms,       deltaMs],
    ["LCP",  get(cur,"largest-contentful-paint"),   hasBaseline ? get(base,"largest-contentful-paint")   : null, ms,       deltaMs],
    ["TBT",  get(cur,"total-blocking-time"),        hasBaseline ? get(base,"total-blocking-time")        : null, ms,       deltaMs],
    ["Speed Index", get(cur,"speed-index"),         hasBaseline ? get(base,"speed-index")                : null, ms,       deltaMs],
    ["CLS",  get(cur,"cumulative-layout-shift"),    hasBaseline ? get(base,"cumulative-layout-shift")    : null, cls,      deltaCls],
    ["TTI",  get(cur,"interactive"),                hasBaseline ? get(base,"interactive")                : null, ms,       deltaMs],
  ];

  let md = `### Lighthouse Summary for ${url}\n\n`;

  if (hasBaseline) {
    // Category table with deltas
    md += "**Category Scores**\n\n";
    md += table([
      ["Category","Current","Main (baseline)","Δ (pts)"],
      ["Performance", fmtScore(c.perf), fmtScore(b.perf), deltaPts(c.perf,b.perf)],
      ["Accessibility", fmtScore(c.a11y), fmtScore(b.a11y), deltaPts(c.a11y,b.a11y)],
      ["Best Practices", fmtScore(c.bp), fmtScore(b.bp), deltaPts(c.bp,b.bp)],
      ["SEO", fmtScore(c.seo), fmtScore(b.seo), deltaPts(c.seo,b.seo)],
    ]);

    // Metrics with deltas
    md += "\n**Key Metrics**\n\n";
    const metricRows = metricDefs.map(([name, cv, bv, fmt, dlt]) => [
      name, fmt(cv), fmt(bv), dlt(cv, bv),
    ]);
    md += table([["Metric","Current","Main (baseline)","Δ"], ...metricRows]);
    md += "_Note: ▲ indicates a worse value (higher time / lower score), ▼ indicates better._\n";
  } else {
    // Current-only (no redundant baseline columns)
    md += "**Category Scores**\n\n";
    md += table([
      ["Category","Current"],
      ["Performance", fmtScore(c.perf)],
      ["Accessibility", fmtScore(c.a11y)],
      ["Best Practices", fmtScore(c.bp)],
      ["SEO", fmtScore(c.seo)],
    ]);

    md += "\n**Key Metrics**\n\n";
    const metricRows = metricDefs.map(([name, cv, _bv, fmt]) => [name, fmt(cv)]);
    md += table([["Metric","Current"], ...metricRows]);
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, md);
})(process.argv);


