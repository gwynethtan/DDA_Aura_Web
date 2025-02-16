import {initializeApp} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {getDatabase,update,onValue,remove,ref,get,set,query,limitToLast,orderByChild} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import {getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,onAuthStateChanged,signOut,sendPasswordResetEmail,deleteUser} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

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
var currentUserId = "";
export {
    currentUserId
};

// Allows user to sign up
export async function signUp() {
    // Get form input values 
    const username = document.getElementById("signUpUsername").value;
    const email = document.getElementById("signUpEmail").value;
    const password = document.getElementById("signUpPassword").value;

    // Shows error message when input is empty
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

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const newPlayerRef = ref(db, 'users/' + user.uid); // Use UID as a unique identifier
            // Creates user data
            return set(newPlayerRef, {
                aura: 0,
                thoughtLikes: 0,
                userDetails: {
                    username: username,
                    email: email,
                    dateCreated: Math.floor(Date.now() / 1000),
                    userOnline: true,
                    profilePhoto: "https://qabrcgzafrzbwrtrezqc.supabase.co/storage/v1/object/public/images/profilePhotos/default.png",
                },
                imagesTaken: {},
                thoughtDetails: {
                    thought: "",
                    dateWritten: Math.floor(Date.now() / 1000),
                }
            });
        })
        .then(() => {
            alert("Signup successfully!");
            window.location.href = "home.html"; // Go to home page
        })
        .catch((error) => {
            console.log(error);
            const errorCode = error.code;
            // Shows error message for different cases 
            if (errorCode === 'auth/email-already-in-use') {
                alert("The email address is already in use by another account.");
            } else if (errorCode === 'auth/invalid-email') {
                alert("The email address is invalid. Please check the formatting.");
            } else if (errorCode === 'auth/weak-password') {
                alert("The password is too weak. Please choose a stronger password.");
            } else if (errorCode === 'auth/operation-not-allowed') {
                alert("Email/password accounts are not enabled. Sign up for a new account.");
            } else {
                alert("An unexpected error occurred. Please try again.");
            }
        });
};

// Converts the unix time stamp into DD/MM/YY format
function dateConvert(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
    const formattedDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
    });
    return formattedDate;
}

// Allows user to log in
export async function logIn() {
    // Get form input values 
    const email = document.getElementById("logInEmail").value;
    const password = document.getElementById("logInPassword").value;

    // Shows error message when input is empty
    if (email == "") {
        alert("Please enter an email");
        return;
    }

    if (password == "") {
        alert("Please enter a 6-character password");
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("Login successful");
            updateData("userDetails", "userOnline", true); 
            window.location.href = "home.html"; // Go to home page
        })
        .catch((error) => {
            const errorCode = error.code;
            // Shows error message for different cases 
            if (errorCode === 'auth/user-not-found') {
                alert("No user found with this email address.");
            } else if (errorCode === 'auth/wrong-password') {
                alert("Incorrect password. Please try again.");
            } else if (errorCode === 'auth/invalid-email') {
                alert("The email address is invalid. Please check the formatting.");
            } else if (errorCode === 'auth/too-many-requests') {
                alert("Too many failed login attempts. Please try again later.");
            } else {
                alert("An unexpected error occurred. Please try again.");
            }
        });
};

// Allows user to change password when logged in
export async function changePassword() {
    const userRef = ref(db, 'users/' + currentUserId + '/userDetails'); // Get current userRef
    // Shows error message when input is empty      
    if (email == "") {
        alert("Please enter an email");
        return;
    }
    try {
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
            var email = snapshot.val().email;
            updateData("userDetails", "userOnline", false); // Sets the user as offline
            console.log("Fetched email:", email);
        } else {
            console.log("No data available for the user.");
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }

    sendPasswordResetEmail(auth, email)
        .then(() => {
            alert("Password reset email sent. Check your inbox to reset your password.");
            window.location.href = "index.html"; // Go to home page
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            // Shows error message for different cases 
            if (errorCode === 'auth/user-not-found') {
                alert("Email does not exist");
            } else if (errorCode === 'auth/invalid-email') {
                alert("Email is invalid.Check your email formatting");
            } else {
                alert("Error sending password reset email: " + errorMessage);
            }
        });
}


