(() => {
  'use strict';

  // Web istemci kimliği herkese açıktır; Client Secret bu dosyaya eklenmez.
  const DEFAULT_CLIENT_ID = '802877175082-pp3j6fp9c00b56o5e8glpfgons2h02bq.apps.googleusercontent.com';
  const ACCOUNT = 'mikat_google_account';
  const CLIENT = 'mikat_drive_client_id';
  const CERTS = 'https://www.googleapis.com/oauth2/v3/certs';
  let loading = null;
  let keys = null;
  let initialized = null;
  let epoch = 0;
  let opening = false;
  let checking = false;
  let message = '';
  let messageKind = '';

  function read(storage, key) {
    try { return storage.getItem(key); } catch { return null; }
  }

  function clientId() {
    const previous = read(localStorage, CLIENT);
    return previous && /^[a-zA-Z0-9-]+\.apps\.googleusercontent\.com$/.test(previous)
      ? previous : DEFAULT_CLIENT_ID;
  }

  function account() {
    try {
      const value = JSON.parse(read(sessionStorage, ACCOUNT));
      if (value?.clientId === clientId() && typeof value.sub === 'string' && typeof value.email === 'string' &&
          Number.isFinite(value.expiresAt) && value.expiresAt > Date.now()) return value;
    } catch { /* Hesap kaydı yoksa yerel kullanım devam eder. */ }
    return null;
  }

  function announce() {
    window.dispatchEvent(new CustomEvent('mikat:google-account', { detail: { account: account() } }));
  }

  function feedback(text, kind = '') {
    message = text;
    messageKind = kind;
    render();
  }

  function render() {
    const current = account();
    const button = document.getElementById('googlePrepareBtn');
    const provider = document.getElementById('googleSignInButton');
    document.getElementById('googleAccount').textContent = current
      ? 'Google hesabı: ' + current.email : 'Google hesabıyla giriş yapılmadı';
    button.hidden = Boolean(current) || Boolean(initialized && !initialized.used);
    button.disabled = opening || checking;
    button.textContent = opening ? 'Google hazırlanıyor…' : 'Google ile giriş yap';
    provider.hidden = Boolean(current) || !initialized || initialized.used;
    document.getElementById('googleSignOutBtn').hidden = !current;
    const status = document.getElementById('googleAccountStatus');
    status.textContent = message;
    status.dataset.state = messageKind;
    provider.setAttribute('aria-busy', String(checking));
  }

  function load() {
    if (window.google?.accounts?.id && window.google?.accounts?.oauth2) return Promise.resolve();
    if (loading) return loading;
    loading = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client?hl=tr';
      script.async = true;
      let timeout;
      const finish = error => {
        clearTimeout(timeout);
        script.onload = null;
        script.onerror = null;
        if (error) {
          script.remove();
          reject(error);
        } else resolve();
      };
      script.onload = () => finish(window.google?.accounts?.id && window.google?.accounts?.oauth2
        ? null : new Error('Google giriş hizmeti hazırlanamadı. Yeniden deneyin.'));
      script.onerror = () => finish(new Error('Google bağlantısı yüklenemedi. İnternet bağlantısını kontrol edin.'));
      timeout = setTimeout(() => finish(new Error('Google bağlantısı zaman aşımına uğradı. Yeniden deneyin.')), 15000);
      document.head.appendChild(script);
    }).catch(error => { loading = null; throw error; });
    return loading;
  }

  function bytes(value) {
    if (!/^[A-Za-z0-9_-]+$/.test(value)) throw new Error('Google hesap yanıtı geçersiz.');
    const encoded = value.replace(/-/g, '+').replace(/_/g, '/');
    const raw = atob(encoded + '='.repeat((4 - encoded.length % 4) % 4));
    return Uint8Array.from(raw, char => char.charCodeAt(0));
  }

  async function publicKeys(force = false) {
    if (!force && keys && keys.until > Date.now()) return keys.values;
    const response = await fetch(CERTS, {
      credentials: 'omit', referrerPolicy: 'no-referrer', signal: AbortSignal.timeout(12000)
    });
    if (!response.ok) throw new Error('Google hesap doğrulaması tamamlanamadı. Yeniden deneyin.');
    const data = await response.json();
    if (!Array.isArray(data.keys)) throw new Error('Google doğrulama anahtarları okunamadı.');
    const age = Number(response.headers.get('cache-control')?.match(/max-age=(\d+)/)?.[1]) || 300;
    keys = { values: data.keys, until: Date.now() + Math.min(age, 3600) * 1000 };
    return keys.values;
  }

  async function verify(credential, expected) {
    if (typeof credential !== 'string' || credential.length > 20000) throw new Error('Google hesap yanıtı geçersiz.');
    const parts = credential.split('.');
    if (parts.length !== 3) throw new Error('Google hesap yanıtı geçersiz.');
    const header = JSON.parse(new TextDecoder().decode(bytes(parts[0])));
    const profile = JSON.parse(new TextDecoder().decode(bytes(parts[1])));
    const now = Date.now() / 1000;
    if (header?.alg !== 'RS256' || typeof header.kid !== 'string' ||
        !['accounts.google.com', 'https://accounts.google.com'].includes(profile?.iss) ||
        profile.aud !== expected.clientId || profile.nonce !== expected.nonce ||
        !Number.isFinite(profile.exp) || profile.exp <= now ||
        !Number.isFinite(profile.iat) || profile.iat > now + 60 || profile.iat >= profile.exp ||
        typeof profile.sub !== 'string' || !profile.sub || profile.sub.length > 255 ||
        typeof profile.email !== 'string' || !profile.email.includes('@') || profile.email_verified !== true) {
      throw new Error('Google hesap yanıtı doğrulanamadı. Yeniden giriş yapın.');
    }
    let jwk = (await publicKeys()).find(key => key.kid === header.kid && key.kty === 'RSA' && key.alg === 'RS256');
    if (!jwk) jwk = (await publicKeys(true)).find(key => key.kid === header.kid && key.kty === 'RSA' && key.alg === 'RS256');
    if (!jwk) throw new Error('Google hesap imzası doğrulanamadı. Yeniden deneyin.');
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, bytes(parts[2]), new TextEncoder().encode(parts[0] + '.' + parts[1]));
    if (!valid || profile.exp * 1000 <= Date.now()) throw new Error('Google hesap imzası doğrulanamadı. Yeniden giriş yapın.');
    return { clientId: expected.clientId, sub: profile.sub, email: profile.email, expiresAt: profile.exp * 1000 };
  }

  async function receive(response, expected) {
    if (checking || expected.epoch !== epoch || expected.used) return;
    checking = true;
    feedback('Google hesabı doğrulanıyor…');
    try {
      const profile = await verify(response.credential, expected);
      if (expected.epoch !== epoch || expected.clientId !== clientId()) return;
      // Bu kayıt yalnızca bu sekmedeki hesap görünümüdür; yönetim yetkisi vermez.
      sessionStorage.setItem(ACCOUNT, JSON.stringify(profile));
      expected.used = true;
      feedback('Giriş yapıldı. Kayıtlarınız bu cihazda; Drive eşitlemesini ayrıca açabilirsiniz.', 'ok');
      announce();
    } catch (error) {
      if (expected.epoch === epoch) feedback(error.message || 'Google girişi tamamlanamadı.', 'error');
    } finally {
      checking = false;
      render();
    }
  }

  async function open() {
    window.openSettings();
    if (opening || account()) return;
    if (window.location.protocol === 'file:') {
      feedback('Google ile giriş için https://mikat.komutrotasi.com/ veya http://localhost:8080/ adresini kullanın.', 'error');
      return;
    }
    if (!navigator.onLine) { feedback('Çevrimdışısınız. Mikat’ı giriş yapmadan kullanabilirsiniz.'); return; }
    if (!crypto.subtle) { feedback('Google ile giriş için güvenli HTTPS bağlantısı gerekiyor.', 'error'); return; }
    const currentEpoch = epoch;
    opening = true;
    feedback('Google giriş düğmesi hazırlanıyor…');
    try {
      await load();
      if (currentEpoch !== epoch) return;
      if (!initialized || initialized.clientId !== clientId() || initialized.used) {
        initialized = { clientId: clientId(), nonce: crypto.randomUUID(), epoch, used: false };
        const expected = initialized;
        window.google.accounts.id.initialize({
          client_id: expected.clientId, nonce: expected.nonce, auto_select: false,
          ux_mode: 'popup', context: 'signin', callback: response => receive(response, expected)
        });
      }
      const container = document.getElementById('googleSignInButton');
      container.replaceChildren();
      window.google.accounts.id.renderButton(container, {
        type: 'standard', theme: 'outline', size: 'large', text: 'signin_with',
        shape: 'rectangular', locale: 'tr', width: Math.min(320, Math.max(200, container.clientWidth || 240))
      });
      feedback('Aşağıdaki Google düğmesinden hesabınızı seçin. Drive izni bu adımda istenmez.');
    } catch (error) {
      if (currentEpoch === epoch) { initialized = null; feedback(error.message || 'Google girişi hazırlanamadı.', 'error'); }
    } finally {
      opening = false;
      render();
    }
  }

  function signOut() {
    epoch++;
    initialized = null;
    try { sessionStorage.removeItem(ACCOUNT); } catch { /* Bellekteki görünüm de temizlenir. */ }
    window.google?.accounts?.id?.disableAutoSelect();
    document.getElementById('googleSignInButton').replaceChildren();
    feedback('Bu cihazdaki Google oturumu kapatıldı. Yerel kayıtlarınız ve Drive yedekleriniz silinmedi.');
    announce();
  }

  window.mikatGoogle = Object.freeze({ clientId, account, load, open, signOut });
  if (!document.getElementById('googleAccountBox')) return;
  document.getElementById('googlePrepareBtn').addEventListener('click', open);
  document.getElementById('googleSignOutBtn').addEventListener('click', signOut);
  window.addEventListener('storage', event => {
    if (event.key === CLIENT) signOut();
  });
  window.addEventListener('mikat:google-config', signOut);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) render(); });
  render();
})();
