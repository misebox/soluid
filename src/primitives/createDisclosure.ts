import { createSignal, createUniqueId } from "solid-js";
import type { Accessor } from "solid-js";

export interface DisclosureOptions {
  /** Initial open state (uncontrolled) */
  defaultOpen?: boolean;
  /** Controlled open state */
  isOpen?: Accessor<boolean>;
  /** Called when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** ID prefix for aria linking */
  id?: string;
}

export interface DisclosureReturn {
  isOpen: Accessor<boolean>;
  open: () => void;
  close: () => void;
  toggle: () => void;
  triggerProps: {
    "aria-expanded": Accessor<boolean>;
    "aria-controls": string;
    onClick: () => void;
  };
  contentProps: {
    id: string;
    role: string;
  };
}

export function createDisclosure(
  options: DisclosureOptions = {},
): DisclosureReturn {
  const id = options.id ?? createUniqueId();
  const contentId = `soui-disclosure-${id}`;

  const [internalOpen, setInternalOpen] = createSignal(
    options.defaultOpen ?? false,
  );

  const isOpen: Accessor<boolean> = options.isOpen ?? internalOpen;

  function setOpen(value: boolean): void {
    if (!options.isOpen) {
      setInternalOpen(value);
    }
    options.onOpenChange?.(value);
  }

  function open(): void {
    setOpen(true);
  }

  function close(): void {
    setOpen(false);
  }

  function toggle(): void {
    setOpen(!isOpen());
  }

  return {
    isOpen,
    open,
    close,
    toggle,
    triggerProps: {
      "aria-expanded": isOpen,
      "aria-controls": contentId,
      onClick: toggle,
    },
    contentProps: {
      id: contentId,
      role: "region",
    },
  };
}
