import { splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "./core/types";
import { cls } from "./core/utils";

export interface CardProps extends CommonProps {
  variant?: "outlined" | "elevated";
  children: JSX.Element;
}

export interface CardHeaderProps {
  class?: string;
  children: JSX.Element;
}

export interface CardBodyProps {
  class?: string;
  children: JSX.Element;
}

export interface CardFooterProps {
  class?: string;
  children: JSX.Element;
}

export function Card(props: CardProps) {
  const [local, others] = splitProps(props, ["class", "density", "variant", "children"]);

  return (
    <div
      class={cls(
        "so-card",
        local.variant === "elevated" && "so-card--elevated",
        local.class,
      )}
      data-density={local.density}
      {...others}
    >
      {local.children}
    </div>
  );
}

export function CardHeader(props: CardHeaderProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div class={cls("so-card__header", local.class)} {...others}>
      {local.children}
    </div>
  );
}

export function CardBody(props: CardBodyProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div class={cls("so-card__body", local.class)} {...others}>
      {local.children}
    </div>
  );
}

export function CardFooter(props: CardFooterProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div class={cls("so-card__footer", local.class)} {...others}>
      {local.children}
    </div>
  );
}
