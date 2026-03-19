# Orbit Operations Guide

Comprehensive reference for Orbit platform operations.
Source: BD Support Articles (fetched via gemini CLI)


---
## Add-a-Robot-to-Orbit-122600

MCP issues detected. Run /mcp list for status.요청하신 URL에서 추출한 기술적인 콘텐츠를 구조화된 마크다운 형식으로 정리했습니다.

# Add a Robot to Orbit (Article 122600)

Boston Dynamics의 Orbit에 로봇(Spot)을 추가하는 방법은 크게 두 가지로 나뉩니다.

---

## 1. Auto-Connect 사용 (권장 방식)
고정 IP가 필요 없고 방화벽 설정이 간소화되므로 가장 권장되는 로봇 추가 방법입니다.

### 단계 1: Orbit 설정
1. **관리자(Admin) 계정**으로 Orbit에 로그인합니다.
2. `Settings > Robots` 메뉴로 이동합니다.
3. `+ Add Robot` 버튼을 클릭합니다.
4. **Use Auto-Connect** 옵션을 선택합니다.
5. 로봇의 **Asset ID**, 관리자 사용자 이름(`admin`), 비밀번호를 입력하고 `SAVE`를 클릭합니다.
6. 화면에 표시되는 **일회용 비밀번호(One-time password, OTP)**를 복사합니다. (다음 단계를 완료할 때까지 이 창을 닫지 마세요.)

### 단계 2: 로봇(Spot) 설정
1. 새 브라우저 탭을 열고, 추가하려는 로봇의 **Spot Admin Console**에 로그인합니다.
2. `Network Setup > Auto-Connect` 탭으로 이동합니다.
3. **Enable Auto-Connect** 값을 `True`로 설정합니다.
4. 연결할 Orbit 인스턴스의 IP 주소 또는 도메인 이름을 입력합니다.
5. 단계 1에서 복사한 **OTP**를 붙여넣습니다.
6. `APPLY`를 클릭하여 적용합니다.

### 단계 3: 연결 확인
* Orbit 대시보드의 로봇 목록으로 돌아가 해당 로봇이 **Connected** 상태로 정상적으로 표시되는지 확인합니다.

---

## 2. IP 주소를 통한 직접 추가 방식
네트워크 환경에서 로봇에 고정 IP(Static IP)를 할당하여 사용하는 경우 이 방법을 사용할 수 있습니다.

1. **관리자 계정**으로 Orbit에 로그인합니다.
2. `Settings > Robots` 메뉴로 이동합니다.
3. `+ Add Robot` 버튼을 클릭합니다.
4. 로봇에 할당된 **IP 주소**를 입력하고, 로봇의 관리자 계정 이름과 비밀번호를 입력합니다.
5. `SAVE`를 클릭하여 저장합니다.
6. 로봇 목록에서 상태가 **Connected**로 변경되었는지 확인합니다.

---

## ⚠️ 기술적 참고 사항 (Technical Notes)
* **최대 연결 제한:** 단일 Orbit 인스턴스는 최대 **20대**의 로봇까지만 동시에 연결할 수 있습니다.
* **계정 권한 요구사항:** 로봇을 추가할 때는 반드시 **관리자(Admin) 권한**을 가진 계정의 크리덴셜(자격 증명)을 사용해야 합니다. 그래야만 소프트웨어 업데이트 및 고급 기능을 정상적으로 사용할 수 있습니다.
* **인스턴스 충돌 방지:** 로봇이 이미 다른 Orbit 인스턴스에 연결되어 있는 경우, 반드시 기존 인스턴스에서 먼저 등록을 제거한 뒤 새 인스턴스에 추가해야 시스템 충돌을 방지할 수 있습니다.

---
## Manage-Orbit-Users-115574

MCP issues detected. Run /mcp list for status.# Manage Orbit Users (Article ID: 115574)

Orbit administrators have the ability to add/remove users, change passwords, and edit user roles and permissions. Boston Dynamics recommends using Single Sign-On (SSO) through your organization's Identity Provider (IdP) for ease of use and transparency.

## 1. Local User Management

Local users are authenticated and managed directly within Orbit. 

**Important:** To manage local users, you **must** be logged in as a Local Administrator. Admin accounts managed via SSO cannot create, edit, or delete local users.

### Add a Local User
1. Log in to Orbit as a Local Administrator.
2. Navigate to **Settings > Users**.
3. Select the **Local Users** tab.
4. Click **+ Add User**.
5. Fill out the required fields: **Username**, **Display Name**, and **Password**.
6. Save the new user.

### Edit a Local User
1. Navigate to the **Local Users** tab.
2. Locate the user in the list and click **Edit**.
3. Modify the user's information and save the changes.

### Delete a Local User
1. Navigate to the **Local Users** tab.
2. Locate the user in the list and select the delete option.

---

## 2. Federated User Management (SSO)

Federated users are managed via your SAML Identity Provider (IdP).

### Edit a Federated User
1. Log in to Orbit using an Administrator account.
2. Navigate to **Settings > Users**.
3. Select the **Federated Users** tab.
4. Locate the user in the list and click **Edit** to apply and save changes.

---

## 3. Managing Permissions via SSO (Role Mapping)

Orbit allows administrators to control user permissions by mapping IdP groups to specific Orbit roles.

### Configuration Steps
1. In your SAML Identity Provider, assign users to groups that correspond to Orbit roles.
2. In Orbit, navigate to **Settings > Users** and select the **Settings** tab.
3. Under the **SINGLE SIGN-ON** section, enter the required group attribute mapping.
4. Select the checkbox for **Use SSO Groups for Roles**.
5. Input the exact SAML response values that correspond to each specific Orbit role.

---

## 4. User Roles and Permissions

Orbit allows assigning roles to both Local and Federated users to restrict or grant access to various system features.

*   **Role Management:** Navigate to **Settings > User Roles** to view, duplicate, or create roles.
*   **Custom Roles:** 
    1. Click **+ Add Custom Role**.
    2. Enter a **Name** and **Description**.
    3. Select the desired permissions from the provided list.
    4. Save the new role to make it available for assignment.

---

## 5. Personal Account Settings

Regardless of role, all users have the ability to manage their own personal profiles.

*   Navigate to **Settings > Account** to update personal preferences.
*   **Configurable Settings Include:**
    *   Display Name
    *   Password
    *   Email Notification Preferences
    *   Temperature Units (e.g., Celsius/Fahrenheit)
    *   Language Preferences

---
## Monitor-Spot-Fleet-Performance-72043

MCP issues detected. Run /mcp list for status.
---
## Backup-and-Restore-Orbit-Data-123042

