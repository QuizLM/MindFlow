const fs = require('fs');

let appRoutesPath = 'src/routes/AppRoutes.tsx';
let appRoutesCode = fs.readFileSync(appRoutesPath, 'utf8');

// Replace "enterEnglishHome, enterVocabHome, enterIdiomsConfig,"
// With "enterEnglishHome, enterIdiomsConfig,"
appRoutesCode = appRoutesCode.replace(/enterVocabHome,\s*/g, '');

fs.writeFileSync(appRoutesPath, appRoutesCode, 'utf8');
