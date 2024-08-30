import { XogoApi } from "./api.js";

const api = new XogoApi();
let homeSummary = null;

api
    .get("/home/summary")
    .then(response => {
        console.log('Response:', response); // Inspect the response object
        return response.json();
    })
    .then(result => {
        console.log(result);
        homeSummary = result;
        displayContent();
        
        // Add a listener for window resize events
        window.addEventListener('resize', displayContent);
    })
    .catch(error => {
        console.error('Error:', error);
    });

// Function to display content based on screen size
function displayContent() {
    const isSmallScreen = window.innerWidth < 750; // Define your breakpoint for small screens

    // LIBRARY ASSETS
    let assets = homeSummary.libraryItems.data;
    let rows = '';

    if (isSmallScreen) {
        // Display only the most recent library item
        const mostRecentAsset = assets[0]; // Assuming the first item is the most recent
        const capitalizedTitle = capitalizeFirstLetter(mostRecentAsset.name);

        rows = `<div class='flex flex-col p-4'>
                    <div class='flex'>
                        <img src='${mostRecentAsset.url}' class='w-full h-40 object-cover'>
                    </div>
                    <div class='flex justify-between pt-5 pb-5'>
                        <p class='text-sm font-light truncate'>${capitalizedTitle}</p>
                        <img src="delete-bin-line.png" class="h-4 w-4 cursor-pointer">
                    </div>
                </div>`;
    } else {
        // Display all library items
        assets.forEach(libraryItem => {
            const capitalizedTitle = capitalizeFirstLetter(libraryItem.name);
        
            rows += `<div class='flex flex-col w-full md:w-1/3 lg:w-1/4'>
                        <div class='flex'>
                            <img src='${libraryItem.url}' class='object-cover w-96 h-52 md:h-40 lg:h-80'>
                        </div>
                        <div class='flex justify-between pt-5 pb-5'>
                            <p class='text-sm font-light truncate'>${capitalizedTitle}</p>
                            <img src="delete-bin-line.png" class="h-4 w-4 cursor-pointer">
                        </div>
                    </div>`;
        });
    }
    document.getElementById('lib').innerHTML = rows;

    // PLAYLISTS
    const playlists = homeSummary.playlists.data;
    let allPlaylistsContent = '';

    if (isSmallScreen) {
        // Display only the most recent playlist
        const mostRecentPlaylist = playlists[0]; // Assuming the first playlist is the most recent
        let ply = '';
        const capitalizedTitle = capitalizeFirstLetter(mostRecentPlaylist.name);
        const thumbnailUrls = mostRecentPlaylist.thumbnailUrls;

        thumbnailUrls.forEach((url) => {
            ply += `<div class="border flex flex-col relative">
                        <div class="w-full h-full">
                            <div class="flex flex-col justify-center h-full w-full">
                                <img loading="lazy" src="${url}" class="w-full h-full object-cover">
                            </div> 
                        </div>    
                    </div>`;
        });

        allPlaylistsContent = `<div class='flex flex-col p-4'>
                                    <div class='flex flex-row h-40 md:h-52'>
                                        ${ply}
                                    </div>
                                    <div class='flex justify-between pt-5 pb-5'>
                                        <p class='text-sm font-light truncate'>${capitalizedTitle}</p>
                                        <img src="delete-bin-line.png" class="h-4 w-4 cursor-pointer">
                                    </div>
                                </div>`;
    } else {
        // Display all playlists
        playlists.forEach((playlist) => {
            let ply = '';
            const capitalizedTitle = capitalizeFirstLetter(playlist.name);
            const thumbnailUrls = playlist.thumbnailUrls;

            thumbnailUrls.forEach((url) => {
                ply += `<div class="border flex flex-col w-full md:h-52 md:w-1/3 lg:w-1/4">
                            <div class="w-full h-52">
                                <div class="flex flex-col justify-center h-52 w-40">
                                    <img loading="lazy" src="${url}" class="object-cover w-full h-52 md:h-40">
                                </div> 
                            </div>    
                        </div>`;
            });
            allPlaylistsContent += `<div class="flex flex-col justify-center items-center">
                                            <div class="flex flex-wrap h-52">
                                                ${ply}
                                            </div>
                                            <div class='flex justify-between pt-5 pb-5'>
                                                <p class='text-sm font-light truncate'>${capitalizedTitle}</p>
                                            </div>
                                    </div>`;
        });
    }
    document.getElementById('playli').innerHTML = allPlaylistsContent;

    // PLAYERS
    let players = homeSummary.players.data;
    let lay = '';

    if (isSmallScreen) {
        // Display only the most recent player
        const mostRecentPlayer = players[0]; // Assuming the first player is the most recent
        lay = `<div class="w-full h-full p-5 flex flex-col gap-4">
                    <div class="bg-gray-200 w-full h-40 p-5 flex justify-center items-center">
                        <img src="lap.svg" class="w-full h-32">
                    </div>
                    <div class="flex justify-between p-3">
                        <p class="text-sm font-light">${mostRecentPlayer.name}</p>
                    </div>
                </div>`;
    } else {
        // Display all players
        players.forEach(player => {
            lay += `<div class="w-full h-full md:w-1/4 lg:w-1/5 pb-5">
                        <div class="bg-gray-200 w-full h-52 p-5 flex justify-center items-center">
                            <img src="lap.svg" class="w-80 h-40">
                        </div>
                        <div class="flex justify-between pt-4">
                            <p class="text-sm font-light">${player.name}</p>
                        </div>
                    </div>`;
        });
    }
    document.getElementById('layer').innerHTML = lay;
}

// Capitalize the first letter of the name
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
