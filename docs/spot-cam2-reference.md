# Spot Cam 2 Reference

Complete reference for the Boston Dynamics Spot Cam 2 multisensor payload.

---

## Overview

Spot Cam 2 is a compact multisensor payload combining optical and thermal cameras, dual microphones, and a PTZ (pan-tilt-zoom) unit. It mounts to Spot's payload rails and is designed for remote inspection workflows.

---

## Hardware Specifications

| Property | Value |
|---|---|
| Dimensions | 22 x 25 x 27 cm |
| Weight | 8.9 kg (9.5 kg with riser) |
| Ingress protection | IP67 |
| Operating temperature | -20°C to 55°C |

### Panoramic Camera

| Property | Value |
|---|---|
| Field of view | 360° x 135° |
| Resolution | 3000 x 1500 px |

### PTZ Camera

| Property | Value |
|---|---|
| FOV range | 58.1° (wide) to 2.3° (tele) |
| Optical zoom | 25x |
| Resolution | 4K |
| Pan range | 360° continuous |
| Tilt range | -30° to 90° |
| Pan speed | 360°/s |

### Thermal (IR) Camera

| Property | Value |
|---|---|
| Resolution | 640 x 480 |
| Field of view | 50° |
| Frame rate | 9 Hz |
| Radiometric accuracy | ±5°C |
| NETD | 60 mK |
| Max measurable temperature | 500°C |

### Audio

- 2 microphones mixed to a single channel
- No speaker (no audio playback output)

### Storage and Streaming

- NVME SSD: 480 GB
- Streaming: 1080p via WebRTC

### Accessory Bay

- Interfaces: Ethernet + 48V power
- Tilt range: -90° to 90°

### Status Indicators

**Status light:**

| Color | Meaning |
|---|---|
| Blue | Booting |
| Green | Software running, motors off |
| Red | Software running, motors on |

**LED ring:**

- 8 LEDs, 75 lumens each
- Auto-illuminates on boot

---

## Setup

### Requirements

- Spot software version 5.0.1 or later

### Mounting

**Front mount:** Attach directly to the payload rails using T-slot nuts.

**Rear mount:** Attach directly to the rails, or use the optional riser to achieve line-of-sight over front-mounted payloads.

### Payload Cable Connection

Align the red dot on the cable connector with the red dot on the port, then press until the connector clicks into place.

### Authorization and Configuration

1. Open Admin Console > **Payloads**
2. Select **AUTHORIZE**
3. Select the correct mount position (front or rear)

**With accessory bay payload:** Select the combined configuration (e.g., "Spot Cam 2 with L642").

### Software Updates

- Download the `.bde` update file from the BD support site
- Apply via Admin Console > **Payloads** > **Spot Cam 2**
- Or deploy as a bundle update via Orbit OTA

---

## Operation

### Manual Controls

| Mode | Description |
|---|---|
| SPOT CAM 360 | Panoramic view; tap to aim PTZ inset, up to 10x zoom |
| SPOT CAM PTZ | 25x zoom; auto or manual focus |
| SPOT CAM THERMAL | IR view; auto or manual temperature scaling |

### Capture Options

| Capture Type | Details |
|---|---|
| Spot Cam PTZ | Captures image + thermal + panoramic + video simultaneously |
| Spot Cam Video | Configurable duration and region of interest (ROI) |
| Spot Cam Thermal | ROI selection with configurable alert thresholds |

### Stow

Navigate to **Robot Controls > STOW SPOT CAM**. The payload remembers its last PTZ position.

### Settings

Access via **Menu > SETTINGS > SPOT CAM**:

- LED brightness
- Microphone gain
- Streaming configuration

### Automated Inspections

- Spot Cam 2 automatically deploys at the start of inspections and stows after each waypoint action
- Compatible with Spot Cam+ recordings, except for zoom levels exceeding 25x

### Data Download

Navigate to **Menu > DOWNLOAD DATA**. Data is saved to the SD card as a `.zip` archive.

---

## Troubleshooting

### All Spot Cam Models

