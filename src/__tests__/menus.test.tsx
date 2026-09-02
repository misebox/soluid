// @vitest-environment jsdom
import { createRoot, createSignal } from "solid-js";
import type { JSX } from "solid-js";
import { render } from "solid-js/web";
import { afterEach, expect, it, vi } from "vitest";
import { CommandPalette } from "../components/ui/soluid/CommandPalette";
import { ContextMenu } from "../components/ui/soluid/ContextMenu";
import { createToast } from "../components/ui/soluid/core/createToast";
import { DatePickerControl } from "../components/ui/soluid/DatePicker";
import { Dialog, DialogBody, DialogHeader } from "../components/ui/soluid/Dialog";
import { Drawer } from "../components/ui/soluid/Drawer";
import { Menu, MenuItem } from "../components/ui/soluid/Menu";
import { Popover } from "../components/ui/soluid/Popover";

if (!Element.prototype.scrollIntoView) Element.prototype.scrollIntoView = () => {};

const cleanups: (() => void)[] = [];

afterEach(() => {
  vi.useRealTimers();
  while (cleanups.length > 0) cleanups.pop()?.();
  document.body.replaceChildren();
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
});

async function settle() {
  await Promise.resolve();
  await Promise.resolve();
}

/** Waits out floating-ui's positioning, which a Popover focuses after. */
function placed() {
  return new Promise<void>((resolve) => setTimeout(resolve, 0));
}

function mount(ui: () => JSX.Element) {
  const host = document.createElement("div");
  document.body.append(host);
  const dispose = render(ui, host);
  cleanups.push(() => {
    dispose();
    host.remove();
  });
  return host;
}

function keydown(target: EventTarget, key: string) {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
}

function q<T extends HTMLElement>(selector: string): T {
  const el = document.querySelector<T>(selector);
  if (!el) throw new Error(`missing ${selector}`);
  return el;
}

function finishClosingAnimation() {
  for (const backdrop of document.querySelectorAll(".so-dialog-backdrop")) {
    backdrop.dispatchEvent(new Event("animationend", { bubbles: true }));
  }
}

function dialog(open: () => boolean, onClose: () => void, body: JSX.Element) {
  return (
    <Dialog open={open()} onClose={onClose}>
      <DialogHeader>Title</DialogHeader>
      <DialogBody>{body}</DialogBody>
    </Dialog>
  );
}

it("Escape in a Menu inside a Dialog closes only the menu", async () => {
  const onClose = vi.fn();
  const [menuOpen, setMenuOpen] = createSignal(false);
  mount(() => (
    <Dialog open onClose={onClose}>
      <DialogBody>
        <Menu open={menuOpen()} onOpenChange={setMenuOpen} trigger="Actions">
          <MenuItem>Edit</MenuItem>
        </Menu>
      </DialogBody>
    </Dialog>
  ));
  await settle();
  setMenuOpen(true);
  await settle();

  keydown(q('[role="menuitem"]'), "Escape");

  expect(menuOpen()).toBe(false);
  expect(onClose).not.toHaveBeenCalled();
});

it("Escape in a Popover inside a Dialog closes only the popover", async () => {
  const onClose = vi.fn();
  const [popOpen, setPopOpen] = createSignal(false);
  mount(() => (
    <Dialog open onClose={onClose}>
      <DialogBody>
        <Popover open={popOpen()} onOpenChange={setPopOpen} content={<button>inside</button>}>
          Open
        </Popover>
      </DialogBody>
    </Dialog>
  ));
  await settle();
  setPopOpen(true);
  await settle();

  keydown(q(".so-popover-trigger"), "Escape");

  expect(popOpen()).toBe(false);
  expect(onClose).not.toHaveBeenCalled();
});

it("Escape in a ContextMenu inside a Dialog closes only the context menu", async () => {
  const onClose = vi.fn();
  mount(() => (
    <Dialog open onClose={onClose}>
      <DialogBody>
        <ContextMenu content={<MenuItem>Rename</MenuItem>}>
          <div>area</div>
        </ContextMenu>
      </DialogBody>
    </Dialog>
  ));
  await settle();
  q(".so-context-menu-region").dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true }));
  await settle();

  keydown(q('[role="menuitem"]'), "Escape");
  await settle();

  expect(document.querySelector(".so-context-menu")).toBeNull();
  expect(onClose).not.toHaveBeenCalled();
});

it("ContextMenu closes once an item is picked", async () => {
  const onSelect = vi.fn();
  mount(() => (
    <ContextMenu content={<MenuItem onSelect={onSelect}>Rename</MenuItem>}>
      <div>area</div>
    </ContextMenu>
  ));
  q(".so-context-menu-region").dispatchEvent(
    new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 10, clientY: 10 }),
  );
  await settle();
  const item = q('[role="menuitem"]');

  item.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
  item.click();
  await settle();

  expect(onSelect).toHaveBeenCalledOnce();
  expect(document.querySelector(".so-context-menu")).toBeNull();
});

