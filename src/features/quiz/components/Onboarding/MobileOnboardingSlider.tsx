import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Target, Brain, MessageSquare, Zap, User as UserIcon, Download } from 'lucide-react';
import { Button } from '../../../../components/Button/Button';
import founderImage from '../../../../assets/aalok.jpg';

interface SlideData {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  isLast?: boolean;
}

const slides: SlideData[] = [
  {
    id: 'slide-1',
    icon: <Target className="w-16 h-16 text-indigo-500" />,
    title: "Master General Knowledge",
    description: "Prepare for UPSC, SSC, and Banking with highly accurate, customizable GK Quizzes that mirror real exam patterns."
  },
  {
    id: 'slide-2',
    icon: <Brain className="w-16 h-16 text-amber-500" />,
    title: "Smart Flashcards",
    description: "Learn Idioms, OWS, and Synonyms effortlessly with spaced repetition and intelligent vocab clusters."
  },
  {
    id: 'slide-3',
    icon: <MessageSquare className="w-16 h-16 text-emerald-500" />,
    title: "24/7 AI Mentor",
    description: "Chat or talk live with an advanced AI tutor designed to clarify complex topics and guide your preparation."
  },
  {
    id: 'slide-4',
    icon: <Zap className="w-16 h-16 text-rose-500" />,
    title: "Study Offline anywhere",
    description: "Download the app for lightning-fast access, offline learning, and adaptive metrics that track your growth."
  },
  {
    id: 'slide-5',
    icon: <UserIcon className="w-16 h-16 text-slate-500" />,
    title: "Built for Aspirants",
    description: "Created by a fellow aspirant to revolutionize how we study for competitive exams.",
    isLast: true
  }
];

interface MobileOnboardingSliderProps {
  onComplete: () => void;
  onInstallClick?: () => void;
  showInstallButton?: boolean;
}

export const MobileOnboardingSlider: React.FC<MobileOnboardingSliderProps> = ({
  onComplete,
  onInstallClick,
  showInstallButton
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipeThreshold = 50;
    if (offset.x < -swipeThreshold) {
      nextSlide();
    } else if (offset.x > swipeThreshold && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentSlide = slides[currentIndex];

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 dark:bg-slate-900 flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] overflow-hidden">

      {/* Top Bar (Skip button) */}
      <div className="w-full flex justify-end p-6 z-10">
        {!currentSlide.isLast && (
          <button
            onClick={onComplete}
            className="text-sm font-bold text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            Skip
          </button>
        )}
      </div>

      {/* Main Slide Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative w-full overflow-hidden px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="flex flex-col items-center text-center w-full max-w-sm absolute"
          >
            {/* Slide Visuals */}
            <div className="w-48 h-48 mb-10 flex items-center justify-center relative">
               <div className="absolute inset-0 bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full animate-blob blur-xl opacity-60"></div>
               <div className="relative z-10 bg-white dark:bg-slate-800 p-8 rounded-full shadow-xl">
                  {currentSlide.isLast ? (
                    <img src={founderImage} alt="Founder" className="w-24 h-24 rounded-full object-cover shadow-inner" />
                  ) : (
                    currentSlide.icon
                  )}
               </div>
            </div>

            {/* Slide Text */}
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
              {currentSlide.title}
            </h2>
            <p className="text-base font-medium text-slate-500 dark:text-slate-400 leading-relaxed px-2">
              {currentSlide.description}
            </p>

            {/* Founder Slide Extra Controls */}
            {currentSlide.isLast && (
               <div className="mt-8 flex flex-col items-center w-full gap-4">
                  <div className="text-center">
                    <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Aalok Kumar Sharma</p>
                    <p className="text-xs uppercase tracking-widest text-slate-400 mt-1">Founder</p>
                  </div>
                  {showInstallButton && (
                    <button
                      onClick={onInstallClick}
                      className="mt-2 flex items-center justify-center gap-2 w-full max-w-[200px] px-4 py-3 bg-white dark:bg-slate-800 border-2 border-indigo-100 dark:border-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-400 font-bold shadow-sm active:scale-95 transition-transform"
                    >
                      <Download className="w-5 h-5" />
                      Install App
                    </button>
                  )}
               </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="w-full flex flex-col items-center pb-10 px-8">

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-300 dark:bg-slate-700'}`}
            />
          ))}
        </div>

        {/* Action Button */}
        <Button
          onClick={nextSlide}
          className="w-full py-4 text-lg font-bold shadow-xl shadow-indigo-600/20"
        >
          {currentSlide.isLast ? 'Get Started' : 'Continue'}
          {!currentSlide.isLast && <ChevronRight className="w-5 h-5 ml-2" />}
        </Button>

      </div>
    </div>
  );
};
