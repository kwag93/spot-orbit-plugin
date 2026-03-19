# Spot Inspections Reference

Reference for thermal, AI visual, acoustic, and computer vision inspections with Spot.

Sources:
- https://support.bostondynamics.com/s/article/Thermal-Inspections-with-Spot-72076
- https://support.bostondynamics.com/s/article/Orbit-AI-Visual-Inspections-139734
- https://support.bostondynamics.com/s/article/Create-Acoustic-Inspections-with-Spot-200356
- https://support.bostondynamics.com/s/article/Create-an-AI-Visual-Inspection-214127
- https://support.bostondynamics.com/s/article/AI-Visual-Inspection-Models-214125
- https://support.bostondynamics.com/s/article/Integrating-Computer-Vision-CV-Models-with-Spot-221803

---

## Thermal Inspections with Spot (72076)

Thermal inspections use an infrared camera to analyze the heat signature of objects or environments. Common use cases include detecting overheating motors/pumps and triggering alerts when temperature exceeds thresholds.

### Prerequisites

- Spot Cam+IR payload attached
- Spot tablet controller (paired)
- At least one fiducial
- Orbit (recommended, not required)

### Manual Thermal Inspection Procedure

1. DRIVE mode → Walk → Drive Spot within a few feet of inspection target
2. Optionally switch to SPOT CAM THERMAL view
3. **Add Action** → INSPECTIONS → **Thermal Inspection**
4. Aim PTZ camera at target, adjust body pose with YAW/ROLL/PITCH/HT sliders
5. Select **CONFIGURE**

### ROI (Region of Interest) and Threshold Settings

1. With AUTO ADJUST ON, fine-tune Spot Cam+IR view → **NEXT**
2. Drag on screen to define ROI area (tightly encompass the inspection target)
3. **+ Add Regions** to create additional ROIs
4. Enable **MAX ALARM THRESHOLD**: triggers anomaly when max temperature exceeded
5. **RELATIVE THRESHOLD** (optional): compares temperature difference between two ROIs
   - Example: Set to 10° → anomaly if hottest pixels in two regions differ by >10°
6. **NEXT** → Add name, Asset ID, metadata tags → **CREATE**

> Tip: Use one ROI for the asset (e.g., hot pipe) and another for ambient environment temperature → compare asset against environmental temperature changes over time.

### Viewing Thermal Data

- ≡ Menu > **DOWNLOAD DATA** → download to tablet
- Two images per inspection:
  - **Isotherm image**: Grayscale thermal image. Green box = normal, Red box = anomaly
  - **PTZ image**: Standard Spot Cam image

### Anomaly Detection

- ROI box turns red when threshold exceeded
- Blue pixels: colder than setting / Red pixels: hotter than setting

### Thermal Palette

Default: "Ironbow". Change: ≡ Menu > SETTINGS > SPOT CAM > **IR COLOR MAP PALETTE**

### Recording a 10-Point Thermal Mission

1. Within fiducial line-of-sight: AUTOWALK → RECORD
2. Name mission → START RECORDING
3. At each inspection point: Add Action → Thermal Inspection (repeat 10 times)
4. Return to starting fiducial → FINISH RECORDING
5. CONTINUE TO MISSION REPLAY to validate

### Thermal Missions in Orbit

- Edit inspection parameters
- Create, edit, manage Autowalk missions with thermal inspections
- View past results and trends over time
- Set up email alerts for threshold exceedances
- See real-time inspection results and follow missions in progress

---

## Orbit AI Visual Inspections (139734)

AI visual inspections allow Orbit to answer questions about industrial environments based on images collected by robots.

### What Are AI Visual Inspections?

An inspection type added to Orbit site maps. Answers image-based questions such as:
- "Is there a shovel?"
- "How many locks are there?"
- "What does the screen say?"
- "Is the floor wet?"

### Workflow

1. **Ask a Question**: In Orbit site map editor, select source inspection + craft a question
2. **Spot Captures Image**: On scheduled mission, Spot performs source inspection and captures image
3. **Orbit Analyzes**: Orbit uses AI model to analyze image and answer question
4. **Result Communicated**: Results via site map, inspection history, API/webhook integrations

> Important: AI Visual Inspections don't need to be added directly to a mission. Only the source inspection needs to be in the mission — the model analysis runs automatically every time a robot uploads a new capture.

> Multiple AI Visual Inspections can be created from the same source → ask many different questions about one captured image.

### AI Models

- Pre-trained vision-language models
- Multiple models can be active simultaneously
- Set a default model + change per individual action
- English-language prompts only

### Accuracy

