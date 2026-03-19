# Orbit Web API v5.0.0 - Complete API Specification

> Source: `https://dev.bostondynamics.com/docs/orbit/docs` (Swagger UI, OpenAPI 3.0.1)
> Fetched: 2026-03-17
> Base URL: `/api/v0`
> Version: **5.0.0** (distinguishes from live instance v4.1.1)

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

**Responses**:

| Code | Description |
|------|-------------|
| 200 | Successfully logged into the Orbit instance. |
| 401 | Unauthorized Request response. |
| 429 | Too Many Requests response. |
| 500 | Failed to log into the Orbit instance. |

---

#### `GET /api_token/authenticate`

Authenticates the API token provided in the request header.

Header: `{'Authorization': 'Bearer ' + <API TOKEN>}`

**Parameters**: None

**Responses**:

| Code | Description |
|------|-------------|
| 200 | Successfully authenticated. |
| 400 | The provided API token is invalid. |
| 401 | Unauthorized Request response. |

---

### Calendar

#### `GET /calendar/schedule`

Returns calendar events on the specified Orbit instance.

**Parameters**: None

**Responses**:

| Code | Description |
|------|-------------|
| 200 | Successfully retrieved scheduled calendar events. Returns array of `Schedule` objects. |
| 500 | Failed to retrieve calendar events. |

**200 Response Schema** (`application/json`): `Schedule[]`

---

#### `POST /calendar/schedule`

Create a calendar event to play a mission.

**Request Body** (`application/json`):

| Field | Type | Description |
|-------|------|-------------|
| `eventMetadata` | object | Event details (label, etc.) |
| `eventMetadata.label` | string | Label for the calendar event |
| `agent` | object | Robot agent information |
| `agent.agentType` | string | Type of agent |
| `agent.agentId` | string | ID of the agent (robot hostname) |
| `task` | object | Task to execute |
| `task.missionId` | string | UUID of the SiteWalk to play |
| `schedule` | object | Schedule/recurrence configuration |
| `schedule.startDatetime` | string (date-time) | When to start the mission |
| `schedule.repeatEnabled` | boolean | Whether the event repeats |
| `schedule.weeklyRecurrence` | object | Weekly recurrence pattern |

**Responses**:

| Code | Description |
|------|-------------|
| 200 | Successfully created a calendar event. Returns `Schedule` object. |
| 400 | Invalid calendar event request. |
| 500 | Failed to create a calendar event. |

---

#### `DELETE /calendar/schedule/{eventid}`

Removes the specified calendar event.

**Parameters**:

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `eventid` | path | string | Yes | ID of the calendar event |

**Responses**:

| Code | Description |
|------|-------------|
| 200 | Successfully removed a calendar event. |
| 500 | Failed to remove a calendar event. |

---

#### `POST /calendar/disable-enable`

Disable/enable mission scheduled on Orbit.

**Request Body** (`application/json`):

| Field | Type | Description |
|-------|------|-------------|
| `eventId` | string | ID of the calendar event to disable/enable |
| `disable` | boolean | Whether to disable (true) or enable (false) the event |

**Responses**:

| Code | Description |
|------|-------------|
| 200 | Successfully disable/enable a calendar event. |
| 400 | Invalid request. |
| 500 | Failed to disable/enable a calendar event. |

---

### Runs

#### `GET /runs/{runUuid}`

Retrieve a run by its uuid.

**Parameters**:

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `runUuid` | path | string | Yes | ID of Run |

**Responses**:

| Code | Description |
|------|-------------|
| 200 | A run was fetched. Returns `Run` object. |
| 500 | Something went wrong. |

---

#### `GET /runs/{runUuid}/log`

Retrieve a run log from its uuid.

**Parameters**:

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `runUuid` | path | string | Yes | ID of Run |

**Responses**:

| Code | Description |
|------|-------------|
| 200 | A run log was fetched. Returns array of run log entries. |
| 500 | Something went wrong. |

**200 Response Schema** (`application/json`):

```json
[
  {
    "time": "string (date-time)",
    "text": "string"
  }
]
```

---

#### `GET /runs/`

Query a collection of runs.

**Parameters**:

