// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { 
  getFirestore, 
  setDoc, 
  doc, 
  getDoc 
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAr4HjTArpBk6BEpIdIdGF7qs4k8B5oe4Q",
  authDomain: "xyz-limited.firebaseapp.com",
  projectId: "xyz-limited",
  storageBucket: "xyz-limited.firebasestorage.app",
  messagingSenderId: "355786361945",
  appId: "1:355786361945:web:da1f577f81f75c7d35b548",
  measurementId: "G-91DJEG89FG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Display message utility
const messageContainer = document.getElementById("message-container");
const displayMessage = (message, isSuccess = true) => {
  messageContainer.textContent = message;
  messageContainer.style.color = isSuccess ? "green" : "red";
  messageContainer.style.display = "block";
  setTimeout(() => {
    messageContainer.style.display = "none";
  }, 5000);
};

// Handle Sign-Up Form
const signupForm = document.getElementById("signup-form");
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (password !== confirmPassword) {
    displayMessage("Passwords do not match!", false);
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      createdAt: new Date(),
    });

    displayMessage("Sign-Up successful!");
    signupForm.reset();
  } catch (error) {
    displayMessage(`Error: ${error.message}`, false);
  }
});

// Handle Login Form
const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch user data from Firestore
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      displayMessage("Login successful!");
      loginForm.reset();
    } else {
      displayMessage("No user data found!", false);
    }
  } catch (error) {
    displayMessage(`Error: ${error.message}`, false);
  }
});

// Google Sign-In/Sign-Up
const googleHandler = async (isSignup) => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await setDoc(docRef, {
        name: user.displayName,
        email: user.email,
        createdAt: new Date(),
      });
    }

    displayMessage(`${isSignup ? "Google Sign-Up" : "Google Login"} successful!`);
  } catch (error) {
    displayMessage(`Error: ${error.message}`, false);
  }
};

document.getElementById("google-login").addEventListener("click", () => googleHandler(false));
document.getElementById("google-signup").addEventListener("click", () => googleHandler(true));
  
