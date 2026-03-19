# Orbit Agent Role Guide

The 5 core roles of orbit-agent and their Orbit API mappings.

---

## Architecture Overview

```text
                    ┌─────────────────────────────────┐
                    │         main.py (entry point)          │
                    └──────────┬──────────────────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
    ┌─────────▼──────┐ ┌──────▼─────┐ ┌────────▼──────────┐
    │  HTTP Server   │ │   MQTT     │ │  Background       │
    │  (Flask:5001)  │ │ Autopilot  │ │  Services         │
    └────────────────┘ └────────────┘ └───────────────────┘
              │                │                │
     Config API        Autonomous control  Schedule mgmt + shuffle
     License validation  Mission import    Image collection
     Status check        Dock return
```

---

## Role 1: Data Polling → Backend Push

**Module**: `poller/` → `pusher/`

**Orbit API**:
- `GET /api/v0/run_events` (RunEvent collection)
- `GET /api/v0/run_captures` (RunCapture collection)
- `GET /api/v0/anomalies` (Anomaly collection)
- `GET /api/v0/robots` (Robot info)
- `GET /api/v0/runs` (Run info)

**Data flow**:

```text
Orbit API → Poller → Processor → DTO conversion
→ Pusher → PushStrategy → HMAC signing → Backend API
```

**Dependency order**: `run_events` → `run_captures` → `anomalies`

---

## Role 2: MQTT Autonomous Driving Control

**Module**: `mqtt/autopilot_client.py`, `mqtt/autopilot_handlers.py`

**MQTT topic structure**:

```text
orbits/{serial}/{category}/{direction}/{action}
```

### Incoming Topics (req)

| Topic | Handler | Orbit API |
| --- | --- | --- |
| `orbits/{serial}/mission/req/import` | MissionImportHandler | `post_import_from_walk()` |
| `orbits/{serial}/mission/req/delete` | MissionDeleteHandler | `delete_site_walk()` |
| `orbits/{serial}/autowalk/req/start` | AutowalkStartHandler | `post_calendar_event()` + `post_dispatch_mission_to_robot()` |
| `orbits/{serial}/autowalk/req/pause` | AutowalkPauseHandler | Robot state change |
| `orbits/{serial}/autowalk/req/resume` | AutowalkResumeHandler | Robot state change |
| `orbits/{serial}/autowalk/req/stop` | AutowalkStopHandler | Mission stop |
| `orbits/{serial}/autowalk/req/return` | AutowalkReturnHandler | `post_return_to_dock_mission()` |

### Published Topics (res, status)

| Topic | Content |
| --- | --- |
| `orbits/{serial}/mission/res/import` | Mission import result |
| `orbits/{serial}/mission/res/delete` | Mission delete result |
| `orbits/{serial}/autowalk/res/start` | Autonomous drive start result |
| `orbits/{serial}/autowalk/res/{action}` | Control command result |
| `orbits/{serial}/autowalk/status` | Schedule status broadcast |

### Message Models

```text
Request: request_id, timestamp, target(serial, nickname), mission(id, name, download_url)
Response: request_id, timestamp, status(SUCCESS/FAILURE), result/error
```

---

## Role 3: Time-Limited Schedule Management

**Module**: `background_schedule_manager.py`

**Orbit API**:
- `GET /api/v0/calendar/schedule` (Schedule query)
- `DELETE /api/v0/calendar/schedule/{eventId}` (Delete expired schedule)
- `GET /api/v0/settings/system-time` (Server time sync)
- `post_return_to_dock_mission()` (Automatic dock return)

**Behavior**:

1. Periodically query schedules with the `ORBIT_AGENT_TB_` prefix
2. Automatically delete schedules that have passed their expiry time
3. After deletion, automatically return robot to dock (if configured)
4. Broadcast active schedule status via MQTT

**Schedule name format**:

```text
ORBIT_AGENT_TB_{expire_time_ms}_{site_id}_{mission_name}
```

---

## Role 4: Mission Action Shuffle

**Module**: `background_mission_shuffler.py`

**Orbit API**:
- `get_missions()` (Mission list)
- `get_mission_elements()` (SiteElement query)
- `update_mission_element_order()` (Reorder)

**Purpose**: When a robot repeatedly traverses the same route,
a bias toward patrolling only certain sections can develop.
Shuffling the action order ensures uniform patrol coverage.

---

## Role 5: Image Collection → MinIO Storage

**Module**: `services/implementations/image_storage_service.py`

**Orbit API**:
- `client.get_image(url)` (Download image from dataUrl)

**Behavior**:

1. Download image from RunCapture's `dataUrl`
2. Upload to MinIO object storage
3. Record MinIO URL in the `storageUrl` field

**config.toml settings**:

```toml
[minio]
endpoint = "localhost:9000"
default_bucket = "robot-images"

[image_storage]
enabled = true
parallel_processing = true
max_image_size_mb = 50
```

---

## Security: HMAC Authentication Flow

```text
1. AuthManager → Orbit /version → acquire serial
2. AuthManager → Backend /shared-secret → issue HMAC key
3. Pusher → attach HMAC signature to all requests
   - X-Server-ID: {serial}
   - X-HMAC-Signature: HMAC-SHA256(secret, payload)
   - X-Timestamp: {unix_timestamp}
4. On 406/403 response → automatic re-authentication (re-run boot_up)
```

---

## config.toml Section Mapping

| Section | Role |
| --- | --- |
| `[orbit]` | hostname, api_token, serial |
| `[client]` | Backend API URL, shared secret URL |
| `[endpoints.*]` | Polling endpoint configuration |
| `[minio]` | MinIO connection info |
| `[image_storage]` | Image collection settings |
| `[mqtt_autopilot]` | MQTT broker connection info |
| `[schedule_cleaner]` | Schedule cleanup interval |
| `[schedule_manager_mqtt]` | Status broadcast settings |
| `[mission_shuffler]` | Mission shuffle settings |
