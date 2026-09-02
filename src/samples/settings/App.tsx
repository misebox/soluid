import { createSignal, For, Show } from "solid-js";
import { Accordion, AccordionItem } from "../../components/ui/soluid/Accordion";
import { Alert } from "../../components/ui/soluid/Alert";
import { Badge } from "../../components/ui/soluid/Badge";
import { Breadcrumb, BreadcrumbItem } from "../../components/ui/soluid/Breadcrumb";
import { Button } from "../../components/ui/soluid/Button";
import { Card, CardBody, CardFooter, CardHeader } from "../../components/ui/soluid/Card";
import { Checkbox } from "../../components/ui/soluid/Checkbox";
import { CheckboxGroup } from "../../components/ui/soluid/CheckboxGroup";
import { Dialog, DialogBody, DialogFooter, DialogHeader } from "../../components/ui/soluid/Dialog";
import { Divider } from "../../components/ui/soluid/Divider";
import { FileUpload } from "../../components/ui/soluid/FileUpload";
import { FormField } from "../../components/ui/soluid/FormField";
import { Grid } from "../../components/ui/soluid/Grid";
import { HStack } from "../../components/ui/soluid/HStack";
import { PinInput } from "../../components/ui/soluid/PinInput";
import { SegmentedControl } from "../../components/ui/soluid/SegmentedControl";
import { Select } from "../../components/ui/soluid/Select";
import { Slider } from "../../components/ui/soluid/Slider";
import { Spacer } from "../../components/ui/soluid/Spacer";
import { Stack } from "../../components/ui/soluid/Stack";
import { Switch } from "../../components/ui/soluid/Switch";
import { Tab, TabList, TabPanel, Tabs } from "../../components/ui/soluid/Tabs";
import { TextArea } from "../../components/ui/soluid/TextArea";
import { TextField } from "../../components/ui/soluid/TextField";
import { ToastContainer, useToast } from "../../components/ui/soluid/Toast";
import { VisuallyHidden } from "../../components/ui/soluid/VisuallyHidden";

const APPEARANCE_OPTIONS = [
  { value: "animations", label: "アニメーションを有効化" },
  { value: "sidebar", label: "サイドバーを常に表示" },
  { value: "compact", label: "コンパクトモード" },
];

const ACCESSIBILITY_OPTIONS = [
  { value: "high-contrast", label: "ハイコントラストモード" },
  { value: "reduced-motion", label: "モーション軽減" },
];

