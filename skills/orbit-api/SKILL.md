---
name: orbit-api
description: Explore Orbit REST API, call live instances, verify endpoints. Activates on "orbit api", "orbit endpoint", "orbit call", "api explorer".
argument-hint: "[list|call <endpoint>|search <keyword>|explain <endpoint>|live <endpoint>]"
---

# Orbit API Explorer

Command for exploring the Boston Dynamics Orbit REST API (v4.1.x).

<!-- LLM Context -->
<!-- Use_When: User asks about Orbit API endpoints, wants to call live Orbit instance, needs to compare API responses with DTOs, or searches for endpoint documentation -->
<!-- Do_Not_Use: General Python/Docker questions unrelated to Orbit, Spot SDK questions (use spot-explore instead), SPX build questions (use spx-build instead) -->
<!-- Requires: config.toml created by spot-orbit-plugin setup (or ./install.sh setup from a local clone) -->
<!-- References: docs/orbit-api-reference.md, docs/orbit-v4.1.1-live-api-spec.md, docs/orbit-auth-guide.md, docs/orbit-operations-guide.md, docs/site-hub-guide.md, docs/spot-sdk-examples.md -->
<!-- Launches: orbit-explorer agent for deep investigation -->

## Usage

```text
/orbit-api                          # Interactive mode
/orbit-api list                     # List key endpoints
/orbit-api call robots              # Live API call
/orbit-api search calendar          # Keyword search
/orbit-api explain anomalies        # Detailed explanation + code mapping
/orbit-api live run_events          # Live data + DTO comparison
```

## Execution

### Argument Parsing
Extract subcommand from `$ARGUMENTS`. If empty, prompt interactively.

### Config Loading

- Prefer the plugin's configured `config.toml`
- If config is missing, tell the user to run `spot-orbit-plugin setup`
- For a local clone workflow, suggest `./install.sh setup`

### `list` — List Endpoints

Read `docs/orbit-api-reference.md` and `docs/orbit-v4.1.1-live-api-spec.md` to output an endpoint table.

### `call <endpoint>` — Direct API Call

```bash
curl -sk -H "Authorization: Bearer $TOKEN" "https://$HOSTNAME/api/v0/$ENDPOINT" | python3 -m json.tool
```

POST/PATCH/DELETE require user confirmation. Truncate large responses.

### `search <keyword>` — Search

1. Grep keyword across `docs/` directory
2. Search orbit-agent code for usage
3. Compile and display results

### `explain <endpoint>` — Detailed Explanation

1. Extract endpoint section from API reference
2. Show Client method signatures
3. Explain orbit-agent usage code + patterns
4. Include live data sample when possible

### `live <endpoint>` — Live Data + DTO Mapping

1. Fetch sample data via API call
2. Compare with DTO fields in `orbit-model/src/orbit_model/dtos.py`
3. Analyze differences (missing/extra fields)

## Documentation References

- `docs/orbit-api-reference.md` — Full Client method reference
- `docs/orbit-v4.1.1-live-api-spec.md` — Live instance Swagger spec (43 endpoints)
- `docs/spot-sdk-examples.md` — Official example mappings

## Sub-Agents

For complex exploration, launch the `orbit-explorer` agent:
```
"Launch orbit-explorer agent to trace how run_events data flows through the poller pipeline"
```

Task: $ARGUMENTS
