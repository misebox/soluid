import { children, createEffect, createMemo, For, onCleanup, onMount, Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "./core/types";
import { cls, prefersReducedMotion } from "./core/utils";

export interface CarouselProps extends CommonProps {
  /** Index of the visible slide */
  index: number;
  onIndexChange: (index: number) => void;
  /** Wrap around at either end (default: false) */
  loop?: boolean;
  /** Hide the dot indicators */
  hideDots?: boolean;
  /** Accessible label for the carousel region */
  label?: string;
  previousLabel?: string;
  nextLabel?: string;
  /** Accessible label for a dot, given its 1-based position */
  dotLabel?: (position: number, total: number) => string;
  children: JSX.Element;
}

export function Carousel(props: CarouselProps & Omit<JSX.HTMLAttributes<HTMLDivElement>, "children">) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "index",
    "onIndexChange",
    "loop",
    "hideDots",
    "label",
    "previousLabel",
    "nextLabel",
    "dotLabel",
    "children",
  ]);

  const slides = children(() => local.children);
  const count = createMemo(() => slides.toArray().length);

  let viewport: HTMLDivElement | undefined;

  const atStart = () => local.index <= 0;
  const atEnd = () => local.index >= count() - 1;

  function go(delta: number): void {
    const total = count();
    if (total === 0) return;
    const next = local.index + delta;
    if (local.loop) {
      local.onIndexChange((next + total) % total);
      return;
    }
    // Clamped rather than dropped, so an index past the end can still come back.
    const clamped = Math.min(Math.max(next, 0), total - 1);
    if (clamped !== local.index) local.onIndexChange(clamped);
  }

  function handleKeyDown(e: KeyboardEvent): void {
    // Arrow keys inside a text field or slider belong to that control.
    if (e.target instanceof Element && e.target.closest("input, textarea, select, [contenteditable]")) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    }
  }

  // The browser owns the scroll position, so a swipe reports back through
  // onIndexChange while `syncing` keeps our own programmatic scroll from
  // being mistaken for one.
  let syncing = false;
  let syncTimer: ReturnType<typeof setTimeout> | undefined;

  function scrollToIndex(index: number): void {
    if (!viewport || viewport.clientWidth === 0) return;
    syncing = true;
    viewport.scrollTo({
      left: viewport.clientWidth * index,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
    // One timer per scroll, so a second move does not end the first window early.
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => (syncing = false), 400);
  }
  onCleanup(() => clearTimeout(syncTimer));

  onMount(() => {
    if (!viewport) return;
    const element = viewport;

    const observer = new ResizeObserver(() => scrollToIndex(local.index));
    observer.observe(element);
    onCleanup(() => observer.disconnect());

    const onScroll = () => {
      if (syncing || element.clientWidth === 0) return;
      const nearest = Math.round(element.scrollLeft / element.clientWidth);
      if (nearest !== local.index) local.onIndexChange(nearest);
    };
    element.addEventListener("scroll", onScroll, { passive: true });
    onCleanup(() => element.removeEventListener("scroll", onScroll));
  });

  // Reading index inside the effect is what makes a controlled change scroll.
  createEffect(() => scrollToIndex(local.index));

  return (
    <div
      class={cls("so-carousel", local.class)}
      role="region"
      aria-roledescription="carousel"
      aria-label={local.label}
      data-density={local.density}
      onKeyDown={handleKeyDown}
      {...others}
    >
      <div class="so-carousel__viewport" ref={viewport} tabIndex={0}>
        <For each={slides.toArray()}>
          {(slide, i) => (
            <div
              class="so-carousel__slide"
              role="group"
              aria-roledescription="slide"
              aria-hidden={i() !== local.index}
              aria-label={local.dotLabel?.(i() + 1, count()) ?? `${i() + 1} / ${count()}`}
            >
              {slide}
            </div>
          )}
        </For>
      </div>

      <button
        type="button"
        class="so-carousel__nav so-carousel__nav--prev"
        aria-label={local.previousLabel ?? "Previous slide"}
        disabled={!local.loop && atStart()}
        onClick={() => go(-1)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <polyline points="15 6 9 12 15 18" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        class="so-carousel__nav so-carousel__nav--next"
        aria-label={local.nextLabel ?? "Next slide"}
        disabled={!local.loop && atEnd()}
        onClick={() => go(1)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <polyline points="9 6 15 12 9 18" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <Show when={!local.hideDots}>
        <div class="so-carousel__dots">
          <For each={Array.from({ length: count() }, (_, i) => i)}>
            {(i) => (
              <button
                type="button"
                class={cls("so-carousel__dot", i === local.index && "so-carousel__dot--active")}
                aria-label={local.dotLabel?.(i + 1, count()) ?? `${i + 1} / ${count()}`}
                aria-current={i === local.index}
                onClick={() => local.onIndexChange(i)}
              />
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
