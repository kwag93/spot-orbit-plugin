# spot-orbit-plugin

> Claude Code plugin for Boston Dynamics Orbit API work, SPX packaging, Spot SDK exploration, and certificate setup.

**Language**: [한국어](README.ko.md) | [日本語](README.ja.md) | [中文](README.zh.md)

---

## Overview

This plugin bundles the Orbit workflows that are usually scattered across browser docs, SDK examples, and local scripts:

- Orbit REST API exploration
- SPX extension validation/build guidance
- Spot SDK example lookup
- Certificate setup guidance for Orbit web integrations
- An MCP server for live Orbit API access
- PreToolUse hooks for SPX validation and Orbit config checks

It is designed around Orbit **v4.1.x** usage while also shipping reference material for newer **v5.x** docs so version differences can be explained clearly.

---

## Install

### GitHub

```bash
claude plugin add github:kwag93/spot-orbit-plugin
```

### Local clone

```bash
git clone https://github.com/kwag93/spot-orbit-plugin.git
cd spot-orbit-plugin
./install.sh
```

After installation, start a **new Claude Code session**.

---

## Setup

Preferred setup command after install:

```bash
spot-orbit-plugin setup
```

If you are working from a local clone, you can run:

```bash
./install.sh setup
```

The setup wizard will:

1. Save your Orbit hostname and API token to `config.toml`
2. Ask whether `verify_ssl` should be enabled
3. Ask whether Orbit write tools should be enabled
4. Register the `orbit-api` MCP server
5. Optionally merge the plugin hooks into `settings.json`

### Setup notes

- `verify_ssl = false` is usually correct for self-signed Orbit development instances
- `verify_ssl = true` is recommended for production with valid certificates
- `enable_write_tools = false` is the safe default
- Write tools require both:
  - `enable_write_tools = true` in `config.toml`
  - explicit user confirmation before the tool is called
- The setup wizard manages `settings.json` and `.mcp.json` for you; manual editing is usually unnecessary

---

## Check status / manage install

```bash
spot-orbit-plugin status
spot-orbit-plugin doctor
```

Local clone wrapper:

```bash
./install.sh status
./install.sh doctor
./install.sh uninstall
```

---

## Skills

### `/orbit-api`

Explore Orbit REST API endpoints, inspect live responses, and explain v4.1.x vs v5.x differences.

```text
/orbit-api list
/orbit-api call robots
/orbit-api search calendar
/orbit-api explain anomalies
/orbit-api live run_events
```

### `/spx-build`

Validate, scaffold, and guide SPX extension packaging workflows.

```text
/spx-build init my-sensor
/spx-build validate ./extension
/spx-build build dev_54
/spx-build guide
```

### `/spot-explore`

Search Spot SDK examples, SDK docs, and Orbit-related patterns.

```text
/spot-explore sdk webhooks
/spot-explore example anomalies
/spot-explore pattern poller
/spot-explore version
```

### `/cert-setup`

Generate or explain certificate material for HTTPS-based Orbit integrations.

```text
/cert-setup ca my-org
/cert-setup server my-org
/cert-setup guide
```

### `/spot-troubleshoot`

Diagnose Spot/Orbit connection, mission, hardware, and extension issues with MCP-powered closed-loop diagnostics.

```text
/spot-troubleshoot                     # Interactive diagnosis
/spot-troubleshoot network             # Network/connectivity issues
/spot-troubleshoot mission             # Mission execution failures
/spot-troubleshoot boot                # Spot boot failures
/spot-troubleshoot extension           # SPX extension problems
/spot-troubleshoot general             # Other issues
```

---

## Commands

| Command | Purpose |
| --- | --- |
| `/spot-orbit:version` | Check Orbit version and basic connectivity |
| `/spot-orbit:status` | Show plugin/config/MCP/hook status |
| `/spot-orbit:validate [dir]` | Validate an SPX package directory |

---

## MCP server

The bundled MCP server exposes Orbit API tools directly inside Claude Code.

### Read tools

- `orbit_get_version`
- `orbit_get_robots`
- `orbit_get_runs`
- `orbit_get_run_events`
- `orbit_get_anomalies`
- `orbit_get_site_walks`
- `orbit_get_calendar`
- `orbit_get_webhooks`
- `orbit_get_system_time`
- `orbit_api_call`

### Write tools

