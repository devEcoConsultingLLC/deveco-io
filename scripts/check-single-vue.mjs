/**
 * Fail if package-lock.json resolves more than one copy of `vue` or
 * `@vue/server-renderer`.
 *
 * WHY THIS EXISTS. On 2026-08-31 a nuxt bump (3.21.5 -> 3.21.11) took every SSR
 * page on this site to 500 while /api/health and the feeds kept serving. The
 * cause was three Vue copies in the npm tree:
 *
 *   node_modules/vue                            3.5.34   <- the app
 *   node_modules/nuxt/node_modules/vue          3.5.42   <- the renderer
 *   node_modules/@nuxt/nitro-server/.../vue     3.5.42
 *
 * The root declared `vue: ^3.4.0`, locked at 3.5.34; nuxt required ^3.5.40, so
 * npm NESTED a second copy rather than upgrading the first. Two Vue runtimes in
 * one process makes every renderToString throw, while API routes -- which never
 * touch Vue -- keep answering. That asymmetry is why the deploy looked healthy.
 *
 * CI DID NOT CATCH IT, AND STRUCTURALLY COULD NOT: `ci.yml` installs with
 * `pnpm --frozen-lockfile` from pnpm-lock.yaml, while the Dockerfile installs
 * with `npm` from package-lock.json. pnpm hoisted one vue; npm did not. This
 * check therefore reads package-lock.json specifically -- the tree that SHIPS,
 * not the tree CI happens to build.
 *
 * The fix when this fires is to raise the ROOT `vue` range so a single copy
 * satisfies every consumer. An `overrides.vue` entry does NOT work here: npm
 * rejects it with EOVERRIDE while a direct dependency on vue exists.
 */
import { readFileSync } from 'node:fs';

const LOCK = 'package-lock.json';
/** Packages that must resolve to exactly one copy, with why. */
const SINGLETONS = {
  vue: 'two Vue runtimes make every renderToString throw',
  '@vue/server-renderer': 'must match the single Vue instance',
};

const lock = JSON.parse(readFileSync(LOCK, 'utf8'));
const paths = Object.keys(lock.packages ?? {});

if (paths.length < 100) {
  console.error(`${LOCK} lists only ${paths.length} packages; this check is not reading a real lockfile.`);
  process.exit(1);
}

let bad = false;
for (const [name, why] of Object.entries(SINGLETONS)) {
  const re = new RegExp(`(^|/)node_modules/${name.replace('/', '\\/')}$`);
  const copies = paths.filter((p) => re.test(p));
  if (copies.length === 1) {
    console.log(`ok   ${name} x1  (${lock.packages[copies[0]].version})`);
    continue;
  }
  bad = true;
  console.error(`FAIL ${name} x${copies.length} -- ${why}`);
  for (const c of copies) console.error(`       ${c} @ ${lock.packages[c].version}`);
}

if (bad) {
  console.error('\nRaise the ROOT range for the duplicated package so one copy satisfies');
  console.error('every consumer, then regenerate BOTH lockfiles. See the header of this file.');
  process.exit(1);
}
console.log('\nsingle-copy check passed against the tree the Dockerfile builds from.');
