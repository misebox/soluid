// @vitest-environment jsdom
import { createSignal } from "solid-js";
import type { JSX } from "solid-js";
import { render } from "solid-js/web";
import { afterEach, expect, it } from "vitest";
import { ColorPickerControl } from "../components/ui/soluid/ColorPicker";
import { ContextMenu } from "../components/ui/soluid/ContextMenu";
import { DatePickerControl } from "../components/ui/soluid/DatePicker";
import { Dialog, DialogBody, DialogHeader } from "../components/ui/soluid/Dialog";
import { Menu, MenuItem } from "../components/ui/soluid/Menu";
import { Popover } from "../components/ui/soluid/Popover";
import { SegmentedControl } from "../components/ui/soluid/SegmentedControl";
import { Switch } from "../components/ui/soluid/Switch";
import { TextField } from "../components/ui/soluid/TextField";
import { TimePickerControl } from "../components/ui/soluid/TimePicker";

const cleanups: (() => void)[] = [];

afterEach(() => {
  while (cleanups.length > 0) cleanups.pop()?.();
  document.body.replaceChildren();
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
});

function mount(ui: () => JSX.Element): HTMLElement {
  const host = document.createElement("div");
  document.body.append(host);
  const dispose = render(ui, host);
  cleanups.push(() => {
    dispose();
    host.remove();
  });
  return host;
}

function q<T extends HTMLElement>(selector: string): T {
  const el = document.querySelector<T>(selector);
  if (!el) throw new Error(`missing ${selector}`);
  return el;
}

function press(target: EventTarget, key: string, init: KeyboardEventInit = {}) {
  const e = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init });
  target.dispatchEvent(e);
  return e;
}

async function settle() {
  await Promise.resolve();
  await Promise.resolve();
}

function frame() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

function finishClosingAnimation() {
  for (const backdrop of document.querySelectorAll(".so-dialog-backdrop")) {
    backdrop.dispatchEvent(new Event("animationend", { bubbles: true }));
  }
}

const letters = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
];

function inDialog(body: JSX.Element, onClose: () => void = () => {}) {
  return (
    <Dialog open onClose={onClose}>
      <DialogHeader>Title</DialogHeader>
      <DialogBody>{body}</DialogBody>
    </Dialog>
  );
}

it("Switch with a name submits like a checkbox", () => {
  mount(() => (
    <form>
      <Switch label="notify" name="notify" checked />
      <Switch label="off" name="off" />
    </form>
  ));
  const data = new FormData(q<HTMLFormElement>("form"));

  expect(data.get("notify")).toBe("on");
  expect(data.has("off")).toBe(false);
});

it("keeps the caller's id inside a labelled field", () => {
  mount(() => <TextField label="Email" id="email" />);

  expect(q<HTMLInputElement>("input").id).toBe("email");
  expect(q<HTMLLabelElement>("label").htmlFor).toBe("email");
});

it("DatePicker required blocks submission while empty", () => {
  mount(() => (
    <form>
      <DatePickerControl name="d" required />
    </form>
  ));

  expect(q<HTMLFormElement>("form").checkValidity()).toBe(false);
});

it("picker triggers expose required as aria-required, not as a button attribute", () => {
  mount(() => (
    <>
      <DatePickerControl required />
      <TimePickerControl required />
      <ColorPickerControl required />
    </>
  ));

  for (const selector of [".so-date-picker__trigger", ".so-time-picker__trigger", ".so-color-picker__trigger"]) {
    expect(q(selector).getAttribute("aria-required"), selector).toBe("true");
    expect(q(selector).hasAttribute("required"), selector).toBe(false);
  }
});

it("returns focus to the menu trigger after a dialog opened from a menu item closes", async () => {
  const [menuOpen, setMenuOpen] = createSignal(false);
  const [dialogOpen, setDialogOpen] = createSignal(false);
  mount(() => (
    <>
      <Menu open={menuOpen()} onOpenChange={setMenuOpen} trigger="Actions">
        <MenuItem
          onSelect={() => {
            setMenuOpen(false);
            setDialogOpen(true);
          }}
        >
          Rename
        </MenuItem>
      </Menu>
      <Dialog open={dialogOpen()} onClose={() => setDialogOpen(false)}>
        <DialogHeader>Rename</DialogHeader>
        <DialogBody>
          <button>ok</button>
        </DialogBody>
      </Dialog>
    </>
  ));
  const trigger = q<HTMLButtonElement>(".so-menu-trigger");
  trigger.focus();
  trigger.click();
  await settle();
  await frame();
  const item = q('[role="menuitem"]');
  item.focus();
  item.click();
  await settle();
  expect(document.activeElement?.textContent).toBe("ok");

  setDialogOpen(false);
  finishClosingAnimation();
  await settle();

  expect(document.activeElement).toBe(trigger);
});

