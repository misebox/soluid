import { createSignal, For, Show } from "solid-js";
import { Avatar } from "../../components/ui/soluid/Avatar";
import { Badge } from "../../components/ui/soluid/Badge";
import { Button } from "../../components/ui/soluid/Button";
import { Card, CardBody, CardFooter, CardHeader } from "../../components/ui/soluid/Card";
import { Collapsible } from "../../components/ui/soluid/Collapsible";
import { DescriptionList } from "../../components/ui/soluid/DescriptionList";
import { Divider } from "../../components/ui/soluid/Divider";
import { Heading } from "../../components/ui/soluid/Heading";
import { HStack } from "../../components/ui/soluid/HStack";
import { IconButton } from "../../components/ui/soluid/IconButton";
import { Menu, MenuItem, MenuSeparator } from "../../components/ui/soluid/Menu";
import { Popover } from "../../components/ui/soluid/Popover";
import { Progress } from "../../components/ui/soluid/Progress";
import { SegmentedControl } from "../../components/ui/soluid/SegmentedControl";
import { Skeleton } from "../../components/ui/soluid/Skeleton";
import { Spacer } from "../../components/ui/soluid/Spacer";
import { Spinner } from "../../components/ui/soluid/Spinner";
import { Stack } from "../../components/ui/soluid/Stack";
import { Stat } from "../../components/ui/soluid/Stat";
import { Tag } from "../../components/ui/soluid/Tag";
import type { Column } from "../../components/ui/soluid/Table";
import { Table } from "../../components/ui/soluid/Table";
import { Text } from "../../components/ui/soluid/Text";
import { Timeline } from "../../components/ui/soluid/Timeline";
import { ToastContainer, useToast } from "../../components/ui/soluid/Toast";
import { Tooltip } from "../../components/ui/soluid/Tooltip";

/* ---------- Icons ---------- */

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
    <path d="M20 11a8 8 0 10-2.3 5.7" />
    <path d="M20 5v6h-6" stroke-linejoin="round" />
  </svg>
);

const HelpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M9.6 9.2a2.5 2.5 0 114 2.3c-.9.6-1.6 1-1.6 2.1" />
    <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
  </svg>
);

