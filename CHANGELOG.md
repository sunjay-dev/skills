# Changelog

## 0.1.1

### Patch Changes

- [`f45cf82`](https://github.com/sunjay-dev/skills/commit/f45cf8216384379d029a9760de808dc7170cc78e) Thanks [@sunjay-dev](https://github.com/sunjay-dev)! - Switch the repo from npm to pnpm: `pnpm-lock.yaml` replaces `package-lock.json`, and the check and release workflows now install with `pnpm install --frozen-lockfile`.

## 0.1.0

Initial release.

- `skills/foreman/`: the foreman pool standing orders (`foreman-pool-a`, `foreman-pool-b`) for T3 Code, built on top of `mattpocock/skills` flows.
- Plugin and marketplace manifests, install scripts (`link-skills`), and the repo validator.
- Release tooling: changesets, plugin version sync, and the release workflow.
