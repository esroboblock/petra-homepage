import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

import astroConfig from '../astro.config.mjs';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('Astro builds assets for the GitHub Pages project-site path', () => {
  assert.equal(astroConfig.site, 'https://esroboblock.github.io');
  assert.equal(astroConfig.base, '/petra-homepage');
  assert.equal(astroConfig.output, 'static');

  execFileSync('npm', ['run', 'build'], {
    cwd: repositoryRoot,
    encoding: 'utf8',
    stdio: 'pipe',
  });

  const html = readFileSync(resolve(repositoryRoot, 'dist/index.html'), 'utf8');

  assert.match(html, /(?:href|src)="\/petra-homepage\/_astro\//);
  assert.doesNotMatch(html, /(?:href|src)="\/_astro\//);
});
