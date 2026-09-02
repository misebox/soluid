# Changelog

Components and the CLI are released separately, so they are listed separately.

- **Components** — GitHub releases tagged `components-v*`, installed by `soluid install`
- **CLI** — published to npm, tagged `v*`

## Components

### components-v0.2.14 — 2026-09-03

#### Fixed

- `SegmentedControl` picked its tab stop by comparing option objects, so a derived options array matched nothing and left every segment at `tabindex="-1"`, unreachable by keyboard. It compares by value now.
- Escape ownership lived in a single list for the whole page, so the newest overlay anywhere answered the key rather than the one focus was in: with a `Dialog` in use and a `Popover` open elsewhere, Escape inside the dialog closed the popover and pulled focus out of the modal onto the popover's trigger. Each overlay now reports both its panel and whatever opened it, so a picker whose focus stays on its trigger still counts as in use, and only the overlay the keyboard is inside answers.
- `Menu` closed on any Tab reaching the document without checking where focus was, so a Tab anywhere on the page closed it and moved focus to its trigger; `ContextMenu` had the same shape.
- `Slider` left the thumb wherever a drag ended when the parent kept the old value, so the thumb, the filled track and the readout disagreed. Updates made inside an event handler are batched; the model is compared once it has settled.
- `createToast` moved to plain timers in the previous release but bound them to no owner, so a pending auto-dismiss could fire into a store that had already been disposed.
- `TimePicker` pointed `aria-controls` and `aria-activedescendant` at an empty list when `min`, `max` and `step` left no time to offer.
- `DatePicker`, `TimePicker` and `ColorPicker` used the visually-hidden style without depending on the component that defines it, so in a project that installed them without `VisuallyHidden` the field carrying `name` and `required` rendered at full size.
- The `NumberInput` steppers rendered as small pills in the middle of the field instead of full-height segments, because the wrapper centred its children instead of stretching them.
- Controls smaller than the 24 CSS px WCAG 2.5.8 asks for had a pressable area no bigger than what they were drawn at: the `Tag` remove button was 14 square, the `Rating` stars 20 square two pixels apart, the `Slider` strip 18 tall, and the `Checkbox`, `RadioButton` and `Switch` labels 22 tall. The cross and the stars keep the size they are drawn at.
- `createTheme` logged its contrast warnings on every call, including in production. They are returned to the caller only, which is where they belong.

### components-v0.2.13 — 2026-09-02

#### Fixed

