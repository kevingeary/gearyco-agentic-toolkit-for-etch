#!/usr/bin/env node
// node shared-helpers/run.mjs <project> [task.js …] [-e "code"] [-t tab] [--timeout ms] [--no-kit] [--check]
//
// Joins the shared kit, the project's prelude (helpers.js by default) and the task files into one
// script, checks its syntax locally, runs it with `etch-connector eval`, and prints the decoded result.

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync, writeFileSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const KIT = ['blocks.js', 'upsert.js', 'audit.js'].map((f) => join(HERE, 'etch', f));

const usage = () => {
  console.error('usage: run.mjs <project> [task.js …] [-e "code"] [-t tab] [--timeout ms] [--no-kit] [--check]');
  process.exit(2);
};

const args = process.argv.slice(2);
const opts = { files: [], inline: [], timeout: 120000, kit: undefined, check: false, tab: undefined };
let project;
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '-e') opts.inline.push(args[++i]);
  else if (a === '-t' || a === '--tab') opts.tab = args[++i];
  else if (a === '--timeout') opts.timeout = Number(args[++i]);
  else if (a === '--no-kit') opts.kit = false;
  else if (a === '--kit') opts.kit = true;
  else if (a === '--check') opts.check = true;
  else if (a === '-h' || a === '--help') usage();
  else if (project === undefined) project = a;
  else opts.files.push(a);
}
if (!project) usage();

const isDir = (p) => existsSync(p) && statSync(p).isDirectory();
const projectDir = [project, join(ROOT, 'projects', project)].map((p) => resolve(p)).find(isDir);
if (!projectDir) {
  console.error(`No project folder "${project}" (looked in ./ and projects/)`);
  process.exit(2);
}
const etchDir = isDir(join(projectDir, 'etch')) ? join(projectDir, 'etch') : projectDir;

const configPath = join(etchDir, 'etch.json');
const config = existsSync(configPath) ? JSON.parse(readFileSync(configPath, 'utf8')) : {};
const tab = opts.tab ?? config.tab;
const useKit = opts.kit ?? config.kit ?? existsSync(configPath);
const prelude = config.prelude ?? (existsSync(join(etchDir, 'helpers.js')) ? ['helpers.js'] : []);

const locate = (f) => {
  for (const p of [isAbsolute(f) ? f : join(etchDir, f), resolve(f)]) if (existsSync(p)) return p;
  console.error(`File not found: ${f} (looked in ${etchDir} and ./)`);
  process.exit(2);
};

const parts = [
  ...(useKit ? KIT : []),
  ...prelude.map(locate),
  ...opts.files.map(locate),
].map((p) => ({ label: p.startsWith(ROOT) ? p.slice(ROOT.length + 1) : p, code: readFileSync(p, 'utf8') }));
opts.inline.forEach((code, i) => parts.push({ label: `-e #${i + 1}`, code }));
if (!opts.files.length && !opts.inline.length) usage();

const code = parts.map((p) => `// ── ${p.label}\n${p.code}`).join('\n');

try {
  const AsyncFunction = (async () => {}).constructor;
  new AsyncFunction(code);
} catch (err) {
  console.error(`Syntax error before sending (${err.message}). Files: ${parts.map((p) => p.label).join(', ')}`);
  process.exit(1);
}
if (opts.check) {
  console.log(`ok: ${parts.map((p) => p.label).join(' + ')}`);
  process.exit(0);
}
if (!tab) {
  console.error(`No tab: pass -t "<tab name>" or add { "tab": "…" } to ${configPath}`);
  process.exit(2);
}

const scriptPath = join(tmpdir(), `etch-run-${basename(projectDir)}-${process.pid}.js`);
writeFileSync(scriptPath, code);
process.on('exit', () => rmSync(scriptPath, { force: true }));

const run = spawnSync('npx', ['@digital-gravy/etch-connector', 'eval', '-t', tab, '-f', scriptPath, '--timeout', String(opts.timeout)], {
  encoding: 'utf8',
  maxBuffer: 64 * 1024 * 1024,
});

const lines = `${run.stdout ?? ''}`.split('\n').filter((l) => l.trim() && !l.startsWith('[etch-studio]'));
let result = lines.join('\n');
for (let i = 0; i < 2; i++) {
  try {
    const parsed = JSON.parse(result);
    result = parsed;
    if (typeof parsed !== 'string') break;
  } catch {
    break;
  }
}
if (result !== '') console.log(typeof result === 'string' ? result : JSON.stringify(result, null, 1));
const err = `${run.stderr ?? ''}`.split('\n').filter((l) => l.trim() && !l.startsWith('[etch-studio]')).join('\n');
if (err) console.error(err);
process.exit(run.status ?? 1);
