# Spot Troubleshooting Reference

Diagnosis and resolution steps for common Spot issues.
Source: BD Support Articles 72504, 72028, 72069, 70795

---

## Spot Fails to Boot (72504)

### Symptoms

- Robot does not power on at all
- Robot powers on then immediately shuts off
- Fans run loudly for more than 2 minutes
- Status lights remain yellow (not transitioning to white/green)
- No WiFi access point broadcast from Spot

### Diagnostic Steps

1. **Check payload port exposure**: Exposed (unplugged) payload ports can cause boot failure. Seat all payload port covers or connected payloads securely.

2. **Verify battery charge**: A deeply discharged battery may not provide enough power to boot. Charge the battery fully and retry.

3. **Toggle AP mode**: If WiFi AP is not visible, attempt to re-enable it:
   - Press the red power button **6 times in quick succession**
   - Wait for the robot to reboot and check for the WiFi AP

4. **Connect via Ethernet**: If WiFi is unavailable, connect directly via Ethernet to `https://10.0.0.3` and access the Admin Console.

5. **Check for expired software**: Spot software has a certificate-based expiration mechanism.
   - Symptom in Orbit: "Failed to find robot" error
   - Symptom in SDK/API: `CERTIFICATE_VERIFY_ERROR`
   - Resolution: Update Spot software to a current release (see spot-admin-reference.md — Software Updates)

---

## Camera Server Faults (72028)

### Symptoms

- `camera_server` warning appears in Spot app or Admin Console
- Prompt indicating degraded perception
- Robot refuses to stand or operate in autonomous mode

### Diagnostic Steps

1. **Check software version compatibility**: Confirm the Spot software version is compatible with all installed payload software versions. Version mismatches can cause camera service failures.

2. **Power off and inspect cameras**: Power Spot down completely. Visually inspect all 5 depth camera windows (front ×2, rear ×1, sides ×2) for:
   - Dirt, debris, or smudging
   - Physical damage or cracking
   - Clean with a soft, dry cloth if dirty

3. **Run SpotCheck**: Power Spot on, stand it up, and run SpotCheck from the Spot app (Menu → SpotCheck). SpotCheck validates all sensors and joints.

4. **Create a log if fault persists**: If SpotCheck passes but the camera_server fault continues, trigger a log from Admin Console → Logs → TRIGGER JOURNAL LOG, then contact BD support.

---

## Battery and Charging (72069)

### Explorer vs Enterprise Batteries

| Property | Explorer Battery | Enterprise Battery |
|---|---|---|
| Interchangeable | Yes | Yes |
| Weight | Lighter | Heavier (cooling fins) |
| Spot Dock compatible | No — overheats | Yes |

**Do not charge an Explorer battery on a Spot Dock.** The Dock's charging contacts are designed for the Enterprise battery's thermal management. Using an Explorer battery on the Dock causes overheating and battery damage.

### Battery Specifications

| Parameter | Value |
|---|---|
| Operating temperature | −20°C to 45°C |
| Charge time | 1–2 hours (standard charger) |
| Runtime | ~1.5 hours (base), ~1 hour with payloads |
| Cycle life | 500 cycles to 80% capacity |

### Charger Specifications

| Charger | Input | Max current | Charge time |
|---|---|---|---|
| Current charger | 100–240 VAC | 12 A | ~1 hour |
| Legacy charger | 100–240 VAC | 7.2 A | ~2 hours |

### CRITICAL: Battery Storage Warning

**Remove the battery when Spot is not in use**, unless the robot is connected to shore power or on a Spot Dock.

Batteries left in an unpowered robot for more than **24 hours** may be permanently damaged due to deep discharge. This damage is not covered under warranty.

### Hot Swap Procedure

Perform a hot swap to replace batteries without fully powering down:

1. Flip Spot onto its back (use the hot-swap position).
2. Connect shore power to the payload port.
3. Swap the battery.
4. Disconnect shore power.

### Battery Balancing

Individual cells within the battery pack can drift apart in voltage. Check in Admin Console → Battery → **Cell Voltage Differential**.

| Cell Voltage Differential | Status |
|---|---|
| < 0.1 V | Healthy |
| ≥ 0.1 V | Needs balancing |

**To balance cells**: Charge the battery overnight using shore power or a direct charger (not via Dock). The charger's balancing circuit equalizes cell voltages during a full slow charge.

### Troubleshooting: Battery Wake from Sleep

If the battery is in deep sleep mode and the SoC (state of charge) LED does not respond:

1. Insert the battery into the charging tray.
2. Seat and unseat it **3 times**.
3. Leave in the tray — the charger will attempt to wake the battery from sleep mode.

### Troubleshooting: All SoC Lights Blinking

All battery SoC indicator lights blinking simultaneously indicates one of two conditions:

1. **Log storage full**: Robot's internal log storage is at capacity. Delete logs via Admin Console → Logs, then reboot.
2. **Battery too hot**: Allow the battery to cool to operating temperature (< 45°C) before use.

---

## Software Update Issues (70795)

For software update procedures, see [spot-admin-reference.md](./spot-admin-reference.md) — Software Updates section.

### Common Issues

