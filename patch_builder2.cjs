const fs = require('fs');
const file = 'src/features/quiz/components/BlueprintBuilder.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'const NodeItem = ({ node, updateNode, deleteNode, depth = 0, metadataIndex }: { node: BlueprintNode, updateNode: (n: BlueprintNode) => void, deleteNode: () => void, depth?: number, metadataIndex?: Record<string, Record<string, Set<string>>>, parentValues?: Record<string, string> }) => {',
  'const NodeItem = ({ node, updateNode, deleteNode, depth = 0, metadataIndex, parentValues = {} }: { node: BlueprintNode, updateNode: (n: BlueprintNode) => void, deleteNode: () => void, depth?: number, metadataIndex?: Record<string, Record<string, Set<string>>>, parentValues?: Record<string, string> }) => {'
);

// also inject metadataIndex into the root NodeItem maps
content = content.replace(
  /<NodeItem\n                    key=\{node\.id\}\n                    node=\{node\}\n                    updateNode=\{\(n\) => updateRootNode\(node\.id, n\)\}\n                    deleteNode=\{\(\) => deleteRootNode\(node\.id\)\}\n                  \/>/g,
  '<NodeItem\n                    key={node.id}\n                    node={node}\n                    updateNode={(n) => updateRootNode(node.id, n)}\n                    deleteNode={() => deleteRootNode(node.id)}\n                    metadataIndex={metadataIndex}\n                  />'
);

fs.writeFileSync(file, content);
