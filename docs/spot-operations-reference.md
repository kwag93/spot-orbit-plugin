# Spot Operations Reference

Operational concepts, site preparation, navigation, and safety functions.
Source: BD Support Articles 49955, 105285, 49934, 77114, 49928, 49954, 49914

---

## Start Spot (49955)

### Prerequisites

Before starting, ensure Spot:
- Has a charged battery
- Is unplugged from power and Ethernet
- Has power plug cover and Ethernet port cover inserted
- Has at least 2 meters clearance in all directions

### Startup Sequence

**Step 1 — Power on computers:**
- Press and hold **Power button** for 2 seconds
- Fans spin for ~2 minutes while computers boot and WiFi comes online
- Ready when fans quiet down and front status lights show **solid blue**

**Step 2 — Reset motor lockout:**
- Press **Motor Lockout button** on rear of Spot
- Button illuminates red and blinks slowly = lockout reset
- Spot will not move yet; requires deliberate start command

> **Caution:** If a software start command is pending when lockout is reset, Spot may immediately start motors.

**Step 3 — Start motors:**

| Mode | Controller | Start Command |
|---|---|---|
| Manual | Spot App on tablet | Start button in app |
| Remote | Orbit | Start via Orbit UI |
| Automatic | Scheduled missions | Motors start automatically for scheduled/looping Autowalk |

- Motor lockout button blinks quickly during startup, then glows **steady red** when motors are running

> **Caution:** Once started, Spot may move suddenly and unexpectedly.

---

## Network Readiness Tests (105285)

### Prerequisites

Before running network tests, confirm:
- Network has been prepared per BD network requirements
- Spot is connected to the network (WiFi or Ethernet)
- Orbit is set up and reachable
- Spot Dock is connected (if applicable)
- Firewall rules are configured (see spot-firewall-reference.md)
- Chrome browser is available

### Running Automated Network Checks

Network checks are available in three locations:

| Location | Path |
|---|---|
| Spot Admin Console | Admin Console → Network Setup |
| Orbit | Settings → Networks |
| Core I/O Web Panel | Core I/O → Networks |

### Performance Targets

| Metric | Target |
|---|---|
| Latency | < 100 ms |
| Receive throughput | > 1 Mbps |
| Transmit throughput | > 1 Mbps |

### Confirming Spot Operation

- Verify Spot operates correctly over **Ethernet** connection
- Verify Spot operates correctly over **WiFi** connection

### Troubleshooting

- Ensure URL uses `https://` (not `http://`)
- Verify Admin credentials are correct
- Check network configuration matches expected IP ranges
- Review firewall rules if connectivity tests fail

---

## What Is Autowalk (49934)

### Key Concepts

| Term | Definition |
|---|---|
| Map | A graph of waypoints and edges representing the environment |
| Waypoint | A recorded pose, created approximately every 2 meters during recording |
| Edge | A connection between two waypoints that Spot traverses |
| Action | A task Spot performs at a waypoint (e.g., capture image, call API) |
| Mission | A complete set of waypoints, edges, and actions for autonomous operation |
| Route | A sequence of waypoints Spot follows |
| Area | A defined zone within a map |
| Localization | The process of Spot determining its position within a known map |
| Fiducial | An AprilTag used as a visual landmark for localization |
| Loop | A mission structure where Spot returns to the start waypoint |
| Recording | The process of creating a new map by driving Spot manually |
| Extension | An SPX payload app that adds custom actions to missions |
| Site Map | An Orbit-level map combining multiple recordings into one navigable space |

### Recording

Recording a mission creates a `.walk` folder containing:
- The waypoint/edge map
- Mission data (actions, annotations)

### Site Maps

Orbit combines multiple recordings into a unified site map, enabling navigation across large areas with multiple recording sessions.

---

## About Fiducials (77114)

### Specification

- Tag family: **AprilTag Tag36h11**
- Default size: **146mm square**
- Print on: non-glossy white paper or material

### Fiducial ID Ranges

| Range | Purpose |
|---|---|
| 1–299 | Localization (navigation) |
| 520–549 | Spot Dock |
| 580–584 | Spot Station |
| 585–586 | Mission interrupts (pause/resume) |

