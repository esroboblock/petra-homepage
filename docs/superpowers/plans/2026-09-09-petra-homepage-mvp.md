# PETRA Homepage MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build PETRA's first public, static Astro homepage as a restrained Korean-language business-card site with Hero, About, Services, and Contact sections.

**Architecture:** Keep the homepage route thin and compose it from a shared page layout plus four section components. Store approved public facts and service copy in one typed data module so later standalone pages can reuse the same content without importing page markup. Verify the generated static HTML with Node's built-in test runner and verify the final presentation through fresh desktop and mobile browser checks.

**Tech Stack:** Astro 7.3.2, TypeScript 6.0.3, Node.js 22+, npm, Node built-in test runner

**Spec:** [GitHub Issue #2](https://github.com/esroboblock/petra-homepage/issues/2)

## Global Constraints

- The site is one statically generated page with the section order `Hero`, `About`, `Services`, `Contact`.
- Use `PETRA` text as the wordmark; do not create a logo or symbol asset.
- Public body copy is Korean-first; English section labels may accompany it.
- Present `전자부품 수급·유통` as the only current service, using the approved sentence: `제품 개발과 생산에 필요한 전기·전자부품의 수급 가능성을 검토하고 유통·무역 방식의 공급을 협의한다.`
- Software development and robot/drone R&D consulting may appear only as brief business-area labels, never as current service promises.
- Do not claim in-house production, one-stop service, guaranteed delivery, guaranteed quality, or finalized authenticity/traceability/quality policies.
- Show `petra@petra.parts` as text and use `mailto:petra@petra.parts` for the `문의하기` action.
- Show only the approved company facts from Issue #2: `(주)페트라`, `PETRA`, `2026년 5월`, `정동익`, `서울특별시 구로구`, and `petra.parts`.
- Do not add deployment, DNS, custom-domain, backend form, CMS, multilingual switching, catalog, case study, analytics, or complex animation work.
- Do not read or import files from the private internal repository; this public repository must remain self-contained.

## File Structure

- `package.json`, `package-lock.json`: npm scripts and pinned package graph for local development, checking, testing, and production builds.
- `astro.config.mjs`, `tsconfig.json`: minimal Astro static-site configuration and strict TypeScript defaults.
- `src/data/site.ts`: the single source of approved public company facts, navigation, service description, and business-area labels.
- `src/layouts/BaseLayout.astro`: document shell, metadata, shared navigation/footer, typography, color tokens, and global responsive styles.
- `src/components/Hero.astro`: wordmark-led opening section and restrained supporting sentence.
- `src/components/About.astro`: approved company facts rendered as a definition list.
- `src/components/Services.astro`: one current service plus clearly secondary business-area labels.
- `src/components/Contact.astro`: visible email/address and mailto call to action.
- `src/pages/index.astro`: composition-only homepage route with no duplicated content constants.
- `tests/homepage.test.mjs`: black-box assertions against generated `dist/index.html`.
- `README.md`: setup, local commands, project structure, and explicit deployment exclusion.

### Task 1: Astro foundation and content-complete static homepage

**Files:**
- Create: `package.json`
- Create: `package-lock.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/data/site.ts`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Hero.astro`
- Create: `src/components/About.astro`
- Create: `src/components/Services.astro`
- Create: `src/components/Contact.astro`
- Create: `src/pages/index.astro`
- Create: `tests/homepage.test.mjs`

**Interfaces:**
- Consumes: the approved scope in GitHub Issue #2 and the repository boundary in `README.md`.
- Produces: `company`, `navigation`, `primaryService`, and `businessAreas` named exports from `src/data/site.ts`; a buildable `/` route; generated `dist/index.html` containing every required section and contact link.

- [ ] **Step 1: Add minimal Astro tooling configuration**

Create `package.json` with `private: true`, `type: "module"`, Astro `7.3.2`, TypeScript `6.0.3`, and scripts with these contracts:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "check": "astro check",
    "test": "node --test tests/*.test.mjs"
  }
}
```

Use `output: 'static'` in `astro.config.mjs`, extend `astro/tsconfigs/strict` in `tsconfig.json`, and run `npm install` to create `package-lock.json`.

- [ ] **Step 2: Write the failing generated-page contract test**

Create `tests/homepage.test.mjs`. The test must run `npm run build` in the repository root, fail with the build output if the command exits nonzero, read `dist/index.html`, and assert observable public behavior using literal expectations:

```js
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
```

Also verify the `hero`, `about`, `services`, and `contact` IDs occur in that order. The production mutation caught by this test is a missing/reordered section, omitted approved fact, broken email action, wrong page language, or prohibited promise in the generated page.

- [ ] **Step 3: Run the test and verify RED**

Run: `npm test`

Expected: FAIL because the homepage route and generated `dist/index.html` do not exist yet.

- [ ] **Step 4: Implement typed content and focused page components**

Create `src/data/site.ts` with immutable exports shaped as follows and populated only with Issue #2's exact approved facts:

```ts
export const company = {
  legalName: '(주)페트라',
  englishName: 'PETRA',
  founded: '2026년 5월',
  representative: '정동익',
  location: '서울특별시 구로구',
  domain: 'petra.parts',
  email: 'petra@petra.parts',
} as const;
```

Export navigation entries targeting the four section IDs, the exact approved primary-service sentence, and only `소프트웨어 개발`, `로봇·드론 기술개발 및 컨설팅` as secondary `사업 분야` labels. Components import this module directly. `src/pages/index.astro` only imports the layout and four components and renders them in the required order.

Use semantic landmarks and headings: a labeled primary navigation, one `h1` containing `PETRA`, `main`, section-level `h2` elements, an About definition list, an article for the current service, an address element in Contact, and a descriptive page title/description. Do not use remote images, web fonts, JavaScript hydration, or a contact form.

- [ ] **Step 5: Run focused checks and verify GREEN**

Run: `npm test && npm run check && npm run build`

Expected: all commands exit 0; the contract test reports one passing test and Astro emits `dist/index.html`.

- [ ] **Step 6: Commit the content-complete foundation**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json src tests
git commit -m "feat: build PETRA homepage MVP"
```

### Task 2: Responsive visual system, accessibility details, and project handoff

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/components/Hero.astro`
- Modify: `src/components/About.astro`
- Modify: `src/components/Services.astro`
- Modify: `src/components/Contact.astro`
- Modify: `tests/homepage.test.mjs`
- Modify: `README.md`

**Interfaces:**
- Consumes: Task 1's stable section IDs, typed content exports, semantic landmarks, and generated-page test harness.
- Produces: a keyboard-usable skip link, visible focus treatment, restrained responsive visual system, readable 360px and 1440px layouts, and contributor-facing local commands.

- [ ] **Step 1: Extend the contract test for keyboard and document essentials**

Add literal assertions for a first-focus skip link targeting `#main-content`, `id="main-content"` on the main landmark, a responsive viewport meta tag, all four internal navigation hrefs, and a footer/domain link using `https://petra.parts`. The production mutation caught is removing keyboard bypass navigation, disconnecting navigation from section IDs, or omitting mobile viewport behavior.

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test`

Expected: FAIL because Task 1 does not yet include the skip link and `main-content` target (and, if absent, the domain link).

- [ ] **Step 3: Implement the restrained responsive presentation**

In `BaseLayout.astro`, define local system-font stacks and CSS custom properties for an off-white background, near-black text, muted gray, hairline borders, and one restrained warm accent. Add a centered maximum-width wrapper, generous fluid section spacing with `clamp()`, a sticky-or-static compact header that never obscures anchor targets, visible `:focus-visible` outlines, `scroll-margin-top` on sections, and a visually hidden skip link that becomes visible on focus.

Style the hero around the text wordmark rather than imagery. Use responsive CSS Grid for About facts and the Services/Contact layouts, falling back to one column without horizontal overflow at 360px. Keep motion limited to subtle color/underline transitions and disable them under `prefers-reduced-motion: reduce`. Maintain readable contrast and do not add decorative circuit/PCB artwork or complex animation.

Component styles may remain scoped to their component; global tokens, reset, header/footer, shared containers, and accessibility utilities belong in `BaseLayout.astro`. Avoid client-side scripts.

- [ ] **Step 4: Update README for maintainers**

Document Node.js 22+, `npm install`, `npm run dev`, `npm test`, `npm run check`, and `npm run build`. Describe `src/data/site.ts` as the approved public-copy source and state that GitHub Pages/custom-domain deployment remains out of scope for Issue #2.

- [ ] **Step 5: Verify GREEN and inspect both target viewport classes**

Run: `npm test && npm run check && npm run build`

Expected: all commands exit 0 with no Astro diagnostics.

Serve the build locally and inspect `/` at 360×800 and 1440×900. At both sizes verify: no horizontal scroll, section order and copy are readable, navigation targets work, the mail action remains visible, focus reaches the skip link and navigation, and no text overlaps or clips. Save screenshots in the plan workspace rather than the repository.

- [ ] **Step 6: Check repository-boundary and scope compliance**

Review `git diff --check`, `git status --short`, and the complete diff. Confirm no internal file paths, credentials, unapproved facts, generated `dist/`, deployment configuration, remote assets, logo files, or prohibited service promises are tracked.

- [ ] **Step 7: Commit the finished presentation and documentation**

```bash
git add src tests README.md
git commit -m "style: refine PETRA responsive presentation"
```

## Final Verification

- [ ] Run `npm test && npm run check && npm run build` from a clean working tree.
- [ ] Run `git diff --check origin/main...HEAD`.
- [ ] Review `git diff --stat origin/main...HEAD` and every changed file against Issue #2's completion checklist.
- [ ] Confirm `git status --short` is empty before pushing and opening the pull request.
