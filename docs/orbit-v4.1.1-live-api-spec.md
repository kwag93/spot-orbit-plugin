# Orbit Web API v4.1.0 (Live Instance v4.1.1) - Complete API Specification

> Source: `your-orbit-instance/api/v0/docs/` (Swagger UI, OpenAPI 3.0.1)
> Fetched: 2026-03-17
> Base URL: `/api/v0`

---

## Authentication

### Security Scheme

- **Type**: API Key (Header)
- **Header**: `Authorization`
- **Format**: `Bearer <API_TOKEN>`

Obtain an API token from the Orbit instance and add it to the request header.

---

## Endpoints

### Authentication

#### `POST /login` (DEPRECATED)

> **Deprecated** - Use `/api_token/authenticate` instead.

Authenticates with username and password.

**Request Body** (`application/json`):

| Field | Type | Description |
|-------|------|-------------|
| `username` | string | The username for the Orbit instance |
| `password` | string | The password for the Orbit instance |

**Responses**: `200`, `401`, `429`, `500`

---

#### `GET /api_token/authenticate`

Authenticates the API token provided in the request header.

Header: `{'Authorization': 'Bearer ' + <API TOKEN>}`

**Responses**: `200`, `400`, `401`

---

### Calendar

#### `GET /calendar/schedule`

Returns calendar events on the specified Orbit instance.

**Response** (`200`, `application/json`):

```json
{
  "activeEvents": [ Schedule ]
}
```

**Responses**: `200`, `500`

---

#### `POST /calendar/schedule`

Create a calendar event to play a mission.

**Request Body** (`application/json`): `Schedule` schema

**Responses**: `200`, `500`

---

#### `DELETE /calendar/schedule/{eventid}`

Removes the specified calendar event.

**Path Parameters**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `eventid` | string | Yes | ID of calendar event |

**Responses**: `200`, `500`

---

#### `POST /calendar/disable-enable`

Disable/enable mission scheduled on Orbit.

**Request Body** (`application/json`):

| Field | Type | Description |
|-------|------|-------------|
| `disableReason` | string | The reason for disabling the mission. Enables the mission if left empty. |
| `eventId` | string | (Optional) The eventId of the specific scheduled mission to disable/enable. If not provided, all missions are disabled/enabled. |

**Responses**: `200`, `500`

---

### Runs

#### `GET /runs/{runUuid}`

Retrieve a run by its uuid.

**Path Parameters**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `runUuid` | string | Yes | ID of run |

**Response** (`200`, `application/json`): `Run` schema

**Responses**: `200`, `500`

---

#### `GET /runs/`

Query a collection of runs.

**Query Parameters**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `startTime` | string (date-time) | No | Include runs with start_time >= this value (ISO 8601) |
| `endTime` | string (date-time) | No | Include runs with start_time < this value (ISO 8601) |
| `modifiedAt` | string (date-time) | No | Include runs with modified_at > this value (ISO 8601) |
| `missions` | string | No | Include runs which played this mission (comma-separated) |
| `robots` | string | No | Include runs performed by these robots (comma-separated hostnames) |
| `runTypes` | string | No | Include runs of these types (comma-separated: `teleop`, `mission`) |
| `status` | string | No | Include runs with this status |
| `limit` | integer | No | Max number of resources to return |
| `offset` | integer | No | Number of resources to skip |
| `orderBy` | string | No | Field to order results by |

**Response** (`200`, `application/json`):

```json
{
  "limit": integer,
  "offset": integer,
  "total": integer,
  "resources": [ Run ]
}
```

**Responses**: `200`, `500`

---

### Run Events

#### `GET /run_events/`

Retrieve a collection of run events.

**Query Parameters**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `runUuid` | string | No | Include run_events which occurred during the run with this uuid |
| `actionUuid` | string | No | Include run_events which represent playback of actions with this uuid |
| `elementId` | string | No | Include run_events which represent playback of a SiteElement with this uuid |
| `robotHostname` | string | No | Include run_events performed by a robot with this hostname |
| `robotNickname` | string | No | Include run_events performed by a robot with this nickname |
| `missionName` | string | No | Include run_events which played a mission with this name |
| `limit` | integer | No | Max number of resources to return |
| `offset` | integer | No | Number of resources to skip |
| `orderBy` | string | No | Field to order results by |

**Response** (`200`, `application/json`):

