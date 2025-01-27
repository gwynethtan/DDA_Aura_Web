const supabaseUrl = "https://qabrcgzafrzbwrtrezqc.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhYnJjZ3phZnJ6YndydHJlenFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzNTE1MjksImV4cCI6MjA1MTkyNzUyOX0.T7CTt9sVsRIg_zhrUokttmz_FDqeRT4Cocw9vDxqTfM";
const client = supabase.createClient(supabaseUrl, supabaseAnonKey);
import { firebaseUpload } from 'jsFiles/firebase.js';

//Define the public url of the image
let publicUrl = "";

// Get the webcam element
const webcam = document.getElementById("webcam");

// When the page is fully loaded, call startWebcam() function

// When the capture button is clicked, call capturePhoto() function
const startWebcamButton = document.getElementById("startWebcamButton");
startWebcamButton.addEventListener("click", startWebcam);

// When the capture button is clicked, call capturePhoto() function
const stopWebcamButton = document.getElementById("stopWebcamButton");
stopWebcamButton.addEventListener("click", stopWebcam);

// When the capture button is clicked, call capturePhoto() function
const captureButton = document.getElementById("captureButton");
captureButton.addEventListener("click", capturePhoto);

// When the upload button is clicked, call firebaseUpload() function
const uploadButton = document.getElementById("uploadButton");
uploadButton.addEventListener("click", () => firebaseUpload(publicUrl));

// Get the canvas element from the HTML
const canvas = document.getElementById("canvas");

// Get the 2D context from the canvas
const context = canvas.getContext("2d");

// Start the webcam
async function startWebcam() {
  try {
    console.log("webcam starting");
    // Asking the browser for a video camera stream
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });

    // Sets the stream to the video element
    webcam.srcObject = stream; // Display webcam feed
  } catch (error) {
    console.error("Error accessing webcam, check permissions:", error);
  }
}

// Stop the webcam
async function stopWebcam() {
  alert("dot");
  console.error("ho");
  
}

// Captures the photo
async function capturePhoto() { 
    context.drawImage(webcam, 0, 0, canvas.width, canvas.height); 
 
    // Convert canvas to a base64 image data 
    const imageData = canvas.toDataURL('image/png'); // Store image as a base64 data URL 
    if (!imageData) { 
        alert("No photo captured!"); 
        return; 
    } 
 
    // Convert bse64 to Blob 
    const blob = await fetch(imageData).then((res) => res.blob()); 
 
    // Create a unique file name 
    // Can use GUID too 
    const fileName = `webcam/${Date.now()}.png`;
 
    try { 
        // Upload to Supabase Storage 
        const { data, error } = await client.storage 
            .from("images") // Replace 'images' with your bucket name 
            .upload(fileName, blob); 
 
        if (error) { 
            throw error; 
        } 
 
        // Get public URL 
        const publicUrlData = client.storage 
            .from("images") // Replace 'images' with your bucket name 
            .getPublicUrl(fileName); 
 
        publicUrl = publicUrlData.data.publicUrl; 
 
        alert("Photo captured");  
        firebaseUpload(publicUrl);
    } catch (error) { 
        console.error('Error uploading photo:', error.message); 
    } 

}



