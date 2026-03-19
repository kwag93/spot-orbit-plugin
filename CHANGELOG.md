# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] — 2026-03-19

### Added

- **Skills** (5): orbit-api, spx-build, spot-explore, cert-setup, spot-troubleshoot
- **Commands** (3): version, status, validate
- **Agents** (3): orbit-explorer, spx-architect, spot-sdk-guide
- **Hooks**: PreToolUse SPX validation and Orbit API config check
- **MCP Server**: 17 tools (10 read + 7 write) for Orbit REST API
  - Read: version, robots, runs, run_events, anomalies, site_walks, calendar, webhooks, system_time, custom endpoint
  - Write: create/delete webhook, update anomaly, create/delete calendar event, add/remove robot
- **Documentation** (32 articles):
  - Orbit API reference (v4.1.1 live spec, 43 endpoints)
  - Orbit v5.0.0 Swagger spec and version diff (v4 vs v5)
  - Authentication guide (Token + Cookie workflows)
  - SPX extension guide, template system, and build scripts
  - Spot hardware reference (sensors, arm, CAM, payloads, acoustic, MPU5, RL kit)
  - Hardware maintenance (battery swap, hip/leg replacement, dock setup)
  - Operations guide, admin reference, firewall rules
  - Inspection types and data capture
  - Core I/O, Site Hub, certificate setup
  - Troubleshooting guides and BD support article summaries
  - Spot SDK example mapping
  - Release notes
- **MCP closed-loop diagnostics**: spot-troubleshoot with 5-category diagnosis (network, mission, boot, extension, general)
- **Interactive setup wizard**: config.toml generation, MCP registration, hook installation
- **Multi-language README**: English, Korean, Japanese, Chinese
- **Platform support**: macOS, Linux, WSL
- **KB reference validation**: `scripts/validate-references.sh`

### Tested

- Orbit v4.1.1 (physical instance)
- Orbit v5.1.3 (physical instance)
- API version difference detection between v4 and v5
- SPX hook validation (underscore names, reserved ports, healthcheck warnings)
