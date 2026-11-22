'use strict';

const assert = require('node:assert/strict');
const { mkdtempSync, mkdirSync, readFileSync, writeFileSync, cpSync, rmSync, readdirSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join, resolve } = require('node:path');
const { runInThisContext, runInNewContext } = require('node:vm');

const root = resolve(__dirname, '..');
const source = readFileSync(join(root, 'scripts/uretim-paketi-olustur.js'), 'utf8');
const execute = runInThisContext('(function (require, __dirname, process, console) {\n' + source + '\n})');
const fixture = mkdtempSync(join(tmpdir(), 'mikat-yayin-test-'));
const commit = 'a'.repeat(40);

function run(option, sha = commit) {
  const argv = ['node', 'scripts/uretim-paketi-olustur.js'];
  if (option) argv.push(option);
  execute(require, join(fixture, 'scripts'), { argv, env: { GITHUB_SHA: sha } }, { log() {} });
}

try {
  for (const name of readdirSync(root)) {
    if (name.startsWith('.') || ['dist', 'node_modules', 'tests'].includes(name)) continue;
    cpSync(join(root, name), join(fixture, name), { recursive: true });
  }
  mkdirSync(join(fixture, '.wrangler'), { recursive: true });
  writeFileSync(join(fixture, '.wrangler', 'test.json'), '{"example":true}');
  writeFileSync(join(fixture, '.env'), 'EXAMPLE=test');
  run();
  run('--dogrula');
  const manifest = JSON.parse(readFileSync(join(fixture, 'dist/manifest.json'), 'utf8'));
  assert.equal(manifest.commit, commit);
  assert.equal(Object.keys(manifest.files).length, 24);
  assert.ok(manifest.files['js/drive-sync.js']);
  assert.ok(!manifest.files['.env'] && !manifest.files['.wrangler/test.json']);

  writeFileSync(join(fixture, 'dist/site/app.js'), '/* Bozulmuş paket */');
  assert.throws(() => run('--dogrula'), /Dosya özeti uyuşmuyor/);
  run();
  writeFileSync(join(fixture, 'dist/site/beklenmeyen.txt'), 'test');
  assert.throws(() => run('--dogrula'), /izin listesiyle uyuşmuyor/);
  run();
  assert.throws(() => run('--dogrula', 'b'.repeat(40)), /farklı bir commit/);
  writeFileSync(join(fixture, 'app.js'), '/* Kaynak değişti */');
  assert.throws(() => run('--dogrula'), /Paket ve kaynak farklı/);
  console.log('Yayın paketi testleri geçti. İzin listesi, kaynak değişikliği, dosya bütünlüğü ve commit doğrulandı.');
} finally {
  rmSync(fixture, { recursive: true, force: true });
}

async function checkLiveValidation() {
  const liveScript = readFileSync(join(root, 'scripts/canli-yayin-dogrula.js'), 'utf8');
  const liveRoot = mkdtempSync(join(tmpdir(), 'mikat-canli-test-'));
  mkdirSync(join(liveRoot, 'dist'));
  const { createHash } = require('node:crypto');
  const content = 'Türkçe yayın örneği';
  const digest = createHash('sha256').update(content).digest('hex');
  writeFileSync(join(liveRoot, 'dist/manifest.json'), JSON.stringify({ commit, files: { 'index.html': digest, 'admin.html': digest } }));

  async function exercise(correct) {
    const paths = new Set();
    const context = {
      require(name) {
        if (name === 'node:timers/promises') return { setTimeout: async () => {} };
        return require(name);
      },
      __dirname: join(liveRoot, 'scripts'), URL, Buffer, AbortSignal,
      process: { env: {} }, console: { log() {}, error() {} },
      async fetch(url) {
        assert.equal(url.origin, 'https://mikat.komutrotasi.com');
        assert.equal(url.searchParams.get('mikat-yayin'), commit);
        paths.add(url.pathname);
        return new Response(correct ? content : 'Eski içerik', { headers: {
          'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
          'X-Content-Type-Options': 'nosniff',
          'Content-Security-Policy': 'script-src https://accounts.google.com; connect-src https://www.googleapis.com;'
        } });
      }
    };
    await runInNewContext(liveScript, context);
    assert.equal(context.process.exitCode || 0, correct ? 0 : 1);
    assert.deepEqual([...paths].sort(), ['/', '/admin']);
  }

  try {
    await exercise(true);
    await exercise(false);
    console.log('Canlı kontrol testi geçti. Eski içerik yayın hatası olarak yakalandı.');
  } finally {
    rmSync(liveRoot, { recursive: true, force: true });
  }
}

checkLiveValidation().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
