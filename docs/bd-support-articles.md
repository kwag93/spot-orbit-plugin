# Boston Dynamics Support Articles

Compiled from Boston Dynamics Support Center. Source URLs listed per section.

---

## 1. Site Hub Installation and Setup

**Source:** <https://support.bostondynamics.com/s/article/Site-Hub-Installation-and-Setup-72072>

Site Hub is a dedicated server appliance for running Orbit, Boston Dynamics' web-based fleet management software. Orbit can also run as a virtual machine on existing servers or as a cloud service hosted by Boston Dynamics.

### What's in the Box

- Site Hub server
- Power cables (2)
- Rackmount rails and fasteners
- Site Hub data sheet

Additional required tools (not included): Ethernet cables (2), unmanaged switch (optional), C13-C14 power cables (2).

### Hardware Specifications

| Item | Qty |
|------|-----|
| 1U Single Socket Server, C622 Chipset, 2x 10Gb RJ45 Ports, 500W RPSU | 1 |
| Intel Xeon 6238R, 2.2GHz, 28 Core, 56 Thread | 1 |
| DDR4 32GB 2666MHz ECC RDIMM | 4 |
| Intel D3-S4510 3.84TB SATA 6Gb/s 3D TLC 2.5" 7mm | 2 |
| Toshiba XG6 1TB NVMe M.2 22x80 mm | 1 |
| Seagate 3.5", 12 TB, 7.2K RPM, SATA3 | 2 |
| NVIDIA Tesla T4 16GB GPU Passive Cooling | 1 |
| SPI Capable Vertical TPM 2.0 | 1 |

### Network Ports

The rear panel includes two redundant power supplies and two active RJ45 Ethernet ports:

- **Administrator port** -- Used only during initial setup. Not configurable. Permanently assigned static IP `192.168.2.5/24` with DHCP off.
- **Operator port** -- Communicates with your network. Configurable in Orbit settings. Default static IP `192.168.1.5/24` with DHCP on.

> **Important:** Site Hubs with serial numbers beginning with S49 or higher have two additional Ethernet ports above and to the right of the active ports. These ports do NOT communicate with Orbit and should not be used.

### Installation Procedure

1. Unbox and mount the Site Hub in your data center or server room.
2. Connect to power (two redundant power supplies available).
   - In a rack: Use C13 to C14 power cables.
   - Not in a rack: Use standard power cables included in the box.
3. When connected, fans initiate and the power light illuminates amber (sleep mode).
4. Press the power button on the front panel. Power light turns green.
5. Wait at least **10 minutes** for the Site Hub and software to fully start up.
6. When ready, green status lights on all four drives will blink rapidly.

### Initial Network Setup

Requirements: 2 Ethernet cables, computer with Ethernet port and Chrome browser.

> **Important:** Orbit requires Google Chrome. Some features (e.g., Spot CAM video feed) may be unavailable in other browsers.

1. Connect an Ethernet cable to the **Administrative port** on the rear panel and the other end to your computer.
2. Connect a second Ethernet cable to the **Operator port** and attach to an active network port.
3. Set your computer's IP to the `192.168.2.0/24` range (e.g., `192.168.2.40`, netmask `255.255.255.0`). On Windows, you may also need gateway `192.168.2.1`.
4. Ping `192.168.2.5` to verify connectivity.
5. Open Chrome and navigate to `https://192.168.2.5`.
6. Bypass the certificate warning (you can install a custom certificate later).
7. Log in with the default admin credentials (printed on the welcome sheet shipped with the Site Hub).
8. Navigate to **Settings > Networks** and configure the Operator port (DHCP or Static IP).
9. Note the IPv4 Address.
10. Disconnect from the Administrative port. Switch to the network people will use to access Orbit.
11. Navigate to `https://<Site_Hub_Operator_IP>` to confirm access.

### Operator Port Troubleshooting

If "Dynamic IP Address not found" is displayed under Site Hub Network:

- Ensure the switch port is enabled and tagged for the correct VLAN.
- Ensure a straight-through Ethernet cable is being used.
- If using Cisco ISE, ensure an ISE profile has been created for the Site Hub.
- The Operator Port is capable of 10 Gbps. In rare cases, adjust switch port auto-negotiation to 1 Gbps full duplex.

### Site Hub IP Address Configuration

1. Log in to Orbit as an admin.
2. Navigate to **Settings > Networks**.
3. Select **Set Static IP Address** and enter network details, or select **Enable DHCP**.
4. Select **Confirm**.

> Setting a static IP address other than the default disables DHCP. To reset to factory defaults (static IP `192.168.1.5/24`, DHCP enabled), select **Reset to Default**.

### Certificate Management

