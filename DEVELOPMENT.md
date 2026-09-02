## Setup

```sh
bun install                  # install dependencies
sh bin/setup-hooks.sh        # install git hooks (pre-commit, pre-push)
```

## Development

```sh
bun run dev                  # start catalog dev server (localhost:5173)
bun run typecheck            # type check
bun run lint                 # lint (oxlint)
bun run fmt                  # format (oxfmt)
bun run audit                # audit components (see below)
bun run generate:api         # regenerate API data from component Props
bun run build:catalog        # build catalog site to docs/
bun run build:cli            # build CLI to dist/
```

## Component audit

`bun run audit` statically checks every component against the rules in
`scripts/audit-components.ts`. It parses the component `.tsx` / `.css`, the CLI
registry, `src/index.ts` and the catalog metadata, then reports findings grouped
by rule. Errors fail the command; warnings do not unless `--strict` is passed.

```sh
bun run audit                       # full report
bun run audit -- --rule solid       # only rules whose id contains "solid"
bun run audit -- --json             # machine-readable findings
bun run audit -- --strict           # warnings fail too
```

Rule groups:

| Prefix | Checks |
| --- | --- |
| `registry/` | Registry files exist, nothing is orphaned, imports match declared dependencies |
| `api/` | Every exported component and props type reaches `src/index.ts` |
| `solid/` | Reactivity pitfalls: props destructuring, discarded `splitProps` rest, early returns, SSR-unstable ids, uncleaned effect listeners |
| `a11y/` | Explicit `<button type>`, redundant roles, hardcoded labels, keyboard-unreachable click targets |
| `css/` | No CSS imports in `.tsx`, `--so-*` tokens defined and used, `so-` class namespacing, `src/soluid-all.css` lists every component stylesheet |
| `catalog/` | Every installable component is listed, demoed and described in both locales |

Add a rule by appending to the relevant array in `scripts/audit-components.ts`;
each rule is a `{ id, level, summary, check }` object over a shared parsed context.
