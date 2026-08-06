# Dual-thumb support for `smoothly-input-range`

Date: 2026-08-04

## Goal

Extend the existing `smoothly-input-range` component so it can render as either a
single-thumb slider (current behavior, unchanged) or a dual-thumb slider where the
user sets a start and an end bound. The change must be fully backwards compatible.

## Constraints & decisions

- **Modify the existing component**, not a new one.
- A single native `<input type="range">` supports only one thumb, so dual mode uses
  **two overlaid native range inputs** (keeps native keyboard/touch/accessibility and
  matches the component's existing native-input approach).
- **Backwards compatible value shape:** `value: number | { start: number; end: number }`.
  Single mode keeps a plain `number`; dual mode uses the object.
- Dual mode exposes **two editable numeric fields** (start + end), mirroring the single
  mode's editable numeric field.
- Thumbs **hard-stop** at each other (start ≤ end enforced), with **no forced minimum
  gap** (start may equal end).
- Value/emit shape lives under the **single existing `name`** in both modes (dual emits
  `{ start, end }` under `this.name`).

## Design

### 1. Activation & API
- New prop `@Prop() dual = false`. When `false`, behavior is identical to today.
- `value` type widens to `number | { start: number; end: number }`.
- Add small internal helpers to read/write the "start" and "end" bounds so render and
  value logic aren't littered with type guards.

### 2. Rendering & layout
- Single mode: one native `<input type="range">`, exactly as today.
- Dual mode: **two** native `<input type="range">` overlaid (both spanning full
  `min`–`max`), plus a colored fill `<div>` spanning start→end.
- Editable numeric field: single mode keeps one wrapped `smoothly-input`; dual mode
  renders a **start** field and an **end** field.
- Min/max display labels remain on the ends in both modes.
- `outputSide` / label layout carries over; the two fields occupy the same structural
  slots as the single field, following the existing `output-side-*` CSS structure.

### 3. Value flow & clamping
- A `setRange(part, value)` path handles dual mode: clamp to `min`/`max`, then enforce
  start ≤ end (a thumb dragged past the other hard-stops at the other's current value).
  Single mode keeps the existing `setValue`.
- `valueChanged` watcher handles both shapes: rounds to `step` decimals per bound,
  computes `isDifferentFromInitial` over the whole shape, sets `defined` when the
  bound(s) are numbers.
- Emits stay under `this.name`: single emits `number`, dual emits `{ start, end }`.
  `smoothlyUserInput` emits the same shape.

### 4. Form-layer methods
- `getValue`, `clear`, `reset`, `setInitialValue` handle both shapes.
- `clear` → `undefined`; `reset` → `initialValue` (whatever shape was captured).

### 5. Styling & testing
- CSS: overlaid inputs get transparent track backgrounds and `pointer-events`
  management (thumbs `auto`, tracks `none`) so each thumb stays grabbable. The fill
  `<div>` is positioned with inline `left`/`right` percentages computed in JS from
  start/end (inline styles rather than fighting Stencil scoped CSS). Reuse existing
  `part="range"` styling; add a `part` for the second thumb and the fill.
- Testing: inspect existing test coverage for the component. Add coverage for
  single-mode-unchanged, dual clamping (can't-cross), typing into start/end fields, and
  emit shape. If no test harness exists for these components, flag it rather than invent
  one.

## Out of scope
- Configurable minimum gap between thumbs.
- Emitting two separately-named form fields in dual mode.
- Non-native / fully custom slider implementation.
