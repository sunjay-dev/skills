# Repo conventions

This is sunjay-dev's personal agent-skills repo. Every skill follows the [Agent Skills](https://skills.sh) format and works across Claude Code, Codex, OpenCode, and other compatible harnesses. The `foreman/` bucket is the exception in runtime terms: its standing orders need a T3 Code-style runtime (agent threads, schedules, worktrees, PR watches) plus [mattpocock/skills](https://github.com/mattpocock/skills) in the target repo for the worker flows.

## Layout

Skills live in buckets under `skills/`:

- `foreman/`: the 24/7 worker-pool standing orders for T3 Code (real worker sessions, GitHub-only coordination, PR-only flow; workers run mattpocock/skills flows)
- `engineering/`: daily code work (create when needed)
- `productivity/`: general workflow tools (create when needed)
- `misc/`: kept around but rarely used, not promoted
- `in-progress/`: beta skills, public on purpose, feedback wanted
- `deprecated/`: no longer used

**Promoted buckets** (`foreman/`, `engineering/`, `productivity/`) appear in the top-level `README.md` and in `.claude-plugin/plugin.json`'s `skills` array. Non-promoted buckets (`misc/`, `in-progress/`, `deprecated/`) must not appear in either.

## Anatomy of a skill

```
skills/<bucket>/<skill-name>/
  SKILL.md            # required: YAML frontmatter + the instructions
  agents/openai.yaml  # required: Codex-facing display name + short description
  *.md                # optional: reference files linked from SKILL.md
  scripts/            # optional: helper scripts the skill may run
```

`SKILL.md` frontmatter:

- `name`: must match the folder name, kebab-case.
- `description`: one sentence, third person, phrased around the triggers you want (for model-invoked skills, this is what the agent matches against).
- `disable-model-invocation: true`: add for user-invoked skills, i.e. ones the human types and the agent must never fire on its own. Both foreman skills are user-invoked.

`agents/openai.yaml` carries the display metadata for Codex, and for user-invoked skills also:

```yaml
policy:
  allow_implicit_invocation: false
```

## Checklist when adding a skill

1. `mkdir -p skills/<bucket>/<skill-name>/agents`
2. Write `SKILL.md` (name matches folder) and `agents/openai.yaml`
3. Add the skill, linked to its `SKILL.md`, to the top-level `README.md` and the bucket's `README.md`
4. Add its path to `.claude-plugin/plugin.json`'s `skills` array (promoted buckets only)
5. Run `node scripts/validate-skills.mjs`

## Style

- Write for agents: short sections, imperative voice, concrete steps.
- Keep skills small and composable; boring beats clever.
- Launch lines and tool names go in the skill, not in chat.
