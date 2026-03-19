---
description: Show Orbit connection status, registered robots, and system time
argument-hint: ""
---

Show the current Orbit instance status overview.

1. Use the plugin config created by `spot-orbit-plugin setup` (or `./install.sh setup` from a local clone)
2. Check connection:
```bash
curl -sk -H "Authorization: Bearer ${TOKEN}" "https://${HOSTNAME}/api/v0/version"
```
3. Get robot list:
```bash
curl -sk -H "Authorization: Bearer ${TOKEN}" "https://${HOSTNAME}/api/v0/robots" | python3 -m json.tool
```
4. Get system time:
```bash
curl -sk -H "Authorization: Bearer ${TOKEN}" "https://${HOSTNAME}/api/v0/settings/system-time" | python3 -m json.tool
```
5. Display a summary table:
   - Connection: OK/FAIL
   - Orbit Version: x.y.z
   - Robots: count and hostnames
   - System Time: current time and timezone
   - API Token: configured/missing
   - Config status: verified/unverified
