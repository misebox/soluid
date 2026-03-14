#!/usr/bin/env bash
set -euo pipefail

# Check if cli/ or src/ have changed since their last release tag.
# Exit 0 = no release needed, Exit 1 = release needed (or error).

CLI_TAG=$(git tag -l 'v*' --sort=-v:refname | head -1)
COMP_TAG=$(git tag -l 'components-v*' --sort=-v:refname | head -1)

needs_release=0

echo "=== CLI (npm package) ==="
if [ -z "$CLI_TAG" ]; then
  echo "  No release tag found. First release needed."
  needs_release=1
else
  cli_changes=$(git diff --name-only "$CLI_TAG"..HEAD -- cli/ package.json | head -20)
  if [ -n "$cli_changes" ]; then
    echo "  Last release: $CLI_TAG"
    echo "  Changed since:"
    echo "$cli_changes" | sed 's/^/    /'
    needs_release=1
  else
    echo "  Last release: $CLI_TAG — no changes"
  fi
fi

echo ""
echo "=== Components (GitHub release) ==="
if [ -z "$COMP_TAG" ]; then
  echo "  No release tag found. First release needed."
  needs_release=1
else
  comp_changes=$(git diff --name-only "$COMP_TAG"..HEAD -- src/components/ | head -20)
  if [ -n "$comp_changes" ]; then
    echo "  Last release: $COMP_TAG"
    echo "  Changed since:"
    echo "$comp_changes" | sed 's/^/    /'
    needs_release=1
  else
    echo "  Last release: $COMP_TAG — no changes"
  fi
fi

exit $needs_release
