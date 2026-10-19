#!/usr/bin/env pwsh
# Dev-only helper for this repo on Windows.
# Links every skill into the local skill directories used by each agent harness:
#   - $HOME\.claude\skills   (Claude Code)
#   - $HOME\.agents\skills   (Codex, OpenCode, other Agent Skills harnesses)
# Directory junctions are used (no admin rights needed), so a `git pull` in
# this repo keeps every installed skill current. Re-run after adding,
# removing, or renaming a skill. `deprecated\` and `misc\` buckets are skipped.
# Adapted from mattpocock/skills (MIT License, Copyright (c) Matt Pocock).

$ErrorActionPreference = 'Stop'

$Repo  = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$Dests = @((Join-Path $HOME '.claude\skills'), (Join-Path $HOME '.agents\skills'))

$Skills = @(
  Get-ChildItem (Join-Path $Repo 'skills') -Recurse -Filter SKILL.md -File |
    Where-Object { $_.FullName -notmatch '\\(node_modules|deprecated|misc)\\' } |
    ForEach-Object { $_.Directory.FullName }
)

foreach ($Dest in $Dests) {
  # If $Dest itself links into this repo, per-skill junctions would be written
  # back into the repo's own skills/ tree. Detect and bail instead.
  $existing = Get-Item -Force -ErrorAction SilentlyContinue $Dest
  if ($existing -and $existing.LinkType) {
    foreach ($t in @($existing.Target)) {
      if ("$t" -like "$Repo*") {
        throw "$Dest is a link into this repo ($t). Remove it, then re-run so the script recreates it as a real directory."
      }
    }
  }

  New-Item -ItemType Directory -Force -Path $Dest | Out-Null

  foreach ($Src in $Skills) {
    $Name   = Split-Path $Src -Leaf
    $Target = Join-Path $Dest $Name

    $item = Get-Item -Force -ErrorAction SilentlyContinue $Target
    if ($item) {
      if ($item.LinkType) { $item.Delete() } else { Remove-Item $Target -Recurse -Force }
    }

    New-Item -ItemType Junction -Path $Target -Target $Src | Out-Null
    Write-Host "linked $Name -> $Src ($Dest)"
  }
}

Write-Host "done: $($Skills.Count) skill(s) linked into $($Dests.Count) directories"
