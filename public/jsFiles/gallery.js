// Initialize Supabase client
const supabaseUrl = 'https://qabrcgzafrzbwrtrezqc.supabase.co'; // Replace with your Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhYnJjZ3phZnJ6YndydHJlenFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzNTE1MjksImV4cCI6MjA1MTkyNzUyOX0.T7CTt9sVsRIg_zhrUokttmz_FDqeRT4Cocw9vDxqTfM'; // Replace with your Supabase anon key
const supabaseData = supabase.createClient(supabaseUrl, supabaseAnonKey);

// Function to fetch and display images
async function listAndDisplayImages(bucketName, folderName ) {
    const { data, error } = await supabaseData
        .storage
        .from(bucketName)
        .list(folderName); 
    if (error) {
        console.error("Error listing files:", error.message);
        return;
    }

    const container = document.getElementById('image-container');
    var counter=2;
    const filteredData = data.filter(file => !file.name.startsWith('.'));

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
        console.error(`Error fetching public URL for ${file.name}:`);


        if (counter==2){
            container.innerHTML += `
            <div class="col-span-2 row-span-2">
                <img class="rounded-lg object-cover w-full h-full" src="${publicUrlData.publicUrl}" alt="">
            </div>`;
            counter=0;
        }
        else{
            counter++;
            container.innerHTML += `
            <div class="col-span-1 row-span-1">
                <img class="rounded-lg object-cover w-full h-full" src="${publicUrlData.publicUrl}" alt="">
            </div>`;
        }
    }
}

listAndDisplayImages('images', 'cameraPhotos');