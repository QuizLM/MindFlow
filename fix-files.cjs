const fs = require('fs');
const files = [
  'src/features/synonyms/components/SynonymQuizSession.tsx',
  'src/features/synonyms/components/ImposterGame.tsx',
  'src/features/synonyms/components/ConnectGame.tsx',
  'src/features/synonyms/components/SpeedGame.tsx'
];

for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  // Revert the naive backtick replacement which destroyed template literals.
  // Instead, replace ``` with nothing if it was added by cat (usually not the case,
  // but let's carefully restore proper template literals).

  // Since we completely broke the files with `sed -i "s/\`/\`/g"`, let's just regenerate them properly.
}
