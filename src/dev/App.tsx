import { createEffect, createMemo, createSignal } from "solid-js";
import type { Density } from "../components/ui/soluid/core/types";
import "../components/ui/soluid/core/soluid.css";
import "./catalog.css";

import { Card, CardBody, CardFooter, CardHeader } from "../components/ui/soluid/Card";
import { DescriptionList } from "../components/ui/soluid/DescriptionList";
import { EmptyState } from "../components/ui/soluid/EmptyState";
import { Skeleton } from "../components/ui/soluid/Skeleton";
import { Table } from "../components/ui/soluid/Table";
import { Alert } from "../components/ui/soluid/Alert";
import { Dialog, DialogBody, DialogFooter, DialogHeader } from "../components/ui/soluid/Dialog";
import { Progress } from "../components/ui/soluid/Progress";
import { Spinner } from "../components/ui/soluid/Spinner";
import { Checkbox } from "../components/ui/soluid/Checkbox";
import { NumberInput } from "../components/ui/soluid/NumberInput";
import { RadioButton } from "../components/ui/soluid/RadioButton";
import { RadioGroup } from "../components/ui/soluid/RadioGroup";
import { Select } from "../components/ui/soluid/Select";
import { Switch } from "../components/ui/soluid/Switch";
import { TextArea } from "../components/ui/soluid/TextArea";
import { TextField } from "../components/ui/soluid/TextField";
import { Badge } from "../components/ui/soluid/Badge";
import { Button } from "../components/ui/soluid/Button";
import { IconButton } from "../components/ui/soluid/IconButton";
import { Tag } from "../components/ui/soluid/Tag";
import { Divider } from "../components/ui/soluid/Divider";
import { HStack } from "../components/ui/soluid/HStack";
import { Spacer } from "../components/ui/soluid/Spacer";
import { Stack } from "../components/ui/soluid/Stack";
import { Breadcrumb, BreadcrumbItem } from "../components/ui/soluid/Breadcrumb";
import { Pagination } from "../components/ui/soluid/Pagination";
import { Tab, TabList, TabPanel, Tabs } from "../components/ui/soluid/Tabs";

