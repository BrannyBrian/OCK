// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  sendPasswordResetEmail, 
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

// Message container for status updates
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

// Elements for forms
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const forgotPasswordLink = document.getElementById("forgot-password-link");
const popupContainer = document.getElementById("popup-container");

// Forgot Password Form
const forgotPasswordForm = document.createElement("form");
forgotPasswordForm.id = "forgot-password-form";
forgotPasswordForm.classList.add("hidden");
forgotPasswordForm.innerHTML = `
  <h2><i class="fas fa-envelope"></i> Reset Password</h2>
  <input type="email" placeholder="Enter your email" id="reset-email" required>
  <button type="submit">Send Reset Link</button>
  <p><span id="back-to-login">Back to Login</span></p>
`;
popupContainer.appendChild(forgotPasswordForm);

// Forgot Password Functionality
forgotPasswordLink.addEventListener("click", () => {
  loginForm.classList.add("hidden");
  forgotPasswordForm.classList.remove("hidden");
});

forgotPasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const resetEmail = document.getElementById("reset-email").value;

  try {
    await sendPasswordResetEmail(auth, resetEmail);
    displayMessage("Password reset email sent! Check your inbox.");
    forgotPasswordForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
  } catch (error) {
    displayMessage(`Error: ${error.message}`, false);
  }
});

document.getElementById("back-to-login").addEventListener("click", () => {
  forgotPasswordForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
});

// Toggle between Login and Signup Forms
document.getElementById("switch-to-signup").addEventListener("click", () => {
  loginForm.classList.add("hidden");
  signupForm.classList.remove("hidden");
});

document.getElementById("switch-to-login").addEventListener("click", () => {
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

// Firebase Authentication: Login
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

// Google Sign-In/Sign-Up Handler
const googleHandler = async (isSignup) => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      // Save new user data if signing up
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
  