| Symptom | Likely Cause | Resolution |
|---|---|---|
| Update fails to apply | Skipped a major/minor release | Update incrementally through each release |
| Robot unresponsive after update | Version incompatibility with payload | Update payload software to match robot version |
| Factory reset boot failure after update | Updated to v5.1.x before resetting | Must be on v5.1.3+ before factory reset |
| Orbit shows "software bundle unavailable" | Bundle not uploaded or version mismatch | Re-upload bundle in Orbit → Settings → Software |

---

## SpotCheck — Joint and Camera Calibration (49935)

Self-diagnostic routines for Spot's leg joints and body cameras. Calibration issues may occur after falls or normal wear over time.

### Routines

| Routine | Description | When to Run |
|---|---|---|
| Joint calibration + camera check | Tests/recalibrates hip and knee load cell and position sensors; checks body cameras | Every 30 days of operational time, or when gait issues (stumbling, limping) appear |
| Camera calibration | Recalibrates each body camera (requires calibration panel shipped with Spot) | Only when prompted by joint calibration results |

> **Caution:** Poor calibration increases likelihood of falls, collisions, and hazards. After 30 days without recalibration, Spot displays a fault that can only be cleared by running joint calibration.

### Environment Requirements

- Flat, manufactured, non-reflective floor (not outdoor)
- No objects within 1.5 m radius
- No bright lights, direct sunlight, or window glare
- Payloads must be securely affixed and correctly configured

### Joint Calibration Procedure (2–3 min)

1. Spot in Sit pose
2. Spot App > Menu > UTILITIES > SPOTCHECK
3. Select **JOINT CALIBRATION & CAMERA CHECK** > START
4. Spot stands and moves legs/body automatically (movement controls disabled)
5. Results displayed when complete; run camera calibration if camera issues detected

**Revert:** SPOTCHECK > REVERT to restore previous calibration (only last backup stored).

### Camera Calibration Procedure (~15 min)

1. Position calibration panel vertically (bottom edge ≤5 cm from floor, ≤5° from vertical, arrows pointing up)
2. Ensure even lighting, no glare, no other calibration panels visible
3. Clean camera lenses, inspect for damage
4. Stand Spot ~1 m in front of panel, rear camera facing panel
5. SPOTCHECK > CAMERA CALIBRATION > START
6. Spot repositions automatically to view panel at various angles

> **Caution:** Only run camera calibration when prompted. Running unnecessarily may cause or worsen issues.

### SpotCheck with Spot Arm

- Additionally opens/closes gripper for recalibration
- Moves arm through positions to check joint sensors
- Ensure **2 meters clearance** around and above robot (arm fully extends)
- Does **not** check or recalibrate gripper camera

---

## Why Can't I Connect to Spot? (49944)

### Troubleshooting Steps

1. **Verify Spot is powered on** — computers must be booted before network is available
2. **Check WiFi network**:
   - Client mode: join your site's network
   - AP mode: join Spot's broadcast network
   - Quick switch to AP mode: press motor lockout button **6 times**
3. **Check Ethernet cable**:
   - Use straight-through copper cable (T568A-T568A), not crossover
   - Verify full insertion with retainer clip engaged
   - Some overmolded cables may not fit Spot's rear port — try different cable
4. **Verify network configuration**:
   - Admin Console > Network Setup > General > **Run Network Check**
   - WiFi tab: check Radio Power is on, correct SSID and IP
   - AP mode IP: `192.168.80.3`
   - Ethernet tab: verify IP matches your setup
5. **Use `https://`** — `http://` (without s) returns "connection refused"
6. **Consult IT team** if above steps fail — see Prepare Your Network for Spot

---

## Clean and Maintain Spot (70763)

Monthly inspections recommended during regular operation and when storing/retrieving Spot.

### Exterior Cleaning

- Camera windows: non-abrasive cloth + glass cleaner (do not spray directly on glass)
- Body panels: magic eraser or mild detergent (no bleach, no strong solvents)
- Do **not** submerge Spot (light spray OK, no water jets)

### Monthly Maintenance Checklist

1. Power off, remove battery, disconnect cables
2. **Hip handles**: Check straps for damage/fraying
3. **Body panels**: Check for cracks, missing pieces, loose panels
4. **Battery connector**: Vacuum + compressed air, check for bent/broken pins
5. **Docking socket**: Vacuum + compressed air, check for damage
6. **Cooling fan filters** (underside, front/rear): Remove sit plates (M5 screws), clean filters, reinstall (torque 4 N·m)
7. **Knee fans** (4 total): Remove 2.5 mm hex cover, clean fan, check blades, reinstall with Loctite 425 (0.5 N·m)
8. **Rear power port**: Remove cap, vacuum, compressed air
9. **Ethernet port**: Remove cap, vacuum, compressed air
10. **Foot treads**: Check for excessive wear, damage, clamp integrity
11. **Camera windows** (5 housings x 3 windows): Brush debris, wipe with dampened cloth
12. **Battery latch handle**: Check hooks, fasteners, c-clips, magnets
13. **Charger cables/connectors**: Inspect for wear, vacuum, compressed air
14. **Dock charging connector**: Disconnect power, wait 30 sec, press interlock tabs to expose pins, inspect for corrosion (nylon brush only, no liquids)
15. **Status lights**: Verify front/rear illuminate correctly through power-on sequence
16. **Run SpotCheck**: Joint calibration and camera check

> **Caution:** Dusty environments may require more frequent cooling fan filter cleaning to prevent overheating faults.
