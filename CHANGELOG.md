# Changelog

## 0.3.0

### Minor Changes

- [`268b1fe`](https://github.com/sunjay-dev/skills/commit/268b1fedc418f184bf93ed855b9f371a7202edbb) Thanks [@sunjay-dev](https://github.com/sunjay-dev)! - Merged `foreman-prime` and `foreman-peer` into a single `foreman` skill: the launch line's role token now picks the role (prime / peer-<n>), and pool state lives in `.foreman/`.

## 0.2.0

### Minor Changes

- [`51781ce`](https://github.com/sunjay-dev/skills/commit/51781ced335b85ad19ada62f3541b2b2b6f1c1e6) Thanks [@sunjay-dev](https://github.com/sunjay-dev)! - Rename the foreman pools into roles: `foreman-pool-a` → `foreman-prime` (the pool that owns the shared duties) and `foreman-pool-b` → `foreman-peer` — now generic: spin up any number of peers, each with an instance id (e.g. `peer-1`) used in the GitHub claim tags.

## 0.1.1

### Patch Changes

- [`f45cf82`](https://github.com/sunjay-dev/skills/commit/f45cf8216384379d029a9760de808dc7170cc78e) Thanks [@sunjay-dev](https://github.com/sunjay-dev)! - Switch the repo from npm to pnpm: `pnpm-lock.yaml` replaces `package-lock.json`, and the check and release workflows now install with `pnpm install --frozen-lockfile`.

## 0.1.0

Initial release.

- `skills/foreman/`: the foreman pool standing orders (`foreman-pool-a`, `foreman-pool-b`) for T3 Code, built on top of `mattpocock/skills` flows.
- Plugin and marketplace manifests, install scripts (`link-skills`), and the repo validator.
- Release tooling: changesets, plugin version sync, and the release workflow.
