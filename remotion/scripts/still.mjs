import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
const frames = process.argv.slice(2).map(Number);
const bundled = await bundle({ entryPoint: path.resolve("src/index.ts"), webpackOverride: (c) => c });
const browser = await openBrowser("chrome", {
  browserExecutable: "/bin/chromium",
  chromiumOptions: { args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] },
  chromeMode: "chrome-for-testing",
});
const composition = await selectComposition({ serveUrl: bundled, id: "main", puppeteerInstance: browser });
for (const f of frames) {
  await renderStill({ composition, serveUrl: bundled, frame: f, output: `/tmp/still-${f}.png`, puppeteerInstance: browser });
  console.log("ok", f);
}
await browser.close({ silent: false });
