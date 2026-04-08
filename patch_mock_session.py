import re

with open('src/features/quiz/mock/MockSession.tsx', 'r') as f:
    content = f.read()

# Add onTick to useMockTimer in MockSession
replacement = """    const { timeLeft, formatTime } = useMockTimer({
        totalTime: totalExamTime,
        onTimeUp: () => finishSession(),
        onTick: () => {
            currentQTimer.current += 1;
        }
    });"""

content = re.sub(
    r"const \{ timeLeft, formatTime \} = useMockTimer\(\{\s*totalTime: totalExamTime,\s*onTimeUp: \(\) => finishSession\(\)\s*\}\);",
    replacement,
    content
)

with open('src/features/quiz/mock/MockSession.tsx', 'w') as f:
    f.write(content)