| Name | In | Type | Required | Default | Description |
|------|----|------|----------|---------|-------------|
| `startTime` | query | string (date-time) | No | | Include runs with a start_time >= this value. ISO string format. |
| `endTime` | query | string (date-time) | No | | Include runs with a start_time < this value. ISO string format. |
| `modifiedAt` | query | string (date-time) | No | | Include runs with a modified_at time > this value. ISO string format. |
| `missions` | query | string | No | | Only include runs performing one of the provided missions. Comma-separated list of mission names. |
| `robots` | query | string | No | | Only include runs by one of the provided robots. Comma-separated list of robot nicknames. |
| `limit` | query | integer | No | 20 | Only return a number of resources up to this value. |
| `offset` | query | integer | No | 0 | Begin the query at a specific offset into the collection. |
| `orderBy` | query | string | No | | Criteria for ordering results. |

`orderBy` values: `start_time`, `-start_time`, `modified_at`, `-modified_at`

**Responses**:

| Code | Description |
|------|-------------|
| 200 | Runs were fetched. Returns paginated `Run` collection. |
| 500 | Something went wrong. |

**200 Response Schema** (`application/json`):

```json
{
  "limit": "integer",
  "offset": "integer",
  "total": "integer",
  "resources": ["Run"]
}
```

---

### Run Events

#### `GET /run_events/`

Retrieve a collection of run events.

**Parameters**:

| Name | In | Type | Required | Default | Description |
|------|----|------|----------|---------|-------------|
| `runUuid` | query | string | No | | Include run events associated with a run with this uuid. |
| `runUuids` | query | string | No | | Include run events associated with runs from a comma-separated list of uuids. |
| `robotSerial` | query | string | No | | Include run events produced by a robot with this serial. |
| `missionName` | query | string | No | | Include run events which occurred during playback of a mission with this name. |
| `excludeNonAlerts` | query | boolean | No | false | If true, only include run events that generated an alert. |
| `startTime` | query | string (date-time) | No | | Include run events with a time >= this value. ISO string format. |
| `endTime` | query | string (date-time) | No | | Include run events with a time < this value. ISO string format. |
| `startCreatedAt` | query | string (date-time) | No | | Include run events with a created_at >= this value. ISO string format. |
| `endCreatedAt` | query | string (date-time) | No | | Include run events with a created_at < this value. ISO string format. |
| `limit` | query | integer | No | 20 | Only return a number of resources up to this value. |
| `offset` | query | integer | No | 0 | Begin the query at a specific offset. |
| `orderBy` | query | string | No | | Criteria for ordering results. |

`orderBy` values: `time`, `-time`, `created_at`, `-created_at`

**Responses**:

| Code | Description |
|------|-------------|
| 200 | Run Events were fetched. Returns paginated `RunEvent` collection. |
| 500 | Something went wrong. |

**200 Response Schema** (`application/json`):

```json
{
  "limit": "integer",
  "offset": "integer",
  "total": "integer",
  "resources": ["RunEvent"]
}
```

---

#### `GET /run_events/{runEventUuid}`

Retrieve a single run event by its uuid.

**Parameters**:

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `runEventUuid` | path | string | Yes | ID of the run event |

**Responses**:

| Code | Description |
|------|-------------|
| 200 | A run event was fetched. Returns `RunEvent` object. |
| 500 | Something went wrong. |

---

### Run Captures

#### `GET /run_captures/`

Retrieve a collection of run captures.

**Parameters**:

| Name | In | Type | Required | Default | Description |
|------|----|------|----------|---------|-------------|
| `runEventUuid` | query | string | No | | Include run captures associated with a run event with this uuid. |
| `runEventUuids` | query | string | No | | Include run captures associated with run events from a comma-separated list of uuids. |
| `limit` | query | integer | No | 20 | Only return a number of resources up to this value. |
| `offset` | query | integer | No | 0 | Begin the query at a specific offset. |

**Responses**:

| Code | Description |
|------|-------------|
| 200 | Run Captures were fetched. Returns paginated `RunCapture` collection. |
| 500 | Something went wrong. |

**200 Response Schema** (`application/json`):

```json
{
  "limit": "integer",
  "offset": "integer",
  "total": "integer",
  "resources": ["RunCapture"]
}
```

---

#### `GET /run_captures/{runCaptureUuid}`

Retrieve a single run capture by its uuid.

**Parameters**:

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `runCaptureUuid` | path | string | Yes | ID of the run capture |

**Responses**:

| Code | Description |
|------|-------------|
| 200 | A run capture was fetched. Returns `RunCapture` object. |
| 500 | Something went wrong. |

---

### Run Archives

#### `GET /run_archives/{runArchiveUuid}`

Retrieve a single run archive by its uuid.

**Parameters**:

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `runArchiveUuid` | path | string | Yes | ID of the run archive |

**Responses**:

| Code | Description |
|------|-------------|
| 200 | A run archive was fetched. Returns binary data (`application/octet-stream`). |
| 500 | Something went wrong. |

