import { createComputed, createMemo, createSignal, For, on, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps, WeekStart } from "./core/types";
import { cls } from "./core/utils";

/**
 * Dates are plain `YYYY-MM-DD` strings and every calculation goes through UTC,
 * so a calendar never shifts a day because of the viewer's timezone.
 */
export interface CalendarProps extends CommonProps {
  /** Selected day as `YYYY-MM-DD` */
  value?: string;
  onChange?: (value: string) => void;
  /** Visible month as `YYYY-MM`; omit to let the calendar manage it */
  month?: string;
  onMonthChange?: (month: string) => void;
  /** Earliest and latest selectable day, inclusive */
  min?: string;
  max?: string;
  /** First column of the week (default: 0, Sunday) */
  weekStartsOn?: WeekStart;
  /** BCP 47 tag for month and weekday names (default: the browser's) */
  locale?: string;
  /** Accessible label for the grid */
  label?: string;
  previousLabel?: string;
  nextLabel?: string;
}

const DAY_MS = 86_400_000;

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function toISO(utc: number): string {
  const date = new Date(utc);
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

function startOfMonth(month: string): number {
  const [year, m] = month.split("-").map(Number);
  return Date.UTC(year, m - 1, 1);
}

function addMonths(month: string, delta: number): string {
  const [year, m] = month.split("-").map(Number);
  const shifted = new Date(Date.UTC(year, m - 1 + delta, 1));
  return `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}`;
}

export function Calendar(props: CalendarProps & Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange">) {
  const [local, others] = splitProps(props, [
    "class",
    "density",
    "value",
    "onChange",
    "month",
    "onMonthChange",
    "min",
    "max",
    "weekStartsOn",
    "locale",
    "label",
    "previousLabel",
    "nextLabel",
  ]);

  // Uncontrolled fallback: open on the selected month, else the current one.
  // `||` rather than `??` because an empty string is how a form says "no date
  // yet", and an empty month would reach Intl as an invalid date.
  // The viewer's calendar date, not the UTC one: at 08:30 in Tokyo it is
  // still yesterday in UTC.
  const now = new Date();
  const today = toISO(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const [ownMonth, setOwnMonth] = createSignal(local.value?.slice(0, 7) || today.slice(0, 7));
  // A month Intl cannot parse would reach `format` as an invalid date and throw,
  // taking the whole render tree with it.
  const month = () => {
    const candidate = local.month || ownMonth();
    return /^\d{4}-\d{2}/.test(candidate) ? candidate.slice(0, 7) : today.slice(0, 7);
  };

  const weekStart = () => local.weekStartsOn ?? 0;
  // Intl throws on a tag it cannot parse, and "en_US" is what several backends
  // emit; an unusable tag falls back to the browser's own.
  const locale = createMemo(() => {
    const tag = local.locale;
    if (tag == null) return undefined;
    try {
      new Intl.DateTimeFormat(tag);
      return tag;
    } catch {
      return undefined;
    }
  });

  // Days are looked up through this rather than the document, so two calendars
  // showing the same month do not steal each other's focus.
  let grid: HTMLDivElement | undefined;

  const monthLabel = createMemo(() =>
    new Intl.DateTimeFormat(locale(), { year: "numeric", month: "long", timeZone: "UTC" }).format(
      new Date(startOfMonth(month())),
    ),
  );

  const weekdays = createMemo(() => {
    const format = new Intl.DateTimeFormat(locale(), { weekday: "short", timeZone: "UTC" });
    // 2024-01-07 is a Sunday, so offsets from it enumerate a whole week.
    return Array.from({ length: 7 }, (_, i) => format.format(new Date(Date.UTC(2024, 0, 7 + ((i + weekStart()) % 7)))));
  });

  /**
   * Six weeks of days, so the grid height never jumps between months. Grouped
   * per week because `role="gridcell"` requires a `role="row"` parent.
   */
  const weeks = createMemo(() => {
    const first = startOfMonth(month());
    const offset = (new Date(first).getUTCDay() - weekStart() + 7) % 7;
    return Array.from({ length: 6 }, (_, week) =>
      Array.from({ length: 7 }, (_, day) => first + (week * 7 + day - offset) * DAY_MS),
    );
  });

  const isOutside = (utc: number) => toISO(utc).slice(0, 7) !== month();
  const isDisabled = (iso: string) => (local.min != null && iso < local.min) || (local.max != null && iso > local.max);

  function goToMonth(next: string): void {
    if (local.month == null) setOwnMonth(next);
    local.onMonthChange?.(next);
  }

  // A value that arrives after mount, or is picked from an adjacent month's
  // trailing days, would otherwise stay out of view.
  createComputed(
    on(
      () => local.value,
      (value) => {
        const target = value?.slice(0, 7);
        if (target && target !== month()) goToMonth(target);
      },
      { defer: true },
    ),
  );

  function select(iso: string): void {
    if (isDisabled(iso)) return;
    local.onChange?.(iso);
  }

  // The last focused day keeps the tab stop, so Shift+Tab returns to it.
  const [focused, setFocused] = createSignal<string>();

  function focusDay(target: string): void {
    // A disabled day cannot take focus: moving there would drop focus to the
    // page and, across a month boundary, strand the grid on a month with no stop.
    if (isDisabled(target)) return;
    setFocused(target);
    const targetMonth = target.slice(0, 7);
    if (targetMonth !== month()) goToMonth(targetMonth);
    // The cell may only exist after the month re-renders.
    queueMicrotask(() => grid?.querySelector<HTMLButtonElement>(`[data-so-day="${target}"]`)?.focus());
  }

  function moveFocus(from: string, deltaDays: number): void {
    const [y, m, d] = from.split("-").map(Number);
    focusDay(toISO(Date.UTC(y, m - 1, d) + deltaDays * DAY_MS));
  }

  /** The same day of the month `deltaMonths` away, clamped to that month's length. */
  function moveMonth(from: string, deltaMonths: number): void {
    const [y, m, d] = from.split("-").map(Number);
    const lastDay = new Date(Date.UTC(y, m - 1 + deltaMonths + 1, 0)).getUTCDate();
    focusDay(toISO(Date.UTC(y, m - 1 + deltaMonths, Math.min(d, lastDay))));
  }

  function handleKeyDown(iso: string, e: KeyboardEvent): void {
    const steps: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (steps[e.key] !== undefined) {
      e.preventDefault();
      moveFocus(iso, steps[e.key]);
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      const [y, m, d] = iso.split("-").map(Number);
      const weekday = (new Date(Date.UTC(y, m - 1, d)).getUTCDay() - weekStart() + 7) % 7;
      moveFocus(iso, e.key === "Home" ? -weekday : 6 - weekday);
    } else if (e.key === "PageUp" || e.key === "PageDown") {
      e.preventDefault();
      // Shift steps a year, as in the APG date picker.
      moveMonth(iso, (e.key === "PageUp" ? -1 : 1) * (e.shiftKey ? 12 : 1));
    }
  }

  /**
   * Exactly one day is a tab stop: the selection, else today, else the first
   * day the keyboard can land on. min and max can rule out the start of the
   * month, and a disabled button would leave the grid unreachable by keyboard.
   */
  const tabStop = createMemo(() => {
    const reachable = (iso: string) => iso.slice(0, 7) === month() && !isDisabled(iso);
    const current = focused();
    if (current && reachable(current)) return current;
    if (local.value && reachable(local.value)) return local.value;
    if (reachable(today)) return today;
    return weeks().flat().map(toISO).find(reachable) ?? `${month()}-01`;
  });

  return (
    <div class={cls("so-calendar", local.class)} data-density={local.density} {...others}>
      <div class="so-calendar__header">
        <button
          type="button"
          class="so-calendar__nav"
          aria-label={local.previousLabel ?? "Previous month"}
          onClick={() => goToMonth(addMonths(month(), -1))}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <polyline points="15 6 9 12 15 18" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <span class="so-calendar__title" aria-live="polite">
          {monthLabel()}
        </span>
        <button
          type="button"
          class="so-calendar__nav"
          aria-label={local.nextLabel ?? "Next month"}
          onClick={() => goToMonth(addMonths(month(), 1))}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <polyline points="9 6 15 12 9 18" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>

      <div class="so-calendar__grid" role="grid" aria-label={local.label}>
        <div class="so-calendar__weekdays" role="row">
          <For each={weekdays()}>
            {(name) => (
              <span class="so-calendar__weekday" role="columnheader">
                {name}
              </span>
            )}
          </For>
        </div>
        <div class="so-calendar__days" role="rowgroup" ref={grid}>
          <For each={weeks()}>
            {(week) => (
              <div class="so-calendar__week" role="row">
                <For each={week}>
                  {(utc) => {
                    const iso = toISO(utc);
                    return (
                      <button
                        type="button"
                        data-so-day={iso}
                        onFocus={() => setFocused(iso)}
                        class={cls(
                          "so-calendar__day",
                          isOutside(utc) && "so-calendar__day--outside",
                          iso === today && "so-calendar__day--today",
                          iso === local.value && "so-calendar__day--selected",
                        )}
                        role="gridcell"
                        aria-selected={iso === local.value}
                        aria-current={iso === today ? "date" : undefined}
                        disabled={isDisabled(iso)}
                        tabIndex={iso === tabStop() ? 0 : -1}
                        onClick={() => select(iso)}
                        onKeyDown={(e) => handleKeyDown(iso, e)}
                      >
                        {new Date(utc).getUTCDate()}
                      </button>
                    );
                  }}
                </For>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}
