// scripts/getUserToken.ts

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import dotenv from 'dotenv';
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY!,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.FIREBASE_PROJECT_ID!,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function loginAndGetToken() {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      'testinguser@user.com',
      '123456'
    );
    const token = await userCredential.user.getIdToken();
    console.log('\n✅ Firebase ID token:\n', token);
  } catch (err) {
    console.error('❌ Login failed:', err);
  }
}

loginAndGetToken();
