import { loadThoughts,updateUserRankData,appendData,deleteData} from "/DDA_Aura_Web/jsFiles/firebase.js";

loadThoughts();

//pls chk on this in chat gpt
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("likeButton")) {
        likeClick(event);
    }
});


//likes["uid"] = true;

function likeClick(event) {
    const button = event.target;
    const likeButtonContainer = button.parentElement; // Get the parent div
    const likesCountElement = likeButtonContainer.querySelector('.likesCount'); // Get the likes count element
    const userId = likeButtonContainer.dataset.thoughtId; //Reference to post that is liked

    // 1. Update the UI immediately (optimistic update):
    let likesCount = parseInt(likesCountElement.textContent);
    
      // Toggle the heart image (optional):
      if (button.src.includes("heartEmpty.png")) {
        button.src = "/DDA_Aura_Web/images/heartColored.png";
        likesCount++; //Increment
        likesCountElement.textContent = likesCount;
        appendData("thoughtDetails","likedThoughts",userId,true);
      } 
      else{
        button.src = "/DDA_Aura_Web/images/heartEmpty.png";
        likesCount-- // decrement if unliking
        likesCountElement.textContent = likesCount;
        deleteData("thoughtDetails","likedThoughts",userId)
      }

      updateUserRankData(userId,"thoughtLikes",likesCount);
  }