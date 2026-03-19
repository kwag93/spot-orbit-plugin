# Spot SDK Orbit Example Reference

Summary of orbit-agent related examples from the official spot-sdk repository.
Source: https://github.com/boston-dynamics/spot-sdk/tree/53e2ffe0a78519efa7752e59e9243bae2ba9c605/python/examples/orbit

## Example List

### 1. hello_orbit — Introduction

Client initialization → authentication → print robot list.

```python
client = Client(hostname=options.hostname, verify=False)
client.authenticate_with_api_token()
robots = client.get_robots().json()
for robot in robots['resources']:
    print(robot['nickname'])
```

### 2. runs_response — Querying Run History

```python
runs = client.get_runs().json()
run_events = client.get_run_events().json()
run_captures = client.get_run_captures().json()
```

### 3. schedule_mission — Calendar Schedule Operations

```python
# Query
events = client.get_calendar().json()

# Create
client.post_resource("calendar/schedule", json=payload)

# Delete
client.delete_resource(f"calendar/schedule/{uuid}")

# Note: PATCH (update) is not supported by the Orbit API.
# To modify a schedule, delete and recreate it.
```

### 4. anomalies — Query/Update Anomalies

```python
# Query
anomalies = client.get_anomalies().json()

# Change status
client.patch_resource(f"anomalies/{uuid}", json={"status": "closed"})

# Bulk close
client.patch_bulk_close_anomalies(element_ids=[...])
```

### 5. return_to_dock — Return to Dock

```python
client.post_return_to_dock_mission(
    robot_nickname="spot-1",
    site_dock_uuid="dock-uuid"
)
```

### 6. toggle_mission_based_on_weather — Weather-Based Mission Toggle

Integrates with weather API (OpenWeatherMap) to disable all scheduled missions during adverse weather conditions.

### 7. webhook / webhook_integration — Event Subscription

```python
# Create
client.post_resource("webhooks", json=webhook_config)

# Signature verification (listener side)
from bosdyn.orbit.utils import validate_webhook_payload
validate_webhook_payload(payload, signature_header, secret)
```

### 8. backups — Create/Download Backups

```python
task = client.post_backup_task(include_missions=True, include_captures=False)
task_id = task.json()["taskId"]
backup = client.get_backup(task_id)
```

### 9. export_run_archives — Export Run Archives

### 10. export_sitewalk_archives — Export SiteWalk protobuf

```python
walks = client.get_site_walks().json()
walk_data = client.post_export_as_walk(site_walk_uuid)
```

### 11. work_orders — External System Integration

## Mapping to orbit-agent

| Example | orbit-agent Usage |
|---------|-------------------|
| hello_orbit | `OrbitClientService.initialize_client()` |
| runs_response | `Poller` (run_events, runs polling) |
| anomalies | `Poller` (anomalies polling), `AnomaliesNormalizedStrategy` |
| schedule_mission | `BackgroundScheduleManager` (schedule create/delete) |
| return_to_dock | `OrbitMissionHelper.auto_return_to_dock()` |
| webhook | Currently unused (reference for future push-based migration) |

---

## Full SDK Example Categories

Complete list from the official spot-sdk repository. Orbit examples above are the most relevant to this plugin; the rest are listed for reference when users ask about broader Spot capabilities.

> For SDK API details, use context7 (`bosdyn-client`). The list below covers what's available as runnable examples.

### Core I/O / Payload Examples

- **CORE I/O GPIO** — GPIO pin control on Core I/O
- **Metrics over CoreIO** — Collect and export metrics from Core I/O
- **CoreIO Modem Signals Plugin** — Cellular signal data acquisition
- **Spot Cam Video Core IO Extension** — Camera streaming as SPX extension
- **Extensions** — SPX extension lifecycle management
- **Payloads** — Payload registration and management
- **Self Registration** — Payload self-registration workflow

### Autonomy and Missions

- **Graph Nav** — Anchoring, point cloud extraction, map viewing, GPS data
- **Mission Recorder** — Record autonomous missions
- **Replay Mission** — Replay recorded missions
- **Edit Autowalk / Record Autowalk** — Autowalk mission editing and recording
- **Extract Images from Autowalk** — Image extraction from Autowalk data
- **Area Callbacks** — Region-triggered callbacks during missions
- **Post Docking Callbacks** — Actions after docking completion
- **Remote Mission Service** — Custom mission node implementation
- **Mission Question Answerer** — Interactive mission responses
- **Network Request Callback** — HTTP callbacks during missions
- **Access Controlled Doors** — Door interaction during autonomous missions

### Robot Control

- **Hello Spot** — Basic introduction to commanding Spot
- **Frame Trajectory** — Trajectory command implementation
- **Stance** — Static pose control
- **WASD** — Keyboard teleoperation
- **Xbox Controller** — Gamepad teleoperation
- **Docking** — Dock/undock operations
- **Auto Return** — Automatic return behavior
- **E-Stop** — Emergency stop management
- **Fan Commands** — Thermal management

### Arm and Manipulation

- Simple/trajectory/joint/force/impedance arm motions
- Grasp, carry, gaze, stow/unstow commands
- Door opening, surface contact, constrained manipulation
- Inverse kinematics, GCode writing
- **ARM WASD** — Keyboard-based arm teleoperation

### Perception and ML

- **Get Image / Stitch Front Images** — Camera image acquisition
- **World Objects** — Object detection and mutation
- **Fiducial Follow** — April tag following
- **Tensorflow Detector** — ML model inference on robot
- **Network Compute Bridge** — Remote ML inference
- **Ray Cast** — 3D ray casting
- **No-Go Regions** — Dynamic obstacle zones
- **Depth Projection** — Depth data on visual images

### Orbit Platform Examples

- **Hello Orbit** — Client initialization and authentication
- **Export Run Archives / Sitewalk Archives** — Data export
- **Anomalies** — Anomaly query and status management
- **Schedule Mission** — Calendar operations (GET/POST/DELETE, no PATCH)
- **Runs Response** — Run history queries
- **Return to Dock** — Remote dock command
- **Mission Toggle** — Weather-based mission control
- **Webhook / Webhook Integrations** — Event subscription
- **Backups** — Backup creation and download
- **Work Orders Integration** — External system integration

### Data and Logging

- **BDDF Download** — Boston Dynamics Data Format
- **Data Buffer / Data Service** — Runtime data management
- **Cloud Upload** — Upload data to cloud services
- **Comms Test / Comms Image Service** — Network diagnostics

### Spot CAM

- Audio, video, PTZ, lighting, network, media log, compositor services