**Do not use 500-series fiducials for general navigation.**

### Placement Rules

- Place one fiducial at **each mission start point**
- Mount at **45–60 cm height** from the floor on walls
- Place every **3 meters** in featureless areas (no distinguishing features for visual odometry)
- Place at **intersections** and decision points

### Placement Restrictions

- Do not use duplicate fiducial IDs in the same map
- Do not place fiducials where they are backlit (light source behind the tag)
- Do not place fiducials in movable locations (on doors, carts, equipment)
- Do not use 500-series IDs for navigation purposes

### Custom Sizes

Custom fiducial sizes can be configured in Admin Console → General Settings.

---

## How Spot Avoids Obstacles (49928)

### Sensor Configuration

Spot has **5 depth cameras**:
- 2 front-facing
- 1 rear-facing
- 1 left side
- 1 right side

### Known Coverage Gaps

- **Rear corners**: ~45° blind spot from each rear hip
- **Front**: Coverage tapers at approximately 2 meters ahead

### Obstacle Memory

Spot maintains an obstacle memory map. Obstacles detected earlier persist in memory even when they leave the camera's field of view, helping navigate around previously seen hazards.

### Limitations

| Limitation | Description |
|---|---|
| Moving obstacles | Spot may not react quickly to fast-moving objects |
| Very close detection | Objects closer than minimum detection range may not be seen |
| Always-in-gap obstacles | Obstacles permanently in a coverage gap cannot be detected |

### Clearance Settings

| Parameter | Value |
|---|---|
| Default minimum clearance | 7.5 cm |
| Adjustable cushion | Up to +50 cm additional margin |

---

## Spot Stopping Functions (49954)

### Operational Stops

| Trigger | Behavior |
|---|---|
| Signal loss | Robot stops and waits |
| Fall detection (smart freeze) | Robot freezes motors on detection of fall to prevent injury |
| Low battery | Robot stops and sits down |
| Controller input | Stop button on tablet or gamepad |
| Mission interrupt fiducials (585/586) | Robot pauses mission when fiducial is detected |

### Safety-Related Stop (Hardware)

- **Input**: External safe input via payload port
- **Category**: Cat 0 per IEC 60204-1 (immediate power removal)
- **Performance Level**: ISO 13849-1:2023 Category 1, PL c
- **Max response time**: 200 ms
- **Max stopping distance**: 1 m on flat surface

### E-Stop Button

- **Location**: Top right rear of robot
- **Standard**: ISO 13830
- **Reset**: Requires manual reset after activation (not automatic)

---

## Prepare Your Site (49914)

### Space Requirements

| Configuration | Required Clearance |
|---|---|
| Spot (base) | 2 m radius |
| Spot with Arm | 3 m radius |
| Spot Dock | 1.6 m wide × 2.5 m deep |

### Signage and Zone Markings

- Post safety signage at all entry points to robot operating areas
- Mark robot operating zones with floor tape or barriers
- Install stair barriers where applicable

### Stair Requirements

| Parameter | Requirement |
|---|---|
| Max horizontal gap | 30 cm |
| Max vertical step | 23 cm |
| Floor coefficient of friction | ≥ 0.4 |
| Anti-skid on stairs | Required |

### Door Modifications

- **Spot Arm**: Doors must be wide enough for arm reach (modify door hardware as needed)
- **Relay-activated doors**: Spot can trigger relay-controlled automatic doors via payload integration

### Floor and Environment Preparation

- Keep floors clean of debris and liquids
- Mark storage locations to prevent obstacles in robot paths
- Cover or mark transparent surfaces (glass walls, floors)
- Cover or mark reflective surfaces that interfere with depth cameras

---

## Moving Object Detection (EAP 2)

Spot robots with EAP 2 can detect people, vehicles, and other moving objects during autonomous operation.

> **Caution:** Moving object detection is disabled while opening and walking through a door (if Spot Arm is attached).

### Visualization

Enable in Spot App: Perception Status panel > DISPLAY > **Show Moving Objects** (visualization only, no behavior change).

- **Yellow box + icon**: Moving person detected
- **Green box**: Other moving objects (forklifts, robots)

### Spot Crosswalk Action

