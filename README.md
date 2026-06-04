# SnapNote Spec

SnapNote is an open JSON format for screenshot-bound software feedback and agent-ready UI change requests.

A SnapNote packet captures:

- the screenshot or visual source
- the selected target region within that source
- the human note or request
- optional app, page, and environment context
- optional agent and issue-tracker metadata

The core idea is simple: point at the UI, describe the change, give agents structured context.

## Why This Exists

UI feedback often loses the exact location, visual state, and runtime context that made the note useful. A screenshot alone is not enough. A text issue alone is not enough.

SnapNote defines a small packet format that keeps the visual target, the human request, and useful machine-readable context together.

The goal of this repository is to define the format first. It does not build a product, browser extension, widget, or issue-tracker integration yet.

## Status

Current draft: `0.1.0`

The canonical schema is in [schema/snapnote.schema.json](schema/snapnote.schema.json).

Format details are in [docs/format.md](docs/format.md).

Agent workflow notes are in [docs/agent-workflows.md](docs/agent-workflows.md).

## Packet Shape

```json
{
  "schemaVersion": "0.1.0",
  "kind": "snapnote",
  "id": "92a5e77a-212e-4152-842f-e9223fc34f5a",
  "createdAt": "2026-06-04T01:40:38.849845Z",
  "source": {
    "type": "screenshot",
    "width": 361,
    "height": 218
  },
  "target": {
    "type": "rect",
    "x": 301,
    "y": 9,
    "width": 38,
    "height": 36,
    "coordinateSpace": "sourceImagePixels"
  },
  "note": {
    "text": "Change this icon to switch between ascending and descending sort.",
    "inputMode": "typed",
    "intent": "change-request"
  }
}
```

See [examples/basic.snapnote.json](examples/basic.snapnote.json) and [examples/browser-context.snapnote.json](examples/browser-context.snapnote.json).

## Example Use Cases

- Save packets into `.snapnotes/` in a repository.
- Export packets to GitHub issues.
- Export packets to Linear issues.
- Capture packets from a browser extension.
- Capture packets from an npm feedback widget.

## Non-Goals

- SnapNote is not a full bug tracker.
- SnapNote is not session replay.
- SnapNote is not a design tool.
- SnapNote is not tied to one agent or issue tracker.

## Repository Layout

```text
README.md
docs/
  agent-workflows.md
  format.md
examples/
  basic.snapnote.json
  browser-context.snapnote.json
schema/
  snapnote.schema.json
packages/
  snapnote-types/
    package.json
    src/index.ts
    tsconfig.json
```

## TypeScript Types

The `packages/snapnote-types` package contains TypeScript types that match the v0.1.0 JSON Schema.

The package is private for now. It is present so implementers can test against a shared type surface before any publishing decision is made.