| Symptom | Resolution |
|---|---|
| No power | Check payload cable connections; verify all unused ports are capped |
| No video feed | Authorize payload in Admin Console; delete previous Spot Cam entries; verify stream at `https://<robot_ip>:31102/h264.sdp.html` |
| Commands not responding | Payload not authorized — authorize via Admin Console |
| Poor video quality | Check WiFi signal strength and available network bandwidth |
| Poor quality after a fall | PTZ auto-focus safety feature may have engaged; reset via the controller |
| PTZ frozen or lagging | Power cycle Spot Cam |
| No stream on shared WiFi | WebRTC may be blocked; verify UDP/TCP ports 31000–32000 are open; diagnose via `chrome://webrtc-internals/` |

### Spot Cam 2 Specific

| Symptom | Resolution |
|---|---|
| No audio playback | Expected behavior — Spot Cam 2 has no speaker |
| PTZ does not aim at panoramic tap target | Collision avoidance is active due to proximity of other payloads |

### Spot Cam+ Specific

| Symptom | Resolution |
|---|---|
| Spinning red circle | Re-insert USB stick and power cycle |
| No capture option | Check USB stick compatibility |
| PTZ not centering | Follow the recenter procedure in the Admin Console |

---

## Spot Cam+ (Legacy Model)

Spot Cam+ is the predecessor to Spot Cam 2. It uses a different sensor suite and mounting system.

### Spot Cam+ Variants

- **Spot Cam+**: Base payload with panoramic camera, PTZ (30x optical zoom), 4 LED pairs, 2 speakers, 2 microphones, USB port
- **Spot Cam+IR**: Adds radiometric thermal camera and Sennheiser MKE-600 shotgun microphone

### Spot Cam+ Specifications

| Specification | Value |
|---|---|
| Length | 334 mm (13.1 in) |
| Width | 203 mm (8.0 in) |
| Height (front-mounted) | 368 mm (14.5 in) |
| Height (rear-mounted) | 403 mm (15.9 in) |
| Weight | 6.5 kg (14.3 lbs) |
| Panoramic FOV | 360 x 165° |
| Panoramic resolution | 10MP (4800x2400) |
| Panoramic sensor | 5x Sony IMX290 |
| Panoramic lens | 2.16 mm, F2.0 |
| PTZ sensor | 1/2.8", f=4.3–129.0 mm, F1.6–F4.7 |
| PTZ FOV | 63.7° (wide) to 2.3° (tele) |
| PTZ resolution | 2MP, 1080p, 30x zoom |
| PTZ pan speed | 100°/sec |
| PTZ tilt range | -30° to 100° |
| Ingress protection | IP65 |
| Operating temperature | -20°C to 45°C |

**Spot Cam+IR additional specs:**

| Specification | Value |
|---|---|
| Scene temperature range | -40°C to +550°C (low gain) |
| Thermal video speed | 7.5 Hz |
| Thermal FOV | 69 x 56° |
| Thermal resolution | 640 x 512 |
| Radiometric accuracy | ±5°C |
| Audio input | Sennheiser MKE-600 shotgun microphone |

### Spot Cam+ Mounting

Front-mounted and rear-mounted configurations are available. **Not interchangeable** — each can only be mounted in its designated position.

- **Front mount**: Attaches to forward payload port with 225 mm ribbon cable
- **Rear mount**: Attaches to rear port with 350 mm ribbon cable; includes spacer for camera elevation

**Mounting kit contents:** 6x M5x16 screws, 6x M5 t-slot nuts, 1x M5 hex key, 3x USB sticks, shielded ribbon cable

**Tools needed:** #1 Phillips screwdriver, torque wrench, 4 mm Allen key, 2 mm Allen key

**Torque:** Tighten M5 screws evenly to 5 N·m

> **Warning:** Do not allow the ribbon cable to be twisted during or after installation.

### Spot Cam+ Authorization

1. Power up Spot and wait for full boot
2. Login to Admin Console as admin (`https://10.0.0.3` via ethernet, `https://192.168.80.3` via WiFi)
3. Select **Payloads**
4. Confirm proposed payload and select **AUTHORIZE**
5. First-time tablet installation requires app restart

### Spot Cam+ Software Updates

All components must match software versions: Spot robot, tablet, Spot Cam+, SDK.

> **Notice:** Do not skip intermediate minor/major releases (e.g., 1.0.x → 1.1.3 → 2.0.1).

**Update procedure:**
1. Login to Admin Console > **Payloads**
2. Select **SPOT CAM** payload
3. Upload software image file
4. Spot Cam+ restarts automatically after update

