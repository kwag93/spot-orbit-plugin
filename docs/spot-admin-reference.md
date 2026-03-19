# Spot Administration Reference

Admin operations, user management, licensing, and logging.
Source: BD Support Articles 49932, 214602, 72041, 74250, 70795, 221805

---

## Factory Reset (221805)

Resets all Spot settings (network, user accounts, licenses, pairings) to factory defaults.

### Requirements

- Spot robot with sufficient battery charge
- Software v5.1.3+ recommended (see critical warning below)
- Admin credentials (found on battery compartment label)

### Method 1: Admin Console (Browser)

1. Connect a PC or tablet to the same network as Spot (WiFi or Ethernet).
2. Open Chrome and navigate to Spot's Admin Console:
   - WiFi: `https://192.168.80.3`
   - Ethernet: `https://10.0.0.3`
3. Log in with Admin credentials from the battery compartment label.
4. Go to **General Settings**.
5. Click **Reset Spot to Factory Settings**.
6. Confirm the warning prompt. Spot reboots and resets.

### Method 2: Tablet Controller (Spot App)

1. Open the Spot app and connect to the robot.
2. Tap **Menu (≡)** in the top-left.
3. Select **ADMIN CONSOLE**.
4. Log in as Admin and navigate to the Factory Reset option.

### Method 3: Hardware Buttons (when software access is unavailable)

1. Locate the BLE and Reset buttons on the rear of the robot.
2. Press and hold both simultaneously for 10 seconds.
3. Watch for LED sequence: red → blue → green.
4. Wait ~20 seconds until the LED flashes white twice — reset is complete.

### Precautions

- **CRITICAL — v5.1 boot failure bug**: Spot software v5.1.0 through v5.1.2 has a bug where factory reset causes a boot failure requiring BD repair. **Update to v5.1.3+ before performing a factory reset on any v5.1.x robot.**
- All user data is permanently deleted: network configs, controller pairings, logs, and Autowalk missions.
- After reset, use default credentials from the battery compartment label and reconfigure the network.
- **Zero-out Storage** option (v5.1+): Overwrites the internal SSD so data is unrecoverable. Use before reselling or decommissioning.

---

## Spot Admin Console (49932)

A web server hosted on Spot, accessible via browser. Chrome is recommended.

### Access

| Connection | URL |
|---|---|
| WiFi | `https://192.168.80.3` |
| Ethernet | `https://10.0.0.3` |
| Tablet | Spot App → Menu → ADMIN CONSOLE |

Default credentials are printed on the label inside the battery compartment.

### Settings Pages

| Page | Access Level | Description |
|---|---|---|
| User Management | Admin only | Create/modify user accounts |
| Network Setup | Admin only | Configure WiFi, Ethernet, and network checks |
| Software Update | Admin only | Upload and apply software updates |
| Spot License | Admin only | View and install licenses |
| Logs | All users | View, download, and delete robot logs |
| About | All users | Serial number, software version info |
| Payloads | All users | Payload configuration |
| General Settings | Admin only | Factory reset, miscellaneous settings |
| Battery | All users | Battery status, cell voltage differential |
| WiFi Dashboard | All users | WiFi network diagnostics |
| Visualizer | All users | Real-time sensor visualization |

---

## Spot User Accounts (214602)

### Default Accounts

Two default accounts exist; credentials are printed on the battery compartment label:
- **Admin** account
- **User** account

### Permission Levels

| Capability | Admin | Limited Access |
|---|---|---|
| Drive robot | Yes | Yes |
| Modify user accounts | Yes | No |
| Update software | Yes | No |
| Change network settings | Yes | No |
| Factory reset | Yes | No |
| Access auto-operation features | Yes | No |
| Download mission/inspection data | Yes | No |
| Take screenshots | Yes | No |
| Access Admin Console from Spot App | Yes | No |

---

## Spot Licenses (72041)

### License Types

