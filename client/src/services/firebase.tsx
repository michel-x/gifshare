import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import * as config from '../utils/config';


const firebaseConfig = {
  apiKey: config.firebaseApiKey,
  authDomain: config.firebaseAuthDomain,
  projectId: config.firebaseProjectId,
  appId: config.firebaseAppId,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

if (import.meta.env.DEV) {
  // connectAuthEmulator(auth, "http://localhost:9099");
}

export { app, auth };

