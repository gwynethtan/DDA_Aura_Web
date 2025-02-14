import { updateData,changePassword,updateRankData,deleteAccount,logOut} from "./firebase.js";

const editThoughtButton=document.getElementById("editThoughtButton")
editThoughtButton.addEventListener("click",  () =>editThought());

const textbox = document.getElementById("accountThought");

const changeUsernameButton=document.getElementById("changeUsernameButton")
changeUsernameButton.addEventListener("click",  () =>updateData("userDetails","username",document.getElementById("newUsername").value));

const changePasswordButton=document.getElementById("changePasswordButton")
changePasswordButton.addEventListener("click",  () =>changePassword());

const resetAuraButton=document.getElementById("resetAuraButton")
resetAuraButton.addEventListener("click",  () =>updateRankData("aura",0));

const logOutButton=document.getElementById("logOutButton")
logOutButton.addEventListener("click",  () =>logOut());

const deleteAccountButton=document.getElementById("deleteAccountButton")
deleteAccountButton.addEventListener("click",  () =>deleteAccount());

// Allows user to edit thought within the thought box
function editThought() {
    if(textbox.value=="Write my thoughts"){
        textbox.value="";
    }
    
    if (textbox.hasAttribute("readonly")) {
        textbox.removeAttribute("readonly");
        textbox.focus();
        editThoughtButton.innerHTML = `<img src="images/tick.png" alt="Edit" class="w-8 h-8">`;
    } else {
        updateData("thoughtDetails","thought",textbox.value);
        updateData("thoughtDetails","dateWritten",Math.floor(Date.now() / 1000));
        if(textbox.value==""){
            textbox.value="Write my thoughts";
        }
        textbox.setAttribute("readonly", true);
        editThoughtButton.innerHTML = `<img src="images/edit.png" alt="Edit" class="w-8 h-8">`;
    }

    const userText = textbox.value;
    console.log("User's input:", userText);

};

//Used to re adjust the size of the box
function autoResize(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 150) + "px"; // Max height of 300px
}


window.addEventListener("load", () => autoResize(textbox));
textbox.addEventListener("input", () => autoResize(textbox));