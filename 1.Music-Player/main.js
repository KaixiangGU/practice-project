const container = document.querySelector(".music-player-container");
//image section
const image = container.querySelector(".img-container .img");
//song info section
const songTitle = container.querySelector(".song-info-container .song-title");
const songArtist = container.querySelector(".song-info-container .song-singer");
//progress bar section
const currentTimeUpdate = container.querySelector(".timer-container .current-time");
const durationTimeUpdate = container.querySelector(".timer-container .total-time");
const progressBar = container.querySelector(".progress-container .progress-bar");
const progressContainer = container.querySelector(".progress-container");
const audio = container.querySelector(".progress-container #audio");
//control panel section
const mode = container.querySelector(".control-panel-container #mode");
const list = container.querySelector(".control-panel-container #list");
const playPause = container.querySelector(".control-panel-container #play-pause");
const prev = container.querySelector(".control-panel-container #prev");
const next = container.querySelector(".control-panel-container #next");
//inside music list
const listContainer = container.querySelector(".play-list-container");
const close = container.querySelector("#close");
const ulTag = container.querySelector(".list-wrapper");
const waveContainer = container.querySelectorAll(".wave-container");
let musicIndex = 1; //declare array index

window.addEventListener("load", () => loadMusic(musicIndex));

//page load music
function loadMusic(musicIndex) {
  songTitle.innerText = musicList[musicIndex - 1].name;
  songArtist.innerText = musicList[musicIndex - 1].artist;
  image.src = `images/${musicList[musicIndex - 1].img}.jpg`;
  audio.src = `songs/${musicList[musicIndex - 1].audio}.mp3`;
}

//playMusic when "page load" OR "play btn" OR "next btn" OR "prev btn"
function playMusic() {
  container.classList.add("paused");
  playPause.innerText = "pause_circle";
  image.classList.add("play");
  audio.play();
  showWave(ulTag.childNodes[musicIndex], musicIndex - 1);
}

function pauseMusic() {
  container.classList.remove("paused");
  playPause.innerText = "play_circle";
  image.classList.remove("play");
  audio.pause();
  removeWave();
}

function nextSong() {
  if (mode.innerText == "shuffle") {
    do {
      randomNum = Math.floor(Math.random() * (6 - 1 + 1) + 1);
    } while (randomNum == musicIndex);
    musicIndex = randomNum;
  } else {
    musicIndex++;
  }
  if (musicIndex > musicList.length) musicIndex = 1;
  loadMusic(musicIndex);
  playMusic();
  removeWave();
  showWave(ulTag.childNodes[musicIndex], musicIndex - 1);
}

//go previous song
function prevSong() {
  musicIndex--;
  if (musicIndex < 1) musicIndex = musicList.length;
  loadMusic(musicIndex);
  playMusic();
  removeWave();
  showWave(ulTag.childNodes[musicIndex], musicIndex - 1);
}

function removeWave() {
  //remove current wave and bring back duration time
  for (let i = 0; i < allLiTags.length; i++) {
    const durationRemove = container.querySelector(`#${musicList[i].audio}`);
    if (!allLiTags[i].lastElementChild.classList.contains("hide-wave")) {
      allLiTags[i].lastElementChild.classList.add("hide-wave");
      durationRemove.classList.remove("hide-time");
    }
  }
}

function showWave(element, index) {
  //remove duration add wave effect
  const waveChild = element.lastElementChild;
  const liDurationTag = container.querySelector(`#${musicList[index].audio}`);
  liDurationTag.classList.add("hide-time");
  waveChild.classList.remove("hide-wave");
}

//play pause button listener
playPause.addEventListener("click", () => {
  const isPaused = container.classList.contains("paused");
  isPaused ? pauseMusic() : playMusic();
});

//prgress bar section updating
audio.addEventListener("timeupdate", (e) => {
  //updating progress bar width
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  //updating current time
  let min = Math.floor(currentTime / 60);
  let sec = Math.floor(currentTime % 60);
  if (sec < 10) sec = `0${sec}`;
  currentTimeUpdate.innerText = `${min}:${sec}`;

  //update duration time, use "loadeddata" event to get data at the first frame
  audio.addEventListener("loadeddata", () => {
    const duration = audio.duration;
    let min = Math.floor(duration / 60);
    let sec = Math.floor(duration % 60);
    if (sec < 10) sec = `0${sec}`;
    durationTimeUpdate.innerText = `${min}:${sec}`;
  });
});

//previous and next song
next.addEventListener("click", () => nextSong());
prev.addEventListener("click", () => prevSong());

//updating current time according to mouse pointer
progressContainer.addEventListener("click", (e) => {
  audio.currentTime = (e.offsetX / progressContainer.clientWidth) * audio.duration;
});

//change play mode
mode.addEventListener("click", () => {
  switch (mode.innerText) {
    case "repeat":
      mode.innerText = "repeat_one";
      break;

    case "repeat_one":
      mode.innerText = "shuffle";
      break;

    case "shuffle":
      mode.innerText = "repeat";
      break;
  }
});

//things to do when the song ended
audio.addEventListener("ended", () => {
  switch (mode.innerText) {
    case "repeat":
      nextSong();
      break;

    case "repeat_one":
      audio.currentTime = 0;
      loadMusic(musicIndex);
      playMusic();
      break;

    case "shuffle":
      let randomNum;
      do {
        randomNum = Math.floor(Math.random() * (6 - 1 + 1) + 1);
      } while (randomNum == musicIndex);
      musicIndex = randomNum;
      loadMusic(musicIndex);
      playMusic();
      removeWave();
      showWave(ulTag.childNodes[musicIndex], musicIndex - 1);
      break;
  }
});

//toggling music list
list.addEventListener("click", () => listContainer.classList.add("show"));
//close music list
close.addEventListener("click", () => listContainer.classList.remove("show"));

//create music list according to array
for (let i = 0; i < musicList.length; i++) {
  let liTag = `<li class="row">
                <div class="list-info">
                  <div class="list-title">${musicList[i].name}</div>
                  <div class="list-singer">${musicList[i].artist}</div>
                </div>
                <audio class="${musicList[i].audio}" 
                       src="songs/${musicList[i].audio}.mp3">
                </audio>
                <span id="${musicList[i].audio}"></span>
                <div class="wave-container hide-wave">
                      <span class="wave1"></span>
                      <span class="wave2"></span>
                      <span class="wave3"></span>
                      <span class="wave4"></span>
                      <span class="wave5"></span>
                   </div>
              </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag);
  const liDurationTag = container.querySelector(`#${musicList[i].audio}`);
  const liAduioTag = container.querySelector(`.${musicList[i].audio}`);

  //loaded duration data before playing song
  liAduioTag.addEventListener("loadeddata", () => {
    const duration = liAduioTag.duration;
    let min = Math.floor(duration / 60);
    let sec = Math.floor(duration % 60);
    if (sec < 10) sec = `0${sec}`;
    liDurationTag.innerText = `${min}:${sec}`;
  });
}

//play music on click the music list
const allLiTags = container.querySelectorAll(".row");
console.log(allLiTags);

allLiTags.forEach((element, index) => {
  element.addEventListener("click", () => {
    if (musicIndex == index + 1 && container.classList.contains("paused")) return;
    musicIndex = index + 1;
    loadMusic(musicIndex);
    playMusic();
    removeWave();
    showWave(element, index);
    //remove previous wave and bring back duration
  });
});
