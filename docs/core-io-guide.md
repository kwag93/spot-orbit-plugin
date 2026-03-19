# Core I/O Comprehensive Guide

Hardware, setup, networking, and extension deployment for Spot Core I/O.

Source: BD Support Article 73140, dev.bostondynamics.com/docs/payload/docker_containers

---

## What is Core I/O?

Core I/O is a compute payload mounted on Spot that provides GPU-accelerated edge computing and cellular connectivity. It runs on an NVIDIA Jetson Xavier NX module and supports Docker-based extensions (SPX packages).

When equipped with an integrated LiDAR, it is marketed as **Spot EAP 2** (Enterprise Autonomy Package 2).

---

## Hardware Specifications

| Spec | Detail |
| --- | --- |
| Architecture | ARM64 (linux/arm64) |
| CPU | 6-core NVIDIA Carmel ARM v8.2 64-bit (6MB L2 + 4MB L3) |
| GPU | 384-core NVIDIA Volta (48 Tensor cores) |
| RAM | 16GB 128-bit LPDDR4x (51.2 GB/s) |
| Storage | 512GB NVMe SSD (LUKS encrypted) + 1x microSD slot |
| IP Rating | IP54 |
| OS | Ubuntu-based Linux |

### JetPack Versions

| Core I/O Version | JetPack | L4T |
| --- | --- | --- |
| v4.0.0+ | 5.1.2 | R35.4.1 |
| v3.3.0–3.x.x | 4.6.1 | R32.7.1 |

CUDA, cuDNN, and TensorRT are available natively.

### Power Output

| Voltage | Max Power |
| --- | --- |
| 24V | 50W |
| 12V | 50W |
| 5V | 30W |
| USB-C (PD) | 50W |
| USB 3.1 Type-A (x2) | 4.5W per port |

### I/O Interfaces

- 2x Gigabit Ethernet
- 5G/LTE modem (user-installable SIM)
- GPIO (PWM-capable), I2C, PPS output
- E-Stop interface
- USB-C (video out capable)

---

## Network Configuration

Network is managed by **NetworkManager**. Changes via `ip` or `ifconfig` do NOT persist across reboots. Use `nmcli` or the Admin Console for permanent changes.

### IP Addresses

| Context | IP Address | Notes |
| --- | --- | --- |
| Benchtop (direct Ethernet) | `192.168.50.5` | PC must be on 192.168.50.x subnet |
| Mounted on Spot (WiFi) | `192.168.80.3` | Via robot internal switch |
| Admin Console | `https://<ip>:21443` | Web UI for payload management |

### SSH Access

| Item | Value |
| --- | --- |
| Port | **20022** (not standard 22) |
| Default user | `spot` |
| Password | On the Welcome Sheet shipped with the hardware |

```bash
# SSH into Core I/O
ssh -p 20022 spot@192.168.80.3

# Copy files to Core I/O
scp -P 20022 myfile.tar spot@192.168.80.3:~/
```

### Port Reservations

| Range | Protocol | Notes |
| --- | --- | --- |
| 21000–22000 | TCP | Custom app incoming traffic |
| 21000–22000 | UDP | Custom app incoming traffic |
| **21443** | TCP | **RESERVED** — Core I/O internal use only |

---

## Mounting on Spot

1. Power off robot
2. Remove payload port caps
3. Choose front or rear payload port (check Spot Arm clearance)
4. Orient Core I/O connector (GXP) facing robot front
5. Insert 4 T-slot nuts into payload rails
6. Secure with 4x M5 x 10mm socket head cap screws
7. Connect ribbon cable to payload connector port

---

## Extension (SPX) Deployment

### Extension Package Structure

An `.spx` file is a compressed tarball containing:

- `manifest.json` — metadata
- Docker images (`.tgz` files)
- `docker-compose.yml` — container orchestration
- Icon file for web portal
- Optional: udev rules, additional app files

### manifest.json Required Fields

```json
{
  "description": "My Extension",
  "version": "1.0.0",
  "images": ["my-image.tgz"],
  "extension_name": "my-extension"
}
```

### File Persistence Across Upgrades

To preserve existing data during extension upgrades, add the following fields to manifest.json. Paths are relative to `/data/.extensions/{extension_name}`.

```json
{
  "files_to_save": ["config/settings.json"],
  "directories_to_save": ["data/logs"]
}
```

### Naming Constraints

- Letters, numbers, hyphens only (**no underscores, spaces, or parentheses**)
- Must NOT contain `coreio` or `mission_control`
- Extensions violating naming rules on Core I/O 4.1.0+ cannot be uninstalled via UI
- See `docs/troubleshooting.md` for known bugs related to naming violations

### Building ARM64 Images

```bash
# Setup cross-compilation (on x86 host)
sudo apt-get install -y qemu qemu-user-static
docker buildx create --use --name multiarchbuilder
sudo docker run --rm --privileged multiarch/qemu-user-static --reset -p yes

# Build for ARM64
sudo docker build -t my-image --platform linux/arm64 -f Dockerfile.l4t .

# Save image to compressed archive
sudo docker save my-image | pigz > my-image.tgz
```

