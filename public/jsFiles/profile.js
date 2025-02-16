import { updateData,changePassword,updateRankData,deleteAccount,logOut} from "./firebase.js";

// When the edit thought button is clicked, it will check if user wants to save or edit their thought
const editThoughtButton=document.getElementById("editThoughtButton")
editThoughtButton.addEventListener("click",  () =>editThought());

// When the forgot password button is clicked, call resetPassword() function
const textbox = document.getElementById("accountThought");

// When the change username button is clicked, updates the username node
const changeUsernameButton=document.getElementById("changeUsernameButton")
changeUsernameButton.addEventListener("click",  () =>updateData("userDetails","username",document.getElementById("newUsername").value));

// When the change password button is clicked, call changePassword() function
const changePasswordButton=document.getElementById("changePasswordButton")
changePasswordButton.addEventListener("click",  () =>changePassword());

// When the reset aura button is clicked, it updates their aura to 0
const resetAuraButton=document.getElementById("resetAuraButton")
resetAuraButton.addEventListener("click",  () =>updateRankData("aura",0));

// When the logout button is clicked, call logOut() function
const logOutButton=document.getElementById("logOutButton")
logOutButton.addEventListener("click",  () =>logOut());

// When the delete account password button is clicked, call deleteAccount() function
const deleteAccountButton=document.getElementById("deleteAccountButton")
deleteAccountButton.addEventListener("click",  () =>deleteAccount());

// Allows user to edit thought within the thought box
function editThought() {
    if(textbox.value=="Write my thoughts"){ // Default written value
        textbox.value="";
    }
    
    if (textbox.hasAttribute("readonly")) { // Allows user to write and save messages
        textbox.removeAttribute("readonly");
        textbox.focus();
        editThoughtButton.innerHTML = `<img src="images/tick.png" alt="Edit" class="w-8 h-8">`;
    } else { // Allows user to save written messages and edit them
        //Update their thoughts in database
        updateData("thoughtDetails","thought",textbox.value);
        updateData("thoughtDetails","dateWritten",Math.floor(Date.now() / 1000));
        if(textbox.value==""){
            textbox.value="Write my thoughts";
        }
        textbox.setAttribute("readonly", true);
        editThoughtButton.innerHTML = `<img src="images/edit.png" alt="Edit" class="w-8 h-8">`;
    }
};

//Used to re adjust the size of the box
function autoResize(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 150) + "px"; // Max height of 150
}


window.addEventListener("load", () => autoResize(textbox));
textbox.addEventListener("input", () => autoResize(textbox));