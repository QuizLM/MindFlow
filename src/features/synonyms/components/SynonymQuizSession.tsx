import React from 'react';

export const SynonymQuizSession: React.FC<any> = ({ onExit }) => {
    return (
        <div className="p-4 h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-center">
            <h1 className="text-3xl font-bold mb-4 text-blue-600">Gamified Practice Coming Soon!</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                Phase 3 features like "Imposter Trap" (Odd One Out) and "Tap & Connect" (Match the Following) are in development.
            </p>
            <button onClick={onExit} className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-colors">Go Back</button>
        </div>
    );
};
