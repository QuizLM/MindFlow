const fs = require('fs');

const file = 'src/features/auth/components/ProfilePage.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("import { useNavigate }")) {
  content = content.replace(
    "import { useAuth } from '../../../contexts/AuthContext';",
    "import { useAuth } from '../../../contexts/AuthContext';\nimport { useNavigate } from 'react-router-dom';"
  );
}

if (!content.includes("History")) {
  content = content.replace(
    "import { LogOut, Settings, Award, CheckCircle, BarChart2 } from 'lucide-react';",
    "import { LogOut, Settings, Award, CheckCircle, BarChart2, History } from 'lucide-react';"
  );
}

if (!content.includes("const navigate = useNavigate();")) {
  content = content.replace(
    "const { user, signOut } = useAuth();",
    "const { user, signOut } = useAuth();\n  const navigate = useNavigate();"
  );
}

const attemptedQuizzesBtn = `
        {/* Attempted Quizzes Button */}
        <button
          onClick={() => navigate('/history')}
          className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow group mb-3"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-100 transition-colors">
              <History className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-800">Attempted Quizzes</h3>
              <p className="text-sm text-gray-500">View your past quiz attempts and results</p>
            </div>
          </div>
          <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
`;

if (!content.includes("Attempted Quizzes Button")) {
  content = content.replace(
    "{/* Profile Settings Button */}",
    attemptedQuizzesBtn + "\n        {/* Profile Settings Button */}"
  );
}

fs.writeFileSync(file, content);
