import { updateData } from "/DDA_Aura_Web/jsFiles/firebase.js";

const editThoughtButton=document.getElementById("editThought")
editThoughtButton.addEventListener("click",  () =>editThought());
let textbox = document.getElementById("accountThought");

function editThought() {
    if(textbox.value=="Write my thoughts"){
        textbox.value="";
    }
    
    if (textbox.hasAttribute("readonly")) {
        textbox.removeAttribute("readonly");
        textbox.focus();
        editThoughtButton.innerHTML = `<img src="/DDA_Aura_Web/images/tick.png" alt="Save" class="w-8 h-8">`;
    } else {
        updateData("thoughtDetails","thought",textbox.value);
        updateData("thoughtDetails","dateWritten",Math.floor(Date.now() / 1000));
        if(textbox.value==""){
            textbox.value="Write my thoughts";
        }
        textbox.setAttribute("readonly", true);
        editThoughtButton.innerHTML = `<img src="/DDA_Aura_Web/images/edit.png" alt="Edit" class="w-8 h-8">`;
    }

    const userText = textbox.value;
    console.log("User's input:", userText);

};

function autoResize(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 150) + "px"; // Max height of 300px
}


window.addEventListener("load", () => autoResize(textbox));
textbox.addEventListener("input", () => autoResize(textbox));