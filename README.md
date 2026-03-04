# soluid

SolidJS component toolkit. Copy components into your project and own the code directly.

[Component Catalog](https://misebox.github.io/soluid/)

## Usage

Install is not required. Run directly with `npx` or `bunx`:

```sh
npx soluid init                # create soluid.config.json interactively
npx soluid install             # download and install components + CSS
npx soluid add <component...>  # add components to config
npx soluid remove <comp...>    # remove components from config
npx soluid list                # list available components
```

## Config

`soluid.config.json`

```json
{
  "componentDir": "src/components/ui",
  "cssPath": "src/styles/soluid.css",
  "components": ["Button", "TextField", "Dialog"]
}
```

`cssPath` receives all component CSS concatenated into a single file.

## Setup

Import CSS in your app entry point:

```tsx
// src/index.tsx
import "./styles/soluid.css";
```

Theme and density switching:

```tsx
document.documentElement.setAttribute("data-theme", "dark");
document.documentElement.setAttribute("data-density", "dense");
```

## Components (34)

| Category | Components |
|---|---|
| Layout | Stack, HStack, Divider, Spacer |
| General | Button, IconButton, Badge, Tag, Tooltip, Avatar |
| Form | FormField, TextField, TextArea, NumberInput, Select, Checkbox, CheckboxGroup, RadioGroup, Switch |
| Data | Table, Card, DescriptionList, Skeleton, EmptyState, Accordion |
| Feedback | Dialog, Drawer, Alert, Toast, Progress, Spinner |
| Navigation | Tabs, Breadcrumb, Pagination, Menu |
| Utility | VisuallyHidden, Popover |

## Core Utilities

`createFocusTrap`, `createToast`, `createToggle`

Installed automatically as dependencies when any component that requires them is added.

## Development

```sh
bun install                  # install dependencies
bun run dev                  # start catalog dev server (localhost:5173)
bun run typecheck            # type check
bun run lint                 # lint (oxlint)
bun run fmt                  # format (dprint)
bun run generate:api         # regenerate API data from component Props
bun run build:catalog        # build catalog site to docs/
bun run build:cli            # build CLI to dist/
```
