# Spot Payload Reference

General reference for mounting, configuring, and troubleshooting Boston Dynamics Spot payloads.

---

## Available Payloads

### Boston Dynamics Payloads

- Spot Cam+ and Spot Cam+ IR
- Core I/O and EAP2
- GXP (General Purpose Payload)
- RL Researcher Kit

### Partner Payloads

- Fluke SV600 acoustic imager
- Rajant Kinetic mesh radio
- Persistent Systems MPU5

### Custom Payloads

Refer to the Spot Payload Developer Guide for custom payload development.

---

## Mount and Configure

### Required Tools

- Phillips screwdriver
- 4 mm hex key
- 2 mm hex key

### Mounting Procedure

1. Power off the robot before attaching any payload.
2. Position the payload on the mounting rails.
3. Insert T-slot nuts (Misumi HNTR5-5) into the rail channels.
4. Tighten fasteners to **5 N·m**.
5. Connect the payload cable.
6. Cap all unused payload ports — Spot will not operate with any port exposed.

### Authorization

1. Open Admin Console > **Payloads**
2. Select **AUTHORIZE** for an existing payload, or **ADD PAYLOAD** for a new one

---

## Payload Mount Points and Dimensions

### Mounting Rails

Aluminum rails run along the top-left and top-right edges of the robot body.

### Dimensional Limits

| Dimension | Limit | Notes |
|---|---|---|
| Width | 190 mm recommended | Wider payloads reduce mobility and risk leg interference |
| Length | 850 mm max | Overhang reduces maneuverability |
| Total weight | 14 kg combined | Distributed across all mounted payloads |

### Placement Guidelines

- Center payload mass between the front and rear hips for optimal balance
- Increased payload height reduces Spot's ability to self-right after a fall

---

## Payload Faults and Failures

### Diagnostic Steps

Follow this sequence when a payload is not functioning:

1. **DELETE ALL PAYLOADS** in Admin Console
2. Power off the robot
3. Inspect payload cable connectors for bent pins
4. Verify all unused ports are capped
5. Charge the battery fully
6. Power on the robot

> **Note:** Battery power is required for payload operation. Dock or shore power alone is insufficient to power payloads.

### Additional Isolation Steps

- Verify software version compatibility across the payload, tablet, and Spot firmware
- Try a different payload port to determine whether the issue is port-specific or payload-specific
- If the fault persists after all steps, capture a log and contact BD support

---

## References

- Spot Payload Developer Guide (custom payload development)
- Admin Console (payload authorization and configuration)
- BD Support site (firmware downloads and compatibility tables)

---

## General Expansion Payload (GXP)

The GXP mounts to payload rails and provides regulated power and Ethernet for payload prototyping and deployment. Available in standard size and beveled version (for mounting under Spot Arm).

### GXP Specifications

| Category | Value |
|---|---|
| Regulated power | Max 150W shared between 12V and 24V |
| 5V power | Max 10W |
| Connectivity | 1000Base-T Ethernet RJ45 (latching overmold) |
| HD15 connector | IP67 — regulated power breakout (**not VGA**) |
| Synchronization | 5V TTL PPS signal output |
| Operating temperature | -20°C to +45°C |
| Ingress protection | IP65 |
| Dimensions | 50 x 192 x 67 mm (L x W x H) |
| Weight | 430 g |

### GXP Mounting

**Parts:** 2x M5 T-slot nuts with set screw, 2x M5x16 socket head cap screws, 225 mm or 350 mm shielded ribbon cable

**Tools:** Torque wrench with 2 mm and 5 mm hex keys, threadlocker, #1 Phillips screwdriver

**Procedure:**
1. Remove port cap from robot
2. Attach and fasten ribbon cable to GXP bottom and robot port (do not twist)
3. Insert T-slot nuts into rails (set screw toward front, pointing down)
4. Apply threadlocker to M5x16 screws
5. Position GXP on rails, loosely thread screws into T-slot nuts
6. Tighten evenly to **0.2 N·m**
7. Configure in Admin Console (GXP is a preset for easy selection)

> **Notice:** Robot will not operate without port cap or payload attached to each port.

### GXP Networking

- Acts as pass-through for network traffic on front or rear payload port
- Each payload needs unique IP on `192.168.50.x` subnet
- Custom payloads: use range `192.168.50.11` to `192.168.50.254`
- Gateway: `192.168.50.3` (Spot's payload network IP)

### HD15 Pin Assignment

| Pins | Function |
|---|---|
| 1–4, 6 | Ground |
| 7, 8, 11, 12 | 12V |
| 13–14 | 24V |
| 15 | 5V |
| 5 | PPS |

> **Caution:** HD15 is NOT a VGA interface. Use 1:1 wired cable only. IP67 mating connector example: Assmann WSW A-HDS15-HOOD-WP.

---

## Swap or Remove a Payload

### Physical Removal

1. Power off Spot in sit position on stable surface
2. Loosen ribbon cable connector screws (cross-head screwdriver), disconnect from payload port
3. If port not reused: insert payload port cap and fasten with included screws
4. Remove M5 screws with 4 mm hex wrench, lift payload straight up (watch for mounting pins)
5. Remove unused T-slot nuts from rails (2 mm hex wrench to loosen set screws)
6. Inspect mounting area for wear or damage

> **Notice:** Spot cannot operate with an exposed payload port.

### Configure as "Detached"

Software configuration must always reflect currently mounted payloads.

> **Warning:** Incorrectly configuring payloads may cause balance failures, impaired functionality, and hazards.

**Via Spot App:** Menu > UTILITIES > ATTACH PAYLOADS > toggle payload to DETACHED

**Via Admin Console:** Payloads page > deselect green "Attached" checkbox

> **Tip:** You do not need to delete ("forget") the payload. Spot stores settings of previously configured payloads. Simply remount and mark as "attached" to reuse.

---

## Configure a Payload by Estimating Mass

For payloads of unknown mass or those not connected to Spot's payload ports, Spot can estimate the mass (accurate to within a few kg).

> **Caution:** Discrepancies between configured and actual mass may cause unpredictable movement. Use estimation only when accurate measurement is not possible.

### Procedure

1. Physically attach payload to Spot
2. Power on Spot and connect tablet
3. On tablet: Menu > UTILITIES > ATTACH PAYLOADS
4. Select **ADD NEW PAYLOAD**, follow on-screen prompts
5. Payload is automatically registered and authorized after estimation
6. For best results, visit Admin Console > Payloads and enter additional dimension/physical details