//Allows user to change password when logged in
export async function resetPassword() {
    var email = document.getElementById("forgotPasswordEmail").value; // Get email from input field
    sendPasswordResetEmail(auth, email)
        .then(() => {
            alert("Password reset email sent. Check your inbox to reset your password.");
            window.location.href = "index.html"; // Go to home page
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            // Shows error message for different cases 
            if (errorCode === 'auth/user-not-found') {
                alert("Email does not exist");
            } else if (errorCode === 'auth/invalid-email') {
                alert("Email is invalid.Check your email formatting");
            } else {
                alert("Error sending password reset email: " + errorMessage);
            }
        });
}


// Allows user to log out
export async function logOut() {
    updateData("userDetails", "userOnline", false); // Sets the user as offline
    signOut(auth).then(() => {
        alert("You have been logged out");
        window.location.href = "index.html"; // Go to sign up page
    });
}

// Detects current logged in user and displays user data in profile
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUserId = user.uid;
        // Initialize references
        const rankRef = ref(db, 'users/' + currentUserId);
        const detailsRef = ref(db, 'users/' + currentUserId + '/userDetails');
        const thoughtRef = ref(db, 'users/' + currentUserId + '/thoughtDetails');
        const imageRef = ref(db, 'users/' + currentUserId + '/imagesTaken');

        // Displays aura and thought likes in user profile 
        onValue(rankRef, (snapshot) => {
            if (snapshot.exists()) {
                const rankedData = snapshot.val();
                document.getElementById("accountAura").textContent = `${rankedData.aura} aura`;
                document.getElementById("accountLikes").textContent = `${rankedData.thoughtLikes}`;
            } else {
                console.log("No data available for the user.");
            }
        })

        // Displays user account details in user profile 
        onValue(detailsRef, (snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                var date = dateConvert(userData.dateCreated); //Convert into DD/MM/YY
                document.getElementById("accountPhoto").src = `${userData.profilePhoto}`;
                document.getElementById("accountUsername").textContent = `${userData.username}`;
                document.getElementById("accountEmail").textContent = `${userData.email}`;
                document.getElementById("accountDate").textContent = `${date}`;
            } else {
                console.log("No data available for the user.");
            }
        })

        // Displays user thoughts in user profile     
        onValue(thoughtRef, (snapshot) => {
            if (snapshot.exists()) {
                const thoughtData = snapshot.val();
                if (thoughtData.thought != "") {
                    document.getElementById("accountThought").textContent = `${thoughtData.thought}`;
                }
            } else {
                console.log("No thought data available for the user.");
            }
        })

        // Displays user thoughts in user profile     
        onValue(imageRef, (snapshot) => {
            const galleryGrid = document.getElementById('galleryGrid'); // Gets the entire container that stores images and a design that shows when there are no photos 
            const noImageDesign = document.getElementById('noImageDesign'); // Gets the container that shows a design when there are no photos 
            const image = snapshot.val();
            document.getElementById("selfTakenImagesContainer").innerHTML = ``; // Clears the container that will stores images
            if (image == null) {
                noImageDesign.classList.remove("hidden"); // Shows the design
                const classes = ['col-span-8', 'md:col-span-5', 'grid', 'place-items-center'];
                classes.forEach(cls => galleryGrid.classList.add(cls)); // Edits the class
            } else {
                noImageDesign.classList.add("hidden"); // Hides the design
                const classes = ['col-span-8', 'md:col-span-5', 'grid'];
                classes.forEach(cls => galleryGrid.classList.add(cls)); // Edits the class
                const imageValues = Object.values(image); // Extract only the values which are the image links
                imageValues.forEach(image => {
                    document.getElementById("selfTakenImagesContainer").innerHTML += `              
                    <div>
                        <img class="rounded-lg object-cover" src=${image} alt="Images taken by you"> 
                    </div>`
                });
            }
        });
    }
});

// Updates the user online status
export async function updateUserOnline(currentUserId, node, data, updatedData) {
    const userRef = ref(db, 'users/' + currentUserId);
    const updates = {};
    updates['/' + node + '/' + data] = updatedData;
    update(userRef, updates)
        .then(() => {
            console.log("Data updated successfully!");
        })
        .catch((error) => {
            console.error("Error updating data:", error);
        });
}

// Used to update data that are under a node and sub-node for the current logged in user
export async function updateData(node, data, updatedData) {
    const userRef = ref(db, 'users/' + currentUserId);
    const updates = {};
    updates['/' + node + '/' + data] = updatedData;
    update(userRef, updates)
        .then(() => {
            console.log("Data updated successfully!");
        })
        .catch((error) => {
            console.error("Error updating data:", error);
        });
}

