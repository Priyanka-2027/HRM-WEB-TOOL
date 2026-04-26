const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      // Replace instances of dark:CLASSNAME with nothing
      content = content.replace(/\s*dark:[a-zA-Z0-9_/[\]\-#.]+/g, '');
      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

// processDir('./src');
let txt = '<p className="text-xl font-black text-slate-900 dark:text-white mb-2 leading-none">TEST</p>';
console.log(txt.replace(/\s*dark:[a-zA-Z0-9_/[\]\-#.]+/g, ''));
