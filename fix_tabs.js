const fs = require('fs');
const path = require('path');

const studentDir = 'src/components/StudentComponents';
const adminDir = 'src/components/AdminComponents'; // Admin preview might also have it

function applyWordBreakToDangerouslySetInnerHTML(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
  
  files.forEach(f => {
    let p = path.join(dir, f);
    let c = fs.readFileSync(p, 'utf8');
    let initial = c;

    // 1. Target the specific `'& *': { lineHeight: ... }` rule used in tab content Typography
    c = c.replace(/('& \*':\s*\{\s*lineHeight:[^,}]*)(?:\s*\})/, '$1, wordBreak: "break-word", overflowWrap: "anywhere" }');
    c = c.replace(/('\s*&\s*\*\s*':\s*\{\s*lineHeight:[^,}]*)(?:\s*\})/, '$1, wordBreak: "break-word", overflowWrap: "anywhere" }');
    
    // Also catch any dangerouslySetInnerHTML wrapper that might be missing wordBreak
    // For example the main question text might lack it in some components
    
    // Also look for `word-wrap: break-word` and ensure it's `wordBreak: "break-word"`
    
    if (c !== initial) {
      fs.writeFileSync(p, c);
      console.log('Fixed Tabs Typography in', f);
    }
  });
}

applyWordBreakToDangerouslySetInnerHTML(studentDir);
applyWordBreakToDangerouslySetInnerHTML(adminDir);
console.log("Done");
