---
name: spot-troubleshoot
description: Diagnose Spot/Orbit connection, mission, and hardware issues. Activates on "spot troubleshoot", "spot issue", "spot error", "can't connect", "mission failed".
argument-hint: "[network|mission|boot|extension|general]"
---

# Spot Troubleshoot

Diagnose and resolve common Spot and Orbit operational issues.

<!-- LLM Context -->
<!-- Use_When: User reports connection issues, mission failures, boot problems, extension errors, or asks about firewall/network configuration for Spot and Orbit -->
<!-- Do_Not_Use: SDK API questions (use spot-explore), SPX packaging (use spx-build), live API calls (use orbit-api) -->
<!-- References: docs/troubleshooting.md, docs/spot-hardware-reference.md, docs/spot-admin-reference.md, docs/core-io-guide.md, docs/site-hub-guide.md, docs/orbit-operations-guide.md, docs/spot-firewall-reference.md, docs/spot-troubleshoot-reference.md, docs/spot-operations-reference.md, docs/spot-product-comparison.md, docs/spot-release-notes.md, docs/spot-cam2-reference.md, docs/spot-payload-reference.md, docs/spot-acoustic-sensors-reference.md, docs/bd-support-articles.md, docs/spot-arm-reference.md, docs/spot-hardware-maintenance-reference.md, docs/spot-inspections-reference.md, docs/spot-mpu5-radio-reference.md -->
<!-- Launches: spot-sdk-guide agent for SDK-related diagnostics -->

<!-- Section Routing: Read ONLY the docs relevant to the subcommand to save context -->
<!--
  network  → docs/spot-firewall-reference.md, docs/core-io-guide.md, docs/spot-hardware-reference.md, docs/spot-mpu5-radio-reference.md
               docs/troubleshooting.md §"Orbit API Issues"
  mission  → docs/orbit-operations-guide.md, docs/site-hub-guide.md, docs/spot-inspections-reference.md, docs/spot-operations-reference.md
               docs/troubleshooting.md §"Schedule-Related"
  boot     → docs/spot-troubleshoot-reference.md, docs/spot-admin-reference.md, docs/spot-hardware-maintenance-reference.md
               docs/troubleshooting.md §"CORE I/O Specifics"
  extension → docs/core-io-guide.md, docs/site-hub-guide.md
               docs/troubleshooting.md §"SPX Upload FAQ (Verified with BD Support)", §"SPX Upload Failures", §"docker-compose.yml Issues", §"Extension Naming Issues (SiteHub + CORE I/O common)", §"Custom Web Views"
  general  → docs/bd-support-articles.md, docs/spot-product-comparison.md, docs/spot-release-notes.md
               + route to specific category after user describes issue
-->

## Usage

```text
/spot-troubleshoot                      # Interactive diagnosis
/spot-troubleshoot network              # Network/connectivity issues
/spot-troubleshoot mission              # Mission execution failures
/spot-troubleshoot boot                 # Spot fails to boot
/spot-troubleshoot extension            # SPX extension problems
/spot-troubleshoot general              # Other issues
```

## Execution

### Argument Parsing
Extract subcommand from `$ARGUMENTS`. If empty, ask the user to describe the issue, then route to the appropriate category.

### `network` — Connection and Network Issues

Diagnostic checklist:

1. **Reserved subnet conflict?**
   - `192.168.80.x/24` — Spot internal WiFi AP
   - `192.168.50.x/24` — Payload communication
   - `192.168.0.x/24`, `192.168.1.x/24` — Reserved internal
   - If corporate network overlaps, routing will fail

2. **Firewall ports open?**
   - `443/TCP` — Spot → Orbit (HTTPS/API)
   - `51820/UDP` — Spot → Orbit (WireGuard VPN)
   - `31000-33000/UDP` — Operator → Orbit (WebRTC video)
   - `53/UDP` — DNS resolution
   - `20022/TCP` — SSH to Core I/O

3. **WiFi mode correct?**
   - AP mode: direct tablet control (`192.168.80.3`)
   - Client mode: corporate WiFi (WPA2 Enterprise)
   - Dual mode: client + background AP fallback

4. **Bandwidth sufficient?**
   - Manual driving: > 7 Mbps
   - Autowalk missions: 0.5–2 Mbps sustained
   - Max latency: 300 ms

