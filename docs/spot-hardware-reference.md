# Spot Hardware Reference

Physical specifications, sensors, and communication interfaces.

Source: BD Support Articles 49916, 49915, 49943, 49937

---

## Spot Anatomy (49915)

- **Body**: Oblong rectangular box housing computers, cameras, and components
- **Legs**: 4 legs, each with ball joint hip, hinged knee, rounded foot with rubberized pad
- **E-Stop button**: Red, located top rear right corner (model 04-00143531-401)
- **Poses**: "stand" (walking height) and "sit" (body + all feet on ground)

### Spot Arm Anatomy (151687)

- **DOF**: 6 degrees of freedom (manipulator) + 1 DOF gripper (end-effector)
- **Sensors**: Spot Arm has no detection sensors — relies on Spot body's embedded sensors
- **Capabilities**: Locomotion, navigation, and manipulation in indoor/outdoor environments
- **Compatibility**: Compatible with other payloads installed on Spot

### Spot Arm End-Effector Payload (72058)

Electrical and mechanical interfaces on the Spot Arm for mounting small payloads (cameras, sensors).

**Mounting:**
- Max end-effector payload mass: **2.5 kg**
- CAD files available at BD Support (Defeatured Spot CAD Models)

**Electrical interface:** MILL-MAX 499-10-216-10-008000 Target Header (underside of end-effector), mates with MILL-MAX 827-22-016-10-002101 Spring-Loaded connector.

| Pin(s) | Function |
|---|---|
| 1–8 | 1000Base-T Ethernet |
| 9 | +28V Regulated Power (50W, 2.3A limit) |
| 10, 14 | Digital Ground (DGND) |
| 11 | Chassis Ground (CHGND) |
| 12 | Pulse Per Second (PPS) — 5V TTL, 1Hz, 5ppm |
| 13, 15, 16 | Unused |

**Networking:** Static IP on `192.168.50.x`. Avoid octets 2, 3, 5, 6, 7, 8, 9. Recommended: `.20`, `.21`, `.22`.

**Grounding:** Three isolated return paths required:
- **DGND**: Reference for PPS and 28V power — must be isolated from PGND and CHGND
- **CHGND**: Battery negative terminal for metal housings/cable shields — must be isolated from DGND

---

## Spot Battery Shipping Guidance (49921)

The Spot Battery is a **Fully Regulated Dangerous Good** per IATA (UN3480, PI 965, Section IA).

> **Notice:** Boston Dynamics is not a DGR shipping consultant. Consult a freight-forwarder or your organization's logistics department.

### IATA Requirements (Notable)

- Pack in UN-approved container, labeled and declared per IATA DGR
- State of charge: **≤ 30%** of rated capacity
- Net weight limit per package: **35 kg**
- **Cargo aircraft only**

### Battery Specifications

| Specification | Value |
|---|---|
| Capacity | 564 Wh |
| Max voltage | 58.8 V |
| Runtime (no payload) | ~90 min |
| Runtime (with payload) | ~60 min |
| Standby | 180 min |
| Charge time | ~1 hour |
| Dimensions | 324 x 168 x 93 mm |
| Weight | 5.2 kg |

> **Notice:** Promptly charge received batteries to 100%. Batteries ship at <30% and discharge over time. Over-discharged batteries may not be repairable.

---

## Safe Handling for Spot (49917)

> **Warning:** Always power off Spot before handling, moving, or lifting. Spot may flail legs to control balance if powered on.

### Pinch Points

Loose legs and joints can pinch fingers and entangle clothing/hair/jewelry even when powered off. Risk areas: knee joints and hip joints.

### Handles and Lifting

- Handles at each hip joint for lift, carry, and roll
- **Always make a fist** when gripping handles (keep fingers away from pinch points)
- **Use two people** to lift: one at front, one at rear
- Lift by handles (sitting upright) or by lower legs (flipped on back)

