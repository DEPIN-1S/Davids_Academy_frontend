const fs = require('fs');
const glob = require('glob'); // Not available by default, we'll use fs.readdirSync
const path = require('path');

const adminPath = path.join(__dirname, 'src', 'Admin Question View');
const studentPath = path.join(__dirname, 'src', 'components', 'StudentComponents');

function processFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // 1. Fix {questionText} inside Typography or Box
    content = content.replace(
        /(<\w+[^>]*?)>\s*\{questionText(?: \|\| "")?\}\s*<\/\w+>/g,
        (match, openingTag) => {
             // If already has dangerouslySetInnerHTML, skip
             if (openingTag.includes('dangerouslySetInnerHTML')) return match;
             return `${openingTag} dangerouslySetInnerHTML={{ __html: questionText || "" }} />`;
        }
    );

    // 2. Fix {questionData?.data?.instructions} inside Typography
    content = content.replace(
        /(<\w+[^>]*?)>\s*\{questionData\?\.data\?\.instructions(?: \|\| "")?\}\s*<\/\w+>/g,
        (match, openingTag) => {
             if (openingTag.includes('dangerouslySetInnerHTML')) return match;
             return `${openingTag} dangerouslySetInnerHTML={{ __html: questionData?.data?.instructions || "" }} />`;
        }
    );

    // 3. Fix instructions inside Student components {instructions}
    content = content.replace(
        /(<\w+[^>]*?)>\s*\{instructions(?: \|\| "")?\}\s*<\/\w+>/g,
        (match, openingTag) => {
             if (openingTag.includes('dangerouslySetInnerHTML')) return match;
             return `${openingTag} dangerouslySetInnerHTML={{ __html: instructions || "" }} />`;
        }
    );

    // 4. Fix tabValue in Admin {activeTabData?.tabValue}
    content = content.replace(
        /(<\w+[^>]*?)>\s*\{activeTabData\?\.tabValue(?: \|\| "")?\}\s*<\/\w+>/g,
        (match, openingTag) => {
             if (openingTag.includes('dangerouslySetInnerHTML')) return match;
             return `${openingTag} dangerouslySetInnerHTML={{ __html: activeTabData?.tabValue || "" }} />`;
        }
    );

    // 5. Fix tabValue in Student {active\?.tabValue || "No content available"}
    content = content.replace(
        /(<\w+[^>]*?)>\s*\{active\?\.tabValue(?: \|\| "No content available")?\}\s*<\/\w+>/g,
        (match, openingTag) => {
             if (openingTag.includes('dangerouslySetInnerHTML')) return match;
             return `${openingTag} dangerouslySetInnerHTML={{ __html: active?.tabValue || "No content available" }} />`;
        }
    );

    // 6. Fix {questionData?.data?.question} 
    content = content.replace(
        /(<\w+[^>]*?)>\s*\{questionData\?\.data\?\.question(?: \|\| "")?\}\s*<\/\w+>/g,
        (match, openingTag) => {
             if (openingTag.includes('dangerouslySetInnerHTML')) return match;
             return `${openingTag} dangerouslySetInnerHTML={{ __html: questionData?.data?.question || "" }} />`;
        }
    );

    // Fix other variants like {question}
    content = content.replace(
        /(<Typography[^>]*?)>\s*\{question(?: \|\| "")?\}\s*<\/Typography>/g,
        (match, openingTag) => {
             if (openingTag.includes('dangerouslySetInnerHTML')) return match;
             return `${openingTag} dangerouslySetInnerHTML={{ __html: question || "" }} />`;
        }
    );
    
    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

const adminFiles = fs.readdirSync(adminPath).filter(f => f.endsWith('.js'));
adminFiles.forEach(f => processFile(path.join(adminPath, f)));

const studentFiles = fs.readdirSync(studentPath).filter(f => f.endsWith('.js') || f.endsWith('.jsx'));
studentFiles.forEach(f => processFile(path.join(studentPath, f)));

console.log('Done scanning files.');
