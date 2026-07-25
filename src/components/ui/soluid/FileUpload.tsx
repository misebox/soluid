import { createSignal, For, Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";

export interface FileUploadProps extends CommonProps {
  onSelect: (files: File[]) => void;
  /** Accept attribute forwarded to the file input, e.g. "image/*" */
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  /** Instruction shown inside the drop zone */
  label?: string;
  /** Secondary text under the instruction */
  hint?: string;
  /** Files to list under the drop zone */
  files?: File[];
  onRemove?: (file: File, index: number) => void;
  /** Accessible label for a file's remove button (default: `Remove {name}`) */
  removeLabel?: (file: File) => string;
}

/** Renders a byte count as a short human-readable size. */
function formatSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }
  return `${size < 10 && unit > 0 ? size.toFixed(1) : Math.round(size)} ${units[unit]}`;
}

export function FileUpload(props: FileUploadProps & Omit<JSX.HTMLAttributes<HTMLDivElement>, "onSelect">) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "onSelect",
    "accept",
    "multiple",
    "disabled",
    "label",
    "hint",
    "files",
    "onRemove",
    "removeLabel",
  ]);

  const [dragging, setDragging] = createSignal(false);

  function emit(list: FileList | null): void {
    const files = Array.from(list ?? []);
    if (files.length > 0) local.onSelect(files);
  }

  function handleDrop(e: DragEvent): void {
    e.preventDefault();
    setDragging(false);
    if (!local.disabled) emit(e.dataTransfer?.files ?? null);
  }

  function handleDragOver(e: DragEvent): void {
    e.preventDefault();
    if (!local.disabled) setDragging(true);
  }

  return (
    <div class={cls("so-file-upload", local.class)} data-density={local.density} {...others}>
      {/* A <label> wrapping the input keeps the whole zone clickable while the
          input itself stays the focusable, keyboard-operable control. */}
      <label
        class={cls(
          "so-file-upload__zone",
          dragging() && "so-file-upload__zone--dragging",
          local.disabled && "so-file-upload__zone--disabled",
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragging(false)}
      >
        <input
          class="so-file-upload__input"
          type="file"
          accept={local.accept}
          multiple={local.multiple}
          disabled={local.disabled}
          onChange={(e) => {
            emit(e.currentTarget.files);
            // Allow selecting the same file twice in a row.
            e.currentTarget.value = "";
          }}
        />
        <svg class="so-file-upload__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M4 16v2.5A1.5 1.5 0 005.5 20h13a1.5 1.5 0 001.5-1.5V16"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span class="so-file-upload__label">{local.label}</span>
        <Show when={local.hint}>
          <span class="so-file-upload__hint">{local.hint}</span>
        </Show>
      </label>

      <Show when={local.files?.length}>
        <ul class="so-file-upload__list">
          <For each={local.files}>
            {(file, i) => (
              <li class="so-file-upload__file">
                <span class="so-file-upload__name">{file.name}</span>
                <span class="so-file-upload__size">{formatSize(file.size)}</span>
                <Show when={local.onRemove}>
                  <button
                    type="button"
                    class="so-file-upload__remove"
                    aria-label={local.removeLabel?.(file) ?? `Remove ${file.name}`}
                    onClick={() => local.onRemove?.(file, i())}
                  >
                    &#x2715;
                  </button>
                </Show>
              </li>
            )}
          </For>
        </ul>
      </Show>
    </div>
  );
}
