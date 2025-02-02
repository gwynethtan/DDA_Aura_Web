import { rankData } from "/DDA_Aura_Web/jsFiles/firebase.js";

const sortAuraButton = document.getElementById("sortAura");
sortAuraButton.addEventListener("click", () =>rankData("aura"));

// When the capture button is clicked, call capturePhoto() function
const sortLikesButton = document.getElementById("sortLikes");
sortLikesButton.addEventListener("click", () =>rankData("thoughtLikes"));      
      
rankData("thoughtLikes");