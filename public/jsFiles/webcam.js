// Initialize supabase
const supabaseUrl = "https://qabrcgzafrzbwrtrezqc.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhYnJjZ3phZnJ6YndydHJlenFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzNTE1MjksImV4cCI6MjA1MTkyNzUyOX0.T7CTt9sVsRIg_zhrUokttmz_FDqeRT4Cocw9vDxqTfM";
const client = supabase.createClient(supabaseUrl, supabaseAnonKey);
import { insertImage,currentUserId } from "./firebase.js";

// Define the public url of the image
let publicUrl = "";

// Get the webcam element
const webcam = document.getElementById("webcam");

// When the webcam button is clicked, call startWebcam() function
const startWebcamButton = document.getElementById("startWebcamButton");
startWebcamButton.addEventListener("click", () =>startWebcam());

// When the stopwebcam button is clicked, call stopWebcamButton() function
const stopWebcamButton = document.getElementById("stopWebcamButton");
stopWebcamButton.addEventListener("click", () =>stopWebcam());

// When the capture button is clicked, call capturePhoto() function
const captureButton = document.getElementById("captureButton");
captureButton.addEventListener("click", () =>capturePhoto());

const canvas = document.createElement("canvas"); // Creates an offscreen canvas
const context = canvas.getContext("2d"); 

// Start the webcam
async function startWebcam() {
  try {
    console.log("webcam starting");
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });// Asking the browser for a video camera stream

    // Sets the stream to the video element
    webcam.srcObject = stream; // Display webcam feed
  } catch (error) {
    console.error("Error accessing webcam, check permissions:", error);
  }
}

// Stops the webcam
async function stopWebcam() {
  alert("dot");  
}

// Captures the photo
async function capturePhoto() { 

  // Set dimensions to match the video feed
  canvas.width = webcam.videoWidth;
  canvas.height = webcam.videoHeight;
  context.drawImage(webcam, 0, 0, canvas.width, canvas.height);
 
    // Convert canvas to a base64 image data 
    const imageData = canvas.toDataURL('image/png'); // Store image as a base64 data URL 
    if (!imageData) { 
        alert("No photo captured!"); 
        return; 
    } 
  
    const blob = await fetch(imageData).then((res) => res.blob()); // Convert bse64 to Blob
 
    const filePath = `profilePhotos/${currentUserId}`; // Path to store the file in the profilePhoto folder
 
    try { 
        // Upload to Supabase Storage       
      const { data, error } = await client.storage // Updates the photo image in Supabase for the photo which has the same file path
      .from('images')
      .update(filePath, blob, {
        cacheControl: '0',
        upsert: true
      });
 
        if (error) { 
            throw error; 
        } 
 
        // Get public URL 
        const publicUrlData = client.storage 
            .from("images") 
            .getPublicUrl(filePath); 
 
        publicUrl = publicUrlData.data.publicUrl; 
        alert("Photo captured");  
        insertImage(publicUrl); // Adds photo to database
    } catch (error) { 
        console.error('Error uploading photo:', error.message); 
    } 
}



