// @vitest-environment jsdom
import { createSignal } from "solid-js";
import type { JSX } from "solid-js";
import { render } from "solid-js/web";
import { afterEach, describe, expect, it } from "vitest";
import { Dialog, DialogBody, DialogHeader } from "../components/ui/soluid/Dialog";

/**
 * Behaviour a modal owes the page around it: hold the scroll, take focus, give
 * focus back, and keep Tab and Escape inside the overlay on top.
 */

const cleanups: (() => void)[] = [];

afterEach(() => {
  while (cleanups.length > 0) cleanups.pop()?.();
  document.body.replaceChildren();
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
});

/** Lets the render and the effects that follow it settle. */
async function settle(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

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

function addTrigger(label: string): HTMLButtonElement {
  const trigger = document.createElement("button");
  trigger.textContent = label;
  document.body.append(trigger);
  return trigger;
}

/** The overlay only unmounts once its closing animation has run. */
function finishClosingAnimation(): void {
  for (const backdrop of document.querySelectorAll(".so-dialog-backdrop")) {
    backdrop.dispatchEvent(new Event("animationend", { bubbles: true }));
  }
}

function press(key: string, init: KeyboardEventInit = {}): void {
  document.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, ...init }));
}

function dialog(open: () => boolean, onClose: () => void, body: JSX.Element) {
  return (
    <Dialog open={open()} onClose={onClose}>
      <DialogHeader>Title</DialogHeader>
      <DialogBody>{body}</DialogBody>
    </Dialog>
  );
}

describe("page scroll", () => {
  it("is held while the dialog is open", async () => {
    const [open, setOpen] = createSignal(false);
    mount(() => dialog(open, () => setOpen(false), <button>inside</button>));

    expect(document.documentElement.style.overflow).toBe("");

    setOpen(true);
    await settle();

    expect(document.documentElement.style.overflow).toBe("hidden");
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("goes back to whatever the page had set, not to a blank value", async () => {
    document.documentElement.style.overflow = "scroll";
    const [open, setOpen] = createSignal(false);
    mount(() => dialog(open, () => setOpen(false), <button>inside</button>));

    setOpen(true);
    await settle();
    setOpen(false);
    finishClosingAnimation();
    await settle();

    expect(document.documentElement.style.overflow).toBe("scroll");
  });

  it("stays held when an overlay closes on top of another one", async () => {
    const [outer, setOuter] = createSignal(false);
    const [inner, setInner] = createSignal(false);
    mount(() => dialog(outer, () => setOuter(false), <button>outer</button>));
    mount(() => dialog(inner, () => setInner(false), <button>inner</button>));

    setOuter(true);
    await settle();
    setInner(true);
    await settle();
    setInner(false);
    finishClosingAnimation();
    await settle();

    expect(document.documentElement.style.overflow).toBe("hidden");

    setOuter(false);
    finishClosingAnimation();
    await settle();

    expect(document.documentElement.style.overflow).toBe("");
  });
});

describe("focus", () => {
  it("moves into the dialog when it opens", async () => {
    const trigger = addTrigger("open");
    trigger.focus();

    const [open, setOpen] = createSignal(false);
    mount(() => dialog(open, () => setOpen(false), <button>inside</button>));

    setOpen(true);
    await settle();

    expect(document.activeElement?.textContent).toBe("inside");
  });

  it("goes back to the trigger when the dialog closes", async () => {
    const trigger = addTrigger("open");
    trigger.focus();

    const [open, setOpen] = createSignal(false);
    mount(() => dialog(open, () => setOpen(false), <button>inside</button>));

    setOpen(true);
    await settle();
    setOpen(false);
    finishClosingAnimation();
    await settle();

    expect(document.activeElement).toBe(trigger);
  });

  it("is taken even by a dialog with nothing focusable in it", async () => {
    const trigger = addTrigger("open");
    trigger.focus();

    const [open, setOpen] = createSignal(false);
    mount(() => dialog(open, () => setOpen(false), <p>nothing to focus</p>));

    setOpen(true);
    await settle();

    expect(document.activeElement).toBe(document.querySelector(".so-dialog"));
  });
});

describe("Tab", () => {
  const twoButtons = (
    <>
      <button>first</button>
      <button>last</button>
    </>
  );

  it("wraps from the last focusable back to the first", async () => {
    const [open, setOpen] = createSignal(false);
    mount(() => dialog(open, () => setOpen(false), twoButtons));
    setOpen(true);
    await settle();

    const buttons = document.querySelectorAll<HTMLElement>(".so-dialog button");
    buttons[buttons.length - 1].focus();
    press("Tab");

    expect(document.activeElement?.textContent).toBe("first");
  });

  it("wraps backwards from the first to the last", async () => {
    const [open, setOpen] = createSignal(false);
    mount(() => dialog(open, () => setOpen(false), twoButtons));
    setOpen(true);
    await settle();

    document.querySelector<HTMLElement>(".so-dialog button")?.focus();
    press("Tab", { shiftKey: true });

    expect(document.activeElement?.textContent).toBe("last");
  });

  it("pulls focus back when it has landed outside the dialog", async () => {
    const outside = addTrigger("outside");
    const [open, setOpen] = createSignal(false);
    mount(() => dialog(open, () => setOpen(false), twoButtons));
    setOpen(true);
    await settle();

    // A click on the backdrop leaves focus on the page behind.
    outside.focus();
    press("Tab");

    expect(document.activeElement?.textContent).toBe("first");
  });
});

describe("Escape", () => {
  it("closes the dialog", async () => {
    const [open, setOpen] = createSignal(false);
    mount(() => dialog(open, () => setOpen(false), <button>inside</button>));
    setOpen(true);
    await settle();

    press("Escape");

    expect(open()).toBe(false);
  });

  it("closes only the overlay on top", async () => {
    const [outer, setOuter] = createSignal(false);
    const [inner, setInner] = createSignal(false);
    mount(() => dialog(outer, () => setOuter(false), <button>outer</button>));
    mount(() => dialog(inner, () => setInner(false), <button>inner</button>));

    setOuter(true);
    await settle();
    setInner(true);
    await settle();

    press("Escape");

    expect(inner()).toBe(false);
    expect(outer()).toBe(true);
  });
});

it("a drag that starts inside the dialog and ends on the backdrop does not close it", () => {
  // Selecting text in a field and releasing over the backdrop is an ordinary
  // gesture; it used to be indistinguishable from a click on the backdrop.
  const [open, setOpen] = createSignal(true);
  let closes = 0;
  mount(() =>
    dialog(
      open,
      () => {
        closes += 1;
        setOpen(false);
      },
      <input />,
    ),
  );
  const backdrop = document.querySelector(".so-dialog-backdrop") as HTMLElement;
  const panel = backdrop.querySelector(".so-dialog") as HTMLElement;

  panel.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
  backdrop.dispatchEvent(new MouseEvent("click", { bubbles: true }));

  expect(closes).toBe(0);
});
