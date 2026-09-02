// @vitest-environment jsdom
import { createSignal } from "solid-js";
import type { JSX } from "solid-js";
import { render } from "solid-js/web";
import { afterEach, expect, it } from "vitest";
import { Avatar } from "../components/ui/soluid/Avatar";
import { AvatarGroup } from "../components/ui/soluid/AvatarGroup";
import { Badge } from "../components/ui/soluid/Badge";
import { Button } from "../components/ui/soluid/Button";
import { Divider } from "../components/ui/soluid/Divider";
import { HStack } from "../components/ui/soluid/HStack";
import { IconButton } from "../components/ui/soluid/IconButton";
import { Link } from "../components/ui/soluid/Link";
import { Progress } from "../components/ui/soluid/Progress";
import { Stack } from "../components/ui/soluid/Stack";
import { Tag } from "../components/ui/soluid/Tag";

let dispose: (() => void) | undefined;
let host: HTMLElement | undefined;

afterEach(() => {
  dispose?.();
  host?.remove();
  dispose = undefined;
  host = undefined;
});

function mount(node: () => JSX.Element) {
  host = document.createElement("div");
  document.body.append(host);
  dispose = render(node, host);
  return host;
}

const dense: Record<string, () => JSX.Element> = {
  Button: () => <Button density="dense">Go</Button>,
  IconButton: () => <IconButton density="dense" aria-label="x" icon={<span />} />,
  Badge: () => <Badge density="dense">b</Badge>,
  Tag: () => <Tag density="dense">t</Tag>,
  Stack: () => <Stack density="dense">s</Stack>,
  HStack: () => <HStack density="dense">h</HStack>,
  Divider: () => <Divider density="dense" />,
};

for (const [name, node] of Object.entries(dense)) {
  it(`${name} puts density on data-density instead of leaking it`, () => {
    const root = mount(node).firstElementChild;

    expect(root?.getAttribute("density")).toBeNull();
    expect(root?.getAttribute("data-density")).toBe("dense");
  });
}

it("Avatar tries again when src changes after a load error", () => {
  const [src, setSrc] = createSignal("https://example.com/broken.png");
  const root = mount(() => <Avatar src={src()} name="Jane Doe" />);
  root.querySelector("img")?.dispatchEvent(new Event("error"));
  expect(root.querySelector("img")).toBeNull();

  setSrc("https://example.com/valid.png");

  expect(root.querySelector("img")).not.toBeNull();
});

it("Avatar initials ignore surrounding whitespace", () => {
  const root = mount(() => <Avatar name="  Jane Doe " />);

  expect(root.textContent).toBe("JD");
});

it("AvatarGroup treats a negative max as zero", () => {
  const root = mount(() => (
    <AvatarGroup max={-1}>
      <Avatar name="A" />
      <Avatar name="B" />
      <Avatar name="C" />
    </AvatarGroup>
  ));

  expect(root.querySelector(".so-avatar-group__overflow")?.textContent).toBe("+3");
});

it("Progress treats NaN as zero", () => {
  const root = mount(() => <Progress aria-label="p" value={Number.NaN} />);

  expect(root.querySelector(".so-progress")?.getAttribute("aria-valuenow")).toBe("0");
});

it("Progress ignores a NaN segment", () => {
  const root = mount(() => <Progress aria-label="p" segments={[{ value: Number.NaN }, { value: 30 }]} />);

  expect(root.querySelector(".so-progress")?.getAttribute("aria-valuenow")).toBe("30");
});

it("Link keeps noopener on an external link when the caller passes rel", () => {
  const root = mount(() => (
    <Link href="https://example.com" external rel="nofollow">
      x
    </Link>
  ));
  const rel = root.querySelector("a")?.getAttribute("rel") ?? "";

  expect(rel).toContain("noopener");
  expect(rel).toContain("nofollow");
});
