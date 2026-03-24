# Orbit Extension Troubleshooting Guide

Issues encountered in real projects and solutions based on BD official documentation.

---

## SPX Upload FAQ (Verified with BD Support)

### Is there a file size limit for Extension files?

**No.** Confirmed with BD support: there is no file size limit for extension files.

### Upload shows "success" but the service is not working

**Cause**: Orbit reports "success" when the Docker image loads successfully.
This means **image load succeeded**, not that **the service is running correctly.**

The actual runtime state of the service is determined by the Docker signals configured in `docker-compose.yml`:

- `healthcheck`: periodically checks service health
- `depends_on`: controls startup order between services
- `restart`: restart policy on failure

Without these settings, Orbit only recognizes whether the image loaded successfully.

> **Note**: BD's Spot Extensions top-level wrapper uses docker-compose v3.5.
> This is not a constraint requiring developers to use v3.5 —
> it is the version of the wrapper that BD uses to wrap the Extension.

**Recommended configuration example**:

```yaml
services:
  my-service:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:22101/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped
```

---

## SPX Upload Failures

### .DS_Store included causes installation failure on Orbit

**Symptom**: A .spx built on macOS fails to install after uploading to Orbit

**Cause**: macOS `tar` includes Apple extended attributes (`.DS_Store`, `._*`)

**Fix**:

```bash
# Install GNU tar (macOS)
brew install gnu-tar

# Use gtar when building
gtar --no-xattrs -czf my_extension.spx -C extension_dir .

# Or use the COPYFILE_DISABLE environment variable
COPYFILE_DISABLE=1 tar -czf my_extension.spx -C extension_dir .
```

**Reference**: `spot_sitehub_extension/build_spx.sh` is the only implementation
that automatically detects and uses `gtar` on macOS.
This issue does not occur in Linux build environments.

### extension_target not set

**Symptom**: SPX upload succeeds but Extension does not work

**Cause**: If the `extension_target` field is missing from `manifest.json`,
the default value is set to `"spot"` (CORE I/O).
**To deploy to Orbit (SiteHub), you must explicitly specify `"orbit"`.**

**Fix**:

```json
{
  "extension_name": "my-extension",
  "description": "...",
  "version": "1.0.0",
  "images": ["my-image.tgz"],
  "extension_target": "orbit"
}
```

| Target | extension_target | Platform |
| --- | --- | --- |
| Orbit (SiteHub) | `"orbit"` | linux/amd64 |
| SPOT (CORE I/O) | `"spot"` (default) | linux/arm64 |

### Wrong platform architecture

**Symptom**: Extension container crashes immediately on startup

**Cause**: Without specifying `--platform` in the Dockerfile,
the build follows the host architecture.
Building on an Apple Silicon Mac produces an arm64 image.

**Fix**:

```bash
# SiteHub (x86) target
docker build --platform linux/amd64 -t my-ext .

# CORE I/O (ARM64) target
docker build --platform linux/arm64 -f Dockerfile.l4t -t my-ext .
```

### Port range violation

**Symptom**: Extension installs but cannot be accessed from the web

**Cause**: Service is running outside the port range permitted by Orbit

**Allowed ports**:

| Purpose | Range | Notes |
| --- | --- | --- |
| Extension HTTP backend | 22101-22200 | Internal port |
| Extension HTTPS frontend | 22001-22100 | Via Orbit proxy |
| Alternative hosting | 21000-22000 | No encryption, not recommended |
| **Reserved (do not use)** | **21443** | CORE I/O only |

**Common mistake**: Using default ports as-is — Flask (5000), Django (8000),
PostgreSQL (5432), etc.

**Fix**: Map ports in docker-compose.yml:

```yaml
ports:
  - "22103:8000"      # internal 8000 → Orbit allowed 22103
  - "127.0.0.1:22103:8000"  # production: localhost binding
```

---

## docker-compose.yml Issues

### version mismatch

**Symptom**: Extension fails to start due to docker-compose version

**Observed behavior**:

| version | SiteHub | CORE I/O | Source |
| --- | --- | --- | --- |
| `"2.4"` | ✅ works | needs verification | production project |
| `"3"` | ✅ works | needs verification | postgres/redis/firewall ext |
| `"3.5"` | needs verification | ✅ works | BD official OpenVPN example |
| `"3.8"` / `"3.9"` | needs verification | needs verification | internal standalone project |

**Conclusion**: Both SiteHub and CORE I/O appear to be largely insensitive to
docker-compose version. `"2.4"`, `"3"`, and `"3.5"` all have confirmed working cases.
However, since **BD official documentation does not specify a particular version**,
choose based on the Docker engine version of your deployment target.

### network_mode missing

**Recommended**: Extensions that communicate directly with Spot/payloads should use `network_mode: "host"`.
WebView-only extensions may use `ports` mapping instead.

