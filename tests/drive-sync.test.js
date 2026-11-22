'use strict';

const assert = require('node:assert/strict');
const { webcrypto } = require('node:crypto');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');
const { runInNewContext } = require('node:vm');

const script = readFileSync(join(__dirname, '../js/drive-sync.js'), 'utf8');
const clientId = 'test-client.apps.googleusercontent.com';
const defaults = { tasks: [], prayers: {}, namazCity: 'Konya', theme: 'light', lat: null, lng: null };

function storage(seed = {}) {
  const values = new Map(Object.entries(seed));
  return {
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, String(value)); },
    removeItem(key) { values.delete(key); }
  };
}

function fakeDrive() {
  const files = new Map();
  const uploads = [];
  const requests = [];
  const drive = {
    files, uploads, requests, profile: { sub: 'test-account', email: 'example@example.test' },
    async fetch(url, options) {
      requests.push(url);
      const request = new URL(url);
      let data;
      if (request.pathname.endsWith('/userinfo')) {
        data = drive.profile;
      } else if (options.method === 'POST') {
        assert.equal(request.pathname, '/upload/drive/v3/files');
        const [, metadata, content] = options.body.split('\r\n\r\n');
        const props = JSON.parse(metadata.split('\r\n')[0]);
        const body = JSON.parse(content.split('\r\n')[0]);
        const id = String(files.size + 1);
        files.set(id, { ...props, id, createdTime: new Date(2026, 10, 18, 17, files.size).toISOString(), body });
        uploads.push(body.data);
        data = { id };
      } else if (request.pathname === '/drive/v3/files') {
        assert.equal(request.searchParams.get('spaces'), 'appDataFolder');
        data = { files: [...files.values()].map(({ body, ...file }) => file) };
      } else {
        const file = files.get(request.pathname.split('/').at(-1));
        if (!file) return { ok: false, status: 404 };
        data = file.body;
      }
      return { ok: true, status: 200, async json() { return structuredClone(data); } };
    }
  };

  return drive;
}

function fakeElement() {
  return {
    dataset: {}, children: [], handlers: {},
    addEventListener(name, handler) { this.handlers[name] = handler; },
    setAttribute() {},
    appendChild(child) { this.children.push(child); },
    replaceChildren() { this.children = []; }
  };
}

function device(drive, data = defaults, existing) {
  const elements = new Map();
  const getElementById = id => {
    if (!elements.has(id)) elements.set(id, fakeElement());
    return elements.get(id);
  };
  const localStorage = existing?.localStorage || storage({ mikat_drive_client_id: clientId, mikat: JSON.stringify(data) });
  const sessionStorage = existing?.sessionStorage || storage();
  const popups = [];
  const events = {};
  const clock = { time: 1000000 };
  const window = {
    mikatGoogle: existing?.googleProvider,
    location: { protocol: existing?.protocol || 'http:' },
    mikatDriveInitialState: JSON.stringify(defaults),
    mikatReloadFromStorage() {},
    renderSettings() {},
    openSettings() {},
    addEventListener(name, handler) { events[name] = handler; },
    dispatchEvent(event) { events[event.type]?.(event); },
    google: {
      accounts: {
        oauth2: {
          hasGrantedAllScopes: () => true,
          initTokenClient(settings) {
            return { requestAccessToken(options) {
              popups.push(options);
              settings.callback({ access_token: 'test-token', expires_in: 3600 });
            } };
          }
        }
      }
    }
  };
  const navigator = { onLine: true };
  runInNewContext(script, {
    window, localStorage, sessionStorage, navigator, URLSearchParams, AbortController,
    CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options?.detail; } },
    crypto: webcrypto, fetch: drive.fetch, setInterval() {}, setTimeout() {}, clearTimeout() {},
    Date: class extends Date { static now() { return clock.time; } },
    document: { getElementById, createElement: fakeElement, addEventListener() {} }
  });
  return {
    localStorage, sessionStorage, popups, events, navigator, clock,
    click(id = 'driveHeaderBtn') { return getElementById(id).handlers.click(); },
    get data() { return JSON.parse(localStorage.getItem('mikat')); },
    set data(value) { localStorage.setItem('mikat', JSON.stringify(value)); },
    get choices() { return getElementById('driveConflictChoices').children; },
    get status() { return getElementById('driveHeaderStatus').textContent; },
    get feedback() { return getElementById('driveStatus').textContent; }
  };
}

