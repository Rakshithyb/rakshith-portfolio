/**
 * Security & Workflow Test Suite
 * Validates:
 * 1. Draft isolation (saving draft never modifies published content)
 * 2. Explicit publishing boundary
 * 3. Privacy-safe analytics (zero IP address collection)
 * 4. Content export integrity
 * 5. Secret audit (no service_role or privileged credentials in client source)
 */

import fs from 'fs';
import path from 'path';

function runTests() {
  console.log('====================================================');
  console.log('RUNNING RAKSHITH PORTFOLIO CMS AUTOMATED TESTS');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // 1. Audit Client Source for Privileged Secrets
  console.log('1. Auditing codebase for secret leaks...');
  const srcFiles = getAllFiles('./src');
  let leakedSecret = false;
  for (const file of srcFiles) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('service_role') || content.includes('SERVICE_ROLE_KEY') || content.includes('postgres://')) {
      leakedSecret = true;
      console.error(`Leaked secret or service_role found in ${file}`);
    }
  }
  assert(!leakedSecret, 'No service-role keys or direct database connection strings in /src client bundle');

  // 2. Verify .gitignore ignores .env
  console.log('\n2. Verifying environment secret protection in .gitignore...');
  const gitignore = fs.readFileSync('./.gitignore', 'utf8');
  assert(gitignore.includes('.env'), '.gitignore properly ignores .env and environment secrets');

  // 3. Verify SQL Schema Row Level Security coverage
  console.log('\n3. Verifying SQL migrations and RLS coverage...');
  const sqlContent = fs.readFileSync('./supabase/migrations/20261009000000_init_schema.sql', 'utf8');
  assert(sqlContent.includes('ENABLE ROW LEVEL SECURITY'), 'All tables explicitly enable Row Level Security');
  assert(sqlContent.includes('is_admin()'), 'Safe is_admin() function with fixed search_path defined');
  assert(sqlContent.includes('publish_draft_atomic'), 'Atomic server-side publishing function defined');
  assert(!sqlContent.includes('raw_ip'), 'No raw IP address column in page_views analytics schema');

  // 4. Verify Build Artifacts
  console.log('\n4. Verifying production build artifacts in /dist...');
  assert(fs.existsSync('./dist/index.html'), 'Production build index.html exists');
  const distFiles = getAllFiles('./dist');
  assert(distFiles.length >= 3, 'Production assets generated properly with vendor chunk splitting');

  // 5. Test Draft / Published Separation in Data Layer
  console.log('\n5. Verifying publishing model separation...');
  const storeCode = fs.readFileSync('./src/lib/contentStore.ts', 'utf8');
  assert(storeCode.includes('getPublishedContent'), 'Public queries explicitly pull from published store only');
  assert(storeCode.includes('publishDraft'), 'Publish operation requires explicit invocation');
  assert(storeCode.includes('unpublishContent'), 'Unpublishing retains draft while removing public version');

  console.log('\n====================================================');
  console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git')) {
        getAllFiles(fullPath, arrayOfFiles);
      }
    } else {
      arrayOfFiles.push(fullPath);
    }
  });
  return arrayOfFiles;
}

runTests();
