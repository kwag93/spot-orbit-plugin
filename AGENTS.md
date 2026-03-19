# spot-orbit-plugin — Agent Guide

> This file is for LLMs. It describes how to use this plugin's capabilities.

## Plugin Overview

This plugin connects Claude Code to Boston Dynamics Orbit API for robot fleet management, SPX extension development, and Spot SDK exploration.

## When To Use This Plugin

- User mentions: Orbit, Spot, Boston Dynamics, SPX, bosdyn, robot fleet, mission scheduling
- User is working with: docker-compose for Orbit extensions, Orbit REST API, Spot SDK
- User needs: API exploration, SPX packaging, certificate setup, robot management

## Available Skills

| Skill | Trigger Keywords | What It Does |
| --- | --- | --- |
| `orbit-api` | "orbit api", "orbit endpoint", "call robots", "api explorer" | Call live Orbit API, list endpoints, compare DTO models |
| `spx-build` | "spx", "extension build", "spx package", "orbit extension" | Scaffold, validate, build SPX extension packages |
| `spot-explore` | "spot sdk", "bosdyn", "spot example", "sdk pattern" | Search SDK docs, find examples, explain code patterns |
| `cert-setup` | "cert", "certificate", "ssl", "https", "tls" | Generate Root CA and server certificates for Orbit HTTPS |

## Available Commands (Quick Actions)

| Command | When To Use |
| --- | --- |
| `/spot-orbit:version` | User asks "what version is Orbit?" or needs connection check |
| `/spot-orbit:status` | User asks "is Orbit connected?" or "show robots" |
| `/spot-orbit:validate` | User asks "is my SPX valid?" or before SPX build |

## Available Agents

| Agent | Model | When To Launch |
| --- | --- | --- |
| `orbit-explorer` | sonnet | Deep API investigation, tracing data flows, DTO comparison |
| `spx-architect` | sonnet | Complex SPX design, multi-service docker-compose, platform decisions |
| `spot-sdk-guide` | haiku | Quick SDK doc lookups, example searches, version info |

## MCP Server Tools (17 total)

The MCP server (`orbit-api`) provides direct Orbit API access. Configure via `config.toml` or env vars.

### Read Tools (safe, no confirmation needed)
`orbit_get_version`, `orbit_get_robots`, `orbit_get_runs`, `orbit_get_run_events`, `orbit_get_anomalies`, `orbit_get_site_walks`, `orbit_get_calendar`, `orbit_get_webhooks`, `orbit_get_system_time`, `orbit_api_call`

### Write Tools (ALWAYS confirm with user before calling)
`orbit_create_webhook`, `orbit_delete_webhook`, `orbit_update_anomaly`, `orbit_create_calendar_event`, `orbit_delete_calendar_event`, `orbit_add_robot`, `orbit_remove_robot`

## Hooks (Automatic)

- **PreToolUse on Bash**: SPX validation runs automatically when `build_spx.sh`, `build_extension.sh`, or `tar *.spx` is detected
- **PreToolUse on Bash**: Orbit config check runs automatically when `curl */api/v0/*` is detected

## Documentation Map

When answering questions, reference these docs:

| Topic | Document |
| --- | --- |
| Orbit API endpoints & Client methods | `docs/orbit-api-reference.md` |
| Live Swagger spec (v4.1.1, 43 endpoints) | `docs/orbit-v4.1.1-live-api-spec.md` |
| v5.0.0 OpenAPI spec | `docs/orbit-v5-swagger-spec.md` |
| Version differences (v4 vs v5) | `docs/version-diff-v4-vs-v5.md` |
| Authentication (Token + Cookie) | `docs/orbit-auth-guide.md` |
| SPX package structure & build | `docs/spx-extension-guide.md` |
| SPX build scripts usage | `docs/spx-build-usage.md` |
| SPX template system | `docs/spx-template-guide.md` |
| SDK examples (11 official) | `docs/spot-sdk-examples.md` |
| Hardware integration (USB/BT) | `docs/hardware-integration.md` |
| Certificate generation | `docs/cert-setup-guide.md` |
| Troubleshooting | `docs/troubleshooting.md` |
| BD support articles | `docs/bd-support-articles.md` |
| Orbit agent roles | `docs/orbit-agent-roles.md` |

## Constraints

- **NEVER expose API tokens** in output or logs
- **ALWAYS confirm** before using write MCP tools (create/delete/update)
- **Warn about version differences** when user's Orbit version differs from docs
- **Use config.toml or env vars** for credentials — never hardcode
- **SSL verification** is disabled by default for dev; recommend enabling for production
- **SPX naming**: no underscores, no parentheses, no spaces in extension names

## Orbit API Quick Reference

- Base URL: `https://{hostname}/api/v0/`
- Auth: `Authorization: Bearer {token}`
- Version check (no auth): `GET /api/v0/version`
- All endpoints use JSON request/response
- SSL: self-signed certs common, use `verify=False` for dev