5. **Core I/O specific?**
   - SSH port is `20022` (not 22)
   - Admin Console at `https://<ip>:21443`
   - Network changes via `nmcli` only (not `ip`/`ifconfig`)

Reference `docs/spot-firewall-reference.md` for full firewall rules and `docs/spot-hardware-reference.md` for IP mapping.

### `mission` — Mission Execution Failures

Diagnostic checklist:

1. **Prerequisites met?**
   - Robot must be on Dock (Orbit needs Lease)
   - Timezone must be configured in Orbit
   - Admin privileges required for scheduling

2. **Mission validation passed?**
   - Orbit continuously validates missions against site map
   - Invalid routes, missing waypoints, or disconnected edges cause failures

3. **Weather gating active?**
   - Check if "Avoid Precipitation" is enabled
   - Weather Settings: city, max precipitation threshold (up to 5mm)
   - Snooze feature can override weather checks

4. **Schedule conflict?**
   - Orbit auto-detects conflicts
   - Deleting a schedule does NOT stop in-progress missions
   - Abort active missions via Drive page

Reference `docs/orbit-operations-guide.md` and `docs/site-hub-guide.md`.

### `boot` — Spot Boot Failures

Diagnostic checklist:

1. **Payload ports exposed?** — Unplugged payload ports prevent boot. Seat all port covers or connected payloads securely.
2. **Battery charged?** — Press SoC button on battery. Deeply discharged batteries (>24hrs in unpowered robot) may be permanently damaged.
3. **Toggle AP mode** — Press red power button **6 times** quickly to switch between Client/AP mode.
4. **Connect via Ethernet** — If WiFi unavailable, try `https://10.0.0.3` directly.
5. **Expired software?** — Spot with expired certificates shows "Failed to find robot" in Orbit or `CERTIFICATE_VERIFY_ERROR` via API. Update via Admin Console.
6. **v5.1.x factory reset bug** — Factory reset on v5.1 (below v5.1.3) causes permanent boot failure. Update to v5.1.3+ first.
7. **Camera server faults** — "degraded perception" warning: clean cameras, run SpotCheck, check software version compatibility.

Reference `docs/spot-troubleshoot-reference.md` and `docs/spot-admin-reference.md`.

### `extension` — SPX Extension Problems

Diagnostic checklist:

1. **Platform mismatch?**
   - SiteHub: `linux/amd64`, docker-compose `"2.4"`
   - Core I/O: `linux/arm64`, docker-compose `"3.5"`
   - JetPack version: v4.0.0+ uses 5.1.2 (L4T R35.4.1)

2. **Naming violation?**
   - No underscores, spaces, or parentheses
   - Cannot contain `coreio` or `mission_control`
   - Extensions violating rules on Core I/O 4.1.0+ cannot be uninstalled via UI

3. **Port conflict?**
   - Allowed: TCP/UDP 21000–22000
   - Reserved: TCP 21443 (Core I/O internal)

4. **Memory limit set?**
   - Missing memory limits can exhaust Core I/O (16GB shared)
   - Use journald logging driver (default since 4.1.0)

5. **Persistence issue?**
   - Manual docker-compose config does NOT survive reboots
   - Must install as SPX package for persistence

Reference `docs/core-io-guide.md` and `docs/troubleshooting.md`.

### `general` — Other Issues

For issues not covered above:

1. Read the error message carefully
2. Check `docs/spot-troubleshoot-reference.md` for common issues (boot, battery, camera)
3. Check `docs/troubleshooting.md` for extension and Orbit API issues
4. Check `docs/spot-admin-reference.md` for admin/license/log diagnostics
5. If Orbit-related, check `docs/orbit-operations-guide.md`
6. For hardware/environment, check `docs/spot-product-comparison.md` (operating limits)
7. For firewall/network, check `docs/spot-firewall-reference.md`
8. Suggest user upload logs via Admin Console or Orbit for BD support analysis

## Output Format

Always structure diagnosis as:

```
## Diagnosis: [Category]

**Symptoms:** [What the user reported]

**Likely Cause:** [Based on diagnostic checklist]

**Resolution Steps:**
1. [Step 1]
2. [Step 2]
...

**If unresolved:** [Escalation path — e.g., upload logs, contact BD support]
```
