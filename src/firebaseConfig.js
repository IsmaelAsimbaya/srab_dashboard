import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: window._env_.REACT_APP_API_KEY,
  authDomain: window._env_.REACT_APP_AUTH_DOMAIN,
  projectId: window._env_.REACT_APP_PROJECT_ID,
  storageBucket: window._env_.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: window._env_.REACT_APP_MESSAGING_SENDER_ID,
  appId: window._env_.REACT_APP_APP_ID,
  measurementId: window._env_.REACT_APP_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export { storage };