Spot stops and waits for a crosswalk area to be clear of moving objects before proceeding.

**Parameters:**
- **CROSSWALK LEFT-RIGHT BUFFER**: Detection range left/right of Spot
- **TIME TO WAIT**: Wait duration for objects to clear (always waits at least 2 sec)
- **BEHAVIOR ON TIMEOUT**: Proceed through (with obstacle avoidance) or reroute around

**Recording procedure:**
1. During Autowalk recording: + Add Action > ACTIONS > **Spot Crosswalk**
2. Configure parameters
3. Position Spot at crosswalk start, select **CONFIRM START**
4. Drive through crosswalk area
5. Select **CONFIRM END**

> **Tip:** Crosswalk should not exceed 10 meters in length.

### Stairs Clearance Check

Spot pauses at stairs to check for people before traversing.

> **Warning:** Detection range is fixed. Not a substitute for safety restrictions. Never traverse stairs simultaneously with autonomous Spot.

**Parameters:**
- **STAIRS WIDTH**: Full width to check for people
- **TIME TO WAIT**: Wait duration (minimum 2 sec)
- **BEHAVIOR ON TIMEOUT**: Proceed or reroute

**Recording procedure:**
1. During Autowalk recording: + Add Action > ACTIONS > **Stairs Clearance Check**
2. Position Spot ~1 meter back from stairs (room for people to pass)
3. Select **CONFIRM START**
4. Drive up/down staircase (cannot confirm start/end while on stairs)
5. Position ~1 meter from last step, select **CONFIRM END**

> **Caution:** Only use Stairs Clearance Check where there is space for a person to move past Spot and where Spot can fully turn around.

---

## Record an Autowalk Mission (49960)

### Prerequisites

- At least one Fiducial marker must be placed in the operating environment
- To start/end at a Spot Dock, include a docking Action in the recording

### Recording Procedure

1. Spot App → Modes → **AUTOWALK** → **RECORD**
2. Enter a mission map name → **CONTINUE**
3. **START RECORDING**
4. Drive Spot and perform Actions
5. **FINISH RECORDING** → **YES**

### Post-Recording Options

- **CONTINUE TO MISSION REPLAY**: Verify the recorded route (looping playback recommended)
- **RETURN TO DOCK**: Return to the recorded Dock
- **DOWNLOAD DATA**: Transfer data captured during recording to the tablet

### Adding Actions

1. Navigate to the position where the Action should be performed during recording
2. **Add Action** → select from the INSPECTIONS or ACTIONS tab
3. Create the Action following the prompts

### Adding Docks

Docks included in a mission:
- The Dock that was docked when recording started
- Docks added via **Add Dock to Mission**
- The Dock used when ending with **Dock & Finish Recording**

Including multiple Docks increases options for mission start/end/charging locations.

### Pause / Resume

- Selecting **Pause** pauses recording → allows Spot repositioning/backtracking (no new path created)
- Selecting **Record** resumes (Spot must be near the previously recorded path)

### Undo

1. Long-press **↶ Undo** → backtracking begins after a 2-second timer
2. At each Action recording location, a 2-second timer triggers deletion
3. Releasing confirms at the nearest waypoint
4. Undo cannot be reversed and only affects items added in the current recording session
5. Docks cannot be undone

---

## Run Autowalk Missions with the Spot App (49961)

Play or schedule Autowalk missions immediately from the Spot App on the tablet controller.

### Play Now

1. Mission with Dock: position Spot at that Dock. Without Dock: position within Fiducial line of sight
2. Spot App → AUTOWALK → **PLAYBACK**
3. Select a mission → **CONTINUE**
4. Review Action/route parameters → **CONTINUE**
5. Review Supervision settings
6. **PLAY NOW** → (INITIALIZE if needed) → **Play**

### Play Later (Scheduled)

- Mission must include at least one Dock
- Spot must be at that Dock
- Set date/time, and for loops set an end time or "Play forever"
- Tablet must remain powered on and connected to Spot

### Pause / Resume

- **Pause**: Pauses the mission → switches to manual control
- **Play**: Resumes the mission

---

## Autowalk Mission Replay Options (121347)

Options that modify Spot's behavior during mission playback. When running from Orbit, the Orbit mission editor settings are used.

