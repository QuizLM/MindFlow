const fs = require('fs');

const path = 'src/lib/syncService.ts';
let data = fs.readFileSync(path, 'utf8');

// Add getIsSyncing
data = data.replace(
  "export const syncService = {",
  "export const syncService = {\n  /** Returns the current sync status */\n  getIsSyncing: () => isSyncing,\n"
);

// Add mindflow-sync-start event dispatch
data = data.replace(
  "isSyncing = true;",
  "isSyncing = true;\n    window.dispatchEvent(new Event('mindflow-sync-start'));"
);

fs.writeFileSync(path, data);
