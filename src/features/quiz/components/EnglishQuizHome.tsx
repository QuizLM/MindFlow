import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../../components/Button/Button';
import { VocabQuizSVG, GrammarQuizSVG, EnglishMockSVG } from './DashboardSVGs';

interface EnglishQuizHomeProps {
  onBack: () => void;
  onVocabClick: () => void;
}

/**
 * A dedicated landing page for the English Subject Zone.
 *
 * Provides navigation to:
 * - Vocabulary Quizzes (Idioms, OWS, etc.)
 * - Grammar Quizzes (Placeholder for future)
 * - Mock Tests (Placeholder for future)
 *
 * @param {EnglishQuizHomeProps} props - The component props.
 * @returns {JSX.Element} The rendered English Zone home screen.
 */
export const EnglishQuizHome: React.FC<EnglishQuizHomeProps> = ({ onBack, onVocabClick }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring' as const, stiffness: 300, damping: 24 }
        }
    };

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)] transition-colors duration-700 relative overflow-hidden">
            <div className="flex-1 flex flex-col space-y-6 py-4 relative z-10 animate-fade-in w-full">

                {/* Navigation Bar */}
                <div className="w-full max-w-7xl mx-auto px-4 mt-2">
                   <Button
                      variant="ghost"
                      onClick={onBack}
                      className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 flex items-center gap-2 transition-colors -ml-4"
                   >
                     <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                   </Button>
                </div>

                {/* Hero Header */}
                <div className="relative text-left w-full max-w-7xl mx-auto px-4">
                  <h1 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-1 drop-shadow-sm">
                    English <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">Proficiency</span>
                  </h1>
                  <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-2 leading-relaxed font-medium">
                    Master vocabulary, grammar, and comprehension with targeted quizzes designed for competitive exams.
                  </p>
                </div>

                {/* Cards Grid */}
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 w-full max-w-7xl mx-auto z-20 px-4">

                    {/* Card 1: Vocab Quiz */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onVocabClick}
                        className="relative group cursor-pointer aspect-square rounded-[32px] sm:rounded-[40px] p-[1px] overflow-hidden"
                    >
                        {/* Glow Background Layer */}
                        <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl transition-colors duration-300 z-0"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10 dark:from-white/10 dark:to-transparent z-0"></div>

                        {/* Interactive Inner Shadow / Border */}
                        <div className="absolute inset-0 rounded-[32px] sm:rounded-[40px] border border-white/60 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] z-10 transition-all duration-300 group-active:border-b-0 border-b-[4px] border-b-emerald-200/50 dark:border-b-emerald-700/50 group-hover:border-emerald-300 dark:group-hover:border-emerald-500"></div>

                        {/* Centered Subtle Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full blur-[60px] opacity-40 group-hover:opacity-60 transition-opacity duration-500 z-0 bg-emerald-500"></div>

                        <div className="relative z-20 flex flex-col items-center justify-between h-full w-full p-4 sm:p-6 transition-opacity duration-300">
                            {/* SVG Container */}
                            <motion.div
                                className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 mt-2 relative drop-shadow-xl"
                                initial={{ scale: 0.9, opacity: 0.8 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            >
                                <VocabQuizSVG />
                            </motion.div>

                            {/* Text Area */}
                            <div className="flex flex-col items-center justify-end w-full text-center pb-2">
                                <h3 className="text-sm sm:text-lg font-black leading-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-900 dark:from-emerald-300 dark:to-emerald-100 mb-1 sm:mb-2">Vocab Quiz</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs font-semibold leading-tight line-clamp-2 max-w-[90%]">
                                    Idioms, One-word substitutions, Synonyms, and Antonyms.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 2: Grammar Quiz */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={undefined}
                        className="relative group cursor-pointer aspect-square rounded-[32px] sm:rounded-[40px] p-[1px] overflow-hidden"
                    >
                        {/* Glow Background Layer */}
                        <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl transition-colors duration-300 z-0"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10 dark:from-white/10 dark:to-transparent z-0"></div>

                        {/* Interactive Inner Shadow / Border */}
                        <div className="absolute inset-0 rounded-[32px] sm:rounded-[40px] border border-white/60 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] z-10 transition-all duration-300 group-active:border-b-0 border-b-[4px] border-b-violet-200/50 dark:border-b-violet-700/50 group-hover:border-violet-300 dark:group-hover:border-violet-500"></div>

                        {/* Centered Subtle Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full blur-[60px] opacity-40 group-hover:opacity-60 transition-opacity duration-500 z-0 bg-violet-500"></div>

                        <div className="relative z-20 flex flex-col items-center justify-between h-full w-full p-4 sm:p-6 transition-opacity duration-300">
                            {/* SVG Container */}
                            <motion.div
                                className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 mt-2 relative drop-shadow-xl"
                                initial={{ scale: 0.9, opacity: 0.8 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            >
                                <GrammarQuizSVG />
                            </motion.div>

                            {/* Text Area */}
                            <div className="flex flex-col items-center justify-end w-full text-center pb-2">
                                <h3 className="text-sm sm:text-lg font-black leading-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-violet-900 dark:from-violet-300 dark:to-violet-100 mb-1 sm:mb-2">Grammar Quiz</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs font-semibold leading-tight line-clamp-2 max-w-[90%]">
                                    Test your grammar skills with error detection and sentence improvement.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 3: Mock Test */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={undefined}
                        className="relative group cursor-pointer aspect-square rounded-[32px] sm:rounded-[40px] p-[1px] overflow-hidden"
                    >
                        {/* Glow Background Layer */}
                        <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl transition-colors duration-300 z-0"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10 dark:from-white/10 dark:to-transparent z-0"></div>

                        {/* Interactive Inner Shadow / Border */}
                        <div className="absolute inset-0 rounded-[32px] sm:rounded-[40px] border border-white/60 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] z-10 transition-all duration-300 group-active:border-b-0 border-b-[4px] border-b-rose-200/50 dark:border-b-rose-700/50 group-hover:border-rose-300 dark:group-hover:border-rose-500"></div>

                        {/* Centered Subtle Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full blur-[60px] opacity-40 group-hover:opacity-60 transition-opacity duration-500 z-0 bg-rose-500"></div>

                        <div className="relative z-20 flex flex-col items-center justify-between h-full w-full p-4 sm:p-6 transition-opacity duration-300">
                            {/* SVG Container */}
                            <motion.div
                                className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 mt-2 relative drop-shadow-xl"
                                initial={{ scale: 0.9, opacity: 0.8 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            >
                                <EnglishMockSVG />
                            </motion.div>

                            {/* Text Area */}
                            <div className="flex flex-col items-center justify-end w-full text-center pb-2">
                                <h3 className="text-sm sm:text-lg font-black leading-tight bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-rose-900 dark:from-rose-300 dark:to-rose-100 mb-1 sm:mb-2">English Mock</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs font-semibold leading-tight line-clamp-2 max-w-[90%]">
                                    Full length mock test with 25-30 questions. (Coming Soon)
                                </p>
                            </div>
                        </div>
                    </motion.div>

                </motion.div>
            </div>
        </div>
    );
};
