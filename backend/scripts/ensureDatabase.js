const { execSync } = require('child_process');

/**
 * Simple script to ensure database is ready
 * Runs migrations and generates client
 */
function ensureDatabase() {
    console.log('🔄 Ensuring Database state...');
    try {
        // Generate Prisma Client
        console.log('- Generating Prisma Client...');
        execSync('npx prisma generate', { stdio: 'inherit' });

        // Push schema (good for simple SQLite setups)
        console.log('- Syncing database schema...');
        execSync('npx prisma db push --skip-generate', { stdio: 'inherit' });

        console.log('✅ Database is ready!');
    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        process.exit(1);
    }
}

ensureDatabase();
