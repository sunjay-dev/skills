# Contributing

This is my personal agent-skills repo, so day-to-day it's mostly me in here — but issues, suggestions, and fixes are welcome.

## Repo layout

```
skills/
  foreman/        # the current bucket (see README.md)
  ...             # more buckets as the collection grows: engineering/, productivity/, misc/, in-progress/, deprecated/
scripts/          # dev tooling: link-skills, validate-skills, sync-plugin-version
.changeset/       # pending changes; applied by the release flow
.claude-plugin/   # Claude Code plugin + marketplace manifests
.github/          # check + release workflows
```

Conventions for adding a skill live in [AGENTS.md](./AGENTS.md): frontmatter and metadata rules, promoted vs non-promoted buckets, and the step-by-step checklist.

## Checks

Sanity-check the repo any time with:

```sh
pnpm install
pnpm run validate
pnpm run check-plugin-version
```

CI runs the same checks on every push and pull request.

## Releases

Releases are versioned with changesets: add one for every meaningful change (`pnpm changeset`); `pnpm run version` applies them, updates [CHANGELOG.md](./CHANGELOG.md), and syncs the plugin manifest. On `main`, the Release workflow turns pending changesets into a "Version Packages" PR; merging it tags the release.
