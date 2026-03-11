const fs = require('fs');
const path = require('path');

const syncPath = path.join(__dirname, 'src', 'lib', 'syncService.ts');
let content = fs.readFileSync(syncPath, 'utf8');

// Add import for SynonymInteraction
if (!content.includes('SynonymInteraction')) {
    content = content.replace("import { db } from './db';", "import { db, SynonymInteraction } from './db';");
}

// Add pushSynonymInteraction method
const newMethod = `
  /**
   * Pushes a synonym interaction to Supabase.
   */
  pushSynonymInteraction: async (userId: string, interaction: SynonymInteraction) => {
    const { error } = await supabase.from('user_synonym_interactions').upsert({
      user_id: userId,
      word_id: interaction.wordId,
      mastery_level: interaction.masteryLevel,
      daily_challenge_score: interaction.dailyChallengeScore || 0,
      gamification_score: interaction.gamificationScore || 0,
      viewed_explanation: interaction.viewedExplanation || false,
      viewed_word_family: interaction.viewedWordFamily || false,
      last_interacted_at: interaction.lastInteractedAt,
    }, { onConflict: 'user_id, word_id' });

    if (error) console.error('Error pushing synonym interaction:', error);
  },
`;

if (!content.includes('pushSynonymInteraction:')) {
    content = content.replace("removeBookmark: async (userId: string, questionId: string) => {", newMethod + "\n  removeBookmark: async (userId: string, questionId: string) => {");
}

// Update syncOnLogin
const fetchStr = "supabase.from('user_bookmarks').select('question_id').eq('user_id', userId)";
const fetchStrReplace = fetchStr + ",\n        supabase.from('user_synonym_interactions').select('*').eq('user_id', userId)";
if(!content.includes('user_synonym_interactions')) {
    content = content.replace(fetchStr, fetchStrReplace);
}

const destructStr = "        { data: remoteBookmarks }";
const destructStrReplace = destructStr + ",\n        { data: remoteSynonyms }";
if(!content.includes('remoteSynonyms')) {
    content = content.replace(destructStr, destructStrReplace);
}

const localFetchStr = "const localBookmarks = await db.getAllBookmarks();";
const localFetchStrReplace = localFetchStr + "\n      const localSynonyms = await db.getAllSynonymInteractions();";
if(!content.includes('localSynonyms')) {
    content = content.replace(localFetchStr, localFetchStrReplace);
}

const remoteIdsStr = "const remoteBookmarkIds = new Set((remoteBookmarks || []).map(b => b.question_id));";
const remoteIdsStrReplace = remoteIdsStr + "\n      const remoteSynonymIds = new Set((remoteSynonyms || []).map(s => s.word_id));";
if(!content.includes('remoteSynonymIds')) {
    content = content.replace(remoteIdsStr, remoteIdsStrReplace);
}

const pushLocalStr = `      for (const bm of localBookmarks) {
        if (!remoteBookmarkIds.has(bm.id)) {
          await syncService.pushBookmark(userId, bm);
        }
      }`;
const pushLocalStrReplace = pushLocalStr + `\n      for (const syn of localSynonyms) {
        if (!remoteSynonymIds.has(syn.wordId)) {
          await syncService.pushSynonymInteraction(userId, syn);
        }
      }`;
if(!content.includes('pushSynonymInteraction(userId, syn)')) {
    content = content.replace(pushLocalStr, pushLocalStrReplace);
}

const remoteSyncStr = `      if (remoteBookmarks && remoteBookmarks.length > 0) {`;
const remoteSyncStrReplace = `      if (remoteSynonyms) {
        for (const remote of remoteSynonyms) {
          await db.saveSynonymInteraction({
            wordId: remote.word_id,
            wordString: '', // Missing string data from backend, relies on UI hydrating it later
            masteryLevel: remote.mastery_level,
            dailyChallengeScore: remote.daily_challenge_score,
            gamificationScore: remote.gamification_score,
            viewedExplanation: remote.viewed_explanation,
            viewedWordFamily: remote.viewed_word_family,
            lastInteractedAt: remote.last_interacted_at
          });
        }
      }

` + remoteSyncStr;

if(!content.includes('if (remoteSynonyms) {')) {
    content = content.replace(remoteSyncStr, remoteSyncStrReplace);
}

fs.writeFileSync(syncPath, content, 'utf8');