> **Caution:** Spot is not rigid — legs may be loose during lifting. Sudden loss of grip may damage feet or equipment below.

### PPE

- Safety footwear recommended
- Hearing protection if A/V warning buzzer is in use (volume-dependent)

---

## Spot Battery and Charging System (72069)

> **Warning:** Always remove battery when Spot is not in use (unless on shore power or powered Dock). Batteries left in robot >24 hours may be damaged beyond repair.

### Charger Specifications

| Spec | Current Model | Legacy Model |
|---|---|---|
| Operating temp | 0°C to 45°C | 0°C to 40°C |
| Input | 100–240 VAC, 50/60 Hz, 8A | 100–240 VAC, 50/60 Hz, 5.5A |
| Output | 35–58.6 VDC, 12A max | 35–58.6 VDC, 7.2A max |
| Charge time | ~1 hour | ~2 hours |

### Enterprise vs Explorer Battery

- Enterprise: 1 kg heavier, cooling fins for dock charging
- Explorer: smooth yellow cap, lighter
- **Interchangeable** — but do not dock-charge Enterprise robot with Explorer battery (overheating)

### Battery Specifications

| Spec | Value |
|---|---|
| Storage temp | -30°C to 25°C |
| Operating temp | -20°C to 45°C (internal up to 75°C) |
| Charge time | 1–2 hours |
| Runtime | ~90 min (normal), ~60 min (with payloads), ~4 hours standby |
| Lifetime | 500 cycles to 80% capacity |
| Output | 35–58.8 VDC |

### Charging Methods

- **Battery tray**: Place battery in charger tray (current model)
- **Direct cable**: Battery-to-charger cable (legacy model)
- **Shore power**: Charger cable to Spot's rear charging port (white dot alignment: Explorer=belly, Enterprise=top)
- **Hot swap**: On shore power, flip Spot, swap battery without powering down

> **Notice:** Charger defaults to tray over shore power. Battery only charges when internal temp <45°C.

### Battery Balancing

Cell voltage differential (Admin Console > Battery):
- **<0.1V**: Healthy
- **0.1–0.5V**: Rebalance needed (charge fully, leave on charger overnight)
- **>0.5V**: Contact BD support

**Symptoms of imbalance:** Abbreviated runtime, early shutoff <20%, charges to only 3–4 SoC lights, Battery fault 28.

### Troubleshooting

| Issue | Resolution |
|---|---|
| No SoC lights at all | Battery in sleep mode — seat/unseat in charger tray 3 times. If fails, contact support |
| All SoC lights blink | Internal fault — check Admin Console > Battery > Log Capacity Used; clear if near 100%. Cool battery if hot |
| Charger countdown timer | Remove battery from tray to switch back to shore power |
| Thermometer symbol | Battery at max charge temp — leave in cradle, auto-restarts when cooled |
| 100% on charger but low on robot | Battery needs balancing — leave on charger to balance |

---

## Physical Dimensions

| Measurement | Value |
| --- | --- |
| Length | 1100 mm |
| Width | 500 mm |
| Walking height (default) | 610 mm |
| Walking height (max) | 700 mm |
| Walking height (min) | 520 mm |
| Sitting height | 191 mm |

---

## Weight

| Item | Weight |
| --- | --- |
| Total (with battery) | 33.8 kg |
| Battery only | 5.2 kg |

---

## Mobility

| Spec | Value |
| --- | --- |
| Max walking speed | 1.6 m/s (5.76 km/h) |
| Max slope | ±30° |
| Max step/obstacle height | 300 mm |

---

## Power and Battery

| Spec | Value |
| --- | --- |
| Battery capacity | 564 Wh |
| Runtime (no payload) | ~90 min |
| Runtime (with payload) | ~60 min |
| Standby time | ~180 min |
| Charge to 80% | ~50 min |
| Charge to 100% | ~120 min |

---

## Payload

- Max payload weight: **14 kg**

