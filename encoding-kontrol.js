'use strict';

const { readdirSync, readFileSync } = require('node:fs');
const { extname, join, relative } = require('node:path');

const extensions = new Set(['.css', '.html', '.js', '.json', '.jsonc', '.md', '.txt', '.webmanifest', '.yaml', '.yml']);
const configFiles = new Set(['.htaccess', '.gitignore', 'CNAME']);
const ignored = new Set(['node_modules', 'dist']);
const decoder = new TextDecoder('utf-8', { fatal: true });
let checked = 0;
let errors = 0;

function check(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory() && (!entry.name.startsWith('.') || entry.name === '.github') && !ignored.has(entry.name)) {
      check(path);
    } else if (entry.isFile() && (configFiles.has(entry.name) || extensions.has(extname(entry.name)))) {
      checked++;
      try {
        const bytes = readFileSync(path);
        if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) throw new Error('UTF-8 BOM bulundu');
        if (decoder.decode(bytes).includes('\uFFFD')) throw new Error('Bozuk karakter işareti bulundu');
      } catch (error) {
        console.error(`${relative(__dirname, path)}: ${error.message}`);
        errors++;
      }
    }
  }
}

check(__dirname);
console.log(`${checked} metin dosyası denetlendi. Hata: ${errors}.`);
process.exitCode = errors ? 1 : 0;