export function SettingsApp() {
  const [tab, setTab] = createSignal("profile");
  const [confirmOpen, setConfirmOpen] = createSignal(false);
  const toast = useToast();

  const [name, setName] = createSignal("山田太郎");
  const [email, setEmail] = createSignal("yamada@example.com");
  const [bio, setBio] = createSignal("ソフトウェアエンジニア。東京在住。");
  const [language, setLanguage] = createSignal("ja");
  const [timezone, setTimezone] = createSignal("asia-tokyo");
  const [theme, setTheme] = createSignal("system");
  const [fontSize, setFontSize] = createSignal(14);
  const [lineHeight, setLineHeight] = createSignal(150);
  const [appearance, setAppearance] = createSignal(["animations"]);
  const toggleAppearance = (value: string, on: boolean) =>
    setAppearance((current) => (on ? [...current, value] : current.filter((it) => it !== value)));
  const [avatarFiles, setAvatarFiles] = createSignal<File[]>([]);
  const [otp, setOtp] = createSignal<string[]>([]);

  const [emailNotif, setEmailNotif] = createSignal(true);
  const [pushNotif, setPushNotif] = createSignal(true);
  const [weeklyDigest, setWeeklyDigest] = createSignal(false);
  const [notifTypes, setNotifTypes] = createSignal(["mentions", "updates"]);

  const [twoFactor, setTwoFactor] = createSignal(false);
  const [sessionTimeout, setSessionTimeout] = createSignal("30");

  function handleSave() {
    toast.add({ message: "設定を保存しました", variant: "success" });
  }

  function handleDeleteAccount() {
    setConfirmOpen(false);
    toast.add({ message: "アカウント削除をリクエストしました", variant: "danger" });
  }

  return (
    <div class="sample-page">
      <ToastContainer position="top-right" />

      <Breadcrumb>
        <BreadcrumbItem href="#">ホーム</BreadcrumbItem>
        <BreadcrumbItem current>設定</BreadcrumbItem>
      </Breadcrumb>

      <div style={{ height: "16px" }} />

      <div class="sample-header">
        <h1>設定</h1>
        <Badge variant="info">v2.1.0</Badge>
      </div>

      <Tabs value={tab()} onChange={setTab}>
        <TabList>
          <Tab value="profile">プロフィール</Tab>
          <Tab value="notifications">通知</Tab>
          <Tab value="appearance">外観</Tab>
          <Tab value="security">セキュリティ</Tab>
        </TabList>

        <TabPanel value="profile">
          <div style={{ height: "16px" }} />
          <Card>
            <CardHeader>
              <span style={{ "font-weight": "600" }}>基本情報</span>
            </CardHeader>
            <CardBody>
              <Stack gap={3}>
                <FormField label="表示名" required>
                  <TextField value={name()} onInput={setName} />
                </FormField>
                <FormField label="メールアドレス" required hint="公開されません">
                  <TextField type="email" value={email()} onInput={setEmail} />
                </FormField>
                <FormField label="自己紹介">
                  <TextArea value={bio()} onInput={setBio} rows={3} />
                </FormField>
                <FormField label="プロフィール画像" hint="PNG または JPG、5MB まで">
                  <FileUpload
                    label="ここにドロップ、またはクリックして選択"
                    accept="image/*"
                    files={avatarFiles()}
                    onSelect={setAvatarFiles}
                    onRemove={() => setAvatarFiles([])}
                    removeLabel={(file) => `${file.name} を削除`}
                  />
                </FormField>
                <Grid minItemWidth="14rem" gap={3}>
                  <Select
                    label="言語"
                    value={language()}
                    onChange={setLanguage}
                    options={[
                      { value: "ja", label: "日本語" },
                      { value: "en", label: "English" },
                      { value: "zh", label: "中文" },
                      { value: "ko", label: "한국어" },
                    ]}
                  />
                  <Select
                    label="タイムゾーン"
                    value={timezone()}
                    onChange={setTimezone}
                    options={[
                      { value: "asia-tokyo", label: "Asia/Tokyo (UTC+9)" },
                      { value: "america-ny", label: "America/New_York (UTC-5)" },
                      { value: "europe-london", label: "Europe/London (UTC+0)" },
                    ]}
                  />
                </Grid>
              </Stack>
            </CardBody>
            <CardFooter>
              <HStack gap={2}>
                <Spacer />
                <Button variant="neutral" onClick={() => toast.add({ message: "変更を破棄しました", variant: "info" })}>
                  キャンセル
                </Button>
                <Button variant="primary" onClick={handleSave}>
                  保存
                </Button>
              </HStack>
            </CardFooter>
          </Card>
        </TabPanel>

        <TabPanel value="notifications">
          <div style={{ height: "16px" }} />
          <Card>
            <CardHeader>
              <span style={{ "font-weight": "600" }}>通知設定</span>
            </CardHeader>
            <CardBody>
              <Stack gap={4}>
                <Switch label="メール通知" checked={emailNotif()} onChange={setEmailNotif} />
                <Switch label="プッシュ通知" checked={pushNotif()} onChange={setPushNotif} />
                <Switch label="週間ダイジェスト" checked={weeklyDigest()} onChange={setWeeklyDigest} />

                <Divider />

                <CheckboxGroup label="通知の種類" value={notifTypes()} onChange={setNotifTypes}>
                  <Checkbox value="mentions" label="メンション" />
                  <Checkbox value="updates" label="更新通知" />
                  <Checkbox value="comments" label="コメント" />
                  <Checkbox value="marketing" label="マーケティング" />
                </CheckboxGroup>
              </Stack>
            </CardBody>
            <CardFooter>
              <HStack gap={2}>
                <Spacer />
                <Button variant="primary" onClick={handleSave}>
                  保存
                </Button>
              </HStack>
            </CardFooter>
          </Card>
        </TabPanel>

        <TabPanel value="appearance">
          <div style={{ height: "16px" }} />
          <Card>
            <CardHeader>
              <span style={{ "font-weight": "600" }}>外観設定</span>
            </CardHeader>
            <CardBody>
              <Stack gap={4}>
                <FormField label="テーマ">
                  <SegmentedControl
                    label="テーマ"
                    value={theme()}
                    onChange={(v) => {
                      setTheme(v);
                      if (v === "dark") {
                        document.documentElement.setAttribute("data-theme", "dark");
                      } else {
                        document.documentElement.removeAttribute("data-theme");
                      }
                    }}
                    options={[
                      { value: "light", label: "ライト" },
                      { value: "dark", label: "ダーク" },
                      { value: "system", label: "システム" },
                    ]}
                  />
                </FormField>

                <Divider />

                <Slider
                  label="フォントサイズ"
                  value={fontSize()}
                  onInput={setFontSize}
                  min={10}
                  max={24}
                  step={1}
                  showValue
                  formatValue={(v) => `${v}px`}
                />

                <Slider
                  label="行間"
                  value={lineHeight()}
                  onInput={setLineHeight}
                  min={100}
                  max={200}
                  step={10}
                  showValue
                  formatValue={(v) => `${(v / 100).toFixed(1)}`}
                />

                <Divider />

                <Accordion>
                  <AccordionItem title="詳細な外観設定">
                    <Stack gap={3}>
                      <For each={APPEARANCE_OPTIONS}>
                        {(option) => (
                          <Checkbox
                            label={option.label}
                            checked={appearance().includes(option.value)}
                            onChange={(checked) => toggleAppearance(option.value, checked)}
                          />
                        )}
                      </For>
                    </Stack>
                  </AccordionItem>
                  <AccordionItem title="アクセシビリティ">
                    <Stack gap={3}>
                      <For each={ACCESSIBILITY_OPTIONS}>
                        {(option) => (
                          <Checkbox
                            label={option.label}
                            checked={appearance().includes(option.value)}
                            onChange={(checked) => toggleAppearance(option.value, checked)}
                          />
                        )}
                      </For>
                      <VisuallyHidden>
                        <span>スクリーンリーダー用の追加情報: 外観設定はリアルタイムで反映されます</span>
                      </VisuallyHidden>
                    </Stack>
                  </AccordionItem>
                </Accordion>
              </Stack>
            </CardBody>
            <CardFooter>
              <HStack gap={2}>
                <Spacer />
                <Button variant="primary" onClick={handleSave}>
                  保存
                </Button>
              </HStack>
            </CardFooter>
          </Card>
        </TabPanel>

        <TabPanel value="security">
          <div style={{ height: "16px" }} />
          <Stack gap={3}>
            <Card>
              <CardHeader>
                <span style={{ "font-weight": "600" }}>セキュリティ</span>
              </CardHeader>
              <CardBody>
                <Stack gap={4}>
                  <Switch
                    label="2段階認証"
                    checked={twoFactor()}
                    onChange={(v) => {
                      setTwoFactor(v);
                      toast.add({
                        message: v ? "2段階認証を有効にしました" : "2段階認証を無効にしました",
                        variant: v ? "success" : "warning",
                      });
                    }}
                  />

                  <Show when={twoFactor()}>
                    <FormField label="認証コード" hint="認証アプリに表示された6桁を入力してください">
                      <PinInput
                        label="認証コード"
                        value={otp()}
                        onChange={setOtp}
                        length={6}
                        itemLabel={(position, length) => `${length}桁中 ${position} 桁目`}
                        onComplete={(code) =>
                          toast.add({ message: `コード ${code} を確認しました`, variant: "success" })
                        }
                      />
                    </FormField>
                  </Show>

                  <Select
                    label="セッションタイムアウト"
                    value={sessionTimeout()}
                    onChange={setSessionTimeout}
                    options={[
                      { value: "15", label: "15分" },
                      { value: "30", label: "30分" },
                      { value: "60", label: "1時間" },
                      { value: "never", label: "無期限" },
                    ]}
                  />
                </Stack>
              </CardBody>
              <CardFooter>
                <HStack gap={2}>
                  <Spacer />
                  <Button variant="primary" onClick={handleSave}>
                    保存
                  </Button>
                </HStack>
              </CardFooter>
            </Card>

            <Alert variant="danger">
              <strong>危険な操作:</strong>{" "}
              アカウントを削除すると、すべてのデータが失われます。この操作は取り消せません。
            </Alert>

            <Button variant="danger" onClick={() => setConfirmOpen(true)}>
              アカウントを削除
            </Button>
          </Stack>
        </TabPanel>
      </Tabs>

      <Dialog open={confirmOpen()} onClose={() => setConfirmOpen(false)} size="sm">
        <DialogHeader>アカウント削除の確認</DialogHeader>
        <DialogBody>
          本当にアカウントを削除しますか？この操作は取り消すことができません。 すべてのデータが永久に失われます。
        </DialogBody>
        <DialogFooter>
          <HStack gap={2}>
            <Spacer />
            <Button variant="neutral" onClick={() => setConfirmOpen(false)}>
              キャンセル
            </Button>
            <Button variant="danger" onClick={handleDeleteAccount}>
              削除する
            </Button>
          </HStack>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
