import { signUp, logIn,resetPassword } from "./firebase.js";

// When the login button is clicked, call logIn() function
const logInButton = document.getElementById("logInButton");
logInButton.addEventListener("click", () =>logIn());

// When the sign up button is clicked, call signUp() function
const signUpButton = document.getElementById("signUpButton");
signUpButton.addEventListener("click", () =>signUp());

// When the forgot password button is clicked, call resetPassword() function
const forgotPasswordButton = document.getElementById("forgotPasswordButton");
forgotPasswordButton.addEventListener("click", () =>resetPassword());

//Reference to forms
const loginForm = document.getElementById('loginForm');
const signUpForm = document.getElementById('signUpForm');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');

// Display sign up form first
loginForm.style.display = "none"; 
signUpForm.style.display = "block"; 
forgotPasswordForm.style.display = "none"; 

// Shows and hide content
document.getElementById('showLogIn').addEventListener('click', () => {
    console.log("Login showing");
    loginForm.style.display = "block"; 
    signUpForm.style.display = "none"; 
    forgotPasswordForm.style.display = "none"; 
});

document.getElementById('showLogInFromPassword').addEventListener('click', () => {
    console.log("Login showing");
    loginForm.style.display = "block"; 
    signUpForm.style.display = "none"; 
    forgotPasswordForm.style.display = "none"; 
});
document.getElementById('showSignUp').addEventListener('click', () => {
    console.log("SignUp showing");
    loginForm.style.display = "none"; 
    signUpForm.style.display = "block";
    forgotPasswordForm.style.display = "none"; 
});
document.getElementById('showForgotPasswordSignUp').addEventListener('click', () => {
    console.log("Forgot password showing");
    loginForm.style.display = "none"; 
    signUpForm.style.display = "none"; 
    forgotPasswordForm.style.display = "block"; 
});
document.getElementById('showForgotPasswordLogIn').addEventListener('click', () => {
    console.log("Forgot password showing");
    loginForm.style.display = "none"; 
    signUpForm.style.display = "none"; 
    forgotPasswordForm.style.display = "block"; 
});