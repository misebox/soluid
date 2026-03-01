#!/usr/bin/env bash
set -euo pipefail

BUMP="${1:-}"
CURRENT=$(node -p "require('./package.json').componentsVersion")

if [ -z "$BUMP" ]; then
  # No argument: release current version if tag doesn't exist
  NEW="$CURRENT"
  TAG="components-v${NEW}"
  if git rev-parse "$TAG" >/dev/null 2>&1; then
    echo "Tag ${TAG} already exists. Specify patch|minor|major to bump." >&2
    exit 1
  fi
  echo "Releasing componentsVersion: ${NEW}"
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
  TAG="components-v${NEW}"

  echo "Bumping componentsVersion: ${CURRENT} -> ${NEW}"

  # Update package.json
  node -e "
  const fs = require('fs');
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  pkg.componentsVersion = '${NEW}';
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
  "

  git add package.json
  git commit -m "Release ${TAG}"
fi

# Create tarball from src/
tar -czf components.tar.gz -C src .
echo "Created components.tar.gz"

# Tag and push
git tag "$TAG"
git push origin HEAD --tags

# Create GitHub release with tarball
gh release create "$TAG" components.tar.gz --title "$TAG"

# Clean up
rm components.tar.gz
echo "Done: ${TAG}"
