#!/usr/bin/env bash
set -euo pipefail

# Requirements:
# - gh installed and authenticated
#   https://cli.github.com/
# - or set GH_TOKEN with a PAT that has repo write access
# - git installed

if [[ -n "${GH_TOKEN:-}" ]]; then
  export GH_TOKEN
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) is required."
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Not authenticated to GitHub."
  echo "Run: gh auth login"
  echo "or export GH_TOKEN=your_pat_here"
  exit 1
fi

git config --global user.name "mobconnect"
git config --global user.email "your-email@example.com"

REPOS=(
  "mobconnect/AutoVault"
  "mobconnect/Editah"
  "mobconnect/MAKEITHUP"
  "mobconnect/SafetyAware-"
  "mobconnect/Tosser"
  "mobconnect/JUMBUNNAJARJUM"
)

WORKFLOW_CONTENT=$(cat <<'YAML'
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build app
        run: npm run build

      - name: Upload static build
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
YAML
)

for repo in "${REPOS[@]}"; do
  echo "Processing $repo"

  dir=$(mktemp -d)
  git clone --depth 1 "https://github.com/${repo}.git" "$dir" >/dev/null 2>&1 || {
    echo "Failed to clone $repo"
    continue
  }

  cd "$dir"

  mkdir -p .github/workflows
  if [ -f .github/workflows/deploy-pages.yml ]; then
    echo "Workflow already exists in $repo"
    cd /tmp
    rm -rf "$dir"
    continue
  fi

  printf '%s\n' "$WORKFLOW_CONTENT" > .github/workflows/deploy-pages.yml

  git add .github/workflows/deploy-pages.yml
  git commit -m "Add GitHub Pages deployment workflow" >/dev/null 2>&1 || true
  git push >/dev/null 2>&1 || true

  echo "Done: $repo"

  cd /tmp
  rm -rf "$dir"
done

echo "All done."
