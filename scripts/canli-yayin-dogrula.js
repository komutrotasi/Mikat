'use strict';

const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const { readFileSync, appendFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { setTimeout: delay } = require('node:timers/promises');

const origin = 'https://mikat.komutrotasi.com';
const manifest = JSON.parse(readFileSync(resolve(__dirname, '../dist/manifest.json'), 'utf8'));

async function checkFile(name, expectedHash) {
  let failure;
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      const url = new URL(name === 'index.html' ? '/' : '/' + name, origin);
      url.searchParams.set('mikat-yayin', manifest.commit);
      const response = await fetch(url, { redirect: 'manual', cache: 'no-store', signal: AbortSignal.timeout(15000) });
      assert.equal(response.status, 200, name + ' için HTTP ' + response.status);
      const bytes = Buffer.from(await response.arrayBuffer());
      assert.equal(createHash('sha256').update(bytes).digest('hex'), expectedHash, name + ' içeriği güncel paketle uyuşmuyor.');
      assert.equal(response.headers.get('cross-origin-opener-policy'), 'same-origin-allow-popups');
      assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
      if (name === 'index.html') {
        const policy = response.headers.get('content-security-policy') || '';
        assert.ok(policy.includes('https://accounts.google.com') && policy.includes('https://www.googleapis.com'), 'Google bağlantıları için başlık eksik.');
      }
      if (name === 'service-worker.js') assert.equal(response.headers.get('cache-control'), 'no-cache');
      console.log('Doğrulandı: ' + name);
      return;
    } catch (error) {
      failure = error;
      if (attempt < 5) await delay(10000);
    }
  }
  throw failure;
}

async function main() {
  const publicFiles = Object.entries(manifest.files).filter(([name]) => name !== '_headers');
  const outcomes = await Promise.allSettled(publicFiles.map(([name, hash]) => checkFile(name, hash)));
  const failures = outcomes.filter(result => result.status === 'rejected');
  for (const result of failures) console.error(result.reason.message);
  if (failures.length) throw new Error('Canlı yayında ' + failures.length + ' dosya doğrulanamadı.');
  const summary = 'Mikat canlı yayını doğrulandı. ' + publicFiles.length + ' dosya paketle eşleşiyor.\n';
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
  console.log(summary);
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
