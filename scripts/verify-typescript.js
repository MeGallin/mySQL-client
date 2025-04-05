#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths to check
const srcDir = path.join(process.cwd(), 'src');

// Function to recursively get all files
function getAllFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      files.push(...getAllFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  });

  return files;
}

// Main execution
console.log('🔍 Verifying TypeScript setup...\n');

// 1. Check for any remaining .js/.jsx files
const allFiles = getAllFiles(srcDir);
const jsFiles = allFiles.filter((file) => /\.(js|jsx)$/.test(file));

if (jsFiles.length > 0) {
  console.log('❌ Found JavaScript files that should be TypeScript:');
  jsFiles.forEach((file) => {
    console.log(`   ${path.relative(process.cwd(), file)}`);
  });
} else {
  console.log('✅ No JavaScript files found in src/');
}

// 2. Verify TypeScript compilation
try {
  console.log('\n🔨 Running TypeScript compilation check...');
  execSync('tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ TypeScript compilation successful');
} catch (error) {
  console.log('❌ TypeScript compilation failed');
  process.exit(1);
}

// 3. Run ESLint
try {
  console.log('\n🔍 Running ESLint...');
  execSync('eslint src --ext .ts,.tsx', { stdio: 'inherit' });
  console.log('✅ ESLint check passed');
} catch (error) {
  console.log('❌ ESLint check failed');
  process.exit(1);
}

console.log('\n✨ All checks completed!');
