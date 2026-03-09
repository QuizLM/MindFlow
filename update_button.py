import re

file_path = "/app/src/features/quiz/components/QuizResult.tsx"

with open(file_path, 'r') as file:
    content = file.read()

# Make it match exactly the other buttons style but gray
old_code = """      <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/quiz/attempted')} className="text-gray-500 hover:bg-gray-100 pl-0 hover:text-gray-900 focus:ring-0 focus:outline-none focus-visible:ring-0 border-none active:border-none shadow-none">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
      </div>"""

new_code = """      <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/quiz/attempted')} className="text-gray-600 hover:bg-gray-100 pl-0 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
      </div>"""

content = content.replace(old_code, new_code)

with open(file_path, 'w') as file:
    file.write(content)
