#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to delete .vscode state files
function cleanVSCodeState() {
  const vscodePath = path.join(process.cwd(), '.vscode');
  if (fs.existsSync(vscodePath)) {
    console.log('Cleaning .vscode state...');
    execSync(`rm -rf "${vscodePath}"`);
  }
}

// Function to ensure all files are TypeScript
function ensureTypeScript() {
  const srcPath = path.join(process.cwd(), 'src');

  // Rename any remaining .js/.jsx files to .ts/.tsx
  function processDirectory(dir) {
    const items = fs.readdirSync(dir);

    items.forEach((item) => {
      const fullPath = path.join(dir, item);

      if (fs.statSync(fullPath).isDirectory()) {
        processDirectory(fullPath);
        return;
      }

      if (item.endsWith('.jsx')) {
        const newPath = fullPath.replace('.jsx', '.tsx');
        if (fs.existsSync(newPath)) {
          fs.unlinkSync(fullPath);
        } else {
          fs.renameSync(fullPath, newPath);
        }
      } else if (item.endsWith('.js')) {
        const newPath = fullPath.replace('.js', '.ts');
        if (fs.existsSync(newPath)) {
          fs.unlinkSync(fullPath);
        } else {
          fs.renameSync(fullPath, newPath);
        }
      }
    });
  }

  processDirectory(srcPath);
}

// Main execution
console.log('🧹 Cleaning up project state...\n');

// 1. Clean VSCode state
cleanVSCodeState();

// 2. Ensure all files are TypeScript
ensureTypeScript();

// 3. Remove node_modules and reinstall
console.log('\n📦 Reinstalling dependencies...');
execSync('rm -rf node_modules package-lock.json');
execSync('npm install');

console.log('\n✨ Done! Please restart VSCode.');
