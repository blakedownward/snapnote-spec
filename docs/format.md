# SnapNote Format v0.1.0

SnapNote is a JSON packet format for screenshot-bound feedback and UI change requests.

The canonical packet kind is `snapnote`. The canonical schema version in this draft is `0.1.0`.

## Top-Level Packet

| Field | Required | Description |
| --- | --- | --- |
| `schemaVersion` | yes | Format version. For this draft, use `0.1.0`. |
| `kind` | yes | Fixed string: `snapnote`. |
| `id` | yes | UUID for this packet. |
| `createdAt` | yes | ISO 8601 date-time string. |
| `source` | yes | Screenshot or visual source metadata. |
| `target` | yes | Region in the source that the note points to. |
| `note` | yes | Human note or request. |
| `context` | no | App, page, browser, and runtime context. |
| `agent` | no | Agent workflow metadata. |
| `issue` | no | Issue-tracker metadata. |

## Source

The source describes the visual surface that was annotated.

```json
{
  "type": "screenshot",
  "width": 361,
  "height": 218,
  "image": {
    "mimeType": "image/png",
    "encoding": "base64",
    "data": "..."
  }
}
```

Fields:

| Field | Required | Description |
| --- | --- | --- |
| `type` | yes | Fixed string: `screenshot`. |
| `width` | yes | Source image width in pixels. |
| `height` | yes | Source image height in pixels. |
| `image` | no | Embedded image bytes. |
| `imageRef` | no | External file or URL reference for the source image. |

`image` contains:

| Field | Required | Description |
| --- | --- | --- |
| `mimeType` | yes | Image MIME type, such as `image/png`. |
| `encoding` | yes | Fixed string: `base64`. |
| `data` | yes | Base64 encoded image data. |

`imageRef` contains:

| Field | Required | Description |
| --- | --- | --- |
| `type` | yes | `file` or `url`. |
| `uri` | yes | Relative file path, absolute file URI, or web URL. |
| `mimeType` | no | Image MIME type if known. |
| `sha256` | no | Optional SHA-256 digest for content verification. |

A portable packet should include either `source.image` or `source.imageRef`.

## Target

The target describes the selected region in the source.

```json
{
  "type": "rect",
  "x": 301,
  "y": 9,
  "width": 38,
  "height": 36,
  "coordinateSpace": "sourceImagePixels"
}
```

Fields:

| Field | Required | Description |
| --- | --- | --- |
| `type` | yes | Fixed string: `rect`. |
| `x` | yes | Left edge in source image pixels. |
| `y` | yes | Top edge in source image pixels. |
| `width` | yes | Region width in source image pixels. |
| `height` | yes | Region height in source image pixels. |
| `coordinateSpace` | yes | Fixed string: `sourceImagePixels`. |

Coordinates are measured from the top-left corner of the source image.

## Note

The note captures the human request.

```json
{
  "text": "Change this icon to switch between ascending and descending sort.",
  "inputMode": "typed",
  "intent": "change-request"
}
```

Fields:

| Field | Required | Description |
| --- | --- | --- |
| `text` | yes | Human note text. |
| `inputMode` | yes | `typed`, `voice`, or `transcribed`. |
| `intent` | no | Optional request classifier. The v0.1.0 schema accepts `bug`, `change-request`, `feature-request`, `question`, or `polish`. |

When the producer can classify the request, `note.intent` SHOULD be included.

Recommended intent values for producer classification:

- `visual-change`
- `behavior-change`
- `copy-change`
- `layout-issue`
- `bug`
- `question`
- `polish`
- `unknown`

This guidance does not make `note.intent` required and does not change the v0.1.0 schema. Strict v0.1.0 packets should still use one of the schema values until a future revision widens `note.intent`.

## Context

The context object is intentionally flexible. It can carry browser, app, page, DOM, console, and network metadata.

Recommended fields:

| Field | Guidance | Description |
| --- | --- | --- |
| `app.name` | MAY | Application name. |
| `app.environment` | SHOULD | Environment name, such as `development`, `staging`, or `production`. |
| `app.version` | SHOULD | App version or build identifier. |
| `page.route` | SHOULD when known | App route, such as `/projects/:projectId/notes`. |
| `page.url` | SHOULD for browser captures when safe | Full browser URL. Avoid secrets, tokens, private IDs, or sensitive query parameters. |
| `page.title` | MAY | Page title. |
| `viewport.width` | SHOULD for layout or responsive issues | Viewport width in CSS pixels. |
| `viewport.height` | SHOULD for layout or responsive issues | Viewport height in CSS pixels. |
| `viewport.devicePixelRatio` | SHOULD for layout or responsive issues | Device pixel ratio. |
| `selectedElement` | SHOULD when available | Metadata for the clicked or selected DOM element. |
| `consoleErrors` | MAY | Recent console errors. |
| `networkHints` | MAY | Relevant request or response hints. |

`context.page.route` is useful even outside browser captures when the producer knows the route or screen identifier. Browser producers SHOULD also include `context.page.url` when it is safe to share. `context.viewport` SHOULD be included for layout, spacing, clipping, overflow, breakpoint, or responsive issues.

`context.selectedElement` SHOULD be included when the producer can identify the clicked or selected DOM element. Producers should avoid collecting sensitive page content unless the user explicitly confirms the capture.

`selectedElement` can include:

- `tag`
- `id`
- `classes`
- `text`
- `ariaLabel`
- `domPath`
- `boundingClientRect`

`boundingClientRect` follows browser `DOMRect` naming:

- `x`
- `y`
- `width`
- `height`
- `top`
- `right`
- `bottom`
- `left`

Screenshot plus `target` gives agents a useful visual anchor. The strongest SnapNote packets combine human intent, visual target, route or page context, selected element metadata, and environment details.

## Agent Metadata

The agent object carries workflow state for coding agents.

```json
{
  "status": "open",
  "priority": "medium",
  "instructions": "Keep the existing toolbar spacing."
}
```

Fields:

| Field | Required | Description |
| --- | --- | --- |
| `status` | yes | `open`, `in-progress`, `done`, or `wont-do`. |
| `priority` | no | `low`, `medium`, or `high`. |
| `instructions` | no | Extra agent-facing instructions. |

## Issue Metadata

The issue object links a SnapNote packet to an issue tracker.

```json
{
  "provider": "github",
  "externalId": "42",
  "externalUrl": "https://github.com/example/repo/issues/42",
  "branch": "snapnote/sort-toggle-icon",
  "labels": ["ui", "snapnote"]
}
```

Fields:

| Field | Required | Description |
| --- | --- | --- |
| `provider` | yes | `github`, `linear`, or `local`. |
| `externalId` | no | Provider-specific issue ID. |
| `externalUrl` | no | Issue URL. |
| `branch` | no | Suggested or related branch name. |
| `labels` | no | Issue labels. |

## Extension Policy

The v0.1.0 schema keeps the top-level packet strict so readers can rely on a stable core.

The `context` object and its nested browser/app metadata objects allow additional properties. Use this for capture-specific data that does not belong in the core packet yet.
