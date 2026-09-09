# GitHub Pages Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Automatically validate pull requests and deploy validated `main` builds of the PETRA Astro site to its GitHub Pages project-site URL.

**Architecture:** Astro owns the public origin and `/petra-homepage` base path so generated assets work under the GitHub project-site prefix. One GitHub Actions workflow runs the same install/check/test/build sequence for pull requests and `main`, uploads `dist/` only for `main`, and gates a separate official Pages deployment job on successful validation.

**Tech Stack:** Astro 7, Node.js 22, Node test runner, YAML 2.9, GitHub Actions, GitHub Pages official actions

**Spec:** GitHub Issue [#4](https://github.com/esroboblock/petra-homepage/issues/4)

## Global Constraints

- Do not reopen brainstorming; Issue #4 is the approved specification.
- Use `site: 'https://esroboblock.github.io'`, `base: '/petra-homepage'`, and retain `output: 'static'`.
- Pull requests run `npm ci`, `npm run check`, `npm test`, and `npm run build` without deploying.
- `main` pushes run the same validation before uploading `dist/` and deploying.
- Use official Pages Actions; do not create a `gh-pages` branch.
- Declare only `contents: read`, `pages: write`, and `id-token: write` where required.
- The deploy job uses the `github-pages` environment.
- Do not add custom-domain, CNAME, HTTPS, redirect, preview, staging, content, or design changes.

---

### Task 1: Protect the GitHub project-site build contract

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `tests/deployment.test.mjs`
- Modify: `astro.config.mjs`

**Interfaces:**
- Consumes: Astro's `defineConfig` result and `npm run build` output.
- Produces: an Astro configuration with `site`, `base`, and static output plus a regression test that verifies the deployed asset prefix.

- [ ] **Step 1: Add the YAML test dependency and write the failing Astro deployment test**

Add exact dev dependency `yaml@2.9.0`, then create `tests/deployment.test.mjs` with a test that imports the default export from `astro.config.mjs`, expects `{ site: 'https://esroboblock.github.io', base: '/petra-homepage', output: 'static' }`, builds the site, and asserts generated HTML references `/petra-homepage/_astro/` rather than `/_astro/`.

- [ ] **Step 2: Run the deployment test to verify it fails**

Run: `node --test tests/deployment.test.mjs`

Expected: FAIL because `site` and `base` are absent from the current Astro config.

- [ ] **Step 3: Add the approved Astro Pages configuration**

Update `astro.config.mjs` to:

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://esroboblock.github.io',
  base: '/petra-homepage',
  output: 'static',
});
```

- [ ] **Step 4: Run the deployment test and full existing test suite**

Run: `node --test tests/deployment.test.mjs && npm test`

Expected: both deployment tests and the existing homepage contract pass.

- [ ] **Step 5: Commit the project-site configuration**

```bash
git add package.json package-lock.json tests/deployment.test.mjs astro.config.mjs
git commit -m "test: protect Pages deployment contract"
```

### Task 2: Add the single validation and deployment workflow

**Files:**
- Modify: `tests/deployment.test.mjs`
- Create: `.github/workflows/deploy-pages.yml`
- Modify: `README.md`

**Interfaces:**
- Consumes: `dist/` created by `npm run build` and the repository's `main`/pull-request GitHub events.
- Produces: a parsed workflow contract and a single official GitHub Pages Actions pipeline.

- [ ] **Step 1: Write the failing workflow contract test**

Extend `tests/deployment.test.mjs` using `YAML.parse` to require both `pull_request` and `push` on `main`; require the verify job to run checkout, Node 22 setup with npm cache, `npm ci`, check, test, and build; require artifact upload only on `push`; and require a deploy job that needs verify, runs only for a `main` push, declares Pages/OIDC permissions, targets `github-pages`, and uses `actions/deploy-pages@v4`.

- [ ] **Step 2: Run the deployment test to verify it fails**

Run: `node --test tests/deployment.test.mjs`

Expected: FAIL with `ENOENT` because `.github/workflows/deploy-pages.yml` does not exist.

- [ ] **Step 3: Implement the official Pages Actions workflow**

Create `.github/workflows/deploy-pages.yml` with top-level `contents: read`, pull-request and `main` push triggers, a `verify` job containing the four approved commands and a push-only `actions/upload-pages-artifact@v4` step for `./dist`, then a `deploy` job with `needs: verify`, an explicit main-push condition, `pages: write` and `id-token: write`, the `github-pages` environment URL, and `actions/deploy-pages@v4`.

- [ ] **Step 4: Document the deployment behavior**

Replace the README statement that Pages is future work with the default Pages URL and a concise description that pull requests only validate while successful `main` pushes deploy automatically; retain custom-domain work as follow-up scope.

- [ ] **Step 5: Run all local validation**

Run: `npm ci && npm run check && npm test && npm run build`

Expected: dependency install succeeds, Astro reports zero diagnostics, all tests pass, and `dist/index.html` is generated.

- [ ] **Step 6: Commit the workflow and documentation**

```bash
git add .github/workflows/deploy-pages.yml tests/deployment.test.mjs README.md
git commit -m "ci: deploy validated site to GitHub Pages"
```

### Task 3: Publish the implementation for review

**Files:**
- Verify only; no planned source changes.

**Interfaces:**
- Consumes: the completed branch and GitHub repository.
- Produces: a pushed branch, pull request linked to Issue #4, and observable PR checks.

- [ ] **Step 1: Review the complete diff against Issue #4**

Run: `git diff main...HEAD --check && git diff --stat main...HEAD`

Expected: no whitespace errors and only deployment-related files changed.

- [ ] **Step 2: Re-run the complete validation suite**

Run: `npm ci && npm run check && npm test && npm run build`

Expected: all commands pass from the committed tree.

- [ ] **Step 3: Push and create the pull request**

Push `codex/issue-4-pages-deploy`, then create a PR titled `Configure GitHub Pages deployment` whose body summarizes the Astro base-path change, PR/main workflow split, verification results, and includes `Closes #4`.

- [ ] **Step 4: Observe the PR checks**

Run: `gh pr checks --watch`

Expected: the workflow's verification job succeeds and no Pages deployment job runs for the pull request.

## Self-review

- Spec coverage: Tasks 1–3 cover project-site routing, the exact validation chain, conditional artifact upload/deploy, official actions, minimum permissions, environment configuration, documentation, PR creation, and PR check observation. Actual production deployment and URL verification require merge to `main`, which is intentionally after this PR-scoped request.
- Placeholder scan: no TBD/TODO/“similar to” placeholders remain.
- Type consistency: the YAML parser consumes the workflow created in Task 2; the workflow consumes the `dist/` output verified in Task 1.
