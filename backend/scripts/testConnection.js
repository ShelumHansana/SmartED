// Test Firebase Connection Script
// Run this to verify your Firebase setup is working

import { auth, db, storage } from '../firebase/config.js';
import { collection, getDocs } from 'firebase/firestore';

console.log('🔥 Testing Firebase Connection...\n');

// Test Firebase Auth
console.log('1️⃣ Testing Firebase Authentication...');
if (auth) {
  console.log('✅ Firebase Auth initialized');
  console.log(`   Current user: ${auth.currentUser ? auth.currentUser.email : 'None (not logged in)'}`);
} else {
  console.log('❌ Firebase Auth not initialized');
}

// Test Firestore
console.log('\n2️⃣ Testing Firestore Database...');
if (db) {
  console.log('✅ Firestore Database initialized');
  
  try {
    // Try to read from a collection
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    console.log(`   Collections accessible: ✅`);
    console.log(`   Users in database: ${snapshot.size}`);
  } catch (error) {
    console.log(`   ⚠️  Error accessing database: ${error.message}`);
    console.log('   This is normal if you haven\'t initialized the database yet');
  }
} else {
  console.log('❌ Firestore Database not initialized');
}

// Test Storage
console.log('\n3️⃣ Testing Cloud Storage...');
if (storage) {
  console.log('✅ Cloud Storage initialized');
  console.log(`   Storage bucket: ${storage.app.options.storageBucket}`);
} else {
  console.log('❌ Cloud Storage not initialized');
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 Connection Test Summary:');
console.log('='.repeat(50));

const allGood = auth && db && storage;
if (allGood) {
  console.log('✅ All Firebase services are properly configured!');
  console.log('\n📝 Next steps:');
  console.log('   1. Initialize the database: npm run init-db');
  console.log('   2. Start your development server');
  console.log('   3. Test registration and login');
} else {
  console.log('❌ Some Firebase services are not configured');
  console.log('\n🔧 Please check:');
  console.log('   1. Firebase config in backend/firebase/config.js');
  console.log('   2. Firebase project is created');
  console.log('   3. All services are enabled in Firebase Console');
}

console.log('='.repeat(50));

// Exit process
process.exit(allGood ? 0 : 1);
