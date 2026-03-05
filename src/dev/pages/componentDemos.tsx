import { createMemo, createSignal, type JSX } from "solid-js";

import { Accordion, AccordionItem } from "../../components/ui/soluid/Accordion";
import { Avatar } from "../../components/ui/soluid/Avatar";
import { Card, CardBody, CardFooter, CardHeader } from "../../components/ui/soluid/Card";
import { CheckboxGroup } from "../../components/ui/soluid/CheckboxGroup";
import { DescriptionList } from "../../components/ui/soluid/DescriptionList";
import { Drawer, DrawerHeader } from "../../components/ui/soluid/Drawer";
import { EmptyState } from "../../components/ui/soluid/EmptyState";
import { Menu, MenuItem, MenuSeparator } from "../../components/ui/soluid/Menu";
import { Popover } from "../../components/ui/soluid/Popover";
import { Skeleton } from "../../components/ui/soluid/Skeleton";
import { Table } from "../../components/ui/soluid/Table";
import { ToastContainer, useToast } from "../../components/ui/soluid/Toast";
import { Tooltip } from "../../components/ui/soluid/Tooltip";
import { Alert } from "../../components/ui/soluid/Alert";
import { Dialog, DialogBody, DialogFooter, DialogHeader } from "../../components/ui/soluid/Dialog";
import { Progress } from "../../components/ui/soluid/Progress";
import { Spinner } from "../../components/ui/soluid/Spinner";
import { Checkbox } from "../../components/ui/soluid/Checkbox";
import { NumberInput } from "../../components/ui/soluid/NumberInput";
import { RadioButton } from "../../components/ui/soluid/RadioButton";
import { RadioGroup } from "../../components/ui/soluid/RadioGroup";
import { Select } from "../../components/ui/soluid/Select";
import { Switch } from "../../components/ui/soluid/Switch";
import { TextArea } from "../../components/ui/soluid/TextArea";
import { TextField } from "../../components/ui/soluid/TextField";
import { Badge } from "../../components/ui/soluid/Badge";
import { Button } from "../../components/ui/soluid/Button";
import { IconButton } from "../../components/ui/soluid/IconButton";
import { Tag } from "../../components/ui/soluid/Tag";
import { Divider } from "../../components/ui/soluid/Divider";
import { HStack } from "../../components/ui/soluid/HStack";
import { Spacer } from "../../components/ui/soluid/Spacer";
import { Stack } from "../../components/ui/soluid/Stack";
import { Breadcrumb, BreadcrumbItem } from "../../components/ui/soluid/Breadcrumb";
import { Pagination } from "../../components/ui/soluid/Pagination";
import { Tab, TabList, TabPanel, Tabs } from "../../components/ui/soluid/Tabs";

/* ---------- Categories ---------- */

export const CATEGORIES = [
  { slug: "layout",     label: "Layout",       components: ["Stack", "Divider", "Spacer"] },
  { slug: "general",    label: "General",       components: ["Button", "IconButton", "Badge", "Tag", "Avatar", "Tooltip"] },
  { slug: "form",       label: "Form",          components: ["TextField", "TextArea", "NumberInput", "Select", "Checkbox", "CheckboxGroup", "RadioGroup", "Switch"] },
  { slug: "data",       label: "Data Display",  components: ["Table", "Card", "DescriptionList", "Skeleton", "EmptyState", "Accordion"] },
  { slug: "feedback",   label: "Feedback",      components: ["Alert", "Progress", "Spinner", "Dialog", "Drawer", "Toast"] },
  { slug: "navigation", label: "Navigation",    components: ["Tabs", "Breadcrumb", "Pagination", "Popover", "Menu"] },
];

/* ---------- Sub-component groups for API tab ---------- */