it("Menu closes when Tab moves focus on", async () => {
  const [open, setOpen] = createSignal(false);
  mount(() => (
    <Menu open={open()} onOpenChange={setOpen} trigger="Actions">
      <MenuItem>Edit</MenuItem>
    </Menu>
  ));
  setOpen(true);
  await settle();
  const item = q('[role="menuitem"]');
  item.focus();

  keydown(item, "Tab");

  expect(open()).toBe(false);
});

it("CommandPalette reports an Escape close once", async () => {
  const onOpenChange = vi.fn();
  mount(() => (
    <CommandPalette open onOpenChange={onOpenChange} commands={[{ id: "a", label: "Alpha" }]} onSelect={() => {}} />
  ));
  await settle();

  keydown(q(".so-command__input"), "Escape");

  expect(onOpenChange.mock.calls).toEqual([[false]]);
});

it("keeps focus in the top dialog when the one behind it closes", async () => {
  const trigger = document.createElement("button");
  document.body.append(trigger);
  trigger.focus();
  const [a, setA] = createSignal(false);
  const [b, setB] = createSignal(false);
  mount(() => dialog(a, () => setA(false), <button>a</button>));
  mount(() => dialog(b, () => setB(false), <button>b</button>));
  setA(true);
  await settle();
  setB(true);
  await settle();
  expect(document.activeElement?.textContent).toBe("b");

  setA(false);
  finishClosingAnimation();
  await settle();

  expect(document.activeElement?.textContent).toBe("b");
});

it("does not report a second close for a backdrop click during the closing animation", async () => {
  const onClose = vi.fn();
  const [open, setOpen] = createSignal(false);
  mount(() =>
    dialog(
      open,
      () => {
        onClose();
        setOpen(false);
      },
      <button>inside</button>,
    ),
  );
  setOpen(true);
  await settle();
  keydown(document, "Escape");
  await settle();
  expect(onClose).toHaveBeenCalledTimes(1);
  const backdrop = q(".so-dialog-backdrop");

  backdrop.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
  backdrop.dispatchEvent(new MouseEvent("click", { bubbles: true }));

  expect(onClose).toHaveBeenCalledTimes(1);
});

it("CommandPalette does not point at a list it is not rendering", async () => {
  mount(() => (
    <CommandPalette open onOpenChange={() => {}} commands={[{ id: "a", label: "Alpha" }]} onSelect={() => {}} />
  ));
  await settle();
  const input = q<HTMLInputElement>(".so-command__input");

  input.value = "zzz";
  input.dispatchEvent(new Event("input", { bubbles: true }));
  await settle();

  expect(document.querySelector(".so-command__empty")).not.toBeNull();
  expect(input.getAttribute("aria-activedescendant")).toBeNull();
  expect(input.getAttribute("aria-controls")).toBeNull();
});

it("CommandPalette plays its closing animation", async () => {
  const [open, setOpen] = createSignal(true);
  mount(() => (
    <CommandPalette open={open()} onOpenChange={setOpen} commands={[{ id: "a", label: "Alpha" }]} onSelect={() => {}} />
  ));
  await settle();

  setOpen(false);
  await settle();

  expect(q(".so-command-backdrop").classList.contains("so-command-backdrop--closing")).toBe(true);
});

it("toast auto-dismiss survives disposal of the owner that added it", () => {
  vi.useFakeTimers();
  const store = createToast({ defaultDuration: 1000 });
  const dispose = createRoot((dispose) => {
    store.add({ message: "saved" });
    return dispose;
  });
  expect(store.toasts.length).toBe(1);

  dispose();
  vi.advanceTimersByTime(1000 + 150 + 1);

  expect(store.toasts.length).toBe(0);
});

it("Popover moves focus into its panel when it opens", async () => {
  const [open, setOpen] = createSignal(false);
  mount(() => (
    <Popover open={open()} onOpenChange={setOpen} content={<button>inside</button>}>
      Open
    </Popover>
  ));
  q(".so-popover-trigger").focus();

  setOpen(true);
  await placed();

  expect(document.activeElement?.textContent).toBe("inside");
});

it("Popover takes focus itself when its content has no controls", async () => {
  const [open, setOpen] = createSignal(false);
  mount(() => (
    <Popover open={open()} onOpenChange={setOpen} content={<p>Just text</p>}>
      Open
    </Popover>
  ));

  setOpen(true);
  await placed();

  expect(document.activeElement?.classList.contains("so-popover")).toBe(true);
});

it("Popover closes and returns to the trigger when Tab leaves its last control", async () => {
  const [open, setOpen] = createSignal(false);
  mount(() => (
    <Popover open={open()} onOpenChange={setOpen} content={<button>inside</button>}>
      Open
    </Popover>
  ));
  setOpen(true);
  await placed();
  const inside = document.activeElement as HTMLElement;

  keydown(inside, "Tab");
  await settle();

  expect(open()).toBe(false);
  expect(document.activeElement).toBe(q(".so-popover-trigger"));
});

