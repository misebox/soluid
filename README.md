# soluid

SolidJS component toolkit. Copy components into your project and own the code directly.

## Install

```sh
npm install -D soluid
```

## CLI

```sh
npx soluid init                # create soluid.config.json interactively
npx soluid install             # install components and CSS
npx soluid add <component...>  # add components to config
npx soluid remove <comp...>    # remove components from config
npx soluid list                # list available components
```

## Config

`soluid.config.json`

```json
{
  "componentDir": "src/components/ui",
  "alias": "",
  "aliasBase": "src",
  "cssPath": "src/styles/soluid.css",
  "components": ["Button", "TextField", "Dialog"]
}
```

## Setup

Import CSS in your app's entry point:

```tsx
// src/index.tsx
import "./styles/soluid.css";
```

Theme/density switching:

```tsx
document.documentElement.setAttribute("data-theme", "dark");
document.documentElement.setAttribute("data-density", "dense");
```

## Components (32)

| Category | Components |
|---|---|
| Layout | Stack, HStack, Divider, Spacer |
| General | Button, IconButton, Badge, Tag, Tooltip |
| Form | FormField, TextField, TextArea, NumberInput, Select, Checkbox, CheckboxGroup, RadioGroup, Switch |
| Data | Table, Card, DescriptionList, Skeleton, EmptyState |
| Feedback | Dialog, Drawer, Alert, Toast, Progress, Spinner |
| Navigation | Tabs, Breadcrumb, Pagination, Menu |
| Utility | VisuallyHidden, Popover |

## Primitives (5)

`createDisclosure`, `createFocusTrap`, `createToggle`, `createToast`, `createPagination`
