# Spot Hardware Maintenance Reference

Comprehensive reference for Spot hardware maintenance, repair, and dock operations.
Source: BD Support Articles (fetched via chrome browser automation)

---

## Maintain and Customize Spot Leg and Body Panels

Source: https://support.bostondynamics.com/s/article/Maintain-and-Customize-Spot-Leg-and-Body-Panels-72040

### Panel Inventory

- Leg panels (4)
- Side body panels (2)
- Top body panel (1)
- Front body panel (1)
- Rear body panel (1)

### Cleaning

- Use magic eraser or mild detergent for superficial scuffs
- **Do not** use bleach or strong solvents
- **Do not** submerge Spot — resistant to light water spray only; submersion causes permanent damage
- Replace panels if excessively damaged (Spot Yellow = Pantone 3945-C / HEX #FBD403)

### Co-Branding / Customization

- Must not remove or change BD logo or official markings (warnings, serial number tags)
- Acceptable to duplicate logo if applying a wrap
- Decal template and co-branding guidelines available in article Downloads
- Contact BD Support for 3D models (.step files) and logo files
- Gripper jaws must use solid color (no outline provided)

### Panel Removal/Reattachment

See Replace Leg Crash Panel, Replace Spot Front Body Panel, or Replace Rear Body Panel articles.

---

## Replace Foot Treads

Source: https://support.bostondynamics.com/s/article/Replace-Foot-Treads-148284

### Tools

- 2.5 mm Allen wrench
- Optional: flat-head screwdriver, isopropyl alcohol

### Parts (per foot)

| Item | Qty | Part Number |
|------|-----|-------------|
| Spot foot tread | 1 | 02–045888-001 |
| Foot clamp | 1 | 04-00299302-001 |
| Foot clamp insert | 1 | 04-00372973-001 |
| Screw M3 x 30 | 1 | 02-033221-001 |
| Washer M3 316 SS | 1 | 02-027993-001 |

### Removal Procedure

1. Position Spot on its back on sturdy ESD-mitigated work surface
2. Loosen M3 x 30 bolt with 2.5mm Allen wrench
3. Remove bolt completely, then remove both foot tread clamps
4. Peel off foot tread by hand (grasp one side, then the other)

### Installation Procedure

1. Note tread orientation — greater slant side must align with foot contour
2. Hook one corner onto lower leg, fully engage before proceeding
3. Hook adjacent corner on same side, then repeat for other side
4. Tip: use isopropyl alcohol as lubricant if difficult to hook
5. Install foot tread clamps (align curve at top with foot contour)
6. Install M3 x 30 bolt with washer, torque to **2 N·m**

---

## Replace Leg Crash Panel

Source: https://support.bostondynamics.com/s/article/Replace-Leg-Crash-Panel-148287

### Tools

No tools required (done entirely by hand). Needle nose pliers optional.

### Parts

| Item | Part Number |
|------|-------------|
| Left upper leg crash protection | 02-037790-001 |
| Right upper leg crash protection | 02-039022-001 |

### Removal

1. Position Spot on its back on ESD-mitigated work surface
2. Open Velcro strap on side of leg
3. Rotate panel 90° away from foot direction
4. Release panel from leg

### Installation

1. Position new panel 90° perpendicular to upper leg
2. Engage quarter-turn retention feature, slowly rotate into final position
3. Wrap Velcro strap around upper leg, insert through loop, pull tight, close
4. Tuck clip inward toward Spot

---

## About the Spot Dock Self-Charging Station

Source: https://support.bostondynamics.com/s/article/About-the-Spot-Dock-Self-Charging-Station-77112

### Components

- Flat metal base plate (flares wide in middle)
- Front alignment tower
- Battery cooling fan
- Rear alignment tower with connector (mates to robot underside via interlock circuit)
- Electrical cabinet with power switch, power inlet, network jack (rear face)
- Indicator lights (top of electrical cabinet)
- Fiducial plate (top of electrical cabinet, rear)

### Docking Mechanism

When Spot aligns and sits: rear tower pushed down → connector cover opens → connector mates → interlock circuit completed → power flows. When Spot stands: interlock broken → power off.

### Status Lights

- **Power indicator**: On when dock connected to outlet and switched on
- **Charging indicator**: Red = charging, Green = fully charged

### Specifications

| Spec | Value |
|------|-------|
| Length | 1200 mm |
| Width | 420 mm (widest) |
| Height | 420 mm (with fiducial) / 230 mm (to rear tower top) |
| Weight | 22 kg |
| Power input | 100–240V 50/60Hz 8A |
| Power output | 58V at 12A |
| Operating temp | 0°C to 35°C |
| Network | RJ45 Ethernet (pass-through) |
| License | Spot Enterprise required |
| Ingress protection | IP54 |

### Recharge Times

| Ambient Temp | 80% Charge | 100% Charge |
|-------------|------------|-------------|
| 25°C | 50 min | 2 hours |
| 35°C | 2.5 hours | 3.5 hours |

### Safety

- Two-person lift (22 kg)
- Must be installed indoors, protected from rain, spray, excessive dust/humidity
- Do not manually disable rear tower interlocks (electrical hazard)
- Only trained service personnel should access electrical cabinet
- Keep hands/body away during docking/undocking

---

## Install the Spot Dock

Source: https://support.bostondynamics.com/s/article/Install-the-Spot-Dock-77113

### Location Requirements

- Level, spacious, well-lit, protected from elements
- Centered within Spot's operating area
- **Do not** install near metal walls/fencing that could disrupt WiFi

### Required Clearances

| Direction | Clearance |
|-----------|-----------|
| Front | 1200 mm |
| Sides | 600 mm |
| Rear | 50 mm |

### Floor Mounting

- Use M12 bolts, 330 mm apart
- Bolt heads must not protrude >25.4 mm above base plate (tripping hazard)
- Verify bolts are tight, base plate secure, dock is level

### Fiducial Plate Installation

1. Mount plate to bracket on top of electrical cabinet with included fasteners
2. Apply fiducial sticker facing toward **front** of dock
3. AprilTag fiducials 520–549 reserved for Spot Docks (30 stickers included)
4. Every dock must use a **unique** fiducial
5. Ensure even, uniform, bright artificial lighting (avoid backlighting/sun glare)
6. Replace damaged fiducials; remove old sticker before applying new one

### Power and Ethernet Connection

1. Connect dock power cable to power inlet (rear panel) → electrical outlet
2. Connect Ethernet cable to rear panel port → network outlet
3. Switch power on → verify power indicator light illuminated

**Notes:**
- Dock provides **pass-through Ethernet only** (dock is not a network endpoint)
- Spot supports only one Ethernet interface at a time — use either dock pass-through or Spot's rear Ethernet port, not both
- Properly stow all cords to avoid entanglement during docking/undocking

---

## Recover From a Fall

Source: https://support.bostondynamics.com/s/article/Recover-From-a-Fall-125948

Falls are rare under nominal conditions and proper operation.

### Recovery Procedure

1. **Wait** for Spot to come to a complete stop
2. **Inspect** for visible damage to legs, actuators, battery, battery compartment
   - If damaged: cease operation immediately, contact BD Support
   - If cosmetic damage only or undamaged: continue
3. **If Spot is stable on level surface:**
   - Clear 1-meter radius around Spot
   - Follow Stop and Restart Spot's Motors procedure
   - Activate **Self Right**
4. **If Spot is NOT stable on level surface, or Self Right fails:**
   - Press **motor lockout button**
   - Manually move Spot to stable level surface in "sit" position
   - Reset motor lockout (see Start Spot)
   - Follow Stop and Restart Spot's Motors procedure
5. **Resume operation** — watch for erratic/unexpected behavior indicating damage
   - If damage suspected: cease operation, contact BD Support

### Pre-Recovery Risk Assessment

Before recovery, assess environmental conditions that may have contributed to the fall and could cause another fall.
