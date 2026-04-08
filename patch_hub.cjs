const fs = require('fs');
const file = 'src/features/quiz/components/ExamBlueprintsHub.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update Interface
content = content.replace(
  'interface ExamBlueprintsHubProps {\n  onBack: () => void;\n  onLaunchBlueprint: (blueprint: ExamBlueprint) => void;\n}',
  'interface ExamBlueprintsHubProps {\n  onBack: () => void;\n  onLaunchBlueprint: (blueprint: ExamBlueprint) => void;\n  metadataIndex?: Record<string, Record<string, Set<string>>>;\n}'
);

// Update component signature
content = content.replace(
  'export const ExamBlueprintsHub: React.FC<ExamBlueprintsHubProps> = ({ onBack, onLaunchBlueprint }) => {',
  'export const ExamBlueprintsHub: React.FC<ExamBlueprintsHubProps> = ({ onBack, onLaunchBlueprint, metadataIndex }) => {'
);

// Update BlueprintBuilder usage
content = content.replace(
  '<BlueprintBuilder\n        initialData={editingBlueprint || undefined}\n        onSave={handleSave}\n        onCancel={() => { setIsBuilding(false); setEditingBlueprint(null); }}\n        onLaunch={onLaunchBlueprint}\n      />',
  '<BlueprintBuilder\n        initialData={editingBlueprint || undefined}\n        onSave={handleSave}\n        onCancel={() => { setIsBuilding(false); setEditingBlueprint(null); }}\n        onLaunch={onLaunchBlueprint}\n        metadataIndex={metadataIndex}\n      />'
);

fs.writeFileSync(file, content);