Software can also be bundled with Spot robot updates and deployed via Orbit OTA.

### Operating Spot Cam+

**Camera inputs (via tablet):**

| Mode | Description |
|---|---|
| SPOT CAM | Live color 360° video |
| SPOT CAM PTZ | Live color video with PTZ view |
| SPOT CAM THERMAL | Live thermal image (Spot Cam+IR only) |

**LED lights:** 4 pairs of LEDs. Toggle via lightbulb icon; adjust brightness in Menu > SETTINGS > SPOT CAM.

**PTZ camera:** Pan continuous, tilt -30° to 100°. Auto/manual focus available in PTZ view.

**Thermal camera (Spot Cam+IR):** Tap location on thermal view to display temperature. Change color palette in Menu > SETTINGS > SPOT CAM > IR COLOR MAP PALETTE.

### Spot Cam+ Image Capture

**Capture via tablet:**
1. Position Spot as needed
2. Select **Add Action** in lower right
3. Choose capture sources: 360, PTZ, IR
4. Images saved as JPEG (except raw IR data files)

**Saving to USB:**
- Use BD-supplied 256 GB USB 3.1 sticks (NTFS formatted)
- Insert into USB port on front of Spot Cam+ unit
- Images saved at original quality; video saving not supported via USB
- Consumer USB sticks not supported

**Download to tablet:** Menu > DOWNLOAD DATA > DOWNLOAD NOW. Data saved as `.zip` with metadata.json per action group.

---

## Spot Cam WebRTC Streaming

### View a Live Stream

1. Navigate to `https://<robot_ip>:31102/h264.sdp.html` in Chrome
2. Enter Spot username and password when prompted
3. Grant audio permission when prompted (video will not work without it)

> **Notice:** Spot Cam is accessible through the robot via port forwarding of UDP/TCP traffic to 192.168.50.6 on ports 30000+[22, 80, 443] and 31000–32000.

### Available Streams (Composites)

Eleven streams available, settable via SDK. All stream at 720p.

| Term | Description |
|---|---|
| pano | Panoramic 360° stitched view |
| digi | Center crop of panoramic (user-movable on tablet) |
| mech | Image from the PTZ camera |
| c0–c4 | Raw fisheye feed from individual panoramic cameras |

**Composite variants:**
- **(no adjective)**: digi/mech on top, stitched 360 along bottom
- **overlay**: Same layout but digi/mech image is much larger
- **full**: digi/mech is full screen

### WebRTC Troubleshooting

| Issue | Resolution |
|---|---|
| No video in Chrome | Check microphone permissions — camera icon with "x" means blocked stream |
| White screen (Windows/Linux) | Microphone settings issue; grant permission when prompted |
| Stream not received | Verify DTLS protocol is enabled on the network |
| Slow to start | Normal — video stream may take several seconds to commence |
| Firewall blocking | Temporarily disable firewall to test; ensure ports 31000–31100 from 192.168.50.6 are open |

Use `chrome://webrtc-internals/` to diagnose persisting issues.

### ICE Settings

**Default ICE (STUN) servers:**
- `192.168.50.3:3478` (WiFi and payloads)
- `192.168.50.3:3479` (robot Ethernet)

**View settings:** `python3 -m command_line $ROBOT_IP network ice_settings`

**Cross-network access:** Change ICE settings via `-m command_line $ROBOT_IP network set_ice`. Always set ICE settings before starting a WebRTC stream.

### SDK Integration