```yaml
# For payload/robot communication
services:
  my-service:
    network_mode: "host"

# For WebView-only (HTTP serving)
services:
  my-webview:
    ports:
      - "127.0.0.1:22101:22101"
```

### mem_limit not set

**Risk**: Running on CORE I/O without a memory limit may cause memory exhaustion,
requiring **physical robot recovery**.

```yaml
services:
  my-service:
    mem_limit: 512m  # must be set
```

---

## Orbit API Issues

### API token lost

**Symptom**: Token cannot be viewed again after being issued once

**Cause**: Orbit displays the token **only once at issuance**.
It cannot be retrieved afterward.

**Fix**: Issue a new token (Settings icon → Developer Features → API Access Tokens)

### 406 Not Acceptable response

**Symptom**: A previously working API suddenly returns 406

**Cause**: HMAC shared secret has been invalidated on the server.
This occurs on server restart, configuration change, or when another agent issues a new secret.

**Fix**: orbit-agent has an automatic re-authentication loop
(clears `agent_accepted` flag → re-runs `boot_up()`)

### Checking API documentation on a live instance

```bash
# Check version (no auth required)
curl -sk https://<ORBIT_IP>/api/v0/version

# Swagger UI (login required in web browser)
https://<ORBIT_IP>/api/v0/docs/
```

v4.1.x and v5.x have some endpoint differences.
The Swagger on the actual instance is the most accurate spec.

### Action name with special characters causes image download failure

**Symptom**: Images are missing in reports/data for actions whose names contain `#`, `?`, or other URL-special characters. Removing the special character from the action name resolves the issue.

**Cause**: Orbit's `dataUrl` embeds the action name directly as a path component:

```text
/daq/download/{robot}/{timestamp}/{actionName}/{actionName} {channel} {filename}.jpg
```

When building the full image URL (`https://{hostname}{dataUrl}`), characters like `#` are interpreted as URL fragment identifiers. Everything after `#` is silently dropped and never sent to the server:

```text
Action name: "점검#1"

❌ Before (broken):
   https://orbit-host/daq/download/.../점검#1/점검#1 image.jpg
   → Server receives: /daq/download/.../점검  (everything after # is lost)
   → 404 Not Found

✅ After (fixed):
   https://orbit-host/daq/download/.../%EC%A0%90%EA%B2%80%231/%EC%A0%90%EA%B2%80%231%20image.jpg
   → Server receives the full path
   → 200 OK
```

**Dangerous characters**:

| Character | URL meaning | Risk |
| --- | --- | --- |
| `#` | Fragment identifier | **High** — truncates everything after it |
| `?` | Query string start | **High** — breaks path parsing |
| `%` | Percent-encoding prefix | **Medium** — causes double-encoding |
| `&` | Query parameter separator | Low — only affects query strings |

**Fix**: When constructing image URLs from `dataUrl`, use `urllib.parse.quote` instead of manual string replacement:

```python
from urllib.parse import quote

# ❌ Insufficient — only encodes spaces
image_url = image_url.replace(" ", "%20")

# ✅ Correct — encodes all URL-unsafe characters while preserving path separators
image_url = f"https://{hostname}{quote(data_url, safe='/')}"
```

**Note**: The `bosdyn.orbit.utils` helper functions (`data_capture_urls_from_run_events`, etc.) also concatenate URLs without encoding. Apply the same fix when using these utilities.

**Verified**: 2026-03-24, Orbit v5.1.4

---

## Scout → Orbit Migration

### Legacy code references

| Before | After |
| --- | --- |
| `bosdyn-scout` | `bosdyn-orbit` |
| `ScoutClient` | `Client` (bosdyn.orbit.client) |
| Scout SiteHub | Orbit |
| `scout_rc_*` (bodyLeaseOwner) | values still use scout prefix |

**Note**: The value of the `bodyLeaseOwner` field still uses
the `scout_rc_7_SPOT-SERIAL-NUMBER` format. This is expected behavior.

### Python package migration

```bash
pip uninstall bosdyn-scout
pip install bosdyn-orbit==4.1.1
```

Code changes: mostly compatible by updating import paths only.

---

## Extension Naming Issues (SiteHub + CORE I/O common)

### Underscore (`_`) in name causes execution failure

**Symptom**: Extension uploads but does not run

**Cause**: **BD official warning** — using underscores (`_`) in Orbit extension filenames
causes them not to run successfully.

