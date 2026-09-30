const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'components', 'AdminComponents', 'MetaInfoComponent.js');
let code = fs.readFileSync(file, 'utf-8');

// Replace courseId with courseId and topic_id
code = code.replace(/courseId:\s*receivedQuestionData\.cs_id,/g, 'courseId: receivedQuestionData.cs_id,\n        topic_id: receivedQuestionData.topic_id,');

fs.writeFileSync(file, code);
console.log('Patched MetaInfoComponent.js successfully.');
