#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const srcDir = path.join(process.cwd(), 'src');

// Function to verify project structure
function verifyProject() {
  console.log('🔍 Verifying project structure...\n');

  // Check if all required directories exist
  const requiredDirs = [
    'src/components',
    'src/context',
    'src/pages',
    'src/services',
    'src/types',
    'src/routes',
  ];

  const missingDirs = requiredDirs.filter(
    (dir) => !fs.existsSync(path.join(process.cwd(), dir)),
  );

  if (missingDirs.length > 0) {
    console.error('❌ Missing directories:', missingDirs);
    return false;
  }

  // Check if all required files exist and are TypeScript
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
    'src/index.css',
  ];

  const missingFiles = requiredFiles.filter(
    (file) => !fs.existsSync(path.join(process.cwd(), file)),
  );

  if (missingFiles.length > 0) {
    console.error('❌ Missing files:', missingFiles);
    return false;
  }

  // Check for any remaining JavaScript files
  const jsFiles = [];
  function findJsFiles(dir) {
    const items = fs.readdirSync(dir);
    items.forEach((item) => {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        findJsFiles(fullPath);
      } else if (item.endsWith('.js') || item.endsWith('.jsx')) {
        jsFiles.push(path.relative(process.cwd(), fullPath));
      }
    });
  }
  findJsFiles(srcDir);

  if (jsFiles.length > 0) {
    console.error('❌ Found JavaScript files:', jsFiles);
    return false;
  }

  console.log('✅ Project structure verified\n');
  return true;
}

// Main execution
try {
  if (!verifyProject()) {
    console.log('🔄 Running rebuild script...\n');
    execSync('node scripts/rebuild-project.js', { stdio: 'inherit' });
  } else {
    console.log('🚀 Starting development server...\n');
    execSync('npm run dev', { stdio: 'inherit' });
  }
} catch (error) {
  console.error('❌ Error:', error);
  process.exit(1);
}
