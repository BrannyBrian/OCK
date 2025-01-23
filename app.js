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

// Elements for Forgot Password functionality
const forgotPasswordLink = document.getElementById("forgot-password-link");
const loginForm = document.getElementById("login-form");
const forgotPasswordForm = document.createElement("form");
forgotPasswordForm.id = "forgot-password-form";
forgotPasswordForm.classList.add("hidden");
forgotPasswordForm.innerHTML = `
  <h2><i class="fas fa-envelope"></i> Reset Password</h2>
  <input type="email" placeholder="Enter your email" id="reset-email" required>
  <button type="submit">Send Reset Link</button>
  <p><span id="back-to-login">Back to Login</span></p>
`;

// Add the Forgot Password form dynamically to the DOM
document.getElementById("popup-container").appendChild(forgotPasswordForm);

// Event: Toggle to Forgot Password form
forgotPasswordLink.addEventListener("click", () => {
  loginForm.classList.add("hidden");
  forgotPasswordForm.classList.remove("hidden");
});

// Event: Toggle back to Login form
document.getElementById("back-to-login").addEventListener("click", () => {
  forgotPasswordForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
});

// Event: Send Password Reset Email
forgotPasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const resetEmail = document.getElementById("reset-email").value;

  try {
    await sendPasswordResetEmail(auth, resetEmail);
    alert("Password reset email sent! Check your inbox.");
    // Optionally toggle back to the login form
    forgotPasswordForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});
  

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
    alert("Passwords do not match!");
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

    alert("Sign-Up successful!");
  } catch (error) {
    alert(`Error: ${error.message}`);
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
      console.log("User Data:", docSnap.data());
      alert("Login successful!");
    } else {
      alert("No user data found!");
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
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

    alert(`${isSignup ? "Google Sign-Up" : "Google Login"} successful!`);
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
};

document.getElementById("google-login").addEventListener("click", () => googleHandler(false));
document.getElementById("google-signup").addEventListener("click", () => googleHandler(true));
  
