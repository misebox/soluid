import { createEffect, createSignal, on, onCleanup } from "solid-js";
import type { Accessor } from "solid-js";
import { createFocusTrap } from "./createFocusTrap";
import { createScrollLock } from "./createScrollLock";

interface CreateOverlayOptions {
  isOpen: Accessor<boolean>;
  onClose: () => void;
}

interface OverlayReturn {
  mounted: Accessor<boolean>;
  closing: Accessor<boolean>;
  handleAnimationEnd: () => void;
  containerRef: Accessor<HTMLElement | undefined>;
  setContainerRef: (el: HTMLElement | undefined) => void;
  handleBackdropMouseDown: (e: MouseEvent) => void;
  handleBackdropClick: (e: MouseEvent) => void;
}

export function createOverlay(options: CreateOverlayOptions): OverlayReturn {
  const [mounted, setMounted] = createSignal(false);
  const [closing, setClosing] = createSignal(false);
  let closingTimer: ReturnType<typeof setTimeout> | undefined;
  onCleanup(() => clearTimeout(closingTimer));

  createEffect(
    on(options.isOpen, (open) => {
      if (open) {
        clearTimeout(closingTimer);
        setClosing(false);
        setMounted(true);
      } else if (mounted()) {
        setClosing(true);
        closingTimer = setTimeout(() => {
          if (closing()) {
            setMounted(false);
            setClosing(false);
          }
        }, 200);
      }
    }),
  );

  function handleAnimationEnd() {
    clearTimeout(closingTimer);
    if (closing()) {
      setMounted(false);
      setClosing(false);
    }
  }

  const [containerRef, setContainerRef] = createSignal<HTMLElement | undefined>(undefined);

  createFocusTrap({
    container: containerRef,
    isActive: options.isOpen,
    onClose: options.onClose,
  });

  // Held for as long as the overlay is on screen, so the page behind stays put
  // through the closing animation too.
  createScrollLock(mounted);

  // Track whether the press started on the backdrop itself. Without this,
  // selecting text inside an input and releasing over the backdrop would
  // fire a click whose target is the backdrop, closing the overlay.
  let mouseDownOnBackdrop = false;

  function handleBackdropMouseDown(e: MouseEvent): void {
    mouseDownOnBackdrop = e.target === e.currentTarget;
  }

  function handleBackdropClick(e: MouseEvent): void {
    // The backdrop stays on screen through the closing animation; a click
    // there must not report the close a second time.
    if (e.target === e.currentTarget && mouseDownOnBackdrop && options.isOpen()) {
      options.onClose();
    }
    mouseDownOnBackdrop = false;
  }

  return {
    mounted,
    closing,
    handleAnimationEnd,
    containerRef,
    setContainerRef,
    handleBackdropMouseDown,
    handleBackdropClick,
  };
}
