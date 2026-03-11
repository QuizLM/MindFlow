const fs = require('fs');
const path = require('path');

const syncPath = path.join(__dirname, 'src', 'lib', 'syncService.ts');
let content = fs.readFileSync(syncPath, 'utf8');

content = content.replace("supabase.from('user_bookmarks').select('question_id').eq('user_id', userId)", "supabase.from('user_bookmarks').select('question_id').eq('user_id', userId),\n        supabase.from('user_synonym_interactions').select('*').eq('user_id', userId)");

fs.writeFileSync(syncPath, content, 'utf8');
