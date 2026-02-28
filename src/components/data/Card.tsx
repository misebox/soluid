import { splitProps } from "solid-js";
import type { JSX } from "solid-js";
import type { CommonProps } from "../../core/types";
import { cls } from "../../core/utils";
import "./Card.css";

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
        "soui-card",
        local.variant === "elevated" && "soui-card--elevated",
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
    <div class={cls("soui-card__header", local.class)} {...others}>
      {local.children}
    </div>
  );
}

export function CardBody(props: CardBodyProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div class={cls("soui-card__body", local.class)} {...others}>
      {local.children}
    </div>
  );
}

export function CardFooter(props: CardFooterProps) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <div class={cls("soui-card__footer", local.class)} {...others}>
      {local.children}
    </div>
  );
}
