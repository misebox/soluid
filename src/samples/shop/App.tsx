import { createMemo, createSignal, For, Show } from "solid-js";
import { Alert } from "../../components/ui/soluid/Alert";
import { Badge } from "../../components/ui/soluid/Badge";
import { Breadcrumb, BreadcrumbItem } from "../../components/ui/soluid/Breadcrumb";
import { Button } from "../../components/ui/soluid/Button";
import { Card, CardBody, CardFooter, CardHeader } from "../../components/ui/soluid/Card";
import { Checkbox } from "../../components/ui/soluid/Checkbox";
import { Dialog, DialogBody, DialogFooter, DialogHeader } from "../../components/ui/soluid/Dialog";
import { Divider } from "../../components/ui/soluid/Divider";
import { Drawer, DrawerHeader } from "../../components/ui/soluid/Drawer";
import { EmptyState } from "../../components/ui/soluid/EmptyState";
import { HStack } from "../../components/ui/soluid/HStack";
import { IconButton } from "../../components/ui/soluid/IconButton";
import { NumberInput } from "../../components/ui/soluid/NumberInput";
import { Pagination } from "../../components/ui/soluid/Pagination";
import { Popover } from "../../components/ui/soluid/Popover";
import { Progress } from "../../components/ui/soluid/Progress";
import { RadioButton } from "../../components/ui/soluid/RadioButton";
import { RadioGroup } from "../../components/ui/soluid/RadioGroup";
import { Select } from "../../components/ui/soluid/Select";
import { Spacer } from "../../components/ui/soluid/Spacer";
import { Stack } from "../../components/ui/soluid/Stack";
import { Tag } from "../../components/ui/soluid/Tag";
import { ToastContainer, useToast } from "../../components/ui/soluid/Toast";
import { Tooltip } from "../../components/ui/soluid/Tooltip";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  badge?: string;
  rating: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "ワイヤレスイヤホン Pro",
    price: 12800,
    category: "electronics",
    stock: 24,
    badge: "NEW",
    rating: 4.5,
  },
  { id: "2", name: "オーガニックコットンTシャツ", price: 4200, category: "apparel", stock: 58, rating: 4.2 },
  {
    id: "3",
    name: "スマートウォッチ SE",
    price: 29800,
    category: "electronics",
    stock: 12,
    badge: "SALE",
    rating: 4.7,
  },
  { id: "4", name: "レザートートバッグ", price: 18500, category: "apparel", stock: 8, rating: 4.0 },
  { id: "5", name: "ポータブルスピーカー", price: 7980, category: "electronics", stock: 0, rating: 3.9 },
  { id: "6", name: "デニムジャケット", price: 9800, category: "apparel", stock: 33, rating: 4.3 },
  { id: "7", name: "USB-Cハブ 7in1", price: 5480, category: "electronics", stock: 45, rating: 4.1 },
  { id: "8", name: "ウール混マフラー", price: 3200, category: "apparel", stock: 21, badge: "SALE", rating: 4.4 },
  { id: "9", name: "メカニカルキーボード", price: 15800, category: "electronics", stock: 6, badge: "NEW", rating: 4.8 },
];

const PER_PAGE = 6;

