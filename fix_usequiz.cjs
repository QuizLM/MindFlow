const fs = require('fs');

let useQuizPath = 'src/features/quiz/hooks/useQuiz.ts';
let useQuizCode = fs.readFileSync(useQuizPath, 'utf8');
useQuizCode = useQuizCode.replace(/\s*enterVocabHome:\s*state\.enterVocabHome,/g, '');
fs.writeFileSync(useQuizPath, useQuizCode, 'utf8');
