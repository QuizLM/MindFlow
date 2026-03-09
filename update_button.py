import os

file_path = "src/features/quiz/components/QuizReview.tsx"

with open(file_path, 'r') as f:
    content = f.read()

old_button = """      {/* Floating Exit Full Screen Button */}
      {isFullScreen && (
          <div className="fixed top-4 right-4 z-[60] pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)]">
              <button
                  onClick={toggleFullScreen}
                  className="bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all shadow-lg"
                  aria-label="Exit Full Screen"
                  title="Exit Full Screen"
              >
                  <Minimize2 className="w-5 h-5" />
              </button>
          </div>
      )}"""

new_button = """      {/* Floating Exit Full Screen Button */}
      {isFullScreen && (
          <div className="fixed top-4 right-4 z-50">
              <button
                  onClick={toggleFullScreen}
                  className="bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm flex items-center gap-2 transition-all shadow-lg"
              >
                  <Minimize2 className="w-4 h-4" /> Exit Full Screen
              </button>
          </div>
      )}"""

if old_button in content:
    content = content.replace(old_button, new_button)
    with open(file_path, 'w') as f:
        f.write(content)
    print("Replaced successfully")
else:
    print("Could not find old button text to replace")