Match base images to JetPack version:
- Core I/O v4.0.0+: Use JetPack 5.1.2 / L4T R35.4.1 base images
- Core I/O v3.3.x: Use JetPack 4.6.1 / L4T R32.7.1 base images
- OpenCV lacks CUDA support by default — use Nvidia `l4t-ml` container as base image for CUDA-accelerated OpenCV

### docker-compose.yml Best Practices

- **Logging**: Use `journald` driver (default since 4.1.0) — enables log retrieval from stopped containers
- **Memory limits**: Always set — uncontrolled leaks can exhaust device and trigger unpredictable termination
- **Security**: Avoid running as root — add `USER` directive in Dockerfile

### Packaging

```bash
# Basic packaging
tar zcfv my-extension.spx *

# Include hidden files explicitly
tar zcfv my-extension.spx * .hidden_file1 .hidden_file2
```

### Installation Methods

1. **Web Portal**: Drag-and-drop onto "Upload New Extension" panel at `https://<ip>:21443`
2. **USB Drive**: `tar xzfm my-extension.spx -C /data/.extensions/my-extension`
3. **SCP + CLI**: Copy and load manually via SSH

**USB installation with udev rules**: After untarring, if the extension includes udev rules, copy and reload them manually:

```bash
sudo cp /data/.extensions/my-extension/*.rules /persist/udev/rules.d/
sudo udevadm control --reload-rules
sudo udevadm trigger
```

### Direct Execution (without SPX)

python3 is pre-installed on Core I/O. You can run scripts directly:

```bash
scp -r -P 20022 my_app/ spot@192.168.80.3:
ssh -p 20022 spot@192.168.80.3
python3 my_app/main.py
```

Docker containers can also be loaded and run manually, but **manual configuration does not persist across reboots**.

### Extension Lifecycle States

| State | Meaning |
| --- | --- |
| CREATED | Container creation initiated |
| RESTARTING | Container restart in progress |
| RUNNING | All containers operational |
| STOPPED | Any container stopped = extension stopped |

### Log Retrieval

```bash
# Running containers
docker events  # note container ID
journalctl CONTAINER_ID_FULL={ID} -u docker.service --until now

# After reboot
journalctl -u docker.service --until now
```

---

## Software Updates

| Method | Description |
| --- | --- |
| Orbit OTA | Push software bundles via Orbit fleet management |
| Admin Console | Upload `.bde` file via web UI at `https://<ip>:21443` → Software |
| USB | Insert USB with `.iso` file, trigger update from Admin Console |

---

## 5G / LTE Connectivity

### Hardware

- Modem: Telit FN980 (built into Core I/O / EAP 2)
- Antenna: Taoglas Synergy MA1504
- SIM: Standard form factor, user-installable

### Configuration

- APN settings via Admin Console → Modem Control
- Advanced auth: SSH into Core I/O for direct modem configuration
- Consumer hotspots (MiFi) are NOT recommended for production

### Network Bands

- **5G Sub-6**: n1, n2, n3, n5, n7, n8, n12, n20, n25, n28, n38, n40, n41, n48, n66, n71, n77, n78, n79
- **LTE**: Bands 1–5, 7–8, 12–14, 17–20, 25–26, 28–30, 32, 34, 38–43, 46(LAA), 48(CBRS), 66, 71
- **WCDMA**: 1, 2, 3, 4, 5, 6, 8, 9, 19

### Recommendations

- **Private 5G / CBRS preferred** over public cellular for guaranteed bandwidth and QoS
- Use **public static IP** SIM for direct remote control
- Deploy **VPN (e.g., OpenVPN)** in Docker container for public network security
- SoftBank SIMs are known incompatible

### Failover

- Default route priority configurable via Admin Console ("Set Robot's Default Route")
- Orbit's auto-connect feature bridges network transitions (WiFi → 5G failover)
- IP address may change during network transitions

---

## FAQ: Core I/O and EAP 2

### Core I/O vs EAP 2

Functionally identical except EAP 2 includes an integrated LiDAR for enhanced autonomous navigation (sensing range up to 100m).

### Configuration Options

Both available in two configurations: with and without modem. Modem required for 5G/LTE. Core I/O computer present in all configurations.

### Cellular Service

- AT&T is the supported 5G provider in the United States
- Contact AT&T independently for SIM activation; request static IP SIMs for robot control over cellular
- Private LTE (e.g., Amazon Private 5G via CBRS) is supported

### Certified Regions

United States, Canada, UK, EU, Switzerland, Japan, Korea, Australia, New Zealand.

### Modem and Antenna

- Internal modem: Telit FN980
- Included antenna: Taoglas Synergy MA1504
- Custom antennas void compliance approvals; user responsible for local radio/EMC regulations

### SIM Compatibility

- User-accessible micro SIM slot
- SoftBank SIMs are incompatible

### Mounting