### Self-Right Attempts

Limits the number of automatic self-righting attempts when Spot falls over.

### Docking Behavior

- **Minimum charge for undocking**: Spot will not start or resume a mission until this charge level is reached
- **Charge to return to dock**: If battery drops below this level, Spot returns to the nearest Dock

> The return to dock setting should always be set sufficiently lower than the undocking setting.

### Ground Clutter Avoidance

- ON: Detects and avoids low obstacles, excluding objects that were stepped on during recording
- Forklift-aware: Treats forklift tines as ground clutter (requires Moving Object Detection)

### Take Shortcuts

- YES: Uses the most efficient path that includes all active Actions
- NO: Follows the recorded route exactly

### Strict Path Following

When ON, Spot moves only within ~0.25m of the recorded path. Obstacle detours are not possible.

### Path Planner

| Setting | Detection range | Path deviation | Use case |
|---------|----------------|---------------|----------|
| Short range (default) | 2m | 1.5m | General use |
| Long range (live only) | 8m | 3m | Dynamic environments with frequent obstacles |
| Long range (live + recorded) | 8m | 3m | Static environments with few changes |

### Patience

Wait time before attempting a detour when a person or obstacle is blocking the path.

### Goal Distance

How close Spot must get to the recorded location to perform an Action. Can be overridden by Action-level parameters.

### Moving Objects (requires EAP 2)

| Setting | Behavior |
|---------|----------|
| Off | Basic obstacle avoidance only |
| Nearby | Stops when a moving object is detected within 1.5m, resumes after 6 seconds |
| Nearby and ahead | Also detects moving objects within 8m ahead (recommended for low-traffic remote sites) |

### Action/Navigation Failure Behavior

- **Prompt timeout**: Time to wait for operator response
- **Retry count**: Number of retries
- **Default Behavior**: proceed / sit and power off / return to dock

### Autowalk Mode (Spot App only)

- Single run or loop
- Loop: repeats at a time interval until cancelled, battery depleted, or connection lost

### Mission Interrupts

Responds when specific signals/events are detected during a mission:
- Sit and power off motors
- Return to Dock via shortest path and end mission
- Photograph detected person and send notification to Orbit

---

## Extend an Autowalk Mission (78579)

Add new routes and Actions to an existing recorded Autowalk mission. Useful for creating complex missions with branching paths and loops.

### Mission Extension Procedure

1. Start mission playback
2. **Pause** at the point where you want to extend
3. **EXTEND MISSION** → confirm
4. Drive Spot and perform Actions
5. **FINISH RECORDING** → **YES**

### Adding Actions to an Existing Route

1. **Pause** during mission playback
2. **EXTEND MISSION** → **ADD ACTION**
3. Create the Action
4. Resume playback with **Play** or exit with **EXIT AUTOWALK**

---

## How to Record Optimal Autowalk Routes (121348)

Best practices for optimal Autowalk recording.

### Characteristics of an "Optimal" Route

- Based on pre-planning of inspection targets, methods, and navigation paths
- Includes alternative routes in case the primary path is blocked
- Annotated for specific zones (per-edge settings, area callbacks)
- Robust against temporary obstacles, ground clutter, and pedestrian traffic
- Minimizes backtracking, duplicate waypoints, and unnecessary edges

### Route Planning

1. Mark inspection targets on a facility map; mark Dock locations as well
2. Draw routes that include loops and alternative paths
3. For large facilities, split recording into sessions (for battery management, odometry drift, and modularity)
4. Walk the facility to attach temporary labels to inspection targets and note navigation challenges
5. Manually drive Spot along the route to validate it
6. Place Fiducials

### Key Recording Tips

- **Start from a Dock**: The Dock is automatically included in the map
- **Move in the playback direction**: Match the direction expected during mission playback
- **Maintain 4m+ distance**: Prevent blocking Spot's field of view
- **Pass within 1m of Fiducials**: Ensures accurate localization
- **Use Pause to avoid path overlap**: When reaching dead ends or returning to a previous route
- **Close loops**: A Fiducial must be recorded twice for the loop to close
- **STRICT PATH mode**: Maintains a dedicated robot lane in areas with pedestrian traffic
- **Slippery floors**: Use Crawl gait and adjust the Ground Friction slider

