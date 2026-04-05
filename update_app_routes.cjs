const fs = require('fs');
let code = fs.readFileSync('src/routes/AppRoutes.tsx', 'utf8');

const oldEnglishQuizProps = /<EnglishQuizHome\s+onBack=\{\(\) => \{ enterHome\(\); navTo\('\/dashboard'\); \}\}\s+onVocabClick=\{\(\) => \{ enterVocabHome\(\); navTo\('\/vocab'\); \}\}\s+\/>/g;
const newEnglishQuizProps = `<EnglishQuizHome
                            onBack={() => { enterHome(); navTo('/dashboard'); }}
                            onIdiomsClick={() => { enterIdiomsConfig(); navTo('/idioms/config'); }}
                            onOWSClick={() => { enterOWSConfig(); navTo('/ows/config'); }}
                            onSynonymsClick={() => navTo('/synonyms/config')}
                        />`;

code = code.replace(oldEnglishQuizProps, newEnglishQuizProps);
fs.writeFileSync('src/routes/AppRoutes.tsx', code, 'utf8');
