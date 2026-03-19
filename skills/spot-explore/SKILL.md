---
name: spot-explore
description: Explore Spot SDK docs/examples, search bosdyn-orbit patterns, support orbit-agent development. Activates on "spot sdk", "bosdyn", "spot example", "sdk guide".
argument-hint: "[sdk <topic>|example <name>|pattern <name>|version]"
---

# Spot SDK Explorer

Command for exploring Boston Dynamics Spot SDK documentation, examples, and patterns.

<!-- LLM Context -->
<!-- Use_When: User asks about Spot SDK, bosdyn-orbit package, official examples, or internal code patterns like poller/processor/strategy -->
<!-- Do_Not_Use: Live Orbit API calls (use orbit-api), SPX packaging (use spx-build), certificate management (use cert-setup) -->
<!-- References: docs/spot-sdk-examples.md, docs/orbit-agent-roles.md, docs/version-diff-v4-vs-v5.md, docs/spot-hardware-reference.md, docs/core-io-guide.md, docs/spot-operations-reference.md, docs/spot-release-notes.md, docs/spot-product-comparison.md, docs/spot-arm-reference.md, docs/spot-rl-researcher-kit-reference.md -->
<!-- Launches: spot-sdk-guide agent (haiku) for fast doc lookups -->
<!-- Note: v4.0.0 renamed bosdyn-scout → bosdyn-orbit. Warn users about deprecated package -->

## Usage

```text
/spot-explore                       # Interactive mode
/spot-explore sdk webhooks          # Search SDK docs by topic
/spot-explore example anomalies     # Look up spot-sdk example code
/spot-explore pattern poller        # Explain orbit-agent pattern
/spot-explore version               # SDK/Orbit version info
```

## Execution

### `sdk <topic>` — SDK Documentation Search

1. Search local `docs/` directory
2. Web search: `"Boston Dynamics Spot SDK $TOPIC site:dev.bostondynamics.com"`
3. Always warn if there are differences between v4.1.1 and v5.x

### `example <name>` — Example Lookup

Find the example in `docs/spot-sdk-examples.md` and explain it.
For detailed code, fetch from GitHub raw:
```
https://raw.githubusercontent.com/boston-dynamics/spot-sdk/master/python/examples/orbit/$NAME/$NAME.py
```

### `pattern <name>` — orbit-agent Patterns

| Pattern | File | Description |
|---------|------|-------------|
| poller | `poller/poller.py` | Periodic Orbit API polling |
| processor | `poller/processors/` | Per-endpoint data transformation |
| strategy | `pusher/strategy_factory.py` | Push strategy factory |
| singleton | `services/implementations/` | OrbitClientService etc. |
| hmac | `agent/auth_manager.py` | HMAC signature authentication |
| schedule | `background_schedule_manager.py` | Time-limited scheduling |
| autopilot | `mqtt/autopilot_client.py` | MQTT autonomous navigation |
| cursor | `poller/processors/base_processor.py` | Incremental polling |

Read the relevant file and explain the pattern in detail.

### `version` — Version Info

Prefer the MCP tool for live version check:
1. Call `orbit_get_version` MCP tool (if Orbit MCP server connected)
2. Fallback: `curl -sk https://$HOSTNAME/api/v0/version | python3 -m json.tool`

Output SDK version comparison table with `docs/version-diff-v4-vs-v5.md` context.

## Sub-Agents

Launch `spot-sdk-guide` agent for deep exploration:
```
"Launch spot-sdk-guide to find all GraphNav related APIs and how they interact with missions"
```

Task: $ARGUMENTS
