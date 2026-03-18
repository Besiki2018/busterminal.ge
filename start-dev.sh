#!/bin/zsh

SCRIPT_DIR="$(cd -- "$(dirname -- "$0")" && pwd)"

cd "$SCRIPT_DIR" || exit 1

echo "Starting Laravel backend on http://127.0.0.1:8000"
osascript -e "tell application \"Terminal\" to do script \"cd '$SCRIPT_DIR' && npm run backend:dev\""

echo "Starting SEO preview frontend on http://localhost:8080"
npm run dev
