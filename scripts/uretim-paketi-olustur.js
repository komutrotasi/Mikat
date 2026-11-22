'use strict';

const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } = require('node:fs');
const { dirname, join, resolve } = require('node:path');
const { Script, runInNewContext } = require('node:vm');

const root = resolve(__dirname, '..');
const output = join(root, 'dist');
const site = join(output, 'site');
const manifestPath = join(output, 'manifest.json');
const commit = process.env.GITHUB_SHA || null;
assert.ok(commit === null || /^[a-f0-9]{40}$/.test(commit), 'Geçersiz kaynak commit.');
const files = [
  'index.html', 'admin.html', 'app.js', 'styles.css', 'service-worker.js',
  'manifest.json', 'favicon.ico', 'mikat-logo.png', 'data.json',
  'css/admin.css', 'js/admin.js', 'js/drive-sync.js', 'js/google-account.js', 'assets/mascot.png',
  'icons/apple-touch-icon.png', 'icons/icon-192.png', 'icons/icon-512.png',
  'data/ayetler.json', 'data/hadisler.json', 'data/dualar.json',
  'data/esmalar.json', 'data/namaz_ayetleri.json', 'data/zikirler.json'
];

function hash(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function headers() {
  const html = readFileSync(join(root, 'index.html'), 'utf8');
  const policy = html.match(/http-equiv="Content-Security-Policy"\s+content="([^"]+)"/);
  assert.ok(policy, 'Ana sayfanın içerik politikası bulunamadı.');
  return [
    '/*',
    '  Content-Security-Policy: ' + policy[1] + " frame-ancestors 'self';",
    '  Cross-Origin-Opener-Policy: same-origin-allow-popups',
    '  X-Content-Type-Options: nosniff',
    '  X-Frame-Options: SAMEORIGIN',
    '  Referrer-Policy: strict-origin-when-cross-origin',
    '/service-worker.js',
    '  Cache-Control: no-cache',
    ''
  ].join('\n');
}

function listFiles(directory, prefix = '') {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const name = prefix + entry.name;
    assert.ok(!entry.isSymbolicLink(), 'Yayın paketinde sembolik bağlantı var: ' + name);
    return entry.isDirectory() ? listFiles(join(directory, entry.name), name + '/') : [name];
  }).sort();
}

function verify() {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const expected = [...files, '_headers'].sort();
  assert.deepEqual(listFiles(site), expected, 'Yayın dosyaları izin listesiyle uyuşmuyor.');
  assert.deepEqual(Object.keys(manifest.files).sort(), expected);
  assert.equal(manifest.commit, commit, 'Paket farklı bir commit için hazırlanmış.');
  for (const name of expected) {
    const bytes = readFileSync(join(site, name));
    assert.equal(hash(bytes), manifest.files[name], 'Dosya özeti uyuşmuyor: ' + name);
    if (name !== '_headers') assert.ok(bytes.equals(readFileSync(join(root, name))), 'Paket ve kaynak farklı: ' + name);
  }
  assert.equal(readFileSync(join(site, '_headers'), 'utf8'), headers());
  runInNewContext(readFileSync(join(site, 'service-worker.js'), 'utf8') + '\nSTATIC_ASSETS.forEach(checkAsset);', {
    self: { addEventListener() {} },
    checkAsset(name) {
      assert.ok(name === './' || files.includes(name.replace(/^\.\//, '')), 'Eksik önbellek dosyası: ' + name);
    }
  });
  for (const name of files.filter(name => name.endsWith('.json'))) JSON.parse(readFileSync(join(site, name), 'utf8'));
  for (const name of files.filter(name => name.endsWith('.js'))) new Script(readFileSync(join(site, name), 'utf8'), { filename: name });
  console.log(expected.length + ' yayın dosyası ve SHA-256 özetleri doğrulandı.');
}

if (process.argv[2] === '--dogrula') {
  verify();
} else {
  assert.equal(process.argv.length, 2, 'Kullanım: node scripts/uretim-paketi-olustur.js [--dogrula]');
  assert.ok(!existsSync(output) || !lstatSync(output).isSymbolicLink(), 'dist sembolik bağlantı olamaz.');
  rmSync(output, { recursive: true, force: true });
  mkdirSync(site, { recursive: true });
  const hashes = {};
  for (const name of files) {
    const source = join(root, name);
    assert.ok(lstatSync(source).isFile() && !lstatSync(source).isSymbolicLink(), 'Geçersiz kaynak dosya: ' + name);
    const bytes = readFileSync(source);
    mkdirSync(dirname(join(site, name)), { recursive: true });
    writeFileSync(join(site, name), bytes);
    hashes[name] = hash(bytes);
  }
  const rules = headers();
  writeFileSync(join(site, '_headers'), rules);
  hashes._headers = hash(rules);
  writeFileSync(manifestPath, JSON.stringify({ commit, files: hashes }, null, 2) + '\n');
  verify();
  console.log('Üretim paketi: dist/site');
}
