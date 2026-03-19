# Orbit API Version Differences: v4.1.1 vs v5.x

Current project target: **v4.1.1** (confirmed on actual instance)
Official documentation reference: **v5.1.1** (latest)

This document summarizes what to watch out for when upgrading to v5.x.

---

## Endpoint Count

| Version | Endpoint Count | How to Verify |
| --- | --- | --- |
| v4.1.0 | 43 | Actual instance Swagger (`<ORBIT_IP>/api/v0/docs/`) |
| v5.0.0 | 46 | BD official Swagger UI (`dev.bostondynamics.com/docs/orbit/docs`) |

---

## Breaking Changes

### v5.0.1: facet endpoint change

```text
# v4.1.1 (current)
GET /api/v0/runs/facets/actions/{missionName}

# v5.0.1 (changed)
GET /api/v0/runs/facets/actions?missionName={missionName}
```

Changed from path parameter to query parameter.
**When upgrading from v4.1.1 to v5.0.1, this call must be updated.**

### v5.0.1: dispatch parameter changes

`post_dispatch_mission_to_robot()` method:

| Parameter | v4.1.1 | v5.0.1 |
| --- | --- | --- |
| `mission_uuid` | ✅ in use | ⚠️ deprecated (use `walk`) |
| `walk` | ❌ not present | ✅ new (replaces mission\_uuid) |
| `delete_mission` | ✅ in use | ❌ **removed** |
| `skip_initialization` | default True | default True |
| `driver_id` | required | required + included in dispatch event |

### v5.0.1: query parameter rename

```text
includeLaunchFailures → includeDispatchFailures
```

---

## New Endpoints in v5.0.0

Endpoints present in v5.0.0 but absent in v4.1.0 (3 new, total 43 → 46):

| Endpoint | HTTP | Description |
| --- | --- | --- |
| `/runs/{runUuid}/log` | GET | Run log retrieval |
| `/run_statistics/sessions` | GET | Session statistics |
| `/run_statistics/sessions_summary` | GET | Session summary |

> **Note**: Missions, Backup Tasks, Run Facets, and Anomalies already exist in v4.1.0.
> Missions endpoints are marked **deprecated** in both v4.1.0 and v5.0.0.
> Run Facets changed from path parameter (`/actions/{missionName}`) in v4 to query parameter (`/actions?missionName=`) in v5.

### New SDK Methods (v5.x only)

In v4.1.0, equivalent data can be accessed via `client.get_resource(path)`.

| Method | Added In | Description |
| --- | --- | --- |
| `get_anomalies()` | v4.1.1+ | Available in v4 SDK; v5 adds query parameter support |
| `get_backup()` | v5.0.0 | Download backup zip |
| `get_backup_task_status()` | v5.0.0 | Monitor backup progress |
| `get_run_statistics()` | v5.0.0 | Session statistics |
| `get_run_statistics_session_summary()` | v5.0.0 | Session summary |
| `get_resource_from_data_acquisition()` | v5.0.1 | Retrieve files from data acquisition system |

---

## Impact on orbit-agent

### Current code (v4.1.1 compatible)

Since orbit-agent mostly uses the low-level `client.get_resource(path)` method,
**most of it will continue to work as-is in v5.x**.

### Items to check when upgrading

| Code Location | Impact | Action |
| --- | --- | --- |
| `OrbitMissionHelper.dispatch_mission()` | `mission_uuid` deprecated | Switch to `walk` parameter |
| facet calls (if any) | path → query change | Update URL |
| `get_resource("anomalies")` | No impact | Can be used as-is |
| `get_resource("run_events")` | No impact | Can be used as-is |

### Safe upgrade strategy

1. Install `pip install bosdyn-orbit==5.0.1`
2. Code based on `get_resource()` requires no changes
3. Only check call sites of `post_dispatch_mission_to_robot()`
4. Check whether facet endpoints are in use
5. Test, then deploy

---

## SDK Package Changes

| Version | Package | Notes |
| --- | --- | --- |
| Before v3.x | `bosdyn-scout` | deprecated |
| v4.0.0+ | `bosdyn-orbit` | Scout → Orbit rename |
| v5.0.0+ | `bosdyn-orbit` | New methods added |

```bash
# Current (v4.1.1)
pip install bosdyn-orbit==4.1.1

# Upgrade
pip install bosdyn-orbit==5.0.1
```

---

## Checking the Version on Your Actual Instance

```bash
curl -sk https://<ORBIT_IP>/api/v0/version | python3 -m json.tool
```

```json
{
    "version": "4.1.1",
    "serial": "SPOT-SERIAL-NUMBER",
    "hostEnvironment": "physical"
}
```