export function App() {
  const [density, setDensity] = createSignal<Density>("normal");
  const [theme, setTheme] = createSignal<"light" | "dark">("light");
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [activeTab, setActiveTab] = createSignal("tab1");
  const [page, setPage] = createSignal(1);
  const [switchOn, setSwitchOn] = createSignal(false);
  const [checkboxChecked, setCheckboxChecked] = createSignal(false);
  const [radioValue, setRadioValue] = createSignal("a");
  const [textValue, setTextValue] = createSignal("");
  const [numberValue, setNumberValue] = createSignal(0);
  const [selectValue, setSelectValue] = createSignal("");
  const [sortKey, setSortKey] = createSignal<string>("");
  const [sortDir, setSortDir] = createSignal<"asc" | "desc">("asc");

  const tableData = [
    { id: "1", name: "Tanaka Taro", email: "tanaka@example.com", role: "Admin", age: 32 },
    { id: "2", name: "Suzuki Hanako", email: "suzuki@example.com", role: "Editor", age: 28 },
    { id: "3", name: "Sato Jiro", email: "sato@example.com", role: "Viewer", age: 45 },
    { id: "4", name: "Yamada Yuki", email: "yamada@example.com", role: "Editor", age: 36 },
  ];

  const sortedTableData = createMemo(() => {
    const key = sortKey();
    const dir = sortDir();
    if (!key) return tableData;
    return [...tableData].sort((a, b) => {
      const av = a[key as keyof typeof a];
      const bv = b[key as keyof typeof b];
      if (typeof av === "number" && typeof bv === "number") {
        return dir === "asc" ? av - bv : bv - av;
      }
      const sa = String(av);
      const sb = String(bv);
      return dir === "asc" ? sa.localeCompare(sb) : sb.localeCompare(sa);
    });
  });

  const handleSort = (key: string, direction: "asc" | "desc") => {
    setSortKey(key);
    setSortDir(direction);
  };

  const tableColumns = [
    { key: "name" as const, header: "Name", sortable: true },
    { key: "email" as const, header: "Email" },
    { key: "role" as const, header: "Role", width: "100px" },
    { key: "age" as const, header: "Age", align: "end" as const, sortable: true },
  ];

  createEffect(() => {
    document.documentElement.setAttribute("data-theme", theme());
    document.documentElement.setAttribute("data-density", density());
  });

  return (
      <div class="catalog">
        <h1>soluid Component Catalog</h1>
        <p class="catalog-subtitle">SolidJS Opinionated UI - Business-focused component library</p>

        {/* Global Controls */}
        <div class="catalog-controls">
          <label>Density:</label>
          <Button
            variant={density() === "normal" ? "primary" : "neutral"}
            size="sm"
            onClick={() => setDensity("normal")}
          >
            Normal
          </Button>
          <Button
            variant={density() === "dense" ? "primary" : "neutral"}
            size="sm"
            onClick={() => setDensity("dense")}
          >
            Dense
          </Button>
          <Spacer />
          <label>Theme:</label>
          <Button
            variant={theme() === "light" ? "primary" : "neutral"}
            size="sm"
            onClick={() => setTheme("light")}
          >
            Light
          </Button>
          <Button
            variant={theme() === "dark" ? "primary" : "neutral"}
            size="sm"
            onClick={() => setTheme("dark")}
          >
            Dark
          </Button>
        </div>

        {/* Layout */}
        <section class="catalog-section">
          <h2>Layout</h2>

          <h3>Stack / HStack</h3>
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

          <h3>Divider</h3>
          <Divider />
        </section>

        {/* General */}
        <section class="catalog-section">
          <h2>General</h2>

          <h3>Button</h3>
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

          <h3>IconButton</h3>
          <div class="catalog-row">
            <IconButton variant="primary" aria-label="Add" icon={<span>+</span>} />
            <IconButton variant="neutral" aria-label="Settings" icon={<span>*</span>} />
            <IconButton variant="danger" aria-label="Delete" icon={<span>x</span>} />
          </div>

          <h3>Badge</h3>
          <div class="catalog-row">
            <Badge variant="primary">Primary</Badge>
            <Badge variant="neutral">Neutral</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="info">Info</Badge>
          </div>

          <h3>Tag</h3>
          <div class="catalog-row">
            <Tag variant="primary" onRemove={() => {}}>Removable</Tag>
            <Tag variant="success">Status: OK</Tag>
            <Tag variant="danger" onRemove={() => {}}>Error</Tag>
          </div>
        </section>

        {/* Form */}
        <section class="catalog-section">
          <h2>Form</h2>

          <div class="catalog-grid">
            <div>
              <h3>TextField</h3>
              <Stack gap={3}>
                <TextField
                  label="Name"
                  placeholder="Enter your name"
                  value={textValue()}
                  onInput={setTextValue}
                />
                <TextField
                  label="Email"
                  type="email"
                  placeholder="user@example.com"
                  hint="We will not share your email"
                />
                <TextField
                  label="With Error"
                  error="This field is required"
                  required
                />
              </Stack>
            </div>

            <div>
              <h3>TextArea</h3>
              <TextArea
                label="Description"
                placeholder="Enter description..."
                hint="Max 500 characters"
              />
            </div>
          </div>

          <div class="catalog-grid">
            <div>
              <h3>NumberInput</h3>
              <NumberInput
                label="Quantity"
                value={numberValue()}
                onInput={setNumberValue}
                min={0}
                max={100}
                step={1}
              />
            </div>

            <div>
              <h3>Select</h3>
              <Select
                label="Role"
                placeholder="Select a role"
                value={selectValue()}
                onChange={setSelectValue}
                options={[
                  { value: "admin", label: "Admin" },
                  { value: "editor", label: "Editor" },
                  { value: "viewer", label: "Viewer" },
                ]}
              />
            </div>
          </div>

          <h3>Checkbox</h3>
          <div class="catalog-row">
            <Checkbox
              checked={checkboxChecked()}
              onChange={setCheckboxChecked}
              label="Accept terms"
            />
            <Checkbox checked indeterminate label="Indeterminate" />
            <Checkbox disabled label="Disabled" />
          </div>

          <h3>RadioGroup</h3>
          <RadioGroup
            value={radioValue()}
            onChange={setRadioValue}
            label="Select option"
          >
            <HStack gap={4}>
              <RadioButton value="a" label="Option A" />
              <RadioButton value="b" label="Option B" />
              <RadioButton value="c" label="Option C" />
            </HStack>
          </RadioGroup>

          <h3>Switch</h3>
          <div class="catalog-row">
            <Switch
              checked={switchOn()}
              onChange={setSwitchOn}
              label="Enable notifications"
            />
            <Switch checked disabled label="Disabled (on)" />
          </div>
        </section>

        {/* Data Display */}
        <section class="catalog-section">
          <h2>Data Display</h2>

          <h3>Table</h3>
          <div class="catalog-block">
            <Table
              columns={tableColumns}
              data={sortedTableData()}
              rowKey={(row) => row.id}
              sortKey={sortKey()}
              sortDirection={sortDir()}
              onSort={handleSort}
            />
          </div>

          <h3>Card</h3>
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

          <h3>Skeleton</h3>
          <div class="catalog-row">
            <Skeleton variant="circle" width="40px" height="40px" />
            <Stack gap={2}>
              <Skeleton variant="text" width="200px" />
              <Skeleton variant="text" width="150px" />
            </Stack>
          </div>

          <h3>EmptyState</h3>
          <EmptyState
            title="No data"
            description="There are no items to display yet."
            action={<Button variant="primary" size="sm">Create New</Button>}
          />
        </section>

        {/* Feedback */}
        <section class="catalog-section">
          <h2>Feedback</h2>

          <h3>Alert</h3>
          <Stack gap={2}>
            <Alert variant="info">Informational message.</Alert>
            <Alert variant="success">Operation completed successfully.</Alert>
            <Alert variant="warning">Please check your input.</Alert>
            <Alert variant="danger" onDismiss={() => {}}>
              An error occurred. Please try again.
            </Alert>
          </Stack>

          <h3>Progress</h3>
          <Stack gap={2}>
            <Progress value={30} variant="info" />
            <Progress value={65} variant="success" />
            <Progress value={90} variant="warning" />
          </Stack>

          <h3>Spinner</h3>
          <div class="catalog-row">
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
            <Spinner size="md" variant="primary" />
          </div>

          <h3>Dialog</h3>
          <Button variant="primary" onClick={() => setDialogOpen(true)}>
            Open Dialog
          </Button>
          <Dialog open={dialogOpen()} onClose={() => setDialogOpen(false)}>
            <DialogHeader>Confirm Action</DialogHeader>
            <DialogBody>
              <p>Are you sure you want to proceed with this action?</p>
            </DialogBody>
            <DialogFooter>
              <HStack gap={2}>
                <Button variant="neutral" size="sm" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={() => setDialogOpen(false)}>
                  Confirm
                </Button>
              </HStack>
            </DialogFooter>
          </Dialog>
        </section>

        {/* Navigation */}
        <section class="catalog-section">
          <h2>Navigation</h2>

          <h3>Tabs</h3>
          <Tabs value={activeTab()} onChange={setActiveTab}>
            <TabList>
              <Tab value="tab1">Overview</Tab>
              <Tab value="tab2">Details</Tab>
              <Tab value="tab3">Settings</Tab>
            </TabList>
            <TabPanel value="tab1">
              <p>Overview content goes here.</p>
            </TabPanel>
            <TabPanel value="tab2">
              <p>Details content goes here.</p>
            </TabPanel>
            <TabPanel value="tab3">
              <p>Settings content goes here.</p>
            </TabPanel>
          </Tabs>

          <h3>Breadcrumb</h3>
          <Breadcrumb>
            <BreadcrumbItem href="#">Home</BreadcrumbItem>
            <BreadcrumbItem href="#">Users</BreadcrumbItem>
            <BreadcrumbItem current>Tanaka Taro</BreadcrumbItem>
          </Breadcrumb>

          <h3>Pagination</h3>
          <Pagination
            page={page()}
            totalPages={10}
            onChange={setPage}
          />
        </section>
      </div>
  );
}
