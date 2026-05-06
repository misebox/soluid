#!/usr/bin/env bash
set -euo pipefail

# Check if src/components/ has changed since the last remote components release tag.
# Exit 0 = no changes, Exit 1 = unreleased changes.

TAG=$(git ls-remote --tags origin 'refs/tags/components-v*' 2>/dev/null \
  | sed 's|.*refs/tags/||' | grep -v '\^{}' | sort -V | tail -1)

if [ -z "$TAG" ]; then
  echo "Components: No release tag found. First release needed."
  exit 1
fi

changes=$(git diff --name-only "$TAG"..HEAD -- src/components/ 2>/dev/null | head -20)
if [ -n "$changes" ]; then
  echo "Components: Last release $TAG — unreleased changes:"
  echo "$changes" | sed 's/^/  /'
  exit 1
fi

echo "Components: $TAG — no changes"