test('doğrudan HTML dosyası açıldığında Google penceresi yerine web adresi gösterilir', async () => {
  const drive = fakeDrive();
  const dev = device(drive, defaults, { protocol: 'file:' });
  await dev.click();
  assert.equal(dev.popups.length, 0);
  assert.equal(drive.uploads.length, 0);
  assert.match(dev.feedback, /http:\/\/localhost:8080\//);
});

const settle = () => new Promise(setImmediate);
const task = (id, name) => ({ id, name });

function accountProvider(signedIn = false) {
  return {
    current: signedIn ? { sub: 'test-account', email: 'example@example.test' } : null,
    opened: 0,
    clientId() { return clientId; },
    account() { return this.current; },
    open() { this.opened++; }
  };
}

test('hazır Google istemcisiyle ilk giriş yalnızca hesap ekranını açar; Drive izni istemez', async () => {
  const drive = fakeDrive();
  const googleProvider = accountProvider();
  const dev = device(drive, defaults, { localStorage: storage({ mikat: JSON.stringify(defaults) }), googleProvider });
  assert.equal(dev.status, 'Google ile giriş yap');
  await dev.click();
  assert.equal(googleProvider.opened, 1);
  assert.equal(dev.popups.length, 0);
  assert.equal(drive.requests.length, 0);
});

test('Google hesabı seçmek ve üst düğmeyi açmak eşitlemez; Drive düğmesi ayrıca izin ister', async () => {
  const drive = fakeDrive();
  const googleProvider = accountProvider(true);
  const dev = device(drive, defaults, { localStorage: storage({ mikat: JSON.stringify(defaults) }), googleProvider });
  await dev.click();
  assert.equal(drive.requests.length, 0);
  assert.equal(dev.popups.length, 0);
  await dev.click('driveSyncNowBtn');
  assert.equal(dev.popups.length, 1);
  assert.equal(dev.popups[0].hint, 'example@example.test');
  assert.equal(drive.uploads.length, 1);
});

test('Google girişinden farklı Drive hesabı seçilirse görevler yüklenmez', async () => {
  const drive = fakeDrive();
  drive.profile = { sub: 'other-account', email: 'other@example.test' };
  const googleProvider = accountProvider(true);
  const dev = device(drive, defaults, { googleProvider });
  await dev.click('driveSyncNowBtn');
  assert.equal(drive.uploads.length, 0);
  assert.equal(dev.localStorage.getItem('mikat_drive_account'), null);
  assert.equal(dev.sessionStorage.getItem('mikat_drive_token'), null);
  assert.match(dev.feedback, /giriş yaptığınız Google hesabını seçin/);
});

test('Google çıkışı Drive erişimini durdurur; yerel görevleri ve uzak kopyayı korur', async () => {
  const drive = fakeDrive();
  const googleProvider = accountProvider(true);
  const dev = device(drive, { ...defaults, tasks: [task('a', 'Korunan görev')] }, { googleProvider });
  await dev.click('driveSyncNowBtn');
  assert.equal(drive.uploads.length, 1);
  const count = drive.requests.length;
  googleProvider.current = null;
  dev.events['mikat:google-account']({ detail: { account: null } });
  dev.events.online();
  await settle();
  assert.equal(dev.sessionStorage.getItem('mikat_drive_token'), null);
  assert.equal(dev.localStorage.getItem('mikat_drive_account'), null);
  assert.equal(dev.data.tasks[0].name, 'Korunan görev');
  assert.equal(drive.files.size, 1);
  assert.equal(drive.requests.length, count);
});

test('ilk tıklama Google yetkisini alır ve eşitler; geçerli yetkiyle açılış otomatik çalışır', async () => {
  const drive = fakeDrive();
  const first = device(drive, { ...defaults, lat: 37.9, lng: 32.5, tasks: [task('a', 'Türkçe görev')] });
  assert.equal(first.popups.length, 0);
  await first.click();
  assert.equal(first.popups.length, 1);
  assert.equal(drive.uploads.length, 1);
  assert.deepEqual(drive.uploads[0], { tasks: [task('a', 'Türkçe görev')], prayers: {} });
  const second = device(drive, { ...defaults, namazCity: 'Ankara', theme: 'dark' });
  await second.click();
  assert.equal(second.data.tasks[0].name, 'Türkçe görev');
  assert.equal(second.data.namazCity, 'Ankara');
  assert.equal(second.data.theme, 'dark');
  assert.equal(drive.uploads.length, 1);

  first.data = { ...first.data, tasks: [...first.data.tasks, task('b', 'Yeni kayıt')] };
  await first.click();
  const reopened = device(drive, defaults, second);
  await settle();
  assert.equal(reopened.popups.length, 0);
  assert.equal(reopened.data.tasks.length, 2);
  assert.match(reopened.feedback, /Son başarılı eşitleme/);

  reopened.clock.time += 3600000;
  reopened.events.online();
  await settle();
  assert.equal(reopened.popups.length, 0);
  assert.equal(reopened.status, 'Yeniden bağlan');
  await reopened.click();
  assert.equal(reopened.popups.length, 1);
  assert.equal(reopened.popups[0].hint, 'example@example.test');
  assert.equal(drive.uploads.length, 2);
});

test('ilk bağlantı farklı eski Drive ve yerel verileri saklar; seçim önceki yerel veriyi arşivler', async () => {
  const drive = fakeDrive();
  drive.files.set('legacy', {
    id: 'legacy', name: 'mikat-yedek.json', createdTime: '2026-11-18T14:00:00Z',
    modifiedTime: '2026-11-18T14:00:00Z',
    body: { app: 'mikat', ts: 1, data: { tasks: [task('remote', 'Drive kaydı')], prayers: {}, lat: 99 } }
  });
  const dev = device(drive, { ...defaults, tasks: [task('local', 'Cihaz kaydı')] });
  await dev.click();
  assert.equal(dev.data.tasks[0].name, 'Cihaz kaydı');
  assert.equal(drive.uploads.length, 0);
  assert.equal(dev.choices.length, 2);
  await dev.choices[1].handlers.click();
  assert.equal(dev.data.tasks[0].name, 'Drive kaydı');
  assert.equal(dev.data.lat, null);
  assert.deepEqual(drive.uploads.map(item => item.tasks[0].name), ['Cihaz kaydı', 'Drive kaydı']);
  assert.ok(drive.files.has('legacy'));
  assert.equal(dev.choices.length, 0);
});

test('iki cihazın aynı anda eklediği ayrı görevler sonraki eşitlemede birleşir', async () => {
  const drive = fakeDrive();
  const first = device(drive);
  const second = device(drive);
  await first.click();
  await second.click();
  first.data = { ...first.data, tasks: [task('a', 'Telefondan')] };
  second.data = { ...second.data, tasks: [task('b', 'Bilgisayardan')] };
  await Promise.all([first.click(), second.click()]);
  assert.equal(drive.uploads.length, 3);
  await first.click();
  await second.click();
  assert.equal(drive.uploads.length, 4);
  assert.deepEqual(first.data.tasks.map(item => item.id).sort(), ['a', 'b']);
  assert.deepEqual(second.data.tasks, first.data.tasks);
});

test('aynı görevde farklı düzenlemeler kopya seçimine bırakılır', async () => {
  const drive = fakeDrive();
  const first = device(drive, { ...defaults, tasks: [task('a', 'Özgün başlık')] });
  const second = device(drive);
  await first.click();
  await second.click();
  first.data = { ...first.data, tasks: [task('a', 'Telefondaki başlık')] };
  second.data = { ...second.data, tasks: [task('a', 'Bilgisayardaki başlık')] };
  await Promise.all([first.click(), second.click()]);
  await first.click();
  assert.equal(drive.uploads.length, 3);
  assert.equal(first.data.tasks[0].name, 'Telefondaki başlık');
  assert.equal(first.choices.length, 3);
  await first.choices[0].handlers.click();
  assert.equal(drive.uploads.length, 4);
  assert.equal(first.choices.length, 0);
  const remote = device(drive);
  await remote.click();
  assert.equal(remote.data.tasks[0].name, 'Telefondaki başlık');
});

test('çevrimdışı açılır pencere gösterilmez ve yerel değişiklik sonraki bağlantıda gönderilir', async () => {
  const drive = fakeDrive();
  const dev = device(drive);
  await dev.click();
  dev.navigator.onLine = false;
  dev.events.offline();
  dev.data = { ...dev.data, tasks: [task('local', 'Çevrimdışı görev')] };
  await dev.click();
  assert.equal(dev.status, 'Çevrimdışı');
  assert.equal(dev.popups.length, 1);
  assert.equal(drive.uploads.length, 1);
  dev.navigator.onLine = true;
  dev.events.online();
  await settle();
  assert.equal(drive.uploads.length, 2);
  assert.equal(drive.uploads.at(-1).tasks[0].name, 'Çevrimdışı görev');
});

test('Drive kaydı aldıktan sonra yanıt kesilirse yeniden deneme aynı kaydı çoğaltmaz', async () => {
  const drive = fakeDrive();
  const fetch = drive.fetch;
  let interrupted = false;
  drive.fetch = async (url, options) => {
    const response = await fetch(url, options);
    if (options.method === 'POST' && !interrupted) {
      interrupted = true;
      throw new Error('Örnek: Yanıt alınamadı');
    }
    return response;
  };
  const dev = device(drive, { ...defaults, tasks: [task('a', 'Cihaz kaydı')] });
  await dev.click();
  assert.equal(dev.status, 'Eşitleme hatası');
  assert.equal(dev.data.tasks[0].name, 'Cihaz kaydı');
  assert.equal(drive.uploads.length, 1);
  await dev.click();
  assert.equal(drive.uploads.length, 1);
  assert.match(dev.feedback, /Eşitleme tamamlandı/);
});
