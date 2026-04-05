const fs = require('fs');

let appRoutesPath = 'src/routes/AppRoutes.tsx';
let appRoutesCode = fs.readFileSync(appRoutesPath, 'utf8');

// Replace enterVocabHome() and navTo('/vocab') with enterEnglishHome() and navTo('/english')
appRoutesCode = appRoutesCode.replace(/enterVocabHome\(\);\s*navTo\('\/vocab'\);/g, "enterEnglishHome(); navTo('/english');");

fs.writeFileSync(appRoutesPath, appRoutesCode, 'utf8');
