'use strict';

const assert = require('node:assert/strict');
const { webcrypto } = require('node:crypto');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { runInNewContext } = require('node:vm');
const { test } = require('node:test');

const script = readFileSync(join(__dirname, '../js/google-account.js'), 'utf8');
const clientId = '802877175082-pp3j6fp9c00b56o5e8glpfgons2h02bq.apps.googleusercontent.com';
const pair = webcrypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048,
  publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify']);
const encode = data => Buffer.from(typeof data === 'string' ? data : JSON.stringify(data)).toString('base64url');

function storage(seed = {}) {
  const values = new Map(Object.entries(seed));
  return {
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, String(value)); },
    removeItem(key) { values.delete(key); }
  };
}

function setup(options = {}) {
  const ids = new Map();
  function element() {
    return { dataset: {}, hidden: false, children: [], handlers: {}, clientWidth: 260,
      addEventListener(name, fn) { this.handlers[name] = fn; }, setAttribute(name, value) { this[name] = value; },
      replaceChildren() { this.children = []; }, remove() { this.removed = true; } };
  }
  for (const id of ['googleAccountBox', 'googleAccount', 'googlePrepareBtn', 'googleSignInButton', 'googleSignOutBtn', 'googleAccountStatus']) ids.set(id, element());
  const localStorage = options.localStorage || storage({ mikat: '{"tasks":[{"name":"Kişisel görev"}]}' });
  const sessionStorage = options.sessionStorage || storage();
  const events = {};
  const requests = [];
  const scripts = [];
  const identity = { settings: null, renders: 0, disabled: 0,
    initialize(settings) { this.settings = settings; },
    renderButton() { this.renders++; }, disableAutoSelect() { this.disabled++; }
  };
  const window = {
    location: { protocol: options.protocol || 'https:' },
    google: options.unloaded ? undefined : { accounts: { id: identity, oauth2: {} } },
    openSettings() {}, addEventListener(name, fn) { events[name] = fn; },
    dispatchEvent(event) { events[event.type]?.(event); }
  };
  const navigator = { onLine: options.online ?? true };
  runInNewContext(script, {
    window, navigator, localStorage, sessionStorage, crypto: webcrypto, AbortSignal,
    TextEncoder, TextDecoder, Uint8Array, atob, Date,
    CustomEvent: class { constructor(type, args) { this.type = type; this.detail = args?.detail; } },
    setTimeout() { return 1; }, clearTimeout() {},
    document: { getElementById(id) { return ids.get(id); }, createElement: element,
      head: { appendChild(child) { scripts.push(child); } }, addEventListener() {} },
    async fetch(url, settings) {
      requests.push({ url, settings });
      assert.equal(url, 'https://www.googleapis.com/oauth2/v3/certs');
      assert.equal(settings.credentials, 'omit');
      if (options.fetchKeys) return options.fetchKeys();
      const jwk = await webcrypto.subtle.exportKey('jwk', (await pair).publicKey);
      return new Response(JSON.stringify({ keys: [{ ...jwk, kid: 'test-key', alg: 'RS256' }] }), {
        headers: { 'cache-control': 'public,max-age=3600' }
      });
    }
  });
  return { window, navigator, localStorage, sessionStorage, ids, requests, scripts, identity,
    async login(overrides = {}, header = {}) {
      if (!identity.settings) await window.mikatGoogle.open();
      const now = Math.floor(Date.now() / 1000);
      const payload = { sub: 'google-subject', email: 'hesap@example.test', email_verified: true,
        iss: 'https://accounts.google.com', aud: window.mikatGoogle.clientId(),
        iat: now, exp: now + 3600, nonce: identity.settings.nonce, ...overrides };
      const unsigned = encode({ alg: 'RS256', kid: 'test-key', ...header }) + '.' + encode(payload);
      const signature = await webcrypto.subtle.sign('RSASSA-PKCS1-v1_5', (await pair).privateKey, Buffer.from(unsigned));
      return identity.settings.callback({ credential: unsigned + '.' + Buffer.from(signature).toString('base64url') });
    }
  };
}

test('normal kullanıcıda hazır istemci kullanılır; açılış Google isteği veya Drive erişimi başlatmaz', () => {
  const app = setup({ unloaded: true });
  assert.equal(app.window.mikatGoogle.clientId(), clientId);
  assert.equal(app.window.mikatGoogle.account(), null);
  assert.equal(app.scripts.length, 0);
  assert.equal(app.requests.length, 0);
  assert.equal(app.localStorage.getItem('mikat'), '{"tasks":[{"name":"Kişisel görev"}]}');
});

test('kullanıcı eylemi Google betiğini tek kez yükler; resmi Türkçe giriş düğmesini hazırlar', async () => {
  const app = setup({ unloaded: true });
  const first = app.window.mikatGoogle.open();
  const second = app.window.mikatGoogle.open();
  assert.equal(app.scripts.length, 1);
  assert.equal(app.scripts[0].src, 'https://accounts.google.com/gsi/client?hl=tr');
  app.window.google = { accounts: { id: app.identity, oauth2: {} } };
  app.scripts[0].onload();
  await Promise.all([first, second]);
  assert.equal(app.identity.renders, 1);
  assert.equal(app.identity.settings.auto_select, false);
  assert.equal(app.identity.settings.client_id, clientId);
  assert.ok(app.identity.settings.nonce);
  assert.equal(app.requests.length, 0);
});

