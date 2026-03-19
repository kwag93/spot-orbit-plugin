# Site Hub Installation and Administration Guide

Hardware setup, network configuration, and Orbit administration for Site Hub.

Source: BD Support Articles 72072, 71290

---

## What is Site Hub?

Site Hub is a dedicated server appliance for running **Orbit**, Boston Dynamics' fleet management software. Orbit can also run as a VM on existing servers or as a BD-hosted cloud service.

---

## Hardware Specifications

| Component | Specification |
| --- | --- |
| Form Factor | 1U rack-mount server |
| CPU | Intel Xeon 6238R, 2.2GHz, 28 cores, 56 threads |
| RAM | 128GB DDR4 2666MHz ECC RDIMM (4x 32GB) |
| SSD | 2x Intel D3-S4510 3.84TB SATA |
| NVMe | 1x Toshiba XG6 1TB M.2 |
| HDD | 2x Seagate 12TB 7.2K RPM SATA3 |
| GPU | NVIDIA Tesla T4 16GB (passive cooling) |
| Security | TPM 2.0 (SPI) |
| PSU | 2x 500W redundant (RPSU) |
| Network | 2x 10Gb RJ45 Ethernet |

### What's in the Box

- Site Hub server
- Power cables (2)
- Rackmount rails and fasteners
- Welcome sheet with admin credentials

Additional required (not included): Ethernet cables (2), C13-C14 power cables (for rack mount)

---

## Network Ports

| Port | Name | IP Address | Purpose |
| --- | --- | --- | --- |
| Administrator | Left RJ45 | `192.168.2.5/24` (static, DHCP off) | Initial setup only, not configurable |
| Operator | Right RJ45 | `192.168.1.5/24` (default, DHCP on) | Production network, 10Gbps, configurable |

Serial numbers starting with S49+ have additional top-right ports — these do NOT communicate with Orbit and must not be used.

---

## Initial Setup

### Power On

1. Connect power cables → fan starts, LED turns orange (standby)
2. Press power button → LED turns green
3. Wait **minimum 10 minutes** for full boot (4 drive LEDs flash green when ready)

### Network Configuration

1. Connect PC to **Administrator port** via Ethernet
2. Connect **Operator port** to production network
3. Set PC IP to `192.168.2.x/24` range (e.g., `192.168.2.40`)
   - Windows: may need gateway `192.168.2.1`
4. Verify: `ping 192.168.2.5`
5. Open Chrome: `https://192.168.2.5`
6. Accept certificate warning, log in with Welcome Sheet credentials
7. Navigate to **Settings → Networks**, configure Operator port (DHCP or static)
8. Note the IPv4 address assigned
9. Disconnect from Administrator port
10. Access Orbit at `https://<operator_ip>` from production network

### TLS Certificate (Optional)

Upload custom certificates at **Settings → Networks**:
- Certificate: X.509 PEM-encoded `.crt` file
- Key: unencrypted plaintext `.key` file

---

## Orbit Administration

### User Roles (RBAC)

| Role | Permissions |
| --- | --- |
| **Admin** | Full control: settings, users, robots, software deployment |
| **Driver** | Remote control, mission execution, data viewing |
| **Data Reviewer** | View/download mission data, no robot control |
| **Standard User** | Read-only status viewing |
| **Temporary User** | Time-limited access via shared URL |

### Robot Management

- Add/remove Spot robots to the fleet
- Push OTA software bundles to multiple robots simultaneously
- Monitor hardware status, battery cycles, joint motor health

### Mission Scheduling

Navigate to **Settings → Schedule Missions → + Add Schedule**.

**Prerequisites:**
- Admin privileges required
- Robot must be on Dock (Orbit needs Lease)
- Timezone must be configured (schedules are timezone-relative, 1-hour increments)

**Schedule Parameters:**
- **Robot Name**: Select target robot from fleet
- **Mission Name**: Select Autowalk mission
- **First Start**: Exact date and time
- **Repeat**: Interval-based (minutes, hours, days, weeks)

**Advanced Options:**
- **Operating Hours**: Restrict missions to specific hours (e.g., after-hours only)
- **Avoid Precipitation**: Weather-based gating (requires Weather Settings)
- **Weather Settings**: City/location, max precipitation threshold (up to 5mm), 3-hour forecast evaluation, snooze override

**Schedule Management:**
- Export to external calendars via `.ical` download
- Automatic conflict detection and timing adjustment
- Deleting a schedule does NOT stop an in-progress mission — abort via Drive page
- Calendar events map to Orbit REST API: `GET/POST/DELETE /api/v0/calendar/schedule` (PATCH not supported)

### API Tokens

Generate at **Settings → Developer Features → API Access Tokens** for programmatic Orbit REST API access without user credentials.

### Webhooks

Push events to external servers via POST:
- Mission completed
- Inspection alerts / anomaly detection
- Robot communication loss

Configure at **Settings → Webhooks**.

### Extensions on Site Hub

- Upload SPX packages at **Settings → Extensions**
- Platform: `linux/amd64` (unlike Core I/O's `linux/arm64`)
- docker-compose version: `"2.4"` (Core I/O uses `"3.5"`)
- Orbit AI Visual Inspections extension is NOT preloaded — must be installed manually

### System Settings

- Network and DNS configuration
- Custom TLS/SSL certificate upload
- Email/SMTP alerts for system issues
- Diagnostic log download or auto-upload to BD support
- Custom Web Views: embed third-party HTTPS dashboards in Orbit UI

---

## SiteHub vs Core I/O Decision Matrix

| Factor | Site Hub | Core I/O |
| --- | --- | --- |
| Location | Server room / data center | Mounted on Spot robot |
| Architecture | x86_64 (amd64) | ARM64 |
| docker-compose | `"2.4"` | `"3.5"` |
| Platform target | `linux/amd64` | `linux/arm64` |
| GPU | NVIDIA Tesla T4 (16GB) | NVIDIA Volta (384 cores, shared 16GB RAM) |
| Storage | ~20TB total | 512GB NVMe |
| RAM | 128GB ECC | 16GB LPDDR4x |
| Network | 10Gbps Ethernet | GbE + 5G/LTE |
| Purpose | Fleet management, data aggregation, scheduling | Edge compute, real-time inference, connectivity |
| Extension upload | Orbit web UI (Settings → Extensions) | Admin Console at port 21443 or drag-and-drop |
| Reserved port | None | TCP 21443 |