MCP issues detected. Run /mcp list for status.
---
## Set-Up-Orbit-Work-Order-Integration-214139

MCP issues detected. Run /mcp list for status.
---
## What-Is-a-Site-Map-72077

MCP issues detected. Run /mcp list for status.Here is the extracted technical content formatted as structured markdown:

# What Is a Site Map?

A **Site Map** is a real-time, visual representation of a facility and the robot fleet operating within it. In Boston Dynamics' **Orbit** software, it serves as the default home screen and primary interface for managing autonomous operations.

## Key Capabilities

*   **Real-Time Monitoring:** Tracks the live location of each Spot robot within the facility and monitors the progress of ongoing autonomous missions and inspections.
*   **Anomaly & Alert Tracking:** Displays the exact locations of recent anomalies (e.g., thermal irregularities, acoustic anomalies) detected by Spot during asset inspections.
*   **Mission & Path Management:** Visualizes the designated travel paths and inspection points based on Autowalk recordings. Operators can remotely command robots to navigate to specific waypoints or return to docking stations.
*   **Data Visualization:** Integrates with Spot Cam to provide panoramic images ("Site View") and specific inspection data directly overlayed onto the map for spatial analysis.

---

## Core Site Map Concepts

Understanding a Site Map requires familiarity with the following foundational components:

### 1. Site Map
The complete, real-time representation of your facility and fleet. It is generated by overlaying **Autowalk recordings** onto a facility **Drawing**.

### 2. Drawing
A 2D image—typically a blueprint or architectural floor plan—scaled to match the actual physical dimensions of the facility. It acts as the foundational background layer for the Site Map.

### 3. Autowalk Recording
A comprehensive collection of spatial and navigation data that defines how Spot explores the facility and where/how inspections are performed. It consists primarily of **Waypoints** and **Edges**.

*   **Waypoint:** A specific coordinate and snapshot of navigation data collected by Spot, representing its understanding of the localized environment at that exact location.
*   **Edge:** The designated path segment connecting two adjacent Waypoints. Edges contain specific behavioral parameters and instructions that dictate how Spot should navigate that segment (e.g., speed limits, staircase behaviors).

### 4. Autowalk (`.walk` folder)
The specific file and folder structure generated by the Spot tablet controller during the manual recording phase. It encapsulates all Autowalk recording data, waypoints, edges, and mission parameters.

### 5. Mission
A defined sequence of automated tasks that Spot is scheduled to execute. A mission relies on the underlying Autowalk recording for its navigation path.

### 6. Action
A preset operational task performed by the robot at a specific Waypoint during a Mission. Examples include taking a thermal reading, capturing a PTZ image, or reading an analog gauge.

---

## Site Map Utilization & Workflow

*   **Multi-Map Deployment:** Operators can create and manage multiple Site Maps to segment large facilities into different zones or to organize distinct sets of inspection missions.
*   **Foundation of Automation:** A high-quality Site Map is the prerequisite for any effective automated inspection program. It requires careful planning of Autowalk recordings to ensure complete spatial coverage and optimized mission scheduling.

---
## Create-a-New-Site-Map-72014

MCP issues detected. Run /mcp list for status.
---
## Edit-a-Site-Map-72025

MCP issues detected. Run /mcp list for status.
---
## Monitor-Your-Site-Map-72045

MCP issues detected. Run /mcp list for status.
---
## Add-an-Autowalk-Recording-to-a-Site-Map-49923

MCP issues detected. Run /mcp list for status.
---
## Edit-Autowalk-Missions-and-Actions-with-Orbit-72024

MCP issues detected. Run /mcp list for status.제공해주신 Boston Dynamics 지원 문서('Edit Autowalk Missions and Actions with Orbit')의 핵심 기술 정보, 편집 단계 및 제약 사항을 추출하여 구조화된 마크다운 형식으로 정리했습니다.

---

# Orbit을 사용한 Autowalk 미션 및 액션 편집 가이드

Boston Dynamics의 Orbit 플랫폼을 사용하면 데스크톱 환경에서 Spot 로봇의 Autowalk 미션과 수행할 액션(Action)을 시각적이고 세밀하게 편집할 수 있습니다. 스팟 태블릿 앱에 비해 미션 순서 변경 및 상세 파라미터 조정 등 훨씬 강력한 편집 기능을 제공합니다.

## 1. 미션 파라미터 편집 (Mission Parameters)
미션 전체에 공통으로 적용되는 전역 내비게이션 설정이나 동작 방식을 수정합니다.

### 📝 편집 단계
1. **관리자 로그인**: Orbit 시스템에 관리자(Admin) 권한 계정으로 접속합니다.
2. **메뉴 이동**: 좌측 메뉴에서 `Settings > Missions and Actions` 경로로 이동합니다.
3. **미션 선택**: `Missions` 탭에서 수정하고자 하는 미션을 찾아 **Edit** 버튼을 클릭합니다.
4. **설정 열기**: `Mission Parameters` 옵션을 선택하여 파라미터 설정 위젯을 엽니다.
5. **값 수정**: 각 탭을 이동하며 필요한 전역 설정(예: 배터리 복귀 임계값, 장애물 회피 민감도, 최대 속도 등)을 변경합니다.
6. **저장**: 변경 사항을 확인한 후 **Apply**를 누르고, 최종적으로 **Save**를 선택하여 반영합니다.

## 2. 액션 파라미터 편집 (Action Parameters)
로봇이 맵의 특정 웨이포인트(Waypoint)에서 수행하는 개별 검사나 동작(Action)의 세부 설정을 수정합니다.

### 📝 편집 단계
1. **메뉴 이동**: `Settings > Missions and Actions` 경로로 이동합니다.
2. **액션 선택**: `Actions` 탭에서 수정하려는 액션을 찾아 **Edit** 버튼을 클릭합니다.
3. **값 수정**: 해당 액션에 대한 고유 파라미터(예: 카메라 줌, 검사 대기 시간, PTZ 설정 등)를 수정합니다.
4. **저장**: 수정이 완료되면 **Save**를 눌러 저장합니다.

## 3. 사이트 맵 에디터 (Site Map Editor)를 활용한 시각적 편집
지도 기반 인터페이스에서 미션의 경로와 지정된 액션을 시각적으로 관리하고 일괄 편집할 수 있습니다.

### 📝 편집 단계
1. **맵 에디터 진입**:
   - Orbit 홈 화면에서 편집하려는 맵으로 전환한 뒤 **Edit** 버튼을 클릭하거나,
   - `Settings > Site Maps` 메뉴로 들어가 해당 맵의 **Edit**을 선택합니다.