---

### Run Facets

#### `GET /runs/facets/missions`

Retrieves a list of mission descriptions which match query params.

**Parameters**: Same time-range and filter parameters as `GET /runs/` (startTime, endTime, modifiedAt, missions, robots, limit, offset, orderBy).

**Responses**:

| Code | Description |
|------|-------------|
| 200 | Mission facets delivered. Returns array of `{name, channels}`. |
| 500 | Something went wrong. |

**200 Response Schema** (`application/json`):

```json
[
  {
    "name": "string",
    "channels": ["string"]
  }
]
```

---

#### `GET /runs/facets/robots`

Retrieves a list of robot descriptions which match query params.

**Parameters**: Same time-range and filter parameters as `GET /runs/`.

**Responses**:

| Code | Description |
|------|-------------|
| 200 | Robot facets delivered. Returns array of `{nickname, serial}`. |
| 500 | Something went wrong. |

**200 Response Schema** (`application/json`):

```json
[
  {
    "nickname": "string",
    "serial": "string"
  }
]
```

---

#### `GET /runs/facets/statuses`

Retrieves a list of status descriptions which match query params.

**Parameters**: Same time-range and filter parameters as `GET /runs/`.

**Responses**:

| Code | Description |
|------|-------------|
| 200 | Status facets delivered. Returns array of status strings. |
| 500 | Something went wrong. |

---

### Run Statistics

#### `GET /run_statistics/sessions`

Retrieves a list of session statistics which match query params.

**Parameters**:

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `start` | query | string (date-time) | Yes | Include sessions with a start time >= this value. ISO string format. |
| `end` | query | string (date-time) | Yes | Include sessions with an end time < this value. ISO string format. |
| `minimumSeverity` | query | string | No | Only include sessions which generated anomalies of at least this severity. |
| `robotNicknames` | query | string | No | Include sessions with the specified robot nicknames. |
| `missionNames` | query | string | No | Include sessions with the specified mission names. |
| `includeDispatchFailures` | query | boolean | No | Include sessions that had dispatch failures. |

**Responses**:

| Code | Description |
|------|-------------|
| 200 | Session statistics retrieved successfully. |
| 500 | Failed to retrieve session statistics. |

**200 Response Schema** (`application/json`):

```json
[
  {
    "startTime": "string (date-time)",
    "endTime": "string (date-time)",
    "duration": "integer",
    "robotNickname": "string",
    "robotSerial": "string",
    "missionName": "string",
    "runId": "string",
    "timeMotorsOnS": "integer",
    "timeMovingS": "integer",
    "distanceTraveledM": "number",
    "status": "string",
    "worstSeverity": "string"
  }
]
```

---

#### `GET /run_statistics/sessions_summary`

Retrieves a summary of session statistics which match query params.

**Parameters**:

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `start` | query | string (date-time) | Yes | Include sessions with a start time >= this value. ISO string format. |
| `end` | query | string (date-time) | Yes | Include sessions with an end time < this value. ISO string format. |
| `minimumSeverity` | query | string | No | Only include sessions which generated anomalies of at least this severity. |
| `robotNicknames` | query | string | No | Include sessions with the specified robot nicknames. |
| `missionNames` | query | string | No | Include sessions with the specified mission names. |
| `includeDispatchFailures` | query | boolean | No | Include sessions that had dispatch failures. |

**Responses**:

| Code | Description |
|------|-------------|
| 200 | Session summary statistics retrieved successfully. |
| 500 | Failed to retrieve session summary statistics. |

**200 Response Schema** (`application/json`):

```json
{
  "actionsCompletedPercentage": "number",
  "actionsAttempted": "integer",
  "missionsAttempted": "integer",
  "missionsCompletedPercentage": "number",
  "distanceTraveledM": "number"
}
```

---

### SiteWalks

#### `GET /site_walks/`

Retrieve a collection of all SiteWalks on Orbit.

Returns the entire list of SiteWalks currently on Orbit.

**Parameters**: None

**Responses**:

| Code | Description |
|------|-------------|
| 200 | A list of SiteWalks was fetched. Returns `SiteWalk[]`. |
| 500 | Something went wrong. |

---

#### `GET /site_walks/{uuid}`

Retrieves a single SiteWalk resource by uuid.

A SiteWalk describes a series of tasks that define autonomous robot operation. It contains SiteElements and SiteDocks together with other parameters that define autonomous operation.

**Parameters**:

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `uuid` | path | string | Yes | ID of SiteWalk |

**Responses**:

