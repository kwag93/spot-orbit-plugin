#!/usr/bin/env bash
# Spot Orbit Plugin installer / management wrapper
# Usage: ./install.sh [install|setup|status|doctor|uninstall|--help]
# Supports: macOS, Linux, WSL

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLI_SCRIPT="${SCRIPT_DIR}/bin/spot-orbit.js"

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_error() { echo -e "${RED}[✗]${NC} $1"; }
print_info() { echo -e "${BLUE}[i]${NC} $1"; }

if ! command -v node >/dev/null 2>&1; then
  print_error "Node.js is required to run this installer wrapper."
  print_info "Install Node.js, then re-run ./install.sh"
  exit 1
fi

if [[ ! -f "$CLI_SCRIPT" ]]; then
  print_error "CLI script not found: $CLI_SCRIPT"
  exit 1
fi

run_cli() {
  node "$CLI_SCRIPT" "$@"
}

case "${1:-install}" in
  install|"")
    run_cli install
    ;;
  setup|--setup|-s)
    run_cli setup
    ;;
  status|check|--check|-c)
    run_cli status
    ;;
  doctor|--doctor|-d)
    run_cli doctor
    ;;
  uninstall|remove|--uninstall|-u)
    run_cli uninstall
    ;;
  help|--help|-h)
    cat <<'HELP'
Spot Orbit Plugin installer / management wrapper

Usage:
  ./install.sh              Install plugin files into Claude Code
  ./install.sh setup        Run the interactive setup wizard
  ./install.sh status       Check installation and config status
  ./install.sh doctor       Check local dependencies
  ./install.sh uninstall    Remove installed plugin files
  ./install.sh --help       Show this help

Preferred GitHub install:
  claude plugin add github:kwag93/spot-orbit-plugin

Manual repo workflow:
  git clone https://github.com/kwag93/spot-orbit-plugin.git
  cd spot-orbit-plugin
  ./install.sh
  ./install.sh setup
HELP
    ;;
  *)
    run_cli "$@"
    ;;
esac