it("Popover enters its panel when Tab is pressed on the trigger", async () => {
  const [open, setOpen] = createSignal(false);
  mount(() => (
    <Popover open={open()} onOpenChange={setOpen} content={<button>inside</button>}>
      Open
    </Popover>
  ));
  setOpen(true);
  await settle();
  const trigger = q<HTMLButtonElement>(".so-popover-trigger");
  trigger.focus();

  const e = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true });
  trigger.dispatchEvent(e);

  expect(e.defaultPrevented).toBe(true);
  expect(document.activeElement?.textContent).toBe("inside");
});

it("a press on a day in a DatePicker inside a Popover does not close the popover", async () => {
  const onChange = vi.fn();
  const [pop, setPop] = createSignal(true);
  mount(() => (
    <Popover open={pop()} onOpenChange={setPop} content={<DatePickerControl value="2026-05-10" onChange={onChange} />}>
      open
    </Popover>
  ));
  await settle();
  q(".so-date-picker__trigger").click();
  await settle();
  const day = q('[data-so-day="2026-05-12"]');

  day.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, cancelable: true }));
  expect(pop()).toBe(true);
  day.click();
  await settle();

  expect(onChange).toHaveBeenCalledWith("2026-05-12");
});

it("CommandPalette does not run a command again during its closing animation", async () => {
  const onSelect = vi.fn();
  const [open, setOpen] = createSignal(true);
  mount(() => (
    <CommandPalette open={open()} onOpenChange={setOpen} commands={[{ id: "a", label: "Alpha" }]} onSelect={onSelect} />
  ));
  await settle();
  const option = q(".so-command__option");

  option.click();
  await settle();
  expect(q(".so-command-backdrop").classList.contains("so-command-backdrop--closing")).toBe(true);
  option.click();
  await settle();

  expect(onSelect).toHaveBeenCalledTimes(1);
});

it("a Dialog reopened inside its closing window stays underneath a Popover open inside it", async () => {
  const [dlg, setDlg] = createSignal(true);
  const [pop, setPop] = createSignal(false);
  mount(() => (
    <Dialog open={dlg()} onClose={() => setDlg(false)}>
      <DialogBody>
        <Popover open={pop()} onOpenChange={setPop} content={<button>inside</button>}>
          Open
        </Popover>
      </DialogBody>
    </Dialog>
  ));
  await settle();
  setPop(true);
  await settle();
  setDlg(false);
  await settle();
  setDlg(true);
  await settle();

  keydown(document, "Escape");

  expect(pop()).toBe(false);
  expect(dlg()).toBe(true);
});

it("disposing a Dialog during its closing animation leaves no timer behind", async () => {
  vi.useFakeTimers();
  const [open, setOpen] = createSignal(true);
  const host = document.createElement("div");
  document.body.append(host);
  const dispose = render(() => dialog(open, () => setOpen(false), <button>inside</button>), host);
  await settle();
  setOpen(false);
  await settle();

  dispose();
  host.remove();
  vi.advanceTimersByTime(1);

  expect(vi.getTimerCount()).toBe(0);
});

it("closed overlays hold no listener on the document", async () => {
  const added = new Map<string, number>();
  const realAdd = document.addEventListener.bind(document);
  const realRemove = document.removeEventListener.bind(document);
  const count = (type: string, by: number) => added.set(type, (added.get(type) ?? 0) + by);
  document.addEventListener = ((type: string, ...rest: unknown[]) => {
    count(type, 1);
    return (realAdd as (...args: unknown[]) => void)(type, ...rest);
  }) as typeof document.addEventListener;
  document.removeEventListener = ((type: string, ...rest: unknown[]) => {
    count(type, -1);
    return (realRemove as (...args: unknown[]) => void)(type, ...rest);
  }) as typeof document.removeEventListener;
  cleanups.push(() => {
    document.addEventListener = realAdd;
    document.removeEventListener = realRemove;
  });

  const [open, setOpen] = createSignal(false);
  mount(() => (
    <>
      {Array.from({ length: 20 }, () => (
        <Dialog open={open()} onClose={() => setOpen(false)}>
          <DialogBody>row</DialogBody>
        </Dialog>
      ))}
      <Drawer open={open()} onClose={() => setOpen(false)}>
        body
      </Drawer>
    </>
  ));
  await settle();

  // A page can hold one closed Dialog per table row; none of them should be
  // routing every keystroke through a handler of its own.
  expect(added.get("keydown") ?? 0).toBe(0);

  setOpen(true);
  await settle();
  expect(added.get("keydown") ?? 0).toBeGreaterThan(0);

  setOpen(false);
  await settle();
  expect(added.get("keydown") ?? 0).toBe(0);
});