- `webrtc.py` in Spot Python SDK demonstrates saving frames and images from the stream
- Use FFmpeg externally to convert frames to video (CPU-intensive, not included in SDK)
- Audio is not available in Python SDK (uses aiortc instead of Chrome's libav)
- Extract custom frames in a separate thread to avoid decoding timeouts

**Custom WebRTC connection:** Spot Cam generates SDP offers at `https://<robot_ip>:31102/h264.sdp`. Client must parse offer, create session, perform ICE negotiation, add tracks, create answer, and set local description.

---

## Spot Sounds

Audio profiles configurable via Menu > SETTINGS > SOUNDS on the tablet.

### Sound Profiles

| Profile | Trigger |
|---|---|
| Autowalk | Plays during Autowalk mission replay |
| Autowalk Fault | Plays when Autowalk encounters a fault |
| Honk | Press LT or RT on tablet to play once |
| Power On | Plays when motors power on |
| Power Off | Plays when motors power off |
| Speak Through | Enables live audio broadcast via Spot Cam |
| Stairs | Plays when Spot enters Stairs gait (auto-activated since v3.2, sound no longer plays) |
| Whenever Else | Plays continuously while motors on; overridden by all other profiles |

### Sound Adjustments

- **Volume**: Default 50%
- **Replay Interval**: Time between replays for continuous profiles (default 5 sec)
- **Sound Clip**: Select from dropdown; preview with play button

**Custom sounds:** Upload 16-bit `.wav` files (48 kHz recommended) to tablet at: `Internal Memory > Documents > bosdyn > audio`

Settings persist on tablet across log-ins to the same Spot.

### Speak Through

- Enable in Spot Sounds settings
- Camera view must use Spot Cam (e.g., SPOT CAM PTZ + JOYSTICKS)
- Hold microphone icon on drive screen to broadcast tablet mic audio through Spot Cam speakers
- If disabled in Spot Sounds, microphone icon is hidden

---

## Recenter the Spot Cam+ PTZ

The Spot Cam+ is calibrated out of the box. After a severe fall, the PTZ may need recentering. Symptom: panoramic view does not align with PTZ camera view.

### Recenter Procedure

1. Using SPOT CAM PTZ view, manually center the camera facing forward
2. Stand Spot approximately 2 meters from a distinct target (wall edge, door frame) level with Spot Cam+
3. On tablet: Menu > SPOT CAM > RECENTER PTZ
4. Select **RECENTER**
5. Aim camera at target using panoramic view
6. Select **OK**
7. Adjust PTZ view to align as close as possible to target
8. Verify by aiming Spot Cam+ in PTZ view — it should point at the intended target

> **Notice:** Minor deviation of a few degrees is acceptable and does not affect camera inspections.

---

## Install External Microphone on Spot Cam+

Spot Cam+IR includes a Sennheiser MKE-600 shotgun microphone for audio recording during operation.

> **Caution:** Spot's obstacle avoidance does not include the microphone. Positions extending away from the robot body may expose it to damage.

### Installation Procedure

1. Locate the metal microphone mounting bracket (shipped in cloth pouch)
2. Attach bracket to either side of Spot Cam+ frame using 2 mm Allen wrench and 2 small screws
3. Attach plastic microphone clip (included with Sennheiser mic) to bracket using 2 mm Allen wrench and large screw
4. Loosen tension wheel on clip, place microphone, adjust orientation, tighten wheel
5. Remove protective screw from microphone port on back of Spot Cam+ (Phillips screwdriver)
6. Connect microphone cable to shotgun mic port — gently push, then tighten metal collar
7. Connect other end to Spot Cam+ port — gently push, then tighten metal collar
8. On tablet: Menu > SETTINGS > SPOT CAM > set **MICROPHONE SELECTION** to **External**

---

## Clean and Maintain Spot Cam 2

Regular cleaning and preventive maintenance required. Always follow safe handling guidance. Turn off the robot before touching Spot Cam 2 or performing maintenance.

> **Caution:** Dirty or damaged camera lenses may prevent remote operators from assessing the environment. Do not operate if any Spot Cam 2 camera is damaged or obscured.

### Inspect Crash Protection Panels

Examine the plastic shells surrounding front, rear, and sides of Spot Cam 2 for:
- Cracks, missing pieces, or separation from the unit
- Minor surface damage is acceptable
- Anything impeding normal function should be reported immediately

### Clean Camera Lenses

Spot Cam 2 has 7 camera lenses: PTZ and IR cameras on front of tilt housing, panoramic cameras on front/rear/sides/top.

1. Gently brush away debris with non-abrasive cloth or anti-static soft lens brush
2. Dampen cloth with glass cleaner (do not spray directly on lens)
3. Wipe lens until all residue removed
4. Dry with clean section of cloth
5. Repeat for each of the 7 lenses

---

## Safe Handling for Spot Cam 2

- Handle Spot Cam 2 only when the robot is powered off
- When unpowered, joints have backdrive torque resistance but can move freely by hand or gravity
- **Always grip from the sides** — gripping front or back can cause tilt housing to open, exposing pinch points

> **Caution:** Keep appendages, hair, clothing, and jewelry away from marked pinch points and crush hazards.
