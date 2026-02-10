// src/test-firebase.js
import { initializeApp } from "firebase/app";

const config = {
  apiKey: "AIzaSyDpxUrzPOvgm21s4q6xbvCMmgsPd16cfew",
  authDomain: "electronear.firebaseapp.com",
  projectId: "electronear",
  storageBucket: "electronear.firebasestorage.app",
  messagingSenderId: "654968111038",
  appId: "1:654968111038:web:da97c72344c592615303ef"
};

try {
  const app = initializeApp(config);
  console.log("✅ Firebase connected successfully!");
  console.log("Project: electronear");
} catch (error) {
  console.error("❌ Firebase connection failed:", error);
}