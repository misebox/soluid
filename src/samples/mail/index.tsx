import { render } from "solid-js/web";
import { MailApp } from "./App";
import "../shared.css";

const root = document.getElementById("app");
if (root) {
  render(() => <MailApp />, root);
}
