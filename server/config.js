// export const DATABASE = "mongodb://127.0.0.1:27017/real_state";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

export const DATABASE = "mongodb+srv://real-state:CVKXUyi3VVYqh4qx@real-state.nsln4hx.mongodb.net/?retryWrites=true&w=majority&appName=real-state";
export const EMAIL_FROM = 'Real State Bangladesh <mdnazimahmed64@gmail.com>';
export const REPLY_TO = "mdnazimahmed64@gmail.com";

const firebaseConfig = {
  apiKey: "AIzaSyAhQEmEzODngaOSeN9UCotgnJlI_ip-tmY",
  authDomain: "onlineeducation-cffb9.firebaseapp.com",
  databaseURL: "https://onlineeducation-cffb9-default-rtdb.firebaseio.com",
  projectId: "onlineeducation-cffb9",
  storageBucket: "onlineeducation-cffb9.appspot.com",
  messagingSenderId: "982988547906",
  appId: "1:982988547906:web:18d0069650e6bae329cadb",
  measurementId: "G-2RVQLXXE4Q"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export const JWT_SECRET = 'GGJJJDDKKKGTIYYPYP';
export const CLIENT_URL = "http://localhost:3000";