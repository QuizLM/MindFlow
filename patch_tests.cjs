const fs = require('fs');
const path = require('path');

const addDocEnv = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('/**\n * @vitest-environment jsdom\n */')) {
        content = '/**\n * @vitest-environment jsdom\n */\n' + content;
        fs.writeFileSync(filePath, content, 'utf8');
    }
};

const testFiles = [
    'src/features/quiz/components/QuizOption.test.tsx',
    'src/features/quiz/components/AiExplanationButton.test.tsx',
    'src/features/quiz/hooks/useTextToSpeech.test.tsx'
];

testFiles.forEach(file => {
    const p = path.join(__dirname, file);
    if(fs.existsSync(p)) {
        addDocEnv(p);
    }
});

// Also remove e2e tests that don't belong here as playwright requires specific running
if (fs.existsSync(path.join(__dirname, 'tests/e2e/check_synonyms4.spec.ts'))) {
   fs.unlinkSync(path.join(__dirname, 'tests/e2e/check_synonyms4.spec.ts'));
}
if (fs.existsSync(path.join(__dirname, 'tests/e2e/check_synonyms3.spec.ts'))) {
   fs.unlinkSync(path.join(__dirname, 'tests/e2e/check_synonyms3.spec.ts'));
}
if (fs.existsSync(path.join(__dirname, 'tests/e2e/check_synonyms2.spec.ts'))) {
   fs.unlinkSync(path.join(__dirname, 'tests/e2e/check_synonyms2.spec.ts'));
}
if (fs.existsSync(path.join(__dirname, 'tests/e2e/check_synonyms.spec.ts'))) {
   fs.unlinkSync(path.join(__dirname, 'tests/e2e/check_synonyms.spec.ts'));
}
