# Boston Dynamics Orbit API Reference (v4.1.1)

This document is the core reference for the Boston Dynamics Orbit API used by orbit-agent.
Official documentation: https://dev.bostondynamics.com/docs/concepts/orbit/orbit_api.html

## Overview

The Orbit API is an HTTPS REST API where all endpoints carry the `/api/v0/` prefix.
Python SDK package: `bosdyn-orbit` (`bosdyn-scout` is deprecated since v4.0.0)

## Authentication

### Issuing an API Token

Generated in the Admin Settings of an Orbit instance. Displayed only once — store it securely.

### Authentication Endpoint

```text
GET /api/v0/api_token/authenticate
Authorization: Bearer {API_TOKEN}
```

### Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 401 | Authentication failed (invalid or missing token) |
| 403 | Unauthorized |

### Environment Variable Method (Recommended)

```bash
export BOSDYN_ORBIT_CLIENT_API_TOKEN="your_token_here"
```

---

## bosdyn.orbit.client.Client

### Constructor

```python
from bosdyn.orbit.client import Client

client = Client(
    hostname: str,       # Orbit instance hostname/IP
    verify: bool = True, # SSL certificate verification (dev: False, prod: True)
    cert: str | None = None  # Client certificate path
)
```

### Authentication

```python
client.authenticate_with_api_token(
    api_token: str | None = None  # If None, obtains from environment variable or stdin
) → Response
```

### Low-Level HTTP Methods

All paths are automatically converted to `/api/v0/{path}/`.

```python
client.get_resource(path: str, **kwargs) → Response
client.post_resource(path: str, **kwargs) → Response
client.patch_resource(path: str, **kwargs) → Response
client.delete_resource(path: str, **kwargs) → Response
client.get_resource_from_data_acquisition(path: str, **kwargs) → Response
```

> Calling before authentication raises `UnauthenticatedClientError`

### System Information

```python
client.get_version(**kwargs) → Response
# Returns: {"serial": "...", "version": "..."}

client.get_system_time(**kwargs) → Response
# GET /api/v0/settings/system-time/
# Returns: {"msSinceEpoch": 1703123456000}
```

### Robot Management

```python
client.get_robots(**kwargs) → Response
# GET /api/v0/robots/
# Returns: {"resources": [{"nickname": "...", "hostname": "...", ...}]}

client.get_robot_by_hostname(hostname: str, **kwargs) → Response
client.get_robot_info(robot_nickname: str, **kwargs) → Response
client.post_robot(**kwargs) → Response
client.delete_robot(robot_hostname: str, **kwargs) → Response
```

### Missions (SiteWalk)

```python
client.get_site_walks(**kwargs) → Response
# GET /api/v0/site_walks/

client.get_site_walk_by_id(uuid: str, **kwargs) → Response
client.get_site_walk_archive_by_id(uuid: str, **kwargs) → Response
client.post_site_walk(**kwargs) → Response
client.delete_site_walk(uuid: str, **kwargs) → Response
client.post_export_as_walk(site_walk_uuid: str, **kwargs) → Response
client.post_import_from_walk(**kwargs) → Response
```

### Execution History (Runs)

```python
client.get_runs(**kwargs) → Response
# GET /api/v0/runs/

client.get_run_by_id(uuid: str, **kwargs) → Response
client.get_run_log(uuid: str, **kwargs) → Response
client.get_run_archives_by_id(uuid: str, **kwargs) → Response
client.get_run_events(**kwargs) → Response
# GET /api/v0/run_events/

client.get_run_event_by_id(uuid: str, **kwargs) → Response
client.get_run_captures(**kwargs) → Response
# GET /api/v0/run_captures/

client.get_run_capture_by_id(uuid: str, **kwargs) → Response
client.get_run_statistics(**kwargs) → Response
client.get_run_statistics_session_summary(**kwargs) → Response
```

#### Data Hierarchy

```text
Run (runs)                  ← Entire single mission execution
 └── RunEvent (run_events)  ← Result of an individual action
      └── RunCapture (run_captures) ← Data point (image, sensor, etc.)
```

### Calendar / Schedule