const ChevronIcon = () => (
  <svg
    class="dash-chevron"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/* ---------- Data ---------- */

interface Order {
  id: string;
  customer: string;
  amount: string;
  status: "completed" | "pending" | "cancelled";
  date: string;
  [key: string]: unknown;
}

const ORDERS: Order[] = [
  { id: "ORD-001", customer: "田中太郎", amount: "¥12,800", status: "completed", date: "06-30 14:22" },
  { id: "ORD-002", customer: "佐藤花子", amount: "¥8,400", status: "pending", date: "06-30 11:48" },
  { id: "ORD-003", customer: "鈴木一郎", amount: "¥24,000", status: "completed", date: "06-29 19:03" },
  { id: "ORD-004", customer: "高橋美咲", amount: "¥3,200", status: "cancelled", date: "06-29 16:40" },
  { id: "ORD-005", customer: "伊藤健太", amount: "¥15,600", status: "completed", date: "06-28 09:15" },
  { id: "ORD-006", customer: "渡辺陽子", amount: "¥9,900", status: "pending", date: "06-28 08:02" },
];

const STATUS_VARIANT = {
  completed: "success",
  pending: "warning",
  cancelled: "danger",
} as const;

const STATUS_LABEL = {
  completed: "完了",
  pending: "処理中",
  cancelled: "キャンセル",
} as const;

/** Monthly revenue in 万円. The last point is the headline figure. */
const REVENUE = [
  { label: "1月", value: 98 },
  { label: "2月", value: 112 },
  { label: "3月", value: 96 },
  { label: "4月", value: 134 },
  { label: "5月", value: 148 },
  { label: "6月", value: 128 },
];

const SECONDARY = [
  { label: "注文数", value: "324", change: "8.2%", positive: true, trend: [240, 268, 255, 290, 310, 324] },
  { label: "顧客数", value: "1,892", change: "3.1%", positive: true, trend: [1710, 1755, 1790, 1820, 1860, 1892] },
  { label: "返品率", value: "2.4%", change: "0.8pt", positive: false, trend: [1.4, 1.6, 1.5, 1.9, 2.1, 2.4] },
];

const CATEGORIES = [
  { label: "エレクトロニクス", value: 78, amount: "¥998,400" },
  { label: "アパレル", value: 62, amount: "¥793,600" },
  { label: "食品", value: 45, amount: "¥576,000" },
  { label: "書籍", value: 31, amount: "¥396,800" },
];

/* ---------- Charts ---------- */

/** Rounds up to a readable axis maximum, e.g. 148 -> 200. */
function niceMax(value: number): number {
  const magnitude = 10 ** Math.floor(Math.log10(value));
  return Math.ceil(value / magnitude) * magnitude;
}

const CHART = { width: 640, height: 200, left: 36, right: 8, top: 14, bottom: 28 };

function TrendChart(props: { data: { label: string; value: number }[] }) {
  const top = () => niceMax(Math.max(...props.data.map((d) => d.value)));
  const plotWidth = CHART.width - CHART.left - CHART.right;
  const plotHeight = CHART.height - CHART.top - CHART.bottom;

  const x = (index: number) => CHART.left + (index * plotWidth) / (props.data.length - 1);
  const y = (value: number) => CHART.top + (1 - value / top()) * plotHeight;

  const points = () => props.data.map((d, i) => `${x(i)},${y(d.value)}`).join(" ");
  const area = () =>
    `M${x(0)},${CHART.top + plotHeight} L${props.data.map((d, i) => `${x(i)},${y(d.value)}`).join(" L")} L${x(
      props.data.length - 1,
    )},${CHART.top + plotHeight} Z`;

  const ticks = () => [0, 0.5, 1].map((ratio) => Math.round(top() * ratio));
  const last = () => props.data.length - 1;

  return (
    <svg
      class="dash-chart"
      viewBox={`0 0 ${CHART.width} ${CHART.height}`}
      role="img"
      aria-label={`月間売上推移。${props.data.map((d) => `${d.label} ${d.value}万円`).join("、")}`}
    >
      <defs>
        <linearGradient id="dash-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--so-color-primary-base)" stop-opacity="0.24" />
          <stop offset="100%" stop-color="var(--so-color-primary-base)" stop-opacity="0" />
        </linearGradient>
      </defs>

      <For each={ticks()}>
        {(tick) => (
          <>
            <line class="dash-chart__grid" x1={CHART.left} x2={CHART.width - CHART.right} y1={y(tick)} y2={y(tick)} />
            <text class="dash-chart__tick" x={CHART.left - 8} y={y(tick)} text-anchor="end" dominant-baseline="middle">
              {tick}
            </text>
          </>
        )}
      </For>

      <path class="dash-chart__area" d={area()} fill="url(#dash-area)" />
      <polyline class="dash-chart__line" points={points()} />

      {/* Only the latest point is marked: it is the figure quoted on the left. */}
      <circle class="dash-chart__dot" cx={x(last())} cy={y(props.data[last()].value)} r="4" />

      <For each={props.data}>
        {(d, i) => (
          <text class="dash-chart__label" x={x(i())} y={CHART.height - 8} text-anchor="middle">
            {d.label}
          </text>
        )}
      </For>
    </svg>
  );
}

/** Bare trend line for the secondary figures — shape only, no axes. */
function Sparkline(props: { values: number[]; positive: boolean }) {
  const lo = () => Math.min(...props.values);
  const hi = () => Math.max(...props.values);
  const points = () =>
    props.values
      .map((value, i) => {
        const span = hi() - lo() || 1;
        return `${(i * 100) / (props.values.length - 1)},${24 - ((value - lo()) / span) * 20}`;
      })
      .join(" ");

  return (
    <svg
      class={`dash-spark ${props.positive ? "dash-spark--up" : "dash-spark--down"}`}
      viewBox="0 0 100 28"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polyline points={points()} />
    </svg>
  );
}

/* ---------- Page ---------- */

function CategoryRow(props: { label: string; value: number; amount: string }) {
  return (
    <div class="dash-category">
      <span class="dash-category__label">{props.label}</span>
      <span class="dash-category__amount">{props.amount}</span>
      <Progress value={props.value} aria-label={`${props.label} ${props.value}%`} size="sm" />
      <span class="dash-category__percent">{props.value}%</span>
    </div>
  );
}

export function DashboardApp() {
  const [loading, setLoading] = createSignal(true);
  const [range, setRange] = createSignal("30d");
  const [menuOpen, setMenuOpen] = createSignal(false);
  const [popoverOpen, setPopoverOpen] = createSignal(false);
  const [systemOpen, setSystemOpen] = createSignal(false);
  const toast = useToast();

  setTimeout(() => setLoading(false), 1000);

  const columns: Column<Order>[] = [
    { key: "id", header: "注文ID", width: "7rem" },
    {
      key: "customer",
      header: "顧客",
      render: (_v, row) => (
        <HStack gap={2} align="center">
          <Avatar name={row.customer as string} size="sm" />
          <span>{row.customer as string}</span>
        </HStack>
      ),
    },
    { key: "amount", header: "金額", align: "end" },
    {
      key: "status",
      header: "ステータス",
      render: (_v, row) => (
        <Badge variant={STATUS_VARIANT[row.status as Order["status"]]} size="sm">
          {STATUS_LABEL[row.status as Order["status"]]}
        </Badge>
      ),
    },
    { key: "date", header: "受注", align: "end" },
  ];

  function refresh() {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  }

  function handleExport() {
    toast.add({ message: "CSVファイルを準備しています…", variant: "info" });
    setTimeout(() => toast.add({ message: "ダウンロードが開始されました", variant: "success" }), 2000);
  }

  return (
    <div class="sample-page">
      <ToastContainer position="top-right" />

      <Stack gap={4}>
        <div class="dash-header">
          <Stack gap={1}>
            <Heading level={1} size="xl">
              売上サマリ
            </Heading>
            <HStack gap={2} align="center">
              <span class="dash-live" aria-hidden="true" />
              <Text as="span" size="sm" tone="muted">
                全店舗 · 2026年6月30日 14:22 時点
              </Text>
            </HStack>
          </Stack>
          <HStack gap={2} align="center">
            <SegmentedControl
              size="sm"
              label="集計期間"
              value={range()}
              onChange={setRange}
              options={[
                { value: "7d", label: "7日" },
                { value: "30d", label: "30日" },
                { value: "12m", label: "12ヶ月" },
              ]}
            />
            <Tooltip content="データを更新">
              <IconButton variant="ghost" size="sm" icon={<RefreshIcon />} aria-label="更新" onClick={refresh} />
            </Tooltip>
            <Menu
              open={menuOpen()}
              onOpenChange={setMenuOpen}
              trigger={
                <Button variant="neutral" size="sm" iconRight={<ChevronIcon />}>
                  操作
                </Button>
              }
            >
              <MenuItem onSelect={handleExport}>CSVエクスポート</MenuItem>
              <MenuItem onSelect={() => toast.add({ message: "レポート生成中…", variant: "info" })}>
                レポート生成
              </MenuItem>
              <MenuSeparator />
              <MenuItem onSelect={() => toast.add({ message: "設定を開きます", variant: "info" })}>設定</MenuItem>
            </Menu>
          </HStack>
        </div>

        {/* The headline figure and the chart it comes from live together. */}
        <Card>
          <CardBody>
            <Show when={!loading()} fallback={<HeroSkeleton />}>
              <div class="dash-hero">
                <div class="dash-hero__figure">
                  <HStack gap={2} align="center">
                    <Text as="span" size="sm" tone="muted">
                      今月の売上
                    </Text>
                    <Popover
                      open={popoverOpen()}
                      onOpenChange={setPopoverOpen}
                      content={
                        <Stack gap={2} class="dash-popover">
                          <Text weight="semibold" size="sm">
                            売上の集計について
                          </Text>
                          <Text size="sm" tone="muted">
                            確定済みの注文のみを対象とし、キャンセルと返金は差し引いています。
                          </Text>
                        </Stack>
                      }
                    >
                      <IconButton variant="ghost" size="sm" icon={<HelpIcon />} aria-label="集計方法" />
                    </Popover>
                  </HStack>
                  <p class="dash-hero__value">¥1,280,000</p>
                  <HStack gap={2} align="center">
                    <Badge variant="success" size="sm">
                      ▲ 12.5%
                    </Badge>
                    <Text as="span" size="xs" tone="muted">
                      前月比 +¥142,000
                    </Text>
                  </HStack>
                </div>
                <div class="dash-hero__chart">
                  <TrendChart data={REVENUE} />
                </div>
              </div>
            </Show>
          </CardBody>
          <CardFooter>
            <div class="dash-strip">
              <For each={SECONDARY}>
                {(metric, i) => (
                  <>
                    <Show when={i() > 0}>
                      <Divider orientation="vertical" />
                    </Show>
                    <div class="dash-strip__item">
                      <Stat
                        label={metric.label}
                        value={metric.value}
                        delta={`${metric.positive ? "▲" : "▼"} ${metric.change}`}
                        deltaTone={metric.positive ? "positive" : "negative"}
                      />
                      <Sparkline values={metric.trend} positive={metric.positive} />
                    </div>
                  </>
                )}
              </For>
            </div>
          </CardFooter>
        </Card>

        <div class="dash-columns">
          <Card>
            <CardHeader>
              <HStack gap={2} align="center">
                <Text as="span" weight="semibold">
                  直近の注文
                </Text>
                <Tag variant="neutral" size="sm">
                  {ORDERS.length} 件
                </Tag>
                <Spacer />
                <Button variant="ghost" size="sm" onClick={handleExport}>
                  エクスポート
                </Button>
              </HStack>
            </CardHeader>
            <CardBody>
              <Table
                columns={columns}
                data={ORDERS}
                rowKey={(row) => row.id}
                selectRowLabel={(row) => `注文 ${row.id} を選択`}
              />
            </CardBody>
          </Card>

          <Stack gap={3}>
            <Card>
              <CardHeader>
                <Text as="span" weight="semibold">
                  カテゴリ別
                </Text>
              </CardHeader>
              <CardBody>
                <Stack gap={3}>
                  <For each={CATEGORIES}>
                    {(category) => (
                      <CategoryRow label={category.label} value={category.value} amount={category.amount} />
                    )}
                  </For>
                </Stack>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <Text as="span" weight="semibold">
                  アクティビティ
                </Text>
              </CardHeader>
              <CardBody>
                <Timeline
                  items={[
                    {
                      title: "デプロイ完了",
                      description: "v2.14.0 を本番環境に反映",
                      timestamp: "14:22",
                      dateTime: "2026-06-30T14:22",
                      variant: "success",
                    },
                    {
                      title: "在庫アラート",
                      description: "ワイヤレスイヤホンの在庫が残り3点",
                      timestamp: "11:05",
                      dateTime: "2026-06-30T11:05",
                      variant: "warning",
                    },
                    {
                      title: "返金処理",
                      description: "ORD-004 をキャンセル",
                      timestamp: "09:48",
                      dateTime: "2026-06-30T09:48",
                      variant: "danger",
                    },
                    { title: "日次バッチ実行", timestamp: "03:00", dateTime: "2026-06-30T03:00" },
                  ]}
                />
              </CardBody>
            </Card>
          </Stack>
        </div>

        <Collapsible open={systemOpen()} onOpenChange={setSystemOpen} title="システム情報">
          <DescriptionList
            columns={2}
            items={[
              { term: "サーバー稼働時間", description: "14日 8時間 32分" },
              {
                term: "API応答時間",
                description: (
                  <HStack gap={2} align="center">
                    <span>42ms</span>
                    <Badge variant="success" size="sm">
                      正常
                    </Badge>
                  </HStack>
                ),
              },
              {
                term: "データベース",
                description: (
                  <HStack gap={2} align="center">
                    <span>PostgreSQL 16</span>
                    <Badge variant="info" size="sm">
                      v16.2
                    </Badge>
                  </HStack>
                ),
              },
              { term: "最終デプロイ", description: "2026-06-30 14:22" },
              { term: "ストレージ使用量", description: <Progress value={68} aria-label="ストレージ使用量" /> },
              { term: "メモリ使用率", description: <Progress value={42} aria-label="メモリ使用率" /> },
            ]}
          />
        </Collapsible>

        <HStack gap={2} align="center">
          <Show when={loading()}>
            <Spinner size="sm" label="更新中" />
          </Show>
          <Text as="span" size="xs" tone="muted">
            30秒ごとに自動更新
          </Text>
        </HStack>
      </Stack>
    </div>
  );
}

function HeroSkeleton() {
  return (
    <div class="dash-hero">
      <Stack gap={2}>
        <Skeleton width="6rem" height="12px" />
        <Skeleton width="11rem" height="36px" />
        <Skeleton width="8rem" height="16px" />
      </Stack>
      <Skeleton variant="rect" height="160px" />
    </div>
  );
}
