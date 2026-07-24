import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getFirebaseClientConfig } from "./config";

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

export function getFirebaseApp() {
  if (!app) {
    app = getApps().length ? getApp() : initializeApp(getFirebaseClientConfig());
  }
  return app;
}

export function getFirebaseAuth() {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  return auth;
}

export function getFirebaseDb() {
  if (!db) {
    db = getFirestore(getFirebaseApp());
  }
  return db;
}
