// export const DATABASE = "mongodb://127.0.0.1:27017/real_state";
import { initializeApp } from "firebase/app";
//CVKXUyi3VVYqh4qx
export const DATABASE = "mongodb+srv://real-state:CVKXUyi3VVYqh4qx@real-state.nsln4hx.mongodb.net/?retryWrites=true&w=majority&appName=real-state";
export const EMAIL_FROM = "mdnazimahmed64@gmail.com";

const firebaseConfig = {
  apiKey: "AIzaSyCer3emZf-HyWa_dzEOcthSPKtIYsBKX5A",
  authDomain: "real-state-705ff.firebaseapp.com",
  projectId: "real-state-705ff",
  storageBucket: "real-state-705ff.appspot.com",
  messagingSenderId: "800327897116",
  appId: "1:800327897116:web:95cfe0b20acb5cbcbacfd9",
  measurementId: "G-Z7HTQSB495"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const JWT_SECRET = 'GGJJJDDKKKGTIYYPYP';
export const CLIENT_URL = "http://localhost:3000";