### Inspection Recording Tips

- Approach targets smoothly (frequent minor adjustments create unnecessary edges/waypoints)
- Minimize body pose adjustments (use Spot Cam PTZ instead)
- Ensure the camera roll cage is not visible in images
- Minimize background motion and depth variation
- Move closer to the target rather than zooming in; keep zoom at 10x or below
- Add descriptive names, asset IDs, and metadata

---

## Creating Autowalk Template Missions (72013)

When recording multiple missions that start with the same route, record a template mission first and reuse it.

### Creating a Template

1. Start recording a new Autowalk mission from a Dock (include "template" in the name)
2. Record the route up to the Fiducial near the inspection area
3. End recording at the Fiducial
4. Remove the "Start" and "End Recording" Actions from the tablet

### Creating a New Mission from a Template

1. Copy the template folder from `.../Documents/bosdyn/autowalk` and give it a unique name
2. Move Spot to the Fiducial at the inspection area
3. Start playback of the new mission → immediately **Pause** → **EXTEND MISSION**
4. Record the remaining route, then return to the Fiducial and end recording
5. During playback, Spot uses the previously recorded route to return to the Dock

---

## Mission Prompts and Operator Intervention (49959)

Prompts that request operator input when autonomous operation cannot proceed due to navigation issues or other problems.

### Prompt Response Options

| Response | Description |
|----------|-------------|
| **TRY AGAIN** | Continue attempting to follow the mission route |
| **TRY TO REROUTE** | Calculate an alternative route based on the recorded path |
| **SKIP** | Skip the next Action and proceed to subsequent Actions |
| **RETURN TO DOCK AND TERMINATE** | Return to the nearest Dock and abort the mission |

### Where Prompts Appear

- Displayed to all operators connected via the Spot App (tablet) or as viewers in Orbit
- Shown on the Orbit homepage; email notifications can be configured
- Timeout and no-response behavior are configured in Autowalk Mission Replay Options

---

## Interrupt an Autowalk Mission (214619)

Performs predetermined behaviors when specific triggers/events are detected during a mission.

### Mission Interrupt Fiducials

- **Fiducial 585**: Triggers Safe Power Off
- **Fiducial 586**: Triggers Return to Dock
- Cannot be used for navigation/localization
- Detected only by body cameras, within 4 m
- Physical printing not required (mobile device screen also works)

### Interrupt Behaviors

| Behavior | Description | Default |
|----------|-------------|---------|
| **Safe Power Off** | Fiducial 585 detected → sit and power off motors. Waits indefinitely | ON |
| **Return to Dock** | Fiducial 586 detected → return to dock via shortest path, end mission | ON |
| **Security Patrol** | Person detected → stop, flash red/blue A/V lights, Spot Cam captures, Orbit alert | OFF (requires Spot Cam + EAP 2) |

### Safe Power Off Recovery

- Leave the fiducial in place and manually drive Spot away, or
- Remove the fiducial and tell Spot to continue the mission

> If Fiducial 585 is detected while on stairs, Spot navigates off the staircase first before sitting and powering off.

### Priority Levels

failure behaviors > safe power off > return to dock > custom interrupts

---

## Drive Spot with the Tablet Controller

Source: https://support.bostondynamics.com/s/article/Drive-Spot-with-the-Tablet-Controller-49948

### Drive Mode Controls

| Control | Description |
|---------|-------------|
| Left joystick | Move forward, backward, left, right |
| Right joystick | Rotate clockwise/counterclockwise |
| Touch-to-Go | Spot walks to selected location; select X to cancel |
| Height slider | Adjust walking height |
| Speed slider | SLOW, MED, FAST |
| Pose selector (long-press) | Sit, Stand (joysticks control height/roll/pitch/yaw), Self Right |
| Gait selector (long-press) | Walk (regular) or Crawl (slow) |
| Directional arrows | Switch camera views |
| Add Action | Programmable behaviors (capture image, dock, etc.) |

### Autowalk Mode Controls

