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

const ddFile = 'e:/Davidacdamey/davidAcademyFrontend/src/components/AdminComponents/MultiDropDownQuestionContent.js';

const ddQTarget = `      {/* Question Input */}
      <Typography variant="h6" mb={1} color="primary">
        Question Text *
      </Typography>
      <TextField
        fullWidth
        label="Enter your question"
        multiline
        minRows={3}
        maxRows={6}
        value={question}
        onChange={(e) => {
          setQuestion(e.target.value);
          setErrors((prev) => ({ ...prev, question: null }));
        }}
        variant="outlined"
        placeholder="Type your question here..."
        error={!!errors.question}
        helperText={errors.question}
        sx={{ mb: 3 }}
      />`;

const ddQRepl = `      {/* Question Input */}
      <Box sx={{ minHeight: '170px', mb: 3 }}>
        <Typography variant="h6" mb={1} color="primary">
          Question Text *
        </Typography>
        <ReactQuill
          theme="snow"
          value={question}
          onChange={(content) => {
            setQuestion(content);
            setErrors((prev) => ({ ...prev, question: null }));
          }}
          modules={tabModules}
          formats={tabFormats}
          placeholder="Type your question here..."
          style={{ height: '120px', borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }}
        />
        {errors.question && (
          <Typography color="error" variant="caption" sx={{ display: 'block', mt: 5 }}>
            {errors.question}
          </Typography>
        )}
      </Box>`;

const ddInstTarget = `      {/* Instruction */}
      <Typography variant="h6" mb={1} color="primary">
        Instruction *
      </Typography>
      <TextField
        fullWidth
        label="Enter Question Instruction"
        multiline
        minRows={3}
        maxRows={6}
        value={instruction}
        onChange={(e) => {
          setInstruction(e.target.value);
          setErrors((prev) => ({ ...prev, instruction: null }));
        }}
        variant="outlined"
        placeholder="Type your question instruction here..."
        error={!!errors.instruction}
        helperText={errors.instruction}
        sx={{ mb: 3 }}
      />`;

const ddInstRepl = `      {/* Instruction */}
      <Box sx={{ minHeight: '170px', mb: 3 }}>
        <Typography variant="h6" mb={1} color="primary">
          Instruction *
        </Typography>
        <ReactQuill
          theme="snow"
          value={instruction}
          onChange={(content) => {
            setInstruction(content);
            setErrors((prev) => ({ ...prev, instruction: null }));
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

replaceInFile(ddFile, [
    { target: ddQTarget, replacement: ddQRepl },
    { target: ddInstTarget, replacement: ddInstRepl }
]);