- May not be 100% accurate → independently verify results before making decisions
- Output quality depends heavily on input quality (source images and questions)
- Improve output by adjusting source inspection parameters or prompt text

### Compatibility

- Orbit 5.0 and above
- Setup differs per model → see AI Visual Inspection Models

### Data Collection and Review

- AI Visual Inspections are performed by **Orbit**, not by robots
- Source inspection must be included in one or more missions for data collection
- Results: Orbit Inspections page, alert triggers, Orbit API

---

## Create Acoustic Inspections with Spot (200356)

Two acoustic inspection types using the Sorama L642 Acoustic Monitor payload: leak detection and mechanical inspection.

### Overview

- **Acoustic Leak Inspection**: Analyzes noise signatures from pipes to detect air and gas leaks
- **Acoustic Mechanical Inspection**: Analyzes trending noise levels of rotating machinery over time (e.g., bearing degradation)

### Prerequisites

- Spot with fully charged battery
- Sorama L642 Acoustic Monitor payload attached
- Spot tablet controller (paired)
- At least one fiducial
- Orbit (recommended, not required)

### Manual Acoustic Leak Inspection

1. DRIVE mode → Walk → Drive within 1 meter of asset (L642 facing asset)
2. **Add Action** → INSPECTIONS → **Acoustic Leak Inspection**
3. Adjust view with onscreen arrows — asset should fill the field of view
4. **CONFIGURE**
5. Draw ROI around entire asset (every possible leak area)
6. Leave DISTANCE set to Auto
7. Adjust **FREQUENCY FROM** and **FREQUENCY RANGE** (defaults suitable for most leaks)
8. **NEXT** → Add name, Asset ID, metadata → **CREATE**

### Manual Acoustic Mechanical Inspection

1. DRIVE mode → Walk → Drive within 1 meter of asset (L642 facing asset)
2. **Add Action** → INSPECTIONS → **Acoustic Mechanical Inspection**
3. Adjust view — asset should fill the field of view
4. **CONFIGURE**
5. Draw ROI tightly around inspection target
6. Leave DISTANCE set to Auto
7. Adjust **SPL THRESHOLD** (noise level triggering alert)
8. **NEXT** → Add name, Asset ID, metadata → **CREATE**

### Viewing Acoustic Data

- ≡ Menu > DOWNLOAD DATA → download to tablet
- Available files per inspection:
  - Acoustic image
  - Acoustic video
  - FFT plot (mechanical inspection only)
  - STFT plot (mechanical inspection only)
  - .sorx file (uploadable to Sorama Portal)

### Tips and Best Practices

**Leak detection:**
- Detection based primarily on flow rate and pressure, not gas type
- Periodic exhaust gases may interfere with inspections
- Background noise significantly impacts data and alert frequency
- Vacuum leaks detectable with sufficient flow

**Mechanical inspection:**
- Ultrasonic SPL increases over time for most rotational failures
- Collect baseline data over weeks/months before setting thresholds
- Orbit can calculate baselines automatically and detect changes over time (Change Detection Alerts)

### Acoustic Missions in Orbit

- Edit inspection parameters
- Create, edit, manage Autowalk missions with acoustic inspections
- Create new acoustic inspections from Site View reference images
- View past results and trends over time
- Set up email alerts for threshold exceedances or baseline trend changes

---

## Create an AI Visual Inspection (214127)

Step-by-step guide for creating AI visual inspections in Orbit's site map editor.

### Prerequisites

- Site map with at least one Spot Cam, body camera, or gripper camera inspection (as image source)
- Orbit admin access

### Configuration Procedure

1. Log in to Orbit as admin → Navigate to site map editor → **Missions and actions editor**
2. Select existing AI inspection or **Create AI Inspection**
3. Configure fields:
   - **Name**: Unique inspection name
   - **Input Inspection**: Select existing inspection as image source
   - **Action Metadata** (optional): Asset ID and metadata tags
   - **Model**: Select AI model (if multiple available)
   - **Image Region** (optional): Default analyzes full image. Select Custom Region → Edit to define bounding box
   - **Question**: Enter prompt for the AI model
   - **Answer**: Select response type ("Text" for open-ended)
   - **Alert When** (optional): Configure alert conditions
4. **Save**

### Testing

Strongly recommended to test with diverse images reflecting changing site conditions.

1. In site map editor, select AI inspection → TEST CONFIGURATION
2. **Add Test Case** → Choose Recorded Images (best option)
3. Select images, expand time range if needed
4. **Run Tests** → Check results
5. Adjust prompt/configuration and re-test until satisfied

### Best Practices

Follow model-specific practices in AI Visual Inspection Models article.

