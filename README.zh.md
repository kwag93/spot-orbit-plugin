# spot-orbit-plugin

> 用于 Boston Dynamics Orbit API 工作、SPX 打包、Spot SDK 检索与证书配置的 Claude Code 插件。

**Language**: [English](README.md) | [한국어](README.ko.md) | [日本語](README.ja.md)

---

## 概览

这个插件把通常分散在浏览器文档、SDK 示例和本地脚本里的 Orbit 工作流集中到一起：

- Orbit REST API 探索
- SPX extension 校验 / 构建指南
- Spot SDK 示例检索
- Orbit Web 集成所需的证书配置指南
- 访问真实 Orbit API 的 MCP 服务器
- 用于 SPX 校验和 Orbit 配置检查的 PreToolUse hooks

它主要围绕 Orbit **v4.1.x** 使用场景设计，同时也附带 **v5.x** 参考资料，方便解释版本差异。

---

## 安装

### GitHub

```bash
claude plugin add github:kwag93/spot-orbit-plugin
```

### 本地 clone

```bash
git clone https://github.com/kwag93/spot-orbit-plugin.git
cd spot-orbit-plugin
./install.sh
```

安装完成后，请启动一个**新的 Claude Code 会话**。

---

## 设置

安装后推荐执行：

```bash
spot-orbit-plugin setup
```

如果你是在本地 clone 中工作，也可以执行：

```bash
./install.sh setup
```

设置向导会执行以下步骤：

1. 将 Orbit hostname 和 API token 保存到 `config.toml`
2. 询问是否启用 `verify_ssl`
3. 询问是否启用 Orbit write tools
4. 注册 `orbit-api` MCP 服务器
5. 如有需要，将插件 hooks 合并到 `settings.json`

### 设置说明

- 对于使用自签名证书的 Orbit 开发环境，通常 `verify_ssl = false` 更合适
- 对于使用有效证书的生产环境，建议 `verify_ssl = true`
- `enable_write_tools = false` 是安全默认值
- 使用 write tools 同时需要：
  - `config.toml` 中设置 `enable_write_tools = true`
  - 在真正调用前获得用户明确确认
- `settings.json` 与 `.mcp.json` 通常由设置向导管理，通常不需要手动编辑

---

## 状态检查 / 安装管理

```bash
spot-orbit-plugin status
spot-orbit-plugin doctor
```

本地 clone 包装命令：

```bash
./install.sh status
./install.sh doctor
./install.sh uninstall
```

---

## Skills

### `/orbit-api`

探索 Orbit REST API 端点、查看真实响应，并解释 v4.1.x 与 v5.x 的差异。

```text
/orbit-api list
/orbit-api call robots
/orbit-api search calendar
/orbit-api explain anomalies
/orbit-api live run_events
```

### `/spx-build`

用于校验、生成脚手架并指导 SPX extension 打包流程。

```text
/spx-build init my-sensor
/spx-build validate ./extension
/spx-build build dev_54
/spx-build guide
```

### `/spot-explore`

搜索 Spot SDK 示例、SDK 文档以及 Orbit 相关模式。

```text
/spot-explore sdk webhooks
/spot-explore example anomalies
/spot-explore pattern poller
/spot-explore version
```

### `/cert-setup`

生成或说明 HTTPS 型 Orbit 集成所需的证书材料。

```text
/cert-setup ca my-org
/cert-setup server my-org
/cert-setup guide
```

### `/spot-troubleshoot`

通过 MCP 驱动的闭环诊断，分析 Spot/Orbit 连接、任务、硬件和扩展问题。

```text
/spot-troubleshoot                     # 交互式诊断
/spot-troubleshoot network             # 网络/连接问题
/spot-troubleshoot mission             # 任务执行失败
/spot-troubleshoot boot                # Spot 启动失败
/spot-troubleshoot extension           # SPX 扩展问题
/spot-troubleshoot general             # 其他问题
```

---

## Commands

| Command | 用途 |
| --- | --- |
| `/spot-orbit:version` | 检查 Orbit 版本与基础连通性 |
| `/spot-orbit:status` | 查看插件 / 配置 / MCP / hooks 状态 |
| `/spot-orbit:validate [dir]` | 校验 SPX 包目录 |

---

## MCP 服务器

内置 MCP 服务器可直接在 Claude Code 中暴露 Orbit API 工具。

### 读取工具

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

### 写入工具

- `orbit_create_webhook`
- `orbit_delete_webhook`
- `orbit_update_anomaly`
- `orbit_create_calendar_event`
- `orbit_delete_calendar_event`
- `orbit_add_robot`
- `orbit_remove_robot`

