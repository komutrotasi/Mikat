'use strict';

const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');
const { createContext, runInContext } = require('node:vm');

const script = readFileSync(join(__dirname, '../js/admin.js'), 'utf8');
const html = readFileSync(join(__dirname, '../admin.html'), 'utf8');

function element(textContent = '') {
  const classes = new Set();
  return {
    textContent, value: '', style: {}, events: {},
    classList: { add(name) { classes.add(name); }, remove(name) { classes.delete(name); }, contains(name) { return classes.has(name); } },
    addEventListener(name, handler) { (this.events[name] ||= []).push(handler); }
  };
}

function setup() {
  const ids = new Map(['admin-login-form', 'pin-input', 'login-error', 'login-screen', 'admin-dashboard',
    'active-tab-title', 'tab-gorevler', 'admin-mobile-backdrop', 'admin-mobile-icon'].map(id => [id, element()]));
  const nav = element('Görev Yönetimi');
  nav.getAttribute = name => name === 'data-target' ? 'tab-gorevler' : null;
  const sidebar = element();
  const saved = new Map([['mikat_admin_pin', '482619']]);
  const session = new Map();
  const timers = [];
  const calls = { dashboard: 0, tasks: 0 };
  let ready;
  const context = createContext({
    innerWidth: 375,
    document: {
      addEventListener(name, handler) { if (name === 'DOMContentLoaded') ready = handler; },
      getElementById(id) { return ids.get(id) || null; },
      querySelectorAll(selector) { return selector.includes('.nav-item') ? [nav] : selector === '.tab-pane' ? [ids.get('tab-gorevler')] : []; },
      querySelector(selector) { return selector === '.admin-sidebar' ? sidebar : selector.includes("data-target='tab-gorevler'") ? nav : null; }
    },
    localStorage: { getItem(key) { return saved.get(key) ?? null; } },
    sessionStorage: { getItem(key) { return session.get(key) ?? null; }, setItem(key, value) { session.set(key, value); } },
    setTimeout(handler) { timers.push(handler); }
  });
  context.window = context;
  runInContext(script, context);
  context.initAdminDashboard = () => { calls.dashboard++; };
  context.renderAdminTasksTable = () => { calls.tasks++; };
  ready();
  return {
    ids, session, timers, calls, sidebar, context, nav,
    submit(pin) {
      ids.get('pin-input').value = pin;
      let prevented = false;
      for (const handler of ids.get('admin-login-form').events.submit || []) handler({ preventDefault() { prevented = true; } });
      assert.ok(prevented, 'PIN girişi sayfayı yeniden yüklememeli.');
    }
  };
}

test('mobil PIN formu hatalı girişi reddeder ve doğru PIN ile paneli açar', () => {
  const dev = setup();
  dev.submit('000000');
  assert.match(dev.ids.get('login-error').textContent, /Hatalı PIN/);
  assert.equal(dev.calls.dashboard, 0);
  dev.submit('482619');
  assert.equal(dev.session.get('mikat_admin_auth'), 'true');
  assert.equal(dev.ids.get('login-screen').style.display, 'none');
  assert.equal(dev.ids.get('admin-dashboard').style.display, 'flex');
  assert.equal(dev.calls.dashboard, 1);
});

test('PIN formu beş yanlış denemeden sonra bekleme süresini uygular', () => {
  const dev = setup();
  for (let attempt = 0; attempt < 5; attempt++) dev.submit('000000');
  dev.submit('482619');
  assert.equal(dev.calls.dashboard, 0);
  assert.match(dev.ids.get('login-error').textContent, /30 saniye/);
  dev.timers[0]();
  dev.submit('482619');
  assert.equal(dev.calls.dashboard, 1);
});

test('mobil yönetim menüsü tek kez çalışır ve panel seçilince kapanır', () => {
  const dev = setup();
  dev.sidebar.classList.add('mobile-active');
  const inline = html.match(/data-target="tab-gorevler" onclick="([^"]+)"/)[1];
  runInContext('(function () { ' + inline + ' })()', dev.context);
  for (const handler of dev.nav.events.click || []) handler({ preventDefault() {} });
  assert.equal(dev.calls.tasks, 1);
  assert.equal(dev.sidebar.classList.contains('mobile-active'), false);
  assert.equal(dev.ids.get('admin-mobile-backdrop').style.display, 'none');
  assert.equal(dev.ids.get('tab-gorevler').classList.contains('active'), true);
});
