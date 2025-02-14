import { signUp, logIn,resetPassword } from "./firebase.js";

// When the capture button is clicked, call capturePhoto() function
const logInButton = document.getElementById("logInButton");
logInButton.addEventListener("click", () =>logIn());

// When the capture button is clicked, call capturePhoto() function
const signUpButton = document.getElementById("signUpButton");
signUpButton.addEventListener("click", () =>signUp());

// When the capture button is clicked, call capturePhoto() function
const forgotPasswordButton = document.getElementById("forgotPasswordButton");
forgotPasswordButton.addEventListener("click", () =>resetPassword());

//Login and sign up form 
const loginForm = document.getElementById('loginForm');
const signUpForm = document.getElementById('signUpForm');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
loginForm.style.display = "none"; // Show
signUpForm.style.display = "block"; // Hide
forgotPasswordForm.style.display = "none"; // Hide

document.getElementById('showLogIn').addEventListener('click', () => {
    console.log("Login showing");
    loginForm.style.display = "block"; // Show
    signUpForm.style.display = "none"; // Hide
    forgotPasswordForm.style.display = "none"; // Hide
});

document.getElementById('showLogInFromPassword').addEventListener('click', () => {
    console.log("Login showing");
    loginForm.style.display = "block"; // Show
    signUpForm.style.display = "none"; // Hide
    forgotPasswordForm.style.display = "none"; // Hide
});
document.getElementById('showSignUp').addEventListener('click', () => {
    console.log("SignUp showing");
    loginForm.style.display = "none"; // Show
    signUpForm.style.display = "block"; // Hide
    forgotPasswordForm.style.display = "none"; // Hide
});
document.getElementById('showForgotPasswordSignUp').addEventListener('click', () => {
    console.log("Forgot password showing");
    loginForm.style.display = "none"; // Show
    signUpForm.style.display = "none"; // Hide
    forgotPasswordForm.style.display = "block"; // Hide
});
document.getElementById('showForgotPasswordLogIn').addEventListener('click', () => {
    console.log("Forgot password showing");
    loginForm.style.display = "none"; // Show
    signUpForm.style.display = "none"; // Hide
    forgotPasswordForm.style.display = "block"; // Hide
});