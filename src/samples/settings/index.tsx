import { render } from "solid-js/web";
import { SettingsApp } from "./App";
import "../shared.css";

const root = document.getElementById("app");
if (root) {
  render(() => <SettingsApp />, root);
}