```json
{
  "limit": integer,
  "offset": integer,
  "total": integer,
  "resources": [ RunEvent ]
}
```

**Responses**: `200`, `500`

---

#### `GET /run_events/{runEventUuid}`

Retrieves a single run event resource by uuid.

**Path Parameters**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `runEventUuid` | string | Yes | ID of run event |

**Response** (`200`, `application/json`): `RunEvent` schema

**Responses**: `200`, `500`

---

### Run Captures

#### `GET /run_captures/`

Retrieve a collection of run captures.

**Query Parameters**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `runEventUuid` | string | No | Include run_captures which occurred during the run event with this uuid |
| `actionUuid` | string | No | Include run_captures from playbacks of an action with this uuid |
| `actionName` | string | No | Include run_captures from playbacks of an action with this name |
| `robotHostname` | string | No | Include run_captures from a robot with this hostname |
| `robotNickname` | string | No | Include run_captures from a robot with this nickname |
| `missionName` | string | No | Include run_captures from a mission with this name |
| `channelName` | string | No | Include run_captures from a specific channel |
| `limit` | integer | No | Max number of resources to return |
| `offset` | integer | No | Number of resources to skip |
| `orderBy` | string | No | Field to order results by |

**Response** (`200`, `application/json`):

```json
{
  "limit": integer,
  "offset": integer,
  "total": integer,
  "resources": [ RunCapture ]
}
```

**Responses**: `200`, `500`

---

#### `GET /run_captures/{runCaptureUuid}`

Retrieves a single run capture resource by uuid.

**Path Parameters**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `runCaptureUuid` | string | Yes | ID of run capture |

**Response** (`200`, `application/json`): `RunCapture` schema

**Responses**: `200`, `500`

---

### Run Archives

#### `GET /run_archives/{runId}`

Downloads a zip file containing a run's data.

**Path Parameters**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `runId` | string | Yes | ID of run |

**Response** (`200`, `application/zip`): Binary file

**Responses**: `200`, `500`

---

### Run Facets

#### `GET /runs/facets/actions/{missionName}`

Retrieves a list of action descriptions which match query params.

**Path Parameters**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `missionName` | string | Yes | The name of the mission |

**Response** (`200`, `application/json`):

```json
[
  {
    "id": "string",
    "name": "string",
    "channels": ["string"]
  }
]
```

**Responses**: `200`, `500`

---

#### `GET /runs/facets/robots`

Retrieves a list of robot descriptions which match query params.

**Response** (`200`, `application/json`):

```json
[
  {
    "robot_hostname": "string",
    "robot_serial": "string",
    "robot_nickname": "string"
  }
]
```

**Responses**: `200`, `500`

---

#### `GET /runs/facets/missions`

Retrieves a list of every unique mission which produced a run.

**Response** (`200`, `application/json`):

```json
[
  {
    "limit": integer,
    "offset": integer,
    "total": integer,
    "resources": [
      {
        "missionName": "string",
        "sessionCount": integer,
        "lastRunStartTime": "string"
      }
    ]
  }
]
```

**Responses**: `200`, `500`

---

### SiteWalks

#### `GET /site_walks/`

Retrieve a collection of all SiteWalks on Orbit.

**Response** (`200`, `application/json`):

```json
{
  "limit": integer,
  "offset": integer,
  "total": integer,
  "resources": [ SiteWalk ]
}
```

**Responses**: `200`, `500`

---

#### `GET /site_walks/{uuid}`

Retrieves a single SiteWalk resource by uuid.

**Path Parameters**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `uuid` | string | Yes | ID of SiteWalk |

**Response** (`200`, `application/json`): `SiteWalk` schema

**Responses**: `200`, `500`

---

#### `DELETE /site_walks/{uuid}`

Removes the specified SiteWalk.

**Path Parameters**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `uuid` | string | Yes | ID of SiteWalk |

**Responses**: `200`, `500`

---

#### `POST /site_walks`

Adds a new SiteWalk to Orbit. Also updates a pre-existing SiteWalk using the associated UUID.

**Request Body** (`application/json`): Array of `SiteWalk`

**Responses**: `200`

---

### SiteElements

#### `GET /site_elements/{uuid}`

Retrieves a single SiteElement resource by uuid.

**Path Parameters**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `uuid` | string | Yes | ID of SiteElement |

**Response** (`200`, `application/json`): `SiteElement` schema

**Responses**: `200`, `500`

---

#### `POST /site_elements`

