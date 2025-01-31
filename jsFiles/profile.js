import { updateData } from "/DDA_Aura_Web/jsFiles/firebase.js";

// When the capture button is clicked, call capturePhoto() function
const logInButton = document.getElementById("logInButton");
logInButton.addEventListener("click", logIn);

// When the capture button is clicked, call capturePhoto() function
const signUpButton = document.getElementById("signUpButton");
signUpButton.addEventListener("click", signUp);