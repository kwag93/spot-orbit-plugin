---
description: Check Orbit instance version and connection status
argument-hint: ""
---

Check the Orbit instance version.

1. Use the plugin config created by `spot-orbit-plugin setup` (or `./install.sh setup` from a local clone)
2. Execute:
```bash
curl -sk "https://${HOSTNAME}/api/v0/version" | python3 -m json.tool
```
3. Display the version info and compare with plugin's target version (v4.1.1) and official docs version (v5.0.0)
4. If connection fails, suggest re-running setup, checking hostname, token, and network connectivity
