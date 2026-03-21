#!/bin/sh

set -eu

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
REPO_ROOT="$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)"
SHARED_ROOT="${BUSTERTERMINAL_SHARED_ROOT:-$REPO_ROOT}"

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
if [ ! -d "$SHARED_ROOT" ]; then
    echo "Missing target directory: $SHARED_ROOT" >&2
    exit 1
fi

rsync -a --exclude='.htaccess' "$REPO_ROOT/dist/" "$SHARED_ROOT/"

if [ "$SHARED_ROOT" != "$REPO_ROOT" ]; then
    cp "$REPO_ROOT/.htaccess" "$SHARED_ROOT/.htaccess"
fi

printf 'Shared hosting publish complete.\n'
printf 'Source build directory: %s\n' "$REPO_ROOT/dist"
printf 'Published public root: %s\n' "$SHARED_ROOT"