2. **액션/경로 선택**: 지도 뷰 상의 마커를 클릭하거나, 왼쪽 사이드바 리스트에서 편집할 액션(단일 또는 다중 선택 가능)을 선택합니다.
3. **파라미터 수정**: 항목 선택 시 나타나는 오른쪽 사이드바에서 세부 파라미터를 조정합니다. 다중 선택 시 파라미터를 일괄 적용할 수 있습니다.
4. **저장**: 변경이 완료되면 **Save** 버튼을 클릭하여 맵 데이터에 반영합니다.

## 4. 핵심 제약 사항 및 기술적 세부 정보 (Constraints & Technical Details)

* **파라미터 적용 우선순위 (Override Rule)**: 특정 에지(Edge, 이동 경로)나 개별 액션(Action) 레벨에 설정된 파라미터는 미션 전체(Mission Level)에 설정된 글로벌 파라미터보다 항상 **우선 적용**됩니다. 따라서 전역 설정을 덮어써야 하는 특수 구간은 개별 편집을 통해 제어해야 합니다.
* **Site View의 활용**: **Site View** 기능을 사용하면 로봇이 주행하며 수집한 360도 파노라마 이미지를 바탕으로 시각적 컨텍스트를 얻을 수 있으며, 이를 보면서 새로운 액션을 지도상에 빠르고 정확하게 생성 및 미션에 할당할 수 있습니다.
* **권한 제약**: 파라미터 변경이나 미션의 생성/삭제/수정 등 주요 편집 기능은 반드시 **관리자(Admin) 권한**을 가진 사용자만 수행할 수 있습니다. 일반 Operator 권한으로는 열람 및 실행만 가능합니다.
* **운영 중(Live Operation) 영향**: 실시간으로 진행 중인 미션과 연결된 파라미터나 맵을 수정할 경우, 현재 주행 중인 로봇의 동작에 예기치 않은 영향을 주거나 안전상 주행이 중단될 수 있으므로 활성 로봇이 없는 상태에서 편집을 권장합니다.
* **지원 브라우저**: Orbit의 원활한 맵 에디터 및 파라미터 렌더링을 위해 **Google Chrome** 브라우저 사용이 권장/필수적으로 요구됩니다. 다른 브라우저에서는 일부 렌더링 기능이 제한될 수 있습니다.

---
## Run-Autowalk-Missions-with-Orbit-72050

MCP issues detected. Run /mcp list for status.
---
## Orbit-Mission-Validation-72047

MCP issues detected. Run /mcp list for status.
---
## Orbit-Operator-Controls-71298

MCP issues detected. Run /mcp list for status.
---
## Orbit-Inspection-Quickstart-72046

MCP issues detected. Run /mcp list for status.
---
## View-and-Analyze-Inspection-Data-with-Orbit-93252

MCP issues detected. Run /mcp list for status.해당 웹페이지의 내용을 가져오기 위해 모든 도구에 접근 가능한 범용 에이전트(`generalist`)를 활용하여 기술적인 콘텐츠를 추출하겠습니다.

요청하신 URL에서 추출한 기술적 콘텐츠(Technical Content)를 구조화된 마크다운 형식으로 정리한 내용입니다.

---

# Orbit을 통한 점검 데이터 확인 및 분석 (View and Analyze Inspection Data with Orbit)

Spot이 Autowalk 미션 중에 수집한 다양한 점검 데이터는 Orbit 플랫폼을 통해 중앙 집중적으로 확인하고 분석할 수 있습니다. 데이터를 검토하려면 사용자는 **'Data Reviewer'** 또는 **'Admin'** 권한이 필요합니다.

## 1. 점검 데이터 접근 방법 (Accessing Inspection Data)

Orbit에서 점검 데이터를 확인하는 주요 경로는 다음과 같습니다:
- **Inspections(점검) 페이지**: Orbit 로그인 후 'Inspections' 페이지로 이동하면 전체 점검 상태, 미션 로그, 로봇 활동 요약 대시보드를 확인할 수 있습니다.
- **Anomaly Alerts (이상 징후 알림)**: Orbit 홈 화면의 'Anomaly Alerts' 목록에서 바로 특정 알림을 클릭하여 관련 점검 데이터로 직접 이동할 수 있습니다.
- **최근 캡처 미리보기**: 'Inspections' 탭에서 특정 점검 항목을 선택하면 가장 최근에 캡처된 결과의 미리보기가 표시됩니다.

## 2. 점검 이력 탐색 (Inspection History)

특정 점검 항목에 대해 **History(이력)**를 선택하면 해당 위치/항목에서 수행된 모든 과거 캡처 기록을 확인할 수 있습니다.

### 데이터 브라우징 기능
- **다양한 센서 모달리티 전환**: 수집된 데이터 유형에 따라 카메라 이미지, 비디오 파일, 열화상 이미지(Raw/Processed) 간 전환이 가능합니다.
- **썸네일 보기 조정**: 그리드 뷰에서 썸네일 크기를 변경하여 많은 데이터를 한눈에 보거나 크게 볼 수 있습니다.
- **상세 보기 (Detail View)**: 캡처된 항목을 더블 클릭하면 상세 보기 모드로 진입하며, 비디오를 재생하거나 고해상도 이미지를 정밀하게 분석할 수 있습니다.

## 3. 열화상 데이터 분석 (Thermal Analysis)

열화상 점검 데이터의 경우 Orbit 내에서 전용 분석 도구를 제공합니다.

### 열화상 분석 도구 (Thermal Analysis Tool)
열화상 점검 이력에서 **Analysis(분석)**를 선택하여 다음 기능들을 수행할 수 있습니다:
- **시각화 조정**: 온도 단위(섭씨/화씨), 온도 스케일, 분석 범위 및 컬러 스킴(Color Scheme, 색상 체계)을 사용자가 직접 조정할 수 있습니다.
- **정밀 측정**: 이미지 위에 마우스를 올리면 특정 픽셀(지점)의 정확한 온도 수치가 표시됩니다.
- **관심 영역(ROI) 설정 및 편집**: 이미지 내 특정 관심 영역(Regions of Interest)이나 지점(Points of Interest)을 설정하여, 영역 간의 온도 차이를 비교하고 분석할 수 있습니다.
- **데이터 내보내기**: 분석 내용과 설정된 주석(Annotation)이 포함된 상태로 이미지를 `.jpeg` 파일로 저장 및 내보낼 수 있습니다.

## 4. AI 시각 점검 데이터 (Orbit AI Visual Inspections)

Orbit 5.0 이상 버전에서는 AI 모델을 활용한 시각 점검 데이터를 지원합니다.

