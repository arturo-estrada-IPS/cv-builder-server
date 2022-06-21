import { Injectable } from '@nestjs/common';
import * as firebaseAdmin from 'firebase-admin';
import { initializeApp as initializeClient } from 'firebase/app';
import {
  DATABASE_URL,
  firebaseConfig,
  SERVICE_ACCOUNT,
} from './firebase-service-account';

@Injectable()
export class FirebaseApp {
  private firebaseAminApp: firebaseAdmin.app.App;

  constructor() {
    this.firebaseAminApp = firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(SERVICE_ACCOUNT),
      databaseURL: DATABASE_URL,
    });

    initializeClient(firebaseConfig);
  }

  getAuth = (): firebaseAdmin.auth.Auth => this.firebaseAminApp.auth();

  firestore = (): firebaseAdmin.firestore.Firestore =>
    this.firebaseAminApp.firestore();
}
