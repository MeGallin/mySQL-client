#!/bin/bash

echo "🔄 Restarting development environment..."

# Kill VSCode processes
echo "Closing VSCode..."
taskkill /F /IM code.exe 2>/dev/null || true

# Remove VSCode state
echo "Cleaning VSCode state..."
rm -rf .vscode
rm -rf *.code-workspace

# Clean build artifacts
echo "Cleaning build artifacts..."
rm -rf dist
rm -rf .cache
rm -rf node_modules/.vite

# Remove any remaining JavaScript files
echo "Removing JavaScript files..."
find src -name "*.js" -type f -delete
find src -name "*.jsx" -type f -delete

echo "✨ Cleanup complete!"
echo "Please:"
echo "1. Close VSCode"
echo "2. Reopen VSCode in this directory"
echo "3. Run: npm run dev"
