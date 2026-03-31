const fs = require('fs');
const file = 'src/features/quiz/components/ui/MultiSelectDropdown.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `{label && (
        <div className="flex items-center gap-1.5 mb-1.5">
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</label>
          {tooltip && (
            <div className="group relative flex items-center">
              <Info className="w-3.5 h-3.5 text-gray-400 cursor-help hover:text-indigo-500 transition-colors" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-50 pointer-events-none text-center font-normal leading-relaxed">
                {tooltip}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
              </div>
            </div>
          )}
        </div>
      )}`;

const replacement = `{label && (
        <div className="flex items-center gap-1.5 mb-1.5 w-full">
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</label>
          {tooltip && (
            <div className="group relative flex items-center">
              <Info className="w-3.5 h-3.5 text-gray-400 cursor-help hover:text-indigo-500 transition-colors" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-50 pointer-events-none text-center font-normal leading-relaxed">
                {tooltip}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
              </div>
            </div>
          )}
          {options.length > 0 && (
            <div className="ml-auto flex items-center gap-1.5">
              <input
                type="checkbox"
                id={\`select-all-\${label?.replace(/\\s+/g, '-')}\`}
                className="w-3.5 h-3.5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
                checked={
                  options.length > 0 &&
                  options.filter(opt => (counts?.[opt] || 0) > 0).length > 0 &&
                  options.filter(opt => (counts?.[opt] || 0) > 0).every(opt => selectedOptions.includes(opt))
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    const availableOptions = options.filter(opt => (counts?.[opt] || 0) > 0);
                    onSelectionChange(availableOptions);
                  } else {
                    onSelectionChange([]);
                  }
                }}
              />
              <label
                htmlFor={\`select-all-\${label?.replace(/\\s+/g, '-')}\`}
                className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-indigo-500 transition-colors"
              >
                All
              </label>
            </div>
          )}
        </div>
      )}`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content);
  console.log("Successfully patched MultiSelectDropdown.tsx");
} else {
  console.log("Target string not found in file.");
}
