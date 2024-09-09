import { XogoApi } from "./api.js";

const api = new XogoApi();

// Function to display the library items
function libraryItems(containerId, assets) {
    console.log(assets);
    let container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear the container

    let rows = '<div class="flex md:flex-wrap md:flex-row flex-col  pl-3 gap-3 mr-3">'; // Flex container for items

    assets.forEach(data => {
        const capitalizedTitle = capitalizeFirstLetter(data.name);
        let imageUrl;
        if (data.libraryItemType === 'Video' || 
            data.libraryItemType === 'WidgetTimer' || 
            data.libraryItemType === 'WidgetClock' || 
            data.libraryItemType === 'WidgetNote') {
            // Use thumbnailUrl for Video, WidgetTimer, WidgetClock, and WidgetNote
            imageUrl = data.thumbnailUrl;
        } else {
            // Use the regular URL for other types
            imageUrl = data.url;
        }


        rows += `<div class='lg:w-80 w-full lg:h-48 md:h-96 h-52 my-4'>
                    <div class='flex flex-col h-full'>
                        <div class='flex flex-col md:flex-row w-full h-full '>
                            <img src="${imageUrl}" class='lg:w-80 md:w-full w-full lg:h-48 md:h-96 h-48 object-cover'>
                        </div>
                        <div class='flex flex-row justify-between py-3 lg:pb-10'>
                            <p class='text-sm font-light truncate'>${capitalizedTitle}</p>
                            <img src="./assets/images/delete-bin-line.png" class="h-4 w-4 cursor-pointer">
                        </div>
                    </div>
                </div>`;
    });

    rows += '</div>'; // Close the flex-wrap container
    container.innerHTML = rows; // Insert rows into the selected container
}

// Function to handle tab selection
function handleTabSelection(tab, assets) {
    // Hide all sections
    document.getElementById('alllib').style.display = 'none';
    document.getElementById('images').style.display = 'none';
    document.getElementById('videos').style.display = 'none';
    document.getElementById('links').style.display = 'none';
    document.getElementById('widgets').style.display = 'none';

    let filteredAssets = [];

    if (tab === 'All') {
        filteredAssets = assets;
        document.getElementById('alllib').style.display = 'flex'; // Show all section
        libraryItems('alllib', filteredAssets); // Render assets into #alllib
    } else if (tab === 'Image') {
        filteredAssets = assets.filter(item => item.libraryItemType === 'Image');
        document.getElementById('images').style.display = 'flex'; // Show images section
        libraryItems('images', filteredAssets); // Render images into #images
    } else if (tab === 'Video') {
        filteredAssets = assets.filter(item => item.libraryItemType === 'Video');
        document.getElementById('videos').style.display = 'flex'; // Show videos section
        libraryItems('videos', filteredAssets); // Render videos into #videos
    } else if (tab === 'URL') {
        filteredAssets = assets.filter(item => item.libraryItemType === 'URL');
        document.getElementById('links').style.display = 'flex'; // Show URLs section
        libraryItems('links', filteredAssets); // Render URLs into #links
    } else if (tab === 'Widget') {
        // Filter assets where 'Widget' is anywhere in the libraryItemType string
        filteredAssets = assets.filter(item => item.libraryItemType.includes('Widget'));
        document.getElementById('widgets').style.display = 'flex'; // Show widgets section
        libraryItems('widgets', filteredAssets); // Render widgets into #widgets
    }
    
}

// Helper function to capitalize the first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Fetch data and set up event listeners
api
    .get("/LibraryItems?skip=0")
    .then(response => {
        console.log('Response:', response); // Inspect the response object
        return response.json();
    })
    .then(result => {
        console.log(result);
        const assets = result.data; // Get the data array
        handleTabSelection('All', assets); // Display all assets by default

        // Add event listeners for buttons
        document.getElementById('all').addEventListener('click', function() {
            handleTabSelection('All', assets);
        });

        document.getElementById('imgs').addEventListener('click', function() {
            handleTabSelection('Image', assets);
        });

        document.getElementById('vido').addEventListener('click', function() {
            handleTabSelection('Video', assets);
        });

        document.getElementById('web').addEventListener('click', function() {
            handleTabSelection('URL', assets);
        });

        document.getElementById('wids').addEventListener('click', function() {
            handleTabSelection('Widget', assets);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
