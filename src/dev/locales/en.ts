export const en: Record<string, string> = {
  // AccordionItemProps
  "AccordionItemProps.title": "Header text for the accordion item",
  "AccordionItemProps.open": "Whether the item is expanded",
  "AccordionItemProps.disabled": "Disable expand/collapse",
  "AccordionItemProps.class": "Additional CSS class",
  "AccordionItemProps.children": "Content shown when expanded",

  // AccordionProps
  "AccordionProps.children": "AccordionItem elements",
  "AccordionProps.class": "Additional CSS class",
  "AccordionProps.density": "Component density",

  // AlertProps
  "AlertProps.variant": "Visual style: success, danger, warning, info",
  "AlertProps.children": "Alert content",
  "AlertProps.onDismiss": "Callback when dismiss button is clicked",
  "AlertProps.dismissLabel": "Accessible label for the dismiss button",
  "AlertProps.class": "Additional CSS class",
  "AlertProps.density": "Component density",

  // AspectRatioProps
  "AspectRatioProps.ratio": "Width divided by height, e.g. 16 / 9",
  "AspectRatioProps.children": "Content stretched to fill the reserved box",
  "AspectRatioProps.class": "Additional CSS class",
  "AspectRatioProps.density": "Component density",

  // AvatarGroupProps
  "AvatarGroupProps.max": "Avatars shown before the rest collapse into a +N chip",
  "AvatarGroupProps.size": "Size of the overflow chip; match the Avatar size",
  "AvatarGroupProps.overflowLabel": "Builds the accessible label for the overflow chip",
  "AvatarGroupProps.children": "Avatar elements",
  "AvatarGroupProps.class": "Additional CSS class",
  "AvatarGroupProps.density": "Component density",

  // AvatarProps
  "AvatarProps.src": "Image URL",
  "AvatarProps.alt": "Alt text for the image",
  "AvatarProps.name": "Name used for initials fallback",
  "AvatarProps.size": "Avatar size",
  "AvatarProps.variant": "Color variant",
  "AvatarProps.class": "Additional CSS class",
  "AvatarProps.density": "Component density",

  // BadgeProps
  "BadgeProps.variant": "Color variant",
  "BadgeProps.fill": "Fill style: subtle or solid",
  "BadgeProps.size": "Badge size",
  "BadgeProps.children": "Badge content",
  "BadgeProps.class": "Additional CSS class",
  "BadgeProps.density": "Component density",

  // BreadcrumbItemProps
  "BreadcrumbItemProps.href": "Link URL",
  "BreadcrumbItemProps.current": "Mark as current page",
  "BreadcrumbItemProps.class": "Additional CSS class",
  "BreadcrumbItemProps.children": "Breadcrumb label",

  // BreadcrumbProps
  "BreadcrumbProps.children": "BreadcrumbItem elements",
  "BreadcrumbProps.label": "Accessible label for the navigation landmark",
  "BreadcrumbProps.class": "Additional CSS class",
  "BreadcrumbProps.density": "Component density",

  // ButtonProps
  "ButtonProps.iconLeft": "Icon placed before the label",
  "ButtonProps.iconRight": "Icon placed after the label",
  "ButtonProps.loading": "Show loading spinner and disable",
  "ButtonProps.children": "Button label",
  "ButtonProps.variant": "Visual style: primary, neutral, danger, ghost",
  "ButtonProps.disabled": "Disable interaction",
  "ButtonProps.size": "Button size",
  "ButtonProps.class": "Additional CSS class",
  "ButtonProps.density": "Component density",

  // ButtonGroupProps
  "ButtonGroupProps.orientation": "Lay the buttons out horizontally or vertically",
  "ButtonGroupProps.attached": "Join the buttons into one visual unit",
  "ButtonGroupProps.label": "Accessible label describing the group of actions",
  "ButtonGroupProps.children": "Button elements",
  "ButtonGroupProps.class": "Additional CSS class",
  "ButtonGroupProps.density": "Component density",

  // CalendarProps
  "CalendarProps.value": "Selected day as YYYY-MM-DD",
  "CalendarProps.onChange": "Callback when a day is chosen",
  "CalendarProps.month": "Visible month as YYYY-MM; omit to let the calendar manage it",
  "CalendarProps.onMonthChange": "Callback when the visible month changes",
  "CalendarProps.min": "Earliest selectable day, inclusive",
  "CalendarProps.max": "Latest selectable day, inclusive",
  "CalendarProps.weekStartsOn": "First column of the week: 0 Sunday, 1 Monday",
  "CalendarProps.locale": "BCP 47 tag for month and weekday names",
  "CalendarProps.label": "Accessible label for the grid",
  "CalendarProps.previousLabel": "Accessible label for the previous-month button",
  "CalendarProps.nextLabel": "Accessible label for the next-month button",
  "CalendarProps.class": "Additional CSS class",
  "CalendarProps.density": "Component density",

  // CarouselProps
  "CarouselProps.index": "Index of the visible slide",
  "CarouselProps.onIndexChange": "Callback when the slide changes, including on swipe",
  "CarouselProps.loop": "Wrap around at either end",
  "CarouselProps.hideDots": "Hide the dot indicators",
  "CarouselProps.label": "Accessible label for the carousel region",
  "CarouselProps.previousLabel": "Accessible label for the previous-slide button",
  "CarouselProps.nextLabel": "Accessible label for the next-slide button",
  "CarouselProps.dotLabel": "Builds the accessible label for a slide and its dot",
  "CarouselProps.children": "One element per slide",
  "CarouselProps.class": "Additional CSS class",
  "CarouselProps.density": "Component density",

  // CardBodyProps
  "CardBodyProps.class": "Additional CSS class",
  "CardBodyProps.children": "Card body content",

  // CardFooterProps
  "CardFooterProps.class": "Additional CSS class",
  "CardFooterProps.children": "Card footer content",

  // CardHeaderProps
  "CardHeaderProps.class": "Additional CSS class",
  "CardHeaderProps.children": "Card header content",

  // CardProps
  "CardProps.variant": "Card style: outlined or elevated",
  "CardProps.children": "Card content (Header, Body, Footer)",
  "CardProps.class": "Additional CSS class",
  "CardProps.density": "Component density",

  // CheckboxGroupProps
  "CheckboxGroupProps.value": "Selected values array",
  "CheckboxGroupProps.onChange": "Callback when selection changes",
  "CheckboxGroupProps.label": "Group label",
  "CheckboxGroupProps.error": "Error message",
  "CheckboxGroupProps.hint": "Hint text",
  "CheckboxGroupProps.children": "Checkbox elements",
  "CheckboxGroupProps.class": "Additional CSS class",
  "CheckboxGroupProps.density": "Component density",

  // CheckboxProps
  "CheckboxProps.checked": "Whether the checkbox is checked",
  "CheckboxProps.onChange": "Callback when checked state changes",
  "CheckboxProps.indeterminate": "Show indeterminate state",
  "CheckboxProps.disabled": "Disable interaction",
  "CheckboxProps.size": "Checkbox size",
  "CheckboxProps.label": "Label text",
  "CheckboxProps.value": "Value used in CheckboxGroup",
  "CheckboxProps.error": "Error message",
  "CheckboxProps.hint": "Hint text",
  "CheckboxProps.children": "Custom label content",
  "CheckboxProps.class": "Additional CSS class",
  "CheckboxProps.density": "Component density",

  // CollapsibleProps
  "CollapsibleProps.open": "Whether the panel is expanded",
  "CollapsibleProps.onOpenChange": "Callback when the trigger is activated",
  "CollapsibleProps.title": "Trigger content",
  "CollapsibleProps.disabled": "Disable the trigger",
  "CollapsibleProps.children": "Content shown when expanded",
  "CollapsibleProps.class": "Additional CSS class",
  "CollapsibleProps.density": "Component density",

  // ColorPickerControlProps
  "ColorPickerControlProps.value": "Selected colour as #rrggbb",
  "ColorPickerControlProps.onChange": "Callback when the colour changes",
  "ColorPickerControlProps.swatches": "Preset colours offered in the panel",
  "ColorPickerControlProps.required": "Mark the field as required",
  "ColorPickerControlProps.id": "Id for the trigger when used outside a FormField",
  "ColorPickerControlProps.panelLabel": "Accessible label for the panel",
  "ColorPickerControlProps.swatchLabel": "Builds the accessible label for a preset",
  "ColorPickerControlProps.customLabel": "Label for the native colour input",
  "ColorPickerControlProps.hexLabel": "Label for the hex text field",

  // ColorPickerProps
  "ColorPickerProps.label": "Field label",
  "ColorPickerProps.error": "Error message",
  "ColorPickerProps.hint": "Hint text",

  // CommandPaletteProps
  "CommandPaletteProps.open": "Whether the palette is visible",
  "CommandPaletteProps.onOpenChange": "Callback when the palette opens or closes",
  "CommandPaletteProps.commands": "Commands to offer, in display order",
  "CommandPaletteProps.onSelect": "Callback with the chosen command",
  "CommandPaletteProps.placeholder": "Placeholder for the search field",
  "CommandPaletteProps.emptyLabel": "Text shown when nothing matches",
  "CommandPaletteProps.label": "Accessible label for the dialog",
  "CommandPaletteProps.filter": "Overrides the default match over label and keywords",

  // ComboboxControlProps
  "ComboboxControlProps.value": "Currently selected value",
  "ComboboxControlProps.onChange": "Callback when an option is chosen",
  "ComboboxControlProps.options": "Array of selectable options",
  "ComboboxControlProps.placeholder": "Placeholder shown when nothing is selected",
  "ComboboxControlProps.required": "Mark the input as required",
  "ComboboxControlProps.id": "Id for the input when used outside a FormField",
  "ComboboxControlProps.emptyLabel": "Text shown when the query matches nothing",
  "ComboboxControlProps.filter": "Overrides the default case-insensitive substring match",

  // ComboboxProps
  "ComboboxProps.label": "Field label",
  "ComboboxProps.error": "Error message",
  "ComboboxProps.hint": "Hint text",

  // ContextMenuProps
  "ContextMenuProps.content": "Menu body, composed from MenuItem and MenuSeparator",
  "ContextMenuProps.label": "Accessible label for the menu",
  "ContextMenuProps.children": "Region that responds to a right-click",
  "ContextMenuProps.class": "Additional CSS class",
  "ContextMenuProps.density": "Component density",

  // ContainerProps
  "ContainerProps.size": "Maximum content width",
  "ContainerProps.padded": "Apply horizontal padding inside the container",
  "ContainerProps.children": "Page content",
  "ContainerProps.class": "Additional CSS class",
  "ContainerProps.density": "Component density",

  // DatePickerControlProps
  "DatePickerControlProps.value": "Selected day as YYYY-MM-DD",
  "DatePickerControlProps.onChange": "Callback when a day is chosen",
  "DatePickerControlProps.min": "Earliest selectable day, inclusive",
  "DatePickerControlProps.max": "Latest selectable day, inclusive",
  "DatePickerControlProps.weekStartsOn": "First column of the week: 0 Sunday, 1 Monday",
  "DatePickerControlProps.locale": "BCP 47 tag for month and weekday names",
  "DatePickerControlProps.placeholder": "Text shown while nothing is selected",
  "DatePickerControlProps.required": "Mark the field as required",
  "DatePickerControlProps.id": "Id for the trigger when used outside a FormField",
  "DatePickerControlProps.name": "Form field name",
  "DatePickerControlProps.format": "Formats the value for the field",
  "DatePickerControlProps.openLabel": "Accessible label for the calendar popover",

  // DatePickerProps
  "DatePickerProps.label": "Field label",
  "DatePickerProps.error": "Error message",
  "DatePickerProps.hint": "Hint text",

  // DescriptionListProps
  "DescriptionListProps.items": "Array of { term, description } pairs",
  "DescriptionListProps.columns": "Number of columns (1 or 2)",
  "DescriptionListProps.class": "Additional CSS class",
  "DescriptionListProps.density": "Component density",

  // DialogBodyProps
  "DialogBodyProps.class": "Additional CSS class",
  "DialogBodyProps.children": "Dialog body content",

  // DialogFooterProps
  "DialogFooterProps.class": "Additional CSS class",
  "DialogFooterProps.children": "Dialog footer content",

  // DialogHeaderProps
  "DialogHeaderProps.class": "Additional CSS class",
  "DialogHeaderProps.children": "Dialog header content",

  // DialogProps
  "DialogProps.open": "Whether the dialog is visible",
  "DialogProps.onClose": "Callback to close the dialog",
  "DialogProps.size": "Dialog width: sm, md, lg",
  "DialogProps.children": "Dialog content (Header, Body, Footer)",
  "DialogProps.class": "Additional CSS class",
  "DialogProps.density": "Component density",

  // DividerProps
  "DividerProps.orientation": "Horizontal or vertical",
  "DividerProps.class": "Additional CSS class",
  "DividerProps.density": "Component density",

  // DrawerHeaderProps
  "DrawerHeaderProps.class": "Additional CSS class",
  "DrawerHeaderProps.children": "Drawer header content",

  // DrawerProps
  "DrawerProps.open": "Whether the drawer is visible",
  "DrawerProps.onClose": "Callback to close the drawer",
  "DrawerProps.side": "Slide in from left or right",
  "DrawerProps.size": "Drawer width: sm, md, lg",
  "DrawerProps.children": "Drawer content",
  "DrawerProps.class": "Additional CSS class",
  "DrawerProps.density": "Component density",

  // EmptyStateProps
  "EmptyStateProps.title": "Main message",
  "EmptyStateProps.description": "Supporting text",
  "EmptyStateProps.icon": "Icon element",
  "EmptyStateProps.action": "Action element (e.g. button)",
  "EmptyStateProps.class": "Additional CSS class",
  "EmptyStateProps.density": "Component density",

  // FileUploadProps
  "FileUploadProps.onSelect": "Callback with the files added by drop or picker",
  "FileUploadProps.accept": "Accept attribute forwarded to the file input",
  "FileUploadProps.multiple": "Allow selecting more than one file",
  "FileUploadProps.disabled": "Disable the drop zone and picker",
  "FileUploadProps.label": "Instruction shown inside the drop zone",
  "FileUploadProps.hint": "Secondary text under the instruction",
  "FileUploadProps.files": "Files listed under the drop zone",
  "FileUploadProps.onRemove": "Callback when a listed file is removed",
  "FileUploadProps.removeLabel": "Builds the accessible label for a remove button",
  "FileUploadProps.class": "Additional CSS class",
  "FileUploadProps.density": "Component density",

  // FormFieldProps
  "FormFieldProps.label": "Field label",
  "FormFieldProps.error": "Error message",
  "FormFieldProps.hint": "Hint text",
  "FormFieldProps.required": "Show required indicator",
  "FormFieldProps.children": "Form input element",
  "FormFieldProps.class": "Additional CSS class",
  "FormFieldProps.density": "Component density",

  // GridProps
  "GridProps.columns": "Fixed column count; ignored when minItemWidth is set",
  "GridProps.minItemWidth": "Responsive mode: fit as many columns at least this wide as possible",
  "GridProps.gap": "Gap between cells",
  "GridProps.align": "Vertical alignment of cells",
  "GridProps.children": "Grid cells",
  "GridProps.class": "Additional CSS class",
  "GridProps.density": "Component density",

  // HeadingProps
  "HeadingProps.level": "Document outline level, rendered as h1-h6",
  "HeadingProps.size": "Visual size, independent of level",
  "HeadingProps.children": "Heading text",
  "HeadingProps.class": "Additional CSS class",
  "HeadingProps.density": "Component density",

  // HStackProps
  "HStackProps.gap": "Gap spacing level (1-6)",
  "HStackProps.align": "Cross-axis alignment",
  "HStackProps.justify": "Main-axis alignment",
  "HStackProps.wrap": "Allow items to wrap",
  "HStackProps.children": "Child elements",
  "HStackProps.class": "Additional CSS class",
  "HStackProps.density": "Component density",

  // IconButtonProps
  "IconButtonProps.icon": "Icon element",
  "IconButtonProps.aria-label": "Accessible label (required)",
  "IconButtonProps.variant": "Visual style: primary, neutral, danger, ghost",
  "IconButtonProps.disabled": "Disable interaction",
  "IconButtonProps.size": "Button size",
  "IconButtonProps.class": "Additional CSS class",
  "IconButtonProps.density": "Component density",

  // KbdProps
  "KbdProps.size": "Key size",
  "KbdProps.children": "Key label",
  "KbdProps.class": "Additional CSS class",
  "KbdProps.density": "Component density",

  // LinkProps
  "LinkProps.href": "Destination URL",
  "LinkProps.external": "Open in a new tab with the matching rel attribute",
  "LinkProps.externalLabel": "Text appended for screen readers on external links",
  "LinkProps.underline": "When to underline: always, hover or none",
  "LinkProps.tone": "Colour role: primary, neutral or danger",
  "LinkProps.children": "Link text",
  "LinkProps.class": "Additional CSS class",
  "LinkProps.density": "Component density",

  // MenuItemProps
  "MenuItemProps.class": "Additional CSS class",
  "MenuItemProps.disabled": "Disable interaction",
  "MenuItemProps.onSelect": "Callback when selected",
  "MenuItemProps.children": "Menu item label",

  // MenuProps
  "MenuProps.open": "Whether the menu is open",
  "MenuProps.onOpenChange": "Callback when open state changes",
  "MenuProps.placement": "Dropdown placement",
  "MenuProps.trigger": "Trigger element (e.g. button)",
  "MenuProps.children": "MenuItem elements",
  "MenuProps.class": "Additional CSS class",
  "MenuProps.density": "Component density",

  // MenuSeparatorProps
  "MenuSeparatorProps.class": "Additional CSS class",

  // NumberInputProps
  "NumberInputProps.value": "Current numeric value",
  "NumberInputProps.onInput": "Callback when value changes",
  "NumberInputProps.min": "Minimum allowed value",
  "NumberInputProps.max": "Maximum allowed value",
  "NumberInputProps.step": "Step increment",
  "NumberInputProps.label": "Field label",
  "NumberInputProps.error": "Error message",
  "NumberInputProps.hint": "Hint text",
  "NumberInputProps.required": "Show required indicator",
  "NumberInputProps.disabled": "Disable interaction",
  "NumberInputProps.size": "Input size",
  "NumberInputProps.class": "Additional CSS class",
  "NumberInputProps.density": "Component density",

  // PaginationProps
  "PaginationProps.page": "Current page number",
  "PaginationProps.totalPages": "Total number of pages",
  "PaginationProps.onChange": "Callback when page changes",
  "PaginationProps.size": "Button size",
  "PaginationProps.showPages": "Show page number buttons",
  "PaginationProps.maxVisible": "Max visible page buttons",
  "PaginationProps.label": "Accessible label for the navigation landmark",
  "PaginationProps.previousLabel": "Text and accessible label for the previous-page button",
  "PaginationProps.nextLabel": "Text and accessible label for the next-page button",
  "PaginationProps.pageLabel": "Builds the accessible label for a numbered page button",
  "PaginationProps.class": "Additional CSS class",
  "PaginationProps.density": "Component density",

  // PinInputProps
  "PinInputProps.value": "One entry per box, empty string for a blank box",
  "PinInputProps.onChange": "Callback when any box changes",
  "PinInputProps.length": "Number of boxes",
  "PinInputProps.type": "Characters accepted: numeric or alphanumeric",
  "PinInputProps.mask": "Render entered characters as dots",
  "PinInputProps.disabled": "Disable every box",
  "PinInputProps.label": "Accessible label for the group",
  "PinInputProps.itemLabel": "Builds the accessible label for each box",
  "PinInputProps.onComplete": "Called with the joined value once every box is filled",
  "PinInputProps.class": "Additional CSS class",
  "PinInputProps.density": "Component density",

  // PopoverProps
  "PopoverProps.open": "Whether the popover is visible",
  "PopoverProps.onOpenChange": "Callback when open state changes",
  "PopoverProps.placement": "Popover placement",
  "PopoverProps.children": "Trigger element",
  "PopoverProps.content": "Popover content",
  "PopoverProps.class": "Additional CSS class",
  "PopoverProps.density": "Component density",

  // ProgressProps
  "ProgressProps.value": "Progress percentage (0-100)",
  "ProgressProps.segments": "Multi-segment mode; overrides value and variant",
  "ProgressProps.variant": "Color variant",
  "ProgressProps.size": "Bar height",
  "ProgressProps.aria-label": "Accessible label",
  "ProgressProps.class": "Additional CSS class",
  "ProgressProps.density": "Component density",

  // RadioButtonProps
  "RadioButtonProps.value": "Option value",
  "RadioButtonProps.label": "Label text",
  "RadioButtonProps.disabled": "Disable this option",
  "RadioButtonProps.children": "Custom label content",
  "RadioButtonProps.class": "Additional CSS class",
  "RadioButtonProps.density": "Component density",

  // RadioGroupProps
  "RadioGroupProps.value": "Currently selected value",
  "RadioGroupProps.onChange": "Callback when selection changes",
  "RadioGroupProps.name": "Form field name",
  "RadioGroupProps.label": "Group label",
  "RadioGroupProps.error": "Error message",
  "RadioGroupProps.hint": "Hint text",
  "RadioGroupProps.children": "RadioButton elements",
  "RadioGroupProps.class": "Additional CSS class",
  "RadioGroupProps.density": "Component density",

  // RatingProps
  "RatingProps.value": "Current rating; 0 means unrated",
  "RatingProps.onChange": "Callback when a rating is chosen",
  "RatingProps.max": "Number of items",
  "RatingProps.readOnly": "Render as a static indicator with no controls",
  "RatingProps.disabled": "Disable interaction",
  "RatingProps.size": "Item size",
  "RatingProps.label": "Accessible label for the group",
  "RatingProps.itemLabel": "Builds the accessible label for each item",
  "RatingProps.class": "Additional CSS class",
  "RatingProps.density": "Component density",

  // SearchFieldProps
  "SearchFieldProps.value": "Current query text",
  "SearchFieldProps.onInput": "Callback on every keystroke",
  "SearchFieldProps.onSearch": "Callback when Enter is pressed",
  "SearchFieldProps.onClear": "Callback when the clear button is pressed",
  "SearchFieldProps.clearLabel": "Accessible label for the clear button",
  "SearchFieldProps.label": "Field label",
  "SearchFieldProps.error": "Error message",
  "SearchFieldProps.hint": "Hint text",

  // SegmentedControlProps
  "SegmentedControlProps.value": "Currently selected value",
  "SegmentedControlProps.onChange": "Callback when the selection changes",
  "SegmentedControlProps.options": "Array of selectable segments",
  "SegmentedControlProps.size": "Control height",
  "SegmentedControlProps.label": "Accessible label describing what is being chosen",
  "SegmentedControlProps.fullWidth": "Stretch the segments to fill the available width",
  "SegmentedControlProps.class": "Additional CSS class",
  "SegmentedControlProps.density": "Component density",

  // SelectProps
  "SelectProps.value": "Currently selected value",
  "SelectProps.onChange": "Callback when selection changes",
  "SelectProps.options": "Array of selectable options",
  "SelectInputProps.value": "Currently selected value",
  "SelectInputProps.onChange": "Callback when the selection changes",
  "SelectInputProps.options": "Array of selectable options",
  "SelectInputProps.placeholder": "Placeholder option shown when nothing is selected",
  "TextFieldInputProps.value": "Current text value",
  "TextFieldInputProps.onInput": "Callback on every keystroke",
  "TextFieldInputProps.type": "Input type: text, email, password, url or tel",
  "TextAreaInputProps.value": "Current text value",
  "TextAreaInputProps.onInput": "Callback on every keystroke",
  "SelectProps.placeholder": "Placeholder text",
  "SelectProps.label": "Field label",
  "SelectProps.error": "Error message",
  "SelectProps.hint": "Hint text",
  "SelectProps.required": "Show required indicator",
  "SelectProps.disabled": "Disable interaction",
  "SelectProps.size": "Input size",
  "SelectProps.class": "Additional CSS class",
  "SelectProps.density": "Component density",

  // SkeletonProps
  "SkeletonProps.variant": "Shape: text, circle, rect",
  "SkeletonProps.width": "Custom width",
  "SkeletonProps.height": "Custom height",
  "SkeletonProps.class": "Additional CSS class",
  "SkeletonProps.density": "Component density",

  // SpinnerProps
  "SpinnerProps.size": "Spinner size",
  "SpinnerProps.variant": "Color: primary or neutral",
  "SpinnerProps.label": "Accessible label announced while loading",
  "SpinnerProps.class": "Additional CSS class",
  "SpinnerProps.density": "Component density",

  // StackProps
  "StackProps.gap": "Gap spacing level (1-6)",
  "StackProps.align": "Cross-axis alignment",
  "StackProps.justify": "Main-axis alignment",
  "StackProps.children": "Child elements",
  "StackProps.class": "Additional CSS class",
  "StackProps.density": "Component density",

  // SliderInputProps
  "SliderInputProps.value": "Current value",
  "SliderInputProps.onInput": "Callback as the thumb moves",
  "SliderInputProps.min": "Minimum value",
  "SliderInputProps.max": "Maximum value",
  "SliderInputProps.step": "Increment between values",
  "SliderInputProps.showValue": "Show the current value next to the track",
  "SliderInputProps.formatValue": "Formats the value for display and aria-valuetext",

  // SliderProps
  "SliderProps.label": "Field label",
  "SliderProps.error": "Error message",
  "SliderProps.hint": "Hint text",

  // StatProps
  "StatProps.label": "Name of the metric",
  "StatProps.value": "Metric value",
  "StatProps.hint": "Secondary text under the value",
  "StatProps.delta": 'Change indicator, e.g. "+12.5%"',
  "StatProps.deltaTone": "Colour of the change indicator",
  "StatProps.icon": "Decorative icon shown beside the metric",
  "StatProps.class": "Additional CSS class",
  "StatProps.density": "Component density",

  // StepsProps
  "StepsProps.steps": "Array of { label, description } entries",
  "StepsProps.current": "Zero-based index of the active step",
  "StepsProps.orientation": "Lay the steps out horizontally or vertically",
  "StepsProps.label": "Accessible label for the step list",
  "StepsProps.completedLabel": "Text announced for steps before the current one",
  "StepsProps.class": "Additional CSS class",
  "StepsProps.density": "Component density",

  // SwitchProps
  "SwitchProps.checked": "Whether the switch is on",
  "SwitchProps.onChange": "Callback when toggled",
  "SwitchProps.disabled": "Disable interaction",
  "SwitchProps.size": "Switch size",
  "SwitchProps.label": "Label text",
  "SwitchProps.error": "Error message",
  "SwitchProps.hint": "Hint text",
  "SwitchProps.children": "Custom label content",
  "SwitchProps.class": "Additional CSS class",
  "SwitchProps.density": "Component density",

  // TableProps
  "TableProps.columns": "Column definitions",
  "TableProps.data": "Row data array",
  "TableProps.sortKey": "Current sort column key",
  "TableProps.sortDirection": "Sort direction: asc or desc",
  "TableProps.onSort": "Callback when sort changes",
  "TableProps.selectable": "Enable row selection",
  "TableProps.selectedKeys": "Set of selected row keys",
  "TableProps.onSelect": "Callback when selection changes",
  "TableProps.rowKey": "Function to derive row key",
  "TableProps.selectAllLabel": "Accessible label for the select-all checkbox",
  "TableProps.selectRowLabel": "Builds the accessible label for a row checkbox",
  "TableProps.class": "Additional CSS class",
  "TableProps.density": "Component density",

  // TabListProps
  "TabListProps.class": "Additional CSS class",
  "TabListProps.children": "Tab elements",

  // TabPanelProps
  "TabPanelProps.value": "Panel identifier (matches Tab value)",
  "TabPanelProps.class": "Additional CSS class",
  "TabPanelProps.children": "Panel content",

  // TabProps
  "TabProps.value": "Tab identifier",
  "TabProps.disabled": "Disable this tab",
  "TabProps.class": "Additional CSS class",
  "TabProps.children": "Tab label",

  // TabsProps
  "TabsProps.value": "Currently active tab value",
  "TabsProps.onChange": "Callback when active tab changes",
  "TabsProps.children": "TabList and TabPanel elements",
  "TabsProps.class": "Additional CSS class",
  "TabsProps.density": "Component density",

  // TagProps
  "TagProps.variant": "Color variant",
  "TagProps.fill": "Fill style: subtle or solid",
  "TagProps.size": "Tag size",
  "TagProps.onRemove": "Callback when remove button is clicked",
  "TagProps.removeLabel": "Accessible label for the remove button",
  "TagProps.children": "Tag label",
  "TagProps.class": "Additional CSS class",
  "TagProps.density": "Component density",

  // TextProps
  "TextProps.as": "Element to render",
  "TextProps.size": "Font size",
  "TextProps.weight": "Font weight",
  "TextProps.tone": "Colour role",
  "TextProps.align": "Text alignment",
  "TextProps.truncate": "Clamp to a single line with an ellipsis",
  "TextProps.children": "Text content",
  "TextProps.class": "Additional CSS class",
  "TextProps.density": "Component density",

  // TextAreaProps
  "TextAreaProps.value": "Current text value",
  "TextAreaProps.onInput": "Callback when text changes",
  "TextAreaProps.placeholder": "Placeholder text",
  "TextAreaProps.rows": "Number of visible rows",
  "TextAreaProps.label": "Field label",
  "TextAreaProps.error": "Error message",
  "TextAreaProps.hint": "Hint text",
  "TextAreaProps.required": "Show required indicator",
  "TextAreaProps.disabled": "Disable interaction",
  "TextAreaProps.size": "Input size",
  "TextAreaProps.class": "Additional CSS class",
  "TextAreaProps.density": "Component density",

  // TextFieldProps
  "TextFieldProps.value": "Current text value",
  "TextFieldProps.onInput": "Callback when text changes",
  "TextFieldProps.placeholder": "Placeholder text",
  "TextFieldProps.type": "Input type: text, email, password, url, tel",
  "TextFieldProps.label": "Field label",
  "TextFieldProps.error": "Error message",
  "TextFieldProps.hint": "Hint text",
  "TextFieldProps.required": "Show required indicator",
  "TextFieldProps.disabled": "Disable interaction",
  "TextFieldProps.size": "Input size",
  "TextFieldProps.class": "Additional CSS class",
  "TextFieldProps.density": "Component density",

  // ToastContainerProps
  "ToastContainerProps.position": "Toast position on screen",
  "ToastContainerProps.dismissLabel": "Accessible label for each toast's dismiss button",

  // TimePickerControlProps
  "TimePickerControlProps.value": "Selected time as HH:MM on a 24-hour clock",
  "TimePickerControlProps.onChange": "Callback when a time is chosen",
  "TimePickerControlProps.step": "Minutes between offered times",
  "TimePickerControlProps.min": "Earliest offered time, inclusive",
  "TimePickerControlProps.max": "Latest offered time, inclusive",
  "TimePickerControlProps.placeholder": "Text shown while nothing is selected",
  "TimePickerControlProps.required": "Mark the field as required",
  "TimePickerControlProps.id": "Id for the trigger when used outside a FormField",
  "TimePickerControlProps.format": "Formats a time for display",
  "TimePickerControlProps.listLabel": "Accessible label for the list of times",

  // TimePickerProps
  "TimePickerProps.label": "Field label",
  "TimePickerProps.error": "Error message",
  "TimePickerProps.hint": "Hint text",

  // TimelineProps
  "TimelineProps.items": "Array of timeline entries",
  "TimelineProps.class": "Additional CSS class",
  "TimelineProps.density": "Component density",

  // TreeProps
  "TreeProps.nodes": "Root nodes of the tree",
  "TreeProps.expanded": "Ids of the expanded branches",
  "TreeProps.onExpandedChange": "Callback when a branch opens or closes",
  "TreeProps.selected": "Id of the selected node",
  "TreeProps.onSelect": "Callback when a node is activated",
  "TreeProps.label": "Accessible label for the tree",
  "TreeProps.class": "Additional CSS class",
  "TreeProps.density": "Component density",

  // TooltipProps
  "TooltipProps.content": "Tooltip text",
  "TooltipProps.placement": "Tooltip placement",
  "TooltipProps.class": "Additional CSS class",
  "TooltipProps.children": "Trigger element",

  // VisuallyHiddenProps
  "VisuallyHiddenProps.children": "Content visible only to screen readers",

  // ===== Navigation =====
  "nav.gettingStarted": "Getting Started",
  "nav.components": "Components",
  "nav.samples": "Samples",
  "nav.primary": "Primary",
  "nav.changelog": "Changelog",
  "changelog.lead": "Components and the CLI are released separately: components as GitHub releases, the CLI to npm.",
  "nav.browseComponents": "Browse Components",

  // ===== Top Page =====
  "top.heroSub": "SolidJS Opinionated UI — copy-paste component toolkit for business apps.",
  "top.showcaseAltDark": "Wall of soluid components rendered in the dark theme",
  "top.showcaseAltLight": "Wall of soluid components rendered in the light theme",
  "top.featureCopyOwn": "Copy & Own",
  "top.featureCopyOwnDesc": "Components are copied into your project. No runtime dependency — you own the code.",
  "top.featureAccessible": "Accessible",
  "top.featureAccessibleDesc": "ARIA attributes, focus traps, keyboard navigation built-in.",
  "top.featureThemeable": "Themeable",
  "top.featureThemeableDesc": "CSS custom properties with light/dark themes and density variants.",
  "top.componentsHeading": "Components",
  "action.close": "Close",
  "density.label": "Spacing",
  "density.normal": "Comfortable",
  "density.dense": "Compact",

  // ===== Sample apps =====
  "samples.heading": "Sample Apps",
  "samples.lead":
    "Whole screens built from the components, not isolated snippets. Each one is a real application you can read end to end.",
  "samples.source": "View source",
  "samples.newTab": "Open in new tab",
  "sample.dashboard": "Dashboard",
  "sample.dashboardDesc": "Metrics, charts, an activity timeline and a sortable order table.",
  "sample.settings": "Settings",
  "sample.settingsDesc": "A long settings form: fields, sliders, file upload and a one-time code.",
  "sample.mail": "Mail",
  "sample.mailDesc": "A folder tree, searchable list with right-click actions, and a reading pane.",
  "sample.shop": "Shop",
  "sample.shopDesc": "Product grid with filtering, ratings, a cart drawer and a checkout flow.",

  // ===== Category labels =====
  "cat.layout": "Layout",
  "cat.general": "General",
  "cat.form": "Form",
  "cat.data": "Data Display",
  "cat.feedback": "Feedback",
  "cat.navigation": "Navigation",

  // ===== Component descriptions (card heading) =====
  "desc.Stack": "Vertical/horizontal flex container for stacking elements with consistent spacing.",
  "desc.Grid": "CSS grid with a fixed column count or auto-fitting responsive columns.",
  "desc.Container": "Centered page wrapper constrained to a maximum width.",
  "desc.AspectRatio": "Box that reserves a fixed width-to-height ratio for its content.",
  "desc.ButtonGroup": "Joins adjacent buttons into a single visual unit.",
  "desc.Heading": "h1-h6 heading whose visual size is independent of its outline level.",
  "desc.Text": "Body text with size, weight, tone, alignment and truncation.",
  "desc.Link": "Styled anchor that handles external links and their announcement.",
  "desc.Kbd": "Keyboard key rendered as a physical keycap.",
  "desc.AvatarGroup": "Overlapping avatars that collapse into a +N chip.",
  "desc.SegmentedControl": "Exclusive choice between a few options, with arrow-key navigation.",
  "desc.Stat": "Metric with a label, value and change indicator.",
  "desc.Collapsible": "Controlled disclosure section whose open state lives with the caller.",
  "desc.SearchField": "Text input with a search icon and a clear button.",
  "desc.Combobox": "Filterable single-select backed by a listbox popup.",
  "desc.Slider": "Range input with an optional formatted value readout.",
  "desc.Rating": "Star rating, interactive or read-only.",
  "desc.PinInput": "One-time code entry with paste and arrow-key support.",
  "desc.FileUpload": "Drop zone and file picker with a list of selected files.",
  "desc.Timeline": "Chronological list of events with status colours.",
  "desc.Tree": "Hierarchical list with full keyboard navigation.",
  "desc.Steps": "Progress indicator for a multi-step flow.",
  "desc.ContextMenu": "Right-click menu anchored to the pointer position.",
  "desc.Calendar": "Month grid with full keyboard navigation.",
  "desc.DatePicker": "Date field backed by a calendar popover.",
  "desc.TimePicker": "Time field backed by a stepped list of times.",
  "desc.ColorPicker": "Swatch palette with a hex field and the native picker.",
  "desc.CommandPalette": "Searchable command list in a modal overlay.",
  "desc.Carousel": "Scroll-snapping slides with arrows and dots.",
  "desc.Divider": "Visual separator line between content sections.",
  "desc.Spacer": "Flexible space that fills available room in flex containers.",
  "desc.Button": "Clickable action trigger with variant, size, loading, and disabled states.",
  "desc.IconButton": "Compact button containing only an icon with an accessible label.",
  "desc.Badge": "Small colored label for status, category, or count display.",
  "desc.Tag": "Removable label for categorization or filtering.",
  "desc.Avatar": "Circular user representation showing initials or image.",
  "desc.Tooltip": "Popup hint shown on hover with configurable placement.",
  "desc.VisuallyHidden": "Text exposed to screen readers but hidden from sight.",
  "desc.FormField": "Label, hint and error wrapper that wires up ids and ARIA for any control.",
  "desc.TextField": "Single-line text input with label, hint, and validation support.",
  "desc.TextArea": "Multi-line text input with label and hint.",
  "desc.NumberInput": "Numeric input with increment/decrement controls and min/max bounds.",
  "desc.Select": "Dropdown selector for choosing from a list of options.",
  "desc.Checkbox": "Toggle control for boolean values, supports indeterminate state.",
  "desc.CheckboxGroup": "Group of checkboxes sharing a single array value.",
  "desc.RadioGroup": "Exclusive selection from a set of radio options.",
  "desc.Switch": "Toggle switch for on/off states.",
  "desc.Table": "Data grid with sortable columns, custom renderers, and row selection.",
  "desc.Card": "Bordered container with header, body, and footer slots.",
  "desc.DescriptionList": "Key-value pair display in a definition list layout.",
  "desc.Skeleton": "Placeholder animation for loading states (text, circle, rect).",
  "desc.EmptyState": "Message displayed when no data is available, with optional action.",
  "desc.Accordion": "Collapsible content sections with open/disabled states.",
  "desc.Alert": "Contextual feedback message with variant and optional dismiss.",
  "desc.Progress": "Visual indicator of completion percentage with variant colors.",
  "desc.Spinner": "Animated loading indicator in multiple sizes.",
  "desc.Dialog": "Modal overlay for focused interactions with header, body, footer.",
  "desc.Drawer": "Slide-in panel from the screen edge with configurable side and size.",
  "desc.Toast": "Temporary notification popup managed via useToast() hook.",
  "desc.Tabs": "Content organization with switchable tab panels.",
  "desc.Breadcrumb": "Hierarchical navigation path showing the current location.",
  "desc.Pagination": "Page navigation control with optional page number display.",
  "desc.Popover": "Floating content panel triggered by click on a child element.",
  "desc.Menu": "Dropdown action list with items and separators.",

  // ===== API sub-descriptions (from api-data.json) =====
  "apiDesc.AccordionItemProps": "",
  "apiDesc.AccordionProps": "Collapsible content sections",
  "apiDesc.AlertProps": "Inline notification",
  "apiDesc.AvatarProps": "User avatar with image and initials fallback",
  "apiDesc.BadgeProps": "Status label",
  "apiDesc.BreadcrumbItemProps": "",
  "apiDesc.BreadcrumbProps": "Breadcrumb navigation",
  "apiDesc.ButtonProps": "Primary, neutral, danger button with icon and loading",
  "apiDesc.CardBodyProps": "",
  "apiDesc.CardFooterProps": "",
  "apiDesc.CardHeaderProps": "",
  "apiDesc.CardProps": "Content card with header/body/footer",
  "apiDesc.CheckboxGroupProps": "Checkbox group with shared state",
  "apiDesc.CheckboxProps": "Checkbox with indeterminate support",
  "apiDesc.DescriptionListProps": "Key-value display",
  "apiDesc.DialogBodyProps": "",
  "apiDesc.DialogFooterProps": "",
  "apiDesc.DialogHeaderProps": "",
  "apiDesc.DialogProps": "Modal dialog with focus trap",
  "apiDesc.DividerProps": "Horizontal/vertical separator",
  "apiDesc.DrawerHeaderProps": "",
  "apiDesc.DrawerProps": "Side panel with focus trap",
  "apiDesc.EmptyStateProps": "Empty data display with action",
  "apiDesc.FormFieldProps": "Label + error/hint wrapper for form inputs",
  "apiDesc.HStackProps": "Horizontal flex layout with gap",
  "apiDesc.IconButtonProps": "Icon-only button with aria-label",
  "apiDesc.MenuItemProps": "",
  "apiDesc.MenuProps": "Dropdown menu with keyboard navigation",
  "apiDesc.MenuSeparatorProps": "",
  "apiDesc.NumberInputProps": "Number input with stepper buttons",
  "apiDesc.PaginationProps": "Page navigation",
  "apiDesc.PopoverProps": "Floating element with trigger and panel",
  "apiDesc.ProgressProps": "Progress bar",
  "apiDesc.RadioButtonProps": "",
  "apiDesc.RadioGroupProps": "Radio button group",
  "apiDesc.SelectProps": "Native select dropdown",
  "apiDesc.SkeletonProps": "Loading placeholder",
  "apiDesc.SpinnerProps": "Loading spinner",
  "apiDesc.StackProps": "Vertical flex layout with gap",
  "apiDesc.SwitchProps": "Toggle switch",
  "apiDesc.TableProps": "Data table with sort, pagination, row selection",
  "apiDesc.TabListProps": "",
  "apiDesc.TabPanelProps": "",
  "apiDesc.TabProps": "",
  "apiDesc.TabsProps": "Tab navigation",
  "apiDesc.TagProps": "Removable label for filters",
  "apiDesc.TextAreaProps": "Multiline text input",
  "apiDesc.TextFieldProps": "Text input with label/error/hint",
  "apiDesc.ToastContainerProps": "",
  "apiDesc.TooltipProps": "Tooltip",
  "apiDesc.VisuallyHiddenProps": "Screen reader only content",

  // ===== Components Page UI =====
  "api.values": "Accepted values",
  "api.default": "Defaults to",
  "ui.search": "Search...",
  "ui.searchComponents": "Search components",
  "ui.language": "Language",
  "ui.skipToContent": "Skip to content",
  "ui.tabDemo": "Demo",
  "ui.tabCode": "Code",
  "ui.tabApi": "API",
  "ui.noDemo": "No demo available.",
  "ui.noCode": "No code example.",
  "ui.noApi": "No API data.",

  // ===== Getting Started Page =====
  "gs.title": "Getting Started",
  "gs.step1.title": "1. Initialize",
  "gs.step1.p1": "Run the init command to create a config file in your SolidJS project:",
  "gs.step1.p2": "This creates {code} interactively.",
  "gs.step2.title": "2. Edit Config",
  "gs.step2.p1": "Open {code} and adjust paths and components as needed:",
  "gs.step2.componentsVersion": "components release to install; written by init and bumped by update",
  "gs.step2.componentDir": "directory where component files are copied",
  "gs.step2.cssPath": "output path for the concatenated CSS file",
  "gs.step2.components": "list of components to install",
  "gs.step2.p2": "You can also add or remove components via CLI:",
  "gs.step3.title": "3. Install",
  "gs.step3.p1": "Download component source files and generate CSS:",
  "gs.step3.p2":
    "Components are copied to your project directory. All CSS is concatenated into a single file at {code}.",
  "gs.step4.title": "4. Import CSS",
  "gs.step4.p1": "Add the CSS import to your app entry point:",
  "gs.step5.title": "5. Use Components",
  "gs.step5.p1": "Import and use directly — you own the code:",
  "gs.theme.title": "Theming",
  "gs.theme.p1": "Switch between light/dark themes and density variants via data attributes:",
  "gs.theme.colorsIntro":
    "Brand colors are set in soluid.config.json. Add a colors block to override primary, neutral, danger, success, warning or info; install writes them into the generated CSS:",
  "gs.theme.colorsNote":
    "Only the base color is needed. Hover, active, subtle and border shades are derived from it with color-mix(), and both light and dark themes follow automatically.",
  "gs.other.title": "Other Commands",
};
