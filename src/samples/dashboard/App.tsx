import { createSignal, For, Show } from "solid-js";
import type { JSX } from "solid-js";
import { Avatar } from "../../components/ui/soluid/Avatar";
import { Badge } from "../../components/ui/soluid/Badge";
import { Breadcrumb, BreadcrumbItem } from "../../components/ui/soluid/Breadcrumb";
import { Button } from "../../components/ui/soluid/Button";
import { Card, CardBody, CardHeader } from "../../components/ui/soluid/Card";
import { DescriptionList } from "../../components/ui/soluid/DescriptionList";
import { Divider } from "../../components/ui/soluid/Divider";
import { Grid } from "../../components/ui/soluid/Grid";
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
import { Tab, TabList, TabPanel, Tabs } from "../../components/ui/soluid/Tabs";
import { Tag } from "../../components/ui/soluid/Tag";
import type { Column } from "../../components/ui/soluid/Table";
import { Table } from "../../components/ui/soluid/Table";
import { Text } from "../../components/ui/soluid/Text";
import { Timeline } from "../../components/ui/soluid/Timeline";
import { ToastContainer, useToast } from "../../components/ui/soluid/Toast";
import { Tooltip } from "../../components/ui/soluid/Tooltip";

interface Order {
  id: string;
  customer: string;
  amount: string;
  status: "completed" | "pending" | "cancelled";
  date: string;
  [key: string]: unknown;
}

