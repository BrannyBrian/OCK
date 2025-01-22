// Firebase Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Toggle Menu
document.getElementById("hamburger").addEventListener("click", () => {
  document.getElementById("menu").classList.toggle("hidden");
});

// Firebase Auth
document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((user) => alert("Login successful!"))
    .catch((err) => alert(err.message));
});

// Hamburger Menu
document.getElementById("hamburger").addEventListener("click", () => {
  document.getElementById("menu").classList.toggle("hidden");
});

// Testimonials Scroll
const reviews = document.querySelector(".reviews");
let scrollAmount = 0;
setInterval(() => {
  reviews.scrollTo({
    left: (scrollAmount += 300) % reviews.scrollWidth,
    behavior: "smooth"
  });
}, 2000);
                                                      
