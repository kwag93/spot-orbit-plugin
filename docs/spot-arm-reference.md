# Spot Arm Reference

Reference documentation for Spot Arm operation, grasping, carrying/dragging, constrained manipulation, door opening, Arm Pointing, and Autowalk behavior.

Sources:
- https://support.bostondynamics.com/s/article/Manipulation-Mode-151689
- https://support.bostondynamics.com/s/article/Manually-Operate-Spot-Arm-151692
- https://support.bostondynamics.com/s/article/Grasp-Objects-with-Spot-Arm-151688
- https://support.bostondynamics.com/s/article/Carry-and-Drag-Objects-with-Spot-Arm-151685
- https://support.bostondynamics.com/s/article/Constrained-Manipulation-with-Spot-Arm-151686
- https://support.bostondynamics.com/s/article/Open-Doors-with-Spot-Arm-151691
- https://support.bostondynamics.com/s/article/How-Spot-Arm-Moves-151690
- https://support.bostondynamics.com/s/article/Arm-Pointing-151684
- https://support.bostondynamics.com/s/article/Spot-Arm-Behavior-During-Autowalk-Missions-151693
- https://support.bostondynamics.com/s/article/Joystick-Controls-and-Button-Combinations-151683

---

## Manipulation Mode

Manipulation Mode is a set of features in the Spot App for manually controlling the Spot Arm and interacting with objects.

### Prerequisites

- Spot Tablet Controller must be connected to a robot equipped with a Spot Arm
- Spot Tablet Controller Pro required for full control
- Some controls may be hidden depending on Spot App Profiles settings

### Entering/Exiting

- Enter: Spot App → Modes dropdown → select **MANIP**
- Exit: select **EXIT MANIP**

### Stopping the Robot (Stop)

- Select **STOP**: pauses Spot, Arm holds its current position
- Methods to disable motors:
  - Cut Motor Power via physical button shortcut
  - Select **STOP** twice quickly (first → pause, second → CUT POWER)

> ⚠️ When motors are disabled: Spot may lose balance and fall on inclines. Arm joints move freely and fold.

### Arm Reset

Actions performed on reset:
- Cancels the current task
- Stows the Arm
- Releases Reach
- Opens the Manipulation Menu

Reset methods: press the joystick or select **↻ Reset** → **Confirm Reset**

> ⚠️ If Item Stowable is false, the reset releases the grasp before stowing.

### Manipulation Menu

| Category | Option | Description |
|---------|------|------|
| **Grasp Behaviors** | Grasp Wizard | Semi-automatic grasp with specified approach angle, gripper position/orientation |
| | Pick Up Object | Semi-automatic grasp for movable objects |
| | Open Door | Semi-automatic approach and door opening |
| **Post Grasp Actions** | Carry | Carry the grasped object while moving |
| | Drag | Pull an object from one location to another |
| | Twist, Turn, Pull | Manipulate objects along constrained axes/ranges (switches, levers, valves, etc.) |
| | Open Grasped Door | Open a door that is already grasped |
| **Drive Behaviors** | Robot Camera | Switch to Body camera view |
| | Operate Arm | Manual Arm control |
| | Gripper Camera | Gripper camera view + manual Arm control |

---

## Manually Operate Spot Arm

When Operate Arm is selected:
1. Spot moves to the Stand pose
2. Switches to split-screen view (for enhanced situational awareness)
3. Reach is activated
4. Joystick switches to Arm control mode

### Manual Control Items

| Control | Description |
|--------|------|
| Cameras dropdown | Select camera view |
| Nudge buttons | Fine-tune gripper position: up/down/left/right, clockwise/counterclockwise rotation, forward/backward |
| Gaze target | Touch the screen to set a gripper camera target (GRIPPER CAM view only) |
| Gaze controls | FREEZE GAZE / DEFAULT GAZE / CLEAR TARGET |
| Reach & Follow | Reach: operate Arm while Spot is stationary / Follow: Spot slowly follows the gripper trajectory |
| Speed slider | SLOW / MED / FAST |

### Manipulator Controls

| Setting | Description |
|------|------|
| Arm poses | Move to Stow / Carry / Ready position |
| Lock gripper | Lock gripper position relative to Body or World |
| Force Limiter | Prevents the Arm from applying large forces to the Body (default: ON) |
| Body Yaw Assist | Extends Arm reach by rotating the Spot Body |
| Body Height Assist | Extends Arm reach by adjusting Spot Body height/pitch |
| Item Stowable | Default ON. When OFF, releases grasp before stowing |

