# SPX Extension Build Guide

A guide for building and deploying software packages (.spx) to the Orbit (formerly Scout SiteHub) platform.

## What is SPX?

SPX (SPOT Extension) is a Docker-based extension package that can be installed on the Orbit platform.
An `.spx` file is essentially an archive bundling a Docker image `.tgz` + `manifest.json` + `docker-compose.yml`.

## SPX Package Structure

```text
extension_dir/
├── manifest.json          # Extension metadata
├── docker-compose.yml     # Container orchestration
├── icon.jpeg              # Extension icon
├── *.tgz                  # Docker image archives
└── *.env                  # Environment variable files
```

### manifest.json Format

```json
{
  "description": "extension-name",
  "version": "1.0.0",
  "images": ["image1.tgz", "image2.tgz"],
  "icon": "icon.jpeg"
}
```

### docker-compose.yml Configuration

- Port range: **TCP/UDP 21000–22000** (Spot platform reserved range, excluding 21443)
- Platform: **linux/amd64** (SiteHub) or **linux/arm64** (CORE I/O)

> **Note**: BD's Spot Extensions top-level wrapper uses docker-compose v3.5,
> but developers are not required to use a specific version.
> Settings such as `network_mode` may vary depending on the Extension type.

### WebView HTTPS Proxy (Port 22001-22200)

Extensions that serve a web UI should use the **WebView port range**:

- **Backend (HTTP)**: 22101-22200 — the extension serves HTTP here.
- **Frontend (HTTPS)**: 22001-22100 — Orbit proxies HTTPS requests to the respective backend port.

Orbit uses the **same TLS certificate as the Orbit web application** when proxying. Clients always make HTTPS requests to the 22001-22100 range. Register the HTTPS URL in Custom Web Views.

**Production security**: restrict the HTTP backend to localhost so it is not accessible by external clients:

```yaml
ports:
  - "127.0.0.1:<backend_port>:<backend_port>"
```

Example for port 22101:

```yaml
ports:
  - "127.0.0.1:22101:22101"
```

### healthcheck Configuration (Recommended)

There is no size limit on Extension files, but an upload "success" **only means the Docker image loaded successfully**.
To let Orbit recognize that a service is actually running, configure `healthcheck` and `depends_on`.

```yaml
services:
  my-service:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:22101/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped
```

## Build Process

### 1. Build the Docker Image

```bash
docker build -t myextension:latest .
```

### 2. Save the Image as .tgz

```bash
docker save myextension:latest | gzip > myextension.tgz
```

### 3. Package as SPX

```bash
# Place manifest.json, docker-compose.yml, and .tgz files in extension_dir/
tar -czf myextension.spx -C extension_dir .
```

### Automated Build Script (SiteHub example)

```bash
cd sitehub_extension/extension_builder
bash build_spx.sh                    # Interactive mode
bash build_spx.sh --bake <env_name>  # CLI mode (parallel build)
bash build_spx.sh -y --bake <env>    # LLM/CI automation mode
```

## Deployment Procedure

1. Go to Orbit Web UI → Extensions management screen
2. Upload the `.spx` file
3. Service starts automatically after installation completes

### Deployment

Most extensions are a single SPX file:

```text
myservice.spx    # Upload via Orbit Web UI → Extensions
```

For multi-service extensions with dependencies (e.g., app + database), upload in dependency order.

## Reference Repositories

| Repository | Purpose |
|------|------|
| [spot-sdk extensions](https://github.com/boston-dynamics/spot-sdk/tree/master/python/examples/extensions) | BD official extension examples |
| [spot-sdk hello\_world](https://github.com/boston-dynamics/spot-sdk/tree/master/python/examples/extensions/hello_world) | Minimal extension example |

## Environment Variable Management

- `envfile/<site_name>.env`: Per-site environment configuration
- At build time, split into `back.env` (full backend) and `front.env` (CHEMICAL_* entries only)
- Copy `example.env` to add a new site

## macOS Build Notes

- `brew install gnu-tar` is required: if Apple extended attributes are included in the SPX, Orbit installation will fail
- Run with `bash` (not `sh`): the script uses bash-specific features such as arrays and ANSI terminal control
