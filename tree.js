const fs = require('fs');
const path = require('path');

// Folders to ignore so the output remains readable
const IGNORE_DIRS = ['node_modules', '.git', 'dist', '.next', 'build'];

function generateTree(dirPath, prefix = '') {
  let output = '';
  
  // Read the directory contents
  let files;
  try {
    files = fs.readdirSync(dirPath);
  } catch (err) {
    return `${prefix}└── [Error reading directory]\n`;
  }

  // Filter out ignored directories
  const filteredFiles = files.filter(file => !IGNORE_DIRS.includes(file));

  // Sort: directories first, then files
  filteredFiles.sort((a, b) => {
    const isDirA = fs.statSync(path.join(dirPath, a)).isDirectory();
    const isDirB = fs.statSync(path.join(dirPath, b)).isDirectory();
    if (isDirA && !isDirB) return -1;
    if (!isDirA && isDirB) return 1;
    return a.localeCompare(b);
  });

  filteredFiles.forEach((file, index) => {
    const isLast = index === filteredFiles.length - 1;
    const fullPath = path.join(dirPath, file);
    const stats = fs.statSync(fullPath);

    // Choose the correct branch characters
    const pointer = isLast ? '└── ' : '├── ';
    output += `${prefix}${pointer}${file}\n`;

    // If it's a directory, recurse into it
    if (stats.isDirectory()) {
      const extension = isLast ? '    ' : '│   ';
      output += generateTree(fullPath, prefix + extension);
    }
  });

  return output;
}

// Start execution from the current working directory
const targetDir = process.cwd(); 
const projectName = path.basename(targetDir);

console.log(`\n📁 ${projectName}`);
console.log(generateTree(targetDir));