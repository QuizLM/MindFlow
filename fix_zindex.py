import os

file_path = "src/features/quiz/components/QuizReview.tsx"

with open(file_path, 'r') as f:
    content = f.read()

# Make sure z-index is large enough so it shows on top of everything
# 60 is better than 50 as it matches what it was originally
old_btn = """      {/* Floating Exit Full Screen Button */}
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

new_btn = """      {/* Floating Exit Full Screen Button */}
      {isFullScreen && (
          <div className="fixed top-4 right-4 z-[60] pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)]">
              <button
                  onClick={toggleFullScreen}
                  className="bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm flex items-center gap-2 transition-all shadow-lg"
              >
                  <Minimize2 className="w-4 h-4" /> Exit Full Screen
              </button>
          </div>
      )}"""

if old_btn in content:
    content = content.replace(old_btn, new_btn)
    with open(file_path, 'w') as f:
        f.write(content)
    print("Fixed z-index and safe-area insets successfully")
else:
    print("Could not find button text to replace")
