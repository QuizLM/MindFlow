const fs = require('fs');

const path = './src/features/quiz/components/SavedQuizzes.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace top "Create New Quiz" button
content = content.replace(
    /className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"\s*>\s*Create New Quiz\s*<\/button>/,
    `className="px-4 py-2.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 font-bold rounded-xl border border-indigo-200 dark:border-indigo-900/40 border-b-4 border-b-indigo-300 dark:border-b-indigo-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 active:translate-y-1 active:border-b transition-all shadow-sm flex items-center gap-2"
                        >
                            <PlusCircle className="w-5 h-5" />
                            Create New Quiz
                        </button>`
);

// Replace top "Attempted Quizzes" button
content = content.replace(
    /className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"\s*>\s*Attempted Quizzes\s*<\/button>/,
    `className="px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-bold rounded-xl border border-emerald-200 dark:border-emerald-900/40 border-b-4 border-b-emerald-300 dark:border-b-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 active:translate-y-1 active:border-b transition-all shadow-sm flex items-center gap-2"
                        >
                            <CheckCircle className="w-5 h-5" />
                            Attempted Quizzes
                        </button>`
);

// Replace empty state "Create Quiz" button
content = content.replace(
    /className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"\s*>\s*Create Quiz\s*<\/button>/,
    `className="px-6 py-3 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 font-bold rounded-xl border border-indigo-200 dark:border-indigo-900/40 border-b-4 border-b-indigo-300 dark:border-b-indigo-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 active:translate-y-1 active:border-b transition-all shadow-sm flex items-center gap-2 mx-auto"
                        >
                            <PlusCircle className="w-5 h-5" />
                            Create Quiz
                        </button>`
);

// Clean up redundant dark classes while we're at it
content = content.replace(/dark:text-white dark:text-white dark:text-slate-100/g, 'dark:text-white');
content = content.replace(/dark:bg-gray-900 dark:bg-gray-900 dark:bg-slate-800\/50/g, 'dark:bg-slate-900');
content = content.replace(/dark:text-gray-300 dark:text-gray-300 dark:text-slate-400/g, 'dark:text-gray-400');
content = content.replace(/dark:bg-gray-800 dark:bg-gray-800 dark:bg-slate-800\/50/g, 'dark:bg-slate-800');
content = content.replace(/dark:border-gray-800 dark:border-gray-800 dark:border-slate-800/g, 'dark:border-slate-800');
content = content.replace(/dark:bg-gray-800 dark:bg-gray-800/g, 'dark:bg-slate-800');

fs.writeFileSync(path, content, 'utf8');
console.log("SavedQuizzes buttons updated.");