Orbit accepts custom TLS certificates. Requirements:

- Certificates must be in **X.509 encoded PEM format**.
- Key files must be in **decrypted plain text format**.
- Certificates must have `.crt` file extensions.
- Key files must have `.key` file extensions.

**Upload procedure:**

1. Navigate to **Settings > Networks**.
2. Select **Upload Certificate** and choose the `.crt` file.
3. Select **Upload Key** and choose the `.key` file.
4. Select **Verify Certificate** (loads for testing, does not save permanently).
5. Refresh the page to confirm the Site Hub is reachable with the new certificate.
6. If successful, select **Write Current Certificate To Disk**.

> If you do not save the new certificate, the Site Hub reverts to the previous certificate after 3 minutes.

**Convert pfx keystore to X.509 PEM cert+key:**

```bash
# Extract the certificate
openssl pkcs12 -in original.pfx -clcerts -nokeys -out orig_cert.crt
openssl x509 -inform der -in orig_cert.crt -out pem_cert.crt

# Extract the key
openssl pkcs12 -in original.pfx -nocerts -out orig_key.key

# Decrypt the private key
openssl rsa -in orig_key.key -out dec_key.key
```

If the certificate is base64 encoded, convert to DER first:

```bash
openssl x509 -outform der -in orig_cert.crt -out x509_cert.crt
```

### Extensions (Site Hub)

New Site Hubs are NOT preloaded with the Orbit AI Visual Inspections extension. You must install it yourself.

Navigate to **Settings > Extensions** to install and manage extensions.

### Post-Setup Configuration Checklist

- Check for software updates before use.
- Set a secure administrator password.
- Configure Orbit users (per-user credentials, SSO available).
- Add Spot robots to Orbit (robots must be on the same network as the Site Hub).
- Configure network settings and certificates.
- Configure WebRTC settings.
- Set the comms loss policy.
- Set robot bandwidth limits.
- Configure notifications and alerts.
- Configure Custom Web Views.
- Install Extensions.

---

## 2. Orbit Administration and Settings

**Source:** <https://support.bostondynamics.com/s/article/Orbit-Administration-and-Settings-71290>

Orbit admins use the Settings panel to manage missions, update software, manage users and robots, and perform system administration.

> **Important:** Orbit requires Google Chrome. Some features may be unavailable in other browsers. Changes to settings may interrupt Operators currently driving robots.

### Account Settings

All users can edit their Orbit profile at **Settings > Account**:

- Edit display name
- Change password
- Configure email alerts
- Edit temperature unit and language preferences

### Email Alerts

Orbit sends email alerts about robot fleet status and site assets. An admin must enable email sending on the Alerts page first.

**Alert types:**

- **Inspection Alerts** -- Real-time notifications of anomalies during inspections.
- **System Alerts** -- Real-time notifications of robot/mission performance issues.
- **Inspection Summaries** -- Periodic reports summarizing inspection activities and anomaly status.

**Alert severity levels:**

| Level | Description |
|-------|-------------|
| Info | Informational, no action required (e.g., battery finished charging) |
| Warning | Error may occur in the future, no action presently required |
| Error | Action required, fatal to operation (e.g., robot failed to dock) |
| Critical | Severe error requiring immediate attention (e.g., battery critically low) |

### Robots

- Add new robots, edit existing, or remove robots.
- Any robot in the fleet can be used by any Orbit user.
- **Orbit supports up to 20 simultaneously connected robots.**

### Site Maps

- Create and edit site maps (real-time representation of facility and robot fleet).
- Manage uploaded Autowalk recordings.

### Schedule Missions

Administrators can schedule missions on a one-time or repeat basis with any robot in the fleet.

### Missions and Actions

Admins can edit, download, duplicate, or remove missions at **Settings > Missions and Actions**.

### Admin Settings

#### Alerts

Configure alerts via browser notifications, email, and other methods.

- **Email alerts:** Configure an SMTP server for delivery.
- **PagerDuty alerts:** Configure PagerDuty service integration.

#### Data Management

- **Data sharing:** Controls what data is sent to Boston Dynamics (usage metrics, robot logs, images, inspection results, Site View images). Default: on.
- **Clear graph data:** Clears all Autowalk mission data.
- **Archive test data:** Hides inspection results/metrics from test mode robots (not user-recoverable).
- **Delete inspection data:** Permanently deletes all inspection data for a selected time range.
- **Blur faces:** When enabled, faces in Site View and visual inspections are blurred. Cannot be unblurred once processed.

#### Spot Audio/Visual System

- Configure brightness and buzzer volume for connected Spot robots.
- Two color palettes: Default (green/amber) and Alternate (blue/red).
- Settings are applied fleet-wide and override individual robot settings.