| Code | Description |
|------|-------------|
| 200 | A SiteWalk was fetched. Returns `SiteWalk` object. |
| 500 | Something went wrong. |

---

#### `POST /site_walks/`

Creates a SiteWalk resource.

A SiteWalk is a collection of tasks that define what a robot should do during an autonomous mission. This endpoint creates a new SiteWalk from the information provided.

**Request Body** (`application/json`): `SiteWalk` object

**Responses**:

| Code | Description |
|------|-------------|
| 200 | A SiteWalk was created. Returns `SiteWalk` object. |
| 500 | Something went wrong. |

---

#### `PATCH /site_walks/{uuid}`

Updates a SiteWalk.

Modifies specified fields of a SiteWalk with the provided values. Supports partial updates.

**Parameters**:

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `uuid` | path | string | Yes | ID of SiteWalk |

**Request Body** (`application/json`): Partial `SiteWalk` object with fields to update.

**Responses**:

| Code | Description |
|------|-------------|
| 200 | The SiteWalk was updated. Returns updated `SiteWalk` object. |
| 500 | Something went wrong. |

---

### SiteElements

#### `GET /site_elements/`

Retrieve a collection of SiteElements.

SiteElements are the individual tasks/inspection points within a SiteWalk.

**Parameters**: None

**Responses**:

| Code | Description |
|------|-------------|
| 200 | SiteElements fetched. Returns `SiteElement[]`. |
| 500 | Something went wrong. |

---

#### `GET /site_elements/{uuid}`

Retrieve a single SiteElement by uuid.

**Parameters**:

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `uuid` | path | string | Yes | ID of SiteElement |

**Responses**:

| Code | Description |
|------|-------------|
| 200 | A SiteElement was fetched. Returns `SiteElement` object. |
| 500 | Something went wrong. |

---

### SiteDocks

#### `GET /site_docks/`

Retrieve a collection of SiteDocks.

SiteDocks represent docking stations where robots can charge.

**Parameters**: None

**Responses**:

| Code | Description |
|------|-------------|
| 200 | SiteDocks fetched. Returns `SiteDock[]`. |
| 500 | Something went wrong. |

---

#### `GET /site_docks/{uuid}`

Retrieve a single SiteDock by uuid.

**Parameters**:

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `uuid` | path | string | Yes | ID of SiteDock |

**Responses**:

| Code | Description |
|------|-------------|
| 200 | A SiteDock was fetched. Returns `SiteDock` object. |
| 500 | Something went wrong. |

---

### Robots

#### `GET /robots/`

Retrieve a collection of robots.

Returns the list of robots registered on the Orbit instance.

**Parameters**: None

**Responses**:

| Code | Description |
|------|-------------|
| 200 | Robots were fetched. Returns `Robot[]`. |
| 500 | Something went wrong. |

---

#### `POST /robots/`

Register a robot with Orbit.

**Security**: Requires `Authorization` header.

**Request Body** (`application/json`):

| Field | Type | Description |
|-------|------|-------------|
| `hostname` | string | The hostname where the robot can be reached |
| `name` | string | A descriptive label for the robot |
| `password` | string | The password used to communicate with the robot |

**Responses**:

| Code | Description |
|------|-------------|
| 200 | Robot registered successfully. |
| 500 | Could not register robot due to server error. |

---

#### `GET /robots/{robotHostname}`

Retrieves a single robot by hostname.

**Parameters**:

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `robotHostname` | path | string | Yes | Hostname of the robot |

**Responses**:

| Code | Description |
|------|-------------|
| 200 | Robot retrieved successfully. Returns `Robot` object. |
| 404 | Could not find robot. |
| 500 | Could not fetch robot due to server error. |

---

#### `DELETE /robots/{robotHostname}`

Removes the specified robot.

**Security**: Requires `Authorization` header.

**Parameters**:

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `robotHostname` | path | string | Yes | Hostname of the robot |

**Responses**:

| Code | Description |
|------|-------------|
| 200 | Robot deleted successfully. |
| 500 | Could not delete robot. |

---

### Webhooks

#### `GET /webhooks/`

Returns a list of webhooks on Orbit.

**Parameters**: None

**Responses**:

| Code | Description |
|------|-------------|
| 200 | Webhooks fetched. Returns `Webhook[]`. |
| 500 | Could not fetch webhooks. |

---

#### `POST /webhooks/`

Create a webhook on Orbit.

**Request Body** (`application/json`):

| Field | Type | Description |
|-------|------|-------------|
| `url` | string | The url of the webhook |
| `enabled` | boolean | Whether the webhook is active |
| `events` | string[] | List of event types to trigger the webhook |