```python
client.get_calendar(**kwargs) → Response
# GET /api/v0/calendar/schedule/

client.post_calendar_event(
    nickname: str | None = None,        # Robot nickname
    time_ms: int | None = None,         # Execution start time (ms since epoch)
    repeat_ms: int | None = None,       # Repeat interval (ms, None=once)
    mission_id: str | None = None,      # SiteWalk UUID
    force_acquire_estop: bool | None = None,
    require_docked: bool | None = None,
    schedule_name: str | None = None,   # Schedule name
    blackout_times: Iterable[Dict[str, int]] | None = None,  # Blackout times
    disable_reason: str | None = None,
    event_id: str | None = None,        # When modifying an existing event
    **kwargs
) → Response

client.post_calendar_events_disable_all(disable_reason: str, **kwargs) → Response
client.post_calendar_event_disable_by_id(event_id: str, disable_reason: str, **kwargs) → Response
client.post_calendar_events_enable_all(**kwargs) → Response
client.post_calendar_event_enable_by_id(event_id: str, **kwargs) → Response
client.delete_calendar_event(event_id: str, **kwargs) → Response
```

### Mission Dispatch (Immediate Execution)

```python
client.post_dispatch_mission_to_robot(
    robot_nickname: str,                # Target robot
    driver_id: str,                     # Driver ID
    mission_uuid: str | None = None,    # SiteWalk UUID
    delete_mission: bool = False,       # Delete after execution
    force_acquire_estop: bool = False,  # Force acquire E-Stop
    skip_initialization: bool = True,   # Skip initialization
    walk = None,                        # Walk protobuf object
    **kwargs
) → Response

client.post_return_to_dock_mission(
    robot_nickname: str,        # Target robot
    site_dock_uuid: str,        # Docking station UUID
    **kwargs
) → Response
```

### Site Infrastructure

```python
# SiteElement (action definition)
client.get_site_elements(**kwargs) → Response
client.get_site_element_by_id(uuid: str, **kwargs) → Response
client.post_site_element(**kwargs) → Response

# SiteDock (docking station)
client.get_site_docks(**kwargs) → Response
client.get_site_dock_by_id(uuid: str, **kwargs) → Response
client.post_site_dock(**kwargs) → Response
```

### Anomalies

```python
client.get_anomalies(**kwargs) → Response
# GET /api/v0/anomalies/

client.patch_anomaly_by_id(
    anomaly_uuid: str,
    patched_fields: dict,  # e.g. {"status": "open"/"closed"}
    **kwargs
) → Response

client.patch_bulk_close_anomalies(
    element_ids: list,  # List of SiteElement IDs
    **kwargs
) → Response
```

### Webhooks

```python
client.get_webhook(**kwargs) → Response
client.get_webhook_by_id(uuid: str, **kwargs) → Response
client.post_webhook(**kwargs) → Response
client.post_webhook_by_id(uuid: str, **kwargs) → Response
client.delete_webhook(uuid: str, **kwargs) → Response
```

> Webhook listener port range: TCP/UDP 21000–22000 (Spot platform reserved range)

### Backup

```python
client.post_backup_task(
    include_missions: bool,
    include_captures: bool,
    **kwargs
) → Response

client.get_backup_task(task_id: str, **kwargs) → Response
client.get_backup(task_id: str, **kwargs) → Response
client.delete_backup(task_id: str, **kwargs) → Response
```

### Images

```python
client.get_image(url: str, **kwargs) → urllib3.response.HTTPResponse
client.get_image_response(url: str, **kwargs) → Response
```

---

## bosdyn.orbit.utils

### Authentication Helpers

```python
from bosdyn.orbit.utils import get_api_token, add_base_arguments

get_api_token() → str
# Obtains from environment variable BOSDYN_ORBIT_CLIENT_API_TOKEN → stdin, in that order

add_base_arguments(parser) → None
# Adds --hostname, --verify, --cert arguments to argparse
```

### Data Query Helpers