Additional controls beyond Drive mode:
- **Finish recording** — End recording and save mission
- **Path following tolerance**: WIDE PATH (default, ±3m deviation) or STRICT PATH (25cm corridor)
- **Pause** — Reposition Spot without recording duplicate paths
- **Undo** — Hold to undo recent activity

---

## Spot App Menus and General Controls

Source: https://support.bostondynamics.com/s/article/Spot-App-Menus-and-General-Controls-49952

The Spot App is the primary Android application for controlling Spot via tablet controller.

### Menu Bar

| Panel | Description |
|-------|-------------|
| Menu (≡) | App-wide settings and features |
| Modes | Switch between Drive, Autowalk, and other modes |
| Cameras | Robot cameras, Top Down view, Cameras Off |
| Controller | Gamepad (joysticks) or Hand (Touch-to-Go) |
| Motor Status | Power on/off, lock/unlock drive controls, take/release control |
| Robot Controls | Obstacle avoidance, stairs mode, grated floor, ground friction, step height |
| Robot Health | Report Bug (30s log), Start Log (up to 10 min recording) |
| Comms Status | Network connection info (flashes yellow on poor connection) |
| Battery Status | Battery state and performance info |
| STOP | Suspend all robot motion |

### Main Menu Items

| Item | Description |
|------|-------------|
| ABOUT | Serial number, software versions, license |
| ADMIN CONSOLE | Access Spot Admin Console in-app |
| DOWNLOAD DATA | Transfer action data from Spot to tablet |
| SETTINGS > ACTIONS | Configure default Actions/Inspections |
| SETTINGS > COMMS | Configure loss-of-signal behavior |
| SETTINGS > TABLET | Language and temperature units |
| SETTINGS > Profiles | UI customization profiles |
| UTILITIES > ATTACH PAYLOADS | Power payload ports on/off, set payload status |
| UTILITIES > ODOMETER | Cumulative operating statistics |
| UTILITIES > SPOTCHECK | Joint and camera diagnostics |
| UTILITIES > SPOTMETRICS | Performance data review and upload |
| DISCONNECT | Sign out, power off, or reboot |

### Robot Controls Panel

| Control | Description |
|---------|-------------|
| Obstacle Avoidance | Toggle on/off; adjust cushion distance |
| Stairs Mode | Auto (default), On (force), Off (disable) |
| Grated Floor | Auto-detect (default), On, Off |
| Descend Stairs Before Power Off | Auto-exits stairs on comms loss, low battery, or power off |
| Ground Height Detection | Navigate obstacles ≤30cm |
| Stair/Surface Edge Avoidance | Prevent navigating too close to edges |
| Avoid Negative Obstacles | Prevent stepping into pits/trenches/potholes |
| Autowalk Avoid Ground Clutter | Avoid objects not present during recording |
| Step Height | Control foot lift height |
| Ground Friction | Adjust for surface type (lower = slower, smaller steps) |

---

## Controls and Interfaces on Spot

Source: https://support.bostondynamics.com/s/article/Controls-and-Interfaces-on-Spot-124500

Physical buttons and status lights on Spot's body.

### Rear Body Panel (left to right)

- **Charging port** (top-center, with cover)
- **Power button** — Illuminates blue when computers are on
- **Motor lockout button** — Illuminates red when motor lockout is reset
- **Ethernet port** (with cap)

### Battery

Inserted into bottom panel compartment. State of Charge (SoC) button with 5 LED indicators on exposed face.

### Robot Status Lights (Front Body Panel)

| Pattern | Status |
|---------|--------|
| Yellow | System booting up |
| Moving rainbow | Powered on, ready to connect |
| Solid blue | Lockout engaged; safe to handle |
| Filling blue | Charging (dots = percentage) |
| Solid blue with gap | Plugged in or docked, no battery |
| Slow blink green | Controller connected; motors may turn on |
| Fast blink green | Motors turning on |
| Solid green | Motors on |
| Draining orange | Low battery |
| Blinking orange | Serious error or perception fault |

---

## Navigate Spot on Stairs

Source: https://support.bostondynamics.com/s/article/Navigate-Spot-on-Stairs-49953

### Key Guidelines