**Responses**:

| Code | Description |
|------|-------------|
| 200 | Webhook created successfully. Returns `Webhook` object. |
| 500 | Could not create a webhook. |

---

#### `GET /webhooks/{uuid}`

Retrieves a webhook by its uuid.

A single registered webhook identified by the unique id.

**Parameters**:

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `uuid` | path | string | Yes | A webhook's uuid |

**Responses**:

| Code | Description |
|------|-------------|
| 200 | Fetched webhook details. Returns `Webhook` object. |
| 500 | Failed to get webhook details. |

---

#### `POST /webhooks/{uuid}`

Updates a specific webhook on Orbit.

**Parameters**:

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `uuid` | path | string | Yes | A webhook's uuid |

**Request Body** (`application/json`):

| Field | Type | Description |
|-------|------|-------------|
| `url` | string | The url of the webhook |
| `enabled` | boolean | Whether the webhook is active |
| `events` | string[] | List of event types to trigger the webhook |

**Responses**:

| Code | Description |
|------|-------------|
| 200 | Webhook updated successfully. Returns `Webhook` object. |
| 500 | Could not update webhook. |

---

#### `DELETE /webhooks/{uuid}`

Removes a specific webhook.

**Parameters**:

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `uuid` | path | string | Yes | A webhook's uuid |

**Responses**:

| Code | Description |
|------|-------------|
| 200 | Webhook deleted successfully. |
| 500 | Could not delete a webhook. |

---

### Missions (DEPRECATED)

> **All endpoints in this section are deprecated.** Use SiteWalk endpoints instead.

#### `GET /missions` (DEPRECATED)

Retrieves a complete list of mission information on Orbit.

**Parameters**: None

**Responses**:

| Code | Description |
|------|-------------|
| 200 | Successfully retrieved missions. Returns `Mission[]`. |
| 500 | Could not fetch missions. |

---

#### `GET /missions/{missionId}` (DEPRECATED)

Retrieves information about a single mission.

**Parameters**:

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `missionId` | path | string | Yes | ID of the mission (matches the uuid field) |

**Responses**:

| Code | Description |
|------|-------------|
| 200 | Successfully retrieved mission details. Returns `Mission` object. |
| 500 | Could not fetch mission. |

---

#### `DELETE /missions/{missionId}` (DEPRECATED)

Removes the specified mission.

**Parameters**:

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `missionId` | path | string | Yes | ID of the mission |

**Responses**:

| Code | Description |
|------|-------------|
| 200 | Mission deleted successfully. |
| 500 | Could not delete mission. |

---

### Anomalies

#### `GET /anomalies`

Get a paginated array of Anomalies.

**Parameters**:

| Name | In | Type | Required | Default | Description |
|------|----|------|----------|---------|-------------|
| `uuid` | query | string | No | | Include Anomalies with this uuid. |
| `runEventUuid` | query | string | No | | Filter by run event uuid. |
| `runEventUuids` | query | string | No | | Comma-separated list of run event uuids. |
| `runUuid` | query | string | No | | Filter by run uuid. |
| `startTime` | query | string (date-time) | No | | Include anomalies with a time >= this value. |
| `endTime` | query | string (date-time) | No | | Include anomalies with a time < this value. |
| `limit` | query | integer | No | 20 | Only return up to this many resources. |
| `offset` | query | integer | No | 0 | Begin the query at a specific offset. |
| `orderBy` | query | string | No | | Criteria for ordering results. |
| `severity` | query | integer | No | | Filter by severity level. |
| `status` | query | string | No | | Filter by anomaly status. |

`orderBy` values: `time`, `-time`, `created_at`, `-created_at`

**Responses**:

| Code | Description |
|------|-------------|
| 200 | Anomalies were fetched. Returns paginated `Anomaly` collection. |
| 500 | Something went wrong. |

**200 Response Schema** (`application/json`):

```json
{
  "limit": "integer",
  "offset": "integer",
  "total": "integer",
  "resources": ["Anomaly"]
}
```

---

#### `GET /anomalies/{uuid}`

Retrieve a single Anomaly by its uuid.

**Parameters**:

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `uuid` | path | string | Yes | ID of the anomaly |

**Responses**:

| Code | Description |
|------|-------------|
| 200 | An anomaly was fetched. Returns `Anomaly` object. |
| 500 | Something went wrong. |

---

#### `POST /anomalies/{uuid}`

Update an Anomaly on Orbit.

**Parameters**:

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `uuid` | path | string | Yes | ID of the anomaly |

