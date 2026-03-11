const fs = require('fs');

const configPath = 'src/features/synonyms/SynonymsConfig.tsx';
let content = fs.readFileSync(configPath, 'utf8');

content = content.replace(
    /onClick=\{\(\) => window\.location\.hash = '#\/synonyms\/quiz'\}(\s*className="[^"]*opacity-80")/g,
    (match, p1) => {
        let newClass = p1.replace(' opacity-80', '');
        if (p1.includes('purple')) {
            return `onClick={() => window.location.hash = '#/synonyms/quiz?mode=imposter'}${newClass}`;
        }
        return `onClick={() => window.location.hash = '#/synonyms/quiz?mode=connect'}${newClass}`;
    }
);

content = content.replace(
    /<span className="text-xs font-bold px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900\/50 dark:text-purple-300 rounded-md">Coming Soon<\/span>/g,
    ''
);
content = content.replace(
    /<span className="text-xs font-bold px-2 py-1 bg-pink-100 text-pink-700 dark:bg-pink-900\/50 dark:text-pink-300 rounded-md">Coming Soon<\/span>/g,
    ''
);

const dailyChallengeHTML = `
                {/* Daily Challenge */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm mb-8 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                            🎯 Daily 20 Words Challenge
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Master 20 important words every day.</p>
                        <div className="flex items-center gap-3 mt-3">
                            <div className="w-48 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[0%]" />
                            </div>
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">0 / 20</span>
                        </div>
                    </div>
                    <button
                        onClick={() => window.location.hash = '#/synonyms/quiz?mode=speed'}
                        className="px-4 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 font-bold rounded-xl hover:bg-blue-200 dark:hover:bg-blue-800/60 transition-colors"
                    >
                        Start Daily
                    </button>
                </div>
`;

if (!content.includes('Daily 20 Words Challenge')) {
    content = content.replace(
        /\{\/\* Stats \/ Welcome Card \*\/\}/,
        dailyChallengeHTML + '\n                {/* Stats / Welcome Card */}'
    );
}

const speedGameHTML = `
                    {/* Game 3: Speed Mode */}
                    <button
                        onClick={() => window.location.hash = '#/synonyms/quiz?mode=speed'}
                        className="flex flex-col text-left bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-md transition-all group md:col-span-2 lg:col-span-1"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                ⚡
                            </div>
                            <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 rounded-md">Quick Revision</span>
                        </div>
                        <h4 className="text-lg font-bold mb-1">Lightning Review</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Swipe through words with a 5-second timer. Perfect for rapid revision.</p>
                    </button>`;

if (!content.includes('Lightning Review')) {
    content = content.replace(
        /<\/div>\s*<\/div>\s*<\/div>\s*\);\s*};\s*$/,
        speedGameHTML + '\n                </div>\n\n            </div>\n        </div>\n    );\n};\n'
    );
}

fs.writeFileSync(configPath, content);
