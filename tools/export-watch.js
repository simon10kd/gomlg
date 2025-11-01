#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar');

const projectRoot = path.resolve(__dirname, '..');
const exportName = 'Web';

const candidateBins = [
  process.env.GODOT_BIN,
  process.env.GODOT4_BIN,
  path.join(projectRoot, '.godot', 'Godot.app', 'Contents', 'MacOS', 'Godot'),
  path.join(projectRoot, '.godot', 'godot-headless'),
  '/Applications/Godot.app/Contents/MacOS/Godot'
].filter(Boolean);

const godotBin = candidateBins.find((bin) => fs.existsSync(bin));

if (!godotBin) {
  console.error('[export] Unable to find Godot binary.');
  console.error('Set the GODOT_BIN environment variable to your Godot executable, e.g.');
  console.error('  export GODOT_BIN="/Applications/Godot.app/Contents/MacOS/Godot"');
  console.error('or adjust tools/export-watch.js candidate paths.');
  process.exit(1);
}

console.log(`[export] Using Godot binary at: ${godotBin}`);

// Check for export templates
const os = require('os');
const homeDir = os.homedir();
const templatePaths = [
  path.join(homeDir, 'Library', 'Application Support', 'Godot', 'export_templates', '4.2.2.stable', 'web_release.zip'),
  path.join(homeDir, 'Library', 'Application Support', 'Godot', 'export_templates', '4.2.stable', 'web_release.zip')
];
const templatesExist = templatePaths.some(tp => fs.existsSync(tp));
const exportExists = fs.existsSync(path.join(projectRoot, 'docs', 'index.html'));

if (!templatesExist && !exportExists) {
  console.warn('[export] ⚠️  Export templates not found, but no existing export detected.');
  console.warn('[export] Please install export templates in Godot (Project → Export → Install Export Templates...)');
  console.warn('[export] Or manually export once, then the watcher will skip auto-export.');
} else if (!templatesExist && exportExists) {
  console.log('[export] ℹ️  Export templates not found, but existing export files detected in docs/');
  console.log('[export] Auto-export disabled. To enable, install export templates in Godot.');
  console.log('[export] Watcher will continue monitoring but skip exports.');
}

const watchPaths = [
  path.join(projectRoot, 'project.godot'),
  path.join(projectRoot, 'scenes'),
  path.join(projectRoot, 'scripts'),
  path.join(projectRoot, 'assets')
];

const watcher = chokidar.watch(watchPaths, {
  ignoreInitial: true,
  persistent: true
});

let exporting = false;
let queueExport = false;

function runExport(reason) {
  // Check if templates exist before attempting export
  if (!templatesExist) {
    if (exportExists) {
      console.log('[export] Skipping export (templates not installed, using existing export files).');
      exporting = false;
      if (queueExport) {
        queueExport = false;
      }
      return;
    } else {
      console.error('[export] ❌ Cannot export: templates missing and no existing export found.');
      console.error('[export] Please install export templates in Godot or export manually.');
      exporting = false;
      if (queueExport) {
        queueExport = false;
      }
      return;
    }
  }

  exporting = true;
  queueExport = false;

  const tag = reason ? ` (${reason})` : '';
  console.log(`[export] Starting Web export${tag}...`);

  const args = ['--headless', '--path', projectRoot, '--export-release', exportName];
  const child = spawn(godotBin, args, {
    stdio: 'inherit',
    env: {
      ...process.env,
      GODOT_HEADLESS: '1'
    }
  });

  child.on('exit', (code) => {
    exporting = false;
    if (code === 0) {
      console.log('[export] ✅ Web export updated (docs/index.*).');
    } else {
      console.error(`[export] ❌ Export failed with code ${code}.`);
      // Don't fail completely if it's a template error and export exists
      if (code !== 0 && exportExists && !templatesExist) {
        console.log('[export] Continuing with existing export files...');
      }
    }
    if (queueExport) {
      runExport('queued change');
    }
  });
}

function scheduleExport(reason) {
  if (exporting) {
    queueExport = true;
    return;
  }
  runExport(reason);
}

watcher.on('ready', () => {
  console.log('[export] Watching Godot project files for changes...');
  scheduleExport('initial run');
});

watcher.on('all', (event, filePath) => {
  const rel = path.relative(projectRoot, filePath);
  console.log(`[export] Detected ${event} in ${rel}`);
  scheduleExport();
});

process.on('SIGINT', () => {
  watcher.close().finally(() => process.exit(0));
});


