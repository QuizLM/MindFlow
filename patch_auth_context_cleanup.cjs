const fs = require('fs');
const path = 'src/features/auth/context/AuthContext.tsx';
let data = fs.readFileSync(path, 'utf8');

// Remove the redirect check since it's now in App.tsx
data = data.replace(
`        // Handle OAuth Redirect Path
        const redirectPath = localStorage.getItem('mindflow_auth_redirect');
        if (redirectPath) {
            localStorage.removeItem('mindflow_auth_redirect');
            // We use window.location.hash for HashRouter
            if (window.location.hash !== \`#\${redirectPath}\`) {
                window.location.hash = redirectPath;
            }
        }`,
        ''
);

fs.writeFileSync(path, data);
console.log('done');