- `orbit_create_webhook`
- `orbit_delete_webhook`
- `orbit_update_anomaly`
- `orbit_create_calendar_event`
- `orbit_delete_calendar_event`
- `orbit_add_robot`
- `orbit_remove_robot`

Write tools are **disabled by default** and are intended only for cases where the user has explicitly approved the write action.

---

## Hooks

| Event | Trigger | Action |
| --- | --- | --- |
| PreToolUse | `build_spx.sh`, `build_extension.sh`, `tar *.spx` | Validate SPX package structure and common Orbit constraints |
| PreToolUse | `curl .../api/v0/...` | Warn when Orbit config is missing |

---

## Included documentation (32 articles)

### Orbit API & Operations

| Document | Purpose |
| --- | --- |
| `docs/orbit-api-reference.md` | Orbit API endpoints and client method mapping |
| `docs/orbit-v4.1.1-live-api-spec.md` | Live v4.1.1 Swagger-derived reference |
| `docs/orbit-v5-swagger-spec.md` | v5 reference for comparison |
| `docs/version-diff-v4-vs-v5.md` | Version differences between Orbit v4 and v5 |
| `docs/orbit-auth-guide.md` | Orbit authentication guide |
| `docs/orbit-operations-guide.md` | Orbit operations: maps, missions, inspections, data review |
| `docs/orbit-agent-roles.md` | Orbit agent roles and API mappings |

### Spot Hardware & Operations

| Document | Purpose |
| --- | --- |
| `docs/spot-hardware-reference.md` | Spot physical specs, sensors, and network topology |
| `docs/spot-hardware-maintenance-reference.md` | Battery swap, hip/leg replacement, dock setup |
| `docs/spot-arm-reference.md` | Spot Arm specs, calibration, and manipulation |
| `docs/spot-cam2-reference.md` | Spot CAM+IR specs and thermal inspection |
| `docs/spot-payload-reference.md` | Payload integration and power specs |
| `docs/spot-acoustic-sensors-reference.md` | Acoustic sensor specs and usage |
| `docs/spot-mpu5-radio-reference.md` | MPU5 mesh radio integration |
| `docs/spot-rl-researcher-kit-reference.md` | RL Researcher Kit reference |
| `docs/spot-product-comparison.md` | Spot model comparison and operating limits |
| `docs/spot-operations-reference.md` | Operational procedures and safety |
| `docs/spot-admin-reference.md` | Factory reset, software updates, diagnostics |
| `docs/spot-firewall-reference.md` | Network firewall rules for Spot/Orbit |
| `docs/spot-release-notes.md` | Spot/Orbit software release notes |
| `docs/spot-inspections-reference.md` | Inspection types and data capture |

### SPX & Extensions

| Document | Purpose |
| --- | --- |
| `docs/spx-extension-guide.md` | SPX package structure and deployment notes |
| `docs/spx-build-usage.md` | `build_spx.sh` / `build_extension.sh` usage |
| `docs/spx-template-guide.md` | SPX template guidance |
| `docs/core-io-guide.md` | Core I/O hardware, setup, extensions, and 5G/LTE |
| `docs/site-hub-guide.md` | Site Hub installation and Orbit administration |
| `docs/hardware-integration.md` | Hardware integration notes |
| `docs/cert-setup-guide.md` | Certificate setup walkthrough |

### Troubleshooting & Reference

| Document | Purpose |
| --- | --- |
| `docs/troubleshooting.md` | Common Orbit/SPX troubleshooting notes |
| `docs/spot-troubleshoot-reference.md` | Spot boot, battery, camera diagnostics |
| `docs/spot-sdk-examples.md` | Spot SDK example mapping |
| `docs/bd-support-articles.md` | Boston Dynamics support article summaries |

---

## Orbit API token

1. Open `https://<your-orbit-host>` in a browser
2. Sign in to Orbit
3. Open **Settings → Developer Features → API Access Tokens**
4. Generate a token
5. Run `spot-orbit-plugin setup` (or `./install.sh setup`) and paste the token
6. Verify with `/spot-orbit:version`

---

## Requirements

- Claude Code
- Python 3.7+ (`3.11+` recommended)
- Node.js
- Docker for SPX image/package workflows
- Access to an Orbit instance for live API usage

---

## Notes

- `config.toml` contains credentials and should never be committed
- SPX extension names must not contain underscores, spaces, or parentheses
- Use `verify_ssl = true` for production environments with valid certificates
- If you do not need write operations, keep `enable_write_tools = false`

## License

MIT
