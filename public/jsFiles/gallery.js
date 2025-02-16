// Initialize supabase
const supabaseUrl = 'https://qabrcgzafrzbwrtrezqc.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhYnJjZ3phZnJ6YndydHJlenFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzNTE1MjksImV4cCI6MjA1MTkyNzUyOX0.T7CTt9sVsRIg_zhrUokttmz_FDqeRT4Cocw9vDxqTfM'; // Replace with your Supabase anon key
const supabaseData = supabase.createClient(supabaseUrl, supabaseAnonKey);

// Fetch and display images
async function getImages(bucketName, folderName ) {
    const { data, error } = await supabaseData
        .storage
        .from(bucketName)
        .list(folderName); 
    if (error) {
        console.error("Error listing files:", error.message);
        return;
    }

    const container = document.getElementById('image-container');
    var counter=2; // Creates varied sizes
    const filteredData = data.filter(file => !file.name.startsWith('.')); // Remove files that start with "."

    // Checks if there are any images
    if (filteredData.length === 0) {
        container.innerHTML += `
            <div>
                <p class="">No images yet</p>
            </div>`;
        return;
    }

    // Loop through files and create img elements
    for (const file of filteredData) {
        // Generate public URL for each file
        const { data: publicUrlData, error: urlError } = supabaseData
            .storage
            .from(bucketName)
            .getPublicUrl(`${folderName}/${file.name}`);

        if (urlError) {
            console.error(`Error fetching public URL for ${file.name}:`, urlError.message);
            continue;
        }

        if (counter==2){ // Creates a large image size
            container.innerHTML += `
            <div class="col-span-2 row-span-2">
                <img class="rounded-lg object-cover w-full h-full" src="${publicUrlData.publicUrl}" alt="">
            </div>`;
            counter=0;
        }
        else{ // Creates small image size
            counter++;
            container.innerHTML += `
            <div class="col-span-1 row-span-1">
                <img class="rounded-lg object-cover w-full h-full" src="${publicUrlData.publicUrl}" alt="">
            </div>`;
        }
    }
}

getImages('images', 'cameraPhotos');