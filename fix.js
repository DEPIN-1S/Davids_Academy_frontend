const fs = require('fs');

function processFile(filePath) {
  let initial = fs.readFileSync(filePath, 'utf8');
  let content = initial;

  // 1. Add sx to empty MenuItems
  content = content.replace(/<MenuItem value=""((?:\s+disabled)?)>/g, '<MenuItem value=""$1 sx={{ whiteSpace: "normal", wordBreak: "break-word" }}>');

  // 2. Add sx to options MenuItems
  // Match: <MenuItem key={opt.id || oi} value={opt.dropdownValue}> or <MenuItem key={opt.id} value={opt.options_value}>
  content = content.replace(/<MenuItem key=\{([^\}]+)\} value=\{([^\}]+)\}>/g, '<MenuItem key={$1} value={$2} sx={{ whiteSpace: "normal", wordBreak: "break-word" }}>');

  // 3. Add .MuiSelect-select wrapper styles in sx
  // In DropdownQuestionComponent
  content = content.replace(/("&.Mui-focused":\s*\{[^}]+\},)/g, '$1\n                      ".MuiSelect-select": { whiteSpace: "normal", wordBreak: "break-word" },');

  // In DragDropQuestionComponent
  content = content.replace(/(minHeight:\s*40,)/g, '$1\n                          ".MuiSelect-select": { whiteSpace: "normal", wordBreak: "break-word" },');

  fs.writeFileSync(filePath, content);
  
  if (initial !== content) {
    console.log(`Updated ${filePath}`);
  } else {
    console.log(`No changes made to ${filePath}`);
  }
}

processFile('src/components/StudentComponents/DropdownQuestionComponent.js');
processFile('src/components/StudentComponents/DragDropQuestionComponent.js');
console.log('Script executed');