const ORDERS: Order[] = [
  { id: "ORD-001", customer: "田中太郎", amount: "¥12,800", status: "completed", date: "2026-05-30" },
  { id: "ORD-002", customer: "佐藤花子", amount: "¥8,400", status: "pending", date: "2026-05-30" },
  { id: "ORD-003", customer: "鈴木一郎", amount: "¥24,000", status: "completed", date: "2026-05-29" },
  { id: "ORD-004", customer: "高橋美咲", amount: "¥3,200", status: "cancelled", date: "2026-05-29" },
  { id: "ORD-005", customer: "伊藤健太", amount: "¥15,600", status: "completed", date: "2026-05-28" },
  { id: "ORD-006", customer: "渡辺陽子", amount: "¥9,900", status: "pending", date: "2026-05-28" },
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

function MetricCard(props: { label: string; value: string; change: string; positive: boolean }) {
  return (
    <Card>
      <CardBody>
        <Stat
          label={props.label}
          value={props.value}
          delta={`${props.positive ? "↑" : "↓"} ${props.change}`}
          deltaTone={props.positive ? "positive" : "negative"}
          hint="前月比"
        />
      </CardBody>
    </Card>
  );
}

function SkeletonCards() {
  return (
    <Grid minItemWidth="12rem" gap={4}>
      <For each={[1, 2, 3, 4]}>
        {() => (
          <Card>
            <CardBody>
              <Stack gap={2}>
                <Skeleton width="60px" height="12px" />
                <Skeleton width="120px" height="32px" />
                <Skeleton width="100px" height="16px" />
              </Stack>
            </CardBody>
          </Card>
        )}
      </For>
    </Grid>
  );
}

export function DashboardApp() {
  const [loading, setLoading] = createSignal(true);
  const [tab, setTab] = createSignal("overview");
  const [menuOpen, setMenuOpen] = createSignal(false);
  const [popoverOpen, setPopoverOpen] = createSignal(false);
  const [range, setRange] = createSignal("7d");
  const toast = useToast();

  setTimeout(() => setLoading(false), 1500);

  const columns: Column<Order>[] = [
    { key: "id", header: "注文ID", width: "120px" },
    {
      key: "customer",
      header: "顧客",
      render: (_v, row) => (
        <HStack gap={2}>
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
    { key: "date", header: "日付" },
  ];

  function handleExport() {
    toast.add({ message: "CSVファイルを準備しています…", variant: "info" });
    setTimeout(() => {
      toast.add({ message: "ダウンロードが開始されました", variant: "success" });
    }, 2000);
  }

  return (
    <div class="sample-page">
      <ToastContainer position="top-right" />

      <Breadcrumb>
        <BreadcrumbItem href="#">ホーム</BreadcrumbItem>
        <BreadcrumbItem current>ダッシュボード</BreadcrumbItem>
      </Breadcrumb>

      <div style={{ height: "16px" }} />

      <div class="sample-header">
        <h1>ダッシュボード</h1>
        <HStack gap={2}>
          <Tooltip content="データを更新">
            <IconButton
              variant="neutral"
              size="sm"
              icon={<span>↻</span>}
              aria-label="更新"
              onClick={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 1000);
              }}
            />
          </Tooltip>
          <Menu
            open={menuOpen()}
            onOpenChange={setMenuOpen}
            trigger={
              <Button variant="neutral" size="sm">
                操作 ▾
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

      <Show when={!loading()} fallback={<SkeletonCards />}>
        <Grid minItemWidth="12rem" gap={4}>
          <MetricCard label="売上" value="¥1,284,000" change="12.5%" positive />
          <MetricCard label="注文数" value="324" change="8.2%" positive />
          <MetricCard label="顧客数" value="1,892" change="3.1%" positive />
          <MetricCard label="返品率" value="2.4%" change="0.8%" positive={false} />
        </Grid>
      </Show>

      <div style={{ height: "24px" }} />

      <Tabs value={tab()} onChange={setTab}>
        <TabList>
          <Tab value="overview">概要</Tab>
          <Tab value="orders">最近の注文</Tab>
          <Tab value="details">詳細</Tab>
        </TabList>

        <TabPanel value="overview">
          <div style={{ height: "16px" }} />
          <Grid minItemWidth="20rem" gap={4}>
            <Card>
              <CardHeader>
                <HStack gap={2} align="center">
                  <Text as="span" weight="semibold">
                    月間売上推移
                  </Text>
                  <Spacer />
                  <Popover
                    open={popoverOpen()}
                    onOpenChange={setPopoverOpen}
                    content={
                      <div style={{ padding: "12px", "max-width": "240px" }}>
                        <p style={{ margin: "0 0 8px", "font-weight": "600" }}>売上推移について</p>
                        <p style={{ margin: 0, "font-size": "13px", color: "var(--so-text-muted)" }}>
                          過去6ヶ月の月間売上を表示しています。前年同月比で15%増加傾向にあります。
                        </p>
                      </div>
                    }
                  >
                    <IconButton variant="neutral" size="sm" icon={<span>?</span>} aria-label="詳細情報" />
                  </Popover>
                </HStack>
              </CardHeader>
              <CardBody>
                <BarChart
                  data={[
                    { label: "1月", value: 65 },
                    { label: "2月", value: 72 },
                    { label: "3月", value: 58 },
                    { label: "4月", value: 85 },
                    { label: "5月", value: 92 },
                    { label: "6月", value: 78 },
                  ]}
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <Text as="span" weight="semibold">
                  カテゴリ別売上
                </Text>
              </CardHeader>
              <CardBody>
                <Stack gap={3}>
                  <ProgressRow label="エレクトロニクス" value={78} />
                  <ProgressRow label="アパレル" value={62} />
                  <ProgressRow label="食品" value={45} />
                  <ProgressRow label="書籍" value={31} />
                </Stack>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <Text as="span" weight="semibold">
                  最近のアクティビティ
                </Text>
              </CardHeader>
              <CardBody>
                <Timeline
                  items={[
                    {
                      title: "デプロイ完了",
                      description: "v2.14.0 を本番環境に反映",
                      timestamp: "14:22",
                      dateTime: "2026-05-30T14:22",
                      variant: "success",
                    },
                    {
                      title: "在庫アラート",
                      description: "ワイヤレスイヤホンの在庫が残り3点",
                      timestamp: "11:05",
                      dateTime: "2026-05-30T11:05",
                      variant: "warning",
                    },
                    {
                      title: "返金処理",
                      description: "ORD-004 をキャンセル",
                      timestamp: "09:48",
                      dateTime: "2026-05-30T09:48",
                      variant: "danger",
                    },
                    {
                      title: "日次バッチ実行",
                      timestamp: "03:00",
                      dateTime: "2026-05-30T03:00",
                    },
                  ]}
                />
              </CardBody>
            </Card>
          </Grid>
        </TabPanel>

        <TabPanel value="orders">
          <div style={{ height: "16px" }} />
          <Card>
            <CardHeader>
              <HStack gap={2} align="center">
                <Text as="span" weight="semibold">
                  最近の注文
                </Text>
                <Spacer />
                <SegmentedControl
                  size="sm"
                  label="期間"
                  value={range()}
                  onChange={setRange}
                  options={[
                    { value: "24h", label: "24時間" },
                    { value: "7d", label: "7日" },
                    { value: "30d", label: "30日" },
                  ]}
                />
                <Tag variant="primary" size="sm">
                  全 {ORDERS.length} 件
                </Tag>
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
        </TabPanel>

        <TabPanel value="details">
          <div style={{ height: "16px" }} />
          <Card>
            <CardHeader>
              <Text as="span" weight="semibold">
                システム情報
              </Text>
            </CardHeader>
            <CardBody>
              <DescriptionList
                columns={2}
                items={[
                  { term: "サーバー稼働時間", description: "14日 8時間 32分" },
                  {
                    term: "API応答時間",
                    description: (
                      <HStack gap={1}>
                        <span>42ms</span>{" "}
                        <Badge variant="success" size="sm">
                          正常
                        </Badge>
                      </HStack>
                    ),
                  },
                  {
                    term: "データベース",
                    description: (
                      <HStack gap={1}>
                        <span>PostgreSQL 16</span>{" "}
                        <Badge variant="info" size="sm">
                          v16.2
                        </Badge>
                      </HStack>
                    ),
                  },
                  { term: "最終デプロイ", description: "2026-05-30 14:22" },
                  { term: "ストレージ使用量", description: <Progress value={68} /> },
                  { term: "メモリ使用率", description: <Progress value={42} /> },
                ]}
              />
            </CardBody>
          </Card>
        </TabPanel>
      </Tabs>

      <div style={{ height: "24px" }} />

      <Divider />

      <div style={{ height: "16px" }} />

      <HStack gap={2} align="center">
        <Spinner size="sm" label="更新中" />
        <Text as="span" size="sm" tone="muted">
          30秒ごとに自動更新
        </Text>
      </HStack>
    </div>
  );
}

function BarChart(props: { data: Array<{ label: string; value: number }> }) {
  const max = () => Math.max(...props.data.map((d) => d.value));
  return (
    <div style={{ display: "flex", "align-items": "flex-end", gap: "12px", height: "160px" }}>
      <For each={props.data}>
        {(d) => (
          <div style={{ flex: "1", "text-align": "center" }}>
            <div
              style={{
                height: `${(d.value / max()) * 130}px`,
                background: "var(--so-color-primary-base)",
                "border-radius": "4px 4px 0 0",
                "min-height": "4px",
                transition: "height 0.3s",
              }}
            />
            <div style={{ "font-size": "11px", color: "var(--so-text-muted)", "margin-top": "4px" }}>{d.label}</div>
          </div>
        )}
      </For>
    </div>
  );
}

function ProgressRow(props: { label: string; value: number }): JSX.Element {
  return (
    <div>
      <HStack gap={2} style={{ "margin-bottom": "4px" }}>
        <span style={{ "font-size": "13px" }}>{props.label}</span>
        <Spacer />
        <span style={{ "font-size": "13px", "font-weight": "600" }}>{props.value}%</span>
      </HStack>
      <Progress value={props.value} />
    </div>
  );
}
