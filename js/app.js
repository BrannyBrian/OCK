// Firebase Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Show/Hide Forms
const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");
const switchToLogin = document.getElementById("switch-to-login");
const switchToSignup = document.getElementById("switch-to-signup");

// Toggle between Sign-Up and Login forms
switchToLogin.addEventListener("click", () => {
  signupForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
});

switchToSignup.addEventListener("click", () => {
  loginForm.classList.add("hidden");
  signupForm.classList.remove("hidden");
});

// Hamburger Menu Toggle
const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");

hamburger.addEventListener("click", () => {
  menu.classList.toggle("hidden");
});

// Firebase Authentication
// Login
document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Login successful!");
    })
    .catch((error) => {
      alert(`Error: ${error.message}`);
    });
});

// Sign-Up
document.getElementById("signup-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Sign-Up successful!");
    })
    .catch((error) => {
      alert(`Error: ${error.message}`);
    });
});

// Google Sign-In
document.getElementById("google-login").addEventListener("click", () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      alert("Google login successful!");
    })
    .catch((error) => {
      alert(`Error: ${error.message}`);
    });
});

// Testimonials Scroll
const reviews = document.querySelector(".reviews");
let scrollAmount = 0;

setInterval(() => {
  if (reviews) {
    reviews.scrollTo({
      left: (scrollAmount += 300) % reviews.scrollWidth,
      behavior: "smooth",
    });
  }
}, 2000);
  