// Used to update ranked data for the current logged in user
export async function updateRankData(data, updatedData) {
    const userRef = ref(db, 'users/' + currentUserId);
    const updates = {};
    updates['/' + data] = updatedData;
    update(userRef, updates)
        .then(() => {
            console.log("Data updated successfully!");
        })
        .catch((error) => {
            console.error("Error updating data:", error);
        });
}

// Used to add data to a node
export async function appendData(node, data, newNode, newValue) {
    const arrayRef = ref(db, 'users/' + currentUserId + '/' + node + '/' + data);
    const newKeyValuePair = {
        [newNode]: newValue
    };
    update(arrayRef, newKeyValuePair)
        .then(() => console.log("Data added successfully"))
        .catch((error) => console.error("Error:", error));
}

// Used to update ranked data for other users
export async function updateUserRankData(userId, data, updatedData) {
    const userRef = ref(db, 'users/' + userId);
    const updates = {};
    updates['/' + data] = updatedData;
    update(userRef, updates)
        .then(() => {
            console.log("Data updated successfully!");
        })
        .catch((error) => {
            console.error("Error updating data:", error);
        });
}

// Deletes the current logged in account
export async function deleteAccount() {
    const userRef = ref(db, 'users/' + currentUserId);
    const authUser = auth.currentUser;

    try {
        // Use Promise.all to run both operations concurrently
        await Promise.all([
            remove(userRef), // Deletes account from the database side
            deleteUser(authUser) // Deletes account from the auth side
        ]);

        console.log("Account has been deleted from both database and auth side");
        alert("Account has been deleted");
        window.location.href = "index.html"; // Go to sign up page
    } catch (error) {
        console.error("Error deleting account:", error);
    }
}


// Deletes data that are under a node and sub-node for the current logged in user
export async function deleteData(node, subNode, data) {
    const deleteRef = ref(db, 'users/' + currentUserId + '/' + node + '/' + subNode + '/' + data);
    remove(deleteRef)
        .then(() => {
            console.log("Data updated successfully!");
        })
        .catch((error) => {
            console.error("Error updating data:", error);
        });
}

// Insert image url into firebase
export async function insertImage(urlUpload) {
    alert('Profile picture has been uploaded');
    const accountPhoto = document.getElementById("accountPhoto");
    accountPhoto.src = urlUpload;
    updateData("userDetails", "profilePhoto", urlUpload);
};

// Displays the user thoughts
export async function loadThoughts() {
    get(ref(db, '/users'))
        .then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                Object.keys(data).forEach(userId => { // Loops through every user to get their data to create thought
                    const userUsername = data[userId]?.userDetails?.username;
                    const userPhoto = data[userId]?.userDetails?.profilePhoto;
                    const userThought = data[userId]?.thoughtDetails?.thought;
                    const userDate = dateConvert(data[userId]?.thoughtDetails?.dateWritten); // Convert into DD/MM/YY
                    const userThoughtLikes = data[userId]?.thoughtLikes;

                    if (userThought != "") { // Allows written thoughts to be displayed only
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
                    loadUserLikedPosts(); // Shows the posts that are liked by the current logged in user
                });

                setTimeout(() => { // Used setTimeout to defer Masonry initialization
                    const grid = document.getElementById('thoughtContainer');

                    // Initialize Masonry
                    const masonry = new Masonry(grid, {
                        itemSelector: '.grid-item',
                        columnWidth: '.grid-item',
                        fitWidth: true,
                        gutter: 5,
                    });
                    masonry.layout();
                    masonry.on('layoutComplete', () => console.log("Masonry layout complete")); // Listen for the layoutComplete event
                }, 0);
            } else {
                console.log("No data available");
            }
        })
        .catch((error) => {
            console.error(error);
        });
}

// Display the posts liked by the current user 
export async function loadUserLikedPosts() {
    const thoughtRef = ref(db, 'users/' + currentUserId + '/thoughtDetails/likedThoughts');
    onValue(thoughtRef, (snapshot) => {
        const posts = snapshot.val();
        const creatorUserIdList = Object.keys(posts); // Extract the creator's userId for the liked post
        creatorUserIdList.forEach(creatorUserId => {
            console.log(creatorUserId);
            const likeButton = document.querySelector(`[data-thought-id="${creatorUserId}"] .likeButton`); // Finding like button of the post liked
            likeButton.src = "./images/heartColored.png"; // Change image to filled heart
        });
    });
}