export const SUB_COMPONENTS: Record<string, string[]> = {
  Stack:         ["Stack", "HStack"],
  Card:          ["Card", "CardHeader", "CardBody", "CardFooter"],
  Dialog:        ["Dialog", "DialogHeader", "DialogBody", "DialogFooter"],
  Drawer:        ["Drawer", "DrawerHeader"],
  Tabs:          ["Tabs", "TabList", "Tab", "TabPanel"],
  Breadcrumb:    ["Breadcrumb", "BreadcrumbItem"],
  Accordion:     ["Accordion", "AccordionItem"],
  RadioGroup:    ["RadioGroup", "RadioButton"],
  Menu:          ["Menu", "MenuItem", "MenuSeparator"],
  Toast:         ["ToastContainer"],
};

/* ---------- Descriptions ---------- */

export const DESCRIPTIONS: Record<string, string> = {
  Stack:           "Vertical/horizontal flex container for stacking elements with consistent spacing.",
  Divider:         "Visual separator line between content sections.",
  Spacer:          "Flexible space that fills available room in flex containers.",
  Button:          "Clickable action trigger with variant, size, loading, and disabled states.",
  IconButton:      "Compact button containing only an icon with an accessible label.",
  Badge:           "Small colored label for status, category, or count display.",
  Tag:             "Removable label for categorization or filtering.",
  Avatar:          "Circular user representation showing initials or image.",
  Tooltip:         "Popup hint shown on hover with configurable placement.",
  TextField:       "Single-line text input with label, hint, and validation support.",
  TextArea:        "Multi-line text input with label and hint.",
  NumberInput:     "Numeric input with increment/decrement controls and min/max bounds.",
  Select:          "Dropdown selector for choosing from a list of options.",
  Checkbox:        "Toggle control for boolean values, supports indeterminate state.",
  CheckboxGroup:   "Group of checkboxes sharing a single array value.",
  RadioGroup:      "Exclusive selection from a set of radio options.",
  Switch:          "Toggle switch for on/off states.",
  Table:           "Data grid with sortable columns, custom renderers, and row selection.",
  Card:            "Bordered container with header, body, and footer slots.",
  DescriptionList: "Key-value pair display in a definition list layout.",
  Skeleton:        "Placeholder animation for loading states (text, circle, rect).",
  EmptyState:      "Message displayed when no data is available, with optional action.",
  Accordion:       "Collapsible content sections with open/disabled states.",
  Alert:           "Contextual feedback message with variant and optional dismiss.",
  Progress:        "Visual indicator of completion percentage with variant colors.",
  Spinner:         "Animated loading indicator in multiple sizes.",
  Dialog:          "Modal overlay for focused interactions with header, body, footer.",
  Drawer:          "Slide-in panel from the screen edge with configurable side and size.",
  Toast:           "Temporary notification popup managed via useToast() hook.",
  Tabs:            "Content organization with switchable tab panels.",
  Breadcrumb:      "Hierarchical navigation path showing the current location.",
  Pagination:      "Page navigation control with optional page number display.",
  Popover:         "Floating content panel triggered by click on a child element.",
  Menu:            "Dropdown action list with items and separators.",
};

/* ---------- Code examples ---------- */

