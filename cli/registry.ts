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
      "soluid/core/createOverlay.ts",
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
  Container: {
    name: "Container",
    category: "components",
    files: ["soluid/Container.tsx", "soluid/Container.css"],
    dependencies: ["core"],
    description: "Centered page wrapper with a max width",
  },
  Grid: {
    name: "Grid",
    category: "components",
    files: ["soluid/Grid.tsx", "soluid/Grid.css"],
    dependencies: ["core"],
    description: "CSS grid with fixed or auto-fitting columns",
  },
  AspectRatio: {
    name: "AspectRatio",
    category: "components",
    files: ["soluid/AspectRatio.tsx", "soluid/AspectRatio.css"],
    dependencies: ["core"],
    description: "Box that reserves a fixed width-to-height ratio",
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
    files: ["soluid/FormField.tsx", "soluid/FormField.css", "soluid/FormFieldContext.ts"],
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
    files: ["soluid/Checkbox.tsx", "soluid/Checkbox.css", "soluid/CheckboxGroupContext.ts"],
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
  AvatarGroup: {
    name: "AvatarGroup",
    category: "components",
    files: ["soluid/AvatarGroup.tsx", "soluid/AvatarGroup.css"],
    dependencies: ["core", "Avatar"],
    description: "Overlapping avatars with a +N overflow chip",
  },
  Text: {
    name: "Text",
    category: "components",
    files: ["soluid/Text.tsx", "soluid/Text.css"],
    dependencies: ["core"],
    description: "Body text with size, weight and tone",
  },
  Heading: {
    name: "Heading",
    category: "components",
    files: ["soluid/Heading.tsx", "soluid/Heading.css"],
    dependencies: ["core"],
    description: "h1-h6 heading with visual size decoupled from level",
  },
  Link: {
    name: "Link",
    category: "components",
    files: ["soluid/Link.tsx", "soluid/Link.css"],
    dependencies: ["core", "VisuallyHidden"],
    description: "Styled anchor with external-link handling",
  },
  Kbd: {
    name: "Kbd",
    category: "components",
    files: ["soluid/Kbd.tsx", "soluid/Kbd.css"],
    dependencies: ["core"],
    description: "Keyboard key display",
  },
  ButtonGroup: {
    name: "ButtonGroup",
    category: "components",
    files: ["soluid/ButtonGroup.tsx", "soluid/ButtonGroup.css"],
    dependencies: ["core"],
    description: "Joins adjacent buttons into one visual unit",
  },
  SegmentedControl: {
    name: "SegmentedControl",
    category: "components",
    files: ["soluid/SegmentedControl.tsx", "soluid/SegmentedControl.css"],
    dependencies: ["core"],
    description: "Exclusive choice between a few options",
  },
  Stat: {
    name: "Stat",
    category: "components",
    files: ["soluid/Stat.tsx", "soluid/Stat.css"],
    dependencies: ["core"],
    description: "Metric with label, value and change indicator",
  },
  Collapsible: {
    name: "Collapsible",
    category: "components",
    files: ["soluid/Collapsible.tsx", "soluid/Collapsible.css"],
    dependencies: ["core"],
    description: "Controlled single disclosure section",
  },
  Slider: {
    name: "Slider",
    category: "components",
    files: ["soluid/Slider.tsx", "soluid/Slider.css"],
    dependencies: ["core", "FormField"],
    description: "Range input with optional value readout",
  },
  SearchField: {
    name: "SearchField",
    category: "components",
    files: ["soluid/SearchField.tsx", "soluid/SearchField.css"],
    dependencies: ["core", "FormField", "TextField"],
    description: "Text input with a search icon and clear button",
  },
  PinInput: {
    name: "PinInput",
    category: "components",
    files: ["soluid/PinInput.tsx", "soluid/PinInput.css"],
    dependencies: ["core"],
    description: "One-time code entry with paste and arrow-key support",
  },
  Rating: {
    name: "Rating",
    category: "components",
    files: ["soluid/Rating.tsx", "soluid/Rating.css"],
    dependencies: ["core"],
    description: "Star rating, interactive or read-only",
  },
  FileUpload: {
    name: "FileUpload",
    category: "components",
    files: ["soluid/FileUpload.tsx", "soluid/FileUpload.css"],
    dependencies: ["core"],
    description: "Drop zone and file picker with a selected-file list",
  },
  Combobox: {
    name: "Combobox",
    category: "components",
    files: ["soluid/Combobox.tsx", "soluid/Combobox.css"],
    dependencies: ["core", "FormField", "VisuallyHidden"],
    npmDependencies: ["@floating-ui/dom"],
    description: "Filterable single-select with a listbox popup",
  },
  Steps: {
    name: "Steps",
    category: "components",
    files: ["soluid/Steps.tsx", "soluid/Steps.css"],
    dependencies: ["core", "VisuallyHidden"],
    description: "Progress indicator for a multi-step flow",
  },
  Timeline: {
    name: "Timeline",
    category: "components",
    files: ["soluid/Timeline.tsx", "soluid/Timeline.css"],
    dependencies: ["core"],
    description: "Chronological list of events",
  },
  Tree: {
    name: "Tree",
    category: "components",
    files: ["soluid/Tree.tsx", "soluid/Tree.css"],
    dependencies: ["core"],
    description: "Hierarchical list with keyboard navigation",
  },
  ContextMenu: {
    name: "ContextMenu",
    category: "components",
    files: ["soluid/ContextMenu.tsx", "soluid/ContextMenu.css"],
    dependencies: ["core", "Menu"],
    npmDependencies: ["@floating-ui/dom"],
    description: "Right-click menu anchored to the pointer",
  },
  Calendar: {
    name: "Calendar",
    category: "components",
    files: ["soluid/Calendar.tsx", "soluid/Calendar.css"],
    dependencies: ["core"],
    description: "Month grid with keyboard navigation",
  },
  DatePicker: {
    name: "DatePicker",
    category: "components",
    files: ["soluid/DatePicker.tsx", "soluid/DatePicker.css"],
    dependencies: ["core", "FormField", "Calendar"],
    npmDependencies: ["@floating-ui/dom"],
    description: "Date field backed by a calendar popover",
  },
  TimePicker: {
    name: "TimePicker",
    category: "components",
    files: ["soluid/TimePicker.tsx", "soluid/TimePicker.css"],
    dependencies: ["core", "FormField"],
    npmDependencies: ["@floating-ui/dom"],
    description: "Time field backed by a stepped listbox",
  },
  ColorPicker: {
    name: "ColorPicker",
    category: "components",
    files: ["soluid/ColorPicker.tsx", "soluid/ColorPicker.css"],
    dependencies: ["core", "FormField"],
    npmDependencies: ["@floating-ui/dom"],
    description: "Swatch palette with a hex field and native picker",
  },
  CommandPalette: {
    name: "CommandPalette",
    category: "components",
    files: ["soluid/CommandPalette.tsx", "soluid/CommandPalette.css"],
    dependencies: ["core"],
    description: "Searchable command list in a modal overlay",
  },
  Carousel: {
    name: "Carousel",
    category: "components",
    files: ["soluid/Carousel.tsx", "soluid/Carousel.css"],
    dependencies: ["core"],
    description: "Scroll-snapping slides with dots and arrows",
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