test('Google betiği yüklenemezse yerel veriler korunur ve yeniden denenebilir', async () => {
  const app = setup({ unloaded: true });
  const first = app.window.mikatGoogle.open();
  app.scripts[0].onerror();
  await first;
  assert.match(app.ids.get('googleAccountStatus').textContent, /yüklenemedi/);
  assert.equal(app.ids.get('googlePrepareBtn').hidden, false);
  const second = app.window.mikatGoogle.open();
  assert.equal(app.scripts.length, 2);
  app.window.google = { accounts: { id: app.identity, oauth2: {} } };
  app.scripts[1].onload();
  await second;
  assert.equal(app.identity.renders, 1);
});

test('imzalı Google yanıtı hesap görünümünü açar; kimlik belirteci ve görevler gönderilmez', async () => {
  const app = setup();
  await app.login();
  assert.equal(app.window.mikatGoogle.account().sub, 'google-subject');
  assert.equal(app.window.mikatGoogle.account().email, 'hesap@example.test');
  assert.equal(app.localStorage.getItem('mikat_google_account'), null);
  assert.equal(app.localStorage.getItem('mikat_drive_account'), null);
  assert.equal(app.sessionStorage.getItem('mikat_drive_token'), null);
  assert.equal(app.requests.length, 1);
  assert.equal(app.ids.get('googleSignOutBtn').hidden, false);
  assert.match(app.ids.get('googleAccountStatus').textContent, /ayrıca açabilirsiniz/);
  const restored = setup({ localStorage: app.localStorage, sessionStorage: app.sessionStorage, unloaded: true });
  assert.equal(restored.window.mikatGoogle.account().sub, 'google-subject');
  assert.equal(restored.scripts.length, 0);
  assert.equal(restored.requests.length, 0);
});

for (const [name, claims, header] of [
  ['başka istemciye ait', { aud: 'other.apps.googleusercontent.com' }],
  ['başka girişe ait nonce taşıyan', { nonce: 'wrong-nonce' }],
  ['süresi dolmuş', { exp: Math.floor(Date.now() / 1000) - 10 }],
  ['sahte yayıncıya ait', { iss: 'https://example.test' }],
  ['doğrulanmamış e-postalı', { email_verified: false }],
  ['desteklenmeyen algoritmalı', {}, { alg: 'none' }]
]) test(name + ' kimlik belirteci reddedilir', async () => {
  const app = setup();
  await app.login(claims, header);
  assert.equal(app.window.mikatGoogle.account(), null);
  assert.equal(app.sessionStorage.getItem('mikat_google_account'), null);
  assert.match(app.ids.get('googleAccountStatus').textContent, /doğrulanamadı/);
});

test('imzası değiştirilmiş yanıt geçerli hesap açmaz', async () => {
  const app = setup();
  await app.window.mikatGoogle.open();
  const original = app.identity.settings.callback;
  app.identity.settings.callback = response => {
    const parts = response.credential.split('.');
    const value = Buffer.from(parts[2], 'base64url');
    value[0] ^= 255;
    return original({ credential: parts[0] + '.' + parts[1] + '.' + value.toString('base64url') });
  };
  await app.login();
  assert.equal(app.window.mikatGoogle.account(), null);
  assert.match(app.ids.get('googleAccountStatus').textContent, /imzası doğrulanamadı/);
});

test('çıkış sırasında devam eden doğrulama hesabı yeniden açamaz', async () => {
  let release;
  const waiting = new Promise(resolve => { release = resolve; });
  const app = setup({ fetchKeys: () => waiting });
  const entering = app.login();
  while (!app.requests.length) await new Promise(setImmediate);
  app.window.mikatGoogle.signOut();
  const jwk = await webcrypto.subtle.exportKey('jwk', (await pair).publicKey);
  release(new Response(JSON.stringify({ keys: [{ ...jwk, kid: 'test-key', alg: 'RS256' }] })));
  await entering;
  assert.equal(app.window.mikatGoogle.account(), null);
  assert.equal(app.sessionStorage.getItem('mikat_google_account'), null);
});

test('çıkış yerel görevleri ve indirilen yedek bilgilerini silmez', async () => {
  const app = setup();
  await app.login();
  const original = app.localStorage.getItem('mikat');
  app.window.mikatGoogle.signOut();
  assert.equal(app.window.mikatGoogle.account(), null);
  assert.equal(app.localStorage.getItem('mikat'), original);
  assert.equal(app.identity.disabled, 1);
  assert.match(app.ids.get('googleAccountStatus').textContent, /silinmedi/);
});

test('çevrimdışı ve file adresinde Google yüklenmez', async () => {
  for (const options of [{ online: false }, { protocol: 'file:' }]) {
    const app = setup({ ...options, unloaded: true });
    await app.window.mikatGoogle.open();
    assert.equal(app.scripts.length, 0);
    assert.equal(app.requests.length, 0);
  }
});

test('önceden kullanılan kişisel istemci korunur; değiştirilince hesap görünümü kapanır', async () => {
  const app = setup({ localStorage: storage({ mikat_drive_client_id: 'personal.apps.googleusercontent.com' }) });
  assert.equal(app.window.mikatGoogle.clientId(), 'personal.apps.googleusercontent.com');
  await app.login();
  app.localStorage.setItem('mikat_drive_client_id', 'new.apps.googleusercontent.com');
  assert.equal(app.window.mikatGoogle.account(), null);
});