---

## Environment

| Spec | Value |
| --- | --- |
| Operating temperature | -20°C to 55°C |
| IP rating | IP54 (dust + splash resistant) |

---

## Joints and Kinematics

- 12 DOF total (3 actuated joints per leg × 4 legs)
- Optional Spot Arm adds 6 DOF + gripper

---

## Cameras and Sensors

- **5 stereo camera pairs**: front-left, front-right, left, right, rear
- **FOV**: 360° surround sensing
- **Capabilities**: Monochrome + color fisheye, 3D depth, IR sensing
- Used for: obstacle avoidance, terrain mapping, visual navigation

---

## Communication

| Interface | Specification |
| --- | --- |
| WiFi | 802.11 b/g/n/ac (2.4GHz + 5GHz) |
| Ethernet | Gigabit (via payload port) |
| Cellular | Via Core I/O payload (5G/LTE, see core-io-guide.md) |

---

## Network Topology

```text
┌──────────┐     WiFi/5G      ┌───────────┐    Ethernet    ┌───────────┐
│  Operator │ ◄──────────────► │   Spot    │ ◄────────────► │  Core I/O │
│  (Orbit)  │                  │  Robot    │   (internal)   │  Payload  │
└──────────┘                   └───────────┘                └───────────┘
      │                              │                            │
      │         Orbit REST API       │      SSH (port 20022)      │
      ▼                              ▼                            ▼
┌──────────┐                  ┌───────────┐              ┌───────────────┐
│ Site Hub │                  │  Docking  │              │  Docker       │
│ Server   │                  │  Station  │              │  Extensions   │
└──────────┘                  └───────────┘              └───────────────┘
```

### Key IP Addresses

| Device | IP | Context |
| --- | --- | --- |
| Spot WiFi AP | `192.168.80.3` | Direct WiFi connection to Spot |
| Spot Ethernet | `10.0.0.3` | Rear port or Spot Dock |
| Spot (payload gateway) | `192.168.50.3` | Internal payload network |
| Core I/O | `192.168.50.5` | Payload network |
| Spot CAM | `192.168.50.6` | Payload network |
| Core I/O Admin Console | `https://<ip>:21443` | Web management UI |
| Site Hub (admin) | `192.168.2.5` | Initial setup only |
| Site Hub (operator) | `192.168.1.5` (default) | Production access |

### Reserved Subnets

These subnets are used internally by Spot. **Do NOT assign them on your corporate network** — routing conflicts will occur.

| Subnet | Purpose |
| --- | --- |
| `192.168.80.x/24` | Spot internal WiFi AP |
| `192.168.50.x/24` | Internal payload communication |
| `192.168.0.x/24` | Reserved internal |
| `192.168.1.x/24` | Reserved internal |

### Firewall Rules

| Source | Destination | Port / Protocol | Purpose |
| --- | --- | --- | --- |
| Spot | Orbit Server | 443 / TCP | HTTPS auth and API |
| Spot | Orbit Server | 51820 / UDP | WireGuard VPN (primary Spot–Orbit link) |
| Operator PC | Orbit Server | 31000–33000 / UDP | WebRTC video streaming (TURN) |
| Operator PC | Spot / Orbit | 443 / TCP | Admin Console and Orbit browser UI |
| Spot | DNS Server | 53 / UDP | DNS resolution |
| Spot | bosdyn.com | 443 / TCP | Telemetry and log upload |

### Payload Port Forwarding (via robot IP)

| Payload | SSH | HTTP | HTTPS |
| --- | --- | --- | --- |
| Core I/O | 20022 | 20080 | 20443 |
| Spot CAM | 30022 | 30080 | 30443 |

Port range `21000–22000` is reserved for direct payload routing.

### WiFi Modes

