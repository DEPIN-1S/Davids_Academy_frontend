const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'components', 'AdminComponents');

const filesToPatch = [
    'McqQuestionContent.js',
    'DropdownQuestionContent.js',
    'DragdropQuestionContent.js',
    'MultiradioQuestionContent.js',
    'SortQuestionContent.js',
    'SentenceHiglightContent.js',
    'FillinQuestionContent.js',
    'TableDropdownQuestionContent.js',
    'MultiDropDownQuestionContent.js',
    'TableHighlightsQuestionContent.js'
];

filesToPatch.forEach(file => {
    const filePath = path.join(componentsDir, file);
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${file}`);
        return;
    }
    
    let code = fs.readFileSync(filePath, 'utf-8');
    
    // 1. Add topic_id to destructuring
    code = code.replace(/cs_id,\s*(?:\r?\n\s*)?\}\s*=\s*state;/g, 'cs_id,\n        topic_id,\n    } = state;');
    
    // 2. Pass topic_id in handleNext navigate
    // Most forms do: cs_id, \n tabs:
    code = code.replace(/cs_id,\s*(?:\r?\n\s*)?tabs:/g, 'cs_id,\n            topic_id,\n            tabs:');
    
    // Some forms don't have tabs there, or it's formatted differently.
    // Let's also try catching handleBack's navigate
    code = code.replace(/cs_id\s*(?:\r?\n\s*)?\}\s*(?:\r?\n\s*)?\}\);/g, 'cs_id,\n                topic_id\n            }\n        });');
    
    fs.writeFileSync(filePath, code);
    console.log(`Patched ${file}`);
});
