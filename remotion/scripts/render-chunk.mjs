import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const from = Number(process.env.FROM ?? 0);
const to = Number(process.env.TO ?? 300);
const out = process.env.OUT ?? `/tmp/voice/chunk-${from}-${to}.mp4`;

const t0 = Date.now();
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

await renderMedia({
  composition,
  serveUrl: bundled,
  codec: "h264",
  crf: 21,
  x264Preset: process.env.PRESET ?? "veryfast",
  scale: Number(process.env.SCALE ?? 1),
  frameRange: [from, to],
  outputLocation: out,
  puppeteerInstance: browser,
  muted: true,
  concurrency: Number(process.env.CONC ?? 6),
  timeoutInMilliseconds: 120000,
  onProgress: ({ renderedFrames, encodedFrames }) => {
    if (renderedFrames % 100 < 2) console.log(`${from}-${to} rendered=${renderedFrames} encoded=${encodedFrames} t=${Math.round((Date.now()-t0)/1000)}s`);
  },
});
console.log("\nchunk done", out);
await browser.close({ silent: false });
