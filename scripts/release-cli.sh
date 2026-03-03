#!/usr/bin/env bash
set -euo pipefail

# Verify npm login before doing any work
if ! npm whoami >/dev/null 2>&1; then
  echo "Not logged in to npm. Run: npm login" >&2
  exit 1
fi

BUMP="${1:-}"
CURRENT=$(node -p "require('./package.json').version")

if [ -z "$BUMP" ]; then
  NEW="$CURRENT"
  TAG="v${NEW}"
  echo "Releasing version: ${NEW}"
else
  # Validate bump type
  case "$BUMP" in
    patch|minor|major) ;;
    *) echo "Error: argument must be patch, minor, or major" >&2; exit 1 ;;
  esac

  IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT"
  case "$BUMP" in
    patch) PATCH=$((PATCH + 1)) ;;
    minor) MINOR=$((MINOR + 1)); PATCH=0 ;;
    major) MAJOR=$((MAJOR + 1)); MINOR=0; PATCH=0 ;;
  esac

  NEW="${MAJOR}.${MINOR}.${PATCH}"
  TAG="v${NEW}"

  echo "Bumping version: ${CURRENT} -> ${NEW}"

  # Update package.json
  node -e "
  const fs = require('fs');
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  pkg.version = '${NEW}';
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
  "

  git add package.json package-lock.json
  git commit -m "Release ${TAG}"
fi

# Build CLI
bun run build:cli

# Tag and push (skip if tag already exists)
if git rev-parse "$TAG" >/dev/null 2>&1; then
  echo "Tag ${TAG} already exists, skipping tag/push"
else
  git tag "$TAG"
  git push origin HEAD --tags
fi

# Publish to npm
npm publish

echo "Done: ${TAG}"