**Request Body** (`application/json`):

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | The new status for the anomaly (`open` or `closed`) |

**Responses**:

| Code | Description |
|------|-------------|
| 200 | An anomaly was updated. Returns updated `Anomaly` object. |
| 500 | Something went wrong. |

---

### Backup Tasks

#### `GET /backup_tasks`

Get a list of backup tasks.

**Parameters**: None

**Responses**:

| Code | Description |
|------|-------------|
| 200 | Backup tasks fetched. Returns `BackupTask[]`. |
| 500 | Something went wrong. |

---

#### `POST /backup_tasks`

Create or update a backup task.

**Request Body** (`application/json`):

| Field | Type | Description |
|-------|------|-------------|
| `enabled` | boolean | Whether the backup task is enabled |
| `schedule` | object | Schedule configuration for the backup |
| `retention` | object | Retention policy configuration |
| `destination` | object | Backup destination configuration |

**Responses**:

| Code | Description |
|------|-------------|
| 200 | Backup task created/updated successfully. |
| 500 | Something went wrong. |

---

### Backups

#### `GET /backups`

Get a list of backups.

**Parameters**: None

**Responses**:

| Code | Description |
|------|-------------|
| 200 | Backups fetched. Returns `Backup[]`. |
| 500 | Something went wrong. |

---

#### `GET /backups/{uuid}`

Retrieve a single backup.

**Parameters**:

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| `uuid` | path | string | Yes | ID of the backup |

**Responses**:

| Code | Description |
|------|-------------|
| 200 | A backup was fetched. Returns binary data (`application/octet-stream`). |
| 500 | Something went wrong. |

---

## Schemas

### Anomaly

An anomaly/alert detected by a Spot mission element.

| Field | Type | Description |
|-------|------|-------------|
| `uuid` | string | The unique identifier for the anomaly |
| `time` | string (date-time) | When the anomaly occurred |
| `createdAt` | string (date-time) | When the anomaly was stored |
| `elementId` | string | The site element that triggered the anomaly |
| `assetId` | string | The asset ID associated with the anomaly |
| `name` | string | Name of the anomaly |
| `severity` | integer | Severity level |
| `title` | string | Title of the anomaly |
| `source` | string | Source of the anomaly |
| `runUuid` | string | UUID of the run that generated this anomaly |
| `runEventUuid` | string | UUID of the run event |
| `status` | string | Status of the anomaly. Enum: `open`, `closed` |
| `statusModifiedAt` | string (date-time) | When the status was last modified |
| `statusModifiedBy` | string | Who modified the status |

---

### Schedule

A schedule describes when and how often a robot should execute an autonomous mission.

| Field | Type | Description |
|-------|------|-------------|
| `eventMetadata` | object | Event metadata (label, etc.) |
| `agent` | object | Agent information (agentType, agentId) |
| `task` | object | Task to execute (missionId) |
| `schedule` | object | Schedule/recurrence (startDatetime, repeatEnabled, weeklyRecurrence) |

---

### Robot

A Robot is a data structure representing a robot used to execute autonomous operations.

| Field | Type | Description |
|-------|------|-------------|
| `robotIndex` | integer | The index at which this robot is registered (0 to max, typically 32) |
| `hostname` | string | The hostname where the robot can be reached |
| `nickname` | string | A descriptive label for the robot |
| `username` | string | The username used to communicate with the robot |
| `password` | string | The password used to communicate with the robot |
| `lastKnownSerial` | string | The serial number of the robot |
| `availableForSchedule` | boolean | Whether the robot is available for scheduled missions |

---

### Run

A Run represents the output of a single autonomous operation.

| Field | Type | Description |
|-------|------|-------------|
| `uuid` | string | A unique identifier for this run |
| `missionName` | string | The name of the mission this run played |
| `missionStatus` | string | The status of the mission this run played |
| `robotNickname` | string | The nickname of the robot which played this mission |
| `robotSerial` | string | The serial of the robot which played this mission |
| `startTime` | string (date-time) | When this run started |
| `endTime` | string (date-time) | When this run ended |
| `createdAt` | string (date-time) | When this run was stored in Orbit |
| `modifiedAt` | string (date-time) | When this run was last modified in Orbit |
| `closedAt` | string (date-time) | When this run was closed |
| `operatorId` | string | The username of the driver |
| `robotSoftwareMajorVersion` | integer | Robot software major version during operation |
| `robotSoftwareMinorVersion` | integer | Robot software minor version during operation |
| `robotSoftwarePatchVersion` | integer | Robot software patch version during operation |
| `robotSoftwareGitHash` | string | Version hash of the robot software used during operation |

