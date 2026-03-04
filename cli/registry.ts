export interface RegistryEntry {
  name: string;
  category: "core" | "components";
  files: string[]; // paths relative to archive root (e.g. "soluid/Button.tsx")
  dependencies: string[]; // other registry entry names
  npmDependencies?: string[]; // npm packages to install
  description: string;
}

/**
 * Core is always installed. It provides types, utils, CSS tokens, theme,
 * and primitive utilities (createFocusTrap, createToast, createToggle).
 */
export const registry: Record<string, RegistryEntry> = {
  // --- Core (always installed) ---
  core: {
    name: "core",
    category: "core",
    files: [
      "soluid/core/types.ts",
      "soluid/core/utils.ts",
      "soluid/core/soluid.css",
      "soluid/core/theme.ts",
      "soluid/core/createFocusTrap.ts",
      "soluid/core/createToast.ts",
      "soluid/core/createToggle.ts",
    ],
    dependencies: [],
    npmDependencies: [
      "@solid-primitives/active-element",
      "@solid-primitives/event-listener",
      "@solid-primitives/scheduled",
    ],
    description: "Type definitions, CSS tokens, theme utilities, primitives",
  },

  // --- Layout ---
  Stack: {
    name: "Stack",
    category: "components",
    files: ["soluid/Stack.tsx", "soluid/Stack.css"],
    dependencies: ["core"],
    description: "Vertical flex layout with gap",
  },
  HStack: {
    name: "HStack",
    category: "components",
    files: ["soluid/HStack.tsx", "soluid/HStack.css"],
    dependencies: ["core"],
    description: "Horizontal flex layout with gap",
  },
  Divider: {
    name: "Divider",
    category: "components",
    files: ["soluid/Divider.tsx", "soluid/Divider.css"],
    dependencies: ["core"],
    description: "Horizontal/vertical separator",
  },
  Spacer: {
    name: "Spacer",
    category: "components",
    files: ["soluid/Spacer.tsx", "soluid/Spacer.css"],
    dependencies: ["core"],
    description: "Flex spacer",
  },

  // --- General ---
  Button: {
    name: "Button",
    category: "components",
    files: ["soluid/Button.tsx", "soluid/Button.css"],
    dependencies: ["core"],
    description: "Primary, neutral, danger button with icon and loading",
  },
  IconButton: {
    name: "IconButton",
    category: "components",
    files: ["soluid/IconButton.tsx", "soluid/IconButton.css"],
    dependencies: ["core"],
    description: "Icon-only button with aria-label",
  },
  Badge: {
    name: "Badge",
    category: "components",
    files: ["soluid/Badge.tsx", "soluid/Badge.css"],
    dependencies: ["core"],
    description: "Status label",
  },
  Tag: {
    name: "Tag",
    category: "components",
    files: ["soluid/Tag.tsx", "soluid/Tag.css"],
    dependencies: ["core"],
    description: "Removable label for filters",
  },
  Tooltip: {
    name: "Tooltip",
    category: "components",
    files: ["soluid/Tooltip.tsx", "soluid/Tooltip.css"],
    dependencies: ["core"],
    description: "Tooltip",
  },

  // --- Form ---
  FormField: {
    name: "FormField",
    category: "components",
    files: [
      "soluid/FormField.tsx",
      "soluid/FormField.css",
      "soluid/FormFieldContext.ts",
    ],
    dependencies: ["core"],
    description: "Label + error/hint wrapper for form inputs",
  },
  TextField: {
    name: "TextField",
    category: "components",
    files: ["soluid/TextField.tsx", "soluid/TextField.css"],
    dependencies: ["core", "FormField"],
    description: "Text input with label/error/hint",
  },
  TextArea: {
    name: "TextArea",
    category: "components",
    files: ["soluid/TextArea.tsx", "soluid/TextArea.css"],
    dependencies: ["core", "FormField"],
    description: "Multiline text input",
  },
  NumberInput: {
    name: "NumberInput",
    category: "components",
    files: ["soluid/NumberInput.tsx", "soluid/NumberInput.css"],
    dependencies: ["core", "FormField"],
    description: "Number input with stepper buttons",
  },
  Select: {
    name: "Select",
    category: "components",
    files: ["soluid/Select.tsx", "soluid/Select.css"],
    dependencies: ["core", "FormField"],
    description: "Native select dropdown",
  },
  Checkbox: {
    name: "Checkbox",
    category: "components",
    files: [
      "soluid/Checkbox.tsx",
      "soluid/Checkbox.css",
      "soluid/CheckboxGroupContext.ts",
    ],
    dependencies: ["core"],
    description: "Checkbox with indeterminate support",
  },
  CheckboxGroup: {
    name: "CheckboxGroup",
    category: "components",
    files: ["soluid/CheckboxGroup.tsx", "soluid/CheckboxGroup.css"],
    dependencies: ["core", "Checkbox"],
    description: "Checkbox group with shared state",
  },
  RadioGroup: {
    name: "RadioGroup",
    category: "components",
    files: [
      "soluid/RadioGroup.tsx",
      "soluid/RadioGroup.css",
      "soluid/RadioGroupContext.ts",
      "soluid/RadioButton.tsx",
      "soluid/RadioButton.css",
    ],
    dependencies: ["core"],
    description: "Radio button group",
  },
  Switch: {
    name: "Switch",
    category: "components",
    files: ["soluid/Switch.tsx", "soluid/Switch.css"],
    dependencies: ["core"],
    description: "Toggle switch",
  },

  // --- Data Display ---
  Table: {
    name: "Table",
    category: "components",
    files: ["soluid/Table.tsx", "soluid/Table.css"],
    dependencies: ["core"],
    description: "Data table with sort, pagination, row selection",
  },
  Card: {
    name: "Card",
    category: "components",
    files: ["soluid/Card.tsx", "soluid/Card.css"],
    dependencies: ["core"],
    description: "Content card with header/body/footer",
  },
  DescriptionList: {
    name: "DescriptionList",
    category: "components",
    files: ["soluid/DescriptionList.tsx", "soluid/DescriptionList.css"],
    dependencies: ["core"],
    description: "Key-value display",
  },
  Skeleton: {
    name: "Skeleton",
    category: "components",
    files: ["soluid/Skeleton.tsx", "soluid/Skeleton.css"],
    dependencies: ["core"],
    description: "Loading placeholder",
  },
  EmptyState: {
    name: "EmptyState",
    category: "components",
    files: ["soluid/EmptyState.tsx", "soluid/EmptyState.css"],
    dependencies: ["core"],
    description: "Empty data display with action",
  },

  // --- Feedback ---
  Dialog: {
    name: "Dialog",
    category: "components",
    files: ["soluid/Dialog.tsx", "soluid/Dialog.css"],
    dependencies: ["core"],
    description: "Modal dialog with focus trap",
  },
  Drawer: {
    name: "Drawer",
    category: "components",
    files: ["soluid/Drawer.tsx", "soluid/Drawer.css"],
    dependencies: ["core"],
    description: "Side panel with focus trap",
  },
  Alert: {
    name: "Alert",
    category: "components",
    files: ["soluid/Alert.tsx", "soluid/Alert.css"],
    dependencies: ["core"],
    description: "Inline notification",
  },
  Toast: {
    name: "Toast",
    category: "components",
    files: ["soluid/Toast.tsx", "soluid/Toast.css"],
    dependencies: ["core"],
    description: "Toast notification with queue",
  },
  Progress: {
    name: "Progress",
    category: "components",
    files: ["soluid/Progress.tsx", "soluid/Progress.css"],
    dependencies: ["core"],
    description: "Progress bar",
  },
  Spinner: {
    name: "Spinner",
    category: "components",
    files: ["soluid/Spinner.tsx", "soluid/Spinner.css"],
    dependencies: ["core"],
    description: "Loading spinner",
  },

  // --- Navigation ---
  Tabs: {
    name: "Tabs",
    category: "components",
    files: ["soluid/Tabs.tsx", "soluid/Tabs.css"],
    dependencies: ["core"],
    description: "Tab navigation",
  },
  Breadcrumb: {
    name: "Breadcrumb",
    category: "components",
    files: ["soluid/Breadcrumb.tsx", "soluid/Breadcrumb.css"],
    dependencies: ["core"],
    description: "Breadcrumb navigation",
  },
  Pagination: {
    name: "Pagination",
    category: "components",
    files: ["soluid/Pagination.tsx", "soluid/Pagination.css"],
    dependencies: ["core"],
    description: "Page navigation",
  },
  Menu: {
    name: "Menu",
    category: "components",
    files: ["soluid/Menu.tsx", "soluid/Menu.css"],
    dependencies: ["core"],
    npmDependencies: ["@floating-ui/dom"],
    description: "Dropdown menu with keyboard navigation",
  },

  // --- Utility ---
  VisuallyHidden: {
    name: "VisuallyHidden",
    category: "components",
    files: ["soluid/VisuallyHidden.tsx", "soluid/VisuallyHidden.css"],
    dependencies: [],
    description: "Screen reader only content",
  },
  Popover: {
    name: "Popover",
    category: "components",
    files: ["soluid/Popover.tsx", "soluid/Popover.css"],
    dependencies: ["core"],
    npmDependencies: ["@floating-ui/dom"],
    description: "Floating element with trigger and panel",
  },
  Accordion: {
    name: "Accordion",
    category: "components",
    files: ["soluid/Accordion.tsx", "soluid/Accordion.css"],
    dependencies: ["core"],
    description: "Collapsible content sections",
  },
  Avatar: {
    name: "Avatar",
    category: "components",
    files: ["soluid/Avatar.tsx", "soluid/Avatar.css"],
    dependencies: ["core"],
    description: "User avatar with image and initials fallback",
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