---

## AI Visual Inspection Models (214125)

Available vision-language models for Orbit AI Visual Inspections.

### Available Models

| Model | Type | Hosting | Data Privacy |
|-------|------|---------|-------------|
| **AIVI-Learning** | Cloud-hosted multi-model system (generalist + expert) | Boston Dynamics servers | Requires data sharing opt-in |
| **2024 AIVI Model** | Pre-trained generalist model | Local (Site Hub/VM) or cloud | Data stays private unless opted in |

### AIVI-Learning

- Cloud-hosted, evolves over time with new training data
- Includes "expert" models for specific use cases
- Requires Orbit enrollment with Boston Dynamics
- Activation: Settings > Models → Locate AIVI-Learning → Activate

**Expert Models:**
- **Sight Glass**: Detects fluid levels in transparent windows/tubes/bulbs

**Limitations:**
- Expert models trained on specific sites → performance may vary elsewhere
- Performance expected to improve over time

**Tips:**
- Prompts must include specific phrases to route to expert models (e.g., "sight glass")

### 2024 AIVI Model

- Pre-trained generalist model, released 2024
- Installable as Orbit extension on Site Hub/VM
- Included with new cloud Orbit instances
- Requires GPU for Site Hub/VM installations

**Installation (Site Hub/VM):**
1. Download "VQA Worker" and "VQA Worker Model Cache" (.spx files) from Spot Downloads
2. Orbit admin → Settings > Extensions
3. Upload vqa_worker_model_cache first, then vqa_worker
4. vqa_worker starts automatically

**Recommended Inspection Types:**
- Safety: Open/closed doors, fire extinguishers, liquid/debris spills, safety station counts, indicator lights
- 5S: Board tool totals, signage posted, trash full
- Pallet: Objects on pallets, pallets in bays
- OCR: Digital gauges, text on screens

**Known Limitations:**
- Analog gauges: Unreliable reading
- Complex counting: Objects without discrete visual boundaries
- Levers/pulls/dials: State detection unreliable unless carefully worded with ROI

**Tips for Success:**
- Ask discrete yes/no questions about object presence
- Use regions of interest to add specificity or define "nominal" state
- Use polygon editing to match ROI to specific image features
- Avoid prompts about relationships or object state — use ROI instead
- For OCR: Ensure clear, readable view; avoid glare; position camera close; use ROI
- Run test case asking "what do you see?" to discover effective keywords

**Troubleshooting:**
- vqa_worker restarting continuously → Delete and re-upload vqa_worker_model_cache, then restart
- Create AI Inspection button does nothing → Restart or reinstall vqa_worker extension

---

## Integrating Computer Vision (CV) Models with Spot (221803)

CV Actions capture images and run them through custom computer vision models (e.g., fire extinguisher detection).

### Implementation via Spot API

- Spot SDK includes example CV model: fire extinguisher detection using Spot CAM + PTZ
- Any custom object model can be implemented
- Requires Data Acquisition (DAQ) plugin to save images and results
- See Spot SDK: Network Compute Bridge (NCB) Example

### Creating a CV Action

CV Actions encapsulate:
- PTZ camera aiming (in Autowalk)
- Image capture
- Sending image to CV model server for analysis
- Receiving processed data
- Updating tablet display with recognition status

**Procedure (on Spot tablet):**
1. ≡ Menu > Actions → **Create New Action**
2. Select NCB server template (e.g., Fire Extinguisher Server)
3. **Create** → Enter name, configure options → **SAVE**

### CV Action Configuration Options

| Option | Description |
|--------|------------|
| Image source | Spot Cam PTZ or body camera |
| Processing model | Select CV model for image processing. "Choose later" to set during Autowalk or teleop |
| Base data sources | Data to capture (Image, Object in image, etc.) |
| Use Custom Detection to Point Sensor | Use custom model for sensor pointing instead of default scene alignment |

### CV Action During Teleoperation

1. Drive robot into position with target in sight
2. **Add Action** → Select CV Model Action
3. Aim PTZ camera (zoom 1x–30x, best at ≤10x)
4. **NEXT** → Select processing model → **NEXT**
5. View results: Bounding box around detected object
6. **REFRESH** to reprocess, **BACK** to re-aim, **CREATE** to save

Data stored: tablet Internal Memory > Documents > bosdyn > downloaded_data

### CV Action in Autowalk

- Add like any other Action during Autowalk recording
- Data from Autowalk CV actions automatically uploaded to Orbit (if connected)
- Also stored on tablet: Internal Memory > Documents > bosdyn > autowalk > [mission_name].walk
