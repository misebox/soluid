# solidout

SolidJS component toolkit. Copy components into your project and own the code directly.

## Install

```sh
npm install -D solidout
```

## CLI

```sh
npx solidout init     # creates solidout.config.json
npx solidout add      # copies components into your project
npx solidout list     # shows available components
```

## Config

`solidout.config.json`

```json
{
  "componentDir": "src/components/ui",
  "alias": "@",
  "aliasBase": "src",
  "components": ["Button", "TextField", "Dialog"]
}
```

## Setup

Import solidout.css in your app's entry point:

```tsx
// src/index.tsx
import "./components/ui/core/solidout.css";
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