写入工具默认 **关闭**，只应在用户已经明确批准写操作时使用。

---

## Hooks

| 事件 | 触发条件 | 动作 |
| --- | --- | --- |
| PreToolUse | `build_spx.sh`, `build_extension.sh`, `tar *.spx` | 校验 SPX 结构与 Orbit 约束 |
| PreToolUse | `curl .../api/v0/...` | Orbit 配置缺失时给出警告 |

---

## 附带文档（32 篇）

### Orbit API 与运营

| 文档 | 用途 |
| --- | --- |
| `docs/orbit-api-reference.md` | Orbit API 端点与 client 方法映射 |
| `docs/orbit-v4.1.1-live-api-spec.md` | 基于真实 v4.1.1 的参考 |
| `docs/orbit-v5-swagger-spec.md` | 用于对比的 v5 参考 |
| `docs/version-diff-v4-vs-v5.md` | Orbit v4 / v5 差异 |
| `docs/orbit-auth-guide.md` | Orbit 认证指南 |
| `docs/orbit-operations-guide.md` | Orbit 运营: 地图、任务、检查、数据审查 |
| `docs/orbit-agent-roles.md` | Orbit Agent 角色与 API 映射 |

### Spot 硬件与运营

| 文档 | 用途 |
| --- | --- |
| `docs/spot-hardware-reference.md` | Spot 物理规格、传感器与网络拓扑 |
| `docs/spot-hardware-maintenance-reference.md` | 电池更换、髋/腿更换、底座设置 |
| `docs/spot-arm-reference.md` | Spot Arm 规格、校准与操作 |
| `docs/spot-cam2-reference.md` | Spot CAM+IR 规格与热成像检查 |
| `docs/spot-payload-reference.md` | 载荷集成与电力规格 |
| `docs/spot-acoustic-sensors-reference.md` | 声学传感器规格与用法 |
| `docs/spot-mpu5-radio-reference.md` | MPU5 Mesh 无线电集成 |
| `docs/spot-rl-researcher-kit-reference.md` | RL Researcher Kit 参考 |
| `docs/spot-product-comparison.md` | Spot 型号对比与运营限制 |
| `docs/spot-operations-reference.md` | 操作流程与安全 |
| `docs/spot-admin-reference.md` | 重置、软件更新、诊断 |
| `docs/spot-firewall-reference.md` | Spot/Orbit 网络防火墙规则 |
| `docs/spot-release-notes.md` | Spot/Orbit 软件发布说明 |
| `docs/spot-inspections-reference.md` | 检查类型与数据采集 |

### SPX 与扩展

| 文档 | 用途 |
| --- | --- |
| `docs/spx-extension-guide.md` | SPX 包结构与部署说明 |
| `docs/spx-build-usage.md` | `build_spx.sh` / `build_extension.sh` 用法 |
| `docs/spx-template-guide.md` | SPX 模板指南 |
| `docs/core-io-guide.md` | Core I/O 硬件、设置、扩展与 5G/LTE |
| `docs/site-hub-guide.md` | Site Hub 安装与 Orbit 管理 |
| `docs/hardware-integration.md` | 硬件集成说明 |
| `docs/cert-setup-guide.md` | 证书配置说明 |

### 故障排查与参考

| 文档 | 用途 |
| --- | --- |
| `docs/troubleshooting.md` | Orbit / SPX 常见故障排查 |
| `docs/spot-troubleshoot-reference.md` | Spot 启动、电池、摄像头诊断 |
| `docs/spot-sdk-examples.md` | Spot SDK 示例映射 |
| `docs/bd-support-articles.md` | Boston Dynamics 支持文章摘要 |

---

## Orbit API token

1. 在浏览器中打开 `https://<your-orbit-host>`
2. 登录 Orbit
3. 打开 **Settings → Developer Features → API Access Tokens**
4. 生成 token
5. 运行 `spot-orbit-plugin setup` 或 `./install.sh setup` 并粘贴 token
6. 使用 `/spot-orbit:version` 验证

---

## 要求

- Claude Code
- Python 3.7+（推荐 `3.11+`）
- Node.js
- 用于 SPX 镜像 / 打包流程的 Docker
- 用于真实 API 调用的 Orbit 实例访问权限

---

## 说明

- `config.toml` 包含凭据，绝不能提交到仓库
- SPX extension 名称不能包含下划线、空格或括号
- 生产环境建议使用 `verify_ssl = true`
- 如果不需要写操作，请保持 `enable_write_tools = false`

## License

MIT
