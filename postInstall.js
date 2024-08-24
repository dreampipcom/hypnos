import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

if (process.env.NEXUS_STANDALONE === 'true') {
  console.log('--- RUNNING STANDALONE POSTINSTALL HOOK');
  execSync('npx patch-package &&  npm run schema:generate:all:standalone');
} else {
  console.log('--- RUNNING EDGE POSTINSTALL HOOK');
  execSync('npx patch-package &&  npm run schema:generate:all');
}
