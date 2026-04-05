const fs = require('fs');

const path = 'src/features/quiz/components/SavedQuizzes.tsx';
let data = fs.readFileSync(path, 'utf8');

// Change `if (loading)` to `if (loading || isSyncing)`
data = data.replace(
    "if (loading) {",
    "if (loading || isSyncing) {"
);

fs.writeFileSync(path, data);
