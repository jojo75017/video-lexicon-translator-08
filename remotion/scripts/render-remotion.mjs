import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const bundled = await bundle({
  entryPoint: path.resolve(__dirname, "../src/index.ts"),
  webpackOverride: (config) => config,
});

const browser = await openBrowser("chrome", {
  browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? "/bin/chromium",
  chromiumOptions: {
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
  },
  chromeMode: "chrome-for-testing",
});

const composition = await selectComposition({
  serveUrl: bundled,
  id: "main",
  puppeteerInstance: browser,
});

let last = -1;
await renderMedia({
  composition,
  serveUrl: bundled,
  codec: "h264",
  crf: 20,
  outputLocation: process.env.OUT ?? "/mnt/documents/ebookstudio-v3-presentation.mp4",
  puppeteerInstance: browser,
  muted: true,
  concurrency: 6,
  onProgress: ({ progress }) => {
    const pct = Math.floor(progress * 100);
    if (pct !== last && pct % 5 === 0) {
      last = pct;
      console.log(`render ${pct}%`);
    }
  },
});

await browser.close({ silent: false });
console.log("done");
