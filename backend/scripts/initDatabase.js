// Database Initialization Script
// Initializes all Firebase collections and default data

import { initializeDatabase } from '../services/dbInitService.js';

console.log('🚀 Starting Database Initialization...\n');

const runInitialization = async () => {
  try {
    console.log('📦 Initializing database structure...');
    console.log('   - Creating collections');
    console.log('   - Adding default subjects');
    console.log('   - Setting up school settings');
    console.log('   - Configuring initial data\n');

    const result = await initializeDatabase();

    if (result.success) {
      console.log('\n' + '='.repeat(50));
      console.log('✅ DATABASE INITIALIZATION SUCCESSFUL!');
      console.log('='.repeat(50));
      console.log('\n📋 What was created:');
      console.log('   ✓ All database collections');
      console.log('   ✓ 27 default subjects (O/L and A/L)');
      console.log('   ✓ School settings and configuration');
      console.log('   ✓ Grading scale and academic structure');
      console.log('\n🎯 Your database is now ready to use!');
      console.log('\n📝 Next steps:');
      console.log('   1. Start your development server');
      console.log('   2. Register your first admin user');
      console.log('   3. Add teachers and students');
      console.log('   4. Configure courses and classes');
      console.log('='.repeat(50));
    } else {
      console.log('\n❌ Initialization failed');
      console.log('Please check the error messages above');
    }

  } catch (error) {
    console.error('\n' + '='.repeat(50));
    console.error('❌ DATABASE INITIALIZATION FAILED');
    console.error('='.repeat(50));
    console.error('\n🐛 Error Details:');
    console.error(`   Message: ${error.message}`);
    console.error(`   Code: ${error.code || 'Unknown'}`);
    console.error('\n🔧 Troubleshooting:');
    console.error('   1. Check your Firebase configuration');
    console.error('   2. Ensure Firestore is enabled in Firebase Console');
    console.error('   3. Verify your internet connection');
    console.error('   4. Check Firebase security rules');
    console.error('='.repeat(50));
    process.exit(1);
  }
};

// Run the initialization
runInitialization();
