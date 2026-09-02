import { createMemo, createSignal, For, Show, type JSX } from "solid-js";

import { Accordion, AccordionItem } from "../../components/ui/soluid/Accordion";
import { Alert } from "../../components/ui/soluid/Alert";
import { AspectRatio } from "../../components/ui/soluid/AspectRatio";
import { Avatar } from "../../components/ui/soluid/Avatar";
import { AvatarGroup } from "../../components/ui/soluid/AvatarGroup";
import { Badge } from "../../components/ui/soluid/Badge";
import { Breadcrumb, BreadcrumbItem } from "../../components/ui/soluid/Breadcrumb";
import { Button } from "../../components/ui/soluid/Button";
import { ButtonGroup } from "../../components/ui/soluid/ButtonGroup";
import { Card, CardBody, CardFooter, CardHeader } from "../../components/ui/soluid/Card";
import { Checkbox } from "../../components/ui/soluid/Checkbox";
import { CheckboxGroup } from "../../components/ui/soluid/CheckboxGroup";
import { Calendar } from "../../components/ui/soluid/Calendar";
import { Carousel } from "../../components/ui/soluid/Carousel";
import { Collapsible } from "../../components/ui/soluid/Collapsible";
import { ColorPicker } from "../../components/ui/soluid/ColorPicker";
import { Combobox } from "../../components/ui/soluid/Combobox";
import type { Command } from "../../components/ui/soluid/CommandPalette";
import { CommandPalette } from "../../components/ui/soluid/CommandPalette";
import { Container } from "../../components/ui/soluid/Container";
import { ContextMenu } from "../../components/ui/soluid/ContextMenu";
import { DatePicker } from "../../components/ui/soluid/DatePicker";
import { DescriptionList } from "../../components/ui/soluid/DescriptionList";
import { Dialog, DialogBody, DialogDescription, DialogFooter, DialogHeader } from "../../components/ui/soluid/Dialog";
import { Divider } from "../../components/ui/soluid/Divider";
import { Drawer, DrawerHeader } from "../../components/ui/soluid/Drawer";
import { EmptyState } from "../../components/ui/soluid/EmptyState";
import { FileUpload } from "../../components/ui/soluid/FileUpload";
import { FormField } from "../../components/ui/soluid/FormField";
import { Grid } from "../../components/ui/soluid/Grid";
import { Heading } from "../../components/ui/soluid/Heading";
import { HStack } from "../../components/ui/soluid/HStack";
import { IconButton } from "../../components/ui/soluid/IconButton";
import { Kbd } from "../../components/ui/soluid/Kbd";
import { Link } from "../../components/ui/soluid/Link";
import { Menu, MenuItem, MenuSeparator } from "../../components/ui/soluid/Menu";
import { NumberInput } from "../../components/ui/soluid/NumberInput";
import { Pagination } from "../../components/ui/soluid/Pagination";
import { PinInput } from "../../components/ui/soluid/PinInput";
import { Popover } from "../../components/ui/soluid/Popover";
import { Progress } from "../../components/ui/soluid/Progress";
import { RadioButton } from "../../components/ui/soluid/RadioButton";
import { RadioGroup } from "../../components/ui/soluid/RadioGroup";
import { Rating } from "../../components/ui/soluid/Rating";
import { SearchField } from "../../components/ui/soluid/SearchField";
import { SegmentedControl } from "../../components/ui/soluid/SegmentedControl";
import { Select } from "../../components/ui/soluid/Select";
import { Skeleton } from "../../components/ui/soluid/Skeleton";
import { Slider } from "../../components/ui/soluid/Slider";
import { Spacer } from "../../components/ui/soluid/Spacer";
import { Spinner } from "../../components/ui/soluid/Spinner";
import { Stack } from "../../components/ui/soluid/Stack";
import { Stat } from "../../components/ui/soluid/Stat";
import { Steps } from "../../components/ui/soluid/Steps";
import { Switch } from "../../components/ui/soluid/Switch";
import { Table } from "../../components/ui/soluid/Table";
import { Tab, TabList, TabPanel, Tabs } from "../../components/ui/soluid/Tabs";
import { Tag } from "../../components/ui/soluid/Tag";
import { Text } from "../../components/ui/soluid/Text";
import { TextArea } from "../../components/ui/soluid/TextArea";
import { TextField, TextFieldInput } from "../../components/ui/soluid/TextField";
import { Timeline } from "../../components/ui/soluid/Timeline";
import { TimePicker } from "../../components/ui/soluid/TimePicker";
import { ToastContainer, useToast } from "../../components/ui/soluid/Toast";
import { Tooltip } from "../../components/ui/soluid/Tooltip";
import { Tree } from "../../components/ui/soluid/Tree";
import { VisuallyHidden } from "../../components/ui/soluid/VisuallyHidden";