- `Popover` and `DatePicker` panels are portaled to the end of the document, so Tab could not reach them and left them open. Focus now moves into the panel as soon as it opens, Tab on the trigger enters it, and Tab past the last control inside closes the panel and returns focus to the trigger.
- The focus trap counted `tabindex="-1"` items of roving widgets as tab stops, so Tab from the last real stop was not wrapped and Shift+Tab could land on a parked item. It now skips those items, and leaves Tab alone while focus sits in a `Popover` or `DatePicker` panel opened inside the dialog.
- `Menu` hands focus back to its trigger when closed with focus inside, so a `Dialog` opened from a `MenuItem` returns focus once it closes. `ContextMenu` closes after an item is picked and lets Tab leave it, no longer refocuses its region when a pick opened a dialog, and finds the picked item from the event target so Enter still closes it.
- Every overlay listened on `document` and answered Escape on its own, so Escape in a `Menu`, `Popover`, `ContextMenu`, `Combobox`, `DatePicker`, `TimePicker` or `ColorPicker` inside a `Dialog` closed the `Dialog` too. Only the newest open overlay acts on Escape now. A dialog closing underneath another one no longer pulls focus out of the one on top, and a backdrop click during the closing animation no longer reports `onClose` twice.
- A press inside a nested portaled panel — a `DatePicker`, `Combobox`, `Menu` or `TimePicker` opened inside a `Popover` — counted as an outside click and closed the `Popover`, so a date could not be picked with the mouse. Panels are stamped with their layer and outside-click checks read the event path. A `Dialog` reopened while still closing keeps its layer under a `Popover` open inside it.
- `CommandPalette` reported `onOpenChange(false)` twice on Escape, could run a command twice during its closing animation, pointed `aria-controls` and `aria-activedescendant` at ids that were not rendered when nothing matched, and vanished without its closing animation. All four are fixed.
- `createToast` scheduled auto-dismiss through a primitive whose clear was tied to whatever owner `add` ran under, so a toast added from an effect or `onMount` lost its auto-dismiss. It uses plain timers now.
- `Combobox`, `TimePicker`, `DatePicker` and `ColorPicker` stayed open and kept emitting `onChange` after `disabled` turned on while they were open. They close.
- `Combobox`, `TimePicker` and `CommandPalette` kept a highlight index past the end when the options changed while open, so `aria-activedescendant` dangled and Enter did nothing. The index is clamped.
- `Tabs`, `SegmentedControl` and `Rating` had no reachable tab stop when the selected value was disabled, matched nothing or was out of range, so Tab skipped the whole widget. They fall back to the first enabled item. `Combobox` no longer opens with a disabled first option highlighted.
- `SegmentedControl` and `Rating` moved the selection with arrow keys but left focus on the old item, which had just lost its tab stop. Focus follows the selection.
- `Tabs` computed its tab stop in a memo that, on the server, ran once before any tab had registered, so server-rendered HTML gave every tab `tabindex="-1"` until hydration.
- `Tree` recreated every row on expand or collapse and dropped keyboard focus; rows are keyed by node now. Arrow keys, Home and End skip disabled rows instead of stalling, and row ids are prefixed per instance so arrow keys no longer jump into another tree on the page.
- `Carousel` hijacked arrow keys typed into an input inside a slide, jumped back when two moves landed inside its 400 ms sync window, and could not move back from an index past the last slide. Off-screen slides now carry `inert` as well as `aria-hidden`, so their links and buttons are out of the Tab order.
- `Pagination` with `maxVisible` of 3 or less hid the current page and could render two ellipses in a row.
- `Tooltip` moved the trigger between two parents when `content` toggled, blurring it, and dropped `class` and attributes when there was no content. `Tag` recreated its remove button, dropping focus, when a new `onRemove` was passed.
- `Checkbox` and `Switch` without a `checked` prop reported `true` on every click and never updated; they keep their own state until `checked` is given. `Checkbox` also re-syncs its native `checked` from the model, so a parent that keeps the old value is not shown a filled box with no tick. `Checkbox`, `Switch` and `RadioButton` created their `children` twice.
- `Switch` accepted `name` but its track is a button, so a form submitted nothing. It submits `"on"` (or `value`) through a hidden input while checked.
- `TimePicker` stayed open after Tab moved focus on, with Escape dead. The list closes when focus leaves.
- `ColorPicker`'s panel and its two inputs had no accessible name unless labels were passed. They have defaults.
- `Calendar` marked today and chose its default month from the UTC date, a day off for viewers east or west of UTC near midnight. PageUp and PageDown dropped focus to the page, and arrow or page keys could walk into a month where every day is disabled by `min` or `max`.
- `Calendar` in uncontrolled month mode read `value` only at mount, so a value arriving later, or a day picked from an adjacent month's trailing days, stayed out of view. It navigates to the value's month.
- `density` had no effect on `Button`, `IconButton`, `Badge`, `Tag`, `Stack`, `HStack`, `Divider`, `FormField`, `Checkbox`, `Switch`, `RadioButton`, `CheckboxGroup`, `RadioGroup` and the label-less inputs and pickers: it was either spread onto the element as a raw `density` attribute or dropped. Every component sets `data-density` on its root.
- `PinInput` keyed its boxes by character, so Backspace disposed the focused input and a paste rebound handlers to old positions. It also re-fired `onChange` and `onComplete` for a rejected keystroke, kept only the last digit of an autofilled code, could not clear a box with Delete, and on Safari the focus-time selection collapsed on mouseup so a filled box could not be typed over.
- `SearchField` fired `onSearch` on the Enter that confirms an IME composition, searched the `value` prop instead of what was in the box, dropped focus to the page when the clear button was used, and left the clear button enabled while `disabled`.
- `NumberInput` let the +/- buttons change a `readOnly` field, and after blur could show a value the model did not hold (an emptied box, or a value the parent had clamped).
- `FileUpload` passed several files from a drop in single-file mode, and a disabled zone still showed the copy cursor.
- `FormField` pointed `aria-describedby` at a hint id even when no hint was rendered.
- `Avatar` never retried the image after a load error even when `src` changed, and initials broke on a leading space. `AvatarGroup` with a negative `max` dropped avatars and inflated the overflow count.
- `Progress` rendered `aria-valuenow="NaN"` and a `NaN%` width for a `NaN` value. `Link` lost `noopener noreferrer` on an external link when the caller also passed `rel`.
- `Slider` set `value` before `min`, `max` and `step`, so the range input clamped and snapped it against the defaults: `value={500} max={1000}` showed 100. `Select` set `value` before its options existed, so an initial value other than the first option showed the first; it sets `selected` on each option from `value`, which also keeps the selection when options arrive later or are replaced.
- `CommandPalette`'s search box had no focus ring, and `Menu` items and the highlighted option in `Combobox`, `TimePicker` and `CommandPalette` relied on a 1.15:1 background as their only cue; all get a ring now. The ring inside the active `Pagination` page and inside a solid `Tag`'s remove button was the fill colour and invisible, and `Collapsible`'s trigger ring was clipped by `overflow: hidden`.
- Hover no longer overrides the selected `Tree` row or the active `Tab`.
- `Menu`, `Popover` and `ContextMenu` panels sat visible at the document origin until floating-ui positioned them, and moving focus into an unpositioned `Popover` or `ContextMenu` scrolled the page to the bottom; panels stay hidden until positioned, and focus moves in only after the first placement. `Combobox`, `TimePicker` and `DatePicker` panels are portaled too, so none of these six components' `density` reached them; they all carry `data-density` now.
- `ColorPicker`'s panel is portaled like the other pickers (its CSS already assumed so, but it sat clipped inside a `Card` or `Dialog`), and its swatch ring is no longer hard-coded black, which vanished on the dark theme.
- `SearchField`'s clear button had no disabled style. A disabled `Accordion` item was class-only, so its summary stayed in the Tab order while its content dimmed along with the trigger; it sets `aria-disabled` and `tabindex="-1"` and dims only the trigger. `Avatar`'s neutral variant text was 4.2:1.
- `Dialog` footer buttons wrap on narrow screens instead of overflowing, `Tabs` scroll horizontally instead of vanishing, `DescriptionList` columns and long `Breadcrumb` and `Accordion` titles no longer blow out the layout, and `CommandPalette` uses `dvh`.
- Closing animations under reduced motion use a near-zero duration instead of none, so overlays still unmount on `animationend` rather than 200 ms later. A `forced-colors` block gives the radio dot, switch, progress bar, slider track, carousel dots, segmented control, selected calendar day, dividers and tooltip a system colour or border, since backgrounds and shadows are dropped there.
- `Carousel`'s off-screen slides carry `inert` as well as `aria-hidden`, so their links and buttons are out of the Tab order. `createTheme` produced `NaN` in the generated CSS for a `#abc` shorthand colour.
- `Accordion` inside a `Dialog` could not be reached by Tab, and a `Popover` containing an `Accordion` treated the button before it as the last item. The focus trap's focusable selector lacked `summary`, `iframe`, audio and video controls and `contenteditable` elements; it includes them now.
- `Calendar` had no Home and End for the start and end of a week and ignored Shift with PageUp and PageDown for a year; both work now. Its tab stop also did not follow arrow-key focus, so in a `DatePicker` tabbing from an arrowed-to day left the panel open and dropped focus; the last focused day keeps the stop.
- `ColorPicker`'s panel could not be reached or left by keyboard. Focus moves in when the panel opens, Tab on the trigger enters it, and Tab past the last field closes the panel and returns focus to the trigger.
- `TimePicker`'s trigger carried `aria-activedescendant` on a plain button, invalid ARIA that left the highlighted time unannounced; the trigger is `role="combobox"` now. `Tree` put `role="treeitem"` on the `li` while focus sat on the inner button, so readers announced a plain button; the button carries the role.
- `Combobox` with no matches still claimed an expanded list, with a dangling `aria-activedescendant` and a non-option item inside the listbox. Both are gated on having matches, and the empty-state item is presentational.
- `Combobox` and `CommandPalette` committed the highlighted option on the Enter that confirms an IME composition. That Enter is ignored.
- `Tooltip` could not be dismissed by keyboard (WCAG 1.4.13) and hid as soon as the pointer moved onto it. Escape dismisses it until the pointer or focus leaves, it is hidden with `visibility` when not shown, and a hit area bridges the gap to the trigger.
- `Menu`, `Popover`, `ContextMenu`, `Combobox`, `TimePicker`, `DatePicker` and `ColorPicker` closed on outside presses via `mousedown`, which iOS Safari does not fire for taps on plain text, so a tap outside could leave them open. They listen for `pointerdown`.
- `Combobox`, `TimePicker` and `CommandPalette` committed an option on `mousedown`, so on touch a scroll inside the list could commit the touched option and the trailing click could hit whatever appeared underneath. They commit on `click` and only prevent the mousedown's default to keep focus in the field.
- `Combobox` and `TimePicker` lists cap their height to the room left below the field, since a soft keyboard leaves little; text fields use a 16px minimum font size on touch screens so iOS Safari no longer zooms in on focus; `Toast` containers respect the safe-area insets.
- 26 components spread their remaining props onto the root element, so `id`, `style`, `data-*` and `onClick` reached the DOM, but their props types rejected them (`<Alert id="a">` did not compile). Following `Card`, each type takes its root element's attributes, minus the ones the component owns.
- The border around every input, the checkbox and radio indicators, the picker triggers, the progress track, the empty rating stars, the slider track, the switch off state and the inactive carousel dots used `--so-border`, which measures 1.24:1 against the page in light and 1.72:1 in dark, so a field's edge was barely visible. A new `--so-border-control` token measures 3.18:1 and 3.02:1 against the two light backgrounds and 3.75:1 and 3.07:1 in dark, which is what WCAG 1.4.11 asks. `Card`, `Dialog` and `Table` keep the softer `--so-border`.
- The shadow tokens were black with no dark-theme override, so an elevated `Card` was indistinguishable from the page in dark mode. The dark theme has its own now.
- Physical CSS properties are replaced with logical ones, so the library lays out correctly right to left: the `Select` and `Combobox` arrows and paddings, the `SearchField` icon and clear button, the `Tree` indentation, the `ButtonGroup` attached corners, the `Toast` accent, the `Timeline` and `Steps` connectors, the `Carousel` buttons, the `AvatarGroup` overlap, the `FormField` required marker, the `Table` sort icon and the `Slider` fill.
- The focus trap registered its keydown listener when the component mounted rather than when the overlay opened, so a page holding one closed `Dialog` or `Drawer` per table row ran every keystroke through a handler per row. Fifty closed dialogs held fifty listeners; they hold none now.
- `SegmentedControl`, `Tabs` and `Rating` recomputed their single tab stop once per item, so changing the selection cost time proportional to the square of the item count. `CommandPalette` re-filtered its whole command list about five times per arrow key, and `Table` called the caller's `rowKey` three times per row on mount. All four are computed once now.
- A `Dialog` without a `DialogHeader` still pointed `aria-labelledby` at an element nothing rendered, so the dialog had no name. A `Combobox` with nothing to show kept a listbox role over a message that is not an option. `CommandPalette`'s search box had no name at all, and its dialog had none unless the caller passed a label; both fall back to "Search commands".
- `aria-required` is not allowed on a plain button, so a required `DatePicker` or `ColorPicker` trigger produced invalid ARIA; both triggers are now the `combobox` role the `TimePicker` trigger already used.
- `Calendar` threw for any value it could not parse, such as `"abc"`, `"20260101"` or `"01/15/2026"`, because the unparsed month reached `Intl` as an invalid date and took the whole render tree down; `DatePicker` inherited the crash. It falls back to the current month. It threw the same way for a locale tag `Intl` rejects, including `"en_US"`, the underscore form several backends emit, and the empty string; an unusable tag falls back to the browser's own.
- `Carousel` with a fractional or `NaN` index, which a missing URL parameter through `parseInt` produces, matched no slide: every slide was `aria-hidden` and `inert`, both arrows stayed enabled, and clicking them reported `NaN` forever.
- `Pagination` rendered a page button labelled NaN, named "Page NaN" to a screen reader, while a count had not loaded. `AvatarGroup` with a NaN `max` rendered nothing at all, overflow chip included. `Slider` put `min="NaN"` on the range input and a NaN percent track for a value from `parseFloat("")`. `Rating` and `PinInput` threw from `Array.from` for an infinite `max` or `length`.
- `TimePicker` with a fractional `step` offered times like `"00:1.5"` and committed them as though they were `HH:MM`. `ColorPicker` threw when the swatch list held a gap, which a list built by mapping rows can leave.
- In a right-to-left page the `Calendar` and `Carousel` navigation chevrons and the `Tree` collapse chevron still pointed the way they do left to right.
- `createTheme` used `import.meta.env`, which exists only under a bundler, so it was the one file in the library that failed to type-check once copied into a project without one. Its contrast warnings are logged unconditionally now, and still returned to the caller.
- `Collapsible` rejected JSX as `title` at compile time, `Table` rejected rows typed by an `interface`, and a caller's `onKeyDown` on `Carousel` or `onContextMenu` on `ContextMenu` silently replaced the component's own handler; the types now say so. `DatePicker`, `TimePicker`, `ColorPicker` and `Combobox` accept the native attributes of their trigger or input, and `TimePicker`, `ColorPicker` and `Combobox` take a `name` and submit their value. `NumberInput`'s `label` is optional like every other field, it no longer wipes an uncontrolled box on blur, and its steppers respect the lowercase `readonly` attribute. `SliderInput` merges a caller `style` instead of dropping it. The named unions (`SmallSize`, `WeekStart`, `SortDirection`, `TooltipPlacement` and the rest) are exported from the index.

