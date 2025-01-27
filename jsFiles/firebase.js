    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
    import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

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
    

    // Insert image url into firebase
    export async function firebaseUpload(urlUpload)  {
        alert('Upload success. The url is '+urlUpload); 
        const newImageRef = ref(db, 'images/' + Date.now()); // Use a timestamp as a unique ID

        const avatarButton = document.getElementById("avatarButton");
        avatarButton.src = urlUpload; 

        // Set new player data
        set(newImageRef, {
            url: urlUpload
            
        }).catch((error) => {
            console.error("Error adding image:", error);
            alert("Failed to add image into database.");
        });
    };