# Changelog

Components and the CLI are released separately, so they are listed separately.

- **Components** — GitHub releases tagged `components-v*`, installed by `soluid install`
- **CLI** — published to npm, tagged `v*`

## Components

### components-v0.2.11 — 2026-08-20

#### Added

- `DialogDescription`, a line under the title wired to the dialog's `aria-describedby`. A screen reader announced the title on open and nothing about what the dialog was for. The attribute is only set when a description is present.
- `TextField` accepts `search`, `number` and `date` in addition to `text`, `email`, `password`, `url` and `tel`.

#### Fixed

- `createFocusTrap` named `document` as its listener target while the component was still being set up, so `Dialog`, `Drawer` and `CommandPalette` threw on a server render before anything reached the page. The listener is now registered on the client only.
- `Card`, `CardHeader`, `CardBody` and `CardFooter` accept HTML attributes such as `classList` and `onClick`. They were already passed through to the element; only the types rejected them.

### components-v0.2.10 — 2026-08-19

#### Changed

- Every literal union in the props is now a named type: `Size`, `Gap`, `Align`, `SortDirection` and the rest. The accepted values are unchanged, so nothing breaks; they simply read better in an editor and in the API docs.

### components-v0.2.9 — 2026-08-14

#### Changed

- Icons are drawn on a single 24×24 grid at stroke-width 2, where they had drifted to three viewBoxes and four stroke widths. Icons shown at 12px are thinner than before.

### components-v0.2.8 — 2026-08-07

#### Breaking

- `Progress` now requires `aria-label`. A `role="progressbar"` with no name tells a screen reader nothing.

#### Fixed

- A `style` prop from the caller no longer wipes the style a component sets for itself. `AspectRatio` lost its ratio, `Grid` its columns and `Skeleton` its size the moment `style` was passed.
- `Calendar` groups weeks into rows, so `role="gridcell"` has the `role="row"` parent it requires. The month was not readable as a grid before.
- `Avatar` with neither `alt` nor `name` is no longer an unnamed `role="img"`.
- `ContextMenu` no longer sets `aria-expanded` on an element that has no role to support it.
- `Carousel` dots are a 24×24 target, and its scrolling honours `prefers-reduced-motion`.
- `DatePicker` and `TimePicker` no longer scroll the page to the top when opened.
- `SearchField` no longer draws its icon on top of the input text.
- Floating panels stay hidden until they have been positioned, rather than briefly sitting at the document origin.
- Out-of-month `Calendar` days are no longer dimmed to 2.98:1.

#### Changed

- The default palette gives each theme its own colour bases. No single base can clear 4.5:1 on both white and `#0f172a`, so light and dark now differ, and solid fills carry dark text in dark mode. Contrast failures drop from 98 to 2 in light and from 245 to 2 in dark, the remainder being disabled controls, which WCAG exempts.

## CLI

### v0.2.7 — 2026-08-03

No CLI changes. Published to keep the npm version in step with the repository.

### v0.2.6 — 2026-07-25

#### Added

- The registry lists 16 more components: the date, colour and media set, and the interaction set.

### v0.2.5 — 2026-05-06

#### Added

- The registry lists 12 more primitive components.
