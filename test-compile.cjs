const { execSync } = require('child_process');
try {
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('TSC Passed');
} catch (e) {
  console.log('TSC Failed');
}
