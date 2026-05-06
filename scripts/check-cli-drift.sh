#!/usr/bin/env bash
set -euo pipefail

# Check if cli/ or package.json have changed since the last remote CLI release tag.
# Exit 0 = no changes, Exit 1 = unreleased changes.

TAG=$(git ls-remote --tags origin 'refs/tags/v*' 2>/dev/null \
  | sed 's|.*refs/tags/||' | grep -v '\^{}' | sort -V | tail -1)

if [ -z "$TAG" ]; then
  echo "CLI: No release tag found. First release needed."
  exit 1
fi

changes=$(git diff --name-only "$TAG"..HEAD -- cli/ package.json 2>/dev/null | head -20)
if [ -n "$changes" ]; then
  echo "CLI: Last release $TAG — unreleased changes:"
  echo "$changes" | sed 's/^/  /'
  exit 1
fi

echo "CLI: $TAG — no changes"
