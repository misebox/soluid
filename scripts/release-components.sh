#!/usr/bin/env bash
set -euo pipefail

BUMP="${1:-}"

# Get current version from latest components tag
CURRENT=$(git tag -l 'components-v*' --sort=-v:refname | head -1 | sed 's/components-v//')
if [ -z "$CURRENT" ]; then
  CURRENT="0.0.0"
fi

if [ -z "$BUMP" ]; then
  NEW="$CURRENT"
  TAG="components-v${NEW}"
  if git rev-parse "$TAG" >/dev/null 2>&1; then
    echo "Tag ${TAG} already exists. Specify patch|minor|major to bump." >&2
    exit 1
  fi
  echo "Releasing: ${TAG}"
else
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
  echo "Bumping: ${CURRENT} -> ${NEW}"
fi

# Create tarball from src/components/ui (includes soluid/ folder)
tar -czf components.tar.gz -C src/components/ui .
echo "Created components.tar.gz"

# Tag and push
git tag "$TAG"
git push origin HEAD --tags

# Create GitHub release with tarball
gh release create "$TAG" components.tar.gz --title "$TAG"

# Clean up
rm components.tar.gz

echo "Done: ${TAG}"