#### Changed

- `Combobox` opens on click, typing or ArrowDown rather than on focus, so a dialog handing it focus does not pop the list, and a click reopens it once the field already has focus.
- `FormField` takes an `id` and adopts the caller's id instead of replacing it, so an external `<label for>` or `aria-controls` resolves. The labelled wrappers pass theirs through.
- `DatePicker` with a `name` renders a visually hidden text input rather than a hidden one, so `required` takes part in constraint validation. `DatePicker`, `TimePicker` and `ColorPicker` triggers expose `aria-required`.
- `Switch` and `Rating` no longer accept `onClick` or `onKeyDown` in their prop types; both were silently dropped before.
- `@solid-primitives/scheduled` is no longer installed; `createToast` needed only plain timers.
- Every overlay hard-coded `z-index` 1000 and `Toast` 1100; they read `--so-z-overlay` and `--so-z-toast`, so a host can move the whole library at once.
- `Popover` takes a `label` for its panel, which is a dialog that nothing could name before.
- `@solid-primitives/event-listener` is no longer installed. The focus trap registers its own listener, which is all it needed, so the core component pulls in no npm package at all.

### components-v0.2.12 — 2026-09-02

#### Fixed

- `Dialog`, `Drawer` and `CommandPalette` left the page behind them scrolling. Nothing held the page while an overlay was open, so the wheel moved it whenever the pointer was over the backdrop, and a scroll inside the overlay carried on into the page once it reached the end. The page is now held for as long as the overlay is on screen — counted, so nested overlays release it only when the last one closes — the scrollbar's width is padded back so the page does not shift sideways, and the scrollable regions contain their own overscroll. iOS ignores `overflow: hidden` on the scrolling element, so there the page is pinned and the reading position restored on close.
- Focus never entered an overlay when it opened. The trap moved focus in `onMount`, which runs before the overlay's own content exists and never again, so opening a `Dialog` from a button left focus on the button. Focus now moves in as soon as there is something to move it to, and an overlay with nothing focusable takes focus itself rather than leaving the reader on the page underneath.
- Focus was not handed back when an overlay closed, only when the component holding it was disposed of — so in the usual case, where the `Dialog` stays mounted and `open` goes false, focus was left on `<body>`.
- Escape closed every open overlay at once instead of the one on top, because each trap listened on `document` and answered independently.
- Tab could walk out of an overlay. Once focus sat outside the container — after a click on the backdrop, say — neither end of the trap matched, so tabbing continued into the page behind. Tab now pulls focus back in.
- `NumberInput` drifted on fractional steps: three increments of `0.1` from zero produced `0.30000000000000004`. Stepped values are rounded back to the decimals the step and the value carry.
- `Calendar` moved focus with a document-wide lookup, so with two calendars showing the same month the arrow keys focused a day in the wrong one.
- `Calendar` could put its only tab stop on a day ruled out by `min` or `max`, leaving the grid unreachable by keyboard. The tab stop falls back to the first day that can actually be focused.

