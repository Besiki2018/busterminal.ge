#!/bin/sh

set -eu

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
REPO_ROOT="$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)"

PHP_BIN="${BUSTERTERMINAL_PHP_BINARY:-$(sh "$SCRIPT_DIR/resolve-php.sh")}"
COMPOSER_BIN="${COMPOSER_BIN:-composer}"
NPM_BIN="${NPM_BIN:-npm}"
DEPLOY_MODE="${BUSTERTERMINAL_DEPLOY_MODE:-separate-roots}"

require_file() {
    if [ ! -f "$1" ]; then
        echo "Missing required file: $1" >&2
        exit 1
    fi
}

require_command() {
    if ! command -v "$1" >/dev/null 2>&1; then
        echo "Missing required command: $1" >&2
        exit 1
    fi
}

require_command "$COMPOSER_BIN"
require_command "$NPM_BIN"
require_file "$REPO_ROOT/.env.production"
require_file "$REPO_ROOT/backend/.env"

install_node_dependencies() {
    target_dir="$1"

    if [ -f "$target_dir/package-lock.json" ]; then
        (cd "$target_dir" && "$NPM_BIN" ci)
        return
    fi

    (cd "$target_dir" && "$NPM_BIN" install)
}

echo "Using PHP binary: $PHP_BIN"

cd "$REPO_ROOT/backend"

"$COMPOSER_BIN" install --no-dev --optimize-autoloader
install_node_dependencies "$REPO_ROOT/backend"

if ! grep -Eq '^APP_KEY=.+$' "$REPO_ROOT/backend/.env"; then
    "$PHP_BIN" artisan key:generate --force
fi

"$PHP_BIN" artisan migrate --force

if [ ! -e "$REPO_ROOT/backend/public/storage" ]; then
    "$PHP_BIN" artisan storage:link
fi

"$PHP_BIN" artisan config:cache
"$PHP_BIN" artisan route:cache
"$PHP_BIN" artisan view:cache
"$NPM_BIN" run build

cd "$REPO_ROOT"

install_node_dependencies "$REPO_ROOT"
"$NPM_BIN" run build

if [ "$DEPLOY_MODE" = "shared-hosting-root" ]; then
    sh "$SCRIPT_DIR/publish-shared-hosting-root.sh"
fi

printf '\nDeploy complete.\n'
printf 'Frontend root: %s\n' "$REPO_ROOT/dist"
printf 'Backend root: %s\n' "$REPO_ROOT/backend/public"
printf 'Deploy mode: %s\n' "$DEPLOY_MODE"
printf 'If the domain still shows the host default page, update the vhost/document root and remove the placeholder index file.\n'
