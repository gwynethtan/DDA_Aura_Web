// Initialize supabase
const supabaseUrl = "https://qabrcgzafrzbwrtrezqc.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhYnJjZ3phZnJ6YndydHJlenFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzNTE1MjksImV4cCI6MjA1MTkyNzUyOX0.T7CTt9sVsRIg_zhrUokttmz_FDqeRT4Cocw9vDxqTfM";
const client = supabase.createClient(supabaseUrl, supabaseAnonKey);
import { insertImage,currentUserId } from "./firebase.js";

document.getElementById("uploadButton").addEventListener("click", () =>uploadFile());

async function uploadFile() {
    const fileInput = document.getElementById('fileInput'); // Get the file element in the HTML 
    const file = fileInput.files[0]; // Get the first file that the user selected 
    if (!file || file.size === 0) {  // If the user did not select a file , there will be an alert
        alert('Please select a file.'); 
        return; 
    } 
      const filePath = `profilePhotos/${currentUserId}`; // Path to store the file in the profilePhoto folder
      
      const { data, error } = await client.storage // Updates the photo image in Supabase for the photo which has the same file path
      .from('images')
      .update(filePath, file, {
        cacheControl: '0',
        upsert: true
      });
    
      if (error) {
        alert("Upload failed:", error);
        return;
      }
      else{
        const publicUrlData = client.storage.from("images").getPublicUrl(filePath);
        const publicUrl = publicUrlData.data.publicUrl;
        insertImage(publicUrl); // Adds photo to database
      }
    
  }
