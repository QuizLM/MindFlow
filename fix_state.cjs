const fs = require('fs');

// 1. Remove enterVocabHome from useQuizSessionStore
let storePath = 'src/features/quiz/stores/useQuizSessionStore.ts';
let storeCode = fs.readFileSync(storePath, 'utf8');
storeCode = storeCode.replace(/\s*enterVocabHome:\s*\(\)\s*=>\s*void;/g, '');
storeCode = storeCode.replace(/\s*enterVocabHome:\s*\(\)\s*=>\s*set\(\{\s*status:\s*'vocab-home'\s*\}\),/g, '');
fs.writeFileSync(storePath, storeCode, 'utf8');

// 2. Remove vocab-home from quizReducer
let reducerPath = 'src/features/quiz/stores/quizReducer.ts';
let reducerCode = fs.readFileSync(reducerPath, 'utf8');
reducerCode = reducerCode.replace(/\s*case 'ENTER_VOCAB_HOME':\s*return\s*\{\s*\.\.\.state,\s*status:\s*'vocab-home'\s*\};/g, '');
fs.writeFileSync(reducerPath, reducerCode, 'utf8');

// 3. Remove vocab-home from types/store.ts
let typesPath = 'src/features/quiz/types/store.ts';
let typesCode = fs.readFileSync(typesPath, 'utf8');
typesCode = typesCode.replace(/\s*\|\s*'vocab-home'\s*\/\/\s*Vocabulary\s*Home/g, '');
fs.writeFileSync(typesPath, typesCode, 'utf8');
