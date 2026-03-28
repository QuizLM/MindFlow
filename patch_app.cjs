const fs = require('fs');

const path = 'src/App.tsx';
let data = fs.readFileSync(path, 'utf8');

const importSettings = "import { useSettingsStore } from './stores/useSettingsStore';\n";
if (!data.includes("import { useSettingsStore }")) {
    data = data.replace("import { SynapticLoader } from './components/ui/SynapticLoader';", "import { SynapticLoader } from './components/ui/SynapticLoader';\n" + importSettings);
}

const initAuthLogic = `
    const initAuth = async () => {
      // getSession() parses the URL hash for tokens if present (OAuth redirect)
      const { data: { session } } = await supabase.auth.getSession();

      // --- BOOT-TIME OAUTH REDIRECT INTERCEPTION ---
      const redirectPath = localStorage.getItem('mindflow_auth_redirect');
      const audienceIntent = localStorage.getItem('mindflow_target_audience_intent');

      // 1. Force synchronous target audience state before Router mounts
      if (audienceIntent) {
         useSettingsStore.getState().setTargetAudience(audienceIntent as any);
         // Keep the intent flag in localStorage so AuthContext can still update Supabase metadata later
      }

      // 2. Force the correct Hash URL immediately
      if (redirectPath) {
         localStorage.removeItem('mindflow_auth_redirect');
         // We use window.location.hash for HashRouter. If it's a redirect back to /, it might be empty
         window.location.hash = redirectPath;
      }

      // Set ready state to render the router
      setIsReady(true);
    };`;

data = data.replace(
  /const initAuth = async \(\) => \{[\s\S]*?setIsReady\(true\);\n    \};/m,
  initAuthLogic
);

fs.writeFileSync(path, data);
console.log('done');
