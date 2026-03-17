const fs = require('fs');
const files = [
  'src/components/StudentComponents/TableDropdownQuestionComponent.js',
  'src/components/StudentComponents/TableMultipleDropdownComponent.js',
  'src/components/AdminComponents/TableDropdownQuestionContent.js',
  'src/components/AdminComponents/MultiDropDownQuestionContent.js'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let initial = fs.readFileSync(f, 'utf8');
    let c = initial;

    // Fix TableContainer overflow
    c = c.replace(/overflow:\s*"hidden"/g, 'overflowX: "auto", overflowY: "hidden"');

    // Add minWidth to TableCell
    // For headers and standard cells, find sx={{ ... }} inside TableCell and ensure it doesn't already have minWidth
    // Let's use string replacements for specific known patterns.
    
    // Pattern 1: TableCell sx
    c = c.replace(/(borderBottom:\s*"1px solid #e2e8f0",\s*width:\s*\{\s*xs:\s*"auto",\s*md:[^}]+\},(?:\s*wordBreak:\s*"break-word",)?)/g, '$1\n                      minWidth: { xs: "140px", sm: "auto" },');

    // Pattern 2: TableCell sx for rowLabels
    c = c.replace(/(borderBottom:\s*"1px solid #e2e8f0",(?:\s*wordBreak:\s*"break-word",)?)\s*\}\}/g, '$1\n                       minWidth: { xs: "140px", sm: "auto" }\n                    }}');

    // Pattern 3: TableCell sx for Select fields
    c = c.replace(/(sx=\{\{\s*borderBottom:\s*"1px solid #e2e8f0"\s*\}\})/g, 'sx={{ borderBottom: "1px solid #e2e8f0", minWidth: { xs: "160px", sm: "auto" } }}');

    // Also remove wordBreak: break-word from the text TableCells if we want, but keeping it is fine if minWidth is there.

    if (c !== initial) {
      fs.writeFileSync(f, c);
      console.log('Updated ' + f);
    } else {
      console.log('No matches to replace in ' + f);
    }
  } else {
    console.log('Not found ' + f);
  }
});