### Force Limiter Details

- Default: ON (prevents Spot from tipping over when Arm collides)
- When OFF: high forces may be applied when the Arm contacts objects
- Force Limiter may interfere when carrying heavy objects
- Requests to disable it during Constrained Manipulation/Open Door are ignored
- Not a safety feature — cannot prevent environmental damage

### Gripper Controls

| Setting | Description |
|------|------|
| Gripper angle | Slider from 0% (closed) to 100% (open) |
| Gripper torque | Adjust the force applied during grasping |
| Gripper status | Toggle Open/Close, set holding/empty state |

> ⚠️ Unpredictable behavior may occur if the gripper status does not match the actual state

---

## Grasp Objects with Spot Arm

Grasping is the starting point for most Manipulation tasks.

**Optimal conditions:** Object is positioned in front of Spot, below Body height

### Grasp Wizard

Semi-automatic grasp with specified approach angle, gripper position, and gripper orientation:

1. Manipulation Menu → select **Grasp Wizard**
2. Touch-drag to select the target object
3. Adjust approach angle, gripper target, and orientation → Next
4. Use the Grasp location slider to adjust the gripper contact point
5. Use the Distance slider to bring the gripper closer
6. Select **Auto Grasp** when the button appears, or manually Close Gripper
7. Confirm grasp success → **CONTINUE, GRASP SUCCEEDED** / or **RESET, GRASP FAILED** on failure

### Pick Up Object

Semi-automatic grasp optimized for small movable objects:

1. Manipulation Menu → select **Pick Up Object**
2. Touch the object in the camera view
3. Adjust the Grasp location slider + select orientation
4. Spot Arm automatically approaches and attempts to grasp
5. Confirm success or failure

> If Pick Up Object repeatedly fails → Grasp Wizard is recommended

### Next Steps After Grasping

- **Carry**: carry the object while moving
- **Operate Arm**: manually move/place the object

---

## Carry and Drag Objects with Spot Arm

### Carry

Carry an object while driving Spot:

1. Perform a successful grasp
2. Manipulation Menu → select **Carry**
3. Arm moves to the Carry position
4. Drive Spot and use Arm controls to place the object

**Notes:**
- Spot's obstacle avoidance does not apply to the Arm or carried objects
- Balance instability increases with objects over 5 kg or when extended horizontally
- Small Spot rotations can cause large Arm rotations when the Arm is extended forward

### Drag

Pull an object from one location to another (pull only — pushing is not supported):

1. Perform a successful grasp (Grasp Wizard or manual control)
2. Manipulation Menu → select **Drag**
3. Drive Spot backward to drag the object
4. Main view: rear camera / inset: front camera

**Notes:**
- Very high forces may be applied during dragging
- Initial grasp quality is critical to success
- If grasp loss is detected, the Arm stops; Spot continues to respond
- Do not use on fragile or sensitive equipment

---

## Constrained Manipulation with Spot Arm

Manipulate objects along constrained axes/ranges — switches, levers, cranks, valves, wheels, cabinets, drawers, etc.

> ⚠️ Very high forces may be applied during constrained manipulation. Initial grasp alignment is critical.

### Supported Actions

| Action | Description |
|------|------|
| **Turn Crank** | Rotate a crank with a freely rotating handle |
| **Turn Wheel** | Rotate a wheel by gripping the rim, or rotate a fixed-handle crank |
| **Turn Ball Valve** | Rotate a ball valve with a lever arm (suitable for levers 30 cm or shorter) |
| **Turn Knob** | Rotate a knob, or a ball valve without a lever |
| **Open Drawer** | Open/close a drawer along a linear axis |
| **Open Cabinet** | Open/close a cabinet door around a hinge |
| **Pull Lever** | Rotate a lever around a pivot point (suitable for levers 30 cm or longer) |

### Procedure

1. Perform a successful grasp
2. Manipulation Menu → select **Twist, Turn, Pull**
3. Select an action → Next
4. (Additional settings per action)
   - Turn Crank: select starting gripper position/orientation
   - Turn Ball Valve: select left/right configuration
5. Adjust presets:
   - **Torque**: LOW (31.5 N) / MED (63.0 N) / HIGH (80.0 N), ADVANCED up to 118 N
   - **Enable Robot Locomotion**: allow Spot Body movement (default: OFF)
   - **Direction**: apply force along X/Y/Z axis

> Enabling Robot Locomotion may reduce the total force the Arm can apply. Automatically disabled when Torque is set to HIGH.