---

### RunEvent

A RunEvent represents the output of an action executed during a Run. It contains all the RunCaptures associated with the action.

| Field | Type | Description |
|-------|------|-------------|
| `uuid` | string | A unique identifier for this run event |
| `runUuid` | string | The uuid of the run this event belongs to |
| `time` | string (date-time) | When the event occurred |
| `createdAt` | string | When the event was stored |
| `actionName` | string | The name of the action performed |
| `actionRunArchiveFileUrl` | string | URL to the action's archive file |
| `error` | integer | Error code (0 = no error) |
| `actionUuid` | string | UUID of the action |
| `missionName` | string | Name of the mission |
| `metadataFileUrl` | string | URL to the metadata file |
| `eventType` | string | Type of event. Enum: `daq`, `navigation`, `dock`, `undock`, `return_to_dock`, `initialize` |
| `dataCaptures` | RunCapture[] | Array of data captures from this event |

---

### RunCapture

A RunCapture represents a single piece of data captured during a RunEvent.

| Field | Type | Description |
|-------|------|-------------|
| `time` | string (date-time) | When the capture occurred |
| `uuid` | string | A unique identifier for this capture |
| `runEventUuid` | string | The uuid of the run event this capture belongs to |
| `channelName` | string | The name of the channel that produced this capture |
| `dataUrl` | string | The path to the file holding this result's data |
| `createdAt` | string | When the result was stored in Orbit |
| `keyResults` | object[] | A collection of key value pairs summarizing this result |
| `actionChannelRunFlagUuid` | string | A unique identifier for a flag on this data |

---

### SiteWalk

A SiteWalk describes a series of tasks that define autonomous robot operation. It contains SiteElements and SiteDocks together with other parameters that define autonomous operation.

| Field | Type | Description |
|-------|------|-------------|
| `uuid` | string | Unique identifier for the SiteWalk |
| `name` | string | The name for the SiteWalk |
| `siteElementIds` | string[] | References to elements in this walk in the order they will be visited |
| `globalParameters` | object | Parameters that apply to the entire mission |
| `siteDockIds` | object | References to docks used in this walk |
| `createdAt` | string | When the SiteWalk was stored in Orbit |
| `modifiedAt` | string | When the SiteWalk was modified in Orbit |
| `siteElementMetadata` | object | Metadata about elements in this walk |
| `targetFailureBehavior` | object | What to do when a target fails |
| `actionFailureBehavior` | object | What to do when an action fails |
| `preferRecordedRoutes` | boolean | Whether or not to take shortcuts |
| `batteryMonitor` | object | Battery monitoring configuration |
| `travelParams` | object | Travel parameters |
| `entityParams` | object | Entity parameters |
| `skipDockingAfterCompletion` | boolean | Whether or not to dock after executing all actions |

---

### SiteElement

A SiteElement describes what a robot should do and where to do it.

| Field | Type | Description |
|-------|------|-------------|
| `uuid` | string | Unique identifier for the SiteElement |
| `name` | string | The name for the SiteElement |
| `actions` | object[] | List of actions to perform at this element |
| `targetType` | string | Type of the target (e.g., waypoint) |
| `targetId` | string | ID of the target |

---

### SiteDock

A SiteDock represents a docking station.

| Field | Type | Description |
|-------|------|-------------|
| `uuid` | string | Unique identifier for the SiteDock |
| `dockId` | string | ID of the dock |
| `name` | string | The name for the SiteDock |

---

### Webhook

A Webhook is a data structure containing information about a registered webhook.

| Field | Type | Description |
|-------|------|-------------|
| `uuid` | string | Unique identifier for the webhook |
| `url` | string | The url of the webhook |
| `enabled` | boolean | Whether the webhook is active |
| `events` | string[] | List of event types that trigger the webhook |
| `createdAt` | string | When the webhook was registered |

---

### Mission (DEPRECATED)

| Field | Type | Description |
|-------|------|-------------|
| `uuid` | string | Unique identifier for the mission |
| `mission_id` | string | Mission ID |
| `name` | string | Name of the mission |
| `saved_at` | string (date-time) | When the mission was saved |

---

### BackupTask

| Field | Type | Description |
|-------|------|-------------|
| `uuid` | string | Unique identifier |
| `enabled` | boolean | Whether the backup task is enabled |
| `schedule` | object | Schedule configuration |
| `retention` | object | Retention policy |
| `destination` | object | Backup destination |

---

### Backup

