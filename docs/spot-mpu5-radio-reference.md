# Spot MPU5 Radio Reference

Setup, configuration, and troubleshooting for the Persistent Systems MPU5 radio used with Spot.

Source: BD Support Article 105286

---

## Overview

The Persistent Systems MPU5 is a mesh radio that provides wireless connectivity between Spot robots and operator tablets. It consists of a robot radio (payload assembly) and an operator radio (tablet assembly).

> **Safety:** Users must review pages 140–162 of the Persistent Systems Operator Manual prior to use. FCC/ISED authorized spectrums: 2412–2462 MHz, max output 955 mW.

---

## Kit Contents

| Item | Description |
|---|---|
| MPU5 payload assembly | MPU5 in protective casing with attached GXP |
| MPU5 operator assembly | MPU5 for attaching to tablet controller via cable |
| Mounting kit | 4x M5 hex head screws, 4x M5 T-slot nuts |
| Payload cable | Connection to Spot payload port |
| Antenna extender | For use with Spot Cam (shipped separately as needed) |
| NavBay mounting kit (RJ45) | 4x M3 screws, strain relief, 2x M3 button head screws |
| 2x MPU5 batteries | Rechargeable |
| Battery charger + power supply | For charging MPU5 batteries |

**Additional tools:** Phillips #1-2 screwdriver, M5 Allen key

---

## Attach MPU5 to Spot

1. Power off Spot in sit pose
2. Place MPU5 payload on robot back, three antennae facing rear
3. Point antennae upward 90° (perpendicular to Spot's top)
4. Remove payload port cap, attach payload cable
5. Insert 2 pairs of T-slot nuts per rail (set screw facing down)
6. Slide nuts into position, tighten 4 mounting screws to **5 N·m**

> **Caution:** Incorrectly positioned antennae may create RF interference, causing dropped connections with Spot Cam feeds or Core I/O.

---

## Antenna Extender Assembly

For front-mounted MPU5 with rear-mounted Spot Cam, use extenders to position antennas vertically at the rear.

### Spot Cam 2 Extenders

Install after riser but before Spot Cam 2:
1. Unscrew all antennas from MPU5
2. Slide antenna bracket into riser rear, thread cables through square opening
3. Secure bracket with provided screws
4. Connect extender cables to MPU5 sockets (finger-snug)
5. Route cables flat on top plate around rear payload port
6. Attach antennas to bracket sockets
7. Attach Spot Cam 2, ensure cables not pinched

### Spot Cam+ Extenders

Install before Spot Cam+:
1. Unscrew all antennas from MPU5
2. Connect extender cables to MPU5 sockets
3. Place bracket at rear, align with rearmost top plate holes
4. Route cables flat, attach antennas to bracket
5. Attach Spot Cam+, ensure pins seated through bracket holes

---

## Radio Channel and Authorization

### Set Channel

Turn power/channel knob to any numbered channel. Robot radio boots automatically when Spot powers on.

> **Warning:** The "Z" (zeroize) setting clears the security key, rendering radio unable to mesh until reconfigured.

### Authorize in Admin Console

1. Power on Spot, login to Admin Console
2. Payloads > ADD PAYLOAD > Custom
3. Name: "MPU5", mark as Attached
4. Payload properties:
   - Position x: -0.12
   - Total Mass: 1.82
   - Center of Mass x: -0.12, z: 0.03
   - Bounding Box: Center z: 0.03, Extent x: 0.1, y: 0.09, z: 0.03

---

## Spot Network Configuration

1. Admin Console > Network Setup > General tab:
   - Default Route: **Payload**
   - DNS: `8.8.8.8`
2. Payload tab: Robot IP `192.168.50.3`

> **Notice:** Multi-robot mesh: assign unique IPs (192.168.50.3, .4, .5, etc.)

---

## Operator Setup

### Tablet Controller Pro

Plug Ethernet cable directly into joystick housing.

### Legacy Tablet Controller Joysticks

1. Remove tablet from joystick housing
2. Align NavBay on back of housing (pogo pins to contacts)
3. Thread M3 screws through housing into NavBay (do not overtighten)
4. For RJ45: Insert cable into strain relief, plug into NavBay, attach strain relief screws
5. Reinstall tablet, connect MPU5 to NavBay

### Tablet Network Configuration

1. Settings > Connections > More connection settings > Ethernet
2. Configure Ethernet device > Static IP:
   - IP: `192.168.50.110`
   - Netmask: `255.255.255.0`
   - DNS: `192.168.50.3`
   - Gateway: `192.168.50.3`
3. In Spot App: + ADD NEW ROBOT > Ethernet network > IP `192.168.50.3`

---

## Radio Status LEDs

| LED Color | Status |
|---|---|
| No light | Off or dead battery |
| Blue | Powering on (do not power off) |
| Yellow | Running, no connection to other radios |
| Green | Running, connected to mesh |
| Orange | Low battery |
| Red | Security failure (unconfigured or zeroized) |
| Purple | Uploading firmware |
| Flashing Purple | Downloading firmware (do not unplug) |

---

## Troubleshooting

| Issue | Resolution |
|---|---|
| Dropped connections | Check antenna positioning — must be 90° perpendicular to Spot's top |
| Radio not connecting | Check LED status; verify same frequency setting on both radios |
| Tablet no IP | Check cable connections; set static IP in Android Ethernet settings |
| Zeroized radio | Reconfigure security key per Persistent Systems manual |
