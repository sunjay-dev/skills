#!/usr/bin/env bash
set -euo pipefail

# Dev-only helper for this repo (macOS/Linux).
# Links every skill into the local skill directories used by each agent harness:
#   - ~/.claude/skills   (Claude Code)
#   - ~/.agents/skills   (Codex, OpenCode, other Agent Skills harnesses)
# Each entry is a symlink into this repo, so a `git pull` keeps every installed
# skill current. Re-run after adding, removing, or renaming a skill.
# `deprecated/` and `misc/` buckets are skipped on purpose.

REPO="$(cd "$(dirname "$0")/.." && pwd)"
DESTS=("$HOME/.claude/skills" "$HOME/.agents/skills")

names=()
srcs=()
while IFS= read -r -d '' skill_md; do
  src="$(dirname "$skill_md")"
  names+=("$(basename "$src")")
  srcs+=("$src")
done < <(find "$REPO/skills" -name SKILL.md -not -path '*/node_modules/*' -not -path '*/deprecated/*' -not -path '*/misc/*' -print0)

for DEST in "${DESTS[@]}"; do
  # If $DEST is itself a symlink into this repo, per-skill symlinks would be
  # written back into the repo's own skills/ tree. Detect and bail instead.
  if [ -L "$DEST" ]; then
    resolved="$(readlink -f "$DEST")"
    case "$resolved" in
      "$REPO"|"$REPO"/*)
        echo "error: $DEST is a symlink into this repo ($resolved)." >&2
        echo "Remove it (rm \"$DEST\") and re-run; the script will recreate it as a real dir." >&2
        exit 1
        ;;
    esac
  fi

  mkdir -p "$DEST"

  for i in "${!names[@]}"; do
    name="${names[$i]}"
    src="${srcs[$i]}"
    target="$DEST/$name"

    if [ -e "$target" ] && [ ! -L "$target" ]; then
      rm -rf "$target"
    fi

    ln -sfn "$src" "$target"
    echo "linked $name -> $src ($DEST)"
  done
done

echo "done: ${#names[@]} skill(s) linked into ${#DESTS[@]} directories"
