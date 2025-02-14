    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
    import { getDatabase,update,onValue,remove,push, ref, get, set,query,limitToFirst,limitToLast,orderByChild,equalTo,runTransaction} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
    import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut ,sendPasswordResetEmail,deleteUser } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

    const firebaseConfig = {
        apiKey: "AIzaSyDbN7jCv9kMZZaJIV9gm9R-dpZmcYYj0-s",
        authDomain: "dda-aura-database.firebaseapp.com",
        databaseURL: "https://dda-aura-database-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "dda-aura-database",
        storageBucket: "dda-aura-database.firebasestorage.app",
        messagingSenderId: "891920213301",
        appId: "1:891920213301:web:a7c2edd2d563a00011987c"
      };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const auth = getAuth(app);
    const usersRef = ref(db, "users");
    var currentUserId="";
    export { currentUserId };

    // sign up
    export async function signUp() {
        event.preventDefault(); // Prevent the default form submission
        const username = document.getElementById("signUpUsername").value;
        const email = document.getElementById("signUpEmail").value;
        const password = document.getElementById("signUpPassword").value;

        if (username == "") {
            alert("Please enter a username");
            return;
        }

        if (email == "") {
            alert("Please enter an email");
            return;
        }

        if (password == "") {
            alert("Please enter a 6-character password");
            return;
        }

        createUserWithEmailAndPassword(auth,email, password)
            .then((userCredential) => {
                // User successfully created
                const user = userCredential.user;
                // Save additional user details in Realtime Database
                const newPlayerRef = ref(db, 'users/' + user.uid); // Use UID as a unique identifier

                return set(newPlayerRef,{// Use the correct database reference
                    aura: 0,
                    thoughtLikes: 0,
                    userDetails: {
                        username: username,
                        email: email,
                        dateCreated: Math.floor(Date.now() / 1000),
                        userOnline: true,
                        profilePhoto: "https://qabrcgzafrzbwrtrezqc.supabase.co/storage/v1/object/public/images/profilePhotos/default.png",
                        
                    },
                    imagesTaken: {
                    },
                    thoughtDetails: {
                        thought: "",
                        dateWritten:Math.floor(Date.now() / 1000),
                        likedThoughts: {}
                    
                    }
                });
            })
            .then(() => {
                alert("Signup successfully!");
                window.location.href = "home.html"; // Go to home page
            })
            .catch((error) => {
                console.error("Error during sign-up or database operation:", error);
                alert("Failed to sign up : " + error.message);
            });

    };


    function dateConvert(unixTimestamp){
        const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
        // Format to DD/MM/YY
        const formattedDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        });
        return formattedDate;
    }

    //Log in 
    export async function logIn(){
        event.preventDefault(); 
        const email = document.getElementById("logInEmail").value;
        const password = document.getElementById("logInPassword").value;
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            alert("Login successful");
            window.location.href = "home.html"; // Go to home page
        })
        .catch((error) => {
            const errorMessage = error.message;
            alert("Login failed: " + errorMessage);
        });
    };

    //Reset password
    export async function changePassword(){  
        console.log(currentUserId);
        if (currentUserId != "") {
            const userRef = ref(db, 'users/' + currentUserId + '/userDetails');
            try {
                const snapshot = await get(userRef); // Wait for the data to be fetched
                if (snapshot.exists()) {
                    var email = snapshot.val().email;
                    console.log("Fetched email:", email);
                } else {
                    console.log("No data available for the user.");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        } else {
            var email = document.getElementById("forgotPasswordEmail").value; // Get email from input field
            console.log(currentUserId);
            console.log(email);
        }
    
        
        
        sendPasswordResetEmail(auth, email)
        .then(() => {
            alert("Password reset email sent. Check your inbox to reset your password.");
            currentUserId="";
            updateData("userDetails","userOnline",false);
            window.location.href = "index.html"; // Go to home page
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Error sending password reset email:", errorCode, errorMessage);
            alert("Error sending password reset email: " + errorMessage); // Display error to user

            if (errorCode === 'auth/user-not-found') {
                alert("Email does not exist");
            } else if (errorCode === 'auth/invalid-email') {
                alert("Email is invalid.Check your email formatting");
            }
        });
    }


    //Reset password
    export async function resetPassword(){  
        var email = document.getElementById("forgotPasswordEmail").value; // Get email from input field
        console.log(email);
        
        sendPasswordResetEmail(auth, email)
        .then(() => {
            alert("Password reset email sent. Check your inbox to reset your password.");
            window.location.href = "index.html"; // Go to home page
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Error sending password reset email:", errorCode, errorMessage);
            alert("Error sending password reset email: " + errorMessage); // Display error to user

            if (errorCode === 'auth/user-not-found') {
                alert("Email does not exist");
            } else if (errorCode === 'auth/invalid-email') {
                alert("Email is invalid.Check your email formatting");
            }
        });
    }
    

    // Function to handle logout
    export async function logOut() {
        signOut(auth).then(() => {
            alert("Logout successful");
            updateData("userDetails","userOnline",false);
            window.location.href = "index.html"; // Go to sign up page
        });
    }


    onAuthStateChanged(auth, (user) => {
        if (user) {
         currentUserId = user.uid;
         updateData("userDetails","userOnline",true);
         const rankRef = ref(db, 'users/' + currentUserId );    
         const detailsRef = ref(db, 'users/' + currentUserId + '/userDetails');
         const thoughtRef = ref(db, 'users/' + currentUserId + '/thoughtDetails');
         const imageRef = ref(db, 'users/' + currentUserId + '/imagesTaken');

         get(rankRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const rankedData = snapshot.val();
                    document.getElementById("accountAura").textContent = `${rankedData.aura} aura`;
                    document.getElementById("accountLikes").textContent = `${rankedData.thoughtLikes}`;
                } else {
                    //console.log("No data available for the user.");
                }
            })
            .catch((error) => {
                //console.error("Error fetching user data:", error);
            });
    
            get(detailsRef)
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const userData = snapshot.val();
                        var date=dateConvert(userData.dateCreated); //Convert into DD/MM/YY
                        document.getElementById("accountPhoto").src = `${userData.profilePhoto}`;
                        document.getElementById("accountUsername").textContent = `${userData.username}`;
                        document.getElementById("accountEmail").textContent = `${userData.email}`;
                        document.getElementById("accountDate").textContent = `${date}`;
                    } else {
                        //console.log("No data available for the user.");
                    }
                })
                .catch((error) => {
                    //console.error("Error fetching user data:", error);
                });
    
            get(thoughtRef) 
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const thoughtData = snapshot.val();
                        if(thoughtData.thought!=""){
                            document.getElementById("accountThought").textContent = `${thoughtData.thought}`;
                        }
                    } else {
                        console.log("No thought data available for the user."); 
                    }
                })
                .catch((error) => {
                    console.error("Error fetching thought data:", error);  
                });

            onValue(imageRef, (snapshot) => {
                const noImageDesign = document.getElementById('noImageDesign');
                const image = snapshot.val(); // Object with unique keys
                if (image==null){
                    noImageDesign.style.display = "block"; // Hide
                }
                else{
                    noImageDesign.style.display = "none"; // Show
                    const imageValues = Object.values(image); // Extract only the values (images)
                    imageValues.forEach(image => {
                        console.log (image);
                        document.getElementById("selfTakenImagesContainer").innerHTML+=`              
                        <div>
                            <img class="rounded-lg object-cover w-full h-full" src=${image} alt="Images taken by you">
                        </div>`
                    });
                }

            }); 

        } 

    });

    export async function updateData(node,data,updatedData) {
        const userRef = ref(db, 'users/' + currentUserId);
        const updates = {};
        updates['/'+node+'/'+data] = updatedData;     
        update(userRef, updates)
        .then(() => {
            console.log("Data updated successfully!");
        })
        .catch((error) => {
            console.error("Error updating data:", error);
        });
    }

    // Used to change data that is ranked of the user
    export async function updateRankData(data,updatedData) {
        const userRef = ref(db, 'users/' + currentUserId);
        const updates = {};
        updates['/'+data] = updatedData; 
        console.log(updatedData);
    
        update(userRef, updates)
        .then(() => {
            console.log("Data updated successfully!");
        })
        .catch((error) => {
            console.error("Error updating data:", error);
        });
    }


    export async function appendData(node, data, newNode,newValue) {
        const arrayRef = ref(db, 'users/' + currentUserId + '/' + node +'/' + data);
        const newKeyValuePair = {
            [newNode]: newValue
          };
          
          update(arrayRef, newKeyValuePair) 
            .then(() => console.log("Data added successfully"))
            .catch((error) => console.error("Error:", error));
    }

    // Used to update post likes for the creator
    export async function updateUserRankData(userId,data,updatedData) {
        const userRef = ref(db, 'users/' + userId);
        const updates = {};
        updates['/'+data] = updatedData; 
        console.log(updatedData);
    
        update(userRef, updates)
        .then(() => {
            console.log("Data updated successfully!");
        })
        .catch((error) => {
            console.error("Error updating data:", error);
        });
    }

  
    export async function deleteAccount() {
        const userRef = ref(db, 'users/' + currentUserId);
        const authUser=auth.currentUser;
        await deleteUser(authUser)
        .then(() => {
            console.log("Account has been deleted on auth side");
        })
        .catch((error) => {
            console.error("Error updating data:", error);
        });
    
        await remove(userRef)
        .then(() => {
            console.log("Account has been deleted on database side");
            alert("Account has been deleted");
            window.location.href = "index.html"; // Go to sign up page
        })
        .catch((error) => {
            console.error("Error updating data:", error);
        });
    
    }

    export async function deleteData(node,subNode,data) {
        const deleteRef = ref(db, 'users/' + currentUserId + '/' + node +'/' + subNode +'/' + data);
        remove(deleteRef)
        .then(() => {
            console.log("Data updated successfully!");
        })
        .catch((error) => {
            console.error("Error updating data:", error);
        });
    }

    // Insert image url into firebase
    export async function firebaseUpload(urlUpload)  {
        alert('Upload success. The url is '+urlUpload); 
        const accountPhoto = document.getElementById("accountPhoto");
        accountPhoto.src = urlUpload; 
        updateData("userDetails","profilePhoto",urlUpload);
    };


    export async function loadThoughts() {
        get(ref(db, '/users'))
          .then((snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              Object.keys(data).forEach(userId => {
                const userUsername = data[userId]?.userDetails?.username;
                const userPhoto = data[userId]?.userDetails?.profilePhoto;
                const userThought = data[userId]?.thoughtDetails?.thought;
                const userDate = dateConvert(data[userId]?.thoughtDetails?.dateWritten); //Convert into DD/MM/YY
                const userThoughtLikes = data[userId]?.thoughtLikes;
      
                if (userThought != "") {
                  document.getElementById("thoughtContainer").innerHTML += `
                    <div class="grid-item mx-3" style="width:320px">
                      <div class="pt-4 pb-5 px-3 mb-5 border border-gray-200 rounded-lg shadow-sm my-bg-blue relative">
                        <div class="relative -top-7 -left-8 flex items-center">
                          <img
                            id="userPhoto"
                            class="w-16 h-16 rounded-full cursor-pointer object-cover border-4 border-white shadow-md sm:w-20 sm:h-20"
                            src=${userPhoto}
                            alt="User dropdown"
                          />
                          <span id="userName" class="text-white font-bold inline-block pt-5 pl-4 md:text-xl sm:text-lg">${userUsername}</span>
                        </div>
                        <p class="text-white text-xs md:text-base text-justify break-words relative -top-3">
                          ${userThought}
                        </p>
                        <div class="flex justify-between pt-2">
                          <p class="text-white text-sm font-bold">${userDate}</p>
                          <div data-thought-id="${userId}">
                            <img
                              type="button"
                              class="likeButton w-5 h-5 cursor-pointer object-cover inline-block"
                              src="./images/heartEmpty.png"
                              alt="User dropdown"
                            />
                            <p class="likesCount text-white text-sm font-bold inline-block pl-2">${userThoughtLikes}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  `;
                }
      
                loadUserLikedPosts();
              });
      
              // Use setTimeout to defer Masonry initialization
              setTimeout(() => {
                const grid = document.getElementById('thoughtContainer');
      
                // Initialize Masonry
                const masonry = new Masonry(grid, {
                  itemSelector: '.grid-item',
                  columnWidth: '.grid-item',
                  fitWidth: true,
                  gutter: 5,
                });
      
                masonry.layout();
      
                // Listen for the layoutComplete event
                masonry.on('layoutComplete', () => console.log("Masonry layout complete"));
              }, 0); // Even a 0ms delay ensures the DOM updates before Masonry runs
            } else {
              console.log("No data available");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }

    // Display the posts liked by the current user previously
    export async function loadUserLikedPosts() {
        const postsRef = ref(db, 'users/' + currentUserId + '/thoughtDetails/likedThoughts');
        onValue(postsRef, (snapshot) => {
            const posts = snapshot.val(); 
            const creatorUserIdList = Object.keys(posts); // Extract the creator's userId for the liked post
            creatorUserIdList.forEach(creatorUserId => {
                const likeButton = document.querySelector(`[data-thought-id="${creatorUserId}"] .likeButton`); //Finding like button of the post liked
                likeButton.src = "./images/heartColored.png"; // Change image to filled heart
            });
        });    
     }





      export async function rankData(dataType) {    
        // Order by aura DESCENDING (highest first) and limit to 2
        var rankedQueryType = query(usersRef, orderByChild(dataType), limitToLast(50));
    
        document.getElementById("rankContainer").innerHTML = ""; // Clear existing list
    
        get(rankedQueryType).then((snapshot) => {
            if (snapshot.exists()) {
                try {

                    const rankedUsers = []; // Array to store user data

                    snapshot.forEach((child) => {
                        rankedUsers.push(child.val()); // Add user data to the array
                    });
    
                    // Reverse the array to show the highest value first
                    rankedUsers.reverse();
    
                    // Sort the array in DESCENDING order of aura (important!)
    
                    rankedUsers.forEach((user, index) => { // Now iterate the sorted array!
                        const rankNumber = index + 1; // Rank number (1-based index)
                        const rankProfilePhoto = user.userDetails.profilePhoto;
                        const rankUsername = user.userDetails.username;
                        const rankAura = user.aura;
                        const rankLikes = user.thoughtLikes;
    
                        document.getElementById("rankContainer").innerHTML += `
                            <div class="space-y-2 mt-3">
                                <div class="grid grid-cols-6 gap-2 items-center py-2 px-4 my-bg-grey my-blue rounded-lg shadow-md">
                                    <div class="text-left">${rankNumber}</div>
                                    <div class="text-left flex items-center whitespace-nowrap col-span-3">
                                        <img class="w-8 h-8 rounded-full" src="${rankProfilePhoto}" />
                                        <span class="pl-2">${rankUsername}</span>
                                    </div>
                                    <div class="text-left">${rankAura}</div>
                                    <div class="text-left">${rankLikes}</div>
                                </div>
                            </div>`;
                    });
    
                } catch (error) {
                    console.log(error);
                    document.getElementById("rankContainer").innerHTML += `<li class="text-red-500">Error loading user data</li>`;
                }
            } else {
                document.getElementById("rankContainer").innerHTML += `<li class="text-red-500">No user data available</li>`;
            }
        }).catch((error) => {
            console.error(error);
            document.getElementById("rankContainer").innerHTML += `<li class="text-red-500">Error fetching data from database</li>`;
        });
    }




    export async function generateChart() {
        const top5Aura = query(usersRef, orderByChild('aura'), limitToLast(5));
        const top5ThoughtLikes = query(usersRef, orderByChild('thoughtLikes'), limitToLast(5));
        
        var totalUsers = 0;
        var totalOnlineUsers = 0;
        
        var usersBelowEqual500Aura = 0;
        var usersBelowEqual1000Aura = 0;
        var usersBelowEqual1500Aura = 0;

        var usersBelowEqual40ThoughtLikes = 0;
        var usersBelowEqual60ThoughtLikes = 0;
        var usersBelowEqual100ThoughtLikes = 0;
    
        const top5AuraCanvas = document.getElementById("top5AuraCanvas");
        const top5ThoughtLikesCanvas = document.getElementById("top5ThoughtLikesCanvas");
        const auraDistributionCanvas = document.getElementById("auraDistributionCanvas");
        const thoughtLikesDistributionCanvas = document.getElementById("thoughtLikesDistributionCanvas");
        const onlineCanvas = document.getElementById("onlineCanvas");

        const top5AuraChart = new Chart(top5AuraCanvas, {
            type: "bar",
            data: {
                labels: [],
                datasets: [{ label: "Top 5 Player Scores", data: [] }],
            },
        });
    
        get(top5Aura).then((snapshot) => {
            if (snapshot.exists()) {
                top5AuraChart.data.labels = [];
                top5AuraChart.data.datasets[0].data = [];
    
                snapshot.forEach((childSnapshot) => {
                    const rankedUser = childSnapshot.val();
                    const name = rankedUser.userDetails.username;
                    const aura = Number(rankedUser.aura);
    
                    if (name && !isNaN(aura)) {
                        top5AuraChart.data.labels.push(name);
                        top5AuraChart.data.datasets[0].data.push(aura);
                    }
                });
    
                top5AuraChart.update();
            } else {
                console.log("No data available");
                const noDataElement = document.getElementById("no-data");
                if (noDataElement) noDataElement.innerHTML = "No data available";
            }
        }).catch((error) => {
            console.log("Error fetching data:", error);
        });
    


        const top5ThoughtLikesChart = new Chart(top5ThoughtLikesCanvas, {
            type: "bar",
            data: {
                labels: [],
                datasets: [{ label: "Top 5 Thought Likes", data: [] }],
            },
        });
    
        get(top5ThoughtLikes).then((snapshot) => {
            if (snapshot.exists()) {
                top5ThoughtLikesChart.data.labels = [];
                top5ThoughtLikesChart.data.datasets[0].data = [];
    
                snapshot.forEach((childSnapshot) => {
                    const rankedUser = childSnapshot.val();
                    const name = rankedUser.userDetails.username;
                    const thoughtLikes = Number(rankedUser.thoughtLikes);
    
                    if (name && !isNaN(thoughtLikes)) {
                        top5ThoughtLikesChart.data.labels.push(name);
                        top5ThoughtLikesChart.data.datasets[0].data.push(thoughtLikes);
                    }
                });
    
                top5ThoughtLikesChart.update();
            } else {
                console.log("No data available");
                const noDataElement = document.getElementById("no-data");
                if (noDataElement) noDataElement.innerHTML = "No data available";
            }
        }).catch((error) => {
            console.log("Error fetching data:", error);
        });


        const auraDistributionChart = new Chart(auraDistributionCanvas, {
            type: "doughnut",
            data: {
                labels: ["0-500 aura", "501-1000 aura", "1001-1500 aura"],
                datasets: [{
                    label: "Aura distribution",
                    data: [0,0,0],
                    backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)","rgb(191, 196, 99)"],
                    hoverOffset: 4
                }]
            }
        });
        get(usersRef).then((snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    const user = childSnapshot.val();
                    const aura=user.aura;
                    if (aura <= 500) {
                        usersBelowEqual500Aura++;
                    } else if (aura <= 1000) {
                        usersBelowEqual1000Aura++;
                    } else {
                        usersBelowEqual1500Aura++;
                    }
                });
        
                // Update only the data
                auraDistributionChart.data.datasets[0].data = [usersBelowEqual500Aura,usersBelowEqual1000Aura,usersBelowEqual1500Aura];
                auraDistributionChart.update();
            } else {
                console.log("No data available");
                document.getElementById("no-data").innerHTML = "No data available";
            }
        }).catch((error) => {
            console.log("Error fetching data:", error);
        });



        const thoughtLikesDistributionChart = new Chart(thoughtLikesDistributionCanvas, {
            type: "doughnut",
            data: {
                labels: ["0-40 likes", "41-60 likes", "61-100 likes"],
                datasets: [{
                    label: "Thought likes distribution",
                    data: [0,0,0], // Initialize with 0 values
                    backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)","rgb(191, 196, 99)"],
                    hoverOffset: 4
                }]
            }
        });

        get(usersRef).then((snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    const user = childSnapshot.val();
                    const thoughtLikes = Number(user.thoughtLikes);
                    if (thoughtLikes <= 40) {
                        usersBelowEqual40ThoughtLikes++;
                    } else if (thoughtLikes <= 60) {
                        usersBelowEqual60ThoughtLikes++;
                    } else {
                        usersBelowEqual100ThoughtLikes++;
                    }
                });
        
                // Update only the data
                thoughtLikesDistributionChart.data.datasets[0].data = [usersBelowEqual40ThoughtLikes,usersBelowEqual60ThoughtLikes,usersBelowEqual100ThoughtLikes];
                thoughtLikesDistributionChart.update();
            } else {
                console.log("No data available");
                document.getElementById("no-data").innerHTML = "No data available";
            }
        }).catch((error) => {
            console.log("Error fetching data:", error);
        });
        

        
        const onlineChart = new Chart(onlineCanvas, {
            type: "doughnut",
            data: {
                labels: ["Online users", "Offline users"],
                datasets: [{
                    label: "User Status",
                    data: [0, 0], // Initialize with 0 values
                    backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
                    hoverOffset: 4
                }]
            }
        });
        
        get(usersRef).then((snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    const onlineUser = childSnapshot.val();
                    totalUsers++;
                    if (onlineUser.userDetails.userOnline) {
                        
                        totalOnlineUsers++;
                    }
                });
        
                // Update only the data
                onlineChart.data.datasets[0].data = [totalOnlineUsers, totalUsers - totalOnlineUsers];
                onlineChart.update();
            } else {
                console.log("No data available");
                document.getElementById("no-data").innerHTML = "No data available";
            }
        }).catch((error) => {
            console.log("Error fetching data:", error);
        });
        





    }
    