/* ---------- Categories ---------- */

export const CATEGORIES = [
  {
    slug: "layout",
    labelKey: "cat.layout",
    components: ["Stack", "Grid", "Container", "AspectRatio", "Divider", "Spacer"],
  },
  {
    slug: "general",
    labelKey: "cat.general",
    components: [
      "Button",
      "ButtonGroup",
      "IconButton",
      "Heading",
      "Text",
      "Link",
      "Kbd",
      "Badge",
      "Tag",
      "Avatar",
      "AvatarGroup",
      "Tooltip",
      "VisuallyHidden",
    ],
  },
  {
    slug: "form",
    labelKey: "cat.form",
    components: [
      "FormField",
      "TextField",
      "TextArea",
      "NumberInput",
      "SearchField",
      "Select",
      "Combobox",
      "DatePicker",
      "TimePicker",
      "ColorPicker",
      "SegmentedControl",
      "Checkbox",
      "CheckboxGroup",
      "RadioGroup",
      "Switch",
      "Slider",
      "Rating",
      "PinInput",
      "FileUpload",
    ],
  },
  {
    slug: "data",
    labelKey: "cat.data",
    components: [
      "Table",
      "Card",
      "Stat",
      "DescriptionList",
      "Timeline",
      "Tree",
      "Calendar",
      "Carousel",
      "Skeleton",
      "EmptyState",
      "Accordion",
      "Collapsible",
    ],
  },
  {
    slug: "feedback",
    labelKey: "cat.feedback",
    components: ["Alert", "Progress", "Spinner", "Dialog", "Drawer", "Toast"],
  },
  {
    slug: "navigation",
    labelKey: "cat.navigation",
    components: ["Tabs", "Breadcrumb", "Steps", "Pagination", "Popover", "Menu", "ContextMenu", "CommandPalette"],
  },
];

/* ---------- Sub-component groups for API tab ---------- */