#### Changed

- `@solid-primitives/active-element` is no longer installed. The focus trap reads `document.activeElement` directly, which is all it needed.

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

### v0.2.11 — 2026-09-03

#### Fixed

- Every interactive prompt discarded the answer and returned its default, so the overwrite prompt always declined and `init` always took defaults regardless of what was typed. The end-of-input fallback added in the previous release resolved the prompt from readline's `close` event, which fires synchronously before the answer callback can resolve it.
- `install` wrote the new `componentsVersion` to the config before fetching or checking the release, so an install it went on to refuse still left the newer version recorded.

### v0.2.11 — 2026-09-03

#### Fixed

- The drift check added in the previous version refused every existing release. macOS tar embeds an AppleDouble `._name` entry per file unless `COPYFILE_DISABLE` is set, and every published tarball carries about 147 of them; each matched the check's pattern for a component file. The release script excludes them now and the check ignores dotfiles. This was never published.
- That check also scanned the whole archive, so a release adding any component would have stopped the install for everyone on an older CLI, even someone installing only `Button`. It now looks for the thing that actually breaks an install: a file being written whose relative import is not also being written.
- The npm packages to install came from the CLI's own registry, which describes the components in the CLI rather than the release being installed, so pinning an older `componentsVersion` could leave an import unresolvable. They are the union of the registry and the packages the release's own files import.
- The published package carried 82 files, including compiled tests, declarations and a stylesheet left over from a build that no longer exists. It carries 14 now, 125 KB down to 52 KB.
- `release-cli.sh` tagged and pushed before publishing, so a publish that failed left a tag for a version npm never received and the drift check read it as released; v0.2.8 is in that state. `release-components.sh` refuses to run unless npm already carries this tree's CLI version, since a components release needing a newer registry breaks installs until the CLI lands.
- The package declares `engines` of Node 18 or newer, which its use of `fetch` and `node:stream/web` already required.

