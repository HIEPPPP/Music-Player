const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const wrapper = $(".wrapper"),
    musicName = $(".song-details .name"),
    musicArtist = $(".song-details .artist"),
    musicImg = $(".img-area img"),
    mainAudio = $("#main-audio"),
    playPauseBtn = $(".play-pause"),
    prevBtn = $("#prev"),
    nextBtn = $("#next"),
    progressArea = $(".progress-area"),
    progressBar = $(".progress-bar"),
    musicList = $(".music-list"),
    showMoreBtn = $("#more-music"),
    hideMusicBtn = $("#close");

let musicIndex = Math.floor(Math.random() * allMusic.length) + 1;

window.addEventListener("load", () => {
    loadMusic(musicIndex);
    playingSong();
});

// load music function
function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = allMusic[indexNumb - 1].img;
    mainAudio.src = allMusic[indexNumb - 1].src;
}

//play music function
function playMusic() {
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}
//pause music function
function pauseMusic() {
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}

//next music function
function nextMusic() {
    musicIndex++;
    musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

//prev music function
function prevMusic() {
    musicIndex--;
    musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

// play or pause button event
playPauseBtn.addEventListener("click", () => {
    const isMusicPlay = wrapper.classList.contains("paused");
    //if isPlayMusic is true then call pauseMusic else call playMusic
    isMusicPlay ? pauseMusic() : playMusic();
    playingSong();
});
// next music button event
nextBtn.addEventListener("click", () => {
    nextMusic();
});
// prev music button event
prevBtn.addEventListener("click", () => {
    prevMusic();
});

//update progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e) => {
    let musicCurrentTime = $(".current-time"),
        musicDuration = $(".max-duration");
    const currentTime = e.target.currentTime; // getting current time
    const duration = e.target.duration; //getting total duration of music
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    mainAudio.addEventListener("loadeddata", () => {
        let audioDuration = mainAudio.duration; //phai gan gia tri vi duration ban dau tra ve NaN
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });
    //update playing song current time
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) {
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

//let
progressArea.addEventListener("click", (e) => {
    let progressWidthVal = progressArea.clientWidth;
    let clickedOffsetX = e.offsetX; // trả về độ dài
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffsetX / progressWidthVal) * songDuration;
    playMusic();
    playingSong();
});

const repeatBtn = $("#repeat-plist");
repeatBtn.addEventListener("click", () => {
    let getText = repeatBtn.innerText;

    switch (getText) {
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute = ("title", "Song looped");
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute = ("title", "Playback shuffle");
            break;

        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute = ("title", "Song looped");
            break;
    }
});

mainAudio.addEventListener("ended", () => {
    let getText = repeatBtn.innerText;
    switch (getText) {
        case "repeat":
            nextMusic();
            break;
        case "repeat_one":
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle":
            function shuffle() {
                let randIndex = Math.floor(Math.random() * allMusic.length);
                do {
                    randIndex = Math.floor(Math.random() * allMusic.length);
                } while (musicIndex == randIndex);
                musicIndex = randIndex;
                loadMusic(musicIndex);
                playMusic();
            }
            shuffle();
            break;
    }
});

showMoreBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", () => {
    // musicList.classList.remove("show");
    showMoreBtn.click();
});

const ulTag = $("ul");

const html = allMusic.map((music, index) => {
    return `<li data-index=${index} li-index=${index + 1}>
                <div class="row">
                    <span>${allMusic[index].name}</span>
                    <p>${allMusic[index].artist}</p>
                </div>
                <audio class="audio-duration" id="${
                    allMusic[index].src
                }" src="${allMusic[index].src}"></audio>
                <span class="${allMusic[index].src}">3:40</span>
            </li>`;
});

ulTag.innerHTML = html.join(" ");
//play particular song from the list onclick of li tag
function playingSong() {
    const allLiTag = $$("li");
    for (let j = 0; j < allLiTag.length; j++) {
        let audioTag = allLiTag[j].querySelector(".audio-duration");

        if (allLiTag[j].classList.contains("playing")) {
            allLiTag[j].classList.remove("playing");
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration;
        }
        //if the li tag index is equal to the musicIndex then add playing class in it
        if (allLiTag[j].getAttribute("li-index") == musicIndex) {
            allLiTag[j].classList.add("playing");
            audioTag.innerText = "Playing";
        }
        allLiTag[j].setAttribute("onclick", "clicked(this)");
    }
}
//particular li clicked function
function clicked(element) {
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex; //updating current song index with clicked li index
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

// let liAudioDuration = $(`#${allMusic[index].src}}`);
// let liAudioTag = $(`.${allMusic[index].src}}`);

// liAudioTag.addEventListener("loadeddata", () => {
//     let audioDuration = mainAudio.duration; //phai gan gia tri vi duration ban dau tra ve NaN
//     let totalMin = Math.floor(audioDuration / 60);
//     let totalSec = Math.floor(audioDuration % 60);
//     if (totalSec < 10) {
//         totalSec = `0${totalSec}`;
//     }
//     liAudioDuration.innerText = `${totalMin}:${totalSec}`;
// });

// ulTag.onclick = function (e) {
//     const musicNode = e.target.closest("li");
//     musicIndex = Number(musicNode.dataset.index) + 1;
//     loadMusic(musicIndex);
//     playMusic();
// };

// ulTag.addEventListener("change", () => {
//     for (let i = 0; i < liTag.length; i++) {
//         if (liTag[i].classList.contains("active")) {
//             liTag[i].classList.remove("active");
//         }

//         if (liTag[i].getAttribute("li-index") === musicIndex) {
//             liTag[i].classList.add("active");
//         }
//     }
// });
