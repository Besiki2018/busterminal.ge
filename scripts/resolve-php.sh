#!/bin/sh

set -eu

has_intl() {
  "$1" -m 2>/dev/null | grep -qx 'intl'
}

resolve_candidate() {
  candidate="$1"

  if [ -z "$candidate" ]; then
    return 1
  fi

  if command -v "$candidate" >/dev/null 2>&1; then
    command -v "$candidate"
    return 0
  fi

  if [ -x "$candidate" ]; then
    printf '%s\n' "$candidate"
    return 0
  fi

  return 1
}

if [ -n "${BUSTERTERMINAL_PHP_BINARY:-}" ]; then
  resolved="$(resolve_candidate "${BUSTERTERMINAL_PHP_BINARY}")" || {
    echo "BUSTERTERMINAL_PHP_BINARY is not executable: ${BUSTERTERMINAL_PHP_BINARY}" >&2
    exit 1
  }

  printf '%s\n' "$resolved"
  exit 0
fi

for candidate in \
  php \
  php8.4 \
  php8.3 \
  /opt/homebrew/opt/php@8.4/bin/php \
  /opt/homebrew/opt/php@8.3/bin/php \
  /opt/homebrew/opt/php/bin/php \
  /usr/local/opt/php@8.4/bin/php \
  /usr/local/opt/php@8.3/bin/php \
  /usr/local/opt/php/bin/php \
  /usr/bin/php
do
  resolved="$(resolve_candidate "$candidate")" || continue

  if has_intl "$resolved"; then
    printf '%s\n' "$resolved"
    exit 0
  fi
done

resolved="$(resolve_candidate "php")" || {
  echo "No PHP binary found. Install PHP or set BUSTERTERMINAL_PHP_BINARY." >&2
  exit 1
}

printf '%s\n' "$resolved"
