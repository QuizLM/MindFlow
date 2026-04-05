const fs = require('fs');

const path = 'src/features/quiz/components/SavedQuizzes.tsx';
let data = fs.readFileSync(path, 'utf8');

// Import syncService
if (!data.includes("import { syncService } from '../../../lib/syncService';")) {
    data = data.replace(
        "import { useQuizContext } from '../context/QuizContext';",
        "import { useQuizContext } from '../context/QuizContext';\nimport { syncService } from '../../../lib/syncService';"
    );
}

// Add state for isSyncing
data = data.replace(
    "const [loading, setLoading] = useState(true);",
    "const [loading, setLoading] = useState(true);\n    const [isSyncing, setIsSyncing] = useState(syncService.getIsSyncing());"
);

// Update event listeners in useEffect
const useEffectRegex = /useEffect\(\(\) => \{([\s\S]*?)return \(\) => \{([\s\S]*?)\};\n    \}, \[\]\);/m;
const match = data.match(useEffectRegex);

if (match) {
    const newUseEffectBody = `useEffect(() => {
        loadQuizzes();

        const handleSyncStart = () => {
            setIsSyncing(true);
        };

        const handleSyncComplete = () => {
            setIsSyncing(false);
            loadQuizzes();
        };

        window.addEventListener('mindflow-sync-start', handleSyncStart);
        window.addEventListener('mindflow-sync-complete', handleSyncComplete);

        // Also check if sync started right before component mounted
        if (syncService.getIsSyncing()) {
            setIsSyncing(true);
        }

        return () => {
            window.removeEventListener('mindflow-sync-start', handleSyncStart);
            window.removeEventListener('mindflow-sync-complete', handleSyncComplete);
        };
    }, []);`;

    data = data.replace(match[0], newUseEffectBody);
}

fs.writeFileSync(path, data);