| Field | Type | Description |
|-------|------|-------------|
| `uuid` | string | Unique identifier |
| `status` | string | Backup status |
| `createdAt` | string | When the backup was created |
| `size` | integer | Size of the backup |

---

## Endpoint Summary Table

| # | Method | Path | Tag | Deprecated |
|---|--------|------|-----|------------|
| 1 | POST | `/login` | Authentication | Yes |
| 2 | GET | `/api_token/authenticate` | Authentication | No |
| 3 | GET | `/calendar/schedule` | Calendar | No |
| 4 | POST | `/calendar/schedule` | Calendar | No |
| 5 | DELETE | `/calendar/schedule/{eventid}` | Calendar | No |
| 6 | POST | `/calendar/disable-enable` | Calendar | No |
| 7 | GET | `/runs/{runUuid}` | Runs | No |
| 8 | GET | `/runs/{runUuid}/log` | Runs | No |
| 9 | GET | `/runs/` | Runs | No |
| 10 | GET | `/run_events/` | Run Events | No |
| 11 | GET | `/run_events/{runEventUuid}` | Run Events | No |
| 12 | GET | `/run_captures/` | Run Captures | No |
| 13 | GET | `/run_captures/{runCaptureUuid}` | Run Captures | No |
| 14 | GET | `/run_archives/{runArchiveUuid}` | Run Archives | No |
| 15 | GET | `/runs/facets/missions` | Run Facets | No |
| 16 | GET | `/runs/facets/robots` | Run Facets | No |
| 17 | GET | `/runs/facets/statuses` | Run Facets | No |
| 18 | GET | `/run_statistics/sessions` | Run Statistics | No |
| 19 | GET | `/run_statistics/sessions_summary` | Run Statistics | No |
| 20 | GET | `/site_walks/` | SiteWalks | No |
| 21 | GET | `/site_walks/{uuid}` | SiteWalks | No |
| 22 | POST | `/site_walks/` | SiteWalks | No |
| 23 | PATCH | `/site_walks/{uuid}` | SiteWalks | No |
| 24 | GET | `/site_elements/` | SiteElements | No |
| 25 | GET | `/site_elements/{uuid}` | SiteElements | No |
| 26 | GET | `/site_docks/` | SiteDocks | No |
| 27 | GET | `/site_docks/{uuid}` | SiteDocks | No |
| 28 | GET | `/robots/` | Robots | No |
| 29 | POST | `/robots/` | Robots | No |
| 30 | GET | `/robots/{robotHostname}` | Robots | No |
| 31 | DELETE | `/robots/{robotHostname}` | Robots | No |
| 32 | GET | `/webhooks/` | Webhooks | No |
| 33 | POST | `/webhooks/` | Webhooks | No |
| 34 | GET | `/webhooks/{uuid}` | Webhooks | No |
| 35 | POST | `/webhooks/{uuid}` | Webhooks | No |
| 36 | DELETE | `/webhooks/{uuid}` | Webhooks | No |
| 37 | GET | `/missions` | Missions | Yes |
| 38 | GET | `/missions/{missionId}` | Missions | Yes |
| 39 | DELETE | `/missions/{missionId}` | Missions | Yes |
| 40 | GET | `/anomalies` | Anomalies | No |
| 41 | GET | `/anomalies/{uuid}` | Anomalies | No |
| 42 | POST | `/anomalies/{uuid}` | Anomalies | No |
| 43 | GET | `/backup_tasks` | Backup Tasks | No |
| 44 | POST | `/backup_tasks` | Backup Tasks | No |
| 45 | GET | `/backups` | Backups | No |
| 46 | GET | `/backups/{uuid}` | Backups | No |

---

## v5.0.0 vs v4.1.1 Differences (Notable)

Key additions/changes in v5.0.0 compared to the live v4.1.1 instance:

1. **Backup Tasks & Backups** - New sections: `GET/POST /backup_tasks`, `GET /backups`, `GET /backups/{uuid}`
2. **Run Statistics** - New section: `GET /run_statistics/sessions`, `GET /run_statistics/sessions_summary`
3. **Run Facets** - New section: `GET /runs/facets/missions`, `GET /runs/facets/robots`, `GET /runs/facets/statuses`
4. **SiteWalks PATCH** - `PATCH /site_walks/{uuid}` for partial updates (v4.1.1 only had GET/POST)
5. **Calendar disable-enable** - `POST /calendar/disable-enable` for toggling scheduled events
6. **Missions section** - Fully deprecated in v5.0.0 with explicit warnings to use SiteWalk instead