export const CODE_EXAMPLES: Record<string, string> = {
  Stack: `import { Stack } from "./soluid/Stack";
import { HStack } from "./soluid/HStack";

<Stack gap={2}>
  <div>Item 1</div>
  <div>Item 2</div>
</Stack>

<HStack gap={3}>
  <div>Left</div>
  <div>Right</div>
</HStack>`,

  Divider: `import { Divider } from "./soluid/Divider";

<Divider />
<Divider orientation="vertical" />`,

  Spacer: `import { Spacer } from "./soluid/Spacer";

<HStack>
  <span>Left</span>
  <Spacer />
  <span>Right</span>
</HStack>`,

  Button: `import { Button } from "./soluid/Button";

<Button variant="primary" onClick={handleClick}>
  Save
</Button>
<Button variant="danger" size="sm" disabled>
  Delete
</Button>
<Button variant="neutral" loading>
  Sending...
</Button>`,

  IconButton: `import { IconButton } from "./soluid/IconButton";

<IconButton
  variant="primary"
  aria-label="Add item"
  icon={<PlusIcon />}
  onClick={handleAdd}
/>`,

  Badge: `import { Badge } from "./soluid/Badge";

<Badge variant="success">Active</Badge>
<Badge variant="danger" size="sm">3</Badge>`,

  Tag: `import { Tag } from "./soluid/Tag";

<Tag variant="primary" onRemove={handleRemove}>
  TypeScript
</Tag>
<Tag variant="neutral">Read-only</Tag>`,

  Avatar: `import { Avatar } from "./soluid/Avatar";

<Avatar name="Tanaka Taro" size="md" variant="primary" />
<Avatar size="lg" variant="neutral" />`,

  Tooltip: `import { Tooltip } from "./soluid/Tooltip";

<Tooltip content="Save changes" placement="bottom">
  <Button variant="primary">Save</Button>
</Tooltip>`,

  TextField: `import { TextField } from "./soluid/TextField";

const [name, setName] = createSignal("");

<TextField
  label="Name"
  placeholder="Enter your name"
  value={name()}
  onInput={setName}
  required
/>
<TextField label="Email" error="Invalid email" />`,

  TextArea: `import { TextArea } from "./soluid/TextArea";

<TextArea
  label="Description"
  placeholder="Enter description..."
  hint="Max 500 characters"
/>`,

  NumberInput: `import { NumberInput } from "./soluid/NumberInput";

const [qty, setQty] = createSignal(1);

<NumberInput
  label="Quantity"
  value={qty()}
  onInput={setQty}
  min={0}
  max={100}
  step={1}
/>`,

  Select: `import { Select } from "./soluid/Select";

const [role, setRole] = createSignal("");

<Select
  label="Role"
  placeholder="Select a role"
  value={role()}
  onChange={setRole}
  options={[
    { value: "admin", label: "Admin" },
    { value: "editor", label: "Editor" },
  ]}
/>`,

  Checkbox: `import { Checkbox } from "./soluid/Checkbox";

const [agreed, setAgreed] = createSignal(false);

<Checkbox
  checked={agreed()}
  onChange={setAgreed}
  label="Accept terms"
/>`,

  CheckboxGroup: `import { CheckboxGroup } from "./soluid/CheckboxGroup";
import { Checkbox } from "./soluid/Checkbox";

const [selected, setSelected] = createSignal(["email"]);

<CheckboxGroup
  value={selected()}
  onChange={setSelected}
  label="Notifications"
>
  <Checkbox value="email" label="Email" />
  <Checkbox value="sms" label="SMS" />
</CheckboxGroup>`,

  RadioGroup: `import { RadioGroup } from "./soluid/RadioGroup";
import { RadioButton } from "./soluid/RadioButton";

const [value, setValue] = createSignal("a");

<RadioGroup value={value()} onChange={setValue} label="Option">
  <RadioButton value="a" label="Option A" />
  <RadioButton value="b" label="Option B" />
</RadioGroup>`,

  Switch: `import { Switch } from "./soluid/Switch";

const [on, setOn] = createSignal(false);

<Switch
  checked={on()}
  onChange={setOn}
  label="Enable notifications"
/>`,

  Table: `import { Table } from "./soluid/Table";

const columns = [
  { key: "name", header: "Name", sortable: true },
  { key: "email", header: "Email" },
];

<Table
  columns={columns}
  data={rows}
  rowKey={(row) => row.id}
/>`,

  Card: `import { Card, CardHeader, CardBody, CardFooter } from "./soluid/Card";

<Card>
  <CardHeader>Title</CardHeader>
  <CardBody>Content goes here.</CardBody>
  <CardFooter>
    <Button variant="primary" size="sm">Action</Button>
  </CardFooter>
</Card>`,

  DescriptionList: `import { DescriptionList } from "./soluid/DescriptionList";

<DescriptionList
  items={[
    { term: "Name", description: "Tanaka Taro" },
    { term: "Role", description: "Admin" },
  ]}
/>`,

  Skeleton: `import { Skeleton } from "./soluid/Skeleton";

<Skeleton variant="text" width="200px" />
<Skeleton variant="circle" width="40px" height="40px" />
<Skeleton variant="rect" width="100%" height="120px" />`,

  EmptyState: `import { EmptyState } from "./soluid/EmptyState";

<EmptyState
  title="No results"
  description="Try a different search term."
  action={<Button variant="primary">Reset</Button>}
/>`,

  Accordion: `import { Accordion, AccordionItem } from "./soluid/Accordion";

<Accordion>
  <AccordionItem title="Section 1" open>
    Content for section 1.
  </AccordionItem>
  <AccordionItem title="Section 2">
    Content for section 2.
  </AccordionItem>
</Accordion>`,

  Alert: `import { Alert } from "./soluid/Alert";

<Alert variant="info">Update available.</Alert>
<Alert variant="danger" onDismiss={handleDismiss}>
  Something went wrong.
</Alert>`,

  Progress: `import { Progress } from "./soluid/Progress";

<Progress value={65} variant="success" />`,

  Spinner: `import { Spinner } from "./soluid/Spinner";

<Spinner size="md" />
<Spinner size="lg" variant="primary" />`,

  Dialog: `import { Dialog, DialogHeader, DialogBody, DialogFooter } from "./soluid/Dialog";

const [open, setOpen] = createSignal(false);

<Button onClick={() => setOpen(true)}>Open</Button>
<Dialog open={open()} onClose={() => setOpen(false)}>
  <DialogHeader>Confirm</DialogHeader>
  <DialogBody>Are you sure?</DialogBody>
  <DialogFooter>
    <Button variant="primary" onClick={() => setOpen(false)}>
      OK
    </Button>
  </DialogFooter>
</Dialog>`,

  Drawer: `import { Drawer, DrawerHeader } from "./soluid/Drawer";

const [open, setOpen] = createSignal(false);

<Button onClick={() => setOpen(true)}>Open Drawer</Button>
<Drawer open={open()} onClose={() => setOpen(false)} side="right">
  <DrawerHeader>Settings</DrawerHeader>
  <div>Drawer content here.</div>
</Drawer>`,

  Toast: `import { ToastContainer, useToast } from "./soluid/Toast";

const toast = useToast();

<Button onClick={() => toast.add({
  message: "Saved!",
  variant: "success",
})}>
  Save
</Button>
<ToastContainer position="top-right" />`,

  Tabs: `import { Tabs, TabList, Tab, TabPanel } from "./soluid/Tabs";

const [tab, setTab] = createSignal("overview");

<Tabs value={tab()} onChange={setTab}>
  <TabList>
    <Tab value="overview">Overview</Tab>
    <Tab value="details">Details</Tab>
  </TabList>
  <TabPanel value="overview">Overview content</TabPanel>
  <TabPanel value="details">Details content</TabPanel>
</Tabs>`,

  Breadcrumb: `import { Breadcrumb, BreadcrumbItem } from "./soluid/Breadcrumb";

<Breadcrumb>
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem href="/users">Users</BreadcrumbItem>
  <BreadcrumbItem current>Profile</BreadcrumbItem>
</Breadcrumb>`,

  Pagination: `import { Pagination } from "./soluid/Pagination";

const [page, setPage] = createSignal(1);

<Pagination
  page={page()}
  totalPages={10}
  onChange={setPage}
  showPages
  maxVisible={7}
/>`,

  Popover: `import { Popover } from "./soluid/Popover";

const [open, setOpen] = createSignal(false);

<Popover
  open={open()}
  onOpenChange={setOpen}
  content={<p>Popover content here</p>}
>
  Click to open
</Popover>`,

  Menu: `import { Menu, MenuItem, MenuSeparator } from "./soluid/Menu";

const [open, setOpen] = createSignal(false);

<Menu
  open={open()}
  onOpenChange={setOpen}
  trigger={<Button>Actions</Button>}
>
  <MenuItem onSelect={() => {}}>Edit</MenuItem>
  <MenuItem onSelect={() => {}}>Duplicate</MenuItem>
  <MenuSeparator />
  <MenuItem onSelect={() => {}}>Delete</MenuItem>
</Menu>`,
};

