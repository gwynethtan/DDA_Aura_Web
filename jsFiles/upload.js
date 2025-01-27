const supabaseUrl = "https://qabrcgzafrzbwrtrezqc.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhYnJjZ3phZnJ6YndydHJlenFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzNTE1MjksImV4cCI6MjA1MTkyNzUyOX0.T7CTt9sVsRIg_zhrUokttmz_FDqeRT4Cocw9vDxqTfM";
const client = supabase.createClient(supabaseUrl, supabaseAnonKey);
import { firebaseUpload } from './firebase.js';

document.getElementById("uploadButton").addEventListener("click", uploadFile);

async function uploadFile() {
    // Get the file element in the HTML 
    const fileInput = document.getElementById('fileInput'); 
 
    // Get the first file that the user selected 
    const file = fileInput.files[0]; 
 
    // If the user did NOT select a file 
    if (!file) { 
        alert('Please select a file.'); 
        return; 
    } 
  
    // Make a unique file name by prefixing it with the timestamp 
    const fileName = `${Date.now()}-${file.name}`;

    // Upload the file to Supabase 
    const { data, error } = await client.storage 
        .from('images')// Replace 'images' with your bucket name 
        .upload(fileName, file); 
  
    if (error) {
      alert("Upload failed:", error);
      return;
    }
    const publicUrlData = client.storage.from("images").getPublicUrl(fileName);
    const publicUrl = publicUrlData.data.publicUrl;
    firebaseUpload(publicUrl);
  }
