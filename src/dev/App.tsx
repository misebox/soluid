import { Route, Router } from "@solidjs/router";
import { Layout } from "./Layout";
import { ChangelogPage } from "./pages/ChangelogPage";
import { ComponentsPage } from "./pages/ComponentsPage";
import { GettingStartedPage } from "./pages/GettingStartedPage";
import { SamplesPage } from "./pages/SamplesPage";
import { TopPage } from "./pages/TopPage";
import "../soluid-all.css";
import "./catalog.css";

export function App() {
  return (
    <Router base="/soluid" root={Layout}>
      <Route path="/" component={TopPage} />
      <Route path="/getting-started" component={GettingStartedPage} />
      <Route path="/components" component={ComponentsPage} />
      <Route path="/samples" component={SamplesPage} />
      <Route path="/changelog" component={ChangelogPage} />
    </Router>
  );
}