#### Comms Loss Policy

Controls what action a robot takes if it loses communication with the Site Hub.

#### Robot Bandwidth

Controls data streaming rates from robot cameras and telemetry.

- Disabling Robot Camera Image Update Rate or Terrain Grid Update Rate makes those views unavailable.
- **Use wired connection:** Orbit attempts uploading mission/map data over Ethernet first, then WiFi/payload.

#### Driving

Allow Orbit Drivers and Admins to use touch-to-go controls on the Drive screen.

#### Session History Data

Allow data retrieval from robots on wireless connections. If disabled, data only retrieved via Ethernet.

### Users

- Add/delete users, change passwords, edit roles and permissions.
- **Idle session timeout:** Logs users out after set duration with no browser activity.
- **Absolute session timeout:** Logs users out after set duration regardless of activity.

#### Single Sign-On (SSO)

Configure SSO to allow login with organizational credentials.

#### User Roles

- Admins can create and modify custom user roles with granular permissions.
- Default Orbit user roles cannot be modified or deleted.

### Software Management

#### Orbit Software

- **Cloud:** Available releases listed on the Orbit Software tab.
- **Site Hub:** Releases provided on the Downloads page with `.bde` file extension.

#### Robot Software

Create and deploy software bundles (robot software, payload software, extensions) to connected robots simultaneously.

### Scheduler

- **Robot time zone** must be set (corresponds to where robots are located).
- Scheduled missions are prevented from launching until a time zone is set.
- Launch times are relative to the current time zone setting.
- Orbit supports whole-hour increments for time zones.

### Work Orders

Orbit can generate work orders in external Work Order Management (WOM) systems when inspections trigger anomaly alerts.

### Networks

#### Network Check

Runs a series of network tests to verify connectivity between Orbit, Spot robots, and network endpoints (DNS servers, etc.).

**Procedure:**

1. Navigate to **Settings > Networks**.
2. Select **Run Network Check**.
3. Review failures (some may be expected based on your setup).
4. Re-run after fixing unexpected failures.
5. Contact Boston Dynamics Support with Raw Results if failures persist.

### Backup and Restore

Create backups of Orbit data and restore from backups to reset software or migrate data between instances.

### Support

- Enable **Allow Boston Dynamics support staff to log in** for remote support.
- Access level is configurable.
- Access can be revoked at any time (immediately logs out support personnel).
- Orbit instance must be "enrolled" with Boston Dynamics for remote support.

### Enrollment (Site Hub and VM only)

- Allows secure connection to Boston Dynamics servers for software updates, remote support, and services.
- Cloud-hosted instances are automatically enrolled.
- Site Hub and VM instances must be enrolled manually.

### AI Models

Add and activate AI models, or change the default model for AI visual inspections.

### Developer Features

#### Extensions

For Orbit running on a Site Hub, admins can upload, manage, and remove Spot Extensions.

A Spot Extension is a self-contained application that adds additional software capabilities to Orbit and Spot with a web-based interface. Examples:

- Custom sensor payloads
- Computer vision models for anomaly detection
- Integration with cloud services

> **CRITICAL: Do not use underscores ("_") when naming Orbit extension files. Extensions with underscores in the filename will NOT run successfully.**

**Upload an extension:**

1. Log in as admin.
2. Navigate to **Settings > Extensions**.
3. Drag-and-drop the `.spx` file or select **CHOOSE FILE**.
4. Select **UPLOAD**.
5. Wait for upload to complete (depends on connection speed).
6. Orbit will install the extension and may begin running it automatically.

**Start, stop, or delete an extension:**

1. Log in as admin.
2. Navigate to **Settings > Extensions**.
3. Locate the extension and select **Start/Stop** or **Delete**.

#### Custom Web Views

Embed content from other websites into the Orbit dashboard. Examples:

- Intranet sites for uploading screenshots
- Browser-based chat apps
- Custom extensions developed for Orbit
- Live maps, weather reports, etc.

All Orbit users can access Custom Web Views from a dropdown at the top of the Orbit page.

**Add a Custom Web View:**

1. Log in as admin.
2. Open the Custom Web Views menu and select **Manage Custom Web Views**, or navigate to **Settings > Custom Web Views**.
3. Select **+ Create Custom Web View**.
4. Provide:
   - **Label** -- A word or phrase to identify your Web View.
   - **Icon Address** -- URL for an image (scaled to 20px height).
   - **Address** -- URL of the website to embed.

#### Webhooks

Register webhooks subscribed to Orbit events. When events occur, Orbit sends a webhooks payload with event data to the configured URL.

#### Logs

