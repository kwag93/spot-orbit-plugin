# Spot Acoustic Sensor Payloads Reference

Reference for acoustic imaging payloads compatible with Boston Dynamics Spot.

---

## Fluke SV600

The Fluke SV600 is an acoustic imager used to detect sound signatures from mechanical and electrical equipment during inspections.

### Installation Methods

The SV600 supports two installation configurations:

#### Option 1: Spot Cam 2 Accessory Bay

- Mount the SV600 in the Spot Cam 2 accessory bay
- The PTZ camera is used for aiming the acoustic imager
- Set the SV600 payload mass to **0 kg** — its weight is already accounted for in the Spot Cam 2 configuration

#### Option 2: Standalone Roll Cage Mount

- Mount the SV600 to the center payload rails
- Power via PoE from Core I/O: connect through **ETH2** and terminal block **CN3**

### Authorization

1. Open Admin Console > **Payloads**
2. Select **AUTHORIZE**
3. Configure the mount position to match the installation

### Firmware Updates

- Access the firmware update interface at `http://<robot_ip>:24080`
- Navigate to **Settings > FIRMWARE UPDATE**
- Do not downgrade firmware — downgrading resets Spot-specific network settings

### Compatibility Notes

- Not compatible with L642-format recorded inspections
- SV600 inspection data can be converted to L642 format — contact BD support

---

## Sorama L642

The Sorama L642 is a direct replacement for the Fluke SV600 with an identical form factor. It requires Spot software version 5.0.1 or later.

### Installation Methods

The L642 supports the same two installation configurations as the SV600:

#### Option 1: Spot Cam 2 Accessory Bay

- Mount the L642 in the Spot Cam 2 accessory bay
- In Admin Console, select the **"SpotCam2-mounted"** configuration

#### Option 2: Standalone Roll Cage Mount

- Mount to the center payload rails
- Power via PoE from Core I/O: connect through **ETH2** (same setup as SV600)

### Firmware Updates

- Access the firmware interface at `http://<robot_ip>:24080`
- Navigate to **Settings > Device Settings**
- L642 firmware is maintained by Sorama and may be released independently of Spot software updates
- OTA updates are supported via Orbit bundle deployment

### Migration from SV600

- Existing SV600 inspection data can be converted to L642 format
- Contact BD support to initiate a conversion

---

## Quick Comparison

| Feature | Fluke SV600 | Sorama L642 |
|---|---|---|
| Form factor | — | Identical to SV600 |
| Spot software requirement | — | 5.0.1+ |
| Spot Cam 2 accessory bay | Yes | Yes |
| Roll cage mount | Yes | Yes |
| Firmware host | `http://<robot_ip>:24080` | `http://<robot_ip>:24080` |
| Orbit OTA support | No | Yes |
| L642 recorded inspections | Not compatible | Compatible |
| SV600 data conversion | N/A | Supported (contact BD support) |