### v0.2.10 — 2026-09-02

#### Fixed

- `install` refuses a release that carries component files the registry does not know (an older CLI paired with a newer release could import a file that is never installed, as reported for `createScrollLock`) and one lacking files the registry expects; both print the drift and an upgrade hint instead of installing silently or halfway. This is a stopgap: a manifest shipped inside the release would remove the drift entirely.
- `update` wrote the new `componentsVersion` before the install finished, so a failed install still left the newer version recorded; `install` writes it only once the files are on disk.
- A piped or closed stdin made prompts hang, or made the CLI exit with code 13 in CI; prompts resolve to their default, and a non-terminal stdin is treated as `--no-interactive`. Without a terminal, files that differ locally are kept unless `--force` is passed.
- Interactive `install` printed every component line twice: the dry-run preview logged as well as the real run.
- `add Button Button` wrote the name twice into the config.
- Resolving the latest components version picked up pre-releases and drafts; they are skipped.
- `rewriteImports` used the host path module, so import specifiers came out with backslashes on Windows; it uses POSIX paths.
- `install` lists component files that are on disk but no longer in the config instead of leaving them unmentioned.
- A non-interactive `install` (`--no-interactive`, or a non-terminal stdin) overwrote files that differ locally without asking. Only `--force` does now; without it the files are kept and listed with the `--force` hint.

### v0.2.7 — 2026-08-03

No CLI changes. Published to keep the npm version in step with the repository.

### v0.2.6 — 2026-07-25

#### Added

- The registry lists 16 more components: the date, colour and media set, and the interaction set.

### v0.2.5 — 2026-05-06

#### Added

- The registry lists 12 more primitive components.
