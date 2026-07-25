import { Route, Router } from "@solidjs/router";
import { Layout } from "./Layout";
import { ComponentsPage } from "./pages/ComponentsPage";
import { GettingStartedPage } from "./pages/GettingStartedPage";
import { TopPage } from "./pages/TopPage";
import "../soluid-all.css";
import "./catalog.css";

export function App() {
  return (
    <Router base="/soluid" root={Layout}>
      <Route path="/" component={TopPage} />
      <Route path="/getting-started" component={GettingStartedPage} />
      <Route path="/components" component={ComponentsPage} />
    </Router>
  );
}
