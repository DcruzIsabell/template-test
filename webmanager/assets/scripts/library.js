import { XogoApi } from "./api.js";

const api = new XogoApi();

function libraryItems(containerId, assets) {
    let container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear the container before rendering new items

    // Update the count div
    let countDiv = document.getElementById('count');
    countDiv.innerHTML = assets.length; // Display total number of assets

    let rows = ''; // To hold the structure for the assets

    // Loop through the assets and create rows with up to 4 items per row
    for (let i = 0; i < assets.length; i += 4) {
        rows += `<div class="flex md:flex-row flex-col w-full gap-3 px-3 py-2">`; // New row

        // Loop for the next 4 items
        for (let j = i; j < i + 4 && j < assets.length; j++) {
            const data = assets[j];
            const capitalizedTitle = capitalizeFirstLetter(data.name);

            if (data.libraryItemType.toLowerCase().includes('widget')) {
                // Widget layout
                let widgetImage = '';
                switch (data.libraryItemType) {
                    case 'WidgetClock':
                        widgetImage = './assets/images/clock.png';
                        break;
                    case 'WidgetTimer':
                        widgetImage = './assets/images/timer.png';
                        break;
                    case 'WidgetNote':
                        widgetImage = './assets/images/note.png';
                        break;
                    case 'WidgetWeather':
                        widgetImage = './assets/images/weather.png';
                        break;
                    default:
                        widgetImage = './assets/images/default-widget.png';
                }

                rows += `<div class='flex flex-col lg:w-1/4 w-full lg:h-72 h-full'>
                            <div class='flex flex-col bg-headline items-center justify-center lg:h-full w-full'>
                                <img src="${widgetImage}" class='h-12 w-12'>
                                <p class='text-white text-xs'>WIDGETS</p>
                            </div>
                            <div class='flex flex-row justify-between pt-3'>
                                <p class='text-sm font-light truncate'>${capitalizedTitle}</p>
                                <img src="./assets/images/delete-bin-line.png" class="h-4 w-4 cursor-pointer">
                            </div>
                        </div>`;
            } else {
                // Normal item layout
                const imageUrl = data.libraryItemType === 'Video' ? data.thumbnailUrl : data.url;

                rows += `<div class="flex flex-col lg:w-1/4 w-full ">
                            <div class="flex-1 bg-blue-100">
                                <img src="${imageUrl}" class='h-full w-full object-cover'>
                            </div>
                            <div class='flex flex-row justify-between pt-3'>
                                <p class='text-sm font-light truncate'>${capitalizedTitle}</p>
                                <img src="./assets/images/delete-bin-line.png" class="h-4 w-4 cursor-pointer">
                            </div>                        
                        </div>`;
            }
        }

        rows += `</div>`; // Close the current row
    }

    container.innerHTML += rows; // Insert rows into the selected container
}

// Example: Call this function when the page is loaded with the fetched assets
function initializeLibrary(assets) {
    libraryItems('containerId', assets); // Load all assets
}

// Example of how to fetch assets and initialize the display
api
    .get("/LibraryItems?skip=0")
    .then(response => {
        return response.json();
    })
    .then(result => {
        const assets = result.data; // Get the data array
        libraryItems('alllib', assets); // Display all assets
    })
    .catch(error => {
        console.error('Error:', error);
    });

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
