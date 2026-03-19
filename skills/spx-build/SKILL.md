---
name: spx-build
description: Build, validate, and scaffold SPX Extension packages. Activates on "spx", "extension build", "spx create", "spx package".
argument-hint: "[init <name>|validate <dir>|build <env>|guide]"
---

# SPX Extension Builder

Command for building and validating .spx extension packages for the Orbit platform.

<!-- LLM Context -->
<!-- Use_When: User wants to create, validate, or build SPX extensions for Orbit. Includes scaffolding new extensions, validating manifest/docker-compose, and running build scripts -->
<!-- Do_Not_Use: Orbit API queries (use orbit-api), SDK documentation (use spot-explore), certificate setup (use cert-setup) -->
<!-- Requires: Docker installed for image builds. Target platform knowledge (SiteHub x86 vs CORE I/O ARM64) -->
<!-- References: docs/spx-extension-guide.md, docs/spx-build-usage.md, docs/spx-template-guide.md, docs/troubleshooting.md, docs/core-io-guide.md, docs/site-hub-guide.md, docs/hardware-integration.md -->
<!-- Launches: spx-architect agent for complex docker-compose design -->
<!-- Constraints: Extension names must NOT contain underscores or parentheses. Port range 21000-22000, excluding 21443 -->

## Usage

```text
/spx-build                          # Interactive mode
/spx-build init my_sensor           # Scaffold new extension
/spx-build validate extension_dir/  # Validate package
/spx-build build dev_54             # Patrol Service SPX build
/spx-build guide                    # Show SPX build guide
```

## Execution

### `init <name>` — Create New Extension

Prompt user for target platform:
- **SiteHub (x86)**: `linux/amd64`
- **CORE I/O (ARM64)**: `linux/arm64`

Generate full directory structure using the appropriate template. May utilize the `spx-architect` agent.

### `validate <dir>` — Validate Package

Checklist:
- [ ] manifest.json required fields (description, version, images)
- [ ] docker-compose.yml present and valid
- [ ] Port range 21000-22000 (excluding 21443)
- [ ] `restart: unless-stopped`
- [ ] .tgz file(s) exist
- [ ] Image platform matches target
- [ ] healthcheck configured (recommended)

### `build <env>` — Patrol Service SPX Build

Execute Patrol Service build:

```bash
cd <your-project>/sitehub_extension/extension_builder
bash build_spx.sh -y --bake $ENV_NAME
```

**LLM mode**: Always use `-y` flag (interactive menu does not work)

### `guide` — SPX Guide

Read and display `docs/spx-build-usage.md`.

## macOS SPX Packaging

macOS의 BSD `tar`는 extended attributes가 있는 파일에 `._` 리소스 포크 파일을 아카이브에 포함시킨다. Orbit/CoreIO에서 이를 인식하지 못하므로, SPX 아카이브 생성 시 반드시 GNU tar를 사용해야 한다.

```bash
# 방법 1: gtar (brew install gnu-tar)
gtar zcf my-extension.spx .env *.yml *.json *.tgz

# 방법 2: 환경변수로 리소스 포크 제외
COPYFILE_DISABLE=1 tar zcf my-extension.spx .env *.yml *.json *.tgz
```

> **주의**: `.env` 같은 dotfile은 `*` glob에 포함되지 않으므로 명시적으로 지정해야 한다.

## Sub-Agents

For complex design needs, launch the `spx-architect` agent:
```
"Launch spx-architect to design the docker-compose.yml for my GPU-based detector extension"
```

## Documentation References

- `docs/spx-extension-guide.md` — SPX structure/deployment guide
- `docs/spx-build-usage.md` — build_spx.sh + build_extension.sh usage

Task: $ARGUMENTS
