import { describe, expect, test } from "vitest";
import type { RegistryEntry } from "../registry.js";
import { allComponentNames, collectNpmDeps, registry, resolveDependencies } from "../registry.js";

describe("registry", () => {
  test("all entries have required fields", () => {
    for (const [key, entry] of Object.entries(registry) as [string, RegistryEntry][]) {
      expect(entry.name).toBe(key);
      expect(entry.files.length).toBeGreaterThan(0);
      expect(entry.description).toBeTruthy();
    }
  });

  test("core is always included in resolved dependencies", () => {
    const resolved = resolveDependencies(["Button"]);
    expect(resolved[0]).toBe("core");
  });

  test("resolves transitive dependencies", () => {
    const resolved = resolveDependencies(["TextField"]);
    expect(resolved).toContain("core");
    expect(resolved).toContain("FormField");
    expect(resolved).toContain("TextField");
  });

  test("deduplicates dependencies", () => {
    const resolved = resolveDependencies(["TextField", "TextArea"]);
    const counts: Record<string, number> = {};
    for (const name of resolved) {
      counts[name] = (counts[name] ?? 0) + 1;
    }
    for (const count of Object.values(counts)) {
      expect(count).toBe(1);
    }
  });

  test("collects npm dependencies", () => {
    expect(collectNpmDeps(["Menu"])).toContain("@floating-ui/dom");
    // core is plain Solid; a component that needs nothing contributes nothing.
    expect(collectNpmDeps(["core"])).toEqual([]);
  });

  test("allComponentNames excludes core", () => {
    const names = allComponentNames();
    expect(names).not.toContain("core");
    expect(names.length).toBeGreaterThan(0);
  });
});
