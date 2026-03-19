# SPX Build Usage Reference

## build_spx.sh (Example SPX Builder)

Location: `spot_sitehub_extension/sitehub_extension/extension_builder/build_spx.sh`

### Modes

| Mode | Command | Purpose |
|------|------|------|
| Interactive | `bash build_spx.sh` | User selects from menu |
| CLI | `bash build_spx.sh --bake dev_54` | User specifies directly |
| **LLM/CI** | `bash build_spx.sh -y --bake dev_54` | **Automated (no prompts)** |

### All Options

```text
Options:
  --yes, -y        Non-interactive mode (required for LLM/CI)
  --services       Specify services to build (comma-separated: frontend,backend,nginx,minio,sms,patrol,all)
  --all            All services (including SMS)
  --bake           Docker Bake parallel build (recommended)
  --cache          Use Docker build cache
  --sudo           Run with sudo docker
  --skip-sms       Exclude SMS
  --patrol-only    Patrol only (same as --yes --skip-sms)
  --no-color       Disable ANSI colors
  --dry-run        Verify configuration without actually building
  --output-json    Output results as JSON (stdout=JSON, stderr=logs)
  --help           Show help
```

### Exit Codes

| Code | Meaning |
|------|------|
| 0 | Success |
| 1 | General error |
| 2 | Invalid argument |
| 3 | Missing dependency |
| 5 | Packaging failure |

### Common Command Combinations

```bash
# Full build (parallel, no prompts) — LLM default
bash build_spx.sh -y --bake <env-name>

# Exclude SMS
bash build_spx.sh -y --bake --skip-sms <env-name>

# Specific services only
bash build_spx.sh -y --services frontend,backend <env-name>

# Pre-build validation (dry-run + JSON)
bash build_spx.sh -y --dry-run --output-json <env-name>

# Fast rebuild using cache
bash build_spx.sh -y --bake --cache <env-name>
```

### Output Location

```text
sitehub_extension/output_spx_lightweight/{build-timestamp}_{env-name}/
├── myservice.spx            # Main service
├── worker.spx               # Background worker (if multi-service)
└── builder.txt              # Build info
```

### Environment Files (envfile/)

| File | Site |
|------|------|
| `ah1.env` ~ `ah4.env` | Hwaseong Plants 1–4 |
| `aj1.env` ~ `aj3.env` | Gwangju Plants 1–3 |
| `ag.env` | Gwangmyeong |
| `ulsan.env` | Ulsan Plant 2 |
| `dev_54.env`, `dev_55.env` | Development servers |
| `example.env` | Template |

---

## build_extension.sh (CORE I/O Extension)

Location: `extension/build_extension.sh` in each extension project

### Options

```text
(none)          Smart build - skips if image/.tgz already exists
--force         Force all steps (clean build)
--package-only  Packaging only (when docker-compose/manifest changed)
```

### Build Steps

```text
[1/3] Docker image build  (skipped with --package-only)
[2/3] Docker save → .tgz  (skipped with --package-only)
[3/3] SPX packaging        (always runs)
```

### SPX Filename Convention

```text
{name}_{commit-hash}_{branch}.spx
```

Example: `ai-detector_a453c64_feat-server.spx`

### Auto-selection Logic (for AI)

| Situation | Selection |
|------|------|
| No .tgz OR no image | `./build_extension.sh` |
| Dockerfile/py/requirements changed | `./build_extension.sh --force` |
| Only docker-compose/manifest changed | `./build_extension.sh --package-only` |
| User requests "clean build" | `./build_extension.sh --force` |

---

## SPX Package Required Structure

```text
extension_dir/
├── manifest.json          # {"description":"...","version":"1.0.0","images":["*.tgz"]}
├── docker-compose.yml     # version:"2.4" (SiteHub) or "3.5" (CORE I/O)
├── icon.jpeg/png          # Icon
└── *.tgz                  # Docker image archive
```

### Key Constraints

- **docker-compose version**: `"2.4"` (SiteHub) or `"3.5"` (CORE I/O)
- **network_mode**: `"host"` for payload/robot communication; `ports` mapping for WebView-only extensions
- **Ports**: TCP/UDP 21000-22000 (excluding 21443)
- **Platform**: `linux/amd64` (SiteHub) or `linux/arm64` (CORE I/O)
- **Build**: `bash` required (`sh` not supported)
- **macOS**: `brew install gnu-tar` (Apple extended attributes issue)
