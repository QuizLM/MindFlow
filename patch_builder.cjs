const fs = require('fs');
const file = 'src/features/quiz/components/BlueprintBuilder.tsx';
let content = fs.readFileSync(file, 'utf8');

// We need to modify `NodeItem` to take `parentFilters` or something similar, or calculate it itself based on depth.
// However, BlueprintBuilder builds an arbitrary tree. We can pass a `parentValues` record `{ subject: "History", topic: "Ancient" }` down the tree.

const parentValuesType = 'parentValues?: Record<string, string>;';

content = content.replace(
  'depth?: number, metadataIndex?: Record<string, Record<string, Set<string>>>',
  'depth?: number, metadataIndex?: Record<string, Record<string, Set<string>>>, parentValues?: Record<string, string>'
);

content = content.replace(
  'const NodeItem = ({ node, updateNode, deleteNode, depth = 0, metadataIndex }: { node: BlueprintNode, updateNode: (n: BlueprintNode) => void, deleteNode: () => void, depth?: number, metadataIndex?: Record<string, Record<string, Set<string>>> }) => {',
  'const NodeItem = ({ node, updateNode, deleteNode, depth = 0, metadataIndex, parentValues = {} }: { node: BlueprintNode, updateNode: (n: BlueprintNode) => void, deleteNode: () => void, depth?: number, metadataIndex?: Record<string, Record<string, Set<string>>>, parentValues?: Record<string, string> }) => {'
);

const availableOptionsLogic = `
  const availableOptions = useMemo(() => {
    if (!metadataIndex || !metadataIndex[node.type]) return [];

    // Cascading logic
    // We want to find the valid IDs based on parent values
    let validIds: Set<string> | null = null;

    for (const [parentKey, parentVal] of Object.entries(parentValues)) {
      if (!parentVal) continue;
      const ids = metadataIndex[parentKey]?.[parentVal];
      if (!ids) continue;

      if (validIds === null) {
        validIds = new Set(ids);
      } else {
        const intersected = new Set<string>();
        validIds.forEach(id => {
          if (ids.has(id)) {
            intersected.add(id);
          }
        });
        validIds = intersected;
      }

      if (validIds.size === 0) break;
    }

    const options = Object.entries(metadataIndex[node.type])
      .filter(([val, ids]) => {
         if (val.trim().length === 0) return false;
         if (validIds === null) return true; // No parent constraints
         // Intersect
         for (const id of ids) {
           if (validIds.has(id)) return true;
         }
         return false;
      })
      .map(([val]) => val)
      .sort();

    return options;
  }, [metadataIndex, node.type, parentValues]);
`;

content = content.replace(
  /const availableOptions = useMemo\(\(\) => \{[\s\S]*?\}, \[metadataIndex, node\.type\]\);/,
  availableOptionsLogic.trim()
);

// We need to pass the updated `parentValues` to children
content = content.replace(
  /depth=\{depth \+ 1\}/,
  `depth={depth + 1}\n                metadataIndex={metadataIndex}\n                parentValues={{ ...parentValues, [node.type]: node.value }}`
);

fs.writeFileSync(file, content);
