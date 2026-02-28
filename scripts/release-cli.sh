#!/usr/bin/env bash
set -euo pipefail

BUMP="${1:?Usage: $0 patch|minor|major}"

# Validate bump type
case "$BUMP" in
  patch|minor|major) ;;
  *) echo "Error: argument must be patch, minor, or major" >&2; exit 1 ;;
esac

# Read current version
CURRENT=$(node -p "require('./package.json').version")
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

# Build CLI
npm run build:cli

# Commit and tag
git add package.json package-lock.json
git commit -m "Release ${TAG}"
git tag "$TAG"
git push origin HEAD --tags

# Publish to npm
npm publish

echo "Done: ${TAG}"