/* ---------- Demo functions ---------- */

function StackDemo(): JSX.Element {
  return (
    <HStack gap={3}>
      <Stack gap={2}>
        <Badge variant="neutral">Item 1</Badge>
        <Badge variant="neutral">Item 2</Badge>
        <Badge variant="neutral">Item 3</Badge>
      </Stack>
      <Divider orientation="vertical" />
      <HStack gap={2}>
        <Badge variant="primary">H1</Badge>
        <Badge variant="primary">H2</Badge>
        <Badge variant="primary">H3</Badge>
      </HStack>
    </HStack>
  );
}

function DividerDemo(): JSX.Element {
  return <Divider />;
}

function SpacerDemo(): JSX.Element {
  return (
    <HStack gap={2} style={{ border: "1px dashed var(--so-border)", padding: "var(--so-space-2)" }}>
      <Badge variant="neutral">Left</Badge>
      <Spacer />
      <Badge variant="neutral">Right</Badge>
    </HStack>
  );
}

function ButtonDemo(): JSX.Element {
  return (
    <>
      <div class="catalog-row">
        <Button variant="primary">Primary</Button>
        <Button variant="neutral">Neutral</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="primary" disabled>Disabled</Button>
        <Button variant="primary" loading>Loading</Button>
      </div>
      <div class="catalog-row">
        <Button variant="primary" size="sm">Small</Button>
        <Button variant="primary" size="md">Medium</Button>
        <Button variant="primary" size="lg">Large</Button>
      </div>
    </>
  );
}

