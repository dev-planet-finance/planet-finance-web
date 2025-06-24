// src/lib/firebase.ts
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC8JKOpDRuwNs8Bb-cGxJCRABcwcPsU6AU",
  authDomain: "planet-finance-dev.firebaseapp.com",
  projectId: "planet-finance-dev",
  storageBucket: "planet-finance-dev.appspot.com",
  messagingSenderId: "929341727226",
  appId: "1:929341727226:web:b66a67f1a3431ccfa6c443"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;

