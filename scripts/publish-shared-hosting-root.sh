#!/bin/sh

set -eu

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
REPO_ROOT="$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)"

require_command() {
    if ! command -v "$1" >/dev/null 2>&1; then
        echo "Missing required command: $1" >&2
        exit 1
    fi
}

require_file() {
    if [ ! -f "$1" ]; then
        echo "Missing required file: $1" >&2
        exit 1
    fi
}

require_command rsync
require_file "$REPO_ROOT/.htaccess"
require_file "$REPO_ROOT/dist/index.html"

rsync -a --exclude='.htaccess' "$REPO_ROOT/dist/" "$REPO_ROOT/"

printf 'Shared hosting publish complete.\n'
printf 'Public root now serves build artifacts from: %s\n' "$REPO_ROOT/dist"
