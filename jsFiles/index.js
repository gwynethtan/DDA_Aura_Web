import { signUp, logIn } from "/DDA_Aura_Web/jsFiles/firebase.js";

// When the capture button is clicked, call capturePhoto() function
const logInButton = document.getElementById("logInButton");
logInButton.addEventListener("click", () =>logIn());

// When the capture button is clicked, call capturePhoto() function
const signUpButton = document.getElementById("signUpButton");
signUpButton.addEventListener("click", () =>signUp());

//Login and sign up form 
const loginForm = document.getElementById('loginForm');
const signUpForm = document.getElementById('signUpForm');
document.getElementById('showLogin').addEventListener('click', () => {
    loginForm.classList.remove('hidden');
    signUpForm.classList.add('hidden');
});
document.getElementById('showSignUp').addEventListener('click', () => {
    signUpForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
});