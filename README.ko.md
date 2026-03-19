# spot-orbit-plugin

> Boston Dynamics Orbit API 작업, SPX 패키징, Spot SDK 탐색, 인증서 설정을 위한 Claude Code 플러그인입니다.

**Language**: [English](README.md) | [日本語](README.ja.md) | [中文](README.zh.md)

---

## 개요

이 플러그인은 보통 브라우저 문서, SDK 예제, 로컬 스크립트에 흩어져 있는 Orbit 작업 흐름을 한곳에 묶습니다.

- Orbit REST API 탐색
- SPX extension 검증 / 빌드 가이드
- Spot SDK 예제 조회
- Orbit 웹 연동용 인증서 설정 가이드
- 실제 Orbit API 접근용 MCP 서버
- SPX 검증 및 Orbit 설정 확인용 PreToolUse 훅

기본적으로 Orbit **v4.1.x** 사용 흐름에 맞춰 구성되어 있으며, 최신 **v5.x** 문서와의 차이도 함께 설명할 수 있도록 참고 자료를 포함합니다.

---

## 설치

### GitHub

```bash
claude plugin add github:kwag93/spot-orbit-plugin
```

### 로컬 클론

```bash
git clone https://github.com/kwag93/spot-orbit-plugin.git
cd spot-orbit-plugin
./install.sh
```

설치 후에는 **새 Claude Code 세션**을 시작하세요.

---

## 설정

설치 후 권장 설정 명령:

```bash
spot-orbit-plugin setup
```

로컬 클론에서 작업 중이라면 다음 명령을 사용할 수 있습니다.

```bash
./install.sh setup
```

설정 마법사는 다음을 수행합니다.

1. Orbit hostname과 API token을 `config.toml`에 저장
2. `verify_ssl` 활성화 여부 확인
3. Orbit write tool 활성화 여부 확인
4. `orbit-api` MCP 서버 등록
5. 필요하면 플러그인 훅을 `settings.json`에 병합

### 설정 참고

- 자체 서명 인증서를 쓰는 Orbit 개발 환경에서는 보통 `verify_ssl = false`가 맞습니다
- 유효한 인증서를 사용하는 운영 환경에서는 `verify_ssl = true`를 권장합니다
- `enable_write_tools = false`가 기본 안전값입니다
- Write tool을 사용하려면 둘 다 필요합니다
  - `config.toml`에 `enable_write_tools = true`
  - 실제 호출 전에 사용자 명시 확인
- `settings.json`과 `.mcp.json`은 보통 설정 마법사가 처리하므로 직접 수정할 필요가 없습니다

---

## 상태 확인 / 설치 관리

```bash
spot-orbit-plugin status
spot-orbit-plugin doctor
```

로컬 클론 래퍼:

```bash
./install.sh status
./install.sh doctor
./install.sh uninstall
```

---

## 스킬

### `/orbit-api`

Orbit REST API 엔드포인트를 탐색하고, 실제 응답을 확인하며, v4.1.x와 v5.x 차이를 설명합니다.

```text
/orbit-api list
/orbit-api call robots
/orbit-api search calendar
/orbit-api explain anomalies
/orbit-api live run_events
```

### `/spx-build`

SPX extension 패키징 흐름을 검증하고, 스캐폴딩하며, 빌드 가이드를 제공합니다.

```text
/spx-build init my-sensor
/spx-build validate ./extension
/spx-build build dev_54
/spx-build guide
```

### `/spot-explore`

Spot SDK 예제, SDK 문서, Orbit 관련 패턴을 검색합니다.

```text
/spot-explore sdk webhooks
/spot-explore example anomalies
/spot-explore pattern poller
/spot-explore version
```

### `/cert-setup`

HTTPS 기반 Orbit 연동에 필요한 인증서 자료를 생성하거나 설명합니다.

```text
/cert-setup ca my-org
/cert-setup server my-org
/cert-setup guide
```

### `/spot-troubleshoot`

Spot/Orbit 연결, 미션, 하드웨어, 익스텐션 문제를 MCP 기반 closed-loop 진단으로 분석합니다.

```text
/spot-troubleshoot                     # 대화형 진단
/spot-troubleshoot network             # 네트워크/연결 문제
/spot-troubleshoot mission             # 미션 실행 실패
/spot-troubleshoot boot                # Spot 부팅 실패
/spot-troubleshoot extension           # SPX 익스텐션 문제
/spot-troubleshoot general             # 기타 문제
```

---

## 명령어

| 명령어 | 용도 |
| --- | --- |
| `/spot-orbit:version` | Orbit 버전 및 기본 연결 상태 확인 |
| `/spot-orbit:status` | 플러그인 / 설정 / MCP / 훅 상태 확인 |
| `/spot-orbit:validate [dir]` | SPX 패키지 디렉터리 검증 |

---

## MCP 서버

내장 MCP 서버는 Orbit API 도구를 Claude Code 안에서 직접 노출합니다.

### 읽기 도구

- `orbit_get_version`
- `orbit_get_robots`
- `orbit_get_runs`
- `orbit_get_run_events`
- `orbit_get_anomalies`
- `orbit_get_site_walks`
- `orbit_get_calendar`
- `orbit_get_webhooks`
- `orbit_get_system_time`
- `orbit_api_call`

### 쓰기 도구

