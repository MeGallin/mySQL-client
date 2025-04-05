#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 Starting deep cleanup...\n');

try {
  // Kill VSCode processes
  console.log('Closing VSCode instances...');
  try {
    execSync('taskkill /F /IM code.exe', { stdio: 'ignore' });
  } catch (e) {
    // Ignore errors if VSCode is not running
  }

  // Remove VSCode workspace state
  console.log('Cleaning VSCode state...');
  const vscodePaths = ['.vscode', '.vs', '*.code-workspace'];

  vscodePaths.forEach((pattern) => {
    try {
      execSync(`find . -name "${pattern}" -type d -exec rm -rf {} +`);
    } catch (e) {
      // Ignore errors
    }
  });

  // Clean project files
  console.log('\nCleaning project files...');

  // Remove all JavaScript files from src
  execSync('find src -name "*.js" -type f -delete');
  execSync('find src -name "*.jsx" -type f -delete');

  // Remove build artifacts and dependencies
  const cleanPaths = [
    'dist',
    'build',
    'node_modules',
    '.cache',
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml',
  ];

  cleanPaths.forEach((path) => {
    try {
      execSync(`rm -rf ${path}`);
    } catch (e) {
      // Ignore errors
    }
  });

  // Reinstall dependencies
  console.log('\n📦 Reinstalling dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Run verification and rebuild
  console.log('\n🔄 Running verification and rebuild...');
  execSync('node scripts/verify-and-start.js', { stdio: 'inherit' });

  console.log('\n✨ Cleanup complete!');
  console.log('\nPlease restart VSCode and run:');
  console.log('npm run dev');
} catch (error) {
  console.error('\n❌ Error during cleanup:', error);
  process.exit(1);
}