| Feature | Explorer | Enterprise |
|---|---|---|
| Autowalk distance limit | 1 km | Unlimited (2 km, 100 actions) |
| Diagnostic logging opt-out | No | Yes |
| Spot Dock support | No | Yes |

- As of **v4.1.0**, motor power no longer requires a license.

### Installing a License

- **Automatic**: License can be auto-pushed to Spot over the network via `https://bosdyn.com` (TCP 443)
- **Manual**: Admin Console → Spot License → CHOOSE FILE → upload → **reboot to activate**
- Contact BD Support with robot serial number to receive license file
- License files cannot be viewed until uploaded to Spot
- Multiple license files can be freely switched; older valid licenses still work

**Install failures:** Wrong serial number, future start date, expired license, or non-BD file. Previous valid license is retained on failure.

### License Validation

A license is tied to:
- Robot serial number
- Valid date range

### Viewing License Details

Admin Console → Spot License shows:
- License ID
- Serial number
- Status (active/expired)
- Expiration date
- Enabled features

---

## Spot Robot Logs (74250)

### Overview

Logs are accessible from Admin Console → Logs. They are encrypted and can only be read by BD.

### What Is Logged

- API service logs
- Images (optional, off by default since v4.1)
- System performance data
- Acoustic data (optional, off by default since v4.1)

### Log Generation

**Automatic**: Logs are generated on faults, falls, and mission failures.

**Manual**:
- Tablet: Create log entry from the Spot app
- Orbit: Create log entry from mission view
- Admin Console: Click **TRIGGER JOURNAL LOG** button

### Image and Acoustic Logging

Off by default since v4.1. Toggle in Admin Console → Logs.

### Proxy Server

A proxy server for log uploads can be configured in Admin Console → Logs.

### File Format

```text
date_serialnumber_eventtype.bdb
```

### Log Management

- Restrict uploads to Ethernet only (configurable)
- Download logs via Admin Console
- Delete logs (requires robot reboot to take effect)
- Oldest logs are auto-deleted when storage is full
- BD servers auto-delete logs after 6 months

---

## Spot Software Updates (70795)

### Update Methods

**Method 1: Admin Console Upload**
1. Connect Spot to power source (Dock or Power Supply)
2. Download `.bde` from `https://support.bostondynamics.com/s/spot/downloads`
3. Admin Console → Software Update → drag-and-drop or CHOOSE FILE
4. Select UPLOAD → INSTALL AND REBOOT
5. Wait for reboot; reload page to verify

> **Caution:** Version mismatches between Spot and controller may cause unexpected or hazardous behavior. Always match versions.

**Method 2: Orbit OTA Deployment (Spot 5.0+ only)**
- Requires robots added to Orbit with admin credentials
- **Pre-bundled**: Enroll Orbit with BD → Settings → Robot Software → Download from BD
- **Manual bundle**: Upload `.bde` (robot), `.pfw` (Spot Cam/L642/SV600), `.spx` (extensions)
- Deploy: Settings → Robot Software → Deploy Bundle → select robots

> **Notice:** `.gpg` (Spot Cam) and `.firmware` (L642) files cannot be included in Orbit bundles — use `.pfw` files instead.

**Tablet controller:**
- App updates bundled with robot software; prompted on connect to updated Spot
- Manual: download `.apk` from BD support, transfer to tablet, install via file browser
- Keep tablet OS and firmware up to date per manufacturer instructions

**Payload software:** Download from BD support, check compatibility chart, follow payload-specific instructions.

### Version Support Policy

Only the current and previous minor releases are supported (e.g., x.1 and x.0 plus all patches). Do not skip intermediate major or minor releases.

### Best Practices

- Pause all mission schedules and set motor lockout before updating
- Do not skip major or minor releases
- Check factory-installed version on newly received equipment and update before use
- Update to v5.1.3+ before factory resetting any v5.1.x robot
