const fs = require('fs');
const files = [
  'DragdropQuestionContent.js', 
  'DropdownQuestionContent.js', 
  'MultiDropDownQuestionContent.js', 
  'TableDropdownQuestionContent.js'
].map(f => 'src/components/AdminComponents/' + f);

files.forEach(f => {
  if(fs.existsSync(f)) {
    let initial = fs.readFileSync(f, 'utf8');
    let c = initial;

    c = c.replace(/<MenuItem value=""((?:\s+disabled)?)>/g, '<MenuItem value=""$1 sx={{ whiteSpace: "normal", wordBreak: "break-word" }}>');
    
    // Some admin components might use row/col or opt maps differently but typically look similar
    c = c.replace(/<MenuItem key=\{([^\}]+)\} value=\{([^\}]+)\}>/g, '<MenuItem key={$1} value={$2} sx={{ whiteSpace: "normal", wordBreak: "break-word" }}>');
    
    c = c.replace(/("&.Mui-focused":\s*\{[^}]+\},)/g, '$1\n                      ".MuiSelect-select": { whiteSpace: "normal", wordBreak: "break-word" },');
    c = c.replace(/(minHeight:\s*40,)/g, '$1\n                          ".MuiSelect-select": { whiteSpace: "normal", wordBreak: "break-word" },');

    if(c !== initial) {
      fs.writeFileSync(f, c);
      console.log('Updated ' + f);
    }
  } else {
    console.log('Not found ' + f);
  }
});
