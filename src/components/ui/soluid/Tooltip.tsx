import { autoUpdate, computePosition, flip, offset, shift } from "@floating-ui/dom";
import { children, createEffect, createSignal, createUniqueId, onCleanup, Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import { Portal } from "solid-js/web";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";

export type TooltipPlacement = "top" | "bottom" | "left" | "right";

export interface TooltipProps extends CommonProps {
  content?: string | undefined;
  placement?: TooltipPlacement | undefined;
  children: JSX.Element;
}

// Long enough for the pointer to cross the gap onto the tip, which has to stay
// reachable (WCAG 1.4.13).
const HIDE_DELAY_MS = 100;

export function Tooltip(props: TooltipProps & JSX.HTMLAttributes<HTMLSpanElement>) {
  const [local, others] = splitProps(props, ["content", "placement", "class", "density", "children"]);

  const tooltipId = `so-tooltip-${createUniqueId()}`;
  const trigger = children(() => local.children);

  // Point aria-describedby at the resolved trigger element rather than at a
  // wrapper span: only the trigger takes focus, so only it can announce the
  // description to a screen reader.
  createEffect(() => {
    const describedBy = local.content ? tooltipId : undefined;
    for (const node of trigger.toArray()) {
      if (!(node instanceof HTMLElement)) continue;
      if (describedBy) node.setAttribute("aria-describedby", describedBy);
      else node.removeAttribute("aria-describedby");
    }
  });

  // The wrapper stays put whether or not there is content: swapping the trigger
  // between two parents would blur it.
  // Escape hides the tip until the pointer or focus leaves (WCAG 1.4.13).
  const [shown, setShown] = createSignal(false);
  const [dismissed, setDismissed] = createSignal(false);
  const visible = () => shown() && !dismissed();

  let hideTimer: ReturnType<typeof setTimeout> | undefined;
  const show = () => {
    clearTimeout(hideTimer);
    setShown(true);
  };
  const hide = () => {
    setShown(false);
    setDismissed(false);
  };
  // The tip stays up while the pointer is over the trigger or the tip, or focus is on the trigger.
  let hovered = false;
  let focused = false;
  const settle = () => {
    if (hovered || focused) {
      show();
      return;
    }
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, HIDE_DELAY_MS);
  };
  const setHovered = (value: boolean) => {
    hovered = value;
    settle();
  };
  const setFocused = (value: boolean) => {
    focused = value;
    settle();
  };
  onCleanup(() => clearTimeout(hideTimer));

  let wrapperRef: HTMLSpanElement | undefined;
  const [tipRef, setTipRef] = createSignal<HTMLSpanElement | undefined>(undefined);

  // The tip lives at the end of the document, so no scrolling ancestor of the
  // trigger can clip it. Only a tip that is on screen is kept anchored.
  createEffect(() => {
    const tip = tipRef();
    const anchor = wrapperRef;
    if (!tip || !anchor || !local.content || !visible()) return;
    onCleanup(
      autoUpdate(anchor, tip, () => {
        computePosition(anchor, tip, {
          placement: local.placement ?? "top",
          strategy: "fixed",
          middleware: [offset(6), flip(), shift({ padding: 8 })],
        }).then(({ x, y }) => {
          if (!visible()) return;
          tip.style.left = `${x}px`;
          tip.style.top = `${y}px`;
          // Until this runs the tip sits at the document origin, hidden by the CSS.
          tip.dataset.soPlaced = "";
        });
      }),
    );
    onCleanup(() => delete tip.dataset.soPlaced);
  });

  return (
    <span
      ref={wrapperRef}
      class={cls("so-tooltip-wrapper", local.class)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusIn={() => setFocused(true)}
      onFocusOut={() => setFocused(false)}
      onKeyDown={(e) => {
        if (e.key !== "Escape" || !visible()) return;
        e.preventDefault();
        setDismissed(true);
      }}
      {...others}
    >
      {trigger()}
      <Show when={local.content}>
        <Portal>
          <span
            ref={setTipRef}
            id={tooltipId}
            class={cls("so-tooltip", visible() && "so-tooltip--shown")}
            role="tooltip"
            data-density={local.density}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {local.content}
          </span>
        </Portal>
      </Show>
    </span>
  );
}
