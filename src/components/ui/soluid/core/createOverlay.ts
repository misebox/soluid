import { createEffect, createSignal, on } from "solid-js";
import type { Accessor } from "solid-js";
import { createFocusTrap } from "./createFocusTrap";

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
  handleBackdropClick: (e: MouseEvent) => void;
}

export function createOverlay(options: CreateOverlayOptions): OverlayReturn {
  const [mounted, setMounted] = createSignal(false);
  const [closing, setClosing] = createSignal(false);
  let closingTimer: ReturnType<typeof setTimeout> | undefined;

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

  function handleBackdropClick(e: MouseEvent): void {
    if (e.target === e.currentTarget) {
      options.onClose();
    }
  }

  return { mounted, closing, handleAnimationEnd, containerRef, setContainerRef, handleBackdropClick };
}