it("ContextMenu leaves focus in a dialog opened by a click on an item", async () => {
  const [dialogOpen, setDialogOpen] = createSignal(false);
  mount(() => (
    <>
      <ContextMenu content={<MenuItem onSelect={() => setDialogOpen(true)}>Rename</MenuItem>}>
        <div>area</div>
      </ContextMenu>
      <Dialog open={dialogOpen()} onClose={() => setDialogOpen(false)}>
        <DialogBody>
          <button>ok</button>
        </DialogBody>
      </Dialog>
    </>
  ));
  const region = q<HTMLElement>(".so-context-menu-region");
  region.focus();
  region.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true }));
  await settle();
  const item = q('[role="menuitem"]');
  item.focus();

  item.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
  item.click();
  await settle();

  expect(document.activeElement?.textContent).toBe("ok");
});

it("ContextMenu closes when Enter on an item opens a dialog", async () => {
  const [dialogOpen, setDialogOpen] = createSignal(false);
  mount(() => (
    <>
      <ContextMenu content={<MenuItem onSelect={() => setDialogOpen(true)}>Rename</MenuItem>}>
        <div>area</div>
      </ContextMenu>
      <Dialog open={dialogOpen()} onClose={() => setDialogOpen(false)}>
        <DialogBody>
          <button>ok</button>
        </DialogBody>
      </Dialog>
    </>
  ));
  const region = q<HTMLElement>(".so-context-menu-region");
  region.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true }));
  await settle();
  const item = q('[role="menuitem"]');
  item.focus();

  press(item, "Enter");
  await settle();

  expect(document.querySelector(".so-context-menu")).toBeNull();
});

it("focus trap wraps from the last real tab stop, skipping parked roving items", async () => {
  mount(() =>
    inDialog(
      <>
        <button>first</button>
        <SegmentedControl options={letters} value="a" onChange={() => {}} />
      </>,
    ),
  );
  await settle();
  q<HTMLButtonElement>('[role="radio"][tabindex="0"]').focus();

  const e = press(document, "Tab");

  expect(e.defaultPrevented).toBe(true);
  expect(document.activeElement?.textContent).toBe("first");
});

it("focus trap sends Shift+Tab from the first element to a real tab stop", async () => {
  mount(() =>
    inDialog(
      <>
        <button>first</button>
        <SegmentedControl options={letters} value="a" onChange={() => {}} />
      </>,
    ),
  );
  await settle();
  q<HTMLButtonElement>(".so-dialog button").focus();

  press(document, "Tab", { shiftKey: true });

  expect(document.activeElement?.getAttribute("tabindex")).toBe("0");
});

it("Tab inside a Popover inside a Dialog moves to the next control", async () => {
  const [popOpen, setPopOpen] = createSignal(false);
  mount(() =>
    inDialog(
      <Popover
        open={popOpen()}
        onOpenChange={setPopOpen}
        content={
          <>
            <button>one</button>
            <button>two</button>
          </>
        }
      >
        Open
      </Popover>,
    ),
  );
  await settle();
  setPopOpen(true);
  await settle();
  const one = q<HTMLButtonElement>(".so-popover button");
  one.focus();

  const e = press(one, "Tab");
  // Nothing prevented the default, so the browser would move on to the next control.
  if (!e.defaultPrevented) q<HTMLButtonElement>(".so-popover button:nth-of-type(2)").focus();

  expect(document.activeElement?.textContent).toBe("two");
});

it("Tab out of a DatePicker panel inside a Dialog closes the panel", async () => {
  mount(() =>
    inDialog(
      <>
        <DatePickerControl value="2026-05-15" />
        <button>after</button>
      </>,
    ),
  );
  await settle();
  const trigger = q<HTMLButtonElement>(".so-date-picker__trigger");
  trigger.click();
  await settle();
  await settle();
  const day = q<HTMLButtonElement>('[data-so-day="2026-05-15"]');
  day.focus();

  press(day, "Tab");
  await settle();

  expect(trigger.getAttribute("aria-expanded")).toBe("false");
  expect(document.activeElement).toBe(trigger);
});
