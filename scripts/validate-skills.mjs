#!/usr/bin/env node
// Validates every skill in this repo against the conventions in AGENTS.md:
// SKILL.md frontmatter, Codex metadata, invocation policy, and promotion
// bookkeeping (plugin.json + READMEs). Zero dependencies.
//
// Run: node scripts/validate-skills.mjs

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SKILL_ROOT = join(REPO, 'skills');
const PROMOTED = new Set(['foreman', 'engineering', 'productivity']);
const NON_PROMOTED = new Set(['misc', 'in-progress', 'deprecated']);

let passes = 0;
const failures = [];
const warnings = [];

const ok = (msg) => { passes++; console.log(`  ok    ${msg}`); };
const fail = (msg) => { failures.push(msg); console.log(`  FAIL  ${msg}`); };
const warn = (msg) => { warnings.push(msg); console.log(`  warn  ${msg}`); };

const read = (file, base = REPO) =>
  readFileSync(join(base, file), 'utf8').replace(/^\uFEFF/, '');

function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '');
  }
  return fm;
}

if (!existsSync(SKILL_ROOT)) {
  console.error('skills/ not found; run this from the repo root.');
  process.exit(1);
}

let pluginSkills = [];
try {
  pluginSkills = JSON.parse(read(join('.claude-plugin', 'plugin.json'))).skills ?? [];
  ok('.claude-plugin/plugin.json parses');
} catch (e) {
  fail(`.claude-plugin/plugin.json: ${e.message}`);
}
try {
  JSON.parse(read(join('.claude-plugin', 'marketplace.json')));
  ok('.claude-plugin/marketplace.json parses');
} catch (e) {
  fail(`.claude-plugin/marketplace.json: ${e.message}`);
}

const topReadme = read('README.md');

const buckets = readdirSync(SKILL_ROOT, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

let skillCount = 0;

for (const bucket of buckets) {
  if (!PROMOTED.has(bucket) && !NON_PROMOTED.has(bucket)) {
    warn(`unknown bucket 'skills/${bucket}': treat as non-promoted until it is added to AGENTS.md`);
  }

  const bucketDir = join(SKILL_ROOT, bucket);
  let bucketReadme = null;
  if (PROMOTED.has(bucket)) {
    const p = join(bucketDir, 'README.md');
    if (existsSync(p)) bucketReadme = readFileSync(p, 'utf8').replace(/^\uFEFF/, '');
    else fail(`skills/${bucket}/README.md missing (required for promoted buckets)`);
  }

  const skills = readdirSync(bucketDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  for (const name of skills) {
    skillCount++;
    const rel = `skills/${bucket}/${name}`;
    console.log(`\n${bucket}/${name}`);

    const skillMd = join(REPO, rel, 'SKILL.md');
    if (!existsSync(skillMd)) {
      fail(`${rel}: no SKILL.md`);
      continue;
    }

    const fm = parseFrontmatter(readFileSync(skillMd, 'utf8').replace(/^\uFEFF/, ''));
    if (!fm) {
      fail(`${rel}/SKILL.md: no YAML frontmatter`);
      continue;
    }

    if (fm.name === name && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(fm.name)) {
      ok(`SKILL.md frontmatter: name '${name}' matches folder`);
    } else {
      fail(`${rel}/SKILL.md: frontmatter name '${fm.name}' must match folder '${name}' (kebab-case)`);
    }

    if (fm.description && fm.description.length > 20) {
      ok('SKILL.md frontmatter: description present');
    } else {
      fail(`${rel}/SKILL.md: description missing or too short`);
    }

    const yamlPath = join(REPO, rel, 'agents', 'openai.yaml');
    if (existsSync(yamlPath)) {
      const y = readFileSync(yamlPath, 'utf8');
      if (/display_name:\s*\S/.test(y) && /short_description:\s*\S/.test(y)) {
        ok('agents/openai.yaml: display_name + short_description');
      } else {
        fail(`${rel}/agents/openai.yaml: needs display_name and short_description`);
      }
      if (fm['disable-model-invocation'] === 'true') {
        if (/allow_implicit_invocation:\s*false/.test(y)) {
          ok('user-invoked policy: allow_implicit_invocation false');
        } else {
          fail(`${rel}: disable-model-invocation is set but agents/openai.yaml lacks 'policy.allow_implicit_invocation: false'`);
        }
      }
    } else {
      fail(`${rel}/agents/openai.yaml missing (required for Codex)`);
    }

    if (PROMOTED.has(bucket)) {
      if (pluginSkills.includes(`./${rel}`)) {
        ok('listed in .claude-plugin/plugin.json');
      } else {
        fail(`${rel}: not listed in .claude-plugin/plugin.json skills[]`);
      }

      if (topReadme.includes(`${bucket}/${name}/SKILL.md`)) {
        ok('linked from top-level README.md');
      } else {
        fail(`${rel}: not linked from README.md`);
      }

      if (!bucketReadme) {
        // already failed above
      } else if (bucketReadme.includes(`${name}/SKILL.md`)) {
        ok(`linked from skills/${bucket}/README.md`);
      } else {
        fail(`${rel}: not linked from skills/${bucket}/README.md`);
      }
    }
  }
}

for (const p of pluginSkills) {
  if (!existsSync(join(REPO, p.replace(/^\.\//, ''), 'SKILL.md'))) {
    fail(`plugin.json points at '${p}' but there is no SKILL.md there`);
  }
}

console.log(
  `\n${skillCount} skill(s): ${passes} checks passed, ${failures.length} failed, ${warnings.length} warning(s).`
);
process.exit(failures.length ? 1 : 0);
