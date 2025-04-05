#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const srcDir = path.join(process.cwd(), 'src');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function checkDirectory(dir) {
  const items = fs.readdirSync(dir);
  let hasIssues = false;

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      const subDirIssues = checkDirectory(fullPath);
      hasIssues = hasIssues || subDirIssues;
    } else {
      // Check for JavaScript files
      if (item.endsWith('.js') || item.endsWith('.jsx')) {
        console.log(
          `${colors.red}Found JavaScript file: ${path.relative(
            process.cwd(),
            fullPath,
          )}${colors.reset}`,
        );
        hasIssues = true;
      }

      // Check for TypeScript files
      if (item.endsWith('.ts') || item.endsWith('.tsx')) {
        console.log(
          `${colors.green}Found TypeScript file: ${path.relative(
            process.cwd(),
            fullPath,
          )}${colors.reset}`,
        );
      }
    }
  });

  return hasIssues;
}

console.log('\n🔍 Checking project files...\n');

const hasIssues = checkDirectory(srcDir);

if (hasIssues) {
  console.log(
    `\n${colors.red}❌ Found JavaScript files that should be TypeScript${colors.reset}`,
  );
  console.log('\nTrying to fix issues...');

  try {
    // Remove any JavaScript files
    execSync('find src -name "*.js" -type f -delete');
    execSync('find src -name "*.jsx" -type f -delete');

    console.log(
      `\n${colors.green}✅ Cleaned up JavaScript files${colors.reset}`,
    );
  } catch (error) {
    console.error(
      `\n${colors.red}Failed to clean up files:${colors.reset}`,
      error,
    );
  }
} else {
  console.log(`\n${colors.green}✅ All files are TypeScript${colors.reset}`);
}

// Check if all necessary TypeScript files exist
const requiredFiles = [
  'src/App.tsx',
  'src/main.tsx',
  'src/vite-env.d.ts',
  'src/types/index.ts',
  'src/context/AuthContext.tsx',
  'src/services/taskService.ts',
  'src/components/Layout.tsx',
  'src/components/ProtectedRoute.tsx',
  'src/components/TaskDialog.tsx',
  'src/pages/Login.tsx',
  'src/pages/Register.tsx',
  'src/pages/TaskList.tsx',
  'src/pages/TaskDetail.tsx',
  'src/routes/index.tsx',
];

console.log('\n🔍 Checking for required TypeScript files...\n');

const missingFiles = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(process.cwd(), file)),
);

if (missingFiles.length > 0) {
  console.log(`${colors.yellow}⚠️ Missing TypeScript files:${colors.reset}`);
  missingFiles.forEach((file) => {
    console.log(`   ${colors.yellow}${file}${colors.reset}`);
  });
} else {
  console.log(
    `${colors.green}✅ All required TypeScript files present${colors.reset}`,
  );
}

console.log('\n');