export const SUB_COMPONENTS: Record<string, string[]> = {
  Stack: ["Stack", "HStack"],
  Card: ["Card", "CardHeader", "CardBody", "CardFooter"],
  Dialog: ["Dialog", "DialogHeader", "DialogDescription", "DialogBody", "DialogFooter"],
  Drawer: ["Drawer", "DrawerHeader"],
  Tabs: ["Tabs", "TabList", "Tab", "TabPanel"],
  Breadcrumb: ["Breadcrumb", "BreadcrumbItem"],
  Accordion: ["Accordion", "AccordionItem"],
  RadioGroup: ["RadioGroup", "RadioButton"],
  Menu: ["Menu", "MenuItem", "MenuSeparator"],
  Toast: ["ToastContainer"],
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

function GridDemo(): JSX.Element {
  return (
    <Stack gap={4}>
      <Grid columns={3} gap={2}>
        <div class="demo-tile">1</div>
        <div class="demo-tile">2</div>
        <div class="demo-tile">3</div>
      </Grid>
      <Grid minItemWidth="8rem" gap={2}>
        <div class="demo-tile">auto-fit</div>
        <div class="demo-tile">auto-fit</div>
        <div class="demo-tile">auto-fit</div>
        <div class="demo-tile">auto-fit</div>
      </Grid>
    </Stack>
  );
}

function ContainerDemo(): JSX.Element {
  return (
    <Container size="sm" class="demo-outline">
      <Text size="sm" tone="muted">
        Centered, max-width “sm”, with horizontal padding.
      </Text>
    </Container>
  );
}

function AspectRatioDemo(): JSX.Element {
  return (
    // Without align="start" the flex row stretches both boxes to the same
    // height, which overrides the ratio being demonstrated.
    <HStack gap={3} align="start">
      <AspectRatio ratio={16 / 9} class="demo-outline" style={{ width: "180px" }}>
        <div class="demo-tile">16 / 9</div>
      </AspectRatio>
      <AspectRatio ratio={1} class="demo-outline" style={{ width: "100px" }}>
        <div class="demo-tile">1 / 1</div>
      </AspectRatio>
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
        <Button variant="primary" disabled>
          Disabled
        </Button>
        <Button variant="primary" loading>
          Loading
        </Button>
      </div>
      <div class="catalog-row">
        <Button variant="primary" size="sm">
          Small
        </Button>
        <Button variant="primary" size="md">
          Medium
        </Button>
        <Button variant="primary" size="lg">
          Large
        </Button>
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

const REMOVABLE_TAGS = [
  { id: "removable", variant: "primary", label: "Removable" },
  { id: "error", variant: "danger", label: "Error" },
] as const;

function TagDemo(): JSX.Element {
  const [removed, setRemoved] = createSignal<string[]>([]);
  const shown = () => REMOVABLE_TAGS.filter((tag) => !removed().includes(tag.id));

  return (
    <div class="catalog-row">
      <For each={shown()}>
        {(tag) => (
          <Tag variant={tag.variant} onRemove={() => setRemoved((ids) => [...ids, tag.id])}>
            {tag.label}
          </Tag>
        )}
      </For>
      <Tag variant="success">Status: OK</Tag>
      <Show when={removed().length > 0}>
        <Button size="sm" variant="neutral" onClick={() => setRemoved([])}>
          Bring them back
        </Button>
      </Show>
    </div>
  );
}

function ButtonGroupDemo(): JSX.Element {
  return (
    <Stack gap={3}>
      <ButtonGroup label="Text alignment">
        <Button variant="neutral">Left</Button>
        <Button variant="neutral">Center</Button>
        <Button variant="neutral">Right</Button>
      </ButtonGroup>
      <ButtonGroup label="Row actions" attached={false}>
        <Button variant="primary">Save</Button>
        <Button variant="neutral">Cancel</Button>
      </ButtonGroup>
    </Stack>
  );
}

function HeadingDemo(): JSX.Element {
  return (
    <Stack gap={2}>
      <Heading level={1}>Heading level 1</Heading>
      <Heading level={2}>Heading level 2</Heading>
      <Heading level={3}>Heading level 3</Heading>
      <Heading level={2} size="md">
        Level 2, sized down to md
      </Heading>
    </Stack>
  );
}

function TextDemo(): JSX.Element {
  return (
    <Stack gap={2}>
      <Text>Default body text.</Text>
      <Text size="sm" tone="muted">
        Small and muted, for secondary information.
      </Text>
      <Text weight="semibold" tone="danger">
        Semibold danger tone.
      </Text>
      <Text truncate>
        Truncated: this sentence keeps going well past the width of its container and gets cut off with an ellipsis.
      </Text>
    </Stack>
  );
}

function LinkDemo(): JSX.Element {
  return (
    <Stack gap={2}>
      <Link href="#">Internal link</Link>
      <Link href="https://www.solidjs.com" external>
        External link
      </Link>
      <Link href="#" tone="neutral" underline="always">
        Neutral, always underlined
      </Link>
    </Stack>
  );
}

function KbdDemo(): JSX.Element {
  return (
    <Text size="sm">
      Press <Kbd>⌘</Kbd> + <Kbd>K</Kbd> to search, <Kbd size="sm">Esc</Kbd> to close.
    </Text>
  );
}

function AvatarGroupDemo(): JSX.Element {
  return (
    <AvatarGroup max={3}>
      <Avatar name="Tanaka Taro" variant="primary" />
      <Avatar name="Suzuki Hanako" variant="success" />
      <Avatar name="Sato Ken" variant="warning" />
      <Avatar name="Ito Mei" variant="info" />
      <Avatar name="Kato Rin" variant="danger" />
    </AvatarGroup>
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
        <Button variant="neutral" size="sm">
          Top
        </Button>
      </Tooltip>
      <Tooltip content="Bottom tooltip" placement="bottom">
        <Button variant="neutral" size="sm">
          Bottom
        </Button>
      </Tooltip>
      <Tooltip content="Left tooltip" placement="left">
        <Button variant="neutral" size="sm">
          Left
        </Button>
      </Tooltip>
      <Tooltip content="Right tooltip" placement="right">
        <Button variant="neutral" size="sm">
          Right
        </Button>
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

function SearchFieldDemo(): JSX.Element {
  const [q, setQ] = createSignal("");
  const [last, setLast] = createSignal("");
  return (
    <Stack gap={3}>
      <SearchField value={q()} onInput={setQ} onSearch={setLast} placeholder="Search orders" />
      <Text size="sm" tone="muted">
        {last() ? `Searched: ${last()}` : "Type and press Enter"}
      </Text>
    </Stack>
  );
}

function ComboboxDemo(): JSX.Element {
  const [country, setCountry] = createSignal("");
  return (
    <Combobox
      label="Country"
      placeholder="Type to filter"
      value={country()}
      onChange={setCountry}
      options={[
        { value: "jp", label: "Japan" },
        { value: "us", label: "United States" },
        { value: "de", label: "Germany" },
        { value: "fr", label: "France" },
        { value: "br", label: "Brazil" },
        { value: "au", label: "Australia (unavailable)", disabled: true },
      ]}
    />
  );
}

function SliderDemo(): JSX.Element {
  const [volume, setVolume] = createSignal(40);
  const [rating, setRating] = createSignal(3);
  return (
    <Stack gap={4}>
      <Slider
        label="Volume"
        value={volume()}
        onInput={setVolume}
        min={0}
        max={100}
        showValue
        formatValue={(v) => `${v}%`}
      />
      <Slider label="Rating" value={rating()} onInput={setRating} min={1} max={5} step={1} size="sm" showValue />
    </Stack>
  );
}

function RatingDemo(): JSX.Element {
  const [score, setScore] = createSignal(3);
  return (
    <Stack gap={3}>
      <Rating label="Rating" value={score()} onChange={setScore} />
      <HStack gap={2} align="center">
        <Rating value={4} readOnly size="sm" />
        <Text size="sm" tone="muted">
          Read-only, 4 of 5
        </Text>
      </HStack>
    </Stack>
  );
}

function PinInputDemo(): JSX.Element {
  const [code, setCode] = createSignal<string[]>([]);
  const [done, setDone] = createSignal("");
  return (
    <Stack gap={3}>
      <PinInput label="One-time code" value={code()} onChange={setCode} length={6} onComplete={setDone} />
      <Text size="sm" tone="muted">
        {done() ? `Completed: ${done()}` : "Paste or type a 6-digit code"}
      </Text>
    </Stack>
  );
}

function FileUploadDemo(): JSX.Element {
  const [files, setFiles] = createSignal<File[]>([]);
  return (
    <FileUpload
      label="Drop files here or click to browse"
      hint="Any file type, nothing is uploaded in this demo"
      multiple
      files={files()}
      onSelect={(added) => setFiles((prev) => [...prev, ...added])}
      onRemove={(_, index) => setFiles((prev) => prev.filter((__, i) => i !== index))}
    />
  );
}

function DatePickerDemo(): JSX.Element {
  const [date, setDate] = createSignal("");
  return (
    <Stack gap={3}>
      <DatePicker
        label="納期"
        placeholder="日付を選択"
        value={date()}
        onChange={setDate}
        locale="ja-JP"
        weekStartsOn={1}
        hint="カレンダーは矢印キーで移動できます"
      />
      <Text size="sm" tone="muted">
        {date() ? `選択: ${date()}` : "未選択"}
      </Text>
    </Stack>
  );
}

function TimePickerDemo(): JSX.Element {
  const [time, setTime] = createSignal("");
  return (
    <TimePicker
      label="開始時刻"
      placeholder="時刻を選択"
      value={time()}
      onChange={setTime}
      min="09:00"
      max="18:00"
      step={30}
      listLabel="時刻の候補"
    />
  );
}

function ColorPickerDemo(): JSX.Element {
  const [color, setColor] = createSignal("#3b82f6");
  return (
    <Stack gap={3}>
      <ColorPicker
        label="ブランドカラー"
        value={color()}
        onChange={setColor}
        panelLabel="色を選択"
        customLabel="カスタム"
        hexLabel="HEX"
      />
      <div
        style={{
          height: "48px",
          "border-radius": "var(--so-radius)",
          "background-color": color(),
        }}
      />
    </Stack>
  );
}

function CalendarDemo(): JSX.Element {
  const [day, setDay] = createSignal("2026-07-25");
  return (
    <Stack gap={3}>
      <Calendar value={day()} onChange={setDay} locale="ja-JP" weekStartsOn={1} label="日付" />
      <Text size="sm" tone="muted">
        選択: {day()}
      </Text>
    </Stack>
  );
}

function CarouselDemo(): JSX.Element {
  const [slide, setSlide] = createSignal(0);
  const tones = ["primary", "success", "warning"];
  return (
    <Carousel index={slide()} onIndexChange={setSlide} label="サンプルスライド" loop>
      <For each={tones}>
        {(tone, i) => (
          <div
            style={{
              display: "flex",
              "align-items": "center",
              "justify-content": "center",
              height: "160px",
              "border-radius": "var(--so-radius)",
              "background-color": `var(--so-color-${tone}-subtle)`,
              color: `var(--so-color-${tone}-subtle-fg)`,
              "font-size": "var(--so-font-size-lg)",
              "font-weight": "600",
            }}
          >
            スライド {i() + 1}
          </div>
        )}
      </For>
    </Carousel>
  );
}

function CommandPaletteDemo(): JSX.Element {
  const [open, setOpen] = createSignal(false);
  const [last, setLast] = createSignal("");
  const commands: Command[] = [
    { id: "new", label: "新規作成", group: "ファイル", shortcut: "⌘N" },
    { id: "open", label: "開く", group: "ファイル", shortcut: "⌘O", keywords: "file load" },
    { id: "save", label: "保存", group: "ファイル", shortcut: "⌘S" },
    { id: "theme", label: "テーマを切り替え", group: "表示" },
    { id: "density", label: "密度を切り替え", group: "表示" },
    { id: "archive", label: "アーカイブ（無効）", group: "その他", disabled: true },
  ];
  return (
    <Stack gap={3}>
      <Button variant="neutral" onClick={() => setOpen(true)}>
        コマンドパレットを開く
      </Button>
      <Text size="sm" tone="muted">
        {last() ? `実行: ${last()}` : "未実行"}
      </Text>
      <CommandPalette
        open={open()}
        onOpenChange={setOpen}
        commands={commands}
        placeholder="コマンドを検索"
        emptyLabel="該当するコマンドがありません"
        label="コマンドパレット"
        onSelect={(command) => setLast(command.label)}
      />
    </Stack>
  );
}

function SegmentedControlDemo(): JSX.Element {
  const [range, setRange] = createSignal("7d");
  return (
    <Stack gap={3}>
      <SegmentedControl
        label="Date range"
        value={range()}
        onChange={setRange}
        options={[
          { value: "24h", label: "24h" },
          { value: "7d", label: "7 days" },
          { value: "30d", label: "30 days" },
          { value: "all", label: "All", disabled: true },
        ]}
      />
      <Text size="sm" tone="muted">
        Selected: {range()}
      </Text>
    </Stack>
  );
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
  // A mixed checkbox resolves to a plain one the moment it is clicked, the way
  // a "select all" box behaves. Pinning `indeterminate` would freeze the demo.
  const [mixed, setMixed] = createSignal(true);
  const [partial, setPartial] = createSignal(true);
  return (
    <div class="catalog-row">
      <Checkbox checked={checked()} onChange={setChecked} label="Accept terms" />
      <Checkbox
        checked={partial()}
        indeterminate={mixed()}
        onChange={(next) => {
          setMixed(false);
          setPartial(next);
        }}
        label="Indeterminate"
      />
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
      onSort={(key, dir) => {
        setSortKey(key);
        setSortDir(dir);
      }}
    />
  );
}

function TimelineDemo(): JSX.Element {
  return (
    <Timeline
      items={[
        {
          title: "Order placed",
          description: "3 items, ¥12,400",
          timestamp: "10:24",
          dateTime: "2026-07-25T10:24",
          variant: "success",
        },
        { title: "Payment captured", timestamp: "10:26", dateTime: "2026-07-25T10:26" },
        {
          title: "Refund requested",
          description: "Customer changed their mind",
          timestamp: "14:02",
          variant: "warning",
        },
        { title: "Shipment failed", timestamp: "16:40", variant: "danger" },
      ]}
    />
  );
}

function TreeDemo(): JSX.Element {
  const [expanded, setExpanded] = createSignal(["src", "components"]);
  const [selected, setSelected] = createSignal<string>();
  return (
    <Tree
      label="Files"
      nodes={[
        {
          id: "src",
          label: "src",
          children: [
            {
              id: "components",
              label: "components",
              children: [
                { id: "button", label: "Button.tsx" },
                { id: "card", label: "Card.tsx" },
              ],
            },
            { id: "index", label: "index.ts" },
          ],
        },
        { id: "readme", label: "README.md" },
        { id: "lock", label: "bun.lock", disabled: true },
      ]}
      expanded={expanded()}
      onExpandedChange={setExpanded}
      selected={selected()}
      onSelect={setSelected}
    />
  );
}

function StatDemo(): JSX.Element {
  return (
    <Grid minItemWidth="12rem" gap={4}>
      <Stat label="Monthly revenue" value="¥1,284,000" delta="+12.5%" deltaTone="positive" hint="vs. previous month" />
      <Stat label="Churn" value="2.4%" delta="-0.3pt" deltaTone="negative" hint="vs. previous month" />
      <Stat label="Active users" value="8,921" delta="±0" />
    </Grid>
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
            <Button variant="primary" size="sm">
              Action
            </Button>
            <Button variant="neutral" size="sm">
              Cancel
            </Button>
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
      action={
        <Button variant="primary" size="sm">
          Create New
        </Button>
      }
    />
  );
}

function CollapsibleDemo(): JSX.Element {
  const [open, setOpen] = createSignal(false);
  return (
    <Collapsible open={open()} onOpenChange={setOpen} title="Advanced options">
      <Text size="sm" tone="muted">
        The open state lives with the caller, so it can be driven from a signal, a route or a form.
      </Text>
    </Collapsible>
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
  const [dismissed, setDismissed] = createSignal(false);

  return (
    <Stack gap={2}>
      <Alert variant="info">Informational message.</Alert>
      <Alert variant="success">Operation completed successfully.</Alert>
      <Alert variant="warning">Please check your input.</Alert>
      <Show
        when={!dismissed()}
        fallback={
          <Button size="sm" variant="neutral" onClick={() => setDismissed(false)}>
            Bring the dismissible alert back
          </Button>
        }
      >
        <Alert variant="danger" onDismiss={() => setDismissed(true)}>
          An error occurred. Please try again.
        </Alert>
      </Show>
    </Stack>
  );
}

function ProgressDemo(): JSX.Element {
  return (
    <Stack gap={2}>
      <Progress value={30} variant="info" aria-label="Upload 30%" />
      <Progress value={65} variant="success" aria-label="Upload 65%" />
      <Progress value={90} variant="warning" aria-label="Upload 90%" />
      <Progress
        aria-label="Disk usage by type"
        segments={[
          { value: 40, variant: "success" },
          { value: 20, variant: "info" },
          { value: 15, variant: "danger" },
        ]}
      />
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
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open Dialog
      </Button>
      <Dialog open={open()} onClose={() => setOpen(false)}>
        <DialogHeader>Confirm Action</DialogHeader>
        <DialogDescription>This cannot be undone.</DialogDescription>
        <DialogBody>
          <p>Are you sure you want to proceed with this action?</p>
        </DialogBody>
        <DialogFooter>
          <HStack gap={2}>
            <Button variant="neutral" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={() => setOpen(false)}>
              Confirm
            </Button>
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
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open Drawer
      </Button>
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
        <Button
          variant="neutral"
          size="sm"
          onClick={() => toast.add({ message: "Info notification", variant: "info" })}
        >
          Info
        </Button>
        <Button variant="neutral" size="sm" onClick={() => toast.add({ message: "Success!", variant: "success" })}>
          Success
        </Button>
        <Button
          variant="neutral"
          size="sm"
          onClick={() => toast.add({ message: "Warning issued", variant: "warning" })}
        >
          Warning
        </Button>
        <Button
          variant="neutral"
          size="sm"
          onClick={() => toast.add({ message: "Something failed", variant: "danger" })}
        >
          Danger
        </Button>
      </div>
      <ToastContainer />
    </>
  );
}

function VisuallyHiddenDemo(): JSX.Element {
  return (
    <Stack gap={2}>
      <Button variant="neutral">
        ✕<VisuallyHidden>Close panel</VisuallyHidden>
      </Button>
      <p style={{ "font-size": "var(--so-font-size-sm)", color: "var(--so-text-muted)", margin: "0" }}>
        The button above reads as “Close panel” to a screen reader.
      </p>
    </Stack>
  );
}

function FormFieldDemo(): JSX.Element {
  return (
    <Stack gap={3}>
      <FormField label="API key" hint="Found in your project settings" required>
        <TextFieldInput placeholder="sk-..." />
      </FormField>
      <FormField label="Workspace" error="This workspace no longer exists">
        <TextFieldInput value="acme-prod" />
      </FormField>
    </Stack>
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
  );
}

function StepsDemo(): JSX.Element {
  const [current, setCurrent] = createSignal(1);
  const steps = [{ label: "Cart", description: "3 items" }, { label: "Shipping" }, { label: "Payment" }];
  return (
    <Stack gap={4}>
      <Steps label="Checkout" current={current()} steps={steps} />
      <ButtonGroup label="Step navigation">
        <Button variant="neutral" onClick={() => setCurrent((c) => Math.max(0, c - 1))}>
          Back
        </Button>
        <Button variant="neutral" onClick={() => setCurrent((c) => Math.min(steps.length - 1, c + 1))}>
          Next
        </Button>
      </ButtonGroup>
      <Steps label="Checkout, vertical" orientation="vertical" current={current()} steps={steps} />
    </Stack>
  );
}

function ContextMenuDemo(): JSX.Element {
  const [action, setAction] = createSignal("");
  return (
    <Stack gap={3}>
      <ContextMenu
        label="Row actions"
        content={
          <>
            <MenuItem onSelect={() => setAction("Rename")}>Rename</MenuItem>
            <MenuItem onSelect={() => setAction("Duplicate")}>Duplicate</MenuItem>
            <MenuSeparator />
            <MenuItem onSelect={() => setAction("Delete")}>Delete</MenuItem>
          </>
        }
      >
        <div class="demo-outline" style={{ padding: "var(--so-space-5)", "text-align": "center" }}>
          Right-click (or press the context-menu key) here
        </div>
      </ContextMenu>
      <Text size="sm" tone="muted">
        {action() ? `Selected: ${action()}` : "No action yet"}
      </Text>
    </Stack>
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
      {/* Distinct labels: two landmarks sharing one name are indistinguishable. */}
      <Pagination label="Compact pagination" page={p1()} totalPages={10} onChange={setP1} />
      <Pagination label="Numbered pagination" page={p2()} totalPages={20} onChange={setP2} showPages maxVisible={7} />
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
          <Button variant="primary" size="sm" onClick={() => setOpen(false)}>
            Close
          </Button>
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
  Stack: StackDemo,
  Grid: GridDemo,
  Container: ContainerDemo,
  AspectRatio: AspectRatioDemo,
  Divider: DividerDemo,
  Spacer: SpacerDemo,
  Button: ButtonDemo,
  ButtonGroup: ButtonGroupDemo,
  IconButton: IconButtonDemo,
  Heading: HeadingDemo,
  Text: TextDemo,
  Link: LinkDemo,
  Kbd: KbdDemo,
  Badge: BadgeDemo,
  Tag: TagDemo,
  Avatar: AvatarDemo,
  AvatarGroup: AvatarGroupDemo,
  Tooltip: TooltipDemo,
  VisuallyHidden: VisuallyHiddenDemo,
  FormField: FormFieldDemo,
  SearchField: SearchFieldDemo,
  Combobox: ComboboxDemo,
  DatePicker: DatePickerDemo,
  TimePicker: TimePickerDemo,
  ColorPicker: ColorPickerDemo,
  Calendar: CalendarDemo,
  Carousel: CarouselDemo,
  CommandPalette: CommandPaletteDemo,
  SegmentedControl: SegmentedControlDemo,
  Slider: SliderDemo,
  Rating: RatingDemo,
  PinInput: PinInputDemo,
  FileUpload: FileUploadDemo,
  Stat: StatDemo,
  Timeline: TimelineDemo,
  Tree: TreeDemo,
  Steps: StepsDemo,
  ContextMenu: ContextMenuDemo,
  Collapsible: CollapsibleDemo,
  TextField: TextFieldDemo,
  TextArea: TextAreaDemo,
  NumberInput: NumberInputDemo,
  Select: SelectDemo,
  Checkbox: CheckboxDemo,
  CheckboxGroup: CheckboxGroupDemo,
  RadioGroup: RadioGroupDemo,
  Switch: SwitchDemo,
  Table: TableDemo,
  Card: CardDemo,
  DescriptionList: DescriptionListDemo,
  Skeleton: SkeletonDemo,
  EmptyState: EmptyStateDemo,
  Accordion: AccordionDemo,
  Alert: AlertDemo,
  Progress: ProgressDemo,
  Spinner: SpinnerDemo,
  Dialog: DialogDemo,
  Drawer: DrawerDemo,
  Toast: ToastDemo,
  Tabs: TabsDemo,
  Breadcrumb: BreadcrumbDemo,
  Pagination: PaginationDemo,
  Popover: PopoverDemo,
  Menu: MenuDemo,
};