- **AI 분석 질문 및 결과**: 이미지 내 특정 객체의 존재 여부, 상태, 또는 텍스트/숫자 판독을 위해 설정된 질문 (예: "다이얼 게이지의 현재 수치는 얼마인가?")에 대한 AI의 답변과 신뢰도를 점검 이력에서 검토할 수 있습니다.

## 5. 대시보드 및 알림 시스템 (Dashboard & Alerts)

- **점검 대시보드 (Inspection Dashboard)**: 사이트 전체의 점검 활동을 요약하고, 이상 징후(Anomaly) 발생 상태를 리포트 형태로 제공합니다.
- **변경 감지 및 알림 (Change Detection Alerts)**: 사전에 설정한 임계값(Threshold)을 초과하거나 데이터상의 뚜렷한 변화가 감지되면 경고 알림이 생성됩니다.
- **작업 오더 연동 (Work Order Integration)**: 외부 작업 관리 시스템(WOM)과 통합 설정이 되어 있는 경우, 이상 징후 감지 시 자동으로 작업 오더(Work Order)를 생성하도록 구성할 수 있습니다.

--- 

> **참고**: 이 가이드는 Orbit 5.0 이상의 최신 버전을 기준으로 작성되었으며, 사용 중인 Orbit 버전에 따라 일부 UI/UX 및 세부 기능 지원 여부에 차이가 있을 수 있습니다.

---
## Edit-and-View-Thermal-Data-with-Orbit-71299