| Mode | Description |
| --- | --- |
| AP mode | Spot creates its own WiFi (default `192.168.80.3`). Best for tablet direct control. |
| Client mode | Spot joins existing corporate WiFi (WPA2 Enterprise supported). |
| Dual mode | Client + background AP fallback for emergency tablet connection. |

- Spot Enterprise supports both 2.4GHz and 5GHz
- 2.4GHz: better wall penetration, lower speed
- 5GHz: higher bandwidth, less interference, shorter range

### Network Configuration Details

**Supported network types:** WiFi (AP or client), Ethernet, LTE (via Core I/O), Mesh radio (via MPU5)

> **Notice:** Spot supports only one Ethernet interface at a time. Use either Dock passthrough or rear Ethernet port, not both.

**Default network settings (printed on battery compartment label):**

| Protocol | Setting | Default |
|---|---|---|
| WiFi | Mode | Access Point (Spot hosts own network) |
| WiFi | Robot IP | `192.168.80.3` |
| Ethernet | Robot IP | `10.0.0.3` |
| Ethernet | Netmask | `255.255.255.0` |

**Change configuration:** Admin Console > Network Setup > make changes per tab > APPLY

**Quick AP mode switch:** Press motor lockout button **6 times** in a row to switch from Client mode to AP mode (or reboot AP if already in AP mode).

> **Warning:** Changing network config during operation may trigger signal-loss behaviors (falls or unsupervised automatic movements).

**Network Check:** Admin Console > Network Setup > RUN ALL to verify connectivity to Orbit, DNS, etc.

### Connect a Computer to Spot

**When needed:** Access Admin Console, transfer files, development work on Spot/payloads.