> "Do not use underscores when naming Orbit extension files.
> Extensions that contain underscores in the filename
> will not run successfully."
> — [Orbit Administration and Settings](https://support.bostondynamics.com/s/article/Orbit-Administration-and-Settings-71290)

**Fix**: Use only hyphens (`-`) in filenames.
`my_extension.spx` → `my-extension.spx`

### Parentheses in name causes undeletable extension (known bug)

**Symptom**: Uploading a file with parentheses such as `control-ext (1).spx`
makes it **impossible to delete from the web portal**

**Cause**: Windows often automatically appends `(1)` etc. when downloading files.
This is a **known bug** where Orbit fails to handle extension names containing parentheses.

**Prevention**: Before uploading, verify the filename has **no parentheses, spaces, special characters, or underscores**

**Extension filename rules summary**:

| Character | Allowed | Notes |
| --- | --- | --- |
| Letters (a-z, A-Z) | ✅ | |
| Digits (0-9) | ✅ | |
| Hyphen (`-`) | ✅ | **recommended separator** |
| Underscore (`_`) | ❌ | causes execution failure |
| Parentheses `()` | ❌ | undeletable bug |
| Space | ❌ | undeletable |
| `coreio`, `mission_control` | ❌ | reserved words |

---

## Custom Web Views

### HTTPS required

**Symptom**: URL registered in Custom Web View but it does not load

**Cause**: Orbit can only embed **HTTPS URLs** as Web Views.
HTTP URLs are blocked by the browser's Mixed Content policy.
공식 문서 명시: "Only sites that utilize HTTPS can be embedded into Orbit."

**Fix**: If the Extension serves an HTTP server,
access it through Orbit's HTTPS proxy port (22001-22100).

```text
Internal HTTP:  http://127.0.0.1:22101 (Extension backend)
External HTTPS: https://<orbit-ip>:22001 (Orbit proxy → register in Web View)
```

### How WebView works

- WebView is **rendered directly in the client's browser** (not proxied through Orbit server).
- Relies on the user's browser for networking, cookies, and caching.
- Clients interact with external websites independently — sites that Orbit cannot route to are still accessible if the user's browser can reach them.
- Orbit does not save any credentials or payloads passed to external websites.

### Orbit HTTPS Proxy for Extensions

Extensions serve HTTP on backend ports (22101-22200). Orbit proxies these as HTTPS on frontend ports (22001-22100). Orbit uses the **same TLS certificate as the Orbit web application** when proxying for extension web apps.

Client requests always go through the HTTPS frontend ports. Register the HTTPS URL (22001-22100 range) in the Custom Web View.

### Production security recommendation

Restrict the extension's HTTP server to localhost in production:

```yaml
# docker-compose.yml ports
ports:
  - "127.0.0.1:22101:22101"   # localhost only
```

External access should only go through Orbit's HTTPS proxy (22001-22100).

### How to configure Web View

1. Log in as Admin
2. Settings → Custom Web Views
3. + Create Custom Web View:
   - **Label**: display name
   - **Icon Address**: icon image URL (scaled to 20px height)
   - **Address**: HTTPS URL (required)

---

## CORE I/O Specifics

### Extension name with parentheses causes undeletable entry (known bug)

**Symptom**: Uploading a file with parentheses such as `control-ext (1).spx`
makes it **impossible to delete from the web portal**

**Cause**: Windows often automatically appends `(1)` etc. when downloading files.
This is a **known bug** where Orbit fails to handle extension names containing parentheses.

**Prevention**: Before uploading, verify the filename has **no parentheses, spaces, underscores, or special characters**

**Fix (if already uploaded)**:

```bash
ssh -p 20022 spot@<ROBOT_IP>
sudo rm -rf "/data/.extensions/control-ext (1)"
```

### Extension naming violation causes undeletable entry

On CORE I/O 4.1.0 and above, extensions that violate naming rules
cannot be deleted from the web portal.

**Naming rules**:
- Only letters, digits, and hyphens (-) are allowed (**no underscores**)
- Must not contain `coreio` or `mission_control`
- **Parentheses, spaces, non-ASCII characters, etc. are prohibited**

**Fix**:

```bash
# Delete directly via SSH (CORE I/O SSH port: 20022)
ssh -p 20022 spot@<ROBOT_IP>
sudo rm -rf /data/.extensions/<extension_name>
```

### Filesystem structure

```text
/cred    (100MB, read-only)   certificates, serial
/persist (5GB, read-write)    persists across reboots
/        (4GB, read-only)     root (not modifiable!)
/data    (400GB, read-write)  Docker, app data
```

### Checking logs (4.1.0+)

```bash
journalctl CONTAINER_ID_FULL={ID} -u docker.service
```

Default logging driver is `journald` from 4.1.0 onwards.

---

## Schedule-Related

### DST (Daylight Saving Time) not supported

The Orbit scheduler cannot handle DST.
Schedules may shift or run twice at DST transition points.

### Midnight mission dispatch

Missions that span midnight require appropriate blackout window configuration.

```python
client.post_calendar_event(
    blackout_times=[
        {"startMs": midnight_ms, "endMs": midnight_ms + 300000}
    ]
)
```
