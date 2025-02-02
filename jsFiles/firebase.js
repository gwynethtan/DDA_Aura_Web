    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
    import { getDatabase,update,onValue,remove,push, ref, get, set,query,limitToFirst,limitToLast,orderByChild,equalTo} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
    import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut ,sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

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
    const imageRef = ref(db, "images");
    const auth = getAuth(app);
    const usersRef = ref(db, "users");
    var currentUserId="";

    // sign up
    export async function signUp() {
        event.preventDefault(); // Prevent the default form submission
        alert("hi");
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
                alert(user);
                // Save additional user details in Realtime Database
                const newPlayerRef = ref(db, 'users/' + user.uid); // Use UID as a unique identifier

                return set(newPlayerRef,{// Use the correct database reference
                    userDetails: {
                        username: username,
                        email: email,
                        isAdmin: false,
                        dateCreated: Date.now(),
                        playerOnline: true,
                        profilePhoto: "https://pnghq.com/wp-content/uploads/pnghq.com-default-pfp-png-with-vibr-4.png",
                        aura: 0
                    },
                    imagesTaken: {
                        url: ""
                    },
                    thoughtDetails: {
                        thought: "",
                        thoughtLikes: 0
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
            const errorCode = error.code;
            const errorMessage = error.message;
            alert("Login failed: " + errorMessage);
        });
    };



    //Reset password
    export async function resetPassword(){
        if (currentUserId!=null){
            const email=currentUserId.userDetails.email;
        }
        else{
            const email = document.getElementById("email").value; // Get the user's email from an input field
        }
        
        sendPasswordResetEmail(auth, email)
        .then(() => {
            alert("Password reset email sent. Check your inbox to reset your password.");
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
            window.location.href = "index.html"; // Go to sign up page
        });
    }


    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is logged in
         currentUserId = user.uid;    
            const detailsRef = ref(db, 'users/' + currentUserId + '/userDetails');
            const thoughtRef = ref(db, 'users/' + currentUserId + '/thoughtDetails');
    
            get(detailsRef)
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const userData = snapshot.val();
                        document.getElementById("accountPhoto").src = `${userData.profilePhoto}`;
                        document.getElementById("accountUsername").textContent = `${userData.username}`;
                        document.getElementById("accountEmail").textContent = `${userData.email}`;
                        document.getElementById("accountAura").textContent = `${userData.aura}`;
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
                        document.getElementById("accountLikes").textContent = `${thoughtData.thoughtLikes} likes`;
                        //document.getElementById("accountThought").textContent = `${thoughtData.thought}`;
                    } else {
                        //console.log("No thought data available for the user."); 
                    }
                })
                .catch((error) => {
                    //console.error("Error fetching thought data:", error);  
                });
        } 
    });

    export async function updateData(node,data,updatedData) {
        const userRef = ref(db, 'users/' + currentUserId);
        const updates = {};
        updates['/'+node+'/'+data] = updatedData; 
        console.log(updatedData);
    
        update(userRef, updates)
        .then(() => {
            alert("Data updated successfully!");
        })
        .catch((error) => {
            console.error("Error updating data:", error);
        });
    }

    export async function updateUserData(userId,node,data,updatedData) {
        const userRef = ref(db, 'users/' + userId);
        const updates = {};
        updates['/'+node+'/'+data] = updatedData; 
        console.log(updatedData);
    
        update(userRef, updates)
        .then(() => {
            alert("Data updated successfully!");
        })
        .catch((error) => {
            console.error("Error updating data:", error);
        });
    }

    export async function deleteAccount() {
        const userRef = ref(db, 'users/' + currentUserId);
    
        remove(userRef)
        .then(() => {
            console.log("Data updated successfully!");
            window.location.href = "index.html"; // Go to sign up page
        })
        .catch((error) => {
            console.error("Error updating data:", error);
        });
    
    }

    // Insert image url into firebase
    export async function firebaseUpload(urlUpload)  {
        alert('Upload success. The url is '+urlUpload); 
        const newImageRef = ref(db, 'images/' + Date.now()); // Use a timestamp as a unique ID

        const accountPhoto = document.getElementById("accountPhoto");
        accountPhoto.src = urlUpload; 

        updateData("userDetails","profilePhoto",urlUpload);
    };


    export async function loadThoughts() {
        get(ref(db, '/users'))
          .then((snapshot) => {
            if (snapshot.exists()) {
              var thoughtContent="";
              const data = snapshot.val();
              Object.keys(data).forEach(userId => {
                const userUsername = data[userId]?.userDetails?.username;
                const userPhoto = data[userId]?.userDetails?.profilePhoto;
                const userThought = data[userId]?.thoughtDetails?.thought;
                const userThoughtLikes = data[userId]?.thoughtDetails?.thoughtLikes;
                thoughtContent+=`
                      <div class="mx-3">
                        <div class="max-w-sm pt-4 pb-5 px-3 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 relative">
                            <div class="relative -top-7 -left-8 flex items-center">
                                <img
                                id="userPhoto"
                                class="w-16 h-16 rounded-full cursor-pointer object-cover border-4 border-white shadow-md sm:w-20 sm:h-20"
                                src=${userPhoto}
                                alt="User dropdown"
                                />
                                <span id="userName" class="text-white font-bold inline-block pt-5 pl-4 md:text-xl sm:text-lg">${userUsername}</span>
                            </div>
                            <p class="text-white text-xs md:text-base text-justify relative -top-3">
                                ${userThought}
                            </p>

                            <div class="flex justify-between pt-2">
                                <p class="text-white text-sm font-bold">13/05/23</p>
                                <div data-thought-id="${userId}">
                                    <img
                                    type="button"
                                    
                                    class="likeButton w-5 h-5 cursor-pointer object-cover inline-block"
                                    src="/DDA_Aura_Web/images/heartEmpty.png"
                                    alt="User dropdown"
                                    />
                                    <p class="likesCount text-white text-sm font-bold inline-block pl-2">${userThoughtLikes}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                
                `
                document.getElementById("thoughtContainer").innerHTML+=thoughtContent;
              });
              
            } else { // The 'else' block is now correctly placed here
              console.log("No data available");
            } // Closing brace for the 'if' block within the .then()
          }) // Closing brace for the .then() callback
          .catch((error) => {
            console.error(error);
          });
      }



      // Function to get and display players from Firebase
      export async function rankData(dataType) {
        console.log(dataType);
        var rankedQueryType=query(usersRef, orderByChild(dataType),limitToLast(20));
        document.getElementById("rankContainer").innerHTML=``;
          get(rankedQueryType).then((snapshot) => {
              if (snapshot.exists()) {
                  try {
                      document.getElementById("rankContainer").innerHTML = ''; // Clear existing list
                      snapshot.forEach((child) => {
                          const rankProfilePhoto = child.val().userDetails.profilePhoto;
                          const rankUsername = child.val().userDetails.username;
                          const rankAura = child.val().userDetails.aura;
                          const rankLikes=child.val().thoughtDetails.thoughtLikes;

                          document.getElementById("rankContainer").innerHTML += 
                          `        
                            <div class="space-y-2 mt-3">
                              <div class="grid grid-cols-6 gap-2 items-center py-2 px-4 bg-blue-200 rounded-lg shadow-md">
                                <div class="text-left">${rankLikes}</div>
                                <div class="text-left flex items-center whitespace-nowrap col-span-3">
                                  <img class="w-8 h-8 rounded-full" src="${rankProfilePhoto}" />
                                  <span class="pl-2">${rankUsername}</span>
                                </div>
                                <div class="text-left">${rankAura}</div>
                                <div class="text-left">${rankLikes}</div>
                              </div>
                            </div>                                           
                          `;
                      }
                       
                    );
                  } catch (error) {
                      console.log(error);
                      document.getElementById("rankContainer").innerHTML += 
                      `<li class="text-red-500">Error loading user data</li>`;
                  }
              } else {
                  document.getElementById("rankContainer").innerHTML += 
                  `<li class="text-red-500">No user data available</li>`;
              }
          }).catch((error) => {
              console.error(error);
              document.getElementById("rankContainer").innerHTML += 
              `<li class="text-red-500">Error fetching data from database</li>`;
          });
      }


