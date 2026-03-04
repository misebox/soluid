#!/bin/sh

echo "Running build:catalog..."
bun run build:catalog > /dev/null 2>&1

if ! git diff --quiet docs/ src/dev/soluid-all.css src/dev/api-data.json; then
  echo ""
  echo "ERROR: Build output has changed. Uncommitted files:"
  git diff --name-only docs/ src/dev/soluid-all.css src/dev/api-data.json
  echo ""
  echo "Run 'bun run build:catalog' and commit the changes before pushing."
  exit 1
fi

echo "Build output is up to date."
