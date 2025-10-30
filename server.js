const fs = require('fs');
const path = require('path');
const express = require('express');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');
let openModulePromise = null;

function openInBrowser(url) {
  if (process.env.NO_AUTO_OPEN === '1') {
    return Promise.resolve();
  }
  if (!openModulePromise) {
    openModulePromise = import('open').then((mod) => mod.default ?? mod);
  }
  return openModulePromise.then((openFn) => openFn(url));
}


const PORT = process.env.PORT || 5173;
const app = express();

// LiveReload server watches exported web build and static web folder
const liveServer = livereload.createServer({
  exts: ['html', 'css', 'js', 'wasm', 'pck'],
  delay: 200
});
liveServer.watch([
  path.join(__dirname, 'web'),
  path.join(__dirname, 'docs'),
  path.join(__dirname, 'build', 'web')
]);

app.use(connectLivereload());

// Serve static files (docs export takes priority)
app.use('/build', express.static(path.join(__dirname, 'build')));
app.use(express.static(path.join(__dirname, 'docs')));
app.use(express.static(path.join(__dirname, 'web')));

// Fallback to docs export or placeholder html
const docsIndex = path.join(__dirname, 'docs', 'index.html');
const placeholderIndex = path.join(__dirname, 'web', 'index.html');
const tmpDir = path.join(__dirname, '.tmp');
const openSentinel = path.join(tmpDir, 'dev-opened');

app.get('*', (req, res) => {
  if (fs.existsSync(docsIndex)) {
    return res.sendFile(docsIndex);
  }
  return res.sendFile(placeholderIndex);
});

app.listen(PORT, () => {
  console.log(`[dev] Server running at http://localhost:${PORT}`);
  if (process.env.NO_AUTO_OPEN === '1') {
    return;
  }
  try {
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    if (!fs.existsSync(openSentinel)) {
      fs.writeFileSync(openSentinel, new Date().toISOString());
      openInBrowser(`http://localhost:${PORT}`).catch((err) => {
        console.warn('[dev] Unable to open browser automatically:', err.message);
      });
    }
  } catch (err) {
    console.warn('[dev] Auto-open setup failed:', err.message);
  }
});


