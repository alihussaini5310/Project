console.log('Lets write JavaScript');
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

// async function getSongs(folder) {
//     currFolder = folder;
//     let a = await fetch(`/${folder}/`);
//     let response = await a.text();
//     let div = document.createElement("div");
//     div.innerHTML = response;
//     let as = div.getElementsByTagName("a");
//     songs = [];
//     for (let index = 0; index < as.length; index++) {
//         const element = as[index];
//         if (element.href.endsWith(".mp3")) {
//             songs.push(element.href.split(`/${folder}/`)[1]);
//         }
//     }

//     // Show all the songs in the playlist
//     let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
//     songUL.innerHTML = "";
//     for (const song of songs) {
//         songUL.innerHTML += `<li> <img class="invert" width="34" src="img/music.svg" alt="">
//                             <div class="info">
//                                 <div> ${song.replaceAll("%20", " ")}</div>
//                                 <div>Artist : Optimus</div>
//                             </div>
//                             <div class="playnow">
//                                 <span>Play Now</span>
//                                 <img class="invert" src="img/play.svg" alt="">
//                             </div> </li>`;
//     }

//     // Attach an event listener to each song
   
// }
async function getSongs(folder) {
    try {
        currFolder = folder;
        let a = await fetch(`/${folder}/`);
        let response = await a.text();
        let div = document.createElement("div");
        div.innerHTML = response;
        let as = div.getElementsByTagName("a");
        songs = [];
        for (let index = 0; index < as.length; index++) {
            const element = as[index];
            if (element.href.endsWith(".mp3")) {
                songs.push(element.href.split(`/${folder}/`)[1]);
            }
        }
        let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
        songUL.innerHTML = "";
        for (const song of songs) {
            songUL.innerHTML += `<li> <img class="invert" width="34" src="img/music.svg" alt="">
                                <div class="info">
                                    <div> ${song.replaceAll("%20", " ")}</div>
                                    <div>Artist : Optimus</div>
                                </div>
                                <div class="playnow">
                                    <span>Play Now</span>
                                    <img class="invert" src="img/play.svg" alt="">
                                </div> </li>`;
        }
        Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
            e.addEventListener("click", element => {
                playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
            });
        });
        return songs; // Return the songs array after it's populated
    }
     catch (error) {
        console.error('Error fetching songs:', error);
        return []; // Return an empty array in case of error
    }
  
}


const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track;
    if (!pause) {
        currentSong.play();
        play.src = "img/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function displayAlbums() {
    console.log("displaying albums")
    try {
        let a = await fetch(`/songs/`);
        let response = await a.text();
        let div = document.createElement("div");
        div.innerHTML = response;
        let anchors = div.getElementsByTagName("a");
        let cardContainer = document.querySelector(".cardContainer");
        let array = Array.from(anchors);
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
                let folder = e.href.split("/").slice(-2)[0];
                try {
                    // Get the metadata of the folder
                    // let folderInfoResponse = await fetch(`songs/${folder}/info.json`);
                    // if (!folderInfoResponse.ok) {
                    //     console.error(`Failed to fetch info for folder ${folder}: ${folderInfoResponse.status} ${folderInfoResponse.statusText}`);
                    //     continue;
                    // }
                    let folderInfo = await folderInfoResponse.json();
                    cardContainer.innerHTML += ``;
                            
                } catch (error) {
                    // console.error(`Error fetching folder info for ${folder}:`, error);
                }
            }
        }
    } catch (error) {
        console.error('Error fetching albums:', error);
    }

     // Load the playlist whenever card is clicked
     Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
            playMusic(songs[0])

        })
    })
}


async function main() {
    try {
        // Get the list of all the songs
        await getSongs("songs/ncs");
        playMusic(songs[0], true);

        // Display all the albums on the page
        await displayAlbums();

        // Attach event listeners
        // Attach event listener to the play button
document.getElementById("play").addEventListener("click", () => {
    if (currentSong.paused) {
        currentSong.play();
        document.getElementById("play").src = "img/pause.svg"; // Update play button icon
    } else {
        currentSong.pause();
        document.getElementById("play").src = "img/play.svg"; // Update play button icon
    }
});

        currentSong.addEventListener("timeupdate", () => {
            document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
            document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
        });

        document.querySelector(".seekbar").addEventListener("click", e => {
            let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
            document.querySelector(".circle").style.left = percent + "%";
            currentSong.currentTime = (currentSong.duration * percent) / 100;
        });
        // Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    // Add an event listener for close button
     document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })
    


    // Add an event listener to previous
    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    // Add an event listener to next
next.addEventListener("click", () => {
    currentSong.pause();
    console.log("Next clicked");

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if ((index + 1) < songs.length) {
        playMusic(songs[index + 1]);
    }
});


        document.querySelector(".range input").addEventListener("input", e => {
            currentSong.volume = e.target.value / 100;
        });

        document.querySelector(".volume img").addEventListener("click", () => {
            if (currentSong.volume === 0) {
                currentSong.volume = 0.1;
                document.querySelector(".range input").value = 10;
                document.querySelector(".volume img").src = "img/volume.svg";
            } else {
                currentSong.volume = 0;
                document.querySelector(".range input").value = 0;
                document.querySelector(".volume img").src = "img/mute.svg";
            }
        });
    } catch (error) {
        console.error("Error in main:", error);
    }
}
    
main();