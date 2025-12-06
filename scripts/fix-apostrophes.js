const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all TSX files
const files = glob.sync('**/*.tsx', {
  ignore: ['node_modules/**', '.next/**', 'dist/**', 'build/**']
});

let totalFixed = 0;
let totalFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  
  // Replace apostrophes in JSX text content (between > and <)
  // This regex finds text between tags that contains apostrophes
  content = content.replace(/>([^<>]*)'([^<>]*)</g, (match, before, after) => {
    // Don't replace if it's inside a JavaScript expression
    if (before.includes('{') || after.includes('}')) {
      return match;
    }
    return `>${before}&apos;${after}<`;
  });
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    totalFiles++;
    const fixes = (original.match(/>/g) || []).length - (content.match(/>/g) || []).length;
    totalFixed += Math.abs(fixes);
    console.log(`✓ Fixed ${file}`);
  }
});

console.log(`\n✓ Fixed ${totalFixed} apostrophes in ${totalFiles} files`);
