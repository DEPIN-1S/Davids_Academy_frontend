const fs = require('fs');
const path = require('path');

const studentDir = 'src/components/StudentComponents';
const adminDir = 'src/components/AdminComponents';

function applyWordBreakAll(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
  
  files.forEach(f => {
    let p = path.join(dir, f);
    let c = fs.readFileSync(p, 'utf8');
    let initial = c;

    // First try replacing near lineHeight
    c = c.replace(/((['"]&\s*\*\s*['"])\s*:\s*\{\s*lineHeight\s*:\s*[^,\}]+)([\},])/g, '$1, wordBreak: "break-word", overflowWrap: "anywhere" $3');
    
    // Some don't even have '& *' in Typography for tabs. Example: MCQQuestionComponent
    // Let's look for `<Typography ... dangerouslySetInnerHTML={{ __html: active?.tabValue || ...`
    // We can inject `wordBreak: "break-word", overflowWrap: "anywhere"` into `sx={{`
    
    // Replace: `<Typography sx={{ color: "#333", fontSize: "0.95rem" }} dangerouslySetInnerHTML=`
    // With: `<Typography sx={{ color: "#333", fontSize: "0.95rem", wordBreak: "break-word", overflowWrap: "anywhere" }} dangerouslySetInnerHTML=`
    
    c = c.replace(/(<Typography\s+sx=\{\{\s*[^}]*)(\s*\}\}\s*(?:variant="[^"]*"\s*)?dangerouslySetInnerHTML=\{\{\s*__html:\s*(?:active\?\.tabValue|[^}]*tabValue)[^}]*\}\})/g, '$1, wordBreak: "break-word", overflowWrap: "anywhere"$2');

    // Also let's fix the RevealAnswerComponent explanation paragraphs
    // <Typography... dangerouslySetInnerHTML={{ __html: para }} />
    // we want to add wordBreak to its sx if it exists, or add sx if not.
    if (f === 'RevealAnswerComponent.js') {
      c = c.replace(/(dangerouslySetInnerHTML=\{\{\s*__html:\s*(?:explanationHeading|para|additionalInfoHeading)\s*\}\})/g, 'style={{ wordBreak: "break-word", overflowWrap: "anywhere" }} $1');
    }

    if (c !== initial) {
      fs.writeFileSync(p, c);
      console.log('Fixed Typography in', f);
    }
  });
}

applyWordBreakAll(studentDir);
applyWordBreakAll(adminDir);
console.log("Done");