function IconButtonDemo(): JSX.Element {
  return (
    <div class="catalog-row">
      <IconButton variant="primary" aria-label="Add" icon={<span>+</span>} />
      <IconButton variant="neutral" aria-label="Settings" icon={<span>*</span>} />
      <IconButton variant="danger" aria-label="Delete" icon={<span>x</span>} />
    </div>
  );
}

function BadgeDemo(): JSX.Element {
  return (
    <div class="catalog-row">
      <Badge variant="primary">Primary</Badge>
      <Badge variant="neutral">Neutral</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  );
}

function TagDemo(): JSX.Element {
  return (
    <div class="catalog-row">
      <Tag variant="primary" onRemove={() => {}}>Removable</Tag>
      <Tag variant="success">Status: OK</Tag>
      <Tag variant="danger" onRemove={() => {}}>Error</Tag>
    </div>
  );
}

function AvatarDemo(): JSX.Element {
  return (
    <div class="catalog-row">
      <Avatar name="Tanaka Taro" size="sm" variant="primary" />
      <Avatar name="Suzuki Hanako" size="md" variant="success" />
      <Avatar name="Sato Jiro" size="lg" variant="danger" />
      <Avatar size="md" variant="neutral" />
    </div>
  );
}

function TooltipDemo(): JSX.Element {
  return (
    <div class="catalog-row">
      <Tooltip content="Top tooltip">
        <Button variant="neutral" size="sm">Top</Button>
      </Tooltip>
      <Tooltip content="Bottom tooltip" placement="bottom">
        <Button variant="neutral" size="sm">Bottom</Button>
      </Tooltip>
      <Tooltip content="Left tooltip" placement="left">
        <Button variant="neutral" size="sm">Left</Button>
      </Tooltip>
      <Tooltip content="Right tooltip" placement="right">
        <Button variant="neutral" size="sm">Right</Button>
      </Tooltip>
    </div>
  );
}

function TextFieldDemo(): JSX.Element {
  const [value, setValue] = createSignal("");
  return (
    <Stack gap={3}>
      <TextField label="Name" placeholder="Enter your name" value={value()} onInput={setValue} />
      <TextField label="Email" type="email" placeholder="user@example.com" hint="We will not share your email" />
      <TextField label="With Error" error="This field is required" required />
    </Stack>
  );
}

function TextAreaDemo(): JSX.Element {
  return <TextArea label="Description" placeholder="Enter description..." hint="Max 500 characters" />;
}

