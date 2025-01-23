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

// Your web app's Firebase configuration
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
const analytics = getAnalytics(app); // Initialize Analytics
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

// Message container for displaying status
const messageContainer = document.getElementById("message-container");

// Function to display messages
const displayMessage = (message, isSuccess = true) => {
  messageContainer.textContent = message;
  messageContainer.style.color = isSuccess ? "green" : "red";
  messageContainer.style.display = "block";
  setTimeout(() => {
    messageContainer.style.display = "none";
  }, 5000);
};

// Function to redirect to home.html after successful authentication
const redirectToHome = () => {
  setTimeout(() => {
    window.location.href = "home.html";
  }, 2000); // Redirect after showing a success message for 2 seconds
};

// Show/Hide Forms
const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");
const switchToSignup = document.getElementById("switch-to-signup");
const switchToLogin = document.getElementById("switch-to-login");

// Toggle Between Login and Sign-Up Forms
switchToSignup.addEventListener("click", () => {
  loginForm.classList.add("hidden");
  signupForm.classList.remove("hidden");
});

switchToLogin.addEventListener("click", () => {
  signupForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
});

// Password Toggle Functionality
const togglePasswordIcons = document.querySelectorAll(".toggle-password");

togglePasswordIcons.forEach((icon) => {
  icon.addEventListener("click", () => {
    const input = icon.previousElementSibling;
    const type = input.getAttribute("type") === "password" ? "text" : "password";
    input.setAttribute("type", type);
    icon.classList.toggle("fa-eye-slash");
  });
});

// Firebase Authentication: Sign-Up
document.getElementById("signup-form").addEventListener("submit", async (e) => {
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
      name: name,
      email: email,
      createdAt: new Date(),
    });

    displayMessage("Sign-Up successful!");
    signupForm.reset();
    redirectToHome(); // Redirect to home.html
  } catch (error) {
    displayMessage(`Error: ${error.message}`, false);
  }
});

// Firebase Authentication: Login
document.getElementById("login-form").addEventListener("submit", async (e) => {
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
      redirectToHome(); // Redirect to home.html
    } else {
      displayMessage("No user data found!", false);
    }
  } catch (error) {
    displayMessage(`Error: ${error.message}`, false);
  }
});

// Google Sign-In and Sign-Up
const googleHandler = async (isSignup) => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user already exists in Firestore
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      // Save new Google user to Firestore
      await setDoc(docRef, {
        name: user.displayName,
        email: user.email,
        createdAt: new Date(),
      });
    }

    displayMessage(`${isSignup ? "Google Sign-Up" : "Google Login"} successful!`);
    redirectToHome(); // Redirect to home.html
  } catch (error) {
    displayMessage(`Error: ${error.message}`, false);
  }
};

document.getElementById("google-login").addEventListener("click", () => googleHandler(false));
document.getElementById("google-signup").addEventListener("click", () => googleHandler(true));
      
