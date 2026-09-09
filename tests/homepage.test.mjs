import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('generated homepage preserves the approved public contract', () => {
  try {
    execFileSync('npm', ['run', 'build'], {
      cwd: repositoryRoot,
      encoding: 'utf8',
      stdio: 'pipe',
    });
  } catch (error) {
    assert.fail(`Homepage build failed:\n${error.stdout ?? ''}${error.stderr ?? ''}`);
  }

  const html = readFileSync(resolve(repositoryRoot, 'dist/index.html'), 'utf8');

  assert.match(html, /<html[^>]+lang="ko"/);
  assert.match(html, /id="hero"/);
  assert.match(html, /id="about"/);
  assert.match(html, /id="services"/);
  assert.match(html, /id="contact"/);
  assert.match(html, /\(주\)페트라/);
  assert.match(html, /2026년 5월/);
  assert.match(html, /정동익/);
  assert.match(html, /서울특별시 구로구/);
  assert.match(html, /전자부품 수급·유통/);
  assert.match(html, /href="mailto:petra@petra\.parts"/);
  assert.match(html, />petra@petra\.parts</);
  assert.doesNotMatch(html, /자체 생산|원스톱|납기 보장|품질 보장/);

  const heroIndex = html.indexOf('id="hero"');
  const aboutIndex = html.indexOf('id="about"');
  const servicesIndex = html.indexOf('id="services"');
  const contactIndex = html.indexOf('id="contact"');

  assert.ok(heroIndex < aboutIndex);
  assert.ok(aboutIndex < servicesIndex);
  assert.ok(servicesIndex < contactIndex);
});