function NumberInputDemo(): JSX.Element {
  const [value, setValue] = createSignal(0);
  return <NumberInput label="Quantity" value={value()} onInput={setValue} min={0} max={100} step={1} />;
}

function SelectDemo(): JSX.Element {
  const [value, setValue] = createSignal("");
  return (
    <Select
      label="Role"
      placeholder="Select a role"
      value={value()}
      onChange={setValue}
      options={[
        { value: "admin", label: "Admin" },
        { value: "editor", label: "Editor" },
        { value: "viewer", label: "Viewer" },
      ]}
    />
  );
}

function CheckboxDemo(): JSX.Element {
  const [checked, setChecked] = createSignal(false);
  return (
    <div class="catalog-row">
      <Checkbox checked={checked()} onChange={setChecked} label="Accept terms" />
      <Checkbox checked indeterminate label="Indeterminate" />
      <Checkbox disabled label="Disabled" />
    </div>
  );
}

function CheckboxGroupDemo(): JSX.Element {
  const [value, setValue] = createSignal<string[]>(["email"]);
  return (
    <CheckboxGroup value={value()} onChange={setValue} label="Notifications">
      <HStack gap={4}>
        <Checkbox value="email" label="Email" />
        <Checkbox value="sms" label="SMS" />
        <Checkbox value="push" label="Push" />
      </HStack>
    </CheckboxGroup>
  );
}

function RadioGroupDemo(): JSX.Element {
  const [value, setValue] = createSignal("a");
  return (
    <RadioGroup value={value()} onChange={setValue} label="Select option">
      <HStack gap={4}>
        <RadioButton value="a" label="Option A" />
        <RadioButton value="b" label="Option B" />
        <RadioButton value="c" label="Option C" />
      </HStack>
    </RadioGroup>
  );
}

function SwitchDemo(): JSX.Element {
  const [on, setOn] = createSignal(false);
  return (
    <div class="catalog-row">
      <Switch checked={on()} onChange={setOn} label="Enable notifications" />
      <Switch checked disabled label="Disabled (on)" />
    </div>
  );
}

