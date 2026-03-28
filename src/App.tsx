import React, { useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { AppProvider } from './providers/AppProvider';
import { AppRoutes } from './routes/AppRoutes';
import { supabase } from './lib/supabase';
import { SynapticLoader } from './components/ui/SynapticLoader';
import { useSettingsStore } from './stores/useSettingsStore';


/**
 * Root Application Component.
 *
 * Responsibilities:
 * 1. Initializes the Supabase authentication session.
 * 2. Sets up the Router (HashRouter for GitHub Pages compatibility).
 * 3. Wraps the app in the global `AppProvider`.
 * 4. Renders the main `AppRoutes`.
 *
 * @returns {JSX.Element} The mounted application.
 */
const App: React.FC = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 1. Check for active session on app mount (Before Router mounts completely)

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
    };

    initAuth();
  }, []);

  if (!isReady) {
    // Show a loading spinner while Supabase initializes, UNLESS we are on the entry page
    // where the CinematicIntro will handle the initial visual experience.
    const isEntryPage = window.location.hash === '' || window.location.hash === '#/';
    if (isEntryPage) {
      return <div className="h-screen w-screen bg-white dark:bg-slate-900" />;
    }
    return <div className="h-screen flex items-center justify-center"><SynapticLoader size="xl" /></div>;
  }

  return (
    <HashRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </HashRouter>
  );
};

export default App;