### Notes

- Constrained manipulation is also possible via direct manual control, but using presets is recommended
- Presets automate force limiting, joint adjustment, and Body stability

---

## Open Doors with Spot Arm

Spot Arm can open doors in typical industrial facilities and buildings.

### Door Opening Methods

| Method | Description | Manual | Autowalk |
|------|------|------|---------|
| Semi-automatic (Open Door) | Set handle location/type, hinge position, swing direction → Spot automatically approaches, grasps, opens the door, and passes through | ✓ | ✓ |
| Manual grasp (Open Grasped Door) | Manually grasp the handle, then set hinge/swing direction → Spot opens the door and passes through | ✓ | ✕ |

### Compatible Door Specifications

| Property | Requirement |
|------|---------|
| Force required to open | Opening: < 70 N, Hold 45–90 degrees: < 40 N |
| Supported mechanisms | Rotating handles (knob, lever), flat push (push plate, touch bar) |
| Door width | Minimum 76 cm ~ Maximum 101 cm |
| Approach area | Pull side 230 cm, Push side 180 cm or more. No stairs within approach area on either side |

### Limitations

| Limitation | Description | Workaround |
|------|------|----------|
| One-way doors | Not supported in Autowalk | Retrofit to open in both directions |
| Transparent materials (glass) | Gripper depth sensor cannot detect | Replace or remove the door |
| Black/dark door or handle | IR-absorbing materials cannot be detected | Attach reflective material (30×30 cm) around the handle |
| Slippery handle | Gripper slip | Clean the handle or apply a less slippery cover |
| Door without spring | Spot does not close the door | Install a spring/door closer |
| Raised mount above ground | Front legs cannot block the door | Reinstall at ground level or add a platform |

### Open Door (Semi-automatic) Procedure

1. Approach within 1.5 m of the door (from the front, aligned with the door center)
2. Manipulation Menu → **Open Door**
3. Select the handle/push point
   - Knob/lever: select the center of the handle
   - Push plate: ~7.5 cm from the latch-side edge
   - Touch bar: ~7.5 cm from the latch-side end
4. Set hinge position, handle type, and swing type → **Open Door**
5. Wait until Spot has fully passed through

### Open Grasped Door Procedure

1. Approach within 1.5 m of the door
2. Grasp the handle using Grasp Wizard or manual control
   - Horizontal handle: lower jaw facing downward
   - Round knob: lower jaw facing downward
   - Vertical fixed handle: any orientation
3. Manipulation Menu → **Open Grasped Door**
4. Set hinge position, handle type (including FIXED), and swing type

### Recording Door Opening in Autowalk

1. Start recording an Autowalk mission
2. Approach within 1.5 m of the door
3. **Add Action** → **Open Door**
4. Select handle/push point and configure settings
5. Wait for Spot to pass through and the door to fully close
6. Select handle/push point on the opposite side and configure settings → **Save door settings**

> Double door: treat as two single doors. Recommended to record a loop passing through both sides for robustness.

---

## How Spot Arm Moves

Description of Spot Arm workspace, joint presets, and safety limits.

### Workspace Dimensions

| Dimension | Description | Value |
|------|------|-----|
| R | Maximum Arm extension | 985 mm (gripper tip) |
| H1 | Height at maximum horizontal extension | 1110 mm (±160 mm) |
| D1 | Distance beyond Spot footprint at maximum horizontal extension | 850 mm |
| H2 | Height at 45° configuration | 1480 mm (±160 mm) |
| D2 | Distance beyond footprint at 45° configuration | 580 mm |
| H3 | Height at vertical configuration | 1560 mm (±160 mm) |
| D3 | Distance beyond footprint at vertical configuration | Maximum 20 mm |

### Arm Positions

| Position | Description |
|------|------|
| **Stowed** | Shoulder/elbow fully folded. Centered above Spot, elbow rearward, gripper forward. Default position when not in use |
| **Ready** | Extended forward, gripper pointing ahead. Jaw open to provide gripper camera field of view |
| **Carry** | Extended forward, gripper positioned slightly above and in front of Spot. Gripper facing downward |

### Torque Limitation

- Software torque limits (see Spot Arm Specifications)
- Mechanical clutch mechanism (except gripper pivot)
  - SH0, SH1, EL0: friction clutch
  - EL1, WR0, WR1: ball detent clutch
- When maximum torque is exceeded, joints slip to the hard stop
- Additional software Force Limiter prevents Body balance loss (not a safety feature)

