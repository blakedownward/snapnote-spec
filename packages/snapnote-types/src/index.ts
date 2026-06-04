export type SnapNoteSchemaVersion = "0.1.0";

export type SnapNoteKind = "snapnote";

export type SnapNoteInputMode = "typed" | "voice" | "transcribed";

export type SnapNoteIntent =
  | "bug"
  | "change-request"
  | "feature-request"
  | "question"
  | "polish";

export type SnapNoteCoordinateSpace = "sourceImagePixels";

export type SnapNoteAgentStatus = "open" | "in-progress" | "done" | "wont-do";

export type SnapNotePriority = "low" | "medium" | "high";

export type SnapNoteIssueProvider = "github" | "linear" | "local";

export interface SnapNotePacket {
  schemaVersion: SnapNoteSchemaVersion;
  kind: SnapNoteKind;
  id: string;
  createdAt: string;
  source: SnapNoteSource;
  target: SnapNoteTarget;
  note: SnapNoteNote;
  context?: SnapNoteContext;
  agent?: SnapNoteAgent;
  issue?: SnapNoteIssue;
}

export interface SnapNoteSource {
  type: "screenshot";
  width: number;
  height: number;
  image?: SnapNoteImage;
  imageRef?: SnapNoteImageRef;
}

export interface SnapNoteImage {
  mimeType: string;
  encoding: "base64";
  data: string;
}

export interface SnapNoteImageRef {
  type: "file" | "url";
  uri: string;
  mimeType?: string;
  sha256?: string;
}

export interface SnapNoteTarget {
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
  coordinateSpace: SnapNoteCoordinateSpace;
}

export interface SnapNoteNote {
  text: string;
  inputMode: SnapNoteInputMode;
  intent?: SnapNoteIntent;
}

export interface SnapNoteContext {
  app?: SnapNoteAppContext;
  page?: SnapNotePageContext;
  viewport?: SnapNoteViewport;
  selectedElement?: SnapNoteSelectedElement;
  consoleErrors?: Array<string | SnapNoteConsoleError>;
  networkHints?: Array<string | SnapNoteNetworkHint>;
  [key: string]: unknown;
}

export interface SnapNoteAppContext {
  name?: string;
  environment?: string;
  version?: string;
  [key: string]: unknown;
}

export interface SnapNotePageContext {
  url?: string;
  route?: string;
  title?: string;
  [key: string]: unknown;
}

export interface SnapNoteViewport {
  width?: number;
  height?: number;
  devicePixelRatio?: number;
  scrollX?: number;
  scrollY?: number;
  [key: string]: unknown;
}

export interface SnapNoteSelectedElement {
  tag?: string;
  id?: string;
  classes?: string[];
  text?: string;
  ariaLabel?: string;
  domPath?: string;
  boundingClientRect?: SnapNoteDomRect;
  [key: string]: unknown;
}

export interface SnapNoteDomRect {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  [key: string]: unknown;
}

export interface SnapNoteConsoleError {
  message?: string;
  source?: string;
  line?: number;
  column?: number;
  stack?: string;
  [key: string]: unknown;
}

export interface SnapNoteNetworkHint {
  url?: string;
  method?: string;
  status?: number;
  statusText?: string;
  error?: string;
  durationMs?: number;
  [key: string]: unknown;
}

export interface SnapNoteAgent {
  status: SnapNoteAgentStatus;
  priority?: SnapNotePriority;
  instructions?: string;
}

export interface SnapNoteIssue {
  provider: SnapNoteIssueProvider;
  externalId?: string;
  externalUrl?: string;
  branch?: string;
  labels?: string[];
}
