import { render } from "solid-js/web";
import { ShopApp } from "./App";
import "../shared.css";

const root = document.getElementById("app");
if (root) {
  render(() => <ShopApp />, root);
}