// Ranks and displays the data 
export async function rankData(dataType) {
    var rankedQueryType = query(usersRef, orderByChild(dataType), limitToLast(50)); // Sorts data for top 50 users 
    document.getElementById("rankContainer").innerHTML = ``; // Clear existing list
    var rankedUsers = []; // Array to store user data

    onValue(rankedQueryType, (snapshot) => {
        if (snapshot.exists()) {
            try {
                snapshot.forEach((child) => {
                    rankedUsers.push(child.val()); // Add user data to the array
                    console.log(child.val());
                });
            } catch (error) {
                console.log(error);
                document.getElementById("rankContainer").innerHTML = `<li class="text-red-500">Error loading user data</li>`;
            }

            console.log(rankedUsers);
            rankedUsers.reverse(); // Reverse the array to show the highest value first

            rankedUsers.forEach((user, index) => {
                const rankNumber = index + 1; // Creates rank number
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
        } else {
            document.getElementById("rankContainer").innerHTML = `<li class="text-red-500">No user data available</li>`;
        }
    })
}

// Shows the charts for user ranked data
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

    // Initializes charts 
    const top5AuraCanvas = document.getElementById("top5AuraCanvas");
    const top5ThoughtLikesCanvas = document.getElementById("top5ThoughtLikesCanvas");
    const auraDistributionCanvas = document.getElementById("auraDistributionCanvas");
    const thoughtLikesDistributionCanvas = document.getElementById("thoughtLikesDistributionCanvas");
    const onlineCanvas = document.getElementById("onlineCanvas");

    // Display bar chart for top 5 aura users
    const top5AuraChart = new Chart(top5AuraCanvas, {
        type: "bar",
        data: {
            labels: [],
            datasets: [{
                label: "Top 5 Player Scores",
                data: []
            }],
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

    // Display bar chart for top 5 thought likes users
    const top5ThoughtLikesChart = new Chart(top5ThoughtLikesCanvas, {
        type: "bar",
        data: {
            labels: [],
            datasets: [{
                label: "Top 5 Thought Likes",
                data: []
            }],
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

    // Display aura distribution for all users
    const auraDistributionChart = new Chart(auraDistributionCanvas, {
        type: "doughnut",
        data: {
            labels: ["0-500 aura", "501-1000 aura", "1001-1500 aura"],
            datasets: [{
                label: "Aura distribution",
                data: [0, 0, 0],
                backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)", "rgb(191, 196, 99)"],
                hoverOffset: 4
            }]
        }
    });
    get(usersRef).then((snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const user = childSnapshot.val();
                const aura = user.aura;
                if (aura <= 500) {
                    usersBelowEqual500Aura++;
                } else if (aura <= 1000) {
                    usersBelowEqual1000Aura++;
                } else {
                    usersBelowEqual1500Aura++;
                }
            });
            auraDistributionChart.data.datasets[0].data = [usersBelowEqual500Aura, usersBelowEqual1000Aura, usersBelowEqual1500Aura];
            auraDistributionChart.update();
        } else {
            console.log("No data available");
            document.getElementById("no-data").innerHTML = "No data available";
        }
    }).catch((error) => {
        console.log("Error fetching data:", error);
    });


    // Display thought likes distribution for all users
    const thoughtLikesDistributionChart = new Chart(thoughtLikesDistributionCanvas, {
        type: "doughnut",
        data: {
            labels: ["0-40 likes", "41-60 likes", "61-100 likes"],
            datasets: [{
                label: "Thought likes distribution",
                data: [0, 0, 0], // Initialize with 0 values
                backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)", "rgb(191, 196, 99)"],
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
            thoughtLikesDistributionChart.data.datasets[0].data = [usersBelowEqual40ThoughtLikes, usersBelowEqual60ThoughtLikes, usersBelowEqual100ThoughtLikes];
            thoughtLikesDistributionChart.update();
        } else {
            console.log("No data available");
            document.getElementById("no-data").innerHTML = "No data available";
        }
    }).catch((error) => {
        console.log("Error fetching data:", error);
    });


    // Display distribution of number of users online
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