Adds a new SiteElement to Orbit. Also updates a pre-existing SiteElement using the associated UUID.

**Request Body** (`application/json`): Array of `SiteElement`

**Responses**: `200`

---

### SiteDocks

#### `GET /site_docks/{uuid}`

Retrieves a single SiteDock resource by uuid.

**Path Parameters**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `uuid` | string | Yes | ID of SiteDock |

**Response** (`200`, `application/json`): `SiteDock` schema

**Responses**: `200`, `500`

---

#### `POST /site_docks`

Adds a new SiteDock to Orbit. Also updates a pre-existing SiteDock using the associated UUID.

**Request Body** (`application/json`): Array of `SiteDock`

**Responses**: `200`

---

### Robots

#### `GET /robots`

Retrieves a complete list of robot information on Orbit. Includes which robot is assigned to each slot.

**Response** (`200`, `application/json`): Array of `Robot`

**Responses**: `200`, `500`

---

#### `POST /robots`

Adds a new robot to Orbit.

**Request Body** (`application/json`):

| Field | Type | Description |
|-------|------|-------------|
| `hostname` | string | The hostname where the robot can be reached |
| `nickname` | string | A descriptive label for the robot |
| `username` | string | The username that Orbit is connected to the robot with |
| `password` | string | The password of the account Orbit will use to connect to the robot |

**Responses**: `200`, `500`

---

#### `GET /robots/{robotHostname}`

Retrieves information about a single robot.

**Path Parameters**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `robotHostname` | string | Yes | Hostname of the robot |

**Response** (`200`, `application/json`): `Robot` schema

**Responses**: `200`, `500`

---

#### `DELETE /robots/{robotHostname}`

Removes the specified robot.

**Path Parameters**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `robotHostname` | string | Yes | Hostname of the robot |

**Responses**: `200`, `500`

---

### Webhooks

#### `GET /webhooks`

Retrieves a complete list of registered webhooks on Orbit.

**Response** (`200`, `application/json`): Array of `Webhook`

**Responses**: `200`, `500`

---

#### `POST /webhooks`

Adds a new webhook to Orbit.

**Request Body** (`application/json`): `Webhook` schema

**Responses**: `200`, `500`

---

#### `GET /webhooks/{uuid}`

Retrieve a webhook by its uuid.

**Path Parameters**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `uuid` | string | Yes | ID of webhook |

**Response** (`200`, `application/json`): `Webhook` schema

**Responses**: `200`, `500`

---

#### `POST /webhooks/{uuid}`

Updates a specific webhook on Orbit.

**Path Parameters**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `uuid` | string | Yes | ID of webhook |

**Request Body** (`application/json`): `Webhook` schema

**Responses**: `200`, `500`

---

#### `DELETE /webhooks/{uuid}`

Removes the specified webhook.

**Path Parameters**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `uuid` | string | Yes | ID of webhook |

**Responses**: `200`, `500`

---

### Missions (DEPRECATED)

#### `GET /missions` (DEPRECATED)

Retrieves a complete list of mission information on Orbit.

**Response** (`200`, `application/json`): Array of `Mission`

**Responses**: `200`, `500`

---

#### `GET /missions/{missionId}` (DEPRECATED)

Retrieves information about a single mission.

**Path Parameters**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `missionId` | string | Yes | ID of the mission (matches the uuid field) |

**Response** (`200`, `application/json`): `Mission` schema

**Responses**: `200`, `500`

---

#### `DELETE /missions/{missionId}` (DEPRECATED)

Removes the specified mission.

**Path Parameters**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `missionId` | string | Yes | ID of the mission (matches the uuid field) |

**Responses**: `200`, `500`

---

### Anomalies

#### `GET /anomalies`

Retrieves anomalies.

**Query Parameters**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `startTime` | string (date-time) | No | Filter by start time |
| `endTime` | string (date-time) | No | Filter by end time |
| `status` | string | No | Filter by status (`open`, `closed`) |
| `limit` | integer | No | Max number of resources to return |
| `offset` | integer | No | Number of resources to skip |

**Response** (`200`, `application/json`): Array of `Anomaly`

**Responses**: `200`, `500`

---

#### `PATCH /anomalies`

Bulk update anomalies.

**Request Body** (`application/json`): Array of anomaly update objects

**Responses**: `200`, `500`

---

#### `PATCH /anomalies/{anomalyId}`

Update a single anomaly.

**Path Parameters**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `anomalyId` | string | Yes | ID of the anomaly |

**Request Body** (`application/json`): Anomaly update object

**Responses**: `200`, `500`

---

### Backup Tasks

#### `GET /backup_tasks`

Retrieves a list of backup tasks.

**Response** (`200`, `application/json`):

```json
{
  "data": [ BackupTask ]
}
```

**Responses**: `200`, `500`

---

#### `POST /backup_tasks`

Creates a new backup task.

**Request Body** (`application/json`): `BackupParameters` schema

**Response** (`200`, `application/json`):

```json
{
  "data": BackupTask
}
```

**Responses**: `200`, `500`

---

### Backups

#### `GET /backups/{taskId}`

Retrieves a backup tar file given a task ID.

**Path Parameters**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `taskId` | string | Yes | ID of the backup task |

**Response** (`200`, `application/x-tar`): Binary file

**Responses**: `200`, `500`

---

#### `DELETE /backups/{taskId}`

Deletes a backup tar file from the Orbit instance given a task ID.

**Path Parameters**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `taskId` | string | Yes | ID of the backup task |

**Responses**: `200`, `500`

---

## Schemas

### Anomaly

An anomaly/alert detected by a Spot mission element.

| Field | Type | Description |
|-------|------|-------------|
| `uuid` | string | The unique identifier for the anomaly |
| `time` | string (date-time) | |
| `createdAt` | string (date-time) | |
| `elementId` | string | |
| `assetId` | string | |
| `name` | string | |
| `severity` | integer | |
| `title` | string | |
| `source` | string | |
| `runUuid` | string | |
| `runEventUuid` | string | |
| `status` | string | Enum: `open`, `closed` |
| `statusModifiedAt` | string (date-time) | |
| `statusModifiedBy` | string | |

---

### Schedule

A schedule describes when and how often a robot should execute an autonomous mission.

| Field | Type | Description |
|-------|------|-------------|
| `eventMetadata` | object | Metadata for the calendar event |
| `eventMetadata.name` | string | The name of the calendar event |
| `eventMetadata.modificationTimeMs` | integer | The time this event was last modified (ms since epoch) |
| `eventMetadata.modificationUser` | string | The user name that modified the event |
| `agent` | object | Information about the agent (robot) for the calendar event |
| `agent.nickname` | string | The nickname of the robot for this event |
| `task` | object | The task to be performed when this event is triggered |
| `task.missionId` | string | The mission to play |
| `task.forced` | boolean | Whether the mission is forced |
| `schedule` | object | Information about when to execute the event |
| `schedule.startTime` | string (date-time) | The start time of the event |
| `schedule.repeatInterval` | string | How often the event repeats |
| `schedule.daysOfWeek` | array of string | Days of week when the event occurs |
| `schedule.endTime` | string (date-time) | The end time of the event |
| `eventId` | string | The unique identifier for this event |
| `disableReason` | string | The reason for the event being disabled |

---

### Robot

Information about a robot connected to Orbit.

| Field | Type | Description |
|-------|------|-------------|
| `hostname` | string | The hostname where the robot can be reached |
| `nickname` | string | A descriptive label for the robot |
| `lastConnection` | string (date-time) | When Orbit last communicated with this robot |
| `serial` | string | The serial number of the robot |
| `slot` | integer | The slot assigned to this robot |

---

### Run

A Run represents a period of robot operation. Both teleoperation and autonomous operations are represented as Runs.

| Field | Type | Description |
|-------|------|-------------|
| `actionCount` | integer | |
| `pendingActionCount` | integer | |
| `uuid` | string | A unique identifier for this run |
| `runType` | string | Enum: `teleop`, `mission` |
| `startTime` | string (date-time) | When this run started |
| `endTime` | string (date-time) | When this run completed |
| `robotHostname` | string | The hostname of the robot being controlled |
| `robotNickname` | string | A descriptive label for the robot |
| `missionName` | string | The mission being played |
| `status` | string | The current status of the run. Enum: `None`, `Active`, `Error`, `Completed`, `Paused`, `Unknown` |
| `createdAt` | string (date-time) | When this run was created |
| `modifiedAt` | string (date-time) | When this run was last modified |

---

### RunEvent

A RunEvent is an action that occurred during a Run.

| Field | Type | Description |
|-------|------|-------------|
| `uuid` | string | A unique identifier for this run event |
| `runUuid` | string | The uuid of the run this event belongs to |
| `actionUuid` | string | The uuid of the action this event represents |
| `actionName` | string | The name of the action this event represents |
| `elementId` | string | The uuid of the SiteElement this event represents |
| `status` | string | The current status of the run event. Enum: `Active`, `Error`, `Completed`, `Pending`, `Skipped` |
| `startTime` | string (date-time) | When this run event started |
| `endTime` | string (date-time) | When this run event completed |
| `hasDataCapture` | boolean | Whether this event has data captures |
| `dataError` | array of string | Errors that occurred during data capture |
| `createdAt` | string (date-time) | When this run event was created |

---

### RunCapture

A RunCapture is data captured during a RunEvent.

| Field | Type | Description |
|-------|------|-------------|
| `uuid` | string | A unique identifier for this run capture |
| `runEventUuid` | string | The uuid of the run event this capture belongs to |
| `actionUuid` | string | The uuid of the action this capture belongs to |
| `actionName` | string | The name of the action this capture belongs to |
| `channelName` | string | The name of the channel this capture belongs to |
| `dataUrl` | string | A URL where data can be downloaded |
| `dataEncoding` | string | The encoding of the data |
| `createdAt` | string (date-time) | When this run capture was created |

---

### SiteWalk

A SiteWalk describes a series of tasks that define autonomous robot operation. It contains SiteElements and SiteDocks together with other parameters that define autonomous operation.

| Field | Type | Description |
|-------|------|-------------|
| `uuid` | string | Unique identifier for the SiteWalk |
| `name` | string | The name for the SiteWalk |
| `siteElementIds` | array of string | References to elements in this walk in the order they will be visited |
| `globalParameters` | object | Parameters that apply to the entire mission |
| `siteDockIds` | object | References to docks to be used by this walk |
| `createdAt` | string (date-time) | When this SiteWalk was created |
| `modifiedAt` | string (date-time) | When this SiteWalk was last modified |

---

### SiteElement

A SiteElement describes what a robot should do and where to do it.

| Field | Type | Description |
|-------|------|-------------|
| `uuid` | string | Unique identifier for the SiteElement |
| `name` | string | The name for the SiteElement |
| `waypointId` | string | The location of the element |
| `waypointMaxDistance` | number | The maximum distance (meters) that defines when we have reached the element waypoint |
| `waypointMaxYaw` | number | The maximum yaw (radians) that defines when we have reached the element waypoint |
| `action` | object | Action performed at target destination |
| `targetFailureBehavior` | object | Behavior on failure to reach target |

---

### SiteDock

A SiteDock describes a docking station for the robot.

| Field | Type | Description |
|-------|------|-------------|
| `uuid` | string | Unique identifier for the SiteDock |
| `name` | string | The name for the SiteDock |
| `waypointId` | string | The location of the dock |
| `dockingStationId` | integer | The ID of the docking station |

---

### Webhook

A webhook registered on Orbit.

| Field | Type | Description |
|-------|------|-------------|
| `uuid` | string | Unique identifier for the webhook |
| `url` | string | The URL that the webhook will send events to |
| `secret` | string | A secret used to validate the webhook |
| `enabled` | boolean | Whether the webhook is enabled |
| `events` | array of string | The events that trigger the webhook |
| `createdAt` | string (date-time) | When this webhook was created |
| `modifiedAt` | string (date-time) | When this webhook was last modified |

---

### BackupTask

A BackupTask represents a backup task of the Orbit instance. It can include mission data and/or inspection data captures based on BackupParameters.

| Field | Type | Description |
|-------|------|-------------|
| `taskId` | string | The unique identifier for this backup task |
| `startedAt` | string (date-time) | When this backup task was started |
| `status` | string | Enum: `Starting`, `Creating database dump`, `Creating zip file`, `Completed`, `Error`, `Cancelled` |
| `filename` | string | The filename of the backup |
| `size` | number | The size of the backup in bytes |
| `error` | string | The error message if the backup task failed |
| `params` | BackupParameters | The parameters used for this backup |

---

### BackupParameters

Parameters for creating a backup.

| Field | Type | Description |
|-------|------|-------------|
| `includeMissions` | boolean | Whether to include mission data in the backup |
| `includeCaptures` | boolean | Whether to include inspection data captures in the backup |
| `startTime` | string (date-time) | Start time for capture data to include |
| `endTime` | string (date-time) | End time for capture data to include |

---

### Mission (DEPRECATED)

A mission resource.

| Field | Type | Description |
|-------|------|-------------|
| `uuid` | string | A unique identifier for this mission |
| `name` | string | The name of the mission |
| `description` | string | A descriptive label for the mission |
| `saved_at` | string (date-time) | When this mission was saved |

---

## Endpoint Summary Table

| # | Method | Path | Tag | Description |
|---|--------|------|-----|-------------|
| 1 | POST | `/login` | Authentication | Authenticates with username/password (DEPRECATED) |
| 2 | GET | `/api_token/authenticate` | Authentication | Authenticates API token in header |
| 3 | GET | `/calendar/schedule` | Calendar | Returns calendar events |
| 4 | POST | `/calendar/schedule` | Calendar | Create a calendar event |
| 5 | DELETE | `/calendar/schedule/{eventid}` | Calendar | Remove a calendar event |
| 6 | POST | `/calendar/disable-enable` | Calendar | Disable/enable scheduled mission |
| 7 | GET | `/runs/{runUuid}` | Runs | Retrieve a run by uuid |
| 8 | GET | `/runs/` | Runs | Query a collection of runs |
| 9 | GET | `/run_events/` | Run Events | Retrieve run events collection |
| 10 | GET | `/run_events/{runEventUuid}` | Run Events | Retrieve a single run event |
| 11 | GET | `/run_captures/` | Run Captures | Retrieve run captures collection |
| 12 | GET | `/run_captures/{runCaptureUuid}` | Run Captures | Retrieve a single run capture |
| 13 | GET | `/run_archives/{runId}` | Run Archives | Download run data as zip |
| 14 | GET | `/runs/facets/actions/{missionName}` | Run Facets | List action descriptions for a mission |
| 15 | GET | `/runs/facets/robots` | Run Facets | List robot descriptions |
| 16 | GET | `/runs/facets/missions` | Run Facets | List unique missions with runs |
| 17 | GET | `/site_walks/` | SiteWalks | Retrieve all SiteWalks |
| 18 | GET | `/site_walks/{uuid}` | SiteWalks | Retrieve a single SiteWalk |
| 19 | DELETE | `/site_walks/{uuid}` | SiteWalks | Remove a SiteWalk |
| 20 | POST | `/site_walks` | SiteWalks | Add/update a SiteWalk |
| 21 | GET | `/site_elements/{uuid}` | SiteElements | Retrieve a single SiteElement |
| 22 | POST | `/site_elements` | SiteElements | Add/update a SiteElement |
| 23 | GET | `/site_docks/{uuid}` | SiteDocks | Retrieve a single SiteDock |
| 24 | POST | `/site_docks` | SiteDocks | Add/update a SiteDock |
| 25 | GET | `/robots` | Robots | List all robots |
| 26 | POST | `/robots` | Robots | Add a new robot |
| 27 | GET | `/robots/{robotHostname}` | Robots | Retrieve a single robot |
| 28 | DELETE | `/robots/{robotHostname}` | Robots | Remove a robot |
| 29 | GET | `/webhooks` | Webhooks | List all webhooks |
| 30 | POST | `/webhooks` | Webhooks | Add a new webhook |
| 31 | GET | `/webhooks/{uuid}` | Webhooks | Retrieve a webhook by uuid |
| 32 | POST | `/webhooks/{uuid}` | Webhooks | Update a webhook |
| 33 | DELETE | `/webhooks/{uuid}` | Webhooks | Remove a webhook |
| 34 | GET | `/missions` | Missions | List all missions (DEPRECATED) |
| 35 | GET | `/missions/{missionId}` | Missions | Retrieve a single mission (DEPRECATED) |
| 36 | DELETE | `/missions/{missionId}` | Missions | Remove a mission (DEPRECATED) |
| 37 | GET | `/anomalies` | Anomalies | Retrieve anomalies |
| 38 | PATCH | `/anomalies` | Anomalies | Bulk update anomalies |
| 39 | PATCH | `/anomalies/{anomalyId}` | Anomalies | Update a single anomaly |
| 40 | GET | `/backup_tasks` | Backup Tasks | List backup tasks |
| 41 | POST | `/backup_tasks` | Backup Tasks | Create a backup task |
| 42 | GET | `/backups/{taskId}` | Backups | Download a backup tar file |
| 43 | DELETE | `/backups/{taskId}` | Backups | Delete a backup tar file |
