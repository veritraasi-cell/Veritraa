import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function main() {
  console.log('Seed step skipped: no persistent seed store is configured.');
}

main().catch((error) => {
  console.error('Seed failed:', error);
  process.exitCode = 1;
});
