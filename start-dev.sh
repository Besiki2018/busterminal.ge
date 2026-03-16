#!/bin/zsh

cd /Users/besikiekseulidze/web-development/busterminal.ge || exit 1

echo "Starting Laravel backend on http://127.0.0.1:8000"
osascript -e 'tell application "Terminal" to do script "cd /Users/besikiekseulidze/web-development/busterminal.ge && npm run backend:dev"'

echo "Starting Vite frontend on http://localhost:8080"
npm run dev