function TableDemo(): JSX.Element {
  const [sortKey, setSortKey] = createSignal<string>("");
  const [sortDir, setSortDir] = createSignal<"asc" | "desc">("asc");

  const tableData = [
    { id: "1", name: "Tanaka Taro", email: "tanaka@example.com", role: "Admin", age: 32 },
    { id: "2", name: "Suzuki Hanako", email: "suzuki@example.com", role: "Editor", age: 28 },
    { id: "3", name: "Sato Jiro", email: "sato@example.com", role: "Viewer", age: 45 },
    { id: "4", name: "Yamada Yuki", email: "yamada@example.com", role: "Editor", age: 36 },
  ];

  const sorted = createMemo(() => {
    const key = sortKey();
    const dir = sortDir();
    if (!key) return tableData;
    return [...tableData].sort((a, b) => {
      const av = a[key as keyof typeof a];
      const bv = b[key as keyof typeof b];
      if (typeof av === "number" && typeof bv === "number") {
        return dir === "asc" ? av - bv : bv - av;
      }
      return dir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
  });

  const columns = [
    { key: "name" as const, header: "Name", sortable: true },
    { key: "email" as const, header: "Email" },
    { key: "role" as const, header: "Role", width: "100px" },
    { key: "age" as const, header: "Age", align: "end" as const, sortable: true },
  ];

  return (
    <Table
      columns={columns}
      data={sorted()}
      rowKey={(row) => row.id}
      sortKey={sortKey()}
      sortDirection={sortDir()}
      onSort={(key, dir) => { setSortKey(key); setSortDir(dir); }}
    />
  );
}

function CardDemo(): JSX.Element {
  return (
    <div class="catalog-grid">
      <Card>
        <CardHeader>Card Title</CardHeader>
        <CardBody>
          <p>Card content goes here. Supports any JSX.</p>
        </CardBody>
        <CardFooter>
          <HStack gap={2}>
            <Button variant="primary" size="sm">Action</Button>
            <Button variant="neutral" size="sm">Cancel</Button>
          </HStack>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>User Details</CardHeader>
        <CardBody>
          <DescriptionList
            items={[
              { term: "Name", description: "Tanaka Taro" },
              { term: "Role", description: "Admin" },
              { term: "Email", description: "tanaka@example.com" },
            ]}
          />
        </CardBody>
      </Card>
    </div>
  );
}

function DescriptionListDemo(): JSX.Element {
  return (
    <DescriptionList
      items={[
        { term: "Name", description: "Tanaka Taro" },
        { term: "Role", description: "Admin" },
        { term: "Email", description: "tanaka@example.com" },
      ]}
    />
  );
}

function SkeletonDemo(): JSX.Element {
  return (
    <div class="catalog-row">
      <Skeleton variant="circle" width="40px" height="40px" />
      <Stack gap={2}>
        <Skeleton variant="text" width="200px" />
        <Skeleton variant="text" width="150px" />
      </Stack>
    </div>
  );
}

function EmptyStateDemo(): JSX.Element {
  return (
    <EmptyState
      title="No data"
      description="There are no items to display yet."
      action={<Button variant="primary" size="sm">Create New</Button>}
    />
  );
}

function AccordionDemo(): JSX.Element {
  return (
    <Accordion>
      <AccordionItem title="What is soluid?" open>
        A SolidJS component toolkit. Copy components into your project and own the code directly.
      </AccordionItem>
      <AccordionItem title="How do I install components?">
        Run <code>npx soluid install</code> to download and install components + CSS.
      </AccordionItem>
      <AccordionItem title="Disabled item" disabled>
        This content is not accessible.
      </AccordionItem>
    </Accordion>
  );
}

function AlertDemo(): JSX.Element {
  return (
    <Stack gap={2}>
      <Alert variant="info">Informational message.</Alert>
      <Alert variant="success">Operation completed successfully.</Alert>
      <Alert variant="warning">Please check your input.</Alert>
      <Alert variant="danger" onDismiss={() => {}}>An error occurred. Please try again.</Alert>
    </Stack>
  );
}

function ProgressDemo(): JSX.Element {
  return (
    <Stack gap={2}>
      <Progress value={30} variant="info" />
      <Progress value={65} variant="success" />
      <Progress value={90} variant="warning" />
    </Stack>
  );
}

function SpinnerDemo(): JSX.Element {
  return (
    <div class="catalog-row">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="md" variant="primary" />
    </div>
  );
}

function DialogDemo(): JSX.Element {
  const [open, setOpen] = createSignal(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>Open Dialog</Button>
      <Dialog open={open()} onClose={() => setOpen(false)}>
        <DialogHeader>Confirm Action</DialogHeader>
        <DialogBody>
          <p>Are you sure you want to proceed with this action?</p>
        </DialogBody>
        <DialogFooter>
          <HStack gap={2}>
            <Button variant="neutral" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={() => setOpen(false)}>Confirm</Button>
          </HStack>
        </DialogFooter>
      </Dialog>
    </>
  );
}

function DrawerDemo(): JSX.Element {
  const [open, setOpen] = createSignal(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>Open Drawer</Button>
      <Drawer open={open()} onClose={() => setOpen(false)}>
        <DrawerHeader>Settings</DrawerHeader>
        <div style={{ padding: "var(--so-space-4)" }}>
          <p>Drawer content goes here.</p>
        </div>
      </Drawer>
    </>
  );
}

function ToastDemo(): JSX.Element {
  const toast = useToast();
  return (
    <>
      <div class="catalog-row">
        <Button variant="neutral" size="sm" onClick={() => toast.add({ message: "Info notification", variant: "info" })}>Info</Button>
        <Button variant="neutral" size="sm" onClick={() => toast.add({ message: "Success!", variant: "success" })}>Success</Button>
        <Button variant="neutral" size="sm" onClick={() => toast.add({ message: "Warning issued", variant: "warning" })}>Warning</Button>
        <Button variant="neutral" size="sm" onClick={() => toast.add({ message: "Something failed", variant: "danger" })}>Danger</Button>
      </div>
      <ToastContainer />
    </>
  );
}

function TabsDemo(): JSX.Element {
  const [active, setActive] = createSignal("tab1");
  return (
    <Tabs value={active()} onChange={setActive}>
      <TabList>
        <Tab value="tab1">Overview</Tab>
        <Tab value="tab2">Details</Tab>
        <Tab value="tab3">Settings</Tab>
      </TabList>
      <TabPanel value="tab1"><p>Overview content goes here.</p></TabPanel>
      <TabPanel value="tab2"><p>Details content goes here.</p></TabPanel>
      <TabPanel value="tab3"><p>Settings content goes here.</p></TabPanel>
    </Tabs>
  );
}

function BreadcrumbDemo(): JSX.Element {
  return (
    <Breadcrumb>
      <BreadcrumbItem href="#">Home</BreadcrumbItem>
      <BreadcrumbItem href="#">Users</BreadcrumbItem>
      <BreadcrumbItem current>Tanaka Taro</BreadcrumbItem>
    </Breadcrumb>
  );
}

function PaginationDemo(): JSX.Element {
  const [p1, setP1] = createSignal(1);
  const [p2, setP2] = createSignal(3);
  return (
    <Stack gap={3}>
      <Pagination page={p1()} totalPages={10} onChange={setP1} />
      <Pagination page={p2()} totalPages={20} onChange={setP2} showPages maxVisible={7} />
    </Stack>
  );
}

function PopoverDemo(): JSX.Element {
  const [open, setOpen] = createSignal(false);
  return (
    <Popover
      open={open()}
      onOpenChange={setOpen}
      content={
        <Stack gap={2}>
          <p style={{ margin: "0", "font-size": "var(--so-font-size-sm)" }}>Popover content</p>
          <Button variant="primary" size="sm" onClick={() => setOpen(false)}>Close</Button>
        </Stack>
      }
    >
      Open Popover
    </Popover>
  );
}

function MenuDemo(): JSX.Element {
  const [open, setOpen] = createSignal(false);
  return (
    <Menu open={open()} onOpenChange={setOpen} trigger={<>Actions ▾</>}>
      <MenuItem onSelect={() => setOpen(false)}>Edit</MenuItem>
      <MenuItem onSelect={() => setOpen(false)}>Duplicate</MenuItem>
      <MenuSeparator />
      <MenuItem onSelect={() => setOpen(false)}>Delete</MenuItem>
    </Menu>
  );
}

/* ---------- Demo registry ---------- */

export const DEMOS: Record<string, () => JSX.Element> = {
  Stack:         StackDemo,
  Divider:       DividerDemo,
  Spacer:        SpacerDemo,
  Button:        ButtonDemo,
  IconButton:    IconButtonDemo,
  Badge:         BadgeDemo,
  Tag:           TagDemo,
  Avatar:        AvatarDemo,
  Tooltip:       TooltipDemo,
  TextField:     TextFieldDemo,
  TextArea:      TextAreaDemo,
  NumberInput:   NumberInputDemo,
  Select:        SelectDemo,
  Checkbox:      CheckboxDemo,
  CheckboxGroup: CheckboxGroupDemo,
  RadioGroup:    RadioGroupDemo,
  Switch:        SwitchDemo,
  Table:         TableDemo,
  Card:          CardDemo,
  DescriptionList: DescriptionListDemo,
  Skeleton:      SkeletonDemo,
  EmptyState:    EmptyStateDemo,
  Accordion:     AccordionDemo,
  Alert:         AlertDemo,
  Progress:      ProgressDemo,
  Spinner:       SpinnerDemo,
  Dialog:        DialogDemo,
  Drawer:        DrawerDemo,
  Toast:         ToastDemo,
  Tabs:          TabsDemo,
  Breadcrumb:    BreadcrumbDemo,
  Pagination:    PaginationDemo,
  Popover:       PopoverDemo,
  Menu:          MenuDemo,
};
