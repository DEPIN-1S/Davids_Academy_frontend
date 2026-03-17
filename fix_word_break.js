const fs = require('fs');
const path = require('path');

const studentComponentsDir = path.join(__dirname, 'src', 'components', 'StudentComponents');
const targetFiles = [
  'SentenceQuestionComponent.js',
];

function injectWordBreak(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // Injection 1: Ensure "Instructions :" text has word-break if needed, and standard text breaking 
  const replace1 = content.replace(
    /sx={{([\s\S]*?)textAlign:\s*"left",([\s\S]*?)alignItems:\s*"center",([\s\S]*?)}}/g,
    'sx={{$1textAlign: "left",$2alignItems: "center",\n          wordBreak: "break-word",$3}}'
  );
  
  const replace2 = replace1.replace(
    /sx={{([\s\S]*?)textAlign:\s*"left",([\s\S]*?)color:\s*"black",([\s\S]*?)lineHeight:\s*1\.6,([\s\S]*?)}}/g,
    'sx={{$1textAlign: "left",$2color: "black",$3lineHeight: 1.6,\n              wordBreak: "break-word",$4}}'
  );

  // Injection 3: Specifically fixing the "Your Answer:" block fields
   const replace3 = replace2.replace(
    /sx={{([\s\S]*?)color:\s*"#333",([\s\S]*?)fontWeight:\s*500,([\s\S]*?)}}/g,
    'sx={{$1color: "#333",$2fontWeight: 500,\n                      wordBreak: "break-word",$3}}'
  );

  if (content !== replace3) {
     fs.writeFileSync(filePath, replace3, 'utf8');
     console.log(`Updated layout styles in ${path.basename(filePath)}`);
  } else {
     console.log(`No matching styles found to update in ${path.basename(filePath)}`);
  }
}

targetFiles.forEach(file => {
  const fullPath = path.join(studentComponentsDir, file);
  if (fs.existsSync(fullPath)) {
    injectWordBreak(fullPath);
  } else {
    console.log(`File not found: ${file}`);
  }
});

console.log('Targeted batch word-break update complete.');
