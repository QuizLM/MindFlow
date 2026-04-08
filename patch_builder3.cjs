const fs = require('fs');
const file = 'src/features/quiz/components/BlueprintBuilder.tsx';
let content = fs.readFileSync(file, 'utf8');

// I injected `metadataIndex={metadataIndex}` into the root NodeItem mapping, but the BlueprintBuilder component didn't destructure `metadataIndex` from its props!

content = content.replace(
  'export const BlueprintBuilder: React.FC<BlueprintBuilderProps> = ({ initialData, onSave, onCancel, onLaunch }) => {',
  'export const BlueprintBuilder: React.FC<BlueprintBuilderProps> = ({ initialData, onSave, onCancel, onLaunch, metadataIndex }) => {'
);

fs.writeFileSync(file, content);
