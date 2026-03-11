const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'src', 'lib', 'db.ts');
let content = fs.readFileSync(dbPath, 'utf8');

content = content.replace("_pushToSupabase: async (type: 'quiz' | 'history' | 'bookmark', data: any) => {", "_pushToSupabase: async (type: 'quiz' | 'history' | 'bookmark' | 'synonym_interaction', data: any) => {");

const oldLogic = "else if (type === 'bookmark') await syncService.pushBookmark(session.user.id, data);";
const newLogic = "else if (type === 'bookmark') await syncService.pushBookmark(session.user.id, data);\n            else if (type === 'synonym_interaction') await syncService.pushSynonymInteraction(session.user.id, data);";
content = content.replace(oldLogic, newLogic);

fs.writeFileSync(dbPath, content, 'utf8');