- Front and rear payload ports supported
- Under Spot Arm: only Core I/O without modem and lidar fits on front port

### Legacy Compatibility

- Spot EAP cannot be upgraded to EAP 2
- Old EAP lidar cannot be used with new Core I/O
- 3rd-party Spot Core software not compatible (different processor architecture)
- Migration guide: `https://dev.bostondynamics.com/docs/payload/docker_containers`

### PoE and USB

- No built-in PoE — acquire your own PoE injector
- USB dongle/modem can be plugged in (not officially supported/guaranteed)

### GXP

Core I/O has its own effective GXP built into the system (no separate GXP needed).

### Benchtop Power

For desktop configuration without Spot, use off-the-shelf power cable: Model SDI65-48-UD, Part SDI65-48-UD-P6.

---

## Add a WiFi Dongle

Applies to both Spot Core and Spot Core I/O.

> **Notice:** Generally any USB WiFi adapter supporting Linux will work. Spot Core runs Ubuntu 18.04 (Kernel 4.15), Spot Core I/O runs Ubuntu 20.04 (Kernel 5.10.120).

### Procedure

1. Connect WiFi dongle to USB port
2. SSH into payload: `ssh -p 20022 spot@<ROBOT_IP>`
3. Configure WiFi via NetworkManager:

```bash
nmcli d                    # list devices managed by NetworkManager
nmcli r wifi on            # enable WiFi radio
nmcli d wifi list          # list available WiFi networks
sudo nmcli d wifi connect MY_WIFI password "MY_PASSWORD"
```

4. Set routing metric for higher priority:

```bash
sudo nmcli c mod "YOUR_WIFI" ipv4.route-metric 1
```

5. **Spot Core only** (not needed on Core I/O): Edit `/etc/network/interfaces` to add route:

```text
up ip route add 192.168.80.0/24 via 192.168.50.3 metric 2
```

6. Reboot: `sudo reboot`

---

## Add an Available Ethernet Port

When all Ethernet ports are in use (e.g., Spot Cam+IR + EAP 2 + Rajant ES1 + Fluke SV600), additional ports can be added.

### Option 1: Ethernet Splitter

Purchase a 2-to-1 RJ45 splitter. Recommended: N035-001 2-to-1 RJ45 Network Signal Splitter.

### Option 2: Route Lidar Ethernet to USB

Free up an Ethernet port by converting the lidar connection to USB.

> **Caution:** Metal or unshielded adapters may cause electrical damage. Ensure adapter is properly insulated.

**Procedure:**

1. Power off Core I/O and Spot, remove battery
2. Remove M3 screws and lift Core I/O cover
3. Unplug lidar Ethernet cable from unmanaged switch (near Spot's rear)
4. Plug cable into Ethernet-to-USB/USB-C adapter (USB-C recommended)
5. Plug adapter into available USB port inside Core I/O
6. Connect via terminal and verify new profile:

```bash
nmcli c show   # look for "Wired connection 1"
```

7. If no profile appears, create one manually:

```bash
# Identify device ID
ip a

# Create profile
sudo nmcli con add type ethernet con-name "Wired connection 1" ifname YOUR_DEVICE_ID

# Configure IP and routing
sudo nmcli c mod "Wired connection 1" \
  ipv4.method 'manual' \
  ipv4.address '192.168.50.202/24' \
  +ipv4.routes '192.168.50.201/32 192.168.50.202' \
  ipv4.route-metric 105

# Restart profile
sudo nmcli c down "Wired connection 1" && sudo nmcli c up "Wired connection 1"
```

8. Verify lidar reports data, then reinstall Core I/O cover

---

## Access the Internet Through Spot

Applies to Spot Core and Spot Core I/O.

> **Notice:** Spot Core cannot access internet/intranet when Spot is in Access Point mode (local WiFi network).

### Step 1: Connect Spot to Your Network

Use a shared WiFi network or Ethernet connection.

### Step 2: Configure Spot Network Settings

1. Open Spot Admin Console
2. Select **Network Setup**
3. If DHCP is disabled, enter network router IP as **Stored Default Route**
4. Toggle **Is Current Default Route** to true

### Step 3: Configure Spot Core Network Settings

1. Navigate to `https://<robot_ip>:21443` (Cockpit web admin)
2. Or: Admin Console > Payloads > Spot CORE > OPEN COCKPIT
3. Go to **Networking** > select interface `enp2s0`
4. Edit IPv4 settings:
   - **Gateway**: `192.168.50.3` (Spot's payload port IP)
   - **DNS**: Toggle Automatic off, add your network DNS server IPs
5. Select **Apply**

### Step 4: Test Connection

```bash
ssh -p 20022 spot@<robot_ip>
ping bostondynamics.com    # Ctrl-C to stop
```

### Troubleshooting

| Issue | Resolution |
|---|---|
| No internet after configuration | Double-check network settings on both Spot and Spot Core; full power cycle |
| Unable to resolve hostnames | Double-check DNS settings on Spot Core; full power cycle |
