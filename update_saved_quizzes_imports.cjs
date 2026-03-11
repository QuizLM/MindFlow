const fs = require('fs');
const path = './src/features/quiz/components/SavedQuizzes.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace lucide imports
content = content.replace(
    /import \{ Home, Clock, CheckCircle2, XCircle, ArrowRight, Trash2, Play, BookOpen \} from 'lucide-react';/,
    "import { Home, Clock, CheckCircle2, XCircle, ArrowRight, Trash2, Play, BookOpen, PlusCircle, CheckCircle } from 'lucide-react';"
);

fs.writeFileSync(path, content, 'utf8');
console.log("SavedQuizzes imports updated.");