function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}`;
}

export function ShopApp() {
  const [category, setCategory] = createSignal("all");
  const [sort, setSort] = createSignal("name");
  const [page, setPage] = createSignal(1);
  const [cart, setCart] = createSignal<CartItem[]>([]);
  const [cartOpen, setCartOpen] = createSignal(false);
  const [checkoutOpen, setCheckoutOpen] = createSignal(false);
  const [checkoutStep, setCheckoutStep] = createSignal(0);
  const [agreeTerms, setAgreeTerms] = createSignal(false);
  const [paymentMethod, setPaymentMethod] = createSignal("credit");
  const [quickViewProduct, setQuickViewProduct] = createSignal<Product | null>(null);
  const [quickViewOpen, setQuickViewOpen] = createSignal(false);
  const toast = useToast();

  const filtered = createMemo(() => {
    let items = [...PRODUCTS];
    if (category() !== "all") items = items.filter((p) => p.category === category());
    if (sort() === "price-asc") items.sort((a, b) => a.price - b.price);
    else if (sort() === "price-desc") items.sort((a, b) => b.price - a.price);
    else items.sort((a, b) => a.name.localeCompare(b.name));
    return items;
  });

  const totalPages = createMemo(() => Math.ceil(filtered().length / PER_PAGE));
  const paged = createMemo(() => {
    const start = (page() - 1) * PER_PAGE;
    return filtered().slice(start, start + PER_PAGE);
  });

  const cartTotal = createMemo(() => cart().reduce((sum, item) => sum + item.product.price * item.quantity, 0));
  const cartCount = createMemo(() => cart().reduce((sum, item) => sum + item.quantity, 0));

  function addToCart(product: Product) {
    if (product.stock === 0) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { product, quantity: 1 }];
    });
    toast.add({ message: `${product.name} をカートに追加しました`, variant: "success" });
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
    } else {
      setCart((prev) => prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item)));
    }
  }

  function handleCheckout() {
    setCheckoutStep(1);
    setTimeout(() => setCheckoutStep(2), 1000);
    setTimeout(() => {
      setCheckoutStep(3);
      setTimeout(() => {
        setCheckoutOpen(false);
        setCart([]);
        setCheckoutStep(0);
        setAgreeTerms(false);
        toast.add({ message: "ご注文ありがとうございます。確認メールを送信しました。", variant: "success" });
      }, 1500);
    }, 2500);
  }

  return (
    <div class="sample-page">
      <ToastContainer position="top-right" />

      <Breadcrumb>
        <BreadcrumbItem href="#">ホーム</BreadcrumbItem>
        <BreadcrumbItem current>ショップ</BreadcrumbItem>
      </Breadcrumb>

      <div style={{ height: "16px" }} />

      <div class="sample-header">
        <h1>ショップ</h1>
        <Tooltip content="カートを開く">
          <Button variant="neutral" onClick={() => setCartOpen(true)}>
            カート
            <Show when={cartCount() > 0}>
              {" "}
              <Badge variant="danger" fill="solid" size="sm">
                {cartCount()}
              </Badge>
            </Show>
          </Button>
        </Tooltip>
      </div>

      <HStack gap={3} style={{ "margin-bottom": "16px" }}>
        <Select
          value={category()}
          onChange={(v) => {
            setCategory(v);
            setPage(1);
          }}
          options={[
            { value: "all", label: "すべてのカテゴリ" },
            { value: "electronics", label: "エレクトロニクス" },
            { value: "apparel", label: "アパレル" },
          ]}
        />
        <Select
          value={sort()}
          onChange={setSort}
          options={[
            { value: "name", label: "名前順" },
            { value: "price-asc", label: "価格: 安い順" },
            { value: "price-desc", label: "価格: 高い順" },
          ]}
        />
        <Spacer />
        <Tag variant="neutral">{filtered().length} 件</Tag>
      </HStack>

      <div class="sample-grid sample-grid--3">
        <For each={paged()}>
          {(product) => (
            <Card>
              <CardHeader>
                <HStack gap={2}>
                  <span style={{ "font-weight": "600", flex: "1" }}>{product.name}</span>
                  <Show when={product.badge}>
                    <Badge variant={product.badge === "SALE" ? "danger" : "primary"} fill="solid" size="sm">
                      {product.badge}
                    </Badge>
                  </Show>
                </HStack>
              </CardHeader>
              <CardBody>
                <div
                  style={{
                    height: "120px",
                    background: "var(--so-bg-subtle)",
                    "border-radius": "var(--so-radius)",
                    display: "flex",
                    "align-items": "center",
                    "justify-content": "center",
                    "font-size": "32px",
                    "margin-bottom": "12px",
                  }}
                >
                  {product.category === "electronics" ? "🔌" : "👕"}
                </div>
                <HStack gap={2}>
                  <span style={{ "font-size": "20px", "font-weight": "700" }}>{formatPrice(product.price)}</span>
                  <Spacer />
                  <Tag variant={product.category === "electronics" ? "info" : "success"} size="sm">
                    {product.category === "electronics" ? "エレクトロニクス" : "アパレル"}
                  </Tag>
                </HStack>
                <div style={{ height: "8px" }} />
                <HStack gap={2}>
                  <span style={{ "font-size": "12px", color: "var(--so-text-muted)" }}>★ {product.rating}</span>
                  <Spacer />
                  <Show
                    when={product.stock > 0}
                    fallback={
                      <Badge variant="danger" size="sm">
                        在庫切れ
                      </Badge>
                    }
                  >
                    <span style={{ "font-size": "12px", color: "var(--so-text-muted)" }}>残り {product.stock} 点</span>
                  </Show>
                </HStack>
              </CardBody>
              <CardFooter>
                <HStack gap={2}>
                  <Popover
                    open={quickViewOpen() && quickViewProduct()?.id === product.id}
                    onOpenChange={(open) => {
                      setQuickViewOpen(open);
                      if (open) setQuickViewProduct(product);
                    }}
                    content={
                      <div style={{ padding: "12px", "max-width": "280px" }}>
                        <p style={{ margin: "0 0 8px", "font-weight": "600" }}>{product.name}</p>
                        <p style={{ margin: "0 0 4px", "font-size": "13px", color: "var(--so-text-muted)" }}>
                          カテゴリ: {product.category === "electronics" ? "エレクトロニクス" : "アパレル"}
                        </p>
                        <p style={{ margin: "0 0 4px", "font-size": "13px", color: "var(--so-text-muted)" }}>
                          評価: ★ {product.rating} / 5.0
                        </p>
                        <p style={{ margin: "0", "font-size": "13px", color: "var(--so-text-muted)" }}>
                          在庫: {product.stock} 点
                        </p>
                      </div>
                    }
                  >
                    <IconButton variant="neutral" size="sm" icon={<span>🔍</span>} aria-label="詳細" />
                  </Popover>
                  <Spacer />
                  <Button variant="primary" size="sm" disabled={product.stock === 0} onClick={() => addToCart(product)}>
                    カートに追加
                  </Button>
                </HStack>
              </CardFooter>
            </Card>
          )}
        </For>
      </div>

      <div style={{ height: "24px" }} />

      <Show when={totalPages() > 1}>
        <div style={{ display: "flex", "justify-content": "center" }}>
          <Pagination page={page()} totalPages={totalPages()} onChange={setPage} showPages />
        </div>
      </Show>

      <Drawer open={cartOpen()} onClose={() => setCartOpen(false)} side="right" size="lg">
        <DrawerHeader>ショッピングカート</DrawerHeader>
        <div style={{ padding: "16px" }}>
          <Show
            when={cart().length > 0}
            fallback={
              <EmptyState
                title="カートは空です"
                description="商品を追加してください"
                action={
                  <Button variant="primary" size="sm" onClick={() => setCartOpen(false)}>
                    買い物を続ける
                  </Button>
                }
              />
            }
          >
            <Stack gap={3}>
              <For each={cart()}>
                {(item) => (
                  <Card>
                    <CardBody>
                      <HStack gap={3}>
                        <div style={{ flex: "1" }}>
                          <div style={{ "font-weight": "600" }}>{item.product.name}</div>
                          <div style={{ "font-size": "13px", color: "var(--so-text-muted)" }}>
                            {formatPrice(item.product.price)} × {item.quantity}
                          </div>
                        </div>
                        <NumberInput
                          label="数量"
                          value={item.quantity}
                          onInput={(v: number) => updateQuantity(item.product.id, v)}
                          min={0}
                          max={item.product.stock}
                          step={1}
                          size="sm"
                        />
                        <span style={{ "font-weight": "600", "min-width": "80px", "text-align": "right" }}>
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </HStack>
                    </CardBody>
                  </Card>
                )}
              </For>
            </Stack>

            <div style={{ height: "16px" }} />
            <Divider />
            <div style={{ height: "16px" }} />

            <HStack gap={2}>
              <span style={{ "font-size": "18px", "font-weight": "700" }}>合計</span>
              <Spacer />
              <span style={{ "font-size": "24px", "font-weight": "700" }}>{formatPrice(cartTotal())}</span>
            </HStack>

            <div style={{ height: "16px" }} />

            <Show when={cart().some((item) => item.product.stock < 5 && item.product.stock > 0)}>
              <Alert variant="warning">
                <strong>在庫わずか:</strong> 一部の商品の在庫が少なくなっています。お早めにご注文ください。
              </Alert>
              <div style={{ height: "16px" }} />
            </Show>

            <Stack gap={3}>
              <RadioGroup label="お支払い方法" value={paymentMethod()} onChange={setPaymentMethod}>
                <RadioButton value="credit" label="クレジットカード" />
                <RadioButton value="bank" label="銀行振込" />
                <RadioButton value="convenience" label="コンビニ払い" />
              </RadioGroup>

              <Checkbox label="利用規約に同意する" checked={agreeTerms()} onChange={setAgreeTerms} />

              <Button
                variant="primary"
                disabled={!agreeTerms()}
                onClick={() => {
                  setCartOpen(false);
                  setCheckoutOpen(true);
                }}
              >
                注文を確定する
              </Button>
            </Stack>
          </Show>
        </div>
      </Drawer>

      <Dialog open={checkoutOpen()} onClose={() => {}} size="sm">
        <DialogHeader>注文処理</DialogHeader>
        <DialogBody>
          <Stack gap={3}>
            <Show
              when={checkoutStep() < 3}
              fallback={
                <Alert variant="success">
                  <strong>注文完了:</strong> ご注文ありがとうございます。確認メールをお送りしました。
                </Alert>
              }
            >
              <div style={{ "text-align": "center", "font-size": "14px", color: "var(--so-text-muted)" }}>
                <Show when={checkoutStep() === 0}>注文を処理しています…</Show>
                <Show when={checkoutStep() === 1}>在庫を確認中…</Show>
                <Show when={checkoutStep() === 2}>決済処理中…</Show>
              </div>
              <Progress value={Math.round((checkoutStep() / 3) * 100)} />
            </Show>
          </Stack>
        </DialogBody>
        <DialogFooter>
          <Show
            when={checkoutStep() < 3}
            fallback={
              <Button
                variant="primary"
                onClick={() => {
                  setCheckoutOpen(false);
                  setCheckoutStep(0);
                }}
              >
                閉じる
              </Button>
            }
          >
            <Button variant="primary" disabled={checkoutStep() > 0} onClick={handleCheckout}>
              {checkoutStep() === 0 ? "注文する" : "処理中…"}
            </Button>
          </Show>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
