import { createMemo, createSignal, For, Show } from "solid-js";
import { Avatar } from "../../components/ui/soluid/Avatar";
import { Badge } from "../../components/ui/soluid/Badge";
import { Breadcrumb, BreadcrumbItem } from "../../components/ui/soluid/Breadcrumb";
import { Button } from "../../components/ui/soluid/Button";
import { Card, CardBody, CardHeader } from "../../components/ui/soluid/Card";
import { Checkbox } from "../../components/ui/soluid/Checkbox";
import { ContextMenu } from "../../components/ui/soluid/ContextMenu";
import { Dialog, DialogBody, DialogFooter, DialogHeader } from "../../components/ui/soluid/Dialog";
import { Divider } from "../../components/ui/soluid/Divider";
import { Drawer, DrawerHeader } from "../../components/ui/soluid/Drawer";
import { EmptyState } from "../../components/ui/soluid/EmptyState";
import { HStack } from "../../components/ui/soluid/HStack";
import { IconButton } from "../../components/ui/soluid/IconButton";
import { Menu, MenuItem, MenuSeparator } from "../../components/ui/soluid/Menu";
import { Pagination } from "../../components/ui/soluid/Pagination";
import { SearchField } from "../../components/ui/soluid/SearchField";
import { Spacer } from "../../components/ui/soluid/Spacer";
import { Spinner } from "../../components/ui/soluid/Spinner";
import { Stack } from "../../components/ui/soluid/Stack";
import { Tag } from "../../components/ui/soluid/Tag";
import { TextArea } from "../../components/ui/soluid/TextArea";
import { TextField } from "../../components/ui/soluid/TextField";
import { ToastContainer, useToast } from "../../components/ui/soluid/Toast";
import { Tooltip } from "../../components/ui/soluid/Tooltip";
import type { TreeNode } from "../../components/ui/soluid/Tree";
import { Tree } from "../../components/ui/soluid/Tree";

const FOLDERS: TreeNode[] = [
  {
    id: "inbox",
    label: "受信トレイ",
    children: [
      { id: "inbox-work", label: "仕事" },
      { id: "inbox-personal", label: "プライベート" },
    ],
  },
  { id: "starred", label: "スター付き" },
  { id: "sent", label: "送信済み" },
  {
    id: "archive",
    label: "アーカイブ",
    children: [{ id: "archive-2025", label: "2025年" }],
  },
  { id: "trash", label: "ゴミ箱", disabled: true },
];

interface Mail {
  id: string;
  from: string;
  subject: string;
  preview: string;
  body: string;
  date: string;
  read: boolean;
  folder: string;
  tags: string[];
}

const MAILS: Mail[] = [
  {
    id: "1",
    folder: "inbox-work",
    from: "佐藤花子",
    subject: "プロジェクト進捗報告",
    preview: "今週のスプリントレビューについてご確認ください…",
    body: "今週のスプリントレビューについてご確認ください。\n\n主な進捗:\n- ユーザー認証機能の実装完了\n- APIドキュメントの更新\n- パフォーマンステストの実施\n\n次週の予定についてミーティングで議論したいと思います。",
    date: "14:30",
    read: false,
    tags: ["仕事"],
  },
  {
    id: "2",
    folder: "inbox-work",
    from: "田中一郎",
    subject: "デザインレビューのお願い",
    preview: "新しいUIコンポーネントのデザインについて…",
    body: "新しいUIコンポーネントのデザインについてレビューをお願いします。\n\nFigmaリンクを共有しましたので、フィードバックをいただけると助かります。\n特にカラーパレットとタイポグラフィについてご意見をお聞かせください。",
    date: "12:15",
    read: false,
    tags: ["仕事", "デザイン"],
  },
  {
    id: "3",
    folder: "inbox-personal",
    from: "鈴木美咲",
    subject: "ランチのお誘い",
    preview: "来週の水曜日、ランチに行きませんか？…",
    body: "来週の水曜日、ランチに行きませんか？\n\n新しくオープンしたイタリアンレストランが評判いいみたいです。12時頃はいかがでしょうか？",
    date: "昨日",
    read: true,
    tags: ["プライベート"],
  },
  {
    id: "4",
    folder: "inbox-work",
    from: "システム通知",
    subject: "セキュリティアラート",
    preview: "新しいデバイスからのログインが検出されました…",
    body: "新しいデバイスからのログインが検出されました。\n\nデバイス: MacBook Pro\n場所: 東京, 日本\n時刻: 2026-05-30 09:15\n\n心当たりがない場合は、直ちにパスワードを変更してください。",
    date: "昨日",
    read: true,
    tags: ["システム"],
  },
  {
    id: "5",
    folder: "archive-2025",
    from: "高橋健太",
    subject: "コードレビューコメント",
    preview: "PR #142 にコメントを追加しました…",
    body: "PR #142 にコメントを追加しました。\n\n主なポイント:\n1. エラーハンドリングの改善提案\n2. テストケースの追加リクエスト\n3. 変数名の修正案\n\nご確認よろしくお願いします。",
    date: "5/28",
    read: true,
    tags: ["仕事"],
  },
  {
    id: "6",
    folder: "inbox-personal",
    from: "伊藤陽子",
    subject: "週報テンプレート更新",
    preview: "週報のテンプレートを更新しましたのでご確認…",
    body: "週報のテンプレートを更新しましたのでご確認ください。\n\n変更点:\n- KPIセクションの追加\n- リスク管理項目の追加\n- フォーマットの統一\n\n来週から新テンプレートを使用します。",
    date: "5/27",
    read: true,
    tags: ["仕事"],
  },
];

