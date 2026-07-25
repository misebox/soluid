import { render } from "solid-js/web";
import { DashboardApp } from "./App";
import "../shared.css";
import "./dashboard.css";

const root = document.getElementById("app");
if (root) {
  render(() => <DashboardApp />, root);
}