- Manually download logs of Orbit system performance data.
- Opt to have logs automatically uploaded to Boston Dynamics.
- Logs are encrypted (only viewable by Boston Dynamics).
- Log filenames format: `yyyy_mmdd_hhMMDD_all.tdf.enc` (timestamps in UTC).

### API Access Tokens

Create API access tokens for programmatic access to Orbit (alternative to username/password for API use cases).

> **Security:** API keys should be kept secure. Boston Dynamics recommends separate API keys for different applications and regular rotation.

**Create an access token:**

1. Log in as admin.
2. Navigate to **Settings > API Access Tokens**.
3. Enter a name and select desired level of access.
4. Select **SAVE**.
5. Copy the token in the following window.

> **CAUTION:** If you close the window before copying, the token cannot be viewed again. You must create a new one.

### Other Settings

- **Network Details** -- View live and historical network data from the Site Hub.
- **Janus Details** -- View quality and status of audio/video feeds (Spot CAM payloads).
- **Storage Details** -- View disk usage breakdown for all data stored.
- **Server Details** -- View live and historical performance data (Site Hub only).
- **System clock synchronization** -- Displays detected time desync between browser and Orbit. Select Synchronize to sync (requires reboot).
- **Reboot Site Hub** -- Perform a software reboot.
- **Licenses** -- Third-party acknowledgments.

---

## 3. Orbit Overview (Hub Page)

**Source:** <https://support.bostondynamics.com/s/orbit>

Orbit is the robot fleet management and data platform for Spot.

### About Orbit

- About Cloud-Based Orbit
- Set up Orbit as a Virtual Machine
- Site Hub Installation and Setup
- Orbit for Enterprise

### Get Started with Orbit

- Orbit Admin and Settings
- Add a Robot to Orbit
- Thermal Inspections with Orbit

### Networking for Spot and Orbit

- Prepare Your Network for Spot
- Firewall Rules for Adding Spot to Your Wifi Network
- Connect Spot to Your Wifi Network

### Site Maps

- What is a Site Map?
- Create a New Site Map
- Edit a Site Map
- Monitor Your Site Map
- Explore Your Map in Site View

### Autowalk Missions

- Autowalk Missions with Orbit
- Edit a Mission with Orbit
- Orbit Mission Validation

### Manage and Review Data

- Monitor Fleet Performance
- Upload Autowalk Data to Orbit
- View and Analyze Inspection Data with Orbit

---

## Quick Reference: Key Facts for Extension Developers

### Extension Management

- Extensions use `.spx` file format.
- Upload at **Settings > Extensions** (drag-and-drop or file browser).
- **No underscores in filenames** -- extensions with underscores will fail.
- Extensions can be started, stopped, and deleted individually.
- Orbit may begin running an extension automatically after upload.
- Extensions can be included in robot software bundles for simultaneous deployment.

### API Access

- Tokens created at **Settings > API Access Tokens**.
- Name + access level required.
- Token shown only once -- copy immediately.
- Separate keys recommended per application.
- Regular key rotation recommended.

### Custom Web Views

- Configured at **Settings > Custom Web Views**.
- Requires: Label, Icon Address (URL), Address (URL).
- **HTTPS only**: "Only sites that utilize HTTPS can be embedded into Orbit."
- Accessible to all Orbit users from a dropdown at the top of the page.
- Can embed custom extension UIs as web views.
- WebView is rendered directly in the client's browser (relies on browser for networking, cookies, caching).
- Sites that Orbit cannot route to are still accessible if the user's browser can reach them.
- Orbit does not save any credentials or payloads passed to external websites.

### Webhooks

- Register at **Settings > Webhooks** (via Developer Features).
- Subscribe to Orbit events.
- Orbit sends payload with event data to configured URL.

### Network Requirements

- Orbit requires **Google Chrome** browser.
- Site Hub has two active Ethernet ports: Administrator (`192.168.2.5/24`) and Operator (configurable, default `192.168.1.5/24`).
- Operator port supports 10 Gbps.
- DHCP or Static IP configuration available.
- TLS certificates supported (X.509 PEM format, `.crt` + `.key`).
- Network Check tool available at **Settings > Networks**.

### Known Issues and Limitations

- Orbit supports up to **20 simultaneously connected robots**.
- Orbit requires **Google Chrome** -- other browsers may have limited functionality.
- Extension filenames must **NOT contain underscores**.
- Site Hubs with serial numbers S49+ have extra Ethernet ports that do NOT work with Orbit.
- Blur faces feature is **irreversible** once applied.
- Archived test data is **not user-recoverable**.
- Orbit supports only **whole-hour time zone increments**.
- API access tokens are shown **only once** at creation time.
- Certificate verification has a **3-minute auto-revert** if not saved.
- Web server takes up to **10 minutes** to start after initial power on.