const TAG_VARIANT = {
  仕事: "primary",
  デザイン: "info",
  プライベート: "success",
  システム: "warning",
} as const;

const PER_PAGE = 4;

export function MailApp() {
  const [mails, setMails] = createSignal(MAILS);
  const [selectedId, setSelectedId] = createSignal<string | null>(null);
  const [composeOpen, setComposeOpen] = createSignal(false);
  const [deleteConfirm, setDeleteConfirm] = createSignal<string | null>(null);
  const [sending, setSending] = createSignal(false);
  const [page, setPage] = createSignal(1);
  const [selected, setSelected] = createSignal<Set<string>>(new Set());
  const [menuOpen, setMenuOpen] = createSignal(false);
  const [composeTo, setComposeTo] = createSignal("");
  const [composeSubject, setComposeSubject] = createSignal("");
  const [composeBody, setComposeBody] = createSignal("");
  const [query, setQuery] = createSignal("");
  const [folder, setFolder] = createSignal("inbox");
  const [expandedFolders, setExpandedFolders] = createSignal(["inbox"]);
  const toast = useToast();

  const unreadCount = createMemo(() => mails().filter((m) => !m.read).length);
  const visibleMails = createMemo(() => {
    const q = query().trim().toLowerCase();
    const current = folder();
    return mails().filter((m) => {
      // Selecting a parent folder includes everything beneath it.
      const inFolder = m.folder === current || m.folder.startsWith(`${current}-`);
      if (!inFolder) return false;
      if (q === "") return true;
      return [m.from, m.subject, m.preview].some((field) => field.toLowerCase().includes(q));
    });
  });
  const totalPages = createMemo(() => Math.ceil(visibleMails().length / PER_PAGE));
  const pagedMails = createMemo(() => {
    const start = (page() - 1) * PER_PAGE;
    return visibleMails().slice(start, start + PER_PAGE);
  });
  const selectedMail = createMemo(() => mails().find((m) => m.id === selectedId()));

  function markAsRead(id: string) {
    setMails((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
  }

  function deleteMail(id: string) {
    setMails((prev) => prev.filter((m) => m.id !== id));
    if (selectedId() === id) setSelectedId(null);
    setDeleteConfirm(null);
    toast.add({ message: "メールを削除しました", variant: "success" });
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSend() {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setComposeOpen(false);
      setComposeTo("");
      setComposeSubject("");
      setComposeBody("");
      toast.add({ message: "メールを送信しました", variant: "success" });
    }, 1500);
  }

  return (
    <div class="sample-page">
      <ToastContainer position="top-right" />

      <Breadcrumb>
        <BreadcrumbItem href="#">ホーム</BreadcrumbItem>
        <BreadcrumbItem current>メール</BreadcrumbItem>
      </Breadcrumb>

      <div style={{ height: "16px" }} />

      <div class="sample-header">
        <HStack gap={2}>
          <h1>メール</h1>
          <Show when={unreadCount() > 0}>
            <Badge variant="danger" fill="solid">
              {unreadCount()}
            </Badge>
          </Show>
        </HStack>
        <HStack gap={2}>
          <Menu
            open={menuOpen()}
            onOpenChange={setMenuOpen}
            trigger={
              <Button variant="neutral" size="sm">
                操作 ▾
              </Button>
            }
          >
            <MenuItem
              onSelect={() => {
                setMails((prev) => prev.map((m) => ({ ...m, read: true })));
                toast.add({ message: "すべて既読にしました", variant: "info" });
              }}
            >
              すべて既読にする
            </MenuItem>
            <MenuItem
              disabled={selected().size === 0}
              onSelect={() => {
                setMails((prev) => prev.filter((m) => !selected().has(m.id)));
                setSelected(new Set<string>());
                toast.add({ message: `${selected().size}件を削除しました`, variant: "success" });
              }}
            >
              選択を削除
            </MenuItem>
            <MenuSeparator />
            <MenuItem onSelect={() => toast.add({ message: "アーカイブしました", variant: "info" })}>
              アーカイブ
            </MenuItem>
          </Menu>
          <Button variant="primary" onClick={() => setComposeOpen(true)}>
            新規作成
          </Button>
        </HStack>
      </div>

      <div class="sample-grid sample-grid--sidebar">
        <Stack gap={3}>
          <SearchField
            value={query()}
            // Narrowing the list can drop the current page out of range.
            onInput={(value) => {
              setQuery(value);
              setPage(1);
            }}
            placeholder="メールを検索"
            clearLabel="検索条件をクリア"
          />

          <Card>
            <CardBody>
              <Tree
                label="フォルダ"
                nodes={FOLDERS}
                expanded={expandedFolders()}
                onExpandedChange={setExpandedFolders}
                selected={folder()}
                onSelect={(id) => {
                  setFolder(id);
                  setPage(1);
                }}
              />
            </CardBody>
          </Card>

          <Show
            when={visibleMails().length > 0}
            fallback={
              <EmptyState
                title="メールはありません"
                description={query() ? "検索条件に一致するメールが見つかりませんでした" : "このフォルダは空です"}
                action={
                  <Button variant="primary" size="sm" onClick={() => setComposeOpen(true)}>
                    新規作成
                  </Button>
                }
              />
            }
          >
            <For each={pagedMails()}>
              {(mail) => (
                <>
                  <ContextMenu
                    label={`${mail.subject} の操作`}
                    content={
                      <>
                        <MenuItem onSelect={() => markAsRead(mail.id)}>既読にする</MenuItem>
                        <MenuItem onSelect={() => toast.add({ message: "アーカイブしました", variant: "info" })}>
                          アーカイブ
                        </MenuItem>
                        <MenuSeparator />
                        <MenuItem
                          onSelect={() => {
                            setMails((prev) => prev.filter((m) => m.id !== mail.id));
                            toast.add({ message: "削除しました", variant: "success" });
                          }}
                        >
                          削除
                        </MenuItem>
                      </>
                    }
                  >
                    <div
                      style={{
                        padding: "12px",
                        cursor: "pointer",
                        background: selectedId() === mail.id ? "var(--so-color-primary-subtle)" : "transparent",
                        "border-left": mail.read ? "3px solid transparent" : "3px solid var(--so-color-primary-base)",
                      }}
                      onClick={() => {
                        setSelectedId(mail.id);
                        markAsRead(mail.id);
                      }}
                    >
                      <HStack gap={2}>
                        <Checkbox checked={selected().has(mail.id)} onChange={() => toggleSelect(mail.id)} />
                        <Avatar name={mail.from} size="sm" />
                        <div style={{ flex: "1", "min-width": "0" }}>
                          <HStack gap={2}>
                            <span style={{ "font-weight": mail.read ? "400" : "600", "font-size": "14px" }}>
                              {mail.from}
                            </span>
                            <Spacer />
                            <span
                              style={{ "font-size": "11px", color: "var(--so-text-muted)", "white-space": "nowrap" }}
                            >
                              {mail.date}
                            </span>
                          </HStack>
                          <div style={{ "font-size": "13px", "font-weight": mail.read ? "400" : "600" }}>
                            {mail.subject}
                          </div>
                          <div
                            style={{
                              "font-size": "12px",
                              color: "var(--so-text-muted)",
                              overflow: "hidden",
                              "text-overflow": "ellipsis",
                              "white-space": "nowrap",
                            }}
                          >
                            {mail.preview}
                          </div>
                        </div>
                      </HStack>
                    </div>
                  </ContextMenu>
                  <Divider />
                </>
              )}
            </For>
            <div style={{ height: "16px" }} />
            <Show when={totalPages() > 1}>
              <div style={{ display: "flex", "justify-content": "center" }}>
                <Pagination page={page()} totalPages={totalPages()} onChange={setPage} showPages />
              </div>
            </Show>
          </Show>
        </Stack>

        <Show
          when={selectedMail()}
          fallback={
            <Card>
              <CardBody>
                <EmptyState
                  title="メールを選択してください"
                  description="左のリストからメールを選択すると、ここに内容が表示されます"
                />
              </CardBody>
            </Card>
          }
        >
          {(mail) => (
            <Card>
              <CardHeader>
                <HStack gap={2}>
                  <Avatar name={mail().from} />
                  <div>
                    <div style={{ "font-weight": "600" }}>{mail().subject}</div>
                    <div style={{ "font-size": "13px", color: "var(--so-text-muted)" }}>
                      {mail().from} · {mail().date}
                    </div>
                  </div>
                  <Spacer />
                  <HStack gap={1}>
                    <For each={mail().tags}>
                      {(tag) => (
                        <Tag variant={TAG_VARIANT[tag as keyof typeof TAG_VARIANT] ?? "neutral"} size="sm">
                          {tag}
                        </Tag>
                      )}
                    </For>
                  </HStack>
                  <Tooltip content="削除">
                    <IconButton
                      variant="danger"
                      size="sm"
                      icon={<span>✕</span>}
                      aria-label="削除"
                      onClick={() => setDeleteConfirm(mail().id)}
                    />
                  </Tooltip>
                </HStack>
              </CardHeader>
              <CardBody>
                <div style={{ "white-space": "pre-wrap", "line-height": "1.8", "font-size": "14px" }}>
                  {mail().body}
                </div>
              </CardBody>
            </Card>
          )}
        </Show>
      </div>

      <Drawer open={composeOpen()} onClose={() => setComposeOpen(false)} side="right" size="md">
        <DrawerHeader>新規メール作成</DrawerHeader>
        <div style={{ padding: "16px" }}>
          <Stack gap={3}>
            <TextField placeholder="宛先" value={composeTo()} onInput={setComposeTo} />
            <TextField placeholder="件名" value={composeSubject()} onInput={setComposeSubject} />
            <TextArea placeholder="本文を入力..." value={composeBody()} onInput={setComposeBody} rows={12} />
            <HStack gap={2}>
              <Spacer />
              <Button variant="neutral" onClick={() => setComposeOpen(false)}>
                キャンセル
              </Button>
              <Button variant="primary" onClick={handleSend} loading={sending()}>
                {sending() ? "送信中…" : "送信"}
              </Button>
            </HStack>
          </Stack>
        </div>
      </Drawer>

      <Dialog open={deleteConfirm() !== null} onClose={() => setDeleteConfirm(null)} size="sm">
        <DialogHeader>メールの削除</DialogHeader>
        <DialogBody>このメールを削除しますか？この操作は取り消せません。</DialogBody>
        <DialogFooter>
          <HStack gap={2}>
            <Spacer />
            <Button variant="neutral" onClick={() => setDeleteConfirm(null)}>
              キャンセル
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                const id = deleteConfirm();
                if (id) deleteMail(id);
              }}
            >
              削除
            </Button>
          </HStack>
        </DialogFooter>
      </Dialog>

      <Show when={sending()}>
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            display: "flex",
            "align-items": "center",
            gap: "8px",
            padding: "12px 16px",
            background: "var(--so-bg-subtle)",
            "border-radius": "8px",
            "box-shadow": "var(--so-shadow-md)",
          }}
        >
          <Spinner size="sm" />
          <span style={{ "font-size": "13px" }}>送信しています…</span>
        </div>
      </Show>
    </div>
  );
}
