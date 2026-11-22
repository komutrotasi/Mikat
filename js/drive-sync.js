(() => {
  'use strict';

  const DRIVE = 'https://www.googleapis.com/drive/v3';
  const SCOPES = ['openid', 'https://www.googleapis.com/auth/drive.appdata', 'https://www.googleapis.com/auth/userinfo.email'];
  const SNAPSHOT = 'mikat-senkron-v2.json';
  const LEGACY = 'mikat-yedek.json';
  const CLIENT = 'mikat_drive_client_id';
  const ACCOUNT = 'mikat_drive_account';
  const TOKEN = 'mikat_drive_token';
  const CURSOR = 'mikat_drive_cursor';
  const filePage = window.location.protocol === 'file:';
  const fileNotice = 'Drive’a bağlanmak için Mikat’ı http://localhost:8080/ veya https://mikat.komutrotasi.com/ adresinden açın.';
  const DEVICE_FIELDS = ['lat', 'lng', 'namazCity', 'theme', 'notifEnabled', 'autoBackup', 'lastBackup', 'lastReset'];
  const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
  const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  const byId = rows => Object.fromEntries(rows.map(row => [String(row.id), row]));

  let grant = null;
  let gisLoading = null;
  let operation = null;
  let pending = null;
  let timer;
  let syncAgain = false;
  let conflict = null;
  let status = '';
  let kind = '';
  const snapshots = new Map();

  function read(key, storage = localStorage) {
    try {
      return storage.getItem(key);
    } catch {
      return null;
    }
  }

  function readJson(key, storage) {
    try {
      return JSON.parse(read(key, storage));
    } catch {
      return null;
    }
  }

  function configuredClientId() {
    return window.mikatGoogle?.clientId() || read(CLIENT);
  }

  function matchesSignedInAccount(account) {
    const signedIn = window.mikatGoogle?.account();
    return !signedIn || account?.key === configuredClientId() + ':' + signedIn.sub;
  }

  function project(data) {
    return Object.fromEntries(Object.entries(data).filter(([key]) => !DEVICE_FIELDS.includes(key)));
  }

  function same(a, b) {
    if (a === b) return true;
    if (Array.isArray(a) && Array.isArray(b)) {
      return a.length === b.length && a.every((value, index) => same(value, b[index]));
    }
    if (!record(a) || !record(b)) return false;
    const keys = Object.keys(a);
    return keys.length === Object.keys(b).length && keys.every(key => own(b, key) && same(a[key], b[key]));
  }

  function keyed(rows) {
    return Array.isArray(rows) && rows.every(row => record(row) && ['string', 'number'].includes(typeof row.id)) &&
      new Set(rows.map(row => String(row.id))).size === rows.length;
  }

  function merge(base, local, remote) {
    if (same(local, remote) || same(base, remote)) return local;
    if (same(base, local)) return remote;
    if (record(local) && record(remote) && (base === undefined || record(base))) {
      const before = base || {};
      const entries = [];
      for (const key of new Set([...Object.keys(local), ...Object.keys(remote)])) {
        const value = merge(own(before, key) ? before[key] : undefined,
          own(local, key) ? local[key] : undefined, own(remote, key) ? remote[key] : undefined);
        if (value !== undefined) entries.push([key, value]);
      }
      return Object.fromEntries(entries);
    }
    if (keyed(base) && keyed(local) && keyed(remote)) {
      return Object.values(merge(byId(base), byId(local), byId(remote)));
    }
    throw new Error('Kayıt çakışması');
  }

  function activeCursor() {
    const cursor = readJson(CURSOR);
    const account = readJson(ACCOUNT);
    return cursor && account && cursor.account === account.key ? cursor : null;
  }

  function validGrant() {
    const account = readJson(ACCOUNT);
    return grant && account?.key === grant.account.key && grant.clientId === configuredClientId() && matchesSignedInAccount(account) &&
      Date.now() < grant.expiresAt ? grant : null;
  }

  function updateStatus(text, type = '') {
    status = text;
    kind = type;
    render();
  }

  function render() {
    const account = readJson(ACCOUNT);
    const clientId = read(CLIENT) || '';
    const googleAccount = window.mikatGoogle?.account();
    const cursor = activeCursor();
    const last = cursor?.time ? new Date(cursor.time).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' }) : '';
    let summary = 'Drive ile eşitle';
    if (window.mikatGoogle && !account) summary = googleAccount ? 'Drive’ı bağla' : 'Google ile giriş yap';
    if (pending) summary = 'Eşitleniyor…';
    else if (filePage) summary = 'Drive için web adresini kullan';
    else if (!navigator.onLine) summary = 'Çevrimdışı';
    else if (conflict) summary = 'Kopyaları incele';
    else if (account && !validGrant()) summary = 'Yeniden bağlan';
    else if (kind === 'error') summary = 'Eşitleme hatası';
    else if (last) summary = 'Eşitlendi ' + new Date(cursor.time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    const header = document.getElementById('driveHeaderBtn');
    header.disabled = Boolean(pending);
    header.dataset.state = pending ? 'busy' : conflict || kind === 'error' ? 'attention' : validGrant() ? 'ready' : '';
    header.title = summary;
    header.setAttribute('aria-label', (window.mikatGoogle && !account ? 'Google hesabı. ' : 'Google Drive. ') + summary);
    document.getElementById('driveHeaderStatus').textContent = summary;
    const mobileLabel = document.getElementById('driveHeaderMobileLabel');
    if (mobileLabel) mobileLabel.textContent = window.mikatGoogle && !account && !googleAccount ? 'Giriş yap' : 'Eşitle';
    document.getElementById('driveAccount').textContent = account ? 'Google hesabı: ' + account.email : 'Bağlı değil';
    const input = document.getElementById('driveClientId');
    if (document.activeElement !== input) input.value = clientId;
    input.disabled = filePage || Boolean(pending);
    document.getElementById('driveConfigBtn').disabled = input.disabled;
    const sync = document.getElementById('driveSyncNowBtn');
    sync.disabled = filePage || Boolean(pending);
    sync.textContent = !account ? 'Drive eşitlemesini aç' : validGrant() ? 'Şimdi eşitle' : 'Yeniden bağlan ve eşitle';
    const disconnect = document.getElementById('driveDisconnectBtn');
    disconnect.hidden = !account;
    disconnect.disabled = Boolean(pending);
    const feedback = document.getElementById('driveStatus');
    feedback.textContent = [status, last && 'Son başarılı eşitleme: ' + last].filter(Boolean).join(' · ');
    feedback.dataset.state = kind;
  }

  function showSettings() {
    window.openSettings();
  }

  function showConflict(options) {
    conflict = options;
    const box = document.getElementById('driveConflict');
    const choices = document.getElementById('driveConflictChoices');
    choices.replaceChildren();
    box.hidden = !options;
    if (!options) return;

    function choice(label, id) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'cbtn2 drive-action';
      button.textContent = label;
      button.addEventListener('click', () => syncNow(id));
      choices.appendChild(button);
    }

    choice('Bu cihazdaki kopyayı kullan', 'local');
    options.forEach(version => {
      const date = new Date(version.createdTime).toLocaleString('tr-TR');
      choice('Drive kopyasını kullan · ' + date, version.key);
    });
  }

  function prepareGoogle() {
    if (window.mikatGoogle) {
      window.mikatGoogle.load().catch(error => updateStatus(error.message, 'error'));
      return;
    }
    if (window.google?.accounts?.oauth2 || gisLoading) return;
    const script = document.createElement('script');
    gisLoading = script;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => { gisLoading = null; };
    script.onerror = () => {
      gisLoading = null;
      script.remove();
      updateStatus('Google bağlantı hizmeti yüklenemedi. İnternet bağlantısını kontrol edip tekrar deneyin.', 'error');
    };
    document.head.appendChild(script);
  }

  function authorize(clientId) {
    const oauth = window.google?.accounts?.oauth2;
    const hint = window.mikatGoogle?.account()?.email || readJson(ACCOUNT)?.email || read('mikat_drive_email');
    return new Promise((resolve, reject) => {
      const client = oauth.initTokenClient({
        client_id: clientId,
        scope: SCOPES.join(' '),
        include_granted_scopes: false,
        callback(response) {
          if (!response.access_token || !oauth.hasGrantedAllScopes(response, ...SCOPES)) {
            reject(new Error(response.error === 'access_denied'
              ? 'Drive izni verilmedi. Mikat’ı bu cihazda kullanmaya devam edebilirsiniz.'
              : 'Google Drive izni verilmedi. İzin ekranını kontrol edin.'));
            return;
          }
          resolve(response);
        },
        error_callback(error) {
          const message = error.type === 'popup_failed_to_open'
            ? 'Google penceresi açılamadı. Açılır pencerelere izin verip tekrar deneyin.'
            : 'Google bağlantısı tamamlanmadı.';
          reject(new Error(message));
        }
      });
      client.requestAccessToken(hint ? { hint, prompt: '' } : { prompt: 'select_account' });
    });
  }

  async function api(url, token, options = {}) {
    const response = await fetch(url, {
      ...options,
      cache: 'no-store',
      signal: operation.signal,
      headers: { Authorization: 'Bearer ' + token, ...options.headers }
    });
    if (response.status === 401) {
      grant = null;
      try { sessionStorage.removeItem(TOKEN); } catch { /* Bellekteki erişim de geçersizdir. */ }
      throw new Error('Drive erişimi sona erdi. Yeniden bağlanmak için eşitleme düğmesine basın.');
    }
    if (response.status === 403) {
      throw new Error('Drive isteğine izin verilmedi. Drive API’nin etkin olduğunu ve hesabın izinlerini kontrol edin.');
    }
    if (!response.ok) throw new Error('Google Drive isteği başarısız oldu (' + response.status + ').');
    return response.json();
  }

  async function connect(clientId) {
    const response = await authorize(clientId);
    const token = response.access_token;
    const profile = await api('https://www.googleapis.com/oauth2/v3/userinfo', token);
    if (!profile.email) throw new Error('Google hesabı doğrulanamadı.');
    const signedIn = window.mikatGoogle?.account();
    if (signedIn && profile.sub !== signedIn.sub) throw new Error('Drive için giriş yaptığınız Google hesabını seçin. Cihazdaki kayıtlar korundu.');
    if (operation.signal.aborted || clientId !== configuredClientId()) throw new Error('Drive ayarları değişti.');
    const account = { key: clientId + ':' + (profile.sub || profile.email.toLowerCase()), email: profile.email };
    localStorage.setItem(ACCOUNT, JSON.stringify(account));
    localStorage.removeItem('mikat_drive_email');
    grant = { clientId, account, token, expiresAt: Date.now() + (Number(response.expires_in) || 3600) * 1000 - 30000 };
    try { sessionStorage.setItem(TOKEN, JSON.stringify(grant)); } catch { /* Açık sekmede kullanılmaya devam eder. */ }
    return grant;
  }

  function readLocal() {
    if (window.mikatHasUnsavedData?.()) throw new Error('Cihazdaki son değişiklik kaydedilemedi. Yerel kayıt tamamlanınca tekrar eşitleyin.');
    const raw = localStorage.getItem('mikat');
    const data = JSON.parse(raw || window.mikatDriveInitialState || '{}');
    if (!record(data)) throw new Error('Cihazdaki Mikat kaydı okunamadı.');
    return { raw, data, syncData: project(data) };
  }

  function storeLocal(local, data) {
    if (readLocal().raw !== local.raw) throw new Error('Eşitleme sırasında cihaz kaydı değişti. Yeniden eşitleniyor.');
    if (same(local.syncData, data)) return;
    const deviceFields = DEVICE_FIELDS.filter(key => own(local.data, key)).map(key => [key, local.data[key]]);
    localStorage.setItem('mikat', JSON.stringify({ ...data, ...Object.fromEntries(deviceFields) }));
    window.mikatReloadFromStorage(true);
    if (document.getElementById('settingsModal')?.classList?.contains('on')) window.renderSettings();
  }

  async function listVersions(token) {
    const versions = [];
    const params = new URLSearchParams({
      spaces: 'appDataFolder',
      q: "trashed = false and (name = '" + SNAPSHOT + "' or name = '" + LEGACY + "')",
      fields: 'nextPageToken,files(id,name,description,createdTime,modifiedTime)',
      pageSize: '1000'
    });
    do {
      const result = await api(DRIVE + '/files?' + params, token);
      for (const file of result.files || []) {
        const legacy = file.name === LEGACY;
        const parents = legacy ? [] : JSON.parse(file.description || '[]');
        if (!Array.isArray(parents) || parents.some(parent => typeof parent !== 'string')) {
          throw new Error('Drive yedeğinin sürüm bilgisi okunamadı.');
        }
        versions.push({ ...file, key: legacy ? file.id + ':' + file.modifiedTime : file.id, parents });
      }
      if (!result.nextPageToken) break;
      params.set('pageToken', result.nextPageToken);
    } while (true);
    return versions;
  }

  async function download(session, version) {
    const key = session.account.key + ':' + version.key;
    if (snapshots.has(key)) return snapshots.get(key);
    const file = await api(DRIVE + '/files/' + encodeURIComponent(version.id) + '?alt=media', session.token);
    if (file.app !== 'mikat' || !record(file.data) || Object.keys(file.data).length === 0) {
      throw new Error('Drive yedeği geçersiz. Cihazdaki veriler korundu.');
    }
    const data = project(file.data);
    if (snapshots.size >= 8) snapshots.delete(snapshots.keys().next().value);
    snapshots.set(key, data);
    return data;
  }

  async function upload(token, data, parents) {
    const boundary = 'mikat-' + crypto.randomUUID();
    const metadata = { name: SNAPSHOT, parents: ['appDataFolder'], description: JSON.stringify(parents) };
    const body = [
      '--' + boundary, 'Content-Type: application/json; charset=UTF-8', '', JSON.stringify(metadata),
      '--' + boundary, 'Content-Type: application/json; charset=UTF-8', '', JSON.stringify({ app: 'mikat', data }),
      '--' + boundary + '--', ''
    ].join('\r\n');
    const file = await api('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', token, {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/related; boundary=' + boundary },
      body
    });
    if (!file.id) throw new Error('Drive yeni yedeği doğrulayamadı.');
    return file.id;
  }

  function ancestors(version, versions) {
    const keys = new Set();
    const pendingKeys = [version.key];
    while (pendingKeys.length) {
      const key = pendingKeys.pop();
      if (keys.has(key)) continue;
      keys.add(key);
      pendingKeys.push(...(versions.get(key)?.parents || []));
    }
    return keys;
  }

  async function mergeDriveVersions(session, heads, versions) {
    const copies = await Promise.all(heads.map(head => download(session, head)));
    if (copies.every(copy => same(copy, copies[0]))) return copies[0];
    const known = new Map(versions.map(version => [version.key, version]));
    const lineage = heads.map(head => ancestors(head, known));
    const common = versions.filter(version => lineage.every(keys => keys.has(version.key)));
    const superseded = new Set(common.flatMap(version => version.parents));
    const bases = common.filter(version => !superseded.has(version.key));
    if (bases.length !== 1) return null;
    const base = await download(session, bases[0]);
    try {
      return copies.reduce((combined, copy) => merge(base, combined, copy));
    } catch {
      return null;
    }
  }

  async function synchronize(session, selection, displayed) {
    const versions = await listVersions(session.token);
    const parents = new Set(versions.flatMap(file => file.parents));
    const heads = versions.filter(file => !parents.has(file.key))
      .sort((a, b) => b.createdTime.localeCompare(a.createdTime));
    const local = readLocal();
    const cursor = activeCursor();
    const initial = project(JSON.parse(window.mikatDriveInitialState || '{}'));
    const unchangedInitial = !local.raw || same(local.syncData, initial);
    let remote;
    if (heads.length === 1) remote = await download(session, heads[0]);
    else if (heads.length > 1 && selection === undefined) remote = await mergeDriveVersions(session, heads, versions);
    let data = local.syncData;
    let revision = heads[0]?.key;
    let publish = !revision || heads.length > 1;
    let needsChoice = heads.length > 1 && !remote;

    if (selection !== undefined) {
      if (!displayed || displayed.length !== heads.length || heads.some(head => !displayed.some(file => file.key === head.key))) {
        showConflict(heads.length ? heads : null);
        updateStatus('Drive kopyaları değişti. Güncel seçenekleri kontrol edin.', 'attention');
        return;
      }
      if (selection !== 'local') {
        const selected = heads.find(file => file.key === selection);
        if (!selected) return;
        data = await download(session, selected);
      }
      publish = true;
      needsChoice = false;
    } else if (remote && !same(local.syncData, remote)) {
      const previous = versions.find(file => file.key === cursor?.revision);
      if (!previous) {
        if (unchangedInitial) data = remote;
        else needsChoice = true;
      } else if (heads.length === 1 && previous.key === revision) {
        publish = true;
      } else {
        const base = await download(session, previous);
        try {
          data = merge(base, local.syncData, remote);
          publish = heads.length > 1 || !same(data, remote);
        } catch {
          needsChoice = true;
        }
      }
    }

    if (needsChoice) {
      showConflict(heads);
      updateStatus('Cihazda ve Drive’da farklı kayıtlar var. Kullanacağınız kopyayı seçin.', 'attention');
      return;
    }

    if (readLocal().raw !== local.raw) {
      syncAgain = true;
      return;
    }
    if (!validGrant() || operation.signal.aborted) return;

    if (publish) {
      const baseKeys = heads.map(file => file.key);
      if (selection && selection !== 'local' && !unchangedInitial && !same(data, local.syncData) && !same(remote, local.syncData)) {
        // Seçimden önceki cihaz verisini de Drive geçmişine ekle.
        baseKeys.push(await upload(session.token, local.syncData, []));
      }
      revision = await upload(session.token, data, baseKeys);
    }
    if (!validGrant() || operation.signal.aborted) return;
    if (readLocal().raw !== local.raw) {
      syncAgain = true;
      return;
    }
    storeLocal(local, data);
    localStorage.setItem(CURSOR, JSON.stringify({ account: session.account.key, revision, time: Date.now() }));
    showConflict(null);
    updateStatus('Eşitleme tamamlandı.', 'ok');
  }

  function notifyChange() {
    clearTimeout(timer);
    if (!validGrant()) return;
    timer = setTimeout(() => runSync(false), 5000);
  }

  function runSync(interactive, selection) {
    if (filePage) {
      if (interactive) showSettings();
      updateStatus(fileNotice, 'attention');
      return;
    }
    if (pending) {
      if (!interactive) syncAgain = true;
      return pending;
    }
    if (!navigator.onLine) {
      updateStatus('Çevrimdışı. Kayıtlar bu cihazda tutuluyor.');
      return;
    }
    const clientId = configuredClientId();
    if (interactive && window.mikatGoogle && !window.mikatGoogle.account() && !readJson(ACCOUNT)) {
      return window.mikatGoogle.open();
    }
    const existingGrant = validGrant();
    if (!existingGrant && !interactive) {
      if (readJson(ACCOUNT)) updateStatus('Drive erişimini yenilemek için eşitleme düğmesine basın.');
      return;
    }
    if (!clientId || (!existingGrant && !window.google?.accounts?.oauth2)) {
      showSettings();
      if (clientId) {
        prepareGoogle();
        updateStatus('Google bağlantısı hazırlanıyor. Birkaç saniye sonra yeniden basın.');
      } else {
        updateStatus('İlk kurulum için Google OAuth istemci kimliğini kaydedin.');
        document.getElementById('driveClientId').focus();
      }
      return;
    }

    const displayed = conflict;
    operation = new AbortController();
    pending = (existingGrant ? Promise.resolve(existingGrant) : connect(clientId))
      .then(session => synchronize(session, selection, displayed))
      .catch(error => {
        if (!operation.signal.aborted) updateStatus(error.message || 'Eşitleme tamamlanamadı.', 'error');
      })
      .finally(() => {
        pending = null;
        operation = null;
        render();
        if (syncAgain) {
          syncAgain = false;
          notifyChange();
        }
      });
    updateStatus(existingGrant ? 'Eşitleniyor…' : 'Google bağlantısı bekleniyor…');
    return pending;
  }

  function syncNow(selection) {
    if (conflict && selection === undefined) showSettings();
    return runSync(true, selection);
  }

  function disconnect() {
    operation?.abort();
    grant = null;
    clearTimeout(timer);
    snapshots.clear();
    sessionStorage.removeItem(TOKEN);
    for (const key of [ACCOUNT, 'mikat_drive_connected', 'mikat_drive_email']) localStorage.removeItem(key);
    showConflict(null);
    updateStatus('Google Drive bağlantısı bu tarayıcıda kesildi.');
  }

  function saveClientId() {
    const input = document.getElementById('driveClientId');
    const id = input.value.trim();
    if (id && !/^[a-zA-Z0-9-]+\.apps\.googleusercontent\.com$/.test(id)) {
      updateStatus('Bir Google web OAuth istemci kimliği girin.', 'error');
      return;
    }
    try {
      if (id !== read(CLIENT)) disconnect();
      if (id) {
        localStorage.setItem(CLIENT, id);
      } else {
        localStorage.removeItem(CLIENT);
      }
      if (window.mikatGoogle) window.dispatchEvent(new CustomEvent('mikat:google-config'));
      updateStatus(id ? 'Kişisel Google projesi kaydedildi. Yeniden giriş yapabilirsiniz.' : 'Mikat’ın standart Google bağlantısı kullanılacak.');
    } catch {
      updateStatus('İstemci kimliği tarayıcıya kaydedilemedi.', 'error');
    }
  }

  function init() {
    if (!document.getElementById('driveHeaderBtn')) return;
    grant = readJson(TOKEN, sessionStorage);
    document.getElementById('driveHeaderBtn').addEventListener('click', () => {
      if (window.mikatGoogle && !readJson(ACCOUNT)) {
        showSettings();
        if (!window.mikatGoogle.account()) return window.mikatGoogle.open();
        return;
      }
      return syncNow();
    });
    document.getElementById('driveSyncNowBtn').addEventListener('click', () => syncNow());
    document.getElementById('driveDisconnectBtn').addEventListener('click', disconnect);
    document.getElementById('driveConfigBtn').addEventListener('click', saveClientId);
    window.addEventListener('mikat:google-account', event => {
      const linked = readJson(ACCOUNT);
      if (!event.detail.account || (linked && !matchesSignedInAccount(linked))) disconnect();
      else render();
    });
    if (filePage) {
      runSync(false);
      return;
    }
    window.mikatDriveNotify = notifyChange;
    window.addEventListener('online', () => runSync(false));
    window.addEventListener('offline', render);
    window.addEventListener('storage', event => {
      if (event.key === 'mikat') notifyChange();
      if (event.key === CLIENT || event.key === ACCOUNT) {
        if (!validGrant()) {
          operation?.abort();
          showConflict(null);
          updateStatus('');
        }
      }
      if (event.key === CURSOR) render();
    });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) runSync(false); });
    setInterval(() => { if (!document.hidden) runSync(false); }, 60000);
    render();
    runSync(false);
  }

  init();
})();
