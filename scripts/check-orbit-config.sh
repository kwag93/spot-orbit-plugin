#!/usr/bin/env bash
# Orbit API Configuration Check Hook
# Triggered on Bash PreToolUse — checks if the command is an Orbit API call,
# then verifies hostname and token are configured.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
PLUGIN_CONFIG="${PLUGIN_ROOT}/config.toml"

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_input',{}).get('command',''))" 2>/dev/null || echo "")

# Only check for Orbit API calls
if ! echo "$COMMAND" | grep -qE 'curl.*api/v0|orbit_get_|orbit_api_call'; then
  exit 0
fi

# Check config.toml or env vars
HOSTNAME="${ORBIT_HOSTNAME:-}"
TOKEN="${ORBIT_API_TOKEN:-}"

if [[ -n "$HOSTNAME" && -n "$TOKEN" ]]; then
  exit 0
fi

python3 - "$PLUGIN_CONFIG" <<'PY' 2>/dev/null
import json
import sys
from pathlib import Path

config_path = Path(sys.argv[1])
try:
    try:
        import tomllib
    except ImportError:
        import tomli as tomllib

    with config_path.open('rb') as f:
        config = tomllib.load(f)

    orbit = config.get('orbit', {})
    hostname = orbit.get('hostname', '')
    token = orbit.get('api_token', '')
    if hostname and token:
        sys.exit(0)
except Exception:
    pass

message = (
    "Orbit API config missing. Run 'spot-orbit-plugin setup' "
    "(or './install.sh setup' from the repo clone) to create config.toml."
)
print(json.dumps({
    "hookSpecificOutput": {"permissionDecision": "allow"},
    "systemMessage": message,
}))
PY

exit 0
