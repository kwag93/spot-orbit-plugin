# spot-orbit-plugin

> Boston Dynamics Orbit API 作業、SPX パッケージング、Spot SDK 調査、証明書設定のための Claude Code プラグインです。

**Language**: [English](README.md) | [한국어](README.ko.md) | [中文](README.zh.md)

---

## 概要

このプラグインは、通常はブラウザ文書、SDK サンプル、ローカルスクリプトに分散している Orbit 作業フローを一箇所にまとめます。

- Orbit REST API の探索
- SPX extension の検証 / ビルドガイド
- Spot SDK サンプルの検索
- Orbit Web 連携向け証明書設定ガイド
- 実 Orbit API 接続用 MCP サーバー
- SPX 検証と Orbit 設定確認のための PreToolUse フック

主に Orbit **v4.1.x** の利用を前提に設計されており、より新しい **v5.x** ドキュメントとの差分も説明できるように参考資料を同梱しています。

---

## インストール

### GitHub

```bash
claude plugin add github:kwag93/spot-orbit-plugin
```

### ローカル clone

```bash
git clone https://github.com/kwag93/spot-orbit-plugin.git
cd spot-orbit-plugin
./install.sh
```

インストール後は **新しい Claude Code セッション** を開始してください。

---

## セットアップ

インストール後の推奨セットアップコマンド:

```bash
spot-orbit-plugin setup
```

ローカル clone で作業している場合は次も使えます。

```bash
./install.sh setup
```

セットアップウィザードは次を行います。

1. Orbit hostname と API token を `config.toml` に保存
2. `verify_ssl` を有効にするか確認
3. Orbit write tool を有効にするか確認
4. `orbit-api` MCP サーバーを登録
5. 必要であればプラグインフックを `settings.json` にマージ

### セットアップメモ

- 自己署名証明書を使う Orbit 開発環境では通常 `verify_ssl = false` が適切です
- 有効な証明書を使う本番環境では `verify_ssl = true` を推奨します
- `enable_write_tools = false` が安全な初期値です
- Write tool を使うには次の両方が必要です
  - `config.toml` の `enable_write_tools = true`
  - 実際の呼び出し前の明示的なユーザー確認
- `settings.json` と `.mcp.json` は通常セットアップウィザードが管理するため、手動編集はほとんど不要です

---

## 状態確認 / インストール管理

```bash
spot-orbit-plugin status
spot-orbit-plugin doctor
```

ローカル clone 用ラッパー:

```bash
./install.sh status
./install.sh doctor
./install.sh uninstall
```

---

## スキル

### `/orbit-api`

Orbit REST API エンドポイントを探索し、実レスポンスを確認し、v4.1.x と v5.x の差分を説明します。

```text
/orbit-api list
/orbit-api call robots
/orbit-api search calendar
/orbit-api explain anomalies
/orbit-api live run_events
```

### `/spx-build`

SPX extension パッケージングの検証、ひな形生成、ビルドガイドを提供します。

```text
/spx-build init my-sensor
/spx-build validate ./extension
/spx-build build dev_54
/spx-build guide
```

### `/spot-explore`

Spot SDK サンプル、SDK ドキュメント、Orbit 関連パターンを検索します。

```text
/spot-explore sdk webhooks
/spot-explore example anomalies
/spot-explore pattern poller
/spot-explore version
```

### `/cert-setup`

HTTPS ベースの Orbit 連携に必要な証明書素材を生成または説明します。

```text
/cert-setup ca my-org
/cert-setup server my-org
/cert-setup guide
```

### `/spot-troubleshoot`

Spot/Orbit の接続、ミッション、ハードウェア、エクステンションの問題を MCP ベースのクローズドループ診断で分析します。

```text
/spot-troubleshoot                     # 対話型診断
/spot-troubleshoot network             # ネットワーク/接続の問題
/spot-troubleshoot mission             # ミッション実行の失敗
/spot-troubleshoot boot                # Spot 起動の失敗
/spot-troubleshoot extension           # SPX エクステンションの問題
/spot-troubleshoot general             # その他の問題
```

---

## コマンド

| コマンド | 用途 |
| --- | --- |
| `/spot-orbit:version` | Orbit バージョンと基本接続状態の確認 |
| `/spot-orbit:status` | プラグイン / 設定 / MCP / フック状態の確認 |
| `/spot-orbit:validate [dir]` | SPX パッケージディレクトリの検証 |

---

## MCP サーバー

同梱 MCP サーバーは Orbit API ツールを Claude Code 内で直接使えるようにします。

### 読み取りツール

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

### 書き込みツール

- `orbit_create_webhook`
- `orbit_delete_webhook`
- `orbit_update_anomaly`
- `orbit_create_calendar_event`
- `orbit_delete_calendar_event`
- `orbit_add_robot`
- `orbit_remove_robot`

