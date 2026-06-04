# Agent Workflows

SnapNote packets are designed to be easy for coding agents and issue tools to consume.

The format keeps three things together:

- where the human pointed
- what the human asked for
- what runtime context may help an agent act on it

## Repository Workflow

A project can store packets in a local `.snapnotes/` directory:

```text
.snapnotes/
  2026-06-04-sort-toggle.snapnote.json
  images/
    2026-06-04-sort-toggle.png
```

For this workflow, use `source.imageRef` to point at the local screenshot file.

An agent can read the packet, inspect the target region, use the note as the request, and use `context` to find the relevant route, element, or error.

## GitHub Issue Export

A SnapNote packet can be exported to a GitHub issue.

Suggested mapping:

| SnapNote Field | GitHub Field |
| --- | --- |
| `note.text` | Issue body |
| `note.intent` | Label or section in body |
| `target` | Body metadata |
| `source.image` or `source.imageRef` | Attached image or linked image |
| `context.page.url` | Body metadata |
| `context.selectedElement` | Body metadata |
| `agent.priority` | Label |
| `issue.labels` | Labels |

After export, write the GitHub issue details back to `issue`.

## Linear Issue Export

A SnapNote packet can be exported to a Linear issue.

Suggested mapping:

| SnapNote Field | Linear Field |
| --- | --- |
| `note.text` | Issue description |
| `note.intent` | Label or issue metadata |
| `source.image` or `source.imageRef` | Attachment or linked image |
| `context.page.route` | Description metadata |
| `agent.priority` | Priority |
| `issue.labels` | Labels |

After export, write the Linear issue details back to `issue`.

## Browser Extension Capture

A browser extension can create a packet by collecting:

- screenshot dimensions and image bytes
- selected rectangle in screenshot pixels
- note text
- current URL, route, and title
- viewport size
- selected DOM element metadata
- recent console errors
- relevant network hints

The extension should avoid collecting sensitive page content unless the user explicitly confirms the capture.

## npm Feedback Widget

An npm widget can create SnapNote packets inside a web app.

Useful widget behavior:

- capture the current visual state
- let the user drag a target rectangle
- accept typed, voice, or transcribed notes
- include app environment and version
- include route and selected element metadata when available
- save locally, send to an API, or export as a file

This repository does not provide the widget. It only defines the packet format that a widget could emit.

## Agent Handling

Agents should treat the screenshot and target as evidence, not as the only source of truth.

A practical agent flow:

1. Validate the packet against the JSON Schema.
2. Read `note.text` and `note.intent`.
3. Inspect the target region in the screenshot.
4. Use `context.page`, `context.selectedElement`, and app metadata to locate the likely code path.
5. Use `agent.instructions` as task-specific guidance.
6. Preserve or update `agent.status` and `issue` metadata when writing results.

Agents should not assume that a selected DOM element is always the implementation source. It is a hint.
