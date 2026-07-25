import { createSignal, For, Show } from "solid-js";
import type { JSX } from "solid-js";
import { Avatar } from "../../components/ui/soluid/Avatar";
import { Badge } from "../../components/ui/soluid/Badge";
import { Breadcrumb, BreadcrumbItem } from "../../components/ui/soluid/Breadcrumb";
import { Button } from "../../components/ui/soluid/Button";
import { Card, CardBody, CardHeader } from "../../components/ui/soluid/Card";
import { DescriptionList } from "../../components/ui/soluid/DescriptionList";
import { Divider } from "../../components/ui/soluid/Divider";
import { HStack } from "../../components/ui/soluid/HStack";
import { IconButton } from "../../components/ui/soluid/IconButton";
import { Menu, MenuItem, MenuSeparator } from "../../components/ui/soluid/Menu";
import { Popover } from "../../components/ui/soluid/Popover";
import { Progress } from "../../components/ui/soluid/Progress";
import { Skeleton } from "../../components/ui/soluid/Skeleton";
import { Spacer } from "../../components/ui/soluid/Spacer";
import { Spinner } from "../../components/ui/soluid/Spinner";
import { Stack } from "../../components/ui/soluid/Stack";
import { Tab, TabList, TabPanel, Tabs } from "../../components/ui/soluid/Tabs";
import { Tag } from "../../components/ui/soluid/Tag";
import type { Column } from "../../components/ui/soluid/Table";
import { Table } from "../../components/ui/soluid/Table";
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

function StatCard(props: { label: string; value: string; change: string; positive: boolean }) {
  return (
    <Card>
      <CardBody>
        <div class="stat-label">{props.label}</div>
        <div class="stat-value">{props.value}</div>
        <HStack gap={1} style={{ "margin-top": "8px" }}>
          <Badge variant={props.positive ? "success" : "danger"} size="sm">
            {props.positive ? "↑" : "↓"} {props.change}
          </Badge>
          <span style={{ "font-size": "12px", color: "var(--so-text-muted)" }}>前月比</span>
        </HStack>
      </CardBody>
    </Card>
  );
}

function SkeletonCards() {
  return (
    <div class="sample-grid sample-grid--4">
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
    </div>
  );
}

export function DashboardApp() {
  const [loading, setLoading] = createSignal(true);
  const [tab, setTab] = createSignal("overview");
  const [menuOpen, setMenuOpen] = createSignal(false);
  const [popoverOpen, setPopoverOpen] = createSignal(false);
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
        <div class="sample-grid sample-grid--4">
          <StatCard label="売上" value="¥1,284,000" change="12.5%" positive />
          <StatCard label="注文数" value="324" change="8.2%" positive />
          <StatCard label="顧客数" value="1,892" change="3.1%" positive />
          <StatCard label="返品率" value="2.4%" change="0.8%" positive={false} />
        </div>
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
          <div class="sample-grid sample-grid--2">
            <Card>
              <CardHeader>
                <HStack gap={2}>
                  <span style={{ "font-weight": "600" }}>月間売上推移</span>
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
                <span style={{ "font-weight": "600" }}>カテゴリ別売上</span>
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
          </div>
        </TabPanel>

        <TabPanel value="orders">
          <div style={{ height: "16px" }} />
          <Card>
            <CardHeader>
              <HStack gap={2}>
                <span style={{ "font-weight": "600" }}>最近の注文</span>
                <Spacer />
                <Tag variant="primary" size="sm">
                  全 {ORDERS.length} 件
                </Tag>
              </HStack>
            </CardHeader>
            <CardBody>
              <Table columns={columns} data={ORDERS} rowKey={(row) => row.id} />
            </CardBody>
          </Card>
        </TabPanel>

        <TabPanel value="details">
          <div style={{ height: "16px" }} />
          <Card>
            <CardHeader>
              <span style={{ "font-weight": "600" }}>システム情報</span>
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

      <HStack gap={2}>
        <Spinner size="sm" />
        <span style={{ "font-size": "12px", color: "var(--so-text-muted)" }}>30秒ごとに自動更新</span>
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