```python
get_latest_created_at_for_run_events(client, params={}) → datetime
# Returns the most recent created_at timestamp among run_events

get_latest_run_capture_resources(client, params={}) → List
# Returns the list of latest run capture resources

get_latest_created_at_for_run_captures(client, params={}) → datetime
# Returns the most recent created_at timestamp among run_captures

get_latest_run_resource(client, params={}) → List
# Returns the latest run resource

get_latest_run_in_progress(client, params={}) → List
# Returns the currently in-progress run

get_latest_end_time_for_runs(client, params={}) → datetime
# Returns the most recent end time among runs
```

### Data Capture URL Extraction

```python
data_capture_urls_from_run_events(
    client, run_events, list_of_channel_names=None
) → List[str]
# Extracts list of data capture URLs from run_events
# list_of_channel_names: channels to filter (None=all)

data_capture_url_from_run_capture_resources(
    client, run_capture_resources, list_of_channel_names=None
) → List[str]
```

### Utilities

```python
get_action_names_from_run_events(run_events: Dict) → List[str]
# Extracts list of action names from run_events

datetime_from_isostring(datetime_isostring: str) → datetime
# Converts ISO 8601 string → datetime

write_image(img_raw, image_fp: str) → None
# Saves image object to file

print_json_response(response: Response) → bool
# Prints response JSON formatted; returns True if status is 200
```

### Webhook Validation

```python
validate_webhook_payload(
    payload: Dict,           # Webhook JSON body
    signature_header: str,   # X-Signature header value
    secret: str,             # Webhook secret
    max_age_ms: int = 300000 # Maximum allowed age (default 5 minutes)
) → None
# Raises WebhookSignatureVerificationError on failure
```

---

## bosdyn.orbit.exceptions

```text
Exception
└── Error                              # Base exception
    ├── UnauthenticatedClientError     # API call with unauthenticated client
    └── WebhookSignatureVerificationError  # Webhook signature verification failure
```

---

## API Endpoint Mapping Summary

| Resource Path | HTTP | Description |
|---------------|------|-------------|
| `api_token/authenticate` | GET | API token authentication |
| `version` | GET | Orbit version + serial info |
| `settings/system-time` | GET | System time (msSinceEpoch) |
| `robots` | GET/POST/DELETE | Robot management |
| `site_walks` | GET/POST/DELETE | SiteWalk (mission) management |
| `site_elements` | GET/POST | SiteElement (action) management |
| `site_docks` | GET/POST | SiteDock (docking) management |
| `calendar/schedule` | GET/POST/DELETE | Calendar schedule management |
| `runs` | GET | Execution history (Runs) |
| `run_archives` | GET | Run data zip download |
| `run_events` | GET | Execution events |
| `run_captures` | GET | Data captures |
| `anomalies` | GET/PATCH | Anomaly management |
| `webhooks` | GET/POST/PATCH/DELETE | Webhook management |
| `runs/facets/missions` | GET | Per-mission run statistics (Facet) |

---

## Resource Models

### Run (Mission Execution)

| Field | Type | Description |
|-------|------|-------------|
| uuid | UUID | Unique identifier |
| startTime | datetime | Start time |
| endTime | datetime | End time |
| actionCount | int | Number of actions |
| robotSerial | str | Robot serial number |
| robotNickname | str | Robot nickname |
| missionName | str | Mission name |
| missionId | str | SiteWalk UUID |
| missionStatus | str | Mission status |

### RunEvent (Action Result)

| Field | Type | Description |
|-------|------|-------------|
| uuid | UUID | Unique identifier |
| runUuid | UUID | Parent Run UUID |
| actionName | str | Action name |
| endStatus | str | End status |
| dataCaptures | List | List of data captures |

### RunCapture (Data Point)

| Field | Type | Description |
|-------|------|-------------|
| uuid | UUID | Unique identifier |
| runEventUuid | UUID | Parent RunEvent UUID |
| dataUrl | str | Data URL (image, etc.) |
| channelName | str | Channel name |
| keyResults | List | List of key results |

### Anomaly

| Field | Type | Description |
|-------|------|-------------|
| uuid | UUID | Unique identifier |
| runEventUuid | UUID | Associated RunEvent UUID |
| severity | int | Severity level |
| status | str | Status (open/closed) |
| dataCaptures | List | List of data captures |

