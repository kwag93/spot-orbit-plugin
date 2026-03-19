# Spot RL Researcher Kit Reference

User guide and hardware assembly for the Spot RL Researcher Kit (reinforcement learning on Spot).

Source: BD Support Articles 49965, 49920

---

## Overview

The Spot RL Researcher Kit packages components for running reinforcement learning (RL) policies on Spot using an Nvidia Jetson AGX Orin computer (not included).

### Kit Contents

| Item | Description |
|---|---|
| Joint-level API license | Access to lower-level Spot functions for R&D |
| Mounting bracket + covers | Large cover, small cover for Orin attachment |
| Spot GXP | Power and Ethernet interface |
| Cables | Ethernet, serial power, DB25 serial cable |
| Fasteners | 2x M5 long screws, 4x M5 short screws, 4x socket head cap screws, 4x T-slot nuts |

**Compatibility:** All Spot models, Spot Arm compatible, Spot software v4.0.2+

---

## Safety

> **Danger:** Joint-level controls may result in unpredictable behaviors and unstable movements.

**Required precautions:**
- Use only in controlled laboratory environments
- Set up full-separation safeguards preventing whole-body access from minimum 2 meters
- Inclines, stairs, and elevated surfaces dramatically increase hazard probability
- Do not approach or use onboard E-Stop while RL policy is running — use wireless E-Stop instead

---

## Setup Prerequisites

**PC:** Install Nvidia Isaac Sim and Isaac Lab

**Jetson AGX Orin:** Set up Ubuntu OS, install JetPack 6

**Spot robot:**
1. Remove payloads from rear payload port, mark as "Detached" in Admin Console
2. Install Spot software v4.0.2+
3. Install joint-level API license (Admin Console > Licenses)

---

## Hardware Assembly

### 1. Attach GXP to Bracket

- Align GXP with threaded holes at rear of mounting bracket (ports toward center)
- Attach with 2x long M5 screws (4 mm hex), tighten to **5 N·m**
- Thread DB25 cable under separator, connect to GXP bottom pins (finger-tight)

### 2. Attach Orin to Bracket

- Remove 4 recessed screws from Orin bottom (thin Phillips) — do not remove circuit board screws
- Align Orin on raised bracket section (2 mounting hole sets available)
- Orient desired ports (e.g., display port) away from GXP
- Attach with 4x socket head cap screws (2 mm hex, finger-tight)

### 3. Mount Assembly to Spot

> **Caution:** Use only the **rear payload port** for best performance. Rear port is optimized for rapid RL computation data transfer.

1. Power off Spot in sit position
2. Remove rear payload port cap
3. Insert 2 T-slot nuts per rail (set screw down, loose)
4. Connect DB25 pin end to rear payload port (finger-tight)
5. Slide assembly forward until front cutout meets front port cap
6. Align and tighten 4x short M5 screws to **5 N·m**

### 4. Attach Cables and Covers

1. Connect Ethernet between GXP and Orin (coil excess, cable tie)
2. Connect serial power cable: pin end to GXP, plug end to Orin
3. Attach large cover over Orin (beveled corners rearward), thumbscrews finger-tight
4. Attach small cover between GXP and Orin, thumbscrews finger-tight

---

## Configure as Custom Payload

Admin Console > Payloads > ADD PAYLOAD > Custom:

| Field | Value |
|---|---|
| Name | "RL Kit" |
| Attached | true |
| Position (x, y, z) | -0.292, 0, 0.056 |
| Total Mass | 2.4 kg |
| Center of Mass (x, y, z) | -0.005, 0, -0.006 |
| Estimate As Point Mass | true |

**Bounding box 1** (front half — small cover + GXP):
- Center: 0.076, 0, -0.023
- Extent: 0.076, 0.103, 0.033

**Bounding box 2** (rear half — large cover):
- Center: -0.078, 0, 0
- Extent: 0.078, 0.103, 0.056

> **Note:** If bracket positioned closer to rear, re-measure x dimension from center of front rail bolt to front edge of large cover.

### Network Configuration

Admin Console > Network Setup > Payload tab:
- Set **Stored Default Route** to same IP as Orin's default gateway
- Set **Is Current Default Route** to true

---

## Deploy an RL Policy

1. Train RL policy using Nvidia Isaac Lab on PC
2. Copy trained policy and deployment code to Orin on Spot
3. SSH into Orin from PC over WiFi, launch policy
4. Connect wireless gamepad to Orin to drive Spot

> **Notice:** BD does not provide support for Nvidia simulator tools or RL model training/troubleshooting.
