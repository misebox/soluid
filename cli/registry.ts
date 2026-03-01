export interface RegistryEntry {
  name: string;
  category: "core" | "primitives" | "components";
  files: string[]; // paths relative to templates/
  dependencies: string[]; // other registry entry names
  npmDependencies?: string[]; // npm packages to install
  description: string;
}

/**
 * Core is always installed. It provides types, utils, CSS tokens, and theme.
 */
export const registry: Record<string, RegistryEntry> = {
  // --- Core (always installed) ---
  core: {
    name: "core",
    category: "core",
    files: [
      "core/types.ts",
      "core/utils.ts",
      "core/soluid.css",
      "core/theme.ts",
    ],
    dependencies: [],
    description: "Type definitions, CSS tokens, theme utilities",
  },

  // --- Primitives ---
  "createDisclosure": {
    name: "createDisclosure",
    category: "primitives",
    files: ["primitives/createDisclosure.ts"],
    dependencies: ["core"],
    description: "Open/close state management with a11y",
  },
  "createFocusTrap": {
    name: "createFocusTrap",
    category: "primitives",
    files: ["primitives/createFocusTrap.ts"],
    dependencies: ["core"],
    npmDependencies: [
      "@solid-primitives/active-element",
      "@solid-primitives/event-listener",
    ],
    description: "Trap focus within a container element",
  },
  "createToggle": {
    name: "createToggle",
    category: "primitives",
    files: ["primitives/createToggle.ts"],
    dependencies: ["core"],
    description: "On/off toggle state with a11y",
  },
  "createToast": {
    name: "createToast",
    category: "primitives",
    files: ["primitives/createToast.ts"],
    dependencies: ["core"],
    npmDependencies: ["@solid-primitives/scheduled"],
    description: "Toast notification queue management",
  },
  "createPagination": {
    name: "createPagination",
    category: "primitives",
    files: ["primitives/createPagination.ts"],
    dependencies: ["core"],
    description: "Page state management",
  },

  // --- Layout ---
  Stack: {
    name: "Stack",
    category: "components",
    files: ["components/layout/Stack.tsx", "components/layout/Stack.css"],
    dependencies: ["core"],
    description: "Vertical flex layout with gap",
  },
  HStack: {
    name: "HStack",
    category: "components",
    files: ["components/layout/HStack.tsx", "components/layout/HStack.css"],
    dependencies: ["core"],
    description: "Horizontal flex layout with gap",
  },
  Divider: {
    name: "Divider",
    category: "components",
    files: ["components/layout/Divider.tsx", "components/layout/Divider.css"],
    dependencies: ["core"],
    description: "Horizontal/vertical separator",
  },
  Spacer: {
    name: "Spacer",
    category: "components",
    files: ["components/layout/Spacer.tsx", "components/layout/Spacer.css"],
    dependencies: ["core"],
    description: "Flex spacer",
  },

  // --- General ---
  Button: {
    name: "Button",
    category: "components",
    files: ["components/general/Button.tsx", "components/general/Button.css"],
    dependencies: ["core"],
    description: "Primary, neutral, danger button with icon and loading",
  },
  IconButton: {
    name: "IconButton",
    category: "components",
    files: [
      "components/general/IconButton.tsx",
      "components/general/IconButton.css",
    ],
    dependencies: ["core"],
    description: "Icon-only button with aria-label",
  },
  Badge: {
    name: "Badge",
    category: "components",
    files: ["components/general/Badge.tsx", "components/general/Badge.css"],
    dependencies: ["core"],
    description: "Status label",
  },
  Tag: {
    name: "Tag",
    category: "components",
    files: ["components/general/Tag.tsx", "components/general/Tag.css"],
    dependencies: ["core"],
    description: "Removable label for filters",
  },
  Tooltip: {
    name: "Tooltip",
    category: "components",
    files: ["components/general/Tooltip.tsx"],
    dependencies: ["core"],
    description: "Tooltip (placeholder)",
  },

  // --- Form ---
  FormField: {
    name: "FormField",
    category: "components",
    files: [
      "components/form/FormField.tsx",
      "components/form/FormField.css",
      "components/form/FormFieldContext.ts",
    ],
    dependencies: ["core"],
    description: "Label + error/hint wrapper for form inputs",
  },
  TextField: {
    name: "TextField",
    category: "components",
    files: [
      "components/form/TextField.tsx",
      "components/form/TextField.css",
    ],
    dependencies: ["core", "FormField"],
    description: "Text input with label/error/hint",
  },
  TextArea: {
    name: "TextArea",
    category: "components",
    files: [
      "components/form/TextArea.tsx",
      "components/form/TextArea.css",
    ],
    dependencies: ["core", "FormField"],
    description: "Multiline text input",
  },
  NumberInput: {
    name: "NumberInput",
    category: "components",
    files: [
      "components/form/NumberInput.tsx",
      "components/form/NumberInput.css",
    ],
    dependencies: ["core", "FormField"],
    description: "Number input with stepper buttons",
  },
  Select: {
    name: "Select",
    category: "components",
    files: [
      "components/form/Select.tsx",
      "components/form/Select.css",
    ],
    dependencies: ["core", "FormField"],
    description: "Native select dropdown",
  },
  Checkbox: {
    name: "Checkbox",
    category: "components",
    files: [
      "components/form/Checkbox.tsx",
      "components/form/Checkbox.css",
      "components/form/CheckboxGroupContext.ts",
    ],
    dependencies: ["core"],
    description: "Checkbox with indeterminate support",
  },
  CheckboxGroup: {
    name: "CheckboxGroup",
    category: "components",
    files: [
      "components/form/CheckboxGroup.tsx",
      "components/form/CheckboxGroup.css",
    ],
    dependencies: ["core", "Checkbox"],
    description: "Checkbox group with shared state",
  },
  RadioGroup: {
    name: "RadioGroup",
    category: "components",
    files: [
      "components/form/RadioGroup.tsx",
      "components/form/RadioGroup.css",
      "components/form/RadioGroupContext.ts",
      "components/form/RadioButton.tsx",
      "components/form/RadioButton.css",
    ],
    dependencies: ["core"],
    description: "Radio button group",
  },
  Switch: {
    name: "Switch",
    category: "components",
    files: [
      "components/form/Switch.tsx",
      "components/form/Switch.css",
    ],
    dependencies: ["core", "createToggle"],
    description: "Toggle switch",
  },

  // --- Data Display ---
  Table: {
    name: "Table",
    category: "components",
    files: ["components/data/Table.tsx", "components/data/Table.css"],
    dependencies: ["core"],
    description: "Data table with sort, pagination, row selection",
  },
  Card: {
    name: "Card",
    category: "components",
    files: ["components/data/Card.tsx", "components/data/Card.css"],
    dependencies: ["core"],
    description: "Content card with header/body/footer",
  },
  DescriptionList: {
    name: "DescriptionList",
    category: "components",
    files: [
      "components/data/DescriptionList.tsx",
      "components/data/DescriptionList.css",
    ],
    dependencies: ["core"],
    description: "Key-value display",
  },
  Skeleton: {
    name: "Skeleton",
    category: "components",
    files: ["components/data/Skeleton.tsx", "components/data/Skeleton.css"],
    dependencies: ["core"],
    description: "Loading placeholder",
  },
  EmptyState: {
    name: "EmptyState",
    category: "components",
    files: [
      "components/data/EmptyState.tsx",
      "components/data/EmptyState.css",
    ],
    dependencies: ["core"],
    description: "Empty data display with action",
  },

  // --- Feedback ---
  Dialog: {
    name: "Dialog",
    category: "components",
    files: ["components/feedback/Dialog.tsx", "components/feedback/Dialog.css"],
    dependencies: ["core", "createFocusTrap"],
    description: "Modal dialog with focus trap",
  },
  Drawer: {
    name: "Drawer",
    category: "components",
    files: ["components/feedback/Drawer.tsx", "components/feedback/Drawer.css"],
    dependencies: ["core", "createFocusTrap"],
    description: "Side panel with focus trap",
  },
  Alert: {
    name: "Alert",
    category: "components",
    files: ["components/feedback/Alert.tsx", "components/feedback/Alert.css"],
    dependencies: ["core"],
    description: "Inline notification",
  },
  Toast: {
    name: "Toast",
    category: "components",
    files: ["components/feedback/Toast.tsx", "components/feedback/Toast.css"],
    dependencies: ["core", "createToast"],
    description: "Toast notification with queue",
  },
  Progress: {
    name: "Progress",
    category: "components",
    files: [
      "components/feedback/Progress.tsx",
      "components/feedback/Progress.css",
    ],
    dependencies: ["core"],
    description: "Progress bar",
  },
  Spinner: {
    name: "Spinner",
    category: "components",
    files: [
      "components/feedback/Spinner.tsx",
      "components/feedback/Spinner.css",
    ],
    dependencies: ["core"],
    description: "Loading spinner",
  },

  // --- Navigation ---
  Tabs: {
    name: "Tabs",
    category: "components",
    files: ["components/navigation/Tabs.tsx", "components/navigation/Tabs.css"],
    dependencies: ["core"],
    description: "Tab navigation",
  },
  Breadcrumb: {
    name: "Breadcrumb",
    category: "components",
    files: [
      "components/navigation/Breadcrumb.tsx",
      "components/navigation/Breadcrumb.css",
    ],
    dependencies: ["core"],
    description: "Breadcrumb navigation",
  },
  Pagination: {
    name: "Pagination",
    category: "components",
    files: [
      "components/navigation/Pagination.tsx",
      "components/navigation/Pagination.css",
    ],
    dependencies: ["core"],
    description: "Page navigation",
  },
  Menu: {
    name: "Menu",
    category: "components",
    files: ["components/navigation/Menu.tsx"],
    dependencies: ["core"],
    description: "Dropdown menu (placeholder)",
  },

  // --- Utility ---
  VisuallyHidden: {
    name: "VisuallyHidden",
    category: "components",
    files: [
      "components/utility/VisuallyHidden.tsx",
      "components/utility/VisuallyHidden.css",
    ],
    dependencies: [],
    description: "Screen reader only content",
  },
  Popover: {
    name: "Popover",
    category: "components",
    files: ["components/utility/Popover.tsx"],
    dependencies: ["core"],
    description: "Floating element (placeholder)",
  },
};

/** Resolve all dependencies recursively for a list of component names. */
export function resolveDependencies(names: string[]): string[] {
  const resolved = new Set<string>();

  function walk(name: string) {
    if (resolved.has(name)) return;
    const entry = registry[name];
    if (!entry) return;
    for (const dep of entry.dependencies) {
      walk(dep);
    }
    resolved.add(name);
  }

  for (const n of names) {
    walk(n);
  }

  // core always first
  const result = Array.from(resolved);
  const coreIdx = result.indexOf("core");
  if (coreIdx > 0) {
    result.splice(coreIdx, 1);
    result.unshift("core");
  }

  return result;
}

/** Collect all npm dependencies for resolved entries. */
export function collectNpmDeps(names: string[]): string[] {
  const deps = new Set<string>();
  for (const name of names) {
    const entry = registry[name];
    if (entry?.npmDependencies) {
      for (const d of entry.npmDependencies) {
        deps.add(d);
      }
    }
  }
  return Array.from(deps).sort();
}

/** Get all component names (excluding core). */
export function allComponentNames(): string[] {
  return Object.keys(registry).filter((k) => k !== "core");
}