- `orbit_create_webhook`
- `orbit_delete_webhook`
- `orbit_update_anomaly`
- `orbit_create_calendar_event`
- `orbit_delete_calendar_event`
- `orbit_add_robot`
- `orbit_remove_robot`

쓰기 도구는 기본적으로 **비활성화**되어 있으며, 사용자가 명시적으로 승인한 작업에만 사용하도록 설계되어 있습니다.

---

## 훅

| 이벤트 | 트리거 | 동작 |
| --- | --- | --- |
| PreToolUse | `build_spx.sh`, `build_extension.sh`, `tar *.spx` | SPX 구조와 Orbit 제약 조건 검증 |
| PreToolUse | `curl .../api/v0/...` | Orbit 설정 누락 시 경고 |

---

## 포함 문서 (32개 아티클)

### Orbit API & 운영

| 문서 | 용도 |
| --- | --- |
| `docs/orbit-api-reference.md` | Orbit API 엔드포인트와 client 메서드 매핑 |
| `docs/orbit-v4.1.1-live-api-spec.md` | 실제 v4.1.1 기반 레퍼런스 |
| `docs/orbit-v5-swagger-spec.md` | 비교용 v5 레퍼런스 |
| `docs/version-diff-v4-vs-v5.md` | Orbit v4 / v5 차이 |
| `docs/orbit-auth-guide.md` | Orbit 인증 가이드 |
| `docs/orbit-operations-guide.md` | Orbit 운영: 맵, 미션, 검사, 데이터 리뷰 |
| `docs/orbit-agent-roles.md` | Orbit Agent 역할 및 API 매핑 |

### Spot 하드웨어 & 운영

| 문서 | 용도 |
| --- | --- |
| `docs/spot-hardware-reference.md` | Spot 물리 사양, 센서, 네트워크 토폴로지 |
| `docs/spot-hardware-maintenance-reference.md` | 배터리 교체, 힙/레그 교체, 독 설정 |
| `docs/spot-arm-reference.md` | Spot Arm 사양, 캘리브레이션, 매니퓰레이션 |
| `docs/spot-cam2-reference.md` | Spot CAM+IR 사양 및 열화상 검사 |
| `docs/spot-payload-reference.md` | 페이로드 연동 및 전력 사양 |
| `docs/spot-acoustic-sensors-reference.md` | 음향 센서 사양 및 사용법 |
| `docs/spot-mpu5-radio-reference.md` | MPU5 메시 라디오 연동 |
| `docs/spot-rl-researcher-kit-reference.md` | RL Researcher Kit 레퍼런스 |
| `docs/spot-product-comparison.md` | Spot 모델 비교 및 운영 한계 |
| `docs/spot-operations-reference.md` | 운영 절차 및 안전 |
| `docs/spot-admin-reference.md` | 초기화, 소프트웨어 업데이트, 진단 |
| `docs/spot-firewall-reference.md` | Spot/Orbit 네트워크 방화벽 규칙 |
| `docs/spot-release-notes.md` | Spot/Orbit 소프트웨어 릴리스 노트 |
| `docs/spot-inspections-reference.md` | 검사 유형 및 데이터 캡처 |

### SPX & 익스텐션

| 문서 | 용도 |
| --- | --- |
| `docs/spx-extension-guide.md` | SPX 패키지 구조 및 배포 참고 |
| `docs/spx-build-usage.md` | `build_spx.sh` / `build_extension.sh` 사용법 |
| `docs/spx-template-guide.md` | SPX 템플릿 가이드 |
| `docs/core-io-guide.md` | Core I/O 하드웨어, 설정, 익스텐션, 5G/LTE |
| `docs/site-hub-guide.md` | Site Hub 설치 및 Orbit 관리 |
| `docs/hardware-integration.md` | 하드웨어 연동 참고 |
| `docs/cert-setup-guide.md` | 인증서 설정 가이드 |

### 트러블슈팅 & 참고

| 문서 | 용도 |
| --- | --- |
| `docs/troubleshooting.md` | Orbit / SPX 문제 해결 참고 |
| `docs/spot-troubleshoot-reference.md` | Spot 부팅, 배터리, 카메라 진단 |
| `docs/spot-sdk-examples.md` | Spot SDK 예제 매핑 |
| `docs/bd-support-articles.md` | Boston Dynamics 지원 문서 요약 |

---

## Orbit API 토큰

1. 브라우저에서 `https://<your-orbit-host>` 열기
2. Orbit에 로그인
3. **Settings → Developer Features → API Access Tokens** 열기
4. 토큰 생성
5. `spot-orbit-plugin setup` 또는 `./install.sh setup` 실행 후 토큰 입력
6. `/spot-orbit:version`으로 확인

---

## 요구사항

- Claude Code
- Python 3.7+ (`3.11+` 권장)
- Node.js
- SPX 이미지 / 패키지 작업용 Docker
- 실제 API 사용을 위한 Orbit 인스턴스 접근 권한

---

## 참고

- `config.toml`에는 자격 증명이 포함되므로 커밋하면 안 됩니다
- SPX extension 이름에는 underscore, 공백, 괄호를 사용하면 안 됩니다
- 운영 환경에서는 `verify_ssl = true` 사용을 권장합니다
- 쓰기 작업이 필요 없다면 `enable_write_tools = false`를 유지하세요

## 라이선스

MIT
