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
  // Catch a removed keyboard bypass, broken section navigation, or mobile viewport.
  assert.match(html, /<body[^>]*>\s*<a[^>]+href="#main-content"[^>]*>본문으로 이동<\/a>/);
  assert.match(html, /<main[^>]+id="main-content"/);
  assert.match(html, /<meta[^>]+name="viewport"[^>]+content="width=device-width, initial-scale=1"/);
  const navigation = html.match(/<nav\b[^>]*>([\s\S]*?)<\/nav>/)?.[1] ?? '';
  assert.match(navigation, /href="#hero"/);
  assert.match(navigation, /href="#about"/);
  assert.match(navigation, /href="#services"/);
  assert.match(navigation, /href="#contact"/);
  const footer = html.match(/<footer\b[^>]*>([\s\S]*?)<\/footer>/)?.[1] ?? '';
  assert.match(footer, /href="https:\/\/petra\.parts"/);
  assert.match(html, /id="hero"/);
  assert.match(html, /id="about"/);
  assert.match(html, /id="services"/);
  assert.match(html, /id="contact"/);
  const about = html.slice(html.indexOf('id="about"'), html.indexOf('id="services"'));
  assert.match(about, /\(주\)페트라/);
  assert.match(about, /PETRA/);
  assert.match(about, /2026년 5월/);
  assert.match(about, /정동익/);
  assert.match(about, /서울특별시 구로구/);
  assert.match(about, /petra\.parts/);
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
