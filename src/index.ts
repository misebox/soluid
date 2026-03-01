// Core
export { createTheme, SolidoutProvider, useSolidout } from "./core";
export type {
  ButtonVariant,
  ColorDefinition,
  CommonProps,
  DateFormatConfig,
  Density,
  FeedbackVariant,
  InteractiveProps,
  Size,
  SolidoutContextValue,
  SolidoutProviderProps,
  ThemeConfig,
  Variant,
  VariantProps,
} from "./core";

// Primitives
export { createDisclosure, createFocusTrap, createPagination, createToast, createToggle } from "./primitives";
export type {
  DisclosureOptions,
  DisclosureReturn,
  FocusTrapOptions,
  PaginationOptions,
  PaginationReturn,
  Toast,
  ToastInput,
  ToastOptions,
  ToastReturn,
  ToggleOptions,
  ToggleReturn,
} from "./primitives";

// Layout
export { Divider, HStack, Spacer, Stack } from "./components/layout";
export type { DividerProps, HStackProps, StackProps } from "./components/layout";

// General
export { Badge, Button, IconButton, Tag, Tooltip } from "./components/general";
export type { BadgeProps, ButtonProps, IconButtonProps, TagProps, TooltipProps } from "./components/general";

// Form
export {
  Checkbox,
  CheckboxGroup,
  FormField,
  NumberInput,
  RadioButton,
  RadioGroup,
  Select,
  Switch,
  TextArea,
  TextField,
} from "./components/form";
export type {
  CheckboxGroupProps,
  CheckboxProps,
  FormFieldProps,
  NumberInputProps,
  RadioButtonProps,
  RadioGroupProps,
  SelectProps,
  SwitchProps,
  TextAreaProps,
  TextFieldProps,
} from "./components/form";

// Data Display
export {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  DescriptionList,
  EmptyState,
  Skeleton,
  Table,
} from "./components/data";
export type {
  CardProps,
  Column,
  DescriptionListProps,
  EmptyStateProps,
  SkeletonProps,
  TableProps,
} from "./components/data";

// Feedback
export {
  Alert,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Drawer,
  Progress,
  Spinner,
  ToastContainer,
  useToast,
} from "./components/feedback";
export type {
  AlertProps,
  DialogProps,
  DrawerProps,
  ProgressProps,
  SpinnerProps,
  ToastContainerProps,
} from "./components/feedback";

// Navigation
export { Breadcrumb, BreadcrumbItem, Menu, Pagination, Tab, TabList, TabPanel, Tabs } from "./components/navigation";
export type {
  BreadcrumbItemProps,
  BreadcrumbProps,
  MenuProps,
  PaginationProps,
  TabsProps,
} from "./components/navigation";

// Utility
export { Popover, VisuallyHidden } from "./components/utility";
export type { PopoverProps, VisuallyHiddenProps } from "./components/utility";
