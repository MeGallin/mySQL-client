#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function listFiles(dir, indent = '') {
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      console.log(`${indent}📁 ${item}/`);
      listFiles(fullPath, indent + '  ');
    } else {
      console.log(`${indent}📄 ${item}`);
    }
  });
}

console.log('\n📦 Project Structure:\n');
listFiles(path.join(process.cwd(), 'src'));