### Velocity Limitation

| Setting | Maximum Speed |
|------|----------|
| Fast | 0.75 m/s |
| Med (default) | 0.50 m/s |
| Slow | 0.25 m/s |

> Speed settings take effect immediately. Actual speed may differ from the set value due to joint motion, stability adjustments, etc.

---

## Arm Pointing

Action that uses the Spot Arm to aim the camera/sensor at a target in the environment. Primarily used for taking photos with the gripper's built-in camera.

### Suitable Use Cases

- Spot Arm-equipped robots without Spot Cam+
- Environments where direct line of sight to inspection targets is not possible with other cameras
- Environments where the Body cannot be moved close enough to the inspection target

### Key Controls

| Control | Description |
|--------|------|
| Camera Settings | Resolution, auto exposure, auto focus, gain, brightness, contrast, saturation, HDR |
| Nudge buttons | Fine-tune gripper position (up/down/left/right, rotation, forward/backward) |
| Flashlight | Adjust gripper flashlight brightness |
| Adjust body toward gripper | Move Spot Body toward the gripper (gripper position fixed) |
| Force Stow Override | Force Arm stow/repositioning between multiple captures at the same location (Autowalk only) |
| Use Autofocus in Playback | Force autofocus during playback (Autowalk only) |
| Playback speed | Adjust Arm movement speed during playback (Autowalk only) |
| Hold to Preview | Preview Arm placement during mission playback (Autowalk only) |
| Body height assist | Allow Spot Body pitch/hip height adjustment (default: ON) |

### Manual Operation Procedure

1. Manipulation Mode → **Add Action** → **Arm Pointing**
2. Aim the Arm at the target using joystick/on-screen controls → **CONFIGURE**
3. Select sensor mode → **CREATE** (save immediately) or **NEXT** (add metadata)
4. **ADD ANOTHER** (add more inspections) or **ALL DONE** (finish)

---

## Spot Arm Behavior During Autowalk Missions

Actions such as Open Door and Arm Pointing recorded in an Autowalk mission are performed automatically during mission playback. General Arm commands entered during mission recording (placement, manipulation, stowing) are not reproduced — only recorded Actions are performed.

### Door Opening (During Mission Playback)

- Door passage segments are shown as dashed white lines on the Autowalk map
- If the door is already open, Spot passes through directly
- If the path is blocked, Spot can detour through the door (in either direction)

### Arm Pointing (During Mission Playback)

Playback sequence:
1. Move to the recorded waypoint
2. Reproduce the recorded gripper camera settings (including flashlight)
3. Reposition feet into a wide stance
4. Position the Arm at the recorded inspection point (may include Body position adjustment)
5. Capture data
6. Reset camera settings
7. Perform additional captures at the same location
8. Stow the Arm and continue the mission

> ⚠️ During Arm Pointing playback, the final pose is reproduced but the 3D path through space is not identical to the recording. Risk of collision in confined spaces.

---

## Joystick Controls and Button Combinations

Control Spot and Spot Arm using analog controls and buttons on the Spot Tablet Controller Pro. Arm controls are only active in Manipulation Mode.

### Button Combinations

| Command | Description | Buttons |
|------|------|------|
| Cut Power | Fully disable motors | LB + RB + (specific button) |
| Deploy Arm | Move to Ready position | RB + (specific button) |
| Stow Arm | Move to Stowed position | RB + (specific button) |
| Reset Arm | Stow + release Reach + open Menu | (press joystick) |
| Grasp / Release | Open/close gripper | RB + (specific button) |
| Look at Ground | Forward pose, gripper camera facing ground | RB + (specific button) |
| Reach | Spot stops, joystick drives Arm | (specific button) |
| Sit | Lower Body, stow Arm | (specific button) |
| Walk | Spot stands, joystick drives Spot | (specific button) |
| Gripper Fixed in World | Lock gripper spatial position while moving | LB + (specific button) |
| Gripper Fixed in Body | Maintain Arm configuration relative to Body while moving | LB + (specific button) |
| Reset Arm Orientation | Align wrist-elbow, level gripper | LB + (specific button) |

### Joystick Mapping

| Joystick | Function |
|---------|------|
| Left X axis | Rotate gripper around shoulder joint |
| Left Y axis | Gripper forward/backward |
| Right Y axis | Gripper up/down |
| LB + Left X axis | Adjust gripper Yaw |
| LB + Left Y axis | Adjust gripper Pitch |
| LB + Right X axis | Adjust gripper Roll |
