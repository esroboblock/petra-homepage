import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import YAML from 'yaml';

import astroConfig from '../astro.config.mjs';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const workflowPath = resolve(repositoryRoot, '.github/workflows/deploy-pages.yml');

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

test('Pages workflow validates pull requests and deploys only validated main pushes', () => {
  const workflow = YAML.parse(readFileSync(workflowPath, 'utf8'));

  assert.ok(Object.hasOwn(workflow.on, 'pull_request'));
  assert.deepEqual(workflow.on.push.branches, ['main']);
  assert.deepEqual(workflow.permissions, { contents: 'read' });

  const verify = workflow.jobs.verify;
  assert.equal(verify['runs-on'], 'ubuntu-latest');

  const checkout = verify.steps.find((step) => step.uses?.startsWith('actions/checkout@'));
  const setupNode = verify.steps.find((step) => step.uses?.startsWith('actions/setup-node@'));
  const commands = verify.steps.filter((step) => step.run).map((step) => step.run);
  const upload = verify.steps.find((step) => step.uses?.startsWith('actions/upload-pages-artifact@'));

  assert.equal(checkout.uses, 'actions/checkout@v7');
  assert.equal(setupNode.uses, 'actions/setup-node@v7');
  assert.equal(setupNode.with['node-version'], 22);
  assert.equal(setupNode.with.cache, 'npm');
  assert.deepEqual(commands, ['npm ci', 'npm run check', 'npm test', 'npm run build']);
  assert.equal(upload.uses, 'actions/upload-pages-artifact@v4');
  assert.equal(upload.if, "github.event_name == 'push'");
  assert.equal(upload.with.path, './dist');

  const deploy = workflow.jobs.deploy;
  assert.equal(deploy.needs, 'verify');
  assert.equal(deploy.if, "github.event_name == 'push' && github.ref == 'refs/heads/main'");
  assert.equal(deploy['runs-on'], 'ubuntu-latest');
  assert.deepEqual(deploy.permissions, {
    pages: 'write',
    'id-token': 'write',
  });
  assert.deepEqual(deploy.environment, {
    name: 'github-pages',
    url: '${{ steps.deployment.outputs.page_url }}',
  });
  assert.equal(deploy.steps.length, 1);
  assert.equal(deploy.steps[0].id, 'deployment');
  assert.equal(deploy.steps[0].uses, 'actions/deploy-pages@v4');
});
