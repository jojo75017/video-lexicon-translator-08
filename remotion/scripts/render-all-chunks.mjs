import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTDIR = process.env.OUTDIR ?? "/tmp/voice/chunks";
const CHUNK = Number(process.env.CHUNK ?? 400);
fs.mkdirSync(OUTDIR, { recursive: true });

const bundled = await bundle({
  entryPoint: path.resolve(__dirname, "../src/index.ts"),
  webpackOverride: (c) => c,
});
const browser = await openBrowser("chrome", {
  browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? "/bin/chromium",
  chromiumOptions: { args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] },
  chromeMode: "chrome-for-testing",
});
const composition = await selectComposition({
  serveUrl: bundled,
  id: process.env.COMP ?? "main",
  puppeteerInstance: browser,
});
const total = composition.durationInFrames;
console.log(`total frames ${total}`);

for (let from = 0; from < total; from += CHUNK) {
  const to = Math.min(total - 1, from + CHUNK - 1);
  const out = path.join(OUTDIR, `chunk-${String(from).padStart(6, "0")}.mp4`);
  if (fs.existsSync(out) && fs.statSync(out).size > 5000) {
    console.log(`skip ${out}`);
    continue;
  }
  const t0 = Date.now();
  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: "h264",
    crf: 20,
    x264Preset: "veryfast",
    frameRange: [from, to],
    outputLocation: out,
    puppeteerInstance: browser,
    muted: true,
    concurrency: Number(process.env.CONC ?? 8),
    timeoutInMilliseconds: 120000,
  });
  console.log(`${new Date().toISOString()} chunk ${from}-${to} done in ${Math.round((Date.now() - t0) / 1000)}s`);
}

await browser.close({ silent: false });
console.log("all chunks done");