書き込みツールはデフォルトで **無効** であり、ユーザーが明示的に承認した操作にのみ使う想定です。

---

## フック

| イベント | トリガー | 動作 |
| --- | --- | --- |
| PreToolUse | `build_spx.sh`, `build_extension.sh`, `tar *.spx` | SPX 構造と Orbit 制約の検証 |
| PreToolUse | `curl .../api/v0/...` | Orbit 設定不足を警告 |

---

## 同梱ドキュメント（32 件）

### Orbit API & 運用

| ドキュメント | 用途 |
| --- | --- |
| `docs/orbit-api-reference.md` | Orbit API エンドポイントと client メソッド対応 |
| `docs/orbit-v4.1.1-live-api-spec.md` | 実 v4.1.1 ベース参照 |
| `docs/orbit-v5-swagger-spec.md` | 比較用 v5 参照 |
| `docs/version-diff-v4-vs-v5.md` | Orbit v4 / v5 差分 |
| `docs/orbit-auth-guide.md` | Orbit 認証ガイド |
| `docs/orbit-operations-guide.md` | Orbit 運用: マップ、ミッション、検査、データレビュー |
| `docs/orbit-agent-roles.md` | Orbit Agent ロールと API マッピング |

### Spot ハードウェア & 運用

| ドキュメント | 用途 |
| --- | --- |
| `docs/spot-hardware-reference.md` | Spot 物理仕様、センサー、ネットワーク構成 |
| `docs/spot-hardware-maintenance-reference.md` | バッテリー交換、ヒップ/レッグ交換、ドック設定 |
| `docs/spot-arm-reference.md` | Spot Arm 仕様、キャリブレーション、マニピュレーション |
| `docs/spot-cam2-reference.md` | Spot CAM+IR 仕様とサーマル検査 |
| `docs/spot-payload-reference.md` | ペイロード統合と電力仕様 |
| `docs/spot-acoustic-sensors-reference.md` | 音響センサー仕様と使用法 |
| `docs/spot-mpu5-radio-reference.md` | MPU5 メッシュラジオ統合 |
| `docs/spot-rl-researcher-kit-reference.md` | RL Researcher Kit リファレンス |
| `docs/spot-product-comparison.md` | Spot モデル比較と運用制限 |
| `docs/spot-operations-reference.md` | 運用手順と安全 |
| `docs/spot-admin-reference.md` | 初期化、ソフトウェア更新、診断 |
| `docs/spot-firewall-reference.md` | Spot/Orbit ネットワークファイアウォール規則 |
| `docs/spot-release-notes.md` | Spot/Orbit ソフトウェアリリースノート |
| `docs/spot-inspections-reference.md` | 検査タイプとデータキャプチャ |

### SPX & エクステンション

| ドキュメント | 用途 |
| --- | --- |
| `docs/spx-extension-guide.md` | SPX パッケージ構造と配備メモ |
| `docs/spx-build-usage.md` | `build_spx.sh` / `build_extension.sh` 使用法 |
| `docs/spx-template-guide.md` | SPX テンプレートガイド |
| `docs/core-io-guide.md` | Core I/O ハードウェア、セットアップ、エクステンション、5G/LTE |
| `docs/site-hub-guide.md` | Site Hub インストールと Orbit 管理 |
| `docs/hardware-integration.md` | ハードウェア統合メモ |
| `docs/cert-setup-guide.md` | 証明書設定ガイド |

### トラブルシューティング & リファレンス

| ドキュメント | 用途 |
| --- | --- |
| `docs/troubleshooting.md` | Orbit / SPX トラブルシューティング |
| `docs/spot-troubleshoot-reference.md` | Spot 起動、バッテリー、カメラ診断 |
| `docs/spot-sdk-examples.md` | Spot SDK サンプル対応表 |
| `docs/bd-support-articles.md` | Boston Dynamics サポート記事まとめ |

---

## Orbit API token

1. ブラウザで `https://<your-orbit-host>` を開く
2. Orbit にサインイン
3. **Settings → Developer Features → API Access Tokens** を開く
4. token を生成
5. `spot-orbit-plugin setup` または `./install.sh setup` を実行して token を入力
6. `/spot-orbit:version` で確認

---

## 要件

- Claude Code
- Python 3.7+（`3.11+` 推奨）
- Node.js
- SPX イメージ / パッケージ作業用 Docker
- 実 API 利用のための Orbit インスタンスアクセス

---

## メモ

- `config.toml` には資格情報が含まれるためコミットしてはいけません
- SPX extension 名には underscore、空白、括弧を使ってはいけません
- 本番環境では `verify_ssl = true` を推奨します
- 書き込み操作が不要なら `enable_write_tools = false` のままにしてください

## ライセンス

MIT