### SiteWalk (Mission Definition)

Mission structure: SiteWalk → SiteElement (action) + SiteDock (docking station)

### Calendar Event (Schedule)

| Field | Type | Description |
|-------|------|-------------|
| eventId | str | Event identifier |
| eventMetadata.name | str | Schedule name |
| schedule.timeMs | str | Start time (ms since epoch) |
| agent.nickname | str | Robot nickname |
| task.dispatchTarget.missionId | str | Mission UUID |

---

## Usage Patterns in orbit-agent

### Polling (Current Implementation)

```python
# orbit-agent uses get_resource() directly to pass custom parameters
response = client.get_resource("run_events", params={"limit": 100, ...})
items = response.json()
```

### Incremental Polling (Cursor-Based)

```python
# Each Processor manages its own cursor to collect only data after the last query point
# RunEventsProcessor: createdAt-based cursor
# AnomaliesProcessor: createdAt-based cursor
# DataCapturesProcessor: createdAt-based cursor
```

### Calendar Event Management (BackgroundScheduleManager)

```python
# Retrieve schedule
events = client.get_calendar().json()

# Delete schedule
client.delete_calendar_event(event_id)

# Return robot to dock
client.post_return_to_dock_mission(robot_nickname, site_dock_uuid)
```

---

## Webhooks

Push mechanism that sends HTTP POST requests to external systems when events occur.

### Webhook Payload Structure

```json
{
  "uuid": "string",
  "type": "ACTION_COMPLETED | ACTION_COMPLETED_WITH_ALERT",
  "time": "ISO-8601 date string",
  "data": { /* same as run_event object */ }
}
```

### Webhook Event Types

| Type | Description |
|------|-------------|
| `ACTION_COMPLETED` | When a robot completes an action |
| `ACTION_COMPLETED_WITH_ALERT` | When an action completes with anomalous data detected |

### Extension WebView Port Mapping

When an Orbit Extension serves an HTTP server:

| Frontend (HTTPS) | Backend (HTTP) |
|-----------------|----------------|
| 22001 | 22101 |
| 22002 | 22102 |
| ... | ... |
| 22100 | 22200 |

---

## Best Practices

- **Always reference by UUID**: Names like `missionName` can be duplicated and must not be used as identifiers
- **verify=False is for development only**: Provide a CA bundle path in production
- **Use Facet endpoints**: When aggregate data is needed, use facets instead of full resources to reduce network traffic
- **Incremental polling**: Combine `orderBy=-createdAt` with a cursor to collect only data since the last query

---

## Version Notes (as of v4.1.1)

- v4.0.0: `bosdyn-scout` → `bosdyn-orbit` rename. Existing code continues to work but migration is recommended
- v4.1.0 (2024-09-23): Multi-docking, cloud Orbit global expansion (AU/BR/EU/**KR**/JP/NA/SG), alert triage, SiteDock sharing
- v4.1.1 (2024-12-18): **Target version for this project**. Backup examples added (`post_backup_task` + `get_backup`)
- v5.0.0: Python 3.6 support dropped, `delete_mission` parameter removed
- v5.0.1: `/runs/facets/actions/{missionName}` → changed to query param approach (breaking change)

> Note: The official documentation site (dev.bostondynamics.com) displays content based on the latest v5.x.
> Some methods may not exist in v4.1.1 — when uncertain, call directly via `client.get_resource(path)`.
> Source of truth: source code at GitHub tag `v4.1.1`.

---

## Official Documentation Links

- [Orbit API Concepts](https://dev.bostondynamics.com/docs/concepts/orbit/orbit_api.html)
- [Orbit API Swagger/OpenAPI](https://dev.bostondynamics.com/docs/orbit/docs) — Full RESTful endpoint listing
- [client.py source](https://github.com/boston-dynamics/spot-sdk/blob/master/python/bosdyn-orbit/src/bosdyn/orbit/client.py)
- [utils.py source](https://github.com/boston-dynamics/spot-sdk/blob/master/python/bosdyn-orbit/src/bosdyn/orbit/utils.py)
- [Release Notes](https://dev.bostondynamics.com/docs/release_notes)