- **Climb stairs**: Position at base, push left joystick forward — walk straight up
- **Descend stairs**: Always operate in **reverse** (left joystick backward, rear-first descent)
- **Do not** turn Spot on stairs — wait for complete landing
- **Do not** command side-stepping on stairs
- Grated stairs, open-riser stairs, or partially transparent stairways pose significant perception challenges

### Safety Rules

- Do not stand beneath or downhill of Spot on stairs — stay ≥2 meters from bottom of staircase
- Position yourself at top or ≥2m from bottom before driving Spot onto stairs
- Do not follow Spot up stairs until it reaches a flat landing with clearance
- Restrict access to stair areas and post visual signs

---

## Dock and Undock Spot

Source: https://support.bostondynamics.com/s/article/Dock-and-Undock-Spot-49947

### Docking Sequence

1. Spot orients with rear facing dock
2. Walks backward to position over dock
3. Aligns body with dock fixtures
4. Lowers body to connect to charging pins on rear tower
5. Lifts legs, powers off motors

### Manual Docking (Spot App)

1. Drive Spot toward unoccupied dock
2. When dock fiducial highlighted in purple (~4m range), select **Add Action > ACTIONS > Dock**
3. Select green-highlighted docking fiducial → **DOCK HERE**

### Manual Undocking

Select **UNDOCK** (motors running) or **POWER ON & UNDOCK** (motors off).

### Autowalk Docking

Missions with docks allow: start/end from any included dock, automatic recharging between loops, auto-return to dock on low battery. Configure target charge levels in Autowalk Mission Replay Options.

### Safety

- Ensure clear view of dock surroundings; abort if view is compromised
- Clear area around dock, remove sensitive equipment
- Do not approach Spot during docking/undocking
- Periodically check dock for damage (especially charging pins)

---

## Turn Off Spot

Source: https://support.bostondynamics.com/s/article/Turn-Off-Spot-49956

### Procedure

1. Drive Spot to charging/storage/transport location (drive, don't carry)
2. **Sit** Spot
3. Motor Status panel → toggle **Motor Power OFF**
4. Press **motor lockout button** on rear panel
5. Press and hold **power button** for 2 seconds
6. In Spot App: ≡ Menu → DISCONNECT → SIGN OUT
7. Connect to Spot Power Supply or remove battery for charging

**Critical:** Always remove battery when Spot is not in use unless connected to power supply or on powered dock. Batteries left in powered-off robot >24 hours may be **permanently damaged**.

---

## Stop and Restart Spot's Motors

Source: https://support.bostondynamics.com/s/article/Stop-and-Restart-Spots-Motors-82565

### Stop Commands

| Command | Effect |
|---------|--------|
| **STOP** | Immediately suspends all robot motion; Spot pauses and stands in place |
| **CUT POWER** | Fully de-energizes motors; motors cannot turn on until stop is canceled |

### Triggering CUT POWER

- Physical button shortcut (displayed in Spot App on connection)
- Select **STOP** twice in quick succession (first press → STOP, second press → CUT POWER)

**Warning:** De-energized motors = Spot cannot stand/balance. On inclines or stairs, Spot may tip over.

### Restart After Stop

1. Ensure safety conditions met and sufficient clearance
2. Select red **✕** to clear the stop
3. Motor Status panel → toggle **Motor Power ON**
4. Resume operation

---

## Spot App Profiles

Source: https://support.bostondynamics.com/s/article/Spot-App-Profiles-171948

Profiles tailor the Spot App UI based on use case. Applies to the tablet (not per-user).

### Default Profiles

| Profile | Focus |
|---------|-------|
| **Industrial Inspection** | Driving + streamlined Autowalk for recording maps/missions/actions |
| **Public Safety** | Driving + Spot Arm manipulation |
| **Advanced** | All features (not recommended for most users) |

### Set Profile

First launch prompts selection. To change: ≡ Menu → SETTINGS → Profiles → select profile.

### Customize Profile

1. ≡ Menu → SETTINGS → Profiles → select profile
2. Toggle features on/off; changes apply immediately
3. **Revert to Default** to restore original settings

**Note:** Toggling a feature off hides UI but preserves current settings. This can produce unintended configurations (e.g., hiding camera direction button while rear camera is selected). Check settings match preferences before switching profiles.