**Option 1 — Ethernet (most reliable, fastest transfer):**
1. Set motor lockout before handling Spot
2. Connect Ethernet cable to Spot's rear port
3. Set computer static IP: `10.0.0.x` (any 2–254 except Spot's), netmask `255.255.255.0`, gateway `10.0.0.1`
4. Navigate to Spot's Ethernet IP in Chrome

> **Warning:** Do not operate Spot while Ethernet cable is connected. Do not use rear port and Dock passthrough simultaneously.

**Option 2 — Site network:**
- If Spot is on your network, navigate to its network IP in Chrome

**Option 3 — Spot WiFi (AP mode):**
1. Join Spot's WiFi network (SSID on battery compartment label)
2. Navigate to `https://192.168.80.3` in Chrome

> **Note:** Chrome may show "Your connection is not private" — select Advanced > Proceed.

### Connect Spot to WiFi Network (49939)

Configure Spot as a WiFi client to connect to your site's enterprise network.

> **Tip:** Spot can run a "background access point" while in client mode (Dual WiFi Mode) — no need to switch back and forth.

**Procedure:** Admin Console > Network Setup > WiFi tab > WiFi Network Type: **Client**

**Recommended settings:**
- **Security**: WPA2 Enterprise
- **Frequency Band**: All
- **DHCP**: Enabled (request DHCP reservation from IT for stable IP)
- **Is Current Default Route**: Selected (for internet traffic routing)

**Reserved subnets (avoid assigning these to Spot):**
- `192.168.0.x/24`, `192.168.1.x/24`, `192.168.50.x/24`, `192.168.80.x/24`

> **Notice:** Switching from AP to Client mode disconnects all devices on Spot's access point. Coordinate changes with other operators and IT.

### VPN and mDNS

- **WireGuard VPN**: Spot ↔ Orbit on UDP port 51820
- **mDNS**: Supported via `224.0.0.251` on UDP 5353 (Linux requires `avahi-daemon` + `libnss-mdns`)

### Bandwidth Requirements

| Use Case | Requirement |
| --- | --- |
| Manual driving (remote) | > 7 Mbps |
| Autowalk missions | 0.5–2 Mbps sustained |
| Max acceptable latency | 300 ms |

---

## Why Does My Connection to Spot Keep Dropping? (49945)

Diagnose and resolve connection drop issues by scenario.

### When Spot Is a Site WiFi Client

- Network configuration changes on Spot may improve stability → see Prepare Your Network for Spot
- Adjust AP roaming settings in Optimize Spot's WiFi Performance
- Tablet controller limitations: unlike Spot's fine-grained settings, tablets offer limited control → operate from areas with strong signal
- If problems persist, consider a radio or LTE payload (MPU5, Rajant ES1)

### When Spot Is Broadcasting Its Own WiFi AP

1. Move the device closer to Spot (WiFi range is generally under 50 m)
2. Check for congested frequencies: use a WiFi analyzer app to view channel traffic → switch to a less congested channel
3. Increase Spot's WiFi broadcast power
4. If problems persist, consider a radio or LTE payload

### When Spot Is Connected via Ethernet

- The issue is likely with the network or the device, not Spot
- Check the device's network settings and verify it can connect to devices other than Spot
- Inspect the Ethernet cable (secure at both ends, no damage, correct type)
- For WiFi-connected devices: move to a location with stronger AP signal
- If the problem continues, consult your IT team

---

## Prepare Your Network for Spot (49942)

Prepare network infrastructure for Spot operations. Repeated deployments, autonomous navigation, and Orbit usage may require network changes or improvements.

### Enterprise Network Architecture

- Spot: joins site WiFi during operation; connects via Ethernet passthrough at the Dock
- Tablet: joins the same network via WiFi or Ethernet
- Dock: is not a network client; provides Ethernet passthrough only
- Orbit: cloud (BD-managed), VM (self-hosted), or Site Hub (local)

### Network Requirements

| Item | Requirement |
|------|-------------|
| Maximum latency | 300 ms (performance degrades above this threshold) |
| Minimum bandwidth (teleoperation) | 7 Mbps (3 Mbps absolute minimum; auto-throttles below 5 Mbps) |
| Minimum bandwidth (autonomous) | 0.5–2 Mbps |

> Signal-loss behavior can trigger below 5 Mbps → risk of fall or unsupervised autonomous movement

### Reserved IP Ranges (Avoid Conflicts)

Do not assign Spot an IP address in any of the following ranges:
- 192.168.0.x/24
- 192.168.1.x/24
- 192.168.50.x/24
- 192.168.80.x/24

### WiFi Channels

| Band | Channels |
|------|----------|
| 2.4 GHz | 1–11 (all regions), 12–13 (EU/Japan additional) |
| 5 GHz W52 | 36/40/44/48 |
| 5 GHz W56 | 100–140 (Client mode only, DFS applies) |
| 5 GHz W58 | 149/153/157/161/165 |

### Improving the WiFi Environment

1. Verify existing APs are functioning correctly (issues may pre-date Spot deployment)
2. Remove WiFi obstacles (temporary walls, scaffolding, etc.)
3. Configure all APs in Spot's operating area to the same channel → limits the channels Spot needs to scan
4. Reduce other traffic on the same channel (dedicated network/channel recommended; configure QoS)
5. Add APs in areas with weak signal

### Network Security (WPA2 Enterprise)

IEEE 802.1x is supported. Authentication is performed via a RADIUS server.

| Authentication Method | Required Credentials |
|-----------------------|----------------------|
| EAP-TLS | CA certificate + client certificate + private key |
| EAP-TTLS | CA certificate + username/password |
| EAP-PEAP | CA certificate (optional, recommended) + username/password |
| EAP-PWD | Username/password |

> SHA-1 signed certificates are not supported. SHA-256 or higher is recommended. Certificate format: X.509 PEM (.pem). Android tablets require conversion to .p12.

### Configuring Spot's Network Credentials

1. Connect to Spot via Ethernet (do not use WiFi, as WiFi settings are being changed)
2. Admin Console → Network Setup → WiFi tab
3. Set WiFi Network Type to **Client**
4. Enter the SSID and select WPA2 Enterprise Security
5. Configure the authentication method and upload certificates/credentials
6. Click **APPLY**

---

## Optimize Spot's WiFi Performance (49941)

Optimize settings for stable WiFi connectivity.

### Client Mode

#### Scan Frequencies

If the network uses only a limited set of channels, restrict Spot's scan targets to those channels:

1. Admin Console → Network Setup → WiFi → Client
2. Set Frequency Band to match the network band (2.4 GHz or 5 GHz)
3. Advanced → enter integer MHz values in the **Scan Frequencies** field (not channel numbers)
   - Example: Channel 1 + Channel 6 → `2412 2437`

#### Background Scanning

Spot continuously scans for the optimal AP. WiFi connectivity is briefly interrupted during each scan.

Configuration format: `<algorithm>:<weak-signal interval>:<threshold>:<strong-signal interval>`

Example: `simple:7:-70:300` → scan every 7 seconds when signal < -70 dBm, otherwise every 300 seconds

> Excessive scan frequency can degrade WiFi performance. The more scan frequencies configured, the longer the intervals should be.

### Access Point Mode

#### Broadcast Channel

Use a WiFi analyzer app to identify a low-traffic channel → set that channel in the Admin Console.

#### Transmit Power

- Increase power when a unique channel is unavailable, extended range is needed, or obstacles must be compensated for
- Admin Console → WiFi → Access Point → Advanced → **Transmit Power** (dBm)

> ⚠️ Increasing transmit power may cause interference with other devices or networks.

---

## Use Spot in Dual WiFi Mode (172134)

Operate Spot simultaneously in Client mode and Access Point mode. A "Background AP" is broadcast on the same channel as the Client connection.

### Use Cases

- Run Orbit missions (Client) and record Spot App missions (AP) at the same time without switching modes

### Configuration

1. Admin Console → Network Setup → WiFi → Client
2. Advanced → toggle **Start Background AP** ON
3. Click **APPLY**

### Limitations

- Background AP cannot start on U-NII-2 channels (5 GHz, channels 52–126)
- If the Client roams to a U-NII-2 channel, the Background AP may drop
- Channel selection is locked while a tablet is connected → switching channels may drop the Client connection
- Spot will not scan for the Client SSID while a tablet is connected (disconnect the tablet first, then scan)

> Client-side bandwidth is not negatively affected by running the Background AP.

---

## Loss of Connection to the Controller (49949)

Behavior when the connection to the controller is lost during teleoperation or autonomous operation.

### Causes of Connection Loss

- Degraded network performance or weakened signal
- Controller powered off, entered sleep mode, or network settings changed
- Spot App crashed, moved to background, or was closed

### Signal-Loss Behavior

| Situation | Behavior |
|-----------|----------|
| During teleoperation | Stops with motors on; waits for reconnection. If AutoReturn is enabled, automatically backtracks. |
| During autonomous operation | Continues operation (proceeds with the Autowalk mission) |

### Controller Supervision

Maximum time Spot can continue operating without a controller connection. Once the limit is exceeded, Spot sits down and powers off its motors.

| Setting | Unsupervised operation time |
|---------|-----------------------------|
| STRICT (default) | 9 seconds |
| MODERATE | 30 seconds |
| UNSUPERVISED | 18.2 hours |

Configure: Spot App → ≡ Menu > SETTINGS > COMMS

> ⚠️ In UNSUPERVISED mode, it may be difficult to stop the robot quickly.

### AutoReturn

When connection is lost, Spot automatically backtracks within a configurable radius (up to 20 m) to attempt reconnection.

- Applies to teleoperation only (not Autowalk)
- Default: disabled
- Configure: Spot App → ≡ Menu > COMMS → Enable AutoReturn + Return radius
- If reconnection fails, Spot sits down and powers off its motors
- Controller supervision timeout applies concurrently

> During AutoReturn, Spot typically moves in reverse. If the return path passes through the Dock, automatic docking may occur.
