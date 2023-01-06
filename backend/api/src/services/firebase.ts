import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { storageBucket, projectId, clientEmail, privateKey } from "./config";

const app = initializeApp({
    credential: cert({
        projectId,
        clientEmail,
        privateKey
    }),
    storageBucket,
    projectId,
});
const auth = getAuth();
const db = getFirestore();
const storage = getStorage(app);

export { app, auth, db, storage };