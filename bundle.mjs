import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const targetArg = process.argv[2];
if (!targetArg) {
  console.error('Usage: node bundle.mjs <topic-directory>');
  process.exit(1);
}
const targetDir = path.resolve(__dirname, targetArg);

const htmlPath = path.join(targetDir, 'index.html');
const cssPath = path.join(targetDir, 'presentation.css');
const jsPath = path.join(targetDir, 'presentation.js');
const outputPath = path.join(targetDir, 'slides.html');

console.log('Reading source files...');
const html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');

// Replace external stylesheet link with inlined <style>
const cssLinkRegex = /<link\s+rel=["']stylesheet["']\s+href=["']presentation\.css["']\s*\/?>/i;
if (!cssLinkRegex.test(html)) {
  throw new Error('Could not find <link rel="stylesheet" href="presentation.css"> in index.html');
}

// Replace external script tag with inlined <script>
const jsScriptRegex = /<script\s+src=["']presentation\.js["']\s*><\/script>/i;
if (!jsScriptRegex.test(html)) {
  throw new Error('Could not find <script src="presentation.js"></script> in index.html');
}

const inlinedStyle = `<style>\n${css}\n</style>`;
const inlinedScript = `<script>\n${js}\n</script>`;

let bundled = html.replace(cssLinkRegex, () => inlinedStyle);
bundled = bundled.replace(jsScriptRegex, () => inlinedScript);

fs.writeFileSync(outputPath, bundled, 'utf8');

const stats = fs.statSync(outputPath);
const sizeKb = (stats.size / 1024).toFixed(1);

console.log(`Successfully generated self-contained ${outputPath} (${sizeKb} KB)`);
