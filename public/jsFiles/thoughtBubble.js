import { loadThoughts,updateUserRankData,appendData,deleteData} from "./firebase.js";

await loadThoughts(); // Ensure loadThoughts is finished before proceeding

// Detects for clicks
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("likeButton")) { // Checks if user is liking the post 
        likeClick(event); 
    }
});

// Allows user to unlike and like a post, which would still reappear when user reloads the page
function likeClick(event) {
    const button = event.target;
    const likeButtonContainer = button.parentElement; // Get the parent div
    const likesCountElement = likeButtonContainer.querySelector('.likesCount'); // Get the likes count element
    const userId = likeButtonContainer.dataset.thoughtId; //Reference to post that is liked
    let likesCount = parseInt(likesCountElement.textContent);
    
      // Toggle the heart image. Checks if thought is liked or unliked.
      if (button.src.includes("heartEmpty.png")) {
        button.src = "./images/heartColored.png"; // Shows filled heart 
        likesCount++; //Increment
        likesCountElement.textContent = likesCount;
        appendData("thoughtDetails","likedThoughts",userId,true);
      } 
      else{
        button.src = "./images/heartEmpty.png"; // Shows empty heart
        likesCount-- // Decrement 
        likesCountElement.textContent = likesCount;
        deleteData("thoughtDetails","likedThoughts",userId)
      }
      updateUserRankData(userId,"thoughtLikes",likesCount);
  }