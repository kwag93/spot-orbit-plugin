#!/usr/bin/env bash
# SPX Pre-Build Validation Hook
# Triggered on Bash PreToolUse — checks if the command is SPX-related,
# then validates manifest.json, docker-compose.yml, and naming rules.
#
# Hook receives tool input as JSON on stdin.
# Only activates for SPX build/package commands; silently passes otherwise.

set -euo pipefail

# Read hook input from stdin
INPUT=$(cat)

# Check if this is an SPX-related command
COMMAND=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_input',{}).get('command',''))" 2>/dev/null || echo "")

# Only validate for SPX-related commands
if ! echo "$COMMAND" | grep -qE 'build_spx\.sh|build_extension\.sh|tar.*\.spx|\.spx'; then
  exit 0  # Not SPX-related, allow
fi

# Find extension directory
EXT_DIR=""
for dir in extension ext .; do
  if [[ -f "${dir}/manifest.json" ]]; then
    EXT_DIR="$dir"
    break
  fi
done

if [[ -z "$EXT_DIR" ]]; then
  exit 0  # No extension dir found, allow
fi

ERRORS=()
WARNINGS=()

# 1. Validate manifest.json
if [[ -f "${EXT_DIR}/manifest.json" ]]; then
  if ! python3 -c "
import json, sys
m = json.load(open('${EXT_DIR}/manifest.json'))
required = ['description', 'version', 'images']
alt_required = ['ExtensionName', 'Version', 'Images']
if not all(k in m for k in required) and not all(k in m for k in alt_required):
    sys.exit(1)
" 2>/dev/null; then
    ERRORS+=("manifest.json: Missing required fields (description, version, images)")
  fi

  # Check for underscore in extension name
  EXT_NAME=$(python3 -c "
import json
m = json.load(open('${EXT_DIR}/manifest.json'))
print(m.get('description', m.get('ExtensionName', '')))
" 2>/dev/null || echo "")
  if [[ "$EXT_NAME" == *"_"* ]]; then
    ERRORS+=("Extension name '${EXT_NAME}' contains underscores — will NOT run on Orbit")
  fi
fi

# 2. Validate docker-compose.yml
if [[ -f "${EXT_DIR}/docker-compose.yml" ]]; then
  if grep -qE '21443' "${EXT_DIR}/docker-compose.yml"; then
    ERRORS+=("docker-compose.yml: Port 21443 is reserved (CORE I/O only)")
  fi
  if ! grep -q 'healthcheck' "${EXT_DIR}/docker-compose.yml"; then
    WARNINGS+=("docker-compose.yml: No healthcheck — upload 'success' won't guarantee service is running")
  fi
fi

# Output results as JSON for hook system
if [[ ${#ERRORS[@]} -gt 0 ]]; then
  MSG="SPX Validation ERRORS:\\n"
  for err in "${ERRORS[@]}"; do MSG+="  - $err\\n"; done
  echo "{\"hookSpecificOutput\":{\"permissionDecision\":\"deny\"},\"systemMessage\":\"$MSG\"}"
  exit 1
fi

if [[ ${#WARNINGS[@]} -gt 0 ]]; then
  MSG="SPX Validation WARNINGS:\\n"
  for warn in "${WARNINGS[@]}"; do MSG+="  - $warn\\n"; done
  echo "{\"hookSpecificOutput\":{\"permissionDecision\":\"allow\"},\"systemMessage\":\"$MSG\"}"
fi

exit 0
