#!/usr/bin/env bash
# validate-references.sh — Verify docs referenced in SKILL.md files actually exist
# Also detect orphaned docs (files in docs/ not referenced by any skill or agent)
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DOCS_DIR="$REPO_ROOT/docs"
SKILLS_DIR="$REPO_ROOT/skills"
AGENTS_DIR="$REPO_ROOT/agents"

errors=0
warnings=0

echo "=== Reference Validation ==="
echo ""

# 1. Check all References in SKILL.md files
echo "--- Checking SKILL.md references ---"
for skill_md in "$SKILLS_DIR"/*/SKILL.md; do
  skill_name=$(basename "$(dirname "$skill_md")")
  # Extract docs/ paths from References comment
  refs=$(grep -oE 'docs/[^ ,>]+\.md' "$skill_md" 2>/dev/null | sort -u || true)
  if [ -z "$refs" ]; then
    echo "  WARN: $skill_name has no References"
    warnings=$((warnings + 1))
    continue
  fi
  for ref in $refs; do
    if [ ! -f "$REPO_ROOT/$ref" ]; then
      echo "  BROKEN: $skill_name -> $ref (file not found)"
      errors=$((errors + 1))
    fi
  done
done
echo ""

# 2. Check agent doc references
echo "--- Checking agent references ---"
for agent_md in "$AGENTS_DIR"/*.md; do
  agent_name=$(basename "$agent_md" .md)
  refs=$(grep -oE 'docs/[^ ,>\`]+\.md' "$agent_md" 2>/dev/null | sort -u || true)
  for ref in $refs; do
    if [ ! -f "$REPO_ROOT/$ref" ]; then
      echo "  BROKEN: agent/$agent_name -> $ref (file not found)"
      errors=$((errors + 1))
    fi
  done
done
echo ""

# 3. Validate section anchors (§"Section Name" references in Section Routing blocks)
echo "--- Checking section anchors ---"
for skill_md in "$SKILLS_DIR"/*/SKILL.md; do
  skill_name=$(basename "$(dirname "$skill_md")")
  routing_block=$(sed -n '/Section Routing/,/-->/p' "$skill_md" 2>/dev/null || true)
  [ -z "$routing_block" ] && continue

  current_file=""
  while IFS= read -r line; do
    # Track the most recent .md file on this line
    md_file=$(echo "$line" | grep -oE '[a-zA-Z0-9_-]+\.md' | tail -1 || true)
    if [ -n "$md_file" ]; then
      case "$md_file" in
        docs/*) current_file="$md_file" ;;
        *)      current_file="docs/$md_file" ;;
      esac
    fi

    # Extract section names between §" and "
    # Use sed to put each section on its own line, then loop
    sections=$(echo "$line" | sed -n 's/[^§]*§"\([^"]*\)"/\1\n/gp' || true)
    [ -z "$sections" ] && continue
    [ -z "$current_file" ] && continue

    while IFS= read -r section; do
      [ -z "$section" ] && continue
      filepath="$REPO_ROOT/$current_file"
      if [ -f "$filepath" ]; then
        if ! grep -qF "## $section" "$filepath" 2>/dev/null; then
          echo "  BROKEN ANCHOR: $skill_name -> $current_file §\"$section\" (heading not found)"
          errors=$((errors + 1))
        fi
      else
        echo "  BROKEN ANCHOR: $skill_name -> $current_file (file not found for §\"$section\")"
        errors=$((errors + 1))
      fi
    done <<< "$sections"
  done <<< "$routing_block"
done
echo ""

# 4. Find orphaned docs (not referenced by any skill or agent)
echo "--- Orphaned docs (not referenced) ---"
orphaned=0
for doc in "$DOCS_DIR"/*.md; do
  doc_rel="docs/$(basename "$doc")"
  # Search in skills and agents
  found=$(grep -rl "$doc_rel" "$SKILLS_DIR" "$AGENTS_DIR" 2>/dev/null | head -1 || true)
  if [ -z "$found" ]; then
    echo "  ORPHAN: $doc_rel"
    orphaned=$((orphaned + 1))
    warnings=$((warnings + 1))
  fi
done
echo ""

# 5. Summary
echo "=== Summary ==="
echo "  Broken references: $errors"
echo "  Orphaned docs:     $orphaned"
echo "  Warnings:          $warnings"

if [ "$errors" -gt 0 ]; then
  exit 1
fi
exit 0
