---
description: Validate an SPX extension package (manifest, docker-compose, images)
argument-hint: "[extension-dir]"
---

Validate the SPX extension package at the given directory (default: `./extension/`).

Target directory: @$1 (or `./extension/` if not specified)

Run the full validation checklist:

1. **manifest.json** — Check required fields exist (description, version, images)
2. **Extension name** — No underscores (BD known issue: extensions with underscores won't run)
3. **Extension name** — No parentheses or spaces (known bug: can't delete from Orbit)
4. **docker-compose.yml** — Port range 21000-22000 (excluding reserved 21443)
5. **docker-compose.yml** — healthcheck configured (recommended for proper status reporting)
6. **docker-compose.yml** — restart policy set
7. **Docker images** — .tgz or .tar files present
8. **Platform** — Image architecture matches target (linux/amd64 for SiteHub, linux/arm64 for CORE I/O)
9. **Icon** — icon.png or icon.jpeg present (recommended)
10. **File naming** — SPX filename uses only alphanumeric and hyphens

Output a validation report with pass/fail/warning for each check.

Reference: `docs/spx-extension-guide.md` and `docs/troubleshooting.md`
