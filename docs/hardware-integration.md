# Hardware Integration Guide

Patterns for integrating hardware peripherals (USB sensors, Bluetooth devices) with Spot extensions.

## Overview

Spot extensions run as Docker containers on the robot's onboard computer. Accessing hardware devices requires explicit volume mounts and, in some cases, elevated container privileges. This guide covers the most common integration patterns and their trade-offs.

---

## USB Serial Communication

### Setup

USB serial devices (sensors, microcontrollers, GPS units) appear under `/dev/ttyUSB*` or `/dev/ttyACM*`. The container must be granted access to the host `/dev` tree.

```yaml
# docker-compose.yml
services:
  sensor-service:
    privileged: true
    volumes:
      - /dev:/dev
    network_mode: "host"
```

> **Note:** `privileged: true` grants full device access. Prefer explicit `devices:` entries when the target device path is stable (e.g., `devices: ["/dev/ttyUSB0:/dev/ttyUSB0"]`). Use `privileged: true` only when the device path is dynamic or multiple devices are needed.

### Non-Blocking Reads with AsyncIO

Serial reads are blocking by default. Wrap them in a `ThreadPoolExecutor` to keep the async event loop unblocked.

```python
import serial
import asyncio
from concurrent.futures import ThreadPoolExecutor


class SensorReader:
    def __init__(self):
        self.executor = ThreadPoolExecutor(max_workers=4)

    async def read_sensor(self, port='/dev/ttyUSB0', baudrate=9600):
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            self.executor, self._blocking_read, port, baudrate
        )

    def _blocking_read(self, port, baudrate):
        with serial.Serial(port, baudrate, timeout=1) as ser:
            return ser.readline().decode().strip()
```

**Dependencies:** `pyserial`

**Key points:**
- `timeout=1` prevents infinite blocking on an unresponsive device
- `max_workers=4` accommodates multiple simultaneous sensor reads
- The context manager ensures the port is released even on error

---

## Bluetooth Device Control

### D-Bus Socket Access

Bluetooth on Linux is managed through D-Bus. Mount the system bus socket and USB bus into the container.

```yaml
volumes:
  - /var/run/dbus/system_bus_socket:/var/run/dbus/system_bus_socket
  - /dev/bus/usb:/dev/bus/usb
```

### Connection Patterns

**MAC address caching** reduces reconnection latency. Store the last known MAC address on first successful discovery and use it for subsequent connections, falling back to a full scan only on failure.

**Retry logic** is essential — Bluetooth operations can fail transiently. A simple exponential backoff pattern:

```python
import asyncio


async def connect_with_retry(connect_fn, max_attempts=3, base_delay=1.0):
    for attempt in range(max_attempts):
        try:
            return await connect_fn()
        except Exception as exc:
            if attempt == max_attempts - 1:
                raise
            delay = base_delay * (2 ** attempt)
            await asyncio.sleep(delay)
```

---

## Hardware Simulation for Testing

Avoid coupling tests to physical hardware. Implement a simulator that satisfies the same interface as the real device driver.

```python
import random


class DeviceSimulator:
    """Drop-in replacement for real device driver during testing."""

    def __init__(self, success_rate=0.95):
        self.success_rate = success_rate

    def execute_command(self, command):
        if random.random() < self.success_rate:
            return {"status": "success", "command": command}
        return {"status": "failure", "error": "simulated failure"}
```

**Activating test mode via environment variable:**

```python
import os

def create_device_driver():
    if os.getenv("TEST_MODE", "false").lower() == "true":
        return DeviceSimulator(success_rate=0.95)
    return RealDeviceDriver()
```

In `docker-compose.yml` for local development:

```yaml
environment:
  - TEST_MODE=true
```

**Best practices:**
- Keep the simulator interface identical to the real driver
- Make `success_rate` configurable to test error-handling paths
- Use `TEST_MODE` (not a code-level flag) so the same image runs in both modes

---

## Spot-Specific Volume Mappings

| Path | Purpose | Access |
|------|---------|--------|
| `/home/spot/patrol/` | Patrol logs and configs | Read/Write |
| `/data/.extensions/{name}/` | Extension data directory | Read/Write |
| `/opt/payload_credentials` | Spot credentials | Read-only |
| `/dev` | Hardware devices | Requires `privileged` |
| `/var/run/dbus/system_bus_socket` | Bluetooth D-Bus | Read/Write |

Mount only the paths your extension actually needs. Over-mounting increases the attack surface and can cause conflicts with other extensions.

---

## CORE I/O Specific Notes

The CORE I/O onboard computer has constraints that differ from a standard Linux host:

- **Architecture:** ARM64 only. Ensure all base images and compiled dependencies are `linux/arm64`.
- **Memory limits:** Always set `mem_limit` in your service definition. A value of `512m` is a reasonable starting point for sensor services; adjust based on profiling.
  ```yaml
  services:
    sensor-service:
      mem_limit: 512m
  ```
- **Filesystem:** The writable filesystem is limited. Write persistent data to the extension data directory (`/data/.extensions/{name}/`) rather than the container filesystem. See the troubleshooting documentation for filesystem-related errors.
- **Startup order:** Hardware devices may not be enumerated at container start. Implement a readiness loop that retries device open with a short delay rather than failing immediately.
