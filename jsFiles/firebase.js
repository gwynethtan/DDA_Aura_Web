    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
    import { getDatabase,update,onValue,remove,push, ref, get, set,query,limitToFirst,limitToLast,orderByChild,equalTo} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
    import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

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
    var userId="";

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
            userId = user.uid;    
            const detailsRef = ref(db, 'users/' + userId + '/userDetails');
            const thoughtRef = ref(db, 'users/' + userId + '/thoughtDetails');
    
            get(detailsRef)
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const userData = snapshot.val();
                        document.getElementById("accountPhoto").src = `${userData.profilePhoto}`;
                        document.getElementById("accountUsername").textContent = `${userData.username}`;
                        document.getElementById("accountEmail").textContent = `${userData.email}`;
                        document.getElementById("accountAura").textContent = `${userData.aura}`;
                    } else {
                        console.log("No data available for the user.");
                    }
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                });
    
            get(thoughtRef) 
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const thoughtData = snapshot.val();
                        document.getElementById("accountLikes").textContent = `${thoughtData.thoughtLikes} likes`;
                        //document.getElementById("accountThought").textContent = `${thoughtData.thought}`;
                    } else {
                        console.log("No thought data available for the user."); 
                    }
                })
                .catch((error) => {
                    console.error("Error fetching thought data:", error);  
                });
        } 
    });

    export async function updateData(node,data,updatedData) {
        const userRef = ref(db, 'users/' + userId);
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

    export async function deleteAccount() {
        const userRef = ref(db, 'users/' + userId);
    
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


