const fs = require('fs');

function replaceInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    const isCRLF = content.includes('\r\n');

    for (const rep of replacements) {
        let target = rep.target;
        let replacement = rep.replacement;
        
        if (isCRLF) {
            target = target.replace(/\n/g, '\r\n');
            replacement = replacement.replace(/\n/g, '\r\n');
        }

        if (content.includes(target)) {
            content = content.replace(target, replacement);
            console.log(`Replaced in ${filePath}`);
            modified = true;
        } else {
            console.log(`Target NOT FOUND in ${filePath}: ${target.slice(0, 50).replace(/\r\n/g, ' ')}...`);
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
}

const mcqFile = 'e:/Davidacdamey/davidAcademyFrontend/src/components/AdminComponents/McqQuestionContent.js';

const importsTarget = `import { useDispatch } from "react-redux";
import { deleteTabImage, uploadTabImage } from "../../features/exam/examSlice";`;

const importsRepl = `import { useDispatch } from "react-redux";
import { deleteTabImage, uploadTabImage } from "../../features/exam/examSlice";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';`;

const modulesTarget = `    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);`;

const modulesRepl = `    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

    const tabModules = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ 'list': 'bullet' }],
            [{ 'color': [] }],
        ],
        clipboard: {
            matchVisual: false,
        },
    };

    const tabFormats = [
        'bold', 'italic', 'underline',
        'list', 'bullet',
        'link',
        'color',
    ];`;

const questionTarget = `            {/* Question Input */}
            <TextField
                fullWidth
                label="Enter your question *"
                multiline
                minRows={3}
                maxRows={6}
                value={question}
                onChange={(e) => {
                    setQuestion(e.target.value);
                    setErrors(prev => ({ ...prev, question: null }));
                }}
                variant="outlined"
                placeholder="Type your multiple choice question here..."
                error={!!errors.question}
                helperText={errors.question || \`\${question.length} characters (minimum 10 required)\`}
                sx={{ mb: 2 }}
            />`;

const questionRepl = `            {/* Question Input */}
            <Box sx={{ minHeight: '170px', mb: 3 }}>
                <Typography variant="h6" mb={1} color="primary">
                    Question Text *
                </Typography>
                <ReactQuill
                    theme="snow"
                    value={question}
                    onChange={(content) => {
                        setQuestion(content);
                        setErrors(prev => ({ ...prev, question: null }));
                    }}
                    modules={tabModules}
                    formats={tabFormats}
                    placeholder="Type your multiple choice question here..."
                    style={{ height: '120px', borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }}
                />
                {errors.question && (
                    <Typography color="error" variant="caption" sx={{ display: 'block', mt: 5 }}>
                        {errors.question}
                    </Typography>
                )}
            </Box>`;

const tabContentTarget = `                            <TextField
                                fullWidth
                                label="Tab Content"
                                multiline
                                minRows={3}
                                value={tab.tabValue}
                                onChange={(e) =>
                                    handleTabChange(index, "tabValue", e.target.value)
                                }
                                placeholder="Enter the content that will be displayed in this tab..."
                            />`;

const tabContentRepl = `                            <Box sx={{ minHeight: '170px', mb: 2 }}>
                                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>Tab Content</Typography>
                                <ReactQuill
                                    theme="snow"
                                    value={tab.tabValue}
                                    onChange={(content) => handleTabChange(index, "tabValue", content)}
                                    modules={tabModules}
                                    formats={tabFormats}
                                    placeholder="Enter the content that will be displayed in this tab..."
                                    style={{ height: '120px', borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }}
                                />
                            </Box>`;

const instructionTarget = `            <Typography variant="h6" mb={1} color="primary">
                Instruction 
            </Typography>
            <TextField
                fullWidth
                label="Enter Question Instruction *"
                multiline
                minRows={3}
                maxRows={6}
                value={instruction}
                onChange={(e) => {
                    setInstruction(e.target.value);
                    setErrors(prev => ({ ...prev, instruction: null }));
                }}
                variant="outlined"
                placeholder="Type your question instruction here..."
                error={!!errors.instruction}
                sx={{ mb: 3 }}
            />`;

const instructionRepl = `            <Box sx={{ minHeight: '170px', mb: 3 }}>
                <Typography variant="h6" mb={1} color="primary">
                    Instruction 
                </Typography>
                <ReactQuill
                    theme="snow"
                    value={instruction}
                    onChange={(content) => {
                        setInstruction(content);
                        setErrors(prev => ({ ...prev, instruction: null }));
                    }}
                    modules={tabModules}
                    formats={tabFormats}
                    placeholder="Type your question instruction here..."
                    style={{ height: '120px', borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }}
                />
                {errors.instruction && (
                    <Typography color="error" variant="caption" sx={{ display: 'block', mt: 5 }}>
                        {errors.instruction}
                    </Typography>
                )}
            </Box>`;

replaceInFile(mcqFile, [
    { target: importsTarget, replacement: importsRepl },
    { target: modulesTarget, replacement: modulesRepl },
    { target: questionTarget, replacement: questionRepl },
    { target: tabContentTarget, replacement: tabContentRepl },
    { target: instructionTarget, replacement: instructionRepl }
]);
