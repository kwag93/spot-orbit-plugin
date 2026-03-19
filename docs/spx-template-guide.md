# SPX Template Guide

## Overview

SPX files are generated using a template system that enables consistent, repeatable extension packaging. Each template defines the services, images, and configuration required for an extension, so the same template can be reused across environments without manual setup.

## Template Directory Structure

```text
template/{template-name}/
├── templateConfig.json    # Template metadata
├── dockerImages.json      # Docker image configuration
├── docker-compose.yml     # Service definition
├── .env                   # Default environment variables
├── icon.png               # Extension icon
└── Dockerfile             # Optional: for local image builds
```

## templateConfig.json (Extended Manifest)

```json
{
  "ExtensionName": "my-service",
  "Description": "Service description",
  "Version": "1.0.0",
  "Icon": "icon.png",
  "OrbitVer": "ov5.0.0"
}
```

| Field | Description |
|-------|-------------|
| `ExtensionName` | Unique identifier for the extension |
| `Description` | Human-readable summary |
| `Version` | Extension version string |
| `Icon` | Filename of the icon asset (relative to template root) |
| `OrbitVer` | Minimum Orbit version required (e.g., `"ov5.0.0"`) |

The `OrbitVer` field is validated on upload. Extensions built for older Orbit versions continue to work on newer ones, but an extension requiring a newer version will be rejected by an older Orbit installation.

## dockerImages.json (Image Configuration)

```json
{
  "Images": [
    {
      "registryUrl": "docker.io/library",
      "pullImage": "nginx:alpine",
      "saveName": "nginx-local",
      "saveTag": "nginx:1.0"
    }
  ]
}
```

| Field | Description |
|-------|-------------|
| `registryUrl` | Source registry URL, or `"LOCAL_IMAGE_STORAGE"` for locally built images |
| `pullImage` | Image reference to pull from the registry |
| `saveName` | Name under which the image is saved inside the SPX archive |
| `saveTag` | Tag applied to the saved image |

### External Registry

Set `registryUrl` to the Docker registry URL (e.g., `docker.io/library`). The SPX generator pulls the image at build time and bundles it.

### Local Build

Set `registryUrl` to `"LOCAL_IMAGE_STORAGE"` and include a `Dockerfile` in the template directory. The generator builds the image locally and exports it as a `.tar` file for inclusion in the SPX archive.

> **Note:** Orbit does not support running `docker build` at deploy time. Images must be pre-built and exported before packaging.

## SPX Generation Workflow

```text
1. Select or create a template directory
2. Configure environment variables in .env
3. Run the SPX generator (CLI or Web UI)
4. Generator pulls or builds Docker images
5. Creates manifest.json from templateConfig.json
6. Packages everything into a .spx archive
7. Upload the .spx file via the Orbit web UI
```

## Image Registry vs Local Build

| Approach | `registryUrl` value | When to Use |
|----------|---------------------|-------------|
| External registry | `docker.io/library` (or any registry URL) | Public images such as nginx, postgres, redis |
| Local build | `LOCAL_IMAGE_STORAGE` | Custom application images built from a project Dockerfile |

## Multi-Service Extensions

docker-compose supports multiple services in a single extension. A typical pattern combines an application container, a database, and a background worker:

```yaml
services:
  app:
    image: my-app:1.0
    depends_on:
      - db
  db:
    image: postgres:15
  worker:
    image: my-worker:1.0
    depends_on:
      - db
```

- Use `depends_on` to enforce startup ordering.
- Share configuration across services using the `.env` file.
- All referenced images must be declared in `dockerImages.json`.

## Orbit Version Compatibility

- The `OrbitVer` field in `templateConfig.json` declares the minimum compatible Orbit version.
- Format: `ov{major}.{minor}.{patch}` — for example, `ov5.0.0`.
- Orbit validates this field on upload and rejects extensions that require a newer version than the running installation.
- Extensions built for an older Orbit version are forward-compatible and will work on newer installations.

## Key Constraints

- **No runtime builds.** `docker build` cannot be executed inside Orbit. Build all images locally before packaging.
- **Images as tarballs.** Docker images are exported as `.tar` files and included directly in the SPX archive.
- **Environment variables belong in `.env`.** Do not bake environment-specific values into images. Use the `.env` file in the template so values can be overridden at deploy time.
