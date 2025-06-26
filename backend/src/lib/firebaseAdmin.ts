import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { ServiceAccount } from 'firebase-admin';

import serviceAccountJson from '../../secrets/firebase-admin-sdk.json';

dotenv.config();

const serviceAccount = serviceAccountJson as ServiceAccount;

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

export const adminAuth = getAuth();