const fs = require('fs');
const file = 'src/features/quiz/components/QuizConfig.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '<ExamBlueprintsHub onBack={onBack} onLaunchBlueprint={(bp) => navigate(`/blueprints/preview/${bp.id}`)} />',
  '<ExamBlueprintsHub onBack={onBack} onLaunchBlueprint={(bp) => navigate(`/blueprints/preview/${bp.id}`)} metadataIndex={questionIndex} />'
);

fs.writeFileSync(file, content);