MCP issues detected. Run /mcp list for status.다음은 요청하신 [Boston Dynamics: Edit and View Thermal Data with Orbit](https://support.bostondynamics.com/s/article/Edit-and-View-Thermal-Data-with-Orbit-71299) 문서의 핵심 기술 내용을 구조화된 마크다운 형태로 정리한 결과입니다.

# Orbit을 활용한 열화상 데이터 편집 및 확인 가이드

Boston Dynamics Orbit 플랫폼에서 Spot 로봇(Spot CAM+IR 장착)을 통해 수집된 열화상(Thermal) 데이터를 확인, 분석하고 관련 점검 액션을 편집하는 기술적 워크플로우입니다.

## 1. 열화상 점검 결과 확인 및 상세 분석 (View & Analyze)

로봇이 임무 중 수집한 과거 열화상 데이터를 검토하고 분석 도구를 활용하여 상세한 온도 변화를 측정할 수 있습니다.

*   **접속 권한:** `Data Reviewer` 또는 `Admin` 계정 필요
*   **경로:** `Inspections` 메뉴 ➔ 원하는 열화상 점검(Inspection) 항목 선택 ➔ `History` 탭 클릭
*   **분석(Analysis) 도구 기능:** 특정 캡처 이미지를 선택한 후 `Analysis` 모드로 진입하면 다음 작업이 가능합니다.
    *   **온도 및 시각화 조절:** 온도 측정 단위 (섭씨/화씨), 온도 스케일, 측정 범위, 색상 체계(Color Scheme) 변경.
    *   **픽셀 단위 정밀 확인:** 열화상 이미지 위로 마우스 커서를 이동하여 픽셀 지점별 정확한 온도 데이터 확인.
    *   **관심 영역(ROI) 추가 및 편집:** 사후 분석 단계에서 이미지 위에 임의의 점(Point)이나 다각형 영역(Region)을 직접 그려 특정 부위의 온도를 측정.
    *   **비교 분석(Differential):** 설정된 여러 관심 영역(ROI) 간의 온도 차이를 시스템이 자동으로 계산하여 표시.
    *   **데이터 내보내기:** 분석 설정(ROI, 주석 등)이 반영된 최종 열화상 이미지를 `.jpeg` 형식으로 저장(Export).

## 2. 열화상 점검 액션(Actions) 편집 (Edit)

로봇이 향후 자율 주행 임무(Autowalk)를 수행할 때 열화상 데이터를 캡처하고 분석하는 기준 설정을 변경합니다. (이 설정은 향후 임무에만 적용되며 기존 데이터에는 소급 적용되지 않습니다.)

*   **접속 권한:** `Admin` 계정 필요
*   **경로:** `Settings` ➔ `Missions and Actions` 또는 사이트 맵 에디터(Site Map Editor) 이용
*   **주요 기술적 편집 항목:**
    *   **검사 영역 재설정:** 로봇이 열화상 이미지를 캡처할 때 분석할 기존 관심 영역(ROI)의 모양이나 크기 경계 수정 및 신규 영역 추가.
    *   **알림 임계값(Alert Thresholds) 구성:** 각 영역별로 온도가 특정 기준치를 넘었을 때 경고를 발생시키는 수동 또는 자동 알림 임계값 설정.
    *   **상대적 비교 임계값:** 장비의 여러 부분 간 온도 데이터를 상호 비교하여 이상 징후를 감지하도록 하는 고급 상대 임계값(Relative Thresholds) 룰 설정.

## 3. 실시간 열화상 모니터링 (Scout 모드)

수동 조종(Teleoperation) 중 실시간 열화상 스트리밍 피드를 분석하는 기능입니다.

*   **하드웨어 요구사항:** Spot CAM+IR 페이로드 장착
*   **활성화 방법:** `INSPECTING` 운행 모드 진입 ➔ `SPOT CAM` 제어 패널에서 `Thermal Mode`(열화상 모드) 활성화
*   **기술적 특징:**
    *   **레티클(Reticle) 측정:** 화면 중앙에 위치한 십자선(Reticle)이 가리키는 대상의 대략적인 표면 온도를 실시간 텍스트 데이터로 오버레이 출력.
    *   **자동 스케일링:** 카메라 화면 뷰파인더 내에 포착된 물체들의 최저 온도와 최고 온도를 기준으로 열화상 온도 스케일이 프레임마다 자동 조정(Auto-scaling)됨.

---
## Regions-of-Interest-and-Alert-Thresholds-171953

MCP issues detected. Run /mcp list for status.
---
## Change-Detection-Alerts-214126

MCP issues detected. Run /mcp list for status.
---
## Control-Spot-Arm-with-Orbit-72012

MCP issues detected. Run /mcp list for status.
---
## Set-Up-Site-View-214140

MCP issues detected. Run /mcp list for status.제공해주신 URL (Boston Dynamics Support: "Set Up Site View")에서 추출한 기술적인 내용을 구조화된 마크다운 형식으로 정리해 드립니다.

# Boston Dynamics Orbit: Site View 설정 및 사용 가이드

## 1. Site View 개요
- **정의:** Spot 로봇(Spot CAM 장착)이 수집한 360도 파노라마 이미지를 활용하여 현장을 1인칭 시점(1st-person view)으로 탐색할 수 있는 Orbit 전용 기능입니다.
- **주요 활용:** 지정된 경로(웨이포인트)의 시간대별 환경 변화 확인, 3D 공간 상의 검사(Inspection) 항목 및 알림(Alerts) 모니터링.

## 2. Site View 설정 및 활성화 (Setup & Activation)
Site View는 별도의 복잡한 소프트웨어 설치 과정이 요구되지 않으며, 데이터 수집 설정에 따라 자동으로 활성화됩니다.
- **자동 활성화 조건:** 사이트 맵 내의 하나 이상의 웨이포인트(Waypoint)에 파노라마 이미지가 성공적으로 수집 및 연결되어 있으면, Orbit 홈 화면이나 지도 편집기(Map Editor)에서 `Site View` 버튼이 자동으로 나타납니다.
- **데이터 수집 방법:**
  1. **Autowalk 미션 중 수집:** Spot 로봇이 일반적인 Autowalk 미션을 수행할 때, 사전에 지정된 특정 웨이포인트에서 자동으로 360도 파노라마 사진을 캡처하도록 설정할 수 있습니다.
  2. **웨이포인트 선택 설정:** 미션 편집기(Mission Editor)를 사용하여 파노라마 이미지를 수집할 타겟 웨이포인트를 명시적으로 지정하여 촬영을 지시합니다.

## 3. 핵심 기능 및 조작 방법 (Features & Navigation)
- **진입(Access):** Orbit 홈 화면 또는 지도 뷰에서 `Enter Site View`를 선택한 후, 탐색하고자 하는 웨이포인트를 클릭하여 진입합니다.
- **시점 조작(Camera Controls):**
  - 마우스 클릭 및 드래그를 통해 카메라 방향(Pan/Tilt)을 360도 자유롭게 조절할 수 있습니다.
  - 마우스 휠 스크롤을 사용하여 이미지를 최대 **7.5배**까지 확대(Zoom)할 수 있습니다.
- **지점 간 이동(Navigation):** 화면 상에 표시된 **파란색 웨이포인트 마커**를 클릭하여 인접한 다른 지점으로 즉시 텔레포트 이동할 수 있습니다.
- **과거 데이터 조회(Historical Timeline):** 하단의 날짜 및 시간 컨트롤러(타임라인 스크러버)를 조작하여 동일한 지점에서 과거에 촬영된 스냅샷 기록을 불러오고 시간에 따른 현장 변화를 비교할 수 있습니다.

## 4. 원격 미션 편집 및 검사 생성 (Mission Editing & Inspection)
- **가상 검사(Virtual Inspection) 생성:** 현장 방문이나 로봇의 실시간 조종 없이도, Site View 인터페이스 내에서 새로운 검사 액션(예: 게이지 읽기, 열화상 검사 등)을 직접 추가하고 대상의 조준점(Aiming)을 정밀하게 설정할 수 있습니다.
- 이를 통해 오프라인 상태에서도 매우 효율적이고 안전하게 기존 미션을 편집하고 업데이트할 수 있습니다.

## 5. 데이터 관리 및 개인정보 보호 (Data Management & Privacy)
- **얼굴 블러링(Face Blurring):** Orbit 설정 내의 `Data Management(데이터 관리)` 메뉴에서 얼굴 자동 감지 및 블러 처리 기능을 활성화하여, 캡처된 Site View 이미지 내 사람의 얼굴을 익명화(비식별화)할 수 있습니다.
- **데이터 영구 삭제(Image Deletion):** 데이터 보안 정책에 따라 관리자는 특정 지점이나 시간대의 파노라마 이미지를 시스템에서 영구적으로 삭제할 수 있는 권한을 제공받습니다.

## 6. 시스템 요구사항 및 제약사항 (Constraints)
- **하드웨어 요구사항:** 360도 파노라마 이미지를 캡처하기 위해 Spot에 **Spot CAM** 페이로드가 장착되어 있어야 합니다.
- **인터페이스 제한:** Site View 기능은 **Orbit 웹 인터페이스(Web Interface)** 환경에서만 독점적으로 제공되며, 로봇 조종용 태블릿 컨트롤러(Tablet Controller)에서는 접근하거나 사용할 수 없습니다.

---
## Explore-Your-Map-in-Site-View-171951

MCP issues detected. Run /mcp list for status.
---
## Create-Actions-in-Site-View-171950

MCP issues detected. Run /mcp list for status.
---
## About-Cloud-Based-Orbit-71292

MCP issues detected. Run /mcp list for status.
---
## Set-Up-Orbit-as-a-Virtual-Machine-171879

MCP issues detected. Run /mcp list for status.
---
## Orbit-Software-Updates-123043

MCP issues detected. Run /mcp list for status.
---
## Enroll-Your-Orbit-with-Boston-Dynamics-214128

MCP issues detected. Run /mcp list for status.
---
## Orbit-for-Enterprise-171952

MCP issues detected. Run /mcp list for status.MCP issues detected. Run /mcp list for status.
---
## Set-Up-Orbit-as-a-Virtual-Machine-171879

MCP issues detected. Run /mcp list for status.
---
## Orbit-Software-Updates-123043

MCP issues detected. Run /mcp list for status.
---
## Enroll-Your-Orbit-with-Boston-Dynamics-214128

MCP issues detected. Run /mcp list for status.
---
## Orbit-for-Enterprise-171952

MCP issues detected. Run /mcp list for status.
---

## Tutorial: Record an Industrial Inspection Map (177258)

Step-by-step workflow for recording Autowalk routes and industrial inspections.

### Prerequisites

- Spot with Spot Cam payload (photo + thermal) and Core I/O
- Fully charged battery (spare recommended for hot-swap)
- Fiducials placed at intersections, loop closures, and key locations
- Equipment running at nominal state during recording

### Recording Workflow

**Step 1 — Prepare:** Alert personnel (stay 4m+ away), power on Spot, connect tablet.

**Step 2 — Start recording:** Spot App > AUTOWALK > RECORD > name recording > START RECORDING & UNDOCK (auto-records dock fiducial #520).

**Step 3 — Record main loop:**
- Drive route, capture fiducials within 1m at intersections (camera pointing at tag)
- At inspection points: Add Action > choose type (Thermal, PTZ, etc.)
- Configure ROI, alert thresholds, unique names per asset
- Complete loop by returning to first fiducial

**Step 4 — Record branches and secondary loops:**
- **Pause** recording before driving through already-recorded sections
- **Resume** at the branch point (capture fiducial again)
- **Branches** (dead-ends): Record one direction only; Spot navigates out and back automatically
- **Secondary loops**: Provide alternate routes for dynamic rerouting
- **Crosswalks**: Add Action > Spot Crosswalk at high-traffic areas
- **Stairs**: Add Action > Stairs Clearance Check before staircase entry
- **Other floors**: Treat as branches with staircase connections

**Step 5 — Finish and validate:**
1. Select FINISH RECORDING > YES
2. CONTINUE TO MISSION REPLAY
3. Observe full replay, note any navigation issues
4. Place temporary obstacles to test alternate routes

**Step 6 — Fine-tune:**
- **Mission replay options**: Modify behavior settings per mission
- **Edge/action parameters**: Override mission-level settings for specific segments
- **Facility modifications**: Clear obstacles, add anti-skid on stairs, post signage

### Tips

- Record narrow passageways in the expected travel direction (Spot may not turn around)
- Fiducials captured from >2m or at steep angles may not provide accurate localization
- Branches and loops can be recorded in any order as long as fiducials are captured at intersections
- Upload completed recording to Orbit for mission scheduling and further editing

---

## Create an Orbit Mission Schedule

Source: https://support.bostondynamics.com/s/article/Create-an-Orbit-Mission-Schedule-115575

Mission schedules coordinate Spot robot fleet activities to ensure every asset is inspected at the appropriate cadence. Only Orbit administrators can create or edit mission schedules.

### Schedule a Mission

1. Log in to Orbit as admin
2. Navigate to **Settings > Schedule Missions**
3. Select **+ Add Schedule**
4. Specify **Robot Name**, **Mission Name**, **First Start**, and **Repeat**
   - When Repeat is set to "On a set interval", specify repeat by Minute, Hour, Day, or Week
   - Select **Show operating hours** for additional time-based control
   - Select **Avoid Precipitation** to prevent launches when precipitation thresholds are met
5. Select **ADD EVENT**

To cancel a scheduled mission, delete the event from the list. Deleting an event prevents future launches but does not interrupt a mission in progress.

### Operating Hours

For repeating missions, operating hours restrict when a mission can launch (but do not force missions to end early — missions in progress continue past operating hours).

- Click or click-and-drag hourly blocks to set allowed launch windows
- **Apply operating hours to all schedules** changes all missions at once
- Sync operating hours start to intended launch cadence to avoid "skipped launch" makeup runs

### Robot Time Zone

Mission schedules use **Robot time** (the time zone where the fleet is located). Change fleet time zone via **Settings > Scheduler**.

### Lock Out Mission Schedules

- **Individual lockout**: Select "Set individual lockout" for a specific mission
- **Global lockout**: Select "Set global lockout" → Confirm (applies only to missions existing at that time)
- Missions in progress continue; only future scheduled runs are blocked

### Mission Launch Eligibility

Orbit checks these criteria before launching:

| Criterion | Requirement |
|-----------|-------------|
| Robot availability | Orbit can connect to the assigned robot |
| Dock status | Robot must be on a dock (dock need not be in the mission) |
| Lease status | Orbit must take control; active manual operators must disconnect first |
| Enabled status | Mission must not be manually disabled |
| Operating hours | Must be within set operating hours |
| Time to run | `Next Run = Last Launch Time + Repeat Interval` |
| Weather | If Avoid Precipitation is on, forecast must be within thresholds |

When multiple missions are eligible, Orbit launches the most overdue mission first (alphabetical tiebreaker).

### Dock Conflicts

- Each dock should be reserved for a single robot
- All missions for one robot should use the same dock(s)
- If a mission includes multiple docks, reserve all for that robot

### Weather Settings

- Navigate to **Settings > Schedule Missions > Weather Settings**
- Specify nearest **City**, set **Current precipitation** threshold (max 5 mm)
- Enable **Include upcoming forecast** to set max probability of precipitation (next 3 hours)
- **Snooze Weather Check** temporarily bypasses weather settings for a specific schedule

### Download Calendar

Export all scheduled Orbit missions as `.ical` file via **Settings > Schedule Missions > Download calendar**.

---

## Orbit Operator Controls

Source: https://support.bostondynamics.com/s/article/Orbit-Operator-Controls-71298

Orbit can drive the robot, operate payloads, trigger Spot Actions, and run/monitor Autowalk missions. Requires **Google Chrome** browser.

### User Types

| Type | Permissions |
|------|------------|
| Standard | View all robots |
| Driver | Standard + operate all robots |
| Data Reviewer | Standard + review/download mission data, view performance dashboard |
| Temporary | Operate and view all robots for limited time via unique URL (cannot be admin) |
| Admin | Full permissions: operate, configure, manage users/robots |

### Drive Mode

Available to Driver, Admin, or Temporary User. Provides direct robot control.

**Power and Docking:**
- **Power on (docked)**: Select POWER ON AND UNDOCK — robot stands and walks forward to clear dock
- **Power on (not docked)**: Select POWER ON — powers on in place
- **Power off**: Sit robot on flat ground → select POWER OFF
- **Dock**: Drive near dock → select teal house icon → DOCK
- **Power cycle payloads**: POWER MENU → POWER PAYLOADS OFF/ON
- **Power cycle robot**: POWER MENU → POWER CYCLE ROBOT (wait several minutes for reboot)

**Driving Controls:**

| Key | Action |
|-----|--------|
| W | Forward |
| A | Rotate left |
| D | Rotate right |
| S | Back |
| Q | Step left |
| E | Step right |
| ↑↓←→ | Switch camera views |
| Spacebar | Toggle Drive/Inspect mode |
| Esc | Cancel |

**Touch-to-Go (TTG):** Click location in video feed to navigate Spot there automatically.

**Compass Control:** Click compass points to change camera view; drag blue dot to rotate robot.

**Robot Controls:**
- **SIT/WALK**: Lower body to ground / stand up
- **Speed**: SLOW, MED, FAST (set when not in motion)
- **Obstacle Avoidance**: Toggle on/off, adjust cushion
- **Stairs Mode**: AUTO (default), ON (force stairs gait), OFF (ignore stairs detection)
- **Self Right**: Attempt recovery from fall

**Advanced Controls:**
- **Height**: Raise/lower body (most stable at medium)
- **Tilt**: Angle nose up/down
- **Step Height**: Control foot lift height (default: dynamic)
- **Grated Floor Mode**: Improve performance on grated/repetitive floors (default: auto-detect)
- **Ground Friction**: Adjust expected friction coefficient (default 0.6; lower = smaller steps)

### View Mode

All user types can use View mode. Provides video feeds but no robot control. Select VIEW from robot list.

### Manipulation Mode

For Driver/Admin/Temporary users with Spot Arm. See "Control Spot Arm with Orbit" for details.

### Inspect Mode

Control Spot CAM PTZ camera directly. Motors do not need to be powered on.

- **Assisted aiming**: Click-drag to draw inspection box → PTZ centers and zooms
- **Manual PTZ**: Click to center, use compass to reorient, arrow keys for incremental pan/tilt
- **Zoom**: Drag zoom slider (bottom-left)
- **Re-center**: Select Center PTZ to reset to forward-facing 1x zoom
- **Thermal camera** (Spot CAM+IR): Toggle thermal mode in SPOT CAM panel

**PTZ focus fix:** If PTZ locks out of focus after a fall, sit Spot with motors off and power cycle payloads.

### Data Capture

- Drive to capture location
- In DATA CAPTURE widget, select sensors and data types
- Select DATA CAPTURE → packaged as .zip files

---

## Run Autowalk Missions with Orbit

Source: https://support.bostondynamics.com/s/article/Run-Autowalk-Missions-with-Orbit-72050

Replay any Autowalk mission uploaded to or created with Orbit. Requires **Google Chrome**.

### Schedule Recurring Missions

Use the Orbit mission scheduler to configure one-time or repeating missions. Only admins can create/edit schedules. See "Create an Orbit Mission Schedule" above.

### Replay a Mission Immediately

Any user with Driver permission can launch a one-time mission:

1. Log in to Orbit
2. Select a robot → **Drive**
3. Ensure robot can see at least one fiducial from the recording (or start from dock if dock is in the mission)
4. Expand **PLAY MISSION** panel → select mission
5. Select **Play Mission**
6. Orbit switches to View mode with a status bar and playback controls

---

## Orbit Mission Validation

Source: https://support.bostondynamics.com/s/article/Orbit-Mission-Validation-72047

Orbit continuously validates missions as you edit site maps and associated missions.

### Validation Failure Causes

- A required edge has been disabled or deleted
- Two or more Actions have identical names
- Actions from multiple recordings are not merged or connected
- An Action is associated with a recording not added to the map

### Warning Indicators

- Warning icon appears next to invalid mission in left sidebar
- Select **Info** to see the specific validation error
- Some errors prevent saving — Orbit may offer to resolve automatically, otherwise fix manually before saving

---

## Monitor Spot Fleet Performance

Source: https://support.bostondynamics.com/s/article/Monitor-Spot-Fleet-Performance-72043

Review Orbit mission logs and historical data to understand fleet performance during Autowalk missions. Requires **Data Reviewer** permission. Access via **Inspections** in the top nav bar.

### Missions Tab

Lists every individual mission run with overall performance metrics. Select a mission for detailed event log. "Stuck" events include body camera images to help diagnose navigation issues.

### Mission Status

| Status | Description |
|--------|-------------|
| SUCCESS | Mission completed successfully (check log for individual action status) |
| RUNNING | Mission in progress |
| FAILURE | Not completed due to navigation failures or robot errors (e.g., battery depleted) |
| PAUSED | Execution paused (e.g., operator issued pause command) |
| ERROR | Unexpected error — contact BD Support |
| STOPPED | Stopped before completion (e.g., operator took manual control) |

### Event Severity

| Level | Description |
|-------|-------------|
| INFO | Informational, no action required (e.g., battery finished charging) |
| WARN | Error may occur in future if no action taken (e.g., robot can't reach target, waiting for operator) |
| ERROR | Fatal to operation, action required (e.g., failed to dock, idling) |
| CRITICAL | Severe, immediate attention required (e.g., critically low battery, shutting down) |

Subscribe to alert notification emails and set minimum severity in **Settings > Account**.

### Filters

- Expand **Filters** sidebar to focus on specific missions or robots
- **Min Severity** filter shows only missions with events at the selected level
- **Date range picker** limits data to a specific time frame
- Performance metrics at page top update based on current filters

### Mission Dashboard

Lists unique missions with most recent run status and overall performance stats. Displays historical completion rate graphs across all missions and inspections.

### Archive Mission Data

Permanently archive mission data to exclude from inspection history and dashboards:

1. Locate mission in Mission Dashboard list
2. Select **Archive** → choose date range or "For all time"
3. Enter mission name exactly (case-sensitive) as confirmation
4. Select **Archive Runs**

**Warning:** This operation is not undoable. Archived data can only be recovered by BD Support engineers. Archiving does not free disk space on Site Hub.

---

## Site View

### Explore Your Map in Site View

Source: https://support.bostondynamics.com/s/article/Explore-Your-Map-in-Site-View-171951

Site View lets you explore your site map through the robot's perspective using 360-degree panoramic images collected by Spot Cam during missions. Orbit-only feature (not available on tablet controller).

**Controls:**
- **Click-and-drag** — Aim camera
- **Click near waypoint** — Move to waypoint (blue = inspections)
- **Zoom slider or scroll** — Magnify up to 7.5x
- **Date and time** — View historical snapshots at current waypoint
- **Delete** — Permanently delete current image

**Data Privacy:** Orbit can automatically detect and blur faces in Site View images. Configure in **Orbit Administration and Settings > Data Management**.

### Create Actions in Site View

Source: https://support.bostondynamics.com/s/article/Create-Actions-in-Site-View-171950

Create new inspection actions using panoramic images as reference, without driving the robot to the target.

**Procedure:**
1. In Orbit map editor, select **Open Site View**
2. Navigate to the waypoint where the action should be performed
3. Select **Create Inspection** → choose inspection type
4. Aim camera at target → **Finish editing**
5. Configure inspection parameters in right sidebar
6. **Save** changes
7. Add action to a mission playlist (new actions are unassigned by default)

**Supported inspection types:**
- Spot Cam PTZ inspections (visual images)
- Spot Cam thermal inspections

Note: Until the action has been performed by a robot, no native data type preview is available and regions of interest cannot be added.

### Set Up Site View

Source: https://support.bostondynamics.com/s/article/Set-Up-Site-View-214140

Site View is enabled automatically when panoramic images are associated with waypoints. Requires Spot Cam, an Orbit site map, and a mission route through the target area.

**Step 1 — Configure waypoints:**
- In map editor, select waypoints for Site View
- Choose panorama types to enable
- Set minimum time between updates (0 hours = update as often as possible)

**Step 2 — Configure missions:**
- Select missions to enable Site View panoramas
- Set image types that can be updated
- Optionally limit panoramas per mission run

**Step 3 — Run missions:**
- Run each mission at least once; schedule recurring runs to keep Site View current

**Panorama collection rules** — A new panorama is captured when ALL conditions are met at dispatch:
1. Mission is configured for Site View updates
2. Waypoint has panorama type enabled
3. Most recent capture is older than minimum time between updates
4. Mission panorama count is below limit

**Optimization tips:**
- Set minimum time longer than expected delay between missions to avoid unnecessary updates
- Use mission update limits to keep run times reasonable
- If first N waypoints always consume the limit, increase the limit or lengthen intervals for those waypoints

---

## Manage Orbit Users

Source: https://support.bostondynamics.com/s/article/Manage-Orbit-Users-115574

Orbit admins can add/delete users, change passwords, and edit roles and permissions. SSO via SAML is recommended for convenience and audit trail.

### User Account Types

- **Local** — Configured by local Orbit admin; credentials stored within Orbit instance
- **Federated** — Via SSO; users log in with existing organizational credentials

### User Permissions

| Permission | Description |
|-----------|-------------|
| None (basic) | View site maps and robots |
| Driver | Operate all robots |
| Data Reviewer | Review/download mission data, view performance dashboards |
| Admin | All permissions + configure Site Hub, edit maps/missions, manage users/robots/schedules |
| Temporary Access | Driver + Data Reviewer for limited time via unique URL (cannot be admin, local only) |

### Custom User Roles

1. Navigate to **Settings > User Roles**
2. Select **+ Add Custom Role** (or clone existing role)
3. Name the role, select permissions (assign both "View" and "Modify" for UI changes)
4. Save — role can now be assigned to local and federated users

**Caution:** Editing/deleting custom roles with driving permissions may leave a robot unexpectedly without a driver.

### Manage Local Users

Requires local admin account. SSO-managed admins cannot manage local users.

1. **Settings > Users > Local Users** → **+ Add User**
2. Provide username, display name, password
3. Select roles (Temporary Access, Admin, or custom roles)
4. Save — temporary users get a unique login URL

### Authentication Failures

Orbit rate-limits local users after repeated failed login attempts. Admin can unblock accounts to allow immediate retry.

### Configure SSO (SAML)

1. In Orbit: **Settings > Users > Settings tab** → copy **ACS URL** and **Entity ID**
2. In identity provider: register Orbit as application, configure attribute mappings
3. In Orbit: paste SAML metadata (URL or XML), enter Email/First Name/Last Name attribute mappings
4. **Confirm** to save

**Auto-manage permissions via SSO:** Enable "Use SSO Groups for Roles" and map SSO groups to Orbit user roles. User permissions update on next SSO login.

---

## Backup and Restore Orbit Data

Source: https://support.bostondynamics.com/s/article/Backup-and-Restore-Orbit-Data-123042

### Backup Types

| Type | Contents |
|------|----------|
| Maps, missions, and actions | Map/mission data only. No inspection data, logs, summaries, or Orbit config |
| Complete backup | Entire Orbit instance including historical inspection data, mission logs, and config |

### Recommendations

- Create **maps/missions backup** before significant changes to operational site maps
- Create **full backups** regularly to preserve inspection and mission log data
- Do not back up while Orbit is downloading captures from robots
- Comply with local data retention and privacy regulations

### Limitations

- Backups can only be restored to the **same Orbit software version**
- In Spot v4.1, backups can only be created from Site Hub-based Orbit (restore works on all instances)
- **Not included:** Email alert configs without username/password auth, user accounts
- Restoring does not affect current user list
- **Do not modify** backup files — modified backups may not be restorable
- Archived data recovery requires BD Support engineers

---

## Set Up Orbit Work Order Integration

Source: https://support.bostondynamics.com/s/article/Set-Up-Orbit-Work-Order-Integration-214139

Orbit can generate work orders in an external Work Order Management (WOM) system when inspections trigger anomaly alerts. Orbit tracks work order status and silences alerts while work orders are open.

### WOM System Requirements

- Reachable by Orbit on the network
- Uses HTTPS header-based authentication
- HTTP endpoint for creating work orders (accepts JSON, returns work order ID)
- HTTP endpoint for querying work order status (filter by ID, returns status field mappable to open/closed)

For systems not meeting these requirements, BD offers custom integration services.

### Configuration

1. **Settings > Work Orders** → **Enable Work Orders**
2. Optionally enable: Auto-create work orders from new anomalies, Suppress alerts from inspections with open work orders
3. Set **Authentication type** and TLS settings
4. **Create URL** — endpoint for creating work orders
5. **Work order spec** — JSON structure for populating new work orders (refer to Orbit API docs for variables)
6. **Title field** / **ID field** — corresponding field names in WOM system
7. **Detail URL** — viewing endpoint (use `{id}` variable), e.g., `https://example.com/workorder/{id}`
8. **Status URL** — status query endpoint (use `{id}` variable)
9. **Status field** / **Status type** — how WOM stores status info
10. **"Closed" values** — comma-separated list of statuses Orbit treats as closed
11. **Confirm** to save

---

## Change Detection Alerts

Source: https://support.bostondynamics.com/s/article/Change-Detection-Alerts-214126

Orbit can compare inspection data over time and flag changes of interest. Currently available for **acoustic mechanical inspections**.

### Enable Change Detection

Enable in **Settings > Data Management**. Optionally configure email alerts for significant changes and known anomalous patterns.

### How It Works

Orbit builds a statistical model from previous captures, then compares each new capture to determine:

- **Fit score** — How well capture matches historical data. Low score = flagged as anomaly
- **Group assignment** — Groups similar captures (representing machine states like off, idle, running)
- **Model updates** — New capture added to dataset; model regenerated

**Note:** Minimum 20 captures required for baseline. Initial captures assumed nominal.

### Anomaly Alert Types

1. **Threshold-based** — Capture matches an alert condition (e.g., temperature threshold, specific object presence). Based on inspection settings, not change detection.
2. **Statistical outlier** — Change detection determines capture is sufficiently different from historical data
3. **Prior anomaly match** — Capture matches a group previously flagged as anomalous (requires "Alert on match against prior anomaly" enabled)

### Spectrogram View

For acoustic inspections, displays how acoustic data changes over time:

- Navigate to **Inspections** → select inspection → **History** → **View Spectrogram**
- Color-coded groups; anomaly alerts marked with icon
- Hover for capture info; right-click to view details, add annotations, or override anomaly status
- Change detection algorithm only analyzes frequencies **above 25 kHz** (ultrasonic)

### Annotations and Groups

- Right-click spectrogram slice → **Add annotation** to label machine state
- Groups may change over time as the model is regenerated
- Toggle group visibility via checkboxes

### Manual Overrides

- Right-click → **Mark as anomaly** or **Mark as nominal**
- "Nominal" suppresses future alerts for grouped captures
- "Anomaly" triggers future alerts for grouped captures

### Persistent Captures

Captures remain visible in time-filtered spectrograms if: flagged as anomaly, annotated by user, or manually overridden. This preserves access for editing annotations and overrides